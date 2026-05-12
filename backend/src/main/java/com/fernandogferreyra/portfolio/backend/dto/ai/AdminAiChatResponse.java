package com.fernandogferreyra.portfolio.backend.dto.ai;

public record AdminAiChatResponse(
    String reply,
    String provider,
    String model
) {
}
