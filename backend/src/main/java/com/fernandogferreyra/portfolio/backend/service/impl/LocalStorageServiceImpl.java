package com.fernandogferreyra.portfolio.backend.service.impl;

import com.fernandogferreyra.portfolio.backend.config.DocumentStorageProperties;
import com.fernandogferreyra.portfolio.backend.domain.documents.model.StoredDocumentFile;
import com.fernandogferreyra.portfolio.backend.service.StorageService;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LocalStorageServiceImpl implements StorageService {

    private final DocumentStorageProperties documentStorageProperties;

    @Override
    public StoredDocumentFile store(String storedFilename, InputStream inputStream) throws IOException {
        Path basePath = documentStorageProperties.getBasePath();
        Path targetPath = basePath.resolve(storedFilename).normalize();

        Files.createDirectories(basePath);
        Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);

        return new StoredDocumentFile(storedFilename, basePath.relativize(targetPath).toString().replace('\\', '/'));
    }
}
