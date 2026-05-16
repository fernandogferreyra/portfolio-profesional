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

    private String basePath = "./runtime/documents";
    private long maxFileSizeBytes = 10 * 1024 * 1024L;
    private List<String> allowedContentTypes = new ArrayList<>(List.of(
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/webp"));

    public Path getBasePath() {
        String configuredBasePath = basePath == null ? "" : basePath.trim();
        String effectiveBasePath = configuredBasePath.isEmpty() ? "./runtime/documents" : configuredBasePath;
        Path configuredPath = Paths.get(effectiveBasePath);

        if (configuredPath.isAbsolute()) {
            return configuredPath.normalize();
        }

        return resolveWorkspaceRoot().resolve(configuredPath).toAbsolutePath().normalize();
    }

    private Path resolveWorkspaceRoot() {
        Path currentDirectory = Paths.get(System.getProperty("user.dir", ".")).toAbsolutePath().normalize();

        if (isWorkspaceRoot(currentDirectory)) {
            return currentDirectory;
        }

        Path parentDirectory = currentDirectory.getParent();
        if (parentDirectory != null && "backend".equals(currentDirectory.getFileName().toString()) && isWorkspaceRoot(parentDirectory)) {
            return parentDirectory;
        }

        return currentDirectory;
    }

    private boolean isWorkspaceRoot(Path path) {
        return Files.isDirectory(path.resolve("backend")) && Files.isDirectory(path.resolve("frontend"));
    }

    @PostConstruct
    public void ensureDirectory() {
        Path resolvedBasePath = getBasePath();

        try {
            Files.createDirectories(resolvedBasePath);
        } catch (Exception exception) {
            throw new IllegalStateException("Document storage directory could not be created: " + resolvedBasePath, exception);
        }
    }
}
