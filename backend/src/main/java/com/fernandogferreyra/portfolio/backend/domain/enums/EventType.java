package com.fernandogferreyra.portfolio.backend.domain.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import java.util.Arrays;

public enum EventType {
    VISIT_HOME("visit_home"),
    OPEN_PROJECT("open_project"),
    CONTACT_SUBMIT("contact_submit"),
    SECTION_VIEW("section_view"),
    PROJECT_INTERACTION("project_interaction"),
    CONTACT_INTERACTION("contact_interaction"),
    QUOTE_INTERACTION("quote_interaction"),
    ESTIMATOR_INTERACTION("estimator_interaction");

    private final String value;

    EventType(String value) {
        this.value = value;
    }

    @JsonValue
    public String value() {
        return value;
    }

    @JsonCreator
    public static EventType fromValue(String value) {
        return Arrays.stream(values())
            .filter(eventType -> eventType.value.equalsIgnoreCase(value))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Unknown event type: " + value));
    }
}
