package com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.model;

import java.math.BigDecimal;
import java.util.List;

public record TechnicalEstimate(
    String id,
    String projectId,
    String configurationSnapshotId,
    List<EstimateModule> modules,
    BigDecimal totalHours,
    BigDecimal totalWeeks,
    BigDecimal complexityScore,
    BigDecimal riskBufferHours,
    BigDecimal coordinationBufferHours,
    List<String> assumptions,
    List<String> exclusions,
    String generatedAt
) {
}
