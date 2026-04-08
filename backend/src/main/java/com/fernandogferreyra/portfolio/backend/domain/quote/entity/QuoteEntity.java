package com.fernandogferreyra.portfolio.backend.domain.quote.entity;

import com.fernandogferreyra.portfolio.backend.domain.entity.BaseEntity;
import com.fernandogferreyra.portfolio.backend.domain.quote.enums.QuoteComplexity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "quotes")
@Getter
@Setter
public class QuoteEntity extends BaseEntity {

    @Column(name = "project_type", nullable = false, length = 80)
    private String projectType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private QuoteComplexity complexity;

    @Column(name = "total_hours", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalHours;

    @Column(name = "total_cost", nullable = false, precision = 14, scale = 2)
    private BigDecimal totalCost;

    @Column(name = "hourly_rate", nullable = false, precision = 10, scale = 2)
    private BigDecimal hourlyRate;

    @Column(name = "request_json", columnDefinition = "TEXT")
    private String requestJson;

    @Column(name = "result_json", columnDefinition = "TEXT")
    private String resultJson;
}
