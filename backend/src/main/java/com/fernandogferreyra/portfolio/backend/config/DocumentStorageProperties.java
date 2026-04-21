package com.fernandogferreyra.portfolio.backend.config;

import jakarta.annotation.PostConstruct;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "app.document-storage")
public class DocumentStorageProperties {

    private Path basePath = Paths.get("../.runtime/documents").toAbsolutePath().normalize();
    private long maxFileSizeBytes = 10 * 1024 * 1024L;
    private List<String> allowedContentTypes = new ArrayList<>(List.of(
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/webp"));

    public void setBasePath(Path basePath) {
        if (basePath == null) {
            this.basePath = null;
            return;
        }

        this.basePath = basePath.toAbsolutePath().normalize();
    }

    @PostConstruct
    public void ensureDirectory() {
        try {
            if (basePath != null) {
                Files.createDirectories(basePath);
            }
        } catch (Exception exception) {
            throw new IllegalStateException("Document storage directory could not be created: " + basePath, exception);
        }
    }
}
