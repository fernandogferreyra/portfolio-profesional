ALTER TABLE projects
ADD COLUMN IF NOT EXISTS metrics_json TEXT;

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS sections_json TEXT;

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS features_json TEXT;

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS documentation_document_ids_json TEXT;

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS screenshot_document_ids_json TEXT;

UPDATE projects
SET metrics_json = '[{"value":"11","label":"servicios por dominio"},{"value":"JWT","label":"seguridad centralizada"},{"value":"PWA","label":"frontend integrado"}]',
    sections_json = '[{"title":"Problema","items":["Centralizar mantenimientos, reparaciones y seguimiento operativo que normalmente quedan dispersos entre mensajes, planillas y procesos manuales."]},{"title":"Solucion","items":["Plataforma distribuida con autenticacion centralizada, servicios por dominio y visibilidad operativa en tiempo real."]},{"title":"Arquitectura","items":["Separacion por dominios para aislar responsabilidades y facilitar evolucion independiente.","API Gateway como punto de entrada unico para clientes y servicios.","Integracion con frontend Angular PWA y capacidades de geolocalizacion e IA."]},{"title":"Decisiones tecnicas","items":["Docker para entornos repetibles y despliegue consistente.","JWT y autenticacion centralizada para reducir friccion entre componentes.","IA y geolocalizacion incorporadas como capacidad de negocio, no solo como extra visual."]}]',
    features_json = '["Arquitectura de microservicios","API Gateway","Autenticacion JWT","Geolocalizacion operativa","Asistente con IA"]'
WHERE slug = 'obrasmart'
  AND metrics_json IS NULL;

UPDATE projects
SET metrics_json = '[{"value":"3","label":"themes visuales"},{"value":"5","label":"secciones principales"},{"value":"Angular","label":"sistema modular"}]',
    sections_json = '[{"title":"Objetivo","items":["Construir un portfolio tecnico claro, mantenible y alineado con un perfil fullstack con foco en backend."]},{"title":"Arquitectura","items":["Componentes reutilizables, rutas separadas por seccion y datos centralizados para contenido profesional.","Sistema de themes e internacionalizacion resuelto desde frontend sin duplicar estructura."]},{"title":"Automatizacion","items":["Workflow de GitHub Actions para instalar dependencias y validar la build en push y pull request.","Base lista para conectar un deploy automatico en una siguiente etapa."]}]',
    features_json = '["Arquitectura modular","i18n y theming","Contenido centralizado","CI con GitHub Actions"]'
WHERE slug = 'portfolio-ferchuz'
  AND metrics_json IS NULL;
