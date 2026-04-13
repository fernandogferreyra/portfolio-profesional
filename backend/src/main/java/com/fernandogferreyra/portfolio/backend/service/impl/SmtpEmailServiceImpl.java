package com.fernandogferreyra.portfolio.backend.service.impl;

import com.fernandogferreyra.portfolio.backend.config.ContactMailProperties;
import com.fernandogferreyra.portfolio.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "app.contact.mail", name = "provider", havingValue = "smtp")
public class SmtpEmailServiceImpl implements EmailService {

    private final JavaMailSender javaMailSender;
    private final ContactMailProperties contactMailProperties;

    @Override
    public void send(EmailMessage message) {
        if (!contactMailProperties.enabled()) {
            return;
        }

        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(message.to());
        mailMessage.setSubject(message.subject());
        mailMessage.setText(message.body());
        mailMessage.setFrom(contactMailProperties.fromAddress());

        if (message.replyTo() != null && !message.replyTo().isBlank()) {
            mailMessage.setReplyTo(message.replyTo());
        }

        javaMailSender.send(mailMessage);
    }
}
