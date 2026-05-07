DO $$
DECLARE
    constraint_record RECORD;
BEGIN
    FOR constraint_record IN
        SELECT conname
        FROM pg_constraint
        WHERE conrelid = 'contact_messages'::regclass
          AND contype = 'c'
          AND pg_get_constraintdef(oid) ILIKE '%status%'
    LOOP
        EXECUTE format('ALTER TABLE contact_messages DROP CONSTRAINT IF EXISTS %I', constraint_record.conname);
    END LOOP;
END $$;

ALTER TABLE contact_messages
ADD CONSTRAINT contact_messages_status_check
CHECK (status IN ('NEW', 'READ', 'REPLIED', 'ARCHIVED', 'SPAM', 'TRASH'));
