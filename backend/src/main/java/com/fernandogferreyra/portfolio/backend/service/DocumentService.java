package com.fernandogferreyra.portfolio.backend.service;

import com.fernandogferreyra.portfolio.backend.dto.documents.DocumentAdminResponse;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface DocumentService {

    List<DocumentAdminResponse> getAdminDocuments();

    DocumentAdminResponse uploadDocument(MultipartFile file, String purpose);
}
