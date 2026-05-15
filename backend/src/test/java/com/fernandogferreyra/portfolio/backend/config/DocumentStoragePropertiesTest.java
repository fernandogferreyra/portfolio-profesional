package com.fernandogferreyra.portfolio.backend.config;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Files;
import java.nio.file.Path;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

class DocumentStoragePropertiesTest {

    private final String originalUserDir = System.getProperty("user.dir");

    @TempDir
    Path tempDirectory;

    @AfterEach
    void restoreUserDir() {
        System.setProperty("user.dir", originalUserDir);
    }

    @Test
    void relativeStoragePathUsesWorkspaceRootWhenStartedFromRepositoryRoot() throws Exception {
        Path workspace = createWorkspace();
        System.setProperty("user.dir", workspace.toString());

        DocumentStorageProperties properties = new DocumentStorageProperties();
        properties.setBasePath("./runtime/documents");

        assertThat(properties.getBasePath()).isEqualTo(workspace.resolve("runtime/documents").toAbsolutePath().normalize());
    }

    @Test
    void relativeStoragePathUsesWorkspaceRootWhenStartedFromBackendDirectory() throws Exception {
        Path workspace = createWorkspace();
        System.setProperty("user.dir", workspace.resolve("backend").toString());

        DocumentStorageProperties properties = new DocumentStorageProperties();
        properties.setBasePath("./runtime/documents");

        assertThat(properties.getBasePath()).isEqualTo(workspace.resolve("runtime/documents").toAbsolutePath().normalize());
    }

    @Test
    void absoluteStoragePathIsRespected() throws Exception {
        Path workspace = createWorkspace();
        Path storage = tempDirectory.resolve("custom-documents");
        System.setProperty("user.dir", workspace.resolve("backend").toString());

        DocumentStorageProperties properties = new DocumentStorageProperties();
        properties.setBasePath(storage.toString());

        assertThat(properties.getBasePath()).isEqualTo(storage.toAbsolutePath().normalize());
    }

    private Path createWorkspace() throws Exception {
        Path workspace = tempDirectory.resolve("portfolio-profesional");
        Files.createDirectories(workspace.resolve("backend"));
        Files.createDirectories(workspace.resolve("frontend"));
        return workspace;
    }
}
