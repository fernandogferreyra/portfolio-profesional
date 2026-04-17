package com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.entity;

import com.fernandogferreyra.portfolio.backend.domain.budgetbuilder.enums.BudgetPricingMode;
import com.fernandogferreyra.portfolio.backend.domain.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "budget_snapshots")
@Getter
@Setter
public class BudgetSnapshotEntity extends BaseEntity {

    @Column(name = "budget_name", nullable = false, length = 160)
    private String budgetName;

    @Column(name = "client", nullable = false, length = 160)
    private String client;

    @Column(name = "project_type", nullable = false, length = 80)
    private String projectType;

    @Enumerated(EnumType.STRING)
    @Column(name = "pricing_mode", nullable = false, length = 20)
    private BudgetPricingMode pricingMode;

    @Column(name = "desired_stack_id", nullable = false, length = 80)
    private String desiredStackId;

    @Column(name = "configuration_snapshot_id", nullable = false, length = 120)
    private String configurationSnapshotId;

    @Column(name = "preview_hash", nullable = false, length = 128)
    private String previewHash;

    @Column(name = "total_hours", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalHours;

    @Column(name = "final_one_time_total", nullable = false, precision = 14, scale = 2)
    private BigDecimal finalOneTimeTotal;

    @Column(name = "final_monthly_total", nullable = false, precision = 14, scale = 2)
    private BigDecimal finalMonthlyTotal;

    @Column(name = "currency", nullable = false, length = 12)
    private String currency;

    @Column(name = "request_json", columnDefinition = "TEXT")
    private String requestJson;

    @Column(name = "result_json", columnDefinition = "TEXT")
    private String resultJson;
}
