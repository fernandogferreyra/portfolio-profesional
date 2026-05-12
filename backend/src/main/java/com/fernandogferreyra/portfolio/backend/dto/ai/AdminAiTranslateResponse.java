package com.fernandogferreyra.portfolio.backend.dto.ai;

public record AdminAiTranslateResponse(
    String translatedText,
    String sourceLanguage,
    String targetLanguage,
    String provider,
    String model
) {
}
