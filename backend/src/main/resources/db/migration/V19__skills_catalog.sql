CREATE TABLE skill_categories (
    id UUID PRIMARY KEY,
    language VARCHAR(8) NOT NULL,
    slug VARCHAR(120) NOT NULL,
    label VARCHAR(160) NOT NULL,
    description TEXT NOT NULL,
    published BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_skill_categories_language_slug UNIQUE (language, slug)
);

CREATE TABLE skills (
    id UUID PRIMARY KEY,
    language VARCHAR(8) NOT NULL,
    slug VARCHAR(120) NOT NULL,
    name VARCHAR(160) NOT NULL,
    description TEXT NOT NULL,
    category_id UUID REFERENCES skill_categories(id) ON DELETE SET NULL,
    icon VARCHAR(80) NOT NULL,
    level VARCHAR(40) NOT NULL,
    tags_json TEXT NOT NULL DEFAULT '[]',
    show_level BOOLEAN NOT NULL DEFAULT TRUE,
    published BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_skills_language_slug UNIQUE (language, slug)
);

CREATE INDEX idx_skill_categories_language_order ON skill_categories(language, display_order);
CREATE INDEX idx_skills_language_order ON skills(language, display_order);
CREATE INDEX idx_skills_category_id ON skills(category_id);

INSERT INTO skill_categories (id, language, slug, label, description, published, display_order) VALUES
('10000000-0000-0000-0000-000000000001', 'es', 'backend', 'Backend', 'Servicios, APIs, seguridad, integraciones y arquitectura de aplicaciones.', TRUE, 10),
('10000000-0000-0000-0000-000000000002', 'es', 'frontend', 'Frontend', 'Interfaces Angular, consumo de APIs y desarrollo orientado a componentes.', TRUE, 20),
('10000000-0000-0000-0000-000000000003', 'es', 'data', 'Data', 'Persistencia relacional y no relacional, modelado y consultas.', TRUE, 30),
('10000000-0000-0000-0000-000000000004', 'es', 'tools', 'Herramientas', 'Versionado, IDEs, automatizacion, build y herramientas de trabajo diario.', TRUE, 40),
('10000000-0000-0000-0000-000000000005', 'es', 'ai', 'AI / Desarrollo asistido', 'Herramientas orientadas a desarrollo asistido, automatizacion, productividad y exploracion de workflows tecnicos.', TRUE, 50),
('10000000-0000-0000-0000-000000000006', 'es', 'soft', 'Soft skills', 'Capacidades personales aplicadas al trabajo tecnico, la colaboracion y la resolucion de problemas.', TRUE, 60),
('10000000-0000-0000-0000-000000000007', 'es', 'otras', 'Otras', 'Skills sin categoria activa o pendientes de clasificacion.', TRUE, 999),
('10000000-0000-0000-0000-000000000101', 'en', 'backend', 'Backend', 'Services, APIs, security, integrations, and application architecture.', TRUE, 10),
('10000000-0000-0000-0000-000000000102', 'en', 'frontend', 'Frontend', 'Angular interfaces, API consumption, and component-oriented development.', TRUE, 20),
('10000000-0000-0000-0000-000000000103', 'en', 'data', 'Data', 'Relational and non-relational persistence, modeling, and querying.', TRUE, 30),
('10000000-0000-0000-0000-000000000104', 'en', 'tools', 'Tools', 'Version control, IDEs, automation, build, and day-to-day tooling.', TRUE, 40),
('10000000-0000-0000-0000-000000000105', 'en', 'ai', 'AI / Assisted development', 'Tools focused on assisted development, automation, productivity, and technical workflow exploration.', TRUE, 50),
('10000000-0000-0000-0000-000000000106', 'en', 'soft', 'Soft skills', 'Personal capabilities applied to technical work, collaboration, and problem solving.', TRUE, 60),
('10000000-0000-0000-0000-000000000107', 'en', 'other', 'Other', 'Skills without an active category or pending classification.', TRUE, 999)
ON CONFLICT (language, slug) DO NOTHING;

INSERT INTO skills (id, language, slug, name, description, category_id, icon, level, tags_json, show_level, published, display_order) VALUES
('20000000-0000-0000-0000-000000000001', 'es', 'java', 'Java', 'Desarrollo backend orientado a APIs, logica de negocio y servicios mantenibles.', '10000000-0000-0000-0000-000000000001', 'java', 'advanced', '["Spring Boot","REST","Security"]', TRUE, TRUE, 10),
('20000000-0000-0000-0000-000000000002', 'es', 'cplusplus', 'C++', 'Base tecnica cercana a hardware y resolucion estructurada de problemas.', '10000000-0000-0000-0000-000000000001', 'cplusplus', 'intermediate', '["Hardware","Low level"]', TRUE, TRUE, 20),
('20000000-0000-0000-0000-000000000003', 'es', 'csharp', 'C#', 'Implementacion de servicios y capas de negocio dentro del ecosistema .NET.', '10000000-0000-0000-0000-000000000001', 'dotnet', 'advanced', '["Services","APIs","OOP"]', TRUE, TRUE, 30),
('20000000-0000-0000-0000-000000000004', 'es', 'dotnet-core', '.NET Core', 'Construccion de APIs y aplicaciones backend con ASP.NET Core y persistencia integrada.', '10000000-0000-0000-0000-000000000001', 'dotnet', 'advanced', '["ASP.NET Core","Entity Framework","DI"]', TRUE, TRUE, 40),
('20000000-0000-0000-0000-000000000005', 'es', 'python', 'Python', 'Uso puntual en scripting y automatizaciones de apoyo al desarrollo.', '10000000-0000-0000-0000-000000000001', 'python', 'basic', '["Scripting","Automation"]', TRUE, TRUE, 50),
('20000000-0000-0000-0000-000000000006', 'es', 'javascript', 'JavaScript', 'Base practica para interaccion, comportamiento de UI y logica web en cliente.', '10000000-0000-0000-0000-000000000002', 'javascript', 'intermediate', '["DOM","Events","Async"]', TRUE, TRUE, 60),
('20000000-0000-0000-0000-000000000007', 'es', 'typescript', 'TypeScript', 'Tipado, modelos y organizacion del codigo para frontend mas claro y predecible.', '10000000-0000-0000-0000-000000000002', 'typescript', 'intermediate', '["Typing","Models","API clients"]', TRUE, TRUE, 70),
('20000000-0000-0000-0000-000000000008', 'es', 'angular', 'Angular', 'Interfaces modulares con routing, formularios y consumo de APIs.', '10000000-0000-0000-0000-000000000002', 'angular', 'intermediate', '["Router","Forms","Signals"]', TRUE, TRUE, 80),
('20000000-0000-0000-0000-000000000009', 'es', 'html-scss', 'HTML / SCSS', 'Maquetacion semantica, responsive y jerarquia visual consistente.', '10000000-0000-0000-0000-000000000002', 'frontend', 'intermediate', '["Layout","Responsive","UI"]', TRUE, TRUE, 90),
('20000000-0000-0000-0000-000000000010', 'es', 'postgresql', 'PostgreSQL', 'Modelado y persistencia relacional para aplicaciones transaccionales.', '10000000-0000-0000-0000-000000000003', 'postgresql', 'intermediate', '["Queries","Modeling","Transactions"]', TRUE, TRUE, 100),
('20000000-0000-0000-0000-000000000011', 'es', 'mysql-sql', 'MySQL / SQL', 'Trabajo solido sobre tablas, joins y consultas operativas en bases relacionales.', '10000000-0000-0000-0000-000000000003', 'database', 'advanced', '["Joins","Reporting","Optimization"]', TRUE, TRUE, 110),
('20000000-0000-0000-0000-000000000012', 'es', 'mongodb', 'MongoDB', 'Persistencia documental para escenarios acotados y esquemas flexibles.', '10000000-0000-0000-0000-000000000003', 'database', 'basic', '["Documents","Queries"]', TRUE, TRUE, 120),
('20000000-0000-0000-0000-000000000013', 'es', 'docker', 'Docker', 'Entornos reproducibles y despliegue consistente mediante contenedores.', '10000000-0000-0000-0000-000000000004', 'docker', 'intermediate', '["Containers","Compose","Deploy"]', TRUE, TRUE, 130),
('20000000-0000-0000-0000-000000000014', 'es', 'git', 'Git', 'Control de versiones como base del flujo tecnico diario.', '10000000-0000-0000-0000-000000000004', 'git', 'advanced', '["Branches","Review","History"]', TRUE, TRUE, 140),
('20000000-0000-0000-0000-000000000015', 'es', 'github-actions', 'GitHub Actions', 'Automatizacion de build y validaciones dentro del flujo de integracion.', '10000000-0000-0000-0000-000000000004', 'automation', 'intermediate', '["CI","Build","Validation"]', TRUE, TRUE, 150),
('20000000-0000-0000-0000-000000000016', 'es', 'postman-api-qa', 'Postman', 'Pruebas manuales de endpoints y debugging rapido de APIs.', '10000000-0000-0000-0000-000000000004', 'testing', 'advanced', '["Collections","Testing","Debug"]', TRUE, TRUE, 160),
('20000000-0000-0000-0000-000000000017', 'es', 'intellij-idea', 'IntelliJ IDEA', 'IDE principal para Java y Spring Boot con debugging y navegacion estructurada.', '10000000-0000-0000-0000-000000000004', 'ide', 'advanced', '["Java","Spring","Debug"]', TRUE, TRUE, 170),
('20000000-0000-0000-0000-000000000018', 'es', 'visual-studio-code', 'Visual Studio Code', 'Editor central para frontend, scripting y edicion rapida en flujo fullstack.', '10000000-0000-0000-0000-000000000004', 'ide', 'advanced', '["Frontend","Config","Refactor"]', TRUE, TRUE, 180),
('20000000-0000-0000-0000-000000000019', 'es', 'claude-code', 'Claude Code', 'Asistencia para navegar codigo y acelerar cambios concretos de implementacion.', '10000000-0000-0000-0000-000000000005', 'ai', 'advanced', '["Code nav","Edits","Automation"]', TRUE, TRUE, 190),
('20000000-0000-0000-0000-000000000020', 'es', 'opencode', 'OpenCode', 'Exploracion de flujos agentic y automatizacion liviana aplicada al desarrollo.', '10000000-0000-0000-0000-000000000005', 'ai', 'intermediate', '["Agentic","Workflows","Automation"]', TRUE, TRUE, 200),
('20000000-0000-0000-0000-000000000021', 'es', 'codex', 'Codex', 'Soporte para edicion guiada, revision tecnica y ejecucion controlada.', '10000000-0000-0000-0000-000000000005', 'ai', 'advanced', '["Review","Implementation","Repo work"]', TRUE, TRUE, 210),
('20000000-0000-0000-0000-000000000022', 'es', 'chatgpt', 'ChatGPT', 'Apoyo para analisis, documentacion e ideacion rapida de soluciones tecnicas.', '10000000-0000-0000-0000-000000000005', 'ai', 'advanced', '["Analysis","Docs","Ideation"]', TRUE, TRUE, 220),
('20000000-0000-0000-0000-000000000023', 'es', 'ollama', 'Ollama', 'Ejecucion local de modelos para pruebas de asistentes y flujos offline.', '10000000-0000-0000-0000-000000000005', 'llm', 'intermediate', '["Local models","Offline"]', TRUE, TRUE, 230),
('20000000-0000-0000-0000-000000000024', 'es', 'teamwork', 'Trabajo en equipo', 'Colaboracion sostenida y comunicacion clara dentro del trabajo tecnico.', '10000000-0000-0000-0000-000000000006', 'teamwork', 'basic', '[]', FALSE, TRUE, 240),
('20000000-0000-0000-0000-000000000025', 'es', 'problem-solving', 'Resolucion de problemas', 'Capacidad para diagnosticar, desarmar y resolver problemas complejos.', '10000000-0000-0000-0000-000000000006', 'problemSolving', 'basic', '[]', FALSE, TRUE, 250),
('20000000-0000-0000-0000-000000000026', 'es', 'analytical-thinking', 'Pensamiento analitico', 'Lectura estructurada de fallas, causas y alternativas de solucion.', '10000000-0000-0000-0000-000000000006', 'analyticalThinking', 'basic', '[]', FALSE, TRUE, 260),
('20000000-0000-0000-0000-000000000027', 'es', 'adaptability', 'Adaptabilidad', 'Transicion fluida entre herramientas, contextos y tipos de problema.', '10000000-0000-0000-0000-000000000006', 'adaptability', 'basic', '[]', FALSE, TRUE, 270),
('20000000-0000-0000-0000-000000000028', 'es', 'autonomy', 'Trabajo autonomo', 'Capacidad de avanzar con criterio propio y mantener foco tecnico.', '10000000-0000-0000-0000-000000000006', 'autonomy', 'basic', '[]', FALSE, TRUE, 280),
('20000000-0000-0000-0000-000000000029', 'es', 'continuous-learning', 'Aprendizaje continuo', 'Actualizacion constante de herramientas, practicas y formas de trabajo.', '10000000-0000-0000-0000-000000000006', 'continuousLearning', 'basic', '[]', FALSE, TRUE, 290)
ON CONFLICT (language, slug) DO NOTHING;

INSERT INTO skills (id, language, slug, name, description, category_id, icon, level, tags_json, show_level, published, display_order)
SELECT md5('skill-en-' || slug)::uuid, 'en', slug, name, description, category_id, icon, level, tags_json, show_level, published, display_order
FROM (VALUES
('java', 'Java', 'Backend development focused on APIs, business logic, and maintainable services.', '10000000-0000-0000-0000-000000000101'::uuid, 'java', 'advanced', '["Spring Boot","REST","Security"]', TRUE, TRUE, 10),
('cplusplus', 'C++', 'Technical foundation close to hardware and structured problem solving.', '10000000-0000-0000-0000-000000000101'::uuid, 'cplusplus', 'intermediate', '["Hardware","Low level"]', TRUE, TRUE, 20),
('csharp', 'C#', 'Service and business layer implementation within the .NET ecosystem.', '10000000-0000-0000-0000-000000000101'::uuid, 'dotnet', 'advanced', '["Services","APIs","OOP"]', TRUE, TRUE, 30),
('dotnet-core', '.NET Core', 'Backend API and application development with ASP.NET Core and integrated persistence.', '10000000-0000-0000-0000-000000000101'::uuid, 'dotnet', 'advanced', '["ASP.NET Core","Entity Framework","DI"]', TRUE, TRUE, 40),
('python', 'Python', 'Used selectively for scripting and development-support automation.', '10000000-0000-0000-0000-000000000101'::uuid, 'python', 'basic', '["Scripting","Automation"]', TRUE, TRUE, 50),
('javascript', 'JavaScript', 'Practical foundation for interaction, UI behavior, and client-side web logic.', '10000000-0000-0000-0000-000000000102'::uuid, 'javascript', 'intermediate', '["DOM","Events","Async"]', TRUE, TRUE, 60),
('typescript', 'TypeScript', 'Typing, models, and code organization for clearer and more predictable frontend work.', '10000000-0000-0000-0000-000000000102'::uuid, 'typescript', 'intermediate', '["Typing","Models","API clients"]', TRUE, TRUE, 70),
('angular', 'Angular', 'Modular interfaces with routing, forms, and API consumption.', '10000000-0000-0000-0000-000000000102'::uuid, 'angular', 'intermediate', '["Router","Forms","Signals"]', TRUE, TRUE, 80),
('html-scss', 'HTML / SCSS', 'Semantic layout, responsive adaptation, and consistent visual hierarchy.', '10000000-0000-0000-0000-000000000102'::uuid, 'frontend', 'intermediate', '["Layout","Responsive","UI"]', TRUE, TRUE, 90),
('postgresql', 'PostgreSQL', 'Relational modeling and persistence for transactional applications.', '10000000-0000-0000-0000-000000000103'::uuid, 'postgresql', 'intermediate', '["Queries","Modeling","Transactions"]', TRUE, TRUE, 100),
('mysql-sql', 'MySQL / SQL', 'Solid work with tables, joins, and operational queries in relational databases.', '10000000-0000-0000-0000-000000000103'::uuid, 'database', 'advanced', '["Joins","Reporting","Optimization"]', TRUE, TRUE, 110),
('mongodb', 'MongoDB', 'Document persistence for bounded scenarios and flexible schemas.', '10000000-0000-0000-0000-000000000103'::uuid, 'database', 'basic', '["Documents","Queries"]', TRUE, TRUE, 120),
('docker', 'Docker', 'Reproducible environments and consistent delivery through containers.', '10000000-0000-0000-0000-000000000104'::uuid, 'docker', 'intermediate', '["Containers","Compose","Deploy"]', TRUE, TRUE, 130),
('git', 'Git', 'Version control as the foundation of day-to-day technical flow.', '10000000-0000-0000-0000-000000000104'::uuid, 'git', 'advanced', '["Branches","Review","History"]', TRUE, TRUE, 140),
('github-actions', 'GitHub Actions', 'Build automation and validation inside the integration workflow.', '10000000-0000-0000-0000-000000000104'::uuid, 'automation', 'intermediate', '["CI","Build","Validation"]', TRUE, TRUE, 150),
('postman-api-qa', 'Postman', 'Manual endpoint testing and quick API debugging.', '10000000-0000-0000-0000-000000000104'::uuid, 'testing', 'advanced', '["Collections","Testing","Debug"]', TRUE, TRUE, 160),
('intellij-idea', 'IntelliJ IDEA', 'Primary IDE for Java and Spring Boot with debugging and structured navigation.', '10000000-0000-0000-0000-000000000104'::uuid, 'ide', 'advanced', '["Java","Spring","Debug"]', TRUE, TRUE, 170),
('visual-studio-code', 'Visual Studio Code', 'Core editor for frontend, scripting, and quick edits in the fullstack workflow.', '10000000-0000-0000-0000-000000000104'::uuid, 'ide', 'advanced', '["Frontend","Config","Refactor"]', TRUE, TRUE, 180),
('claude-code', 'Claude Code', 'Used to navigate code and accelerate concrete implementation changes.', '10000000-0000-0000-0000-000000000105'::uuid, 'ai', 'advanced', '["Code nav","Edits","Automation"]', TRUE, TRUE, 190),
('opencode', 'OpenCode', 'Exploration of agentic flows and lightweight automation applied to development.', '10000000-0000-0000-0000-000000000105'::uuid, 'ai', 'intermediate', '["Agentic","Workflows","Automation"]', TRUE, TRUE, 200),
('codex', 'Codex', 'Support for guided editing, technical review, and controlled execution.', '10000000-0000-0000-0000-000000000105'::uuid, 'ai', 'advanced', '["Review","Implementation","Repo work"]', TRUE, TRUE, 210),
('chatgpt', 'ChatGPT', 'Support for analysis, documentation, and quick ideation of technical solutions.', '10000000-0000-0000-0000-000000000105'::uuid, 'ai', 'advanced', '["Analysis","Docs","Ideation"]', TRUE, TRUE, 220),
('ollama', 'Ollama', 'Local model runtime for assistant testing and offline workflows.', '10000000-0000-0000-0000-000000000105'::uuid, 'llm', 'intermediate', '["Local models","Offline"]', TRUE, TRUE, 230),
('teamwork', 'Teamwork', 'Steady collaboration and clear communication in technical work.', '10000000-0000-0000-0000-000000000106'::uuid, 'teamwork', 'basic', '[]', FALSE, TRUE, 240),
('problem-solving', 'Problem solving', 'Ability to diagnose, break down, and solve complex problems.', '10000000-0000-0000-0000-000000000106'::uuid, 'problemSolving', 'basic', '[]', FALSE, TRUE, 250),
('analytical-thinking', 'Analytical thinking', 'Structured reading of failures, causes, and solution alternatives.', '10000000-0000-0000-0000-000000000106'::uuid, 'analyticalThinking', 'basic', '[]', FALSE, TRUE, 260),
('adaptability', 'Adaptability', 'Smooth transition across tools, contexts, and problem types.', '10000000-0000-0000-0000-000000000106'::uuid, 'adaptability', 'basic', '[]', FALSE, TRUE, 270),
('autonomy', 'Autonomy', 'Ability to move forward with sound judgment and sustained technical focus.', '10000000-0000-0000-0000-000000000106'::uuid, 'autonomy', 'basic', '[]', FALSE, TRUE, 280),
('continuous-learning', 'Continuous learning', 'Continuous update of tools, practices, and ways of working.', '10000000-0000-0000-0000-000000000106'::uuid, 'continuousLearning', 'basic', '[]', FALSE, TRUE, 290)
) AS seeded(slug, name, description, category_id, icon, level, tags_json, show_level, published, display_order)
ON CONFLICT (language, slug) DO NOTHING;
