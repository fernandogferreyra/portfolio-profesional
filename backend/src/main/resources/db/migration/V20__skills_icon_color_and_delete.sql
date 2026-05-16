ALTER TABLE skills
    ADD COLUMN icon_document_id UUID REFERENCES documents(id),
    ADD COLUMN accent_color VARCHAR(32) NOT NULL DEFAULT '#2dd4bf';

UPDATE skills SET accent_color = '#f89820' WHERE icon = 'java';
UPDATE skills SET accent_color = '#f7df1e' WHERE icon = 'javascript';
UPDATE skills SET accent_color = '#2563eb' WHERE icon = 'cplusplus';
UPDATE skills SET accent_color = '#fbbf24' WHERE icon = 'python';
UPDATE skills SET accent_color = '#6db33f' WHERE icon = 'spring';
UPDATE skills SET accent_color = '#7c4dff' WHERE icon = 'dotnet';
UPDATE skills SET accent_color = '#dd0031' WHERE icon = 'angular';
UPDATE skills SET accent_color = '#3178c6' WHERE icon = 'typescript';
UPDATE skills SET accent_color = '#38bdf8' WHERE icon = 'frontend';
UPDATE skills SET accent_color = '#85ea2d' WHERE icon = 'openapi';
UPDATE skills SET accent_color = '#336791' WHERE icon = 'postgresql';
UPDATE skills SET accent_color = '#22c55e' WHERE icon = 'database';
UPDATE skills SET accent_color = '#a78bfa' WHERE icon = 'testing';
UPDATE skills SET accent_color = '#2496ed' WHERE icon = 'docker';
UPDATE skills SET accent_color = '#f05032' WHERE icon = 'git';
UPDATE skills SET accent_color = '#f8fafc' WHERE icon = 'github';
UPDATE skills SET accent_color = '#60a5fa' WHERE icon = 'ide';
UPDATE skills SET accent_color = '#00979d' WHERE icon = 'arduino';
UPDATE skills SET accent_color = '#f97316' WHERE icon = 'automation';
UPDATE skills SET accent_color = '#38bdf8' WHERE icon = 'microservices';
UPDATE skills SET accent_color = '#22d3ee' WHERE icon = 'architecture';
UPDATE skills SET accent_color = '#34d399' WHERE icon = 'security';
UPDATE skills SET accent_color = '#c084fc' WHERE icon = 'ai';
UPDATE skills SET accent_color = '#a855f7' WHERE icon = 'llm';
UPDATE skills SET accent_color = '#facc15' WHERE icon = 'problemSolving';
UPDATE skills SET accent_color = '#fb7185' WHERE icon = 'analyticalThinking';
UPDATE skills SET accent_color = '#2dd4bf' WHERE icon = 'adaptability';
UPDATE skills SET accent_color = '#60a5fa' WHERE icon = 'teamwork';
UPDATE skills SET accent_color = '#94a3b8' WHERE icon = 'autonomy';
UPDATE skills SET accent_color = '#4ade80' WHERE icon = 'continuousLearning';

CREATE INDEX idx_skills_icon_document_id ON skills(icon_document_id);
