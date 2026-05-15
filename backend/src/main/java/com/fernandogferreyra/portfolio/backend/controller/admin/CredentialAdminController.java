package com.fernandogferreyra.portfolio.backend.controller.admin;

import com.fernandogferreyra.portfolio.backend.dto.ApiResponse;
import com.fernandogferreyra.portfolio.backend.dto.credentials.CredentialCreateRequest;
import com.fernandogferreyra.portfolio.backend.dto.credentials.CredentialResponse;
import com.fernandogferreyra.portfolio.backend.dto.credentials.CredentialUpdateRequest;
import com.fernandogferreyra.portfolio.backend.service.CredentialService;
import com.fernandogferreyra.portfolio.backend.util.ApiPaths;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiPaths.API_BASE + "/admin/credentials")
@RequiredArgsConstructor
public class CredentialAdminController {

    private final CredentialService credentialService;

    @GetMapping
    public ApiResponse<List<CredentialResponse>> listCredentials() {
        return ApiResponse.success("Admin credentials retrieved", credentialService.getAdminCredentials());
    }

    @PostMapping
    public ApiResponse<CredentialResponse> createCredential(@Valid @RequestBody CredentialCreateRequest request) {
        return ApiResponse.success("Credential created", credentialService.createCredential(request));
    }

    @PatchMapping("/{id}")
    public ApiResponse<CredentialResponse> updateCredential(
        @PathVariable UUID id,
        @Valid @RequestBody CredentialUpdateRequest request
    ) {
        return ApiResponse.success("Credential updated", credentialService.updateCredential(id, request));
    }
}
