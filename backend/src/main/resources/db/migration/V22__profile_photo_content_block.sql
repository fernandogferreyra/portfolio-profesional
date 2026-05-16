INSERT INTO public_content_blocks (id, content_key, language, title, body, items_json, published, display_order, created_at, updated_at)
SELECT '0d000000-0000-4000-8000-000000000001', 'site.profile-photo', 'es',
       'Foto de perfil',
       'Imagen principal usada en Inicio y navbar.',
       '[]', TRUE, 45, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM public_content_blocks WHERE content_key = 'site.profile-photo' AND language = 'es');

INSERT INTO public_content_blocks (id, content_key, language, title, body, items_json, published, display_order, created_at, updated_at)
SELECT '0d000000-0000-4000-8000-000000000002', 'site.profile-photo', 'en',
       'Profile photo',
       'Main image used on Home and navbar.',
       '[]', TRUE, 46, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM public_content_blocks WHERE content_key = 'site.profile-photo' AND language = 'en');
