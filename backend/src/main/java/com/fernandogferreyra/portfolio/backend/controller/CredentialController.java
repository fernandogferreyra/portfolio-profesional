package com.fernandogferreyra.portfolio.backend.controller;

import com.fernandogferreyra.portfolio.backend.domain.documents.model.DocumentDownload;
import com.fernandogferreyra.portfolio.backend.dto.ApiResponse;
import com.fernandogferreyra.portfolio.backend.dto.credentials.CredentialResponse;
import com.fernandogferreyra.portfolio.backend.service.CredentialService;
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
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiPaths.API_BASE + "/credentials")
@RequiredArgsConstructor
public class CredentialController {

    private final CredentialService credentialService;

    @GetMapping
    public ApiResponse<List<CredentialResponse>> listCredentials() {
        return ApiResponse.success("Credentials retrieved", credentialService.getPublicCredentials());
    }

    @GetMapping("/{id}/document")
    public ResponseEntity<Resource> downloadCredentialDocument(@PathVariable UUID id) {
        DocumentDownload download = credentialService.downloadPublishedCredentialDocument(id);

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
