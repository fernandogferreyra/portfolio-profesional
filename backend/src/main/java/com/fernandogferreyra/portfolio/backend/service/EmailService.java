package com.fernandogferreyra.portfolio.backend.service;

public interface EmailService {

    void send(EmailMessage message);

    record EmailMessage(
        String to,
        String replyTo,
        String subject,
        String body
    ) {
    }
}
