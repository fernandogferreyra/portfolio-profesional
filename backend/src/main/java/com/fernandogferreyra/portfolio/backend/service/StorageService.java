package com.fernandogferreyra.portfolio.backend.service;

import com.fernandogferreyra.portfolio.backend.domain.documents.model.StoredDocumentFile;
import java.io.IOException;
import java.io.InputStream;

public interface StorageService {

    StoredDocumentFile store(String storedFilename, InputStream inputStream) throws IOException;
}
