CREATE TABLE IF NOT EXISTS public_content_blocks (
    id UUID PRIMARY KEY,
    content_key VARCHAR(120) NOT NULL,
    language VARCHAR(8) NOT NULL,
    title VARCHAR(220) NOT NULL,
    body TEXT NOT NULL,
    items_json TEXT,
    published BOOLEAN NOT NULL,
    display_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT uk_public_content_blocks_key_language UNIQUE (content_key, language)
);

INSERT INTO public_content_blocks (id, content_key, language, title, body, items_json, published, display_order, created_at, updated_at)
SELECT '5f40d9e0-2c6a-4d5b-bf35-ccfb155da101', 'about.hero', 'es',
       'Experiencia técnica construida desde electrónica, hardware y diagnóstico de sistemas, hoy aplicada al desarrollo fullstack con foco en backend.',
       'Desarrollador fullstack con foco en backend. Mi recorrido en electrónica, hardware y diagnóstico me dio una base técnica que hoy aplico en APIs, integraciones, arquitectura y desarrollo de software.',
       '["Backend","APIs","Integraciones"]', TRUE, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM public_content_blocks WHERE content_key = 'about.hero' AND language = 'es');

INSERT INTO public_content_blocks (id, content_key, language, title, body, items_json, published, display_order, created_at, updated_at)
SELECT '5f40d9e0-2c6a-4d5b-bf35-ccfb155da102', 'about.hero', 'en',
       'Technical experience built through electronics, hardware, and systems diagnostics, now applied to fullstack development with a backend focus.',
       'Fullstack developer with a backend focus. My background in electronics, hardware, and diagnostics gave me a technical foundation that I now apply to APIs, integrations, architecture, and software development.',
       '["Backend","APIs","Integrations"]', TRUE, 11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM public_content_blocks WHERE content_key = 'about.hero' AND language = 'en');

INSERT INTO public_content_blocks (id, content_key, language, title, body, items_json, published, display_order, created_at, updated_at)
SELECT '5f40d9e0-2c6a-4d5b-bf35-ccfb155da103', 'about.story', 'es',
       'Base técnica y transición al software',
       'Mi recorrido profesional comenzó en electrónica, hardware y diagnóstico de sistemas. Esa experiencia fue la base desde la que pasé al desarrollo de software.',
       '["Durante años trabajé en electrónica, reparación de hardware, soporte técnico y diagnóstico de fallas. Esa etapa me dio precisión técnica, método de análisis y una forma práctica de resolver problemas complejos.","Con esa base avancé hacia el desarrollo de software, completé la Tecnicatura Universitaria en Programación en UTN FRC y empecé a trabajar con Java, Spring Boot, .NET, Angular y bases de datos relacionales y no relacionales.","Hoy me posiciono como desarrollador fullstack con foco en backend. Trabajo en APIs, microservicios, integraciones y aplicaciones end-to-end, priorizando claridad técnica, mantenibilidad y escalabilidad."]', TRUE, 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM public_content_blocks WHERE content_key = 'about.story' AND language = 'es');

INSERT INTO public_content_blocks (id, content_key, language, title, body, items_json, published, display_order, created_at, updated_at)
SELECT '5f40d9e0-2c6a-4d5b-bf35-ccfb155da104', 'about.story', 'en',
       'Technical foundation and transition into software',
       'My professional path started in electronics, hardware, and systems diagnostics. That experience became the foundation for my transition into software development.',
       '["I spent years working in electronics, hardware repair, technical support, and system diagnostics. That stage gave me technical precision, analytical discipline, and a practical way to approach complex problems.","With that foundation I moved into software development, completed the University Programming Technician degree at UTN FRC, and started building applications with Java, Spring Boot, .NET, Angular, and both relational and non-relational databases.","Today I work as a fullstack developer with a backend focus. I build APIs, microservices, integrations, and end-to-end applications while prioritizing technical clarity, maintainability, and scalability."]', TRUE, 21, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM public_content_blocks WHERE content_key = 'about.story' AND language = 'en');

INSERT INTO public_content_blocks (id, content_key, language, title, body, items_json, published, display_order, created_at, updated_at)
SELECT '5f40d9e0-2c6a-4d5b-bf35-ccfb155da105', 'contact.hero', 'es',
       'Si querés conversar sobre una oportunidad o un proyecto, podemos hablar.',
       'Estoy abierto a conversaciones profesionales sobre roles, colaboraciones y desarrollo de software. Abajo tenés los canales directos y la información que me ayuda a responder con contexto.',
       '["Oportunidades profesionales","Colaboración técnica","Proyectos freelance"]', TRUE, 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM public_content_blocks WHERE content_key = 'contact.hero' AND language = 'es');

INSERT INTO public_content_blocks (id, content_key, language, title, body, items_json, published, display_order, created_at, updated_at)
SELECT '5f40d9e0-2c6a-4d5b-bf35-ccfb155da106', 'contact.hero', 'en',
       'If you want to discuss an opportunity or a project, we can talk.',
       'I am open to professional conversations about roles, collaborations, and software development work. Below you will find direct channels and the context that helps me respond clearly.',
       '["Professional opportunities","Technical collaboration","Freelance projects"]', TRUE, 31, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM public_content_blocks WHERE content_key = 'contact.hero' AND language = 'en');

INSERT INTO public_content_blocks (id, content_key, language, title, body, items_json, published, display_order, created_at, updated_at)
SELECT '5f40d9e0-2c6a-4d5b-bf35-ccfb155da107', 'contact.cv', 'es',
       'CV',
       'Resumen profesional actualizado con experiencia, stack y proyectos relevantes.',
       '["/docs/cv-fernando-ferreyra.pdf"]', TRUE, 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM public_content_blocks WHERE content_key = 'contact.cv' AND language = 'es');

INSERT INTO public_content_blocks (id, content_key, language, title, body, items_json, published, display_order, created_at, updated_at)
SELECT '5f40d9e0-2c6a-4d5b-bf35-ccfb155da108', 'contact.cv', 'en',
       'Resume',
       'Updated professional summary with experience, stack, and relevant projects.',
       '["/docs/cv-fernando-ferreyra.pdf"]', TRUE, 41, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM public_content_blocks WHERE content_key = 'contact.cv' AND language = 'en');
