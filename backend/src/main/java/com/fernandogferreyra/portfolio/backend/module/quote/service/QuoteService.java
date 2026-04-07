package com.fernandogferreyra.portfolio.backend.module.quote.service;

import com.fernandogferreyra.portfolio.backend.module.quote.domain.dto.QuoteRequest;
import com.fernandogferreyra.portfolio.backend.module.quote.domain.dto.QuoteAdminDetailResponse;
import com.fernandogferreyra.portfolio.backend.module.quote.domain.dto.QuoteAdminSummaryResponse;
import com.fernandogferreyra.portfolio.backend.module.quote.domain.dto.QuoteResult;
import java.util.List;
import java.util.UUID;

public interface QuoteService {

    QuoteResult generateQuote(QuoteRequest request);

    List<QuoteAdminSummaryResponse> getQuotes();

    QuoteAdminDetailResponse getQuoteById(UUID quoteId);
}
