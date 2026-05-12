package com.fernandogferreyra.portfolio.backend.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fernandogferreyra.portfolio.backend.config.MistralAiProperties;
import com.fernandogferreyra.portfolio.backend.dto.ai.AdminAiChatRequest;
import com.fernandogferreyra.portfolio.backend.dto.ai.AdminAiChatResponse;
import com.fernandogferreyra.portfolio.backend.dto.ai.AdminAiTranslateRequest;
import com.fernandogferreyra.portfolio.backend.dto.ai.AdminAiTranslateResponse;
import com.fernandogferreyra.portfolio.backend.service.AdminAiService;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminAiServiceImpl implements AdminAiService {

    private static final String PROVIDER = "mistral";

    private final MistralAiProperties mistralAiProperties;
    private final ObjectMapper objectMapper;

    @Override
    public AdminAiTranslateResponse translate(AdminAiTranslateRequest request) {
        String systemPrompt = "You are a professional translator for a bilingual software portfolio. "
            + "Return only the translated text. Preserve technical terms, URLs, product names, list structure, and tone. "
            + "Do not add explanations.";
        String userPrompt = "Translate from " + request.sourceLanguage() + " to " + request.targetLanguage() + ".\n"
            + "Context: " + safeText(request.context()) + "\n"
            + "Text:\n" + request.text().trim();

        String translatedText = callMistral(systemPrompt, userPrompt);
        return new AdminAiTranslateResponse(
            translatedText,
            request.sourceLanguage(),
            request.targetLanguage(),
            PROVIDER,
            mistralAiProperties.getModel());
    }

    @Override
    public AdminAiChatResponse chat(AdminAiChatRequest request) {
        String systemPrompt = "You are the private admin assistant for Fernando Ferreyra's professional portfolio. "
            + "Answer in Spanish unless the user asks otherwise. Be concise, practical, and ask for confirmation before destructive actions. "
            + "You can draft changes, but you must not claim that data was saved unless the backend explicitly did it.";
        String userPrompt = "Context: " + safeText(request.context()) + "\nMessage:\n" + request.message().trim();

        return new AdminAiChatResponse(callMistral(systemPrompt, userPrompt), PROVIDER, mistralAiProperties.getModel());
    }

    private String callMistral(String systemPrompt, String userPrompt) {
        ensureConfigured();

        try {
            Map<String, Object> payload = Map.of(
                "model", mistralAiProperties.getModel(),
                "temperature", 0.2,
                "messages", List.of(
                    Map.of("role", "system", "content", systemPrompt),
                    Map.of("role", "user", "content", userPrompt)));

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(mistralAiProperties.getUrl()))
                .timeout(Duration.ofSeconds(Math.max(1, mistralAiProperties.getTimeoutSeconds())))
                .header("Authorization", "Bearer " + mistralAiProperties.getApiKey())
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(payload)))
                .build();

            HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                log.warn("Mistral API returned status={}", response.statusCode());
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "AI provider request failed");
            }

            JsonNode content = objectMapper.readTree(response.body())
                .path("choices")
                .path(0)
                .path("message")
                .path("content");

            if (content.isMissingNode() || content.asText().isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "AI provider returned an empty response");
            }

            return content.asText().trim();
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (Exception exception) {
            log.warn("Mistral API call failed", exception);
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "AI provider is not available");
        }
    }

    private void ensureConfigured() {
        if (!mistralAiProperties.isEnabled() || mistralAiProperties.getApiKey() == null || mistralAiProperties.getApiKey().isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "AI provider is not configured");
        }
    }

    private String safeText(String value) {
        return value == null || value.isBlank() ? "No extra context" : value.trim();
    }
}
