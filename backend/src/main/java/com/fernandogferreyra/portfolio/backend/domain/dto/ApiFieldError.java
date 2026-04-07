package com.fernandogferreyra.portfolio.backend.domain.dto;

public record ApiFieldError(
    String field,
    String message
) {
}

