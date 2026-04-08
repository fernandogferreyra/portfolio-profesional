package com.fernandogferreyra.portfolio.backend.dto.quote;

import com.fernandogferreyra.portfolio.backend.domain.quote.enums.QuoteComplexity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record QuoteRequest(
    @NotBlank(message = "Project type is required")
    String projectType,

    @NotEmpty(message = "At least one module is required")
    List<@NotBlank(message = "Module code is required") String> modules,

    @NotNull(message = "Complexity is required")
    QuoteComplexity complexity
) {
}
