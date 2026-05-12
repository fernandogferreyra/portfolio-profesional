package com.fernandogferreyra.portfolio.backend.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "app.ai.mistral")
public class MistralAiProperties {

    private boolean enabled = false;
    private String url = "https://api.mistral.ai/v1/chat/completions";
    private String apiKey = "";
    private String model = "mistral-small-latest";
    private int timeoutSeconds = 20;
}
