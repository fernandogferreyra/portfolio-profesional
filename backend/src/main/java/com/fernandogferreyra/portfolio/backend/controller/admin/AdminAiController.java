package com.fernandogferreyra.portfolio.backend.controller.admin;

import com.fernandogferreyra.portfolio.backend.dto.ApiResponse;
import com.fernandogferreyra.portfolio.backend.dto.ai.AdminAiChatRequest;
import com.fernandogferreyra.portfolio.backend.dto.ai.AdminAiChatResponse;
import com.fernandogferreyra.portfolio.backend.dto.ai.AdminAiTranslateRequest;
import com.fernandogferreyra.portfolio.backend.dto.ai.AdminAiTranslateResponse;
import com.fernandogferreyra.portfolio.backend.service.AdminAiService;
import com.fernandogferreyra.portfolio.backend.util.ApiPaths;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiPaths.API_BASE + "/admin/ai")
@RequiredArgsConstructor
public class AdminAiController {

    private final AdminAiService adminAiService;

    @PostMapping("/translate")
    public ApiResponse<AdminAiTranslateResponse> translate(@Valid @RequestBody AdminAiTranslateRequest request) {
        return ApiResponse.success("AI translation generated", adminAiService.translate(request));
    }

    @PostMapping("/chat")
    public ApiResponse<AdminAiChatResponse> chat(@Valid @RequestBody AdminAiChatRequest request) {
        return ApiResponse.success("AI reply generated", adminAiService.chat(request));
    }
}
