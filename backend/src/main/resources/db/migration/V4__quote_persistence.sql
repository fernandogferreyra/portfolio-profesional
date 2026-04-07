CREATE TABLE IF NOT EXISTS quotes (
    id UUID PRIMARY KEY,
    project_type VARCHAR(80) NOT NULL,
    complexity VARCHAR(20) NOT NULL,
    total_hours NUMERIC(12, 2) NOT NULL,
    total_cost NUMERIC(14, 2) NOT NULL,
    hourly_rate NUMERIC(10, 2) NOT NULL,
    request_json TEXT,
    result_json TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);
