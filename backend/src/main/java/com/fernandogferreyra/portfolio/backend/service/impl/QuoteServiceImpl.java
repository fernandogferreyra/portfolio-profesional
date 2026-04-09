package com.fernandogferreyra.portfolio.backend.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fernandogferreyra.portfolio.backend.config.QuoteEngineProperties;
import com.fernandogferreyra.portfolio.backend.dto.quote.QuoteAdminDetailResponse;
import com.fernandogferreyra.portfolio.backend.dto.quote.QuoteAdminSummaryResponse;
import com.fernandogferreyra.portfolio.backend.dto.quote.QuoteItem;
import com.fernandogferreyra.portfolio.backend.dto.quote.QuoteRequest;
import com.fernandogferreyra.portfolio.backend.dto.quote.QuoteResult;
import com.fernandogferreyra.portfolio.backend.domain.quote.entity.QuoteEntity;
import com.fernandogferreyra.portfolio.backend.domain.quote.enums.QuoteComplexity;
import com.fernandogferreyra.portfolio.backend.repository.quote.QuoteRepository;
import com.fernandogferreyra.portfolio.backend.service.QuoteService;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Slf4j
@RequiredArgsConstructor
public class QuoteServiceImpl implements QuoteService {

    private static final int MONEY_SCALE = 2;

    private final QuoteEngineProperties quoteEngineProperties;
    private final QuoteRepository quoteRepository;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional(readOnly = true)
    public QuoteResult previewQuote(QuoteRequest request) {
        return calculateQuote(request);
    }

    @Override
    @Transactional
    public QuoteResult generateQuote(QuoteRequest request) {
        QuoteResult quoteResult = calculateQuote(request);
        quoteRepository.save(toEntity(request, quoteResult));
        return quoteResult;
    }

    private QuoteResult calculateQuote(QuoteRequest request) {
        QuoteEngineProperties.ProjectTypeRule projectTypeRule = resolveProjectType(request.projectType());
        BigDecimal complexityMultiplier = resolveComplexityMultiplier(request.complexity());
        BigDecimal hourlyRate = scaleMoney(quoteEngineProperties.getHourlyRate());

        List<QuoteItem> items = new ArrayList<>();
        Set<String> seenModules = new HashSet<>();

        for (String requestedModule : request.modules()) {
            String moduleKey = normalizeKey(requestedModule);
            if (!seenModules.add(moduleKey)) {
                throw badRequest("Duplicate module: " + moduleKey);
            }

            QuoteEngineProperties.ModuleRule moduleRule = resolveModule(moduleKey);
            BigDecimal moduleBaseHours = resolveModuleBaseHours(moduleRule);
            BigDecimal moduleHours = moduleBaseHours
                .multiply(projectTypeRule.getMultiplier())
                .multiply(complexityMultiplier);

            if (projectTypeRule.isSaas() && moduleRule.isSaasEligible()) {
                moduleHours = moduleHours.multiply(quoteEngineProperties.getSaasModuleMultiplier());
            }

            moduleHours = scaleMoney(moduleHours);
            BigDecimal moduleCost = scaleMoney(moduleHours.multiply(hourlyRate));

            items.add(new QuoteItem(
                moduleRule.getLabel(),
                moduleHours,
                moduleCost,
                scaleMoney(moduleRule.getOptimisticHours()),
                scaleMoney(moduleRule.getProbableHours()),
                scaleMoney(moduleRule.getPessimisticHours()),
                List.copyOf(moduleRule.getDependencyIds()),
                moduleRule.getDependencyNote()
            ));
        }

        BigDecimal baseHours = items.stream()
            .map(QuoteItem::hours)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal riskBufferHours = items.isEmpty()
            ? BigDecimal.ZERO
            : scaleMoney(quoteEngineProperties.getRiskBufferHours());
        BigDecimal totalHours = scaleMoney(baseHours.add(riskBufferHours));
        BigDecimal totalWeeks = scaleMoney(totalHours.divide(BigDecimal.valueOf(32), 2, RoundingMode.HALF_UP));
        BigDecimal totalCost = scaleMoney(totalHours.multiply(hourlyRate));

        QuoteResult quoteResult = new QuoteResult(
            normalizeKey(request.projectType()),
            projectTypeRule.getLabel(),
            request.complexity(),
            scaleMoney(baseHours),
            riskBufferHours,
            scaleMoney(totalHours),
            totalWeeks,
            scaleMoney(totalCost),
            hourlyRate,
            items,
            List.of(
                "PERT is applied from optimistic, probable, and pessimistic estimates when available.",
                "A fixed risk buffer is added once per estimate to reflect delivery uncertainty."
            ));

        return quoteResult;
    }

    private BigDecimal resolveModuleBaseHours(QuoteEngineProperties.ModuleRule moduleRule) {
        BigDecimal optimistic = moduleRule.getOptimisticHours();
        BigDecimal probable = moduleRule.getProbableHours();
        BigDecimal pessimistic = moduleRule.getPessimisticHours();

        if (optimistic != null && probable != null && pessimistic != null
            && optimistic.signum() > 0 && probable.signum() > 0 && pessimistic.signum() > 0) {
            return optimistic
                .add(probable.multiply(BigDecimal.valueOf(4)))
                .add(pessimistic)
                .divide(BigDecimal.valueOf(6), 4, RoundingMode.HALF_UP);
        }

        return moduleRule.getBaseHours();
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuoteAdminSummaryResponse> getQuotes() {
        return quoteRepository.findAllByOrderByCreatedAtDesc()
            .stream()
            .map(this::toSummaryResponse)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public QuoteAdminDetailResponse getQuoteById(UUID quoteId) {
        QuoteEntity quoteEntity = quoteRepository.findById(quoteId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Quote not found"));

        return toDetailResponse(quoteEntity);
    }

    private QuoteEngineProperties.ProjectTypeRule resolveProjectType(String projectType) {
        QuoteEngineProperties.ProjectTypeRule projectTypeRule =
            quoteEngineProperties.getProjectTypes().get(normalizeKey(projectType));

        if (projectTypeRule == null) {
            throw badRequest("Unsupported project type: " + projectType);
        }

        return projectTypeRule;
    }

    private QuoteEngineProperties.ModuleRule resolveModule(String moduleKey) {
        QuoteEngineProperties.ModuleRule moduleRule = quoteEngineProperties.getModules().get(moduleKey);
        if (moduleRule == null) {
            throw badRequest("Unsupported module: " + moduleKey);
        }

        return moduleRule;
    }

    private BigDecimal resolveComplexityMultiplier(QuoteComplexity complexity) {
        BigDecimal multiplier = quoteEngineProperties.getComplexityMultipliers().get(complexity);
        if (multiplier == null) {
            throw badRequest("Unsupported complexity: " + complexity);
        }

        return multiplier;
    }

    private String normalizeKey(String rawValue) {
        return rawValue.trim()
            .toUpperCase(Locale.ROOT)
            .replace('-', '_')
            .replace(' ', '_');
    }

    private BigDecimal scaleMoney(BigDecimal value) {
        return value.setScale(MONEY_SCALE, RoundingMode.HALF_UP);
    }

    private QuoteEntity toEntity(QuoteRequest request, QuoteResult quoteResult) {
        QuoteEntity quoteEntity = new QuoteEntity();
        quoteEntity.setProjectType(quoteResult.projectType());
        quoteEntity.setComplexity(quoteResult.complexity());
        quoteEntity.setTotalHours(quoteResult.totalHours());
        quoteEntity.setTotalCost(quoteResult.totalCost());
        quoteEntity.setHourlyRate(quoteResult.hourlyRate());
        quoteEntity.setRequestJson(writeJson(request));
        quoteEntity.setResultJson(writeJson(quoteResult));
        return quoteEntity;
    }

    private QuoteAdminSummaryResponse toSummaryResponse(QuoteEntity quoteEntity) {
        return new QuoteAdminSummaryResponse(
            quoteEntity.getId(),
            quoteEntity.getProjectType(),
            quoteEntity.getComplexity(),
            quoteEntity.getTotalHours(),
            quoteEntity.getTotalCost(),
            quoteEntity.getHourlyRate(),
            quoteEntity.getCreatedAt());
    }

    private QuoteAdminDetailResponse toDetailResponse(QuoteEntity quoteEntity) {
        return new QuoteAdminDetailResponse(
            quoteEntity.getId(),
            quoteEntity.getProjectType(),
            quoteEntity.getComplexity(),
            quoteEntity.getTotalHours(),
            quoteEntity.getTotalCost(),
            quoteEntity.getHourlyRate(),
            quoteEntity.getCreatedAt(),
            readJson(quoteEntity.getRequestJson()),
            readJson(quoteEntity.getResultJson()));
    }

    private String writeJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException exception) {
            log.warn("Unable to serialize quote payload", exception);
            return null;
        }
    }

    private JsonNode readJson(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        try {
            return objectMapper.readTree(value);
        } catch (JsonProcessingException exception) {
            log.warn("Unable to deserialize stored quote payload", exception);
            return null;
        }
    }

    private ResponseStatusException badRequest(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }
}
