package com.fernandogferreyra.portfolio.backend.module.contact.mapper;

import com.fernandogferreyra.portfolio.backend.domain.enums.ContactMessageStatus;
import com.fernandogferreyra.portfolio.backend.module.contact.domain.dto.ContactRequest;
import com.fernandogferreyra.portfolio.backend.module.contact.domain.dto.ContactResponse;
import com.fernandogferreyra.portfolio.backend.module.contact.domain.entity.ContactMessage;
import java.time.Clock;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class ContactMessageMapper {

    public ContactMessage toEntity(ContactRequest request) {
        ContactMessage entity = new ContactMessage();
        entity.setName(request.name().trim());
        entity.setEmail(request.email().trim().toLowerCase());
        entity.setSubject(request.subject().trim());
        entity.setMessage(request.message().trim());
        entity.setStatus(ContactMessageStatus.NEW);
        return entity;
    }

    public ContactResponse toResponse(ContactMessage entity, Clock clock) {
        UUID id = entity.getId() != null ? entity.getId() : UUID.randomUUID();
        OffsetDateTime receivedAt = entity.getCreatedAt() != null
            ? entity.getCreatedAt()
            : OffsetDateTime.now(clock);

        return new ContactResponse(
            id,
            entity.getStatus(),
            "Message received and stored successfully",
            receivedAt);
    }
}
