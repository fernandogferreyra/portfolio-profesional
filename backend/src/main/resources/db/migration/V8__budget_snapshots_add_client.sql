ALTER TABLE budget_snapshots
    ADD COLUMN IF NOT EXISTS client VARCHAR(160);

UPDATE budget_snapshots
SET client = 'Legacy client'
WHERE client IS NULL OR BTRIM(client) = '';

ALTER TABLE budget_snapshots
    ALTER COLUMN client SET NOT NULL;
