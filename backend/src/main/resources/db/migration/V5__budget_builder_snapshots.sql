CREATE TABLE IF NOT EXISTS budget_snapshots (
    id UUID PRIMARY KEY,
    budget_name VARCHAR(160) NOT NULL,
    project_type VARCHAR(80) NOT NULL,
    pricing_mode VARCHAR(20) NOT NULL,
    desired_stack_id VARCHAR(80) NOT NULL,
    configuration_snapshot_id VARCHAR(120) NOT NULL,
    preview_hash VARCHAR(128) NOT NULL,
    total_hours NUMERIC(12, 2) NOT NULL,
    final_one_time_total NUMERIC(14, 2) NOT NULL,
    final_monthly_total NUMERIC(14, 2) NOT NULL,
    currency VARCHAR(12) NOT NULL,
    request_json TEXT,
    result_json TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);
