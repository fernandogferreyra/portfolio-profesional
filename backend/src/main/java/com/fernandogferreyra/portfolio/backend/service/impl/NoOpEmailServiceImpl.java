package com.fernandogferreyra.portfolio.backend.service.impl;

import com.fernandogferreyra.portfolio.backend.service.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@Service
@Primary
@ConditionalOnProperty(prefix = "app.contact.mail", name = "provider", havingValue = "noop", matchIfMissing = true)
@Slf4j
public class NoOpEmailServiceImpl implements EmailService {

    @Override
    public void send(EmailMessage message) {
        log.info("Email delivery skipped. to={} subject={}", message.to(), message.subject());
    }
}
