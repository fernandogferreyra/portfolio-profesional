package com.fernandogferreyra.portfolio.backend.module.contact.mapper;

import com.fernandogferreyra.portfolio.backend.domain.enums.ContactMessageStatus;
import com.fernandogferreyra.portfolio.backend.module.contact.domain.dto.ContactRequest;
import com.fernandogferreyra.portfolio.backend.module.contact.domain.dto.ContactResponse;
import com.fernandogferreyra.portfolio.backend.module.contact.domain.entity.ContactMessage;
import java.util.Locale;
import org.springframework.stereotype.Component;

@Component
public class ContactMessageMapper {

    private static final String DEFAULT_SUBJECT = "Portfolio contact";

    public ContactMessage toEntity(ContactRequest request) {
        ContactMessage entity = new ContactMessage();
        entity.setName(request.name().trim());
        entity.setEmail(request.email().trim().toLowerCase(Locale.ROOT));
        entity.setSubject(resolveSubject(request.subject()));
        entity.setMessage(request.message().trim());
        entity.setStatus(ContactMessageStatus.NEW);
        return entity;
    }

    public ContactResponse toResponse(ContactMessage entity) {
        if (entity.getId() == null || entity.getCreatedAt() == null) {
            throw new IllegalStateException("Contact message must be persisted before creating a response");
        }

        return new ContactResponse(entity.getId(), entity.getCreatedAt());
    }

    private String resolveSubject(String subject) {
        if (subject == null || subject.isBlank()) {
            return DEFAULT_SUBJECT;
        }

        return subject.trim();
    }
}
