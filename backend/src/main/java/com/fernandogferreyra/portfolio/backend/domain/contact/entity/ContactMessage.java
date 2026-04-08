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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private ContactMessageStatus status;
}
