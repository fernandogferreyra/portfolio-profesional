ALTER TABLE projects
ADD COLUMN IF NOT EXISTS demo_url VARCHAR(400);

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS monograph_url VARCHAR(400);

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS icon_document_id UUID;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_projects_icon_document'
    ) THEN
        ALTER TABLE projects
        ADD CONSTRAINT fk_projects_icon_document
        FOREIGN KEY (icon_document_id) REFERENCES documents(id) ON DELETE SET NULL;
    END IF;
END $$;

UPDATE projects
SET demo_url = 'https://www.youtube.com/watch?v=8qTf_oowQiY'
WHERE slug = 'obrasmart'
  AND demo_url IS NULL;

UPDATE projects
SET monograph_url = '/docs/MonografiaObraSmart.pdf'
WHERE slug = 'obrasmart'
  AND monograph_url IS NULL;

UPDATE projects
SET repository_url = 'https://github.com/fernandogferreyra/portfolio-profesional.git'
WHERE slug = 'portfolio-ferchuz'
  AND repository_url IS NULL;
