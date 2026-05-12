package com.fernandogferreyra.portfolio.backend.service;

import com.fernandogferreyra.portfolio.backend.dto.ai.AdminAiChatRequest;
import com.fernandogferreyra.portfolio.backend.dto.ai.AdminAiChatResponse;
import com.fernandogferreyra.portfolio.backend.dto.ai.AdminAiTranslateRequest;
import com.fernandogferreyra.portfolio.backend.dto.ai.AdminAiTranslateResponse;

public interface AdminAiService {

    AdminAiTranslateResponse translate(AdminAiTranslateRequest request);

    AdminAiChatResponse chat(AdminAiChatRequest request);
}
