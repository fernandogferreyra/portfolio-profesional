package com.fernandogferreyra.portfolio.backend.mapper.contact;

import com.fernandogferreyra.portfolio.backend.domain.enums.ContactMessageStatus;
import com.fernandogferreyra.portfolio.backend.dto.contact.ContactMessageAdminDetailResponse;
import com.fernandogferreyra.portfolio.backend.dto.contact.ContactMessageAdminSummaryResponse;
import com.fernandogferreyra.portfolio.backend.dto.contact.ContactRequest;
import com.fernandogferreyra.portfolio.backend.dto.contact.ContactResponse;
import com.fernandogferreyra.portfolio.backend.domain.contact.entity.ContactMessage;
import java.util.Locale;
import org.springframework.stereotype.Component;

@Component
public class ContactMessageMapper {

    private static final String DEFAULT_SUBJECT = "Portfolio contact";
    private static final int MESSAGE_PREVIEW_MAX_LENGTH = 140;

    public ContactMessage toEntity(ContactRequest request) {
        ContactMessage entity = new ContactMessage();
        entity.setName(request.name().trim());
        entity.setEmail(request.email().trim().toLowerCase(Locale.ROOT));
        entity.setSubject(resolveSubject(request.subject()));
        entity.setMessage(request.message().trim());
        entity.setSource(trimToNull(request.source()));
        entity.setContext(trimToNull(request.context()));
        entity.setLanguage(trimToNull(request.language()));
        entity.setUserAgent(trimToNull(request.userAgent()));
        entity.setSubmittedAt(request.submittedAt());
        entity.setStatus(ContactMessageStatus.NEW);
        return entity;
    }

    public ContactResponse toResponse(ContactMessage entity) {
        if (entity.getId() == null || entity.getCreatedAt() == null) {
            throw new IllegalStateException("Contact message must be persisted before creating a response");
        }

        return new ContactResponse(entity.getId(), entity.getCreatedAt());
    }

    public ContactMessageAdminSummaryResponse toAdminSummary(ContactMessage entity) {
        return new ContactMessageAdminSummaryResponse(
            entity.getId(),
            entity.getName(),
            entity.getEmail(),
            entity.getSubject(),
            buildMessagePreview(entity.getMessage()),
            entity.getStatus(),
            entity.getLanguage(),
            entity.getContext(),
            entity.getCreatedAt(),
            entity.getRepliedAt()
        );
    }

    public ContactMessageAdminDetailResponse toAdminDetail(ContactMessage entity) {
        return new ContactMessageAdminDetailResponse(
            entity.getId(),
            entity.getName(),
            entity.getEmail(),
            entity.getSubject(),
            entity.getMessage(),
            entity.getStatus(),
            entity.getSource(),
            entity.getContext(),
            entity.getLanguage(),
            entity.getUserAgent(),
            entity.getSubmittedAt(),
            entity.getReplyMessage(),
            entity.getRepliedAt(),
            entity.getRepliedBy(),
            entity.getCreatedAt(),
            entity.getUpdatedAt()
        );
    }

    private String resolveSubject(String subject) {
        if (subject == null || subject.isBlank()) {
            return DEFAULT_SUBJECT;
        }

        return subject.trim();
    }

    private String trimToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private String buildMessagePreview(String message) {
        if (message == null || message.isBlank()) {
            return "";
        }

        String normalized = message.trim().replaceAll("\\s+", " ");
        if (normalized.length() <= MESSAGE_PREVIEW_MAX_LENGTH) {
            return normalized;
        }

        return normalized.substring(0, MESSAGE_PREVIEW_MAX_LENGTH - 1).trim() + "…";
    }
}
