package com.fernandogferreyra.portfolio.backend.controller;

import com.fernandogferreyra.portfolio.backend.domain.documents.model.DocumentDownload;
import com.fernandogferreyra.portfolio.backend.dto.ApiResponse;
import com.fernandogferreyra.portfolio.backend.dto.publiccontent.PublicContentBlockResponse;
import com.fernandogferreyra.portfolio.backend.service.PublicContentBlockService;
import com.fernandogferreyra.portfolio.backend.util.ApiPaths;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiPaths.API_BASE)
@RequiredArgsConstructor
public class PublicContentBlockController {

    private final PublicContentBlockService publicContentBlockService;

    @GetMapping("/content-blocks")
    public ApiResponse<List<PublicContentBlockResponse>> listContentBlocks() {
        return ApiResponse.success("Public content blocks retrieved", publicContentBlockService.getPublicBlocks());
    }

    @GetMapping("/content-blocks/{key}/{language}/document")
    public ResponseEntity<Resource> downloadContentBlockDocument(
        @PathVariable String key,
        @PathVariable String language
    ) {
        DocumentDownload download = publicContentBlockService.downloadPublishedBlockDocument(key, language);

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
