package com.fernandogferreyra.portfolio.backend.domain.contact.entity;

import com.fernandogferreyra.portfolio.backend.domain.entity.BaseEntity;
import com.fernandogferreyra.portfolio.backend.domain.enums.ContactMessageStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "contact_messages")
public class ContactMessage extends BaseEntity {

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, length = 180)
    private String email;

    @Column(nullable = false, length = 160)
    private String subject;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(length = 120)
    private String source;

    @Column(length = 160)
    private String context;

    @Column(length = 16)
    private String language;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(name = "submitted_at")
    private java.time.OffsetDateTime submittedAt;

    @Column(name = "reply_message", columnDefinition = "TEXT")
    private String replyMessage;

    @Column(name = "replied_at")
    private java.time.OffsetDateTime repliedAt;

    @Column(name = "replied_by", length = 120)
    private String repliedBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private ContactMessageStatus status;
}
