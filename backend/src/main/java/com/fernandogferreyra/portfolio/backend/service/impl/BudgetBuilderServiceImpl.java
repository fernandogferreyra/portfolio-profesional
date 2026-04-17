package com.fernandogferreyra.portfolio.backend.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.engine.BudgetBuilderPipeline;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.entity.BudgetSnapshotEntity;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.BudgetCalculationResult;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.BudgetProject;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.ConfigurationSnapshot;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetAdminDetailResponse;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetAdminSummaryResponse;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetConfigurationResponse;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetPreviewRequest;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetPreviewResponse;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetSaveRequest;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetSaveResponse;
import com.fernandogferreyra.portfolio.backend.mapper.budgetbuilder.BudgetBuilderRequestMapper;
import com.fernandogferreyra.portfolio.backend.mapper.budgetbuilder.BudgetBuilderResponseMapper;
import com.fernandogferreyra.portfolio.backend.repository.budgetbuilder.BudgetSnapshotRepository;
import com.fernandogferreyra.portfolio.backend.service.BudgetBuilderService;
import com.fernandogferreyra.portfolio.backend.service.BudgetConfigurationService;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.List;
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
public class BudgetBuilderServiceImpl implements BudgetBuilderService {

    private final BudgetConfigurationService budgetConfigurationService;
    private final BudgetBuilderRequestMapper budgetBuilderRequestMapper;
    private final BudgetBuilderResponseMapper budgetBuilderResponseMapper;
    private final BudgetBuilderPipeline budgetBuilderPipeline;
    private final BudgetSnapshotRepository budgetSnapshotRepository;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional(readOnly = true)
    public BudgetPreviewResponse preview(BudgetPreviewRequest request) {
        return calculatePreview(request).response();
    }

    @Override
    @Transactional
    public BudgetSaveResponse save(BudgetSaveRequest request) {
        CalculatedPreview calculatedPreview = calculatePreview(request.input());

        if (!calculatedPreview.configuration().id().equals(request.expectedConfigurationSnapshotId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Budget configuration changed before save");
        }

        if (!calculatedPreview.previewHash().equals(request.expectedPreviewHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Budget preview changed before save");
        }

        BudgetSnapshotEntity entity = toEntity(request.input(), calculatedPreview);
        budgetSnapshotRepository.save(entity);

        return new BudgetSaveResponse(
            entity.getId(),
            entity.getBudgetName(),
            entity.getConfigurationSnapshotId(),
            entity.getFinalOneTimeTotal(),
            entity.getFinalMonthlyTotal(),
            entity.getCreatedAt()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<BudgetAdminSummaryResponse> getBudgets() {
        return budgetSnapshotRepository.findAllByOrderByCreatedAtDesc()
            .stream()
            .map(this::toSummaryResponse)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BudgetAdminDetailResponse getBudgetById(UUID budgetId) {
        BudgetSnapshotEntity entity = budgetSnapshotRepository.findById(budgetId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Budget not found"));

        return toDetailResponse(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public BudgetConfigurationResponse getActiveConfiguration() {
        ConfigurationSnapshot configuration = budgetConfigurationService.getActiveConfiguration();

        return new BudgetConfigurationResponse(
            configuration.id(),
            configuration.version(),
            configuration.source(),
            configuration.currency(),
            configuration.createdAt(),
            configuration.workingHoursPerWeek(),
            configuration.hourlyRate().base(),
            configuration.hourlyRate().supportHourlyRate(),
            configuration.hourlyRate().extraHourRate(),
            configuration.riskBufferHours(),
            configuration.projectTypeDefaults().stream()
                .map(rule -> new BudgetConfigurationResponse.ProjectTypeDefaultResponse(
                    rule.projectType(),
                    rule.label(),
                    rule.description(),
                    rule.defaultModuleIds(),
                    rule.defaultSurchargeRuleIds(),
                    rule.defaultSupportRuleId(),
                    rule.defaultMaintenanceRuleId()
                ))
                .toList(),
            configuration.moduleCatalog().stream()
                .map(module -> new BudgetConfigurationResponse.ModuleCatalogItemResponse(
                    module.id(),
                    module.category(),
                    module.name(),
                    module.description(),
                    module.baseHours(),
                    module.optimisticHours(),
                    module.probableHours(),
                    module.pessimisticHours(),
                    module.dependencyIds(),
                    module.blockingNote(),
                    module.optional()
                ))
                .toList(),
            configuration.categoryRules().stream()
                .map(rule -> new BudgetConfigurationResponse.CategoryRuleResponse(
                    rule.id(),
                    rule.label(),
                    rule.billingType(),
                    rule.rate(),
                    rule.cadence()
                ))
                .toList(),
            configuration.technologyCatalog().stream()
                .map(technology -> new BudgetConfigurationResponse.TechnologyOptionResponse(
                    technology.id(),
                    technology.label(),
                    technology.description(),
                    technology.surchargeRuleId(),
                    technology.supportedProjectTypes()
                ))
                .toList(),
            configuration.surchargeRules().stream()
                .map(rule -> new BudgetConfigurationResponse.SurchargeRuleResponse(
                    rule.id(),
                    rule.code(),
                    rule.label(),
                    rule.reason(),
                    rule.mode(),
                    rule.appliesTo(),
                    rule.value(),
                    rule.enabledByDefault()
                ))
                .toList(),
            configuration.supportRules().stream()
                .map(rule -> new BudgetConfigurationResponse.SupportPlanResponse(
                    rule.id(),
                    rule.label(),
                    rule.cadence(),
                    rule.includedHours(),
                    rule.hourlyRate(),
                    rule.monthlyAmount()
                ))
                .toList(),
            configuration.maintenanceRules().stream()
                .map(rule -> new BudgetConfigurationResponse.MaintenancePlanResponse(
                    rule.id(),
                    rule.label(),
                    rule.cadence(),
                    rule.monthlyAmount()
                ))
                .toList(),
            configuration.userScaleRules().stream()
                .map(rule -> new BudgetConfigurationResponse.UserScaleTierResponse(
                    rule.id(),
                    rule.label(),
                    rule.minUsers(),
                    rule.maxUsers(),
                    rule.mode(),
                    rule.value()
                ))
                .toList(),
            List.copyOf(configuration.complexityMultipliers().keySet())
        );
    }

    private CalculatedPreview calculatePreview(BudgetPreviewRequest request) {
        ConfigurationSnapshot configuration = resolveConfiguration(request);
        BudgetProject project = budgetBuilderRequestMapper.toProject(request);
        BudgetCalculationResult result = budgetBuilderPipeline.run(project, configuration);
        String previewHash = calculatePreviewHash(request, configuration, result);
        BudgetPreviewResponse response = budgetBuilderResponseMapper.toPreviewResponse(
            result,
            configuration,
            configuration.id(),
            previewHash
        );

        return new CalculatedPreview(configuration, result, previewHash, response);
    }

    private ConfigurationSnapshot resolveConfiguration(BudgetPreviewRequest request) {
        ConfigurationSnapshot baseConfiguration = budgetConfigurationService.getActiveConfiguration();

        if (request.hourlyRateOverride() == null) {
            return baseConfiguration;
        }

        return new ConfigurationSnapshot(
            baseConfiguration.id(),
            baseConfiguration.version(),
            baseConfiguration.source(),
            baseConfiguration.currency(),
            baseConfiguration.createdAt(),
            baseConfiguration.workingHoursPerWeek(),
            baseConfiguration.riskBufferHours(),
            new ConfigurationSnapshot.HourlyRateConfig(
                request.hourlyRateOverride(),
                baseConfiguration.hourlyRate().supportHourlyRate(),
                baseConfiguration.hourlyRate().extraHourRate()
            ),
            baseConfiguration.commercialMultiplier(),
            baseConfiguration.minimumBudget(),
            baseConfiguration.roundingRules(),
            baseConfiguration.moduleCatalog(),
            baseConfiguration.categoryRules().stream()
                .map(rule -> rule.billingType() == com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.CategoryBillingType.TIME_BASED
                    ? new ConfigurationSnapshot.CategoryRule(
                        rule.id(),
                        rule.label(),
                        rule.billingType(),
                        request.hourlyRateOverride(),
                        rule.cadence()
                    )
                    : rule)
                .toList(),
            baseConfiguration.technologyCatalog(),
            baseConfiguration.surchargeRules(),
            baseConfiguration.supportRules(),
            baseConfiguration.maintenanceRules(),
            baseConfiguration.userScaleRules(),
            baseConfiguration.saasPricing(),
            baseConfiguration.projectTypeDefaults(),
            baseConfiguration.projectMultipliers(),
            baseConfiguration.stackMultipliers(),
            baseConfiguration.complexityMultipliers()
        );
    }

    private String calculatePreviewHash(
        BudgetPreviewRequest request,
        ConfigurationSnapshot configuration,
        BudgetCalculationResult result
    ) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            String payload = objectMapper.writeValueAsString(new PreviewHashPayload(
                request,
                configuration.id(),
                result.technicalEstimate().totalHours(),
                result.commercialBudget().finalOneTimeTotal(),
                result.commercialBudget().finalMonthlyTotal()
            ));
            return HexFormat.of().formatHex(digest.digest(payload.getBytes(StandardCharsets.UTF_8)));
        } catch (JsonProcessingException | NoSuchAlgorithmException exception) {
            throw new IllegalStateException("Unable to generate preview hash", exception);
        }
    }

    private BudgetSnapshotEntity toEntity(BudgetPreviewRequest request, CalculatedPreview preview) {
        BudgetSnapshotEntity entity = new BudgetSnapshotEntity();
        entity.setBudgetName(request.budgetName().trim());
        entity.setClient(request.client().trim());
        entity.setProjectType(request.projectType());
        entity.setPricingMode(request.pricingMode());
        entity.setDesiredStackId(request.desiredStackId());
        entity.setConfigurationSnapshotId(preview.configuration().id());
        entity.setPreviewHash(preview.previewHash());
        entity.setTotalHours(preview.result().technicalEstimate().totalHours());
        entity.setFinalOneTimeTotal(preview.result().commercialBudget().finalOneTimeTotal());
        entity.setFinalMonthlyTotal(preview.result().commercialBudget().finalMonthlyTotal());
        entity.setCurrency(preview.result().commercialBudget().currency());
        entity.setRequestJson(writeJson(request));
        entity.setResultJson(writeJson(preview.response()));
        return entity;
    }

    private BudgetAdminSummaryResponse toSummaryResponse(BudgetSnapshotEntity entity) {
        return new BudgetAdminSummaryResponse(
            entity.getId(),
            entity.getBudgetName(),
            entity.getClient(),
            entity.getProjectType(),
            entity.getPricingMode(),
            entity.getDesiredStackId(),
            entity.getTotalHours(),
            entity.getFinalOneTimeTotal(),
            entity.getFinalMonthlyTotal(),
            entity.getCurrency(),
            entity.getCreatedAt()
        );
    }

    private BudgetAdminDetailResponse toDetailResponse(BudgetSnapshotEntity entity) {
        return new BudgetAdminDetailResponse(
            entity.getId(),
            entity.getBudgetName(),
            entity.getClient(),
            entity.getProjectType(),
            entity.getPricingMode(),
            entity.getDesiredStackId(),
            entity.getConfigurationSnapshotId(),
            entity.getPreviewHash(),
            entity.getTotalHours(),
            entity.getFinalOneTimeTotal(),
            entity.getFinalMonthlyTotal(),
            entity.getCurrency(),
            entity.getCreatedAt(),
            readJson(entity.getRequestJson()),
            readJson(entity.getResultJson())
        );
    }

    private String writeJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException exception) {
            log.warn("Unable to serialize budget payload", exception);
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
            log.warn("Unable to deserialize stored budget payload", exception);
            return null;
        }
    }

    private record PreviewHashPayload(
        BudgetPreviewRequest request,
        String configurationSnapshotId,
        java.math.BigDecimal totalHours,
        java.math.BigDecimal finalOneTimeTotal,
        java.math.BigDecimal finalMonthlyTotal
    ) {
    }

    private record CalculatedPreview(
        ConfigurationSnapshot configuration,
        BudgetCalculationResult result,
        String previewHash,
        BudgetPreviewResponse response
    ) {
    }
}
