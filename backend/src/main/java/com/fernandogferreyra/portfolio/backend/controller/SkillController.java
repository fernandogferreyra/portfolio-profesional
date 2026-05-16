package com.fernandogferreyra.portfolio.backend.controller;

import com.fernandogferreyra.portfolio.backend.domain.documents.model.DocumentDownload;
import com.fernandogferreyra.portfolio.backend.dto.ApiResponse;
import com.fernandogferreyra.portfolio.backend.dto.skills.SkillCategoryResponse;
import com.fernandogferreyra.portfolio.backend.service.SkillCatalogService;
import com.fernandogferreyra.portfolio.backend.util.ApiPaths;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiPaths.API_BASE + "/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillCatalogService skillCatalogService;

    @GetMapping
    public ApiResponse<List<SkillCategoryResponse>> listSkills(@RequestParam(defaultValue = "es") String language) {
        return ApiResponse.success("Skills retrieved", skillCatalogService.getPublicCatalog(language));
    }

    @GetMapping("/{id}/icon")
    public ResponseEntity<Resource> downloadSkillIcon(@PathVariable UUID id) {
        DocumentDownload download = skillCatalogService.downloadSkillIcon(id);

        return ResponseEntity.ok()
            .contentType(resolveMediaType(download.contentType()))
            .contentLength(download.sizeBytes())
            .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.inline().filename(download.originalFilename()).build().toString())
            .body(download.resource());
    }

    private MediaType resolveMediaType(String contentType) {
        if (contentType == null || contentType.isBlank()) {
            return MediaType.APPLICATION_OCTET_STREAM;
        }

        try {
            return MediaType.parseMediaType(contentType);
        } catch (Exception exception) {
            return MediaType.APPLICATION_OCTET_STREAM;
        }
    }
}
