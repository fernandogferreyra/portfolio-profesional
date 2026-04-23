package com.fernandogferreyra.portfolio.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.contact.mail")
public record ContactMailProperties(
    boolean enabled,
    String provider,
    String inboxAddress,
    String fromAddress,
    String autoReplySubjectEs,
    String autoReplySubjectEn,
    String autoReplySignature,
    String resendApiKey,
    String resendBaseUrl
) {
}
