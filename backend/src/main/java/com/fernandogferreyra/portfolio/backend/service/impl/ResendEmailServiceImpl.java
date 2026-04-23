package com.fernandogferreyra.portfolio.backend.service.impl;

import com.fernandogferreyra.portfolio.backend.config.ContactMailProperties;
import com.fernandogferreyra.portfolio.backend.service.EmailService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "app.contact.mail", name = "provider", havingValue = "resend")
public class ResendEmailServiceImpl implements EmailService {

    private final RestClient.Builder restClientBuilder;
    private final ContactMailProperties contactMailProperties;

    @Override
    public void send(EmailMessage message) {
        if (!contactMailProperties.enabled()) {
            return;
        }

        if (contactMailProperties.resendApiKey() == null || contactMailProperties.resendApiKey().isBlank()) {
            throw new IllegalStateException("PORTFOLIO_RESEND_API_KEY is required when app.contact.mail.provider=resend");
        }

        ResendEmailRequest payload = new ResendEmailRequest(
            contactMailProperties.fromAddress(),
            List.of(message.to()),
            message.subject(),
            message.body(),
            message.replyTo() == null || message.replyTo().isBlank() ? null : List.of(message.replyTo())
        );

        try {
            restClientBuilder
                .baseUrl(contactMailProperties.resendBaseUrl())
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + contactMailProperties.resendApiKey())
                .build()
                .post()
                .uri("/emails")
                .contentType(MediaType.APPLICATION_JSON)
                .body(payload)
                .retrieve()
                .toBodilessEntity();
        } catch (RestClientResponseException exception) {
            throw new ResponseStatusException(
                HttpStatus.BAD_GATEWAY,
                "Email provider rejected the request",
                exception
            );
        } catch (RestClientException exception) {
            throw new ResponseStatusException(
                HttpStatus.BAD_GATEWAY,
                "Email provider request failed",
                exception
            );
        }
    }

    private record ResendEmailRequest(
        String from,
        List<String> to,
        String subject,
        String text,
        List<String> reply_to
    ) {
    }
}
