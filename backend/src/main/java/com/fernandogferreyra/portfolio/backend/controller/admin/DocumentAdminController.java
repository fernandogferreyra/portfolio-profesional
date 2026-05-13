package com.fernandogferreyra.portfolio.backend.controller.admin;

import com.fernandogferreyra.portfolio.backend.dto.ApiResponse;
import com.fernandogferreyra.portfolio.backend.dto.documents.DocumentAdminResponse;
import com.fernandogferreyra.portfolio.backend.service.DocumentService;
import com.fernandogferreyra.portfolio.backend.util.ApiPaths;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(ApiPaths.API_BASE + "/admin/documents")
@RequiredArgsConstructor
public class DocumentAdminController {

    private final DocumentService documentService;

    @GetMapping
    public ApiResponse<List<DocumentAdminResponse>> listDocuments() {
        return ApiResponse.success("Documents retrieved", documentService.getAdminDocuments());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<DocumentAdminResponse> uploadDocument(
        @RequestPart("file") MultipartFile file,
        @RequestParam String purpose
    ) {
        return ApiResponse.success("Document uploaded", documentService.uploadDocument(file, purpose));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteDocument(@PathVariable UUID id) {
        documentService.deleteDocument(id);
        return ApiResponse.success("Document deleted", null);
    }
}
