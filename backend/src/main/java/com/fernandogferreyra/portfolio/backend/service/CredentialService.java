package com.fernandogferreyra.portfolio.backend.service;

import com.fernandogferreyra.portfolio.backend.domain.documents.model.DocumentDownload;
import com.fernandogferreyra.portfolio.backend.dto.credentials.CredentialCreateRequest;
import com.fernandogferreyra.portfolio.backend.dto.credentials.CredentialResponse;
import com.fernandogferreyra.portfolio.backend.dto.credentials.CredentialUpdateRequest;
import java.util.List;
import java.util.UUID;

public interface CredentialService {

    List<CredentialResponse> getPublicCredentials();

    List<CredentialResponse> getAdminCredentials();

    CredentialResponse createCredential(CredentialCreateRequest request);

    CredentialResponse updateCredential(UUID id, CredentialUpdateRequest request);

    DocumentDownload downloadPublishedCredentialDocument(UUID id);
}
