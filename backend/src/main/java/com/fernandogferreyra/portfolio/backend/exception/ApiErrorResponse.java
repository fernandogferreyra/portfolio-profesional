package com.fernandogferreyra.portfolio.backend.exception;

import com.fernandogferreyra.portfolio.backend.domain.dto.ApiFieldError;
import java.time.OffsetDateTime;
import java.util.List;

public record ApiErrorResponse(
    boolean success,
    String message,
    String code,
    String path,
    List<ApiFieldError> errors,
    OffsetDateTime timestamp
) {

    public static ApiErrorResponse of(String message, String code, String path, List<ApiFieldError> errors) {
        return new ApiErrorResponse(false, message, code, path, errors, OffsetDateTime.now());
    }
}

