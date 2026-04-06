package com.fernandogferreyra.portfolio.backend.domain.enums;

public enum ProjectCategory {
    DISTRIBUTED_PLATFORM("distributed_platform"),
    FRONTEND_SYSTEM("frontend_system"),
    CERTIFICATION("certification"),
    ASSET("asset"),
    QUOTE("quote");

    private final String value;

    ProjectCategory(String value) {
        this.value = value;
    }

    public String value() {
        return value;
    }
}
