UPDATE contact_messages
SET status = 'NEW'
WHERE status = 'RECEIVED';

UPDATE contact_messages
SET status = 'READ'
WHERE status = 'PENDING_REVIEW';

CREATE TABLE IF NOT EXISTS event_logs (
    id UUID PRIMARY KEY,
    event_type VARCHAR(60) NOT NULL,
    source VARCHAR(120),
    metadata_json TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS project_year VARCHAR(4);

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS stack_json TEXT;

INSERT INTO projects (
    id,
    slug,
    name,
    project_year,
    category,
    summary,
    repository_url,
    stack_json,
    featured,
    published,
    display_order,
    created_at,
    updated_at
)
SELECT
    '4bb85a43-5b18-4ef7-b46f-c37813d4e4ab',
    'obrasmart',
    'ObraSmart',
    '2025',
    'DISTRIBUTED_PLATFORM',
    'Maintenance management platform for private construction projects with operational control.',
    'https://github.com/114320-FERREYRA-FERNANDO-GABRIEL/obrasmart-platform.git',
    '["Java 17","Spring Boot","PostgreSQL","Docker","Angular","JWT"]',
    TRUE,
    TRUE,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1
    FROM projects
    WHERE slug = 'obrasmart'
);

INSERT INTO projects (
    id,
    slug,
    name,
    project_year,
    category,
    summary,
    repository_url,
    stack_json,
    featured,
    published,
    display_order,
    created_at,
    updated_at
)
SELECT
    '87e9da64-3b5a-44f8-bc1f-48b5b2bccd95',
    'portfolio-ferchuz',
    'Portfolio Profesional',
    '2026',
    'FRONTEND_SYSTEM',
    'Bilingual portfolio application prepared to integrate a modular Spring Boot backend.',
    NULL,
    '["Angular 20","TypeScript","SCSS","Spring Boot V1 backend base"]',
    TRUE,
    TRUE,
    2,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1
    FROM projects
    WHERE slug = 'portfolio-ferchuz'
);
