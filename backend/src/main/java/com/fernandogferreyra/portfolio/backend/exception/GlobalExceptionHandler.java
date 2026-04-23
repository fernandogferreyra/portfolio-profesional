package com.fernandogferreyra.portfolio.backend.exception;

import com.fernandogferreyra.portfolio.backend.dto.ApiFieldError;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiErrorResponse handleValidation(MethodArgumentNotValidException exception, HttpServletRequest request) {
        List<ApiFieldError> errors = exception.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(this::toApiFieldError)
            .toList();

        return ApiErrorResponse.of("Validation failed", "VALIDATION_ERROR", request.getRequestURI(), errors);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiErrorResponse handleConstraintViolation(ConstraintViolationException exception, HttpServletRequest request) {
        List<ApiFieldError> errors = exception.getConstraintViolations()
            .stream()
            .map(violation -> new ApiFieldError(violation.getPropertyPath().toString(), violation.getMessage()))
            .toList();

        return ApiErrorResponse.of("Validation failed", "VALIDATION_ERROR", request.getRequestURI(), errors);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiErrorResponse handleMessageNotReadable(HttpMessageNotReadableException exception, HttpServletRequest request) {
        return ApiErrorResponse.of(
            "Malformed request body",
            "MALFORMED_REQUEST",
            request.getRequestURI(),
            List.of());
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiErrorResponse> handleResponseStatus(ResponseStatusException exception, HttpServletRequest request) {
        String code = exception.getStatusCode().value() == HttpStatus.UNAUTHORIZED.value()
            ? "UNAUTHORIZED"
            : "REQUEST_ERROR";
        String message = exception.getReason() != null ? exception.getReason() : "Request failed";

        return ResponseEntity.status(exception.getStatusCode())
            .body(ApiErrorResponse.of(message, code, request.getRequestURI(), List.of()));
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiErrorResponse handleUnexpected(Exception exception, HttpServletRequest request) {
        log.error("Unhandled exception for path={}", request.getRequestURI(), exception);
        return ApiErrorResponse.of(
            "Unexpected server error",
            "INTERNAL_SERVER_ERROR",
            request.getRequestURI(),
            List.of());
    }

    private ApiFieldError toApiFieldError(FieldError error) {
        return new ApiFieldError(error.getField(), error.getDefaultMessage());
    }
}
