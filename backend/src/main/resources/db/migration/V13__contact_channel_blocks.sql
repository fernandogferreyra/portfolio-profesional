INSERT INTO public_content_blocks (id, content_key, language, title, body, items_json, published, display_order, created_at, updated_at)
SELECT '8f931ca4-74b6-4de8-9b6d-c321571b1301', 'contact.email', 'es',
       'Gmail / Email',
       'Canal principal para oportunidades profesionales y conversaciones tecnicas.',
       '["fernandogabrielf@gmail.com","mailto:fernandogabrielf@gmail.com"]', TRUE, 42, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM public_content_blocks WHERE content_key = 'contact.email' AND language = 'es');

INSERT INTO public_content_blocks (id, content_key, language, title, body, items_json, published, display_order, created_at, updated_at)
SELECT '8f931ca4-74b6-4de8-9b6d-c321571b1302', 'contact.email', 'en',
       'Gmail / Email',
       'Primary channel for professional opportunities and technical conversations.',
       '["fernandogabrielf@gmail.com","mailto:fernandogabrielf@gmail.com"]', TRUE, 43, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM public_content_blocks WHERE content_key = 'contact.email' AND language = 'en');

INSERT INTO public_content_blocks (id, content_key, language, title, body, items_json, published, display_order, created_at, updated_at)
SELECT '8f931ca4-74b6-4de8-9b6d-c321571b1303', 'contact.phone', 'es',
       'Telefono / WhatsApp',
       'Canal directo para intercambio rapido cuando el proceso ya requiere una conversacion puntual.',
       '["Disponible a pedido"]', TRUE, 44, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM public_content_blocks WHERE content_key = 'contact.phone' AND language = 'es');

INSERT INTO public_content_blocks (id, content_key, language, title, body, items_json, published, display_order, created_at, updated_at)
SELECT '8f931ca4-74b6-4de8-9b6d-c321571b1304', 'contact.phone', 'en',
       'Phone / WhatsApp',
       'Direct channel for faster communication once a process requires a specific conversation.',
       '["Available on request"]', TRUE, 45, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM public_content_blocks WHERE content_key = 'contact.phone' AND language = 'en');

INSERT INTO public_content_blocks (id, content_key, language, title, body, items_json, published, display_order, created_at, updated_at)
SELECT '8f931ca4-74b6-4de8-9b6d-c321571b1305', 'contact.linkedin', 'es',
       'LinkedIn',
       'Perfil profesional para procesos formales, networking y seguimiento.',
       '["linkedin.com/in/fernando-ferreyra-40a126328","https://www.linkedin.com/in/fernando-ferreyra-40a126328"]', TRUE, 46, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM public_content_blocks WHERE content_key = 'contact.linkedin' AND language = 'es');

INSERT INTO public_content_blocks (id, content_key, language, title, body, items_json, published, display_order, created_at, updated_at)
SELECT '8f931ca4-74b6-4de8-9b6d-c321571b1306', 'contact.linkedin', 'en',
       'LinkedIn',
       'Professional profile for formal processes, networking, and follow-up.',
       '["linkedin.com/in/fernando-ferreyra-40a126328","https://www.linkedin.com/in/fernando-ferreyra-40a126328"]', TRUE, 47, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM public_content_blocks WHERE content_key = 'contact.linkedin' AND language = 'en');

INSERT INTO public_content_blocks (id, content_key, language, title, body, items_json, published, display_order, created_at, updated_at)
SELECT '8f931ca4-74b6-4de8-9b6d-c321571b1307', 'contact.github', 'es',
       'GitHub',
       'Codigo, experimentos y decisiones tecnicas visibles en repositorios publicos.',
       '["github.com/fernandogferreyra","https://github.com/fernandogferreyra"]', TRUE, 48, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM public_content_blocks WHERE content_key = 'contact.github' AND language = 'es');

INSERT INTO public_content_blocks (id, content_key, language, title, body, items_json, published, display_order, created_at, updated_at)
SELECT '8f931ca4-74b6-4de8-9b6d-c321571b1308', 'contact.github', 'en',
       'GitHub',
       'Code, experiments, and visible technical decisions in public repositories.',
       '["github.com/fernandogferreyra","https://github.com/fernandogferreyra"]', TRUE, 49, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM public_content_blocks WHERE content_key = 'contact.github' AND language = 'en');

UPDATE projects
SET summary = 'Plataforma de gestion de mantenimiento para obras privadas con control operativo.'
WHERE slug = 'obrasmart'
  AND summary = 'Maintenance management platform for private construction projects with operational control.';

UPDATE projects
SET summary = 'Portfolio bilingue preparado para integrar backend Spring Boot y herramientas privadas.'
WHERE slug = 'portfolio-ferchuz'
  AND summary = 'Bilingual portfolio application prepared to integrate a modular Spring Boot backend.';
