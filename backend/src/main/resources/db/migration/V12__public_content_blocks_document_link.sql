ALTER TABLE public_content_blocks
ADD COLUMN IF NOT EXISTS document_id UUID;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_public_content_blocks_document'
    ) THEN
        ALTER TABLE public_content_blocks
        ADD CONSTRAINT fk_public_content_blocks_document
        FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE SET NULL;
    END IF;
END $$;
