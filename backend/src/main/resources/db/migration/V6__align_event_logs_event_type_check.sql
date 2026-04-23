ALTER TABLE event_logs
DROP CONSTRAINT IF EXISTS event_logs_event_type_check;

ALTER TABLE event_logs
ADD CONSTRAINT event_logs_event_type_check
CHECK (
    event_type IN (
        'VISIT_HOME',
        'OPEN_PROJECT',
        'CONTACT_SUBMIT',
        'SECTION_VIEW',
        'PROJECT_INTERACTION',
        'CONTACT_INTERACTION',
        'QUOTE_INTERACTION',
        'ESTIMATOR_INTERACTION',
        'visit_home',
        'open_project',
        'contact_submit',
        'section_view',
        'project_interaction',
        'contact_interaction',
        'quote_interaction',
        'estimator_interaction'
    )
);
