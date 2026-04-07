package com.fernandogferreyra.portfolio.backend.module.analytics.domain.entity;

import com.fernandogferreyra.portfolio.backend.domain.entity.BaseEntity;
import com.fernandogferreyra.portfolio.backend.domain.enums.EventType;
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
@Table(name = "event_logs")
public class EventLog extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false, length = 60)
    private EventType eventType;

    @Column(length = 120)
    private String source;

    @Column(name = "metadata_json", columnDefinition = "TEXT")
    private String metadataJson;
}
