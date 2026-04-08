package com.fernandogferreyra.portfolio.backend.controller.admin;

import com.fernandogferreyra.portfolio.backend.dto.ApiResponse;
import com.fernandogferreyra.portfolio.backend.dto.quote.QuoteAdminDetailResponse;
import com.fernandogferreyra.portfolio.backend.dto.quote.QuoteAdminSummaryResponse;
import com.fernandogferreyra.portfolio.backend.dto.quote.QuoteRequest;
import com.fernandogferreyra.portfolio.backend.dto.quote.QuoteResult;
import com.fernandogferreyra.portfolio.backend.service.QuoteService;
import jakarta.validation.Valid;
import com.fernandogferreyra.portfolio.backend.util.ApiPaths;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiPaths.API_BASE + "/admin/quotes")
@RequiredArgsConstructor
public class QuoteAdminController {

    private final QuoteService quoteService;

    @PostMapping("/preview")
    public ApiResponse<QuoteResult> previewQuote(@Valid @RequestBody QuoteRequest request) {
        return ApiResponse.success("Quote preview generated successfully", quoteService.previewQuote(request));
    }

    @GetMapping
    public ApiResponse<List<QuoteAdminSummaryResponse>> listQuotes() {
        return ApiResponse.success("Quotes retrieved", quoteService.getQuotes());
    }

    @GetMapping("/{id}")
    public ApiResponse<QuoteAdminDetailResponse> getQuote(@PathVariable UUID id) {
        return ApiResponse.success("Quote retrieved", quoteService.getQuoteById(id));
    }
}
