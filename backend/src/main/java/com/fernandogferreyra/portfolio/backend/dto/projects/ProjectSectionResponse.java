package com.fernandogferreyra.portfolio.backend.dto.projects;

import java.util.List;

public record ProjectSectionResponse(
    String title,
    List<String> items
) {
}
