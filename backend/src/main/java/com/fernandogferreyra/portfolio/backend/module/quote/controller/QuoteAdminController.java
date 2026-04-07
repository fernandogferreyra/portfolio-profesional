package com.fernandogferreyra.portfolio.backend.module.quote.controller;

import com.fernandogferreyra.portfolio.backend.domain.dto.ApiResponse;
import com.fernandogferreyra.portfolio.backend.module.quote.domain.dto.QuoteAdminDetailResponse;
import com.fernandogferreyra.portfolio.backend.module.quote.domain.dto.QuoteAdminSummaryResponse;
import com.fernandogferreyra.portfolio.backend.module.quote.service.QuoteService;
import com.fernandogferreyra.portfolio.backend.util.ApiPaths;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiPaths.API_BASE + "/admin/quotes")
@RequiredArgsConstructor
public class QuoteAdminController {

    private final QuoteService quoteService;

    @GetMapping
    public ApiResponse<List<QuoteAdminSummaryResponse>> listQuotes() {
        return ApiResponse.success("Quotes retrieved", quoteService.getQuotes());
    }

    @GetMapping("/{id}")
    public ApiResponse<QuoteAdminDetailResponse> getQuote(@PathVariable UUID id) {
        return ApiResponse.success("Quote retrieved", quoteService.getQuoteById(id));
    }
}
