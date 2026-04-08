package com.fernandogferreyra.portfolio.backend.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.engine.BudgetBuilderPipeline;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.BudgetCalculationResult;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.BudgetProject;
import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model.ConfigurationSnapshot;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetPreviewRequest;
import com.fernandogferreyra.portfolio.backend.dto.budgetbuilder.BudgetPreviewResponse;
import com.fernandogferreyra.portfolio.backend.mapper.budgetbuilder.BudgetBuilderRequestMapper;
import com.fernandogferreyra.portfolio.backend.mapper.budgetbuilder.BudgetBuilderResponseMapper;
import com.fernandogferreyra.portfolio.backend.service.BudgetBuilderService;
import com.fernandogferreyra.portfolio.backend.service.BudgetConfigurationService;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BudgetBuilderServiceImpl implements BudgetBuilderService {

    private final BudgetConfigurationService budgetConfigurationService;
    private final BudgetBuilderRequestMapper budgetBuilderRequestMapper;
    private final BudgetBuilderResponseMapper budgetBuilderResponseMapper;
    private final BudgetBuilderPipeline budgetBuilderPipeline;
    private final ObjectMapper objectMapper;

    @Override
    public BudgetPreviewResponse preview(BudgetPreviewRequest request) {
        ConfigurationSnapshot configuration = resolveConfiguration(request);
        BudgetProject project = budgetBuilderRequestMapper.toProject(request);
        BudgetCalculationResult result = budgetBuilderPipeline.run(project, configuration);
        String previewHash = calculatePreviewHash(request, configuration, result);

        return budgetBuilderResponseMapper.toPreviewResponse(result, configuration.id(), previewHash);
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
            new ConfigurationSnapshot.HourlyRateConfig(
                request.hourlyRateOverride(),
                baseConfiguration.hourlyRate().supportHourlyRate(),
                baseConfiguration.hourlyRate().extraHourRate()
            ),
            baseConfiguration.commercialMultiplier(),
            baseConfiguration.minimumBudget(),
            baseConfiguration.roundingRules(),
            baseConfiguration.moduleCatalog(),
            baseConfiguration.technologyCatalog(),
            baseConfiguration.surchargeRules(),
            baseConfiguration.supportRules(),
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

    private record PreviewHashPayload(
        BudgetPreviewRequest request,
        String configurationSnapshotId,
        java.math.BigDecimal totalHours,
        java.math.BigDecimal finalOneTimeTotal,
        java.math.BigDecimal finalMonthlyTotal
    ) {
    }
}
