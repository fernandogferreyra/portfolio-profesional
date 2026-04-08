package com.fernandogferreyra.portfolio.backend.service;

import com.fernandogferreyra.portfolio.backend.dto.quote.QuoteRequest;
import com.fernandogferreyra.portfolio.backend.dto.quote.QuoteAdminDetailResponse;
import com.fernandogferreyra.portfolio.backend.dto.quote.QuoteAdminSummaryResponse;
import com.fernandogferreyra.portfolio.backend.dto.quote.QuoteResult;
import java.util.List;
import java.util.UUID;

public interface QuoteService {

    QuoteResult previewQuote(QuoteRequest request);

    QuoteResult generateQuote(QuoteRequest request);

    List<QuoteAdminSummaryResponse> getQuotes();

    QuoteAdminDetailResponse getQuoteById(UUID quoteId);
}
