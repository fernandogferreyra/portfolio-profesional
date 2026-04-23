package com.fernandogferreyra.portfolio.backend.dto.budgetbuilder;

import java.math.BigDecimal;
import java.util.List;

public record AreaBreakdownDto(
    String areaId,
    String label,
    BigDecimal totalHours,
    BigDecimal baseAmount,
    int moduleCount,
    BigDecimal shareOfTechnicalTotal,
    List<AreaModuleDto> modules
) {
}
