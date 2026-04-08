package com.fernandogferreyra.portfolio.backend.controller;

import com.fernandogferreyra.portfolio.backend.dto.ApiResponse;
import com.fernandogferreyra.portfolio.backend.dto.quote.QuoteRequest;
import com.fernandogferreyra.portfolio.backend.dto.quote.QuoteResult;
import com.fernandogferreyra.portfolio.backend.service.QuoteService;
import com.fernandogferreyra.portfolio.backend.util.ApiPaths;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiPaths.API_BASE)
@RequiredArgsConstructor
public class QuoteController {

    private final QuoteService quoteService;

    @PostMapping("/quote")
    public ApiResponse<QuoteResult> generateQuote(@Valid @RequestBody QuoteRequest request) {
        return ApiResponse.success("Quote generated successfully", quoteService.generateQuote(request));
    }
}
