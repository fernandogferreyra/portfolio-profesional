CREATE TABLE IF NOT EXISTS credentials (
    id UUID PRIMARY KEY,
    language VARCHAR(8) NOT NULL,
    credential_type VARCHAR(80) NOT NULL,
    title VARCHAR(220) NOT NULL,
    institution VARCHAR(180) NOT NULL,
    description TEXT NOT NULL,
    document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    published BOOLEAN NOT NULL,
    display_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_credentials_public_order
    ON credentials (published, language, display_order, title);

INSERT INTO credentials (id, language, credential_type, title, institution, description, document_id, published, display_order, created_at, updated_at)
SELECT '3e516c1d-7d65-4217-b40d-94239a936f01', 'es',
       'Formacion',
       'Tecnicatura Universitaria en Programacion',
       'UTN FRC',
       'Base academica orientada a programacion, logica, bases de datos y desarrollo de software.',
       NULL, TRUE, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM credentials WHERE id = '3e516c1d-7d65-4217-b40d-94239a936f01');

INSERT INTO credentials (id, language, credential_type, title, institution, description, document_id, published, display_order, created_at, updated_at)
SELECT '3e516c1d-7d65-4217-b40d-94239a936f02', 'en',
       'Education',
       'University Programming Technician',
       'UTN FRC',
       'Academic foundation focused on programming, logic, databases, and software development.',
       NULL, TRUE, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM credentials WHERE id = '3e516c1d-7d65-4217-b40d-94239a936f02');
