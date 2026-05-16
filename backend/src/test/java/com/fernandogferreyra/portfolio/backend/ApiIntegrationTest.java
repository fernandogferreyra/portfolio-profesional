package com.fernandogferreyra.portfolio.backend;

import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

import com.fernandogferreyra.portfolio.backend.config.DocumentStorageProperties;
import com.fernandogferreyra.portfolio.backend.domain.enums.ContactMessageStatus;
import com.fernandogferreyra.portfolio.backend.domain.enums.EventType;
import com.fernandogferreyra.portfolio.backend.repository.analytics.EventLogRepository;
import com.fernandogferreyra.portfolio.backend.repository.contact.ContactMessageRepository;
import com.fernandogferreyra.portfolio.backend.repository.documents.DocumentContentRepository;
import com.fernandogferreyra.portfolio.backend.repository.documents.DocumentRepository;
import com.fernandogferreyra.portfolio.backend.repository.publiccontent.PublicContentBlockRepository;
import java.nio.file.Files;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ApiIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @Autowired
    private EventLogRepository eventLogRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private DocumentContentRepository documentContentRepository;

    @Autowired
    private DocumentStorageProperties documentStorageProperties;

    @Autowired
    private PublicContentBlockRepository publicContentBlockRepository;

    @BeforeEach
    void cleanMutableTables() {
        contactMessageRepository.deleteAll();
        eventLogRepository.deleteAll();
        documentContentRepository.deleteAll();
        documentRepository.deleteAll();
    }

    @Test
    void healthEndpointReturnsOk() throws Exception {
        mockMvc.perform(get("/api/health"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.status").value("ok"));
    }

    @Test
    void contactEndpointPersistsMessage() throws Exception {
        mockMvc.perform(post("/api/contact")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "name": "Fernando Ferreyra",
                      "email": "FER@EXAMPLE.COM",
                      "message": "Quiero conversar sobre una oportunidad backend.",
                      "source": "portfolio-web",
                      "context": "contact-form",
                      "language": "es",
                      "userAgent": "Mozilla/5.0",
                      "submittedAt": "2026-04-06T16:00:00Z",
                      "extraField": "ignored"
                    }
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("Message received successfully"))
            .andExpect(jsonPath("$.data.id").isNotEmpty())
            .andExpect(jsonPath("$.data.createdAt").isNotEmpty());

        var persistedMessages = contactMessageRepository.findAll();
        org.junit.jupiter.api.Assertions.assertEquals(1, persistedMessages.size());
        org.junit.jupiter.api.Assertions.assertEquals(ContactMessageStatus.NEW, persistedMessages.get(0).getStatus());
        org.junit.jupiter.api.Assertions.assertEquals("fer@example.com", persistedMessages.get(0).getEmail());
        org.junit.jupiter.api.Assertions.assertEquals("Portfolio contact", persistedMessages.get(0).getSubject());
        org.junit.jupiter.api.Assertions.assertEquals("portfolio-web", persistedMessages.get(0).getSource());
        org.junit.jupiter.api.Assertions.assertEquals("contact-form", persistedMessages.get(0).getContext());
        org.junit.jupiter.api.Assertions.assertEquals("es", persistedMessages.get(0).getLanguage());
        org.junit.jupiter.api.Assertions.assertEquals("Mozilla/5.0", persistedMessages.get(0).getUserAgent());
        org.junit.jupiter.api.Assertions.assertNotNull(persistedMessages.get(0).getSubmittedAt());
    }

    @Test
    void contactEndpointValidatesPayload() throws Exception {
        mockMvc.perform(post("/api/contact")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "name": "",
                      "email": "invalid",
                      "message": "   "
                    }
                    """))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"))
            .andExpect(jsonPath("$.errors[*].field", hasItems("name", "email", "message")));
    }

    @Test
    void projectsEndpointReturnsMockData() throws Exception {
        mockMvc.perform(get("/api/projects"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data[0].slug").value("obrasmart"))
            .andExpect(jsonPath("$.data[0].demoUrl").value("https://www.youtube.com/watch?v=8qTf_oowQiY"))
            .andExpect(jsonPath("$.data[0].monographUrl").value("/docs/MonografiaObraSmart.pdf"));
    }

    @Test
    void adminCanReadAndUpdateProjects() throws Exception {
        String accessToken = loginAsAdmin();

        String projectId = mockMvc.perform(get("/api/admin/projects")
                .header(org.springframework.http.HttpHeaders.AUTHORIZATION, "Bearer " + accessToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data[0].slug").value("obrasmart"))
            .andReturn()
            .getResponse()
            .getContentAsString();

        String selectedId = new com.fasterxml.jackson.databind.ObjectMapper()
            .readTree(projectId)
            .path("data")
            .get(0)
            .path("id")
            .asText();

        mockMvc.perform(patch("/api/admin/projects/{id}", selectedId)
                .header(org.springframework.http.HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "slug": "obrasmart",
                      "name": "ObraSmart Suite",
                      "year": "2026",
                      "category": "distributed_platform",
                      "summary": "Operational suite for project maintenance and internal field coordination.",
                      "repositoryUrl": "https://github.com/example/obrasmart-suite",
                      "demoUrl": "https://www.youtube.com/watch?v=8qTf_oowQiY",
                      "monographUrl": "/docs/MonografiaObraSmart.pdf",
                      "iconDocumentId": null,
                      "stack": ["Java 17", "Spring Boot", "PostgreSQL", "Angular"],
                      "metrics": [{"value": "12", "label": "servicios"}],
                      "sections": [{"title": "Objetivo", "items": ["Centralizar operacion"]}],
                      "features": ["Repositorio actualizado"],
                      "documentationDocumentIds": [],
                      "screenshotDocumentIds": [],
                      "featured": true,
                      "published": true,
                      "displayOrder": 1
                    }
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.name").value("ObraSmart Suite"))
            .andExpect(jsonPath("$.data.year").value("2026"))
            .andExpect(jsonPath("$.data.summary").value("Operational suite for project maintenance and internal field coordination."))
            .andExpect(jsonPath("$.data.stack", hasSize(4)))
            .andExpect(jsonPath("$.data.repositoryUrl").value("https://github.com/example/obrasmart-suite"))
            .andExpect(jsonPath("$.data.demoUrl").value("https://www.youtube.com/watch?v=8qTf_oowQiY"))
            .andExpect(jsonPath("$.data.monographUrl").value("/docs/MonografiaObraSmart.pdf"));
    }

    @Test
    void publicContentBlocksEndpointReturnsPublishedBlocks() throws Exception {
        mockMvc.perform(get("/api/content-blocks"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data[0].key").value("about.hero"))
            .andExpect(jsonPath("$.data[0].language").value("es"));
    }

    @Test
    void credentialsEndpointReturnsPublishedCredentials() throws Exception {
        mockMvc.perform(get("/api/credentials"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data[*].title", hasItems("Tecnicatura Universitaria en Programacion")))
            .andExpect(jsonPath("$.data[*].institution", hasItems("UTN FRC")));
    }

    @Test
    void adminCanReadAndUpdatePublicContentBlocks() throws Exception {
        String accessToken = loginAsAdmin();

        String responseBody = mockMvc.perform(get("/api/admin/content-blocks")
                .header(org.springframework.http.HttpHeaders.AUTHORIZATION, "Bearer " + accessToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data[0].key").value("about.hero"))
            .andReturn()
            .getResponse()
            .getContentAsString();

        String selectedId = new com.fasterxml.jackson.databind.ObjectMapper()
            .readTree(responseBody)
            .path("data")
            .get(0)
            .path("id")
            .asText();

        mockMvc.perform(patch("/api/admin/content-blocks/{id}", selectedId)
                .header(org.springframework.http.HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "title": "Editable public hero",
                      "body": "Backend managed public copy.",
                      "items": ["Backend", "CMS"],
                      "published": true,
                      "displayOrder": 8
                    }
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.title").value("Editable public hero"))
            .andExpect(jsonPath("$.data.items", hasSize(2)))
            .andExpect(jsonPath("$.data.displayOrder").value(8));
    }

    @Test
    void adminCanCreatePublicContentBlock() throws Exception {
        String accessToken = loginAsAdmin();
        String contentKey = "home.technical.test-" + UUID.randomUUID();

        mockMvc.perform(post("/api/admin/content-blocks")
                .header(org.springframework.http.HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "key": "%s",
                      "language": "es",
                      "title": "Nueva experiencia tecnica",
                      "body": "Bloque creado desde EditMode.",
                      "items": ["Diagnostico", "Implementacion"],
                      "documentId": null,
                      "published": true,
                      "displayOrder": 240
                    }
                    """.formatted(contentKey)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.key").value(contentKey))
            .andExpect(jsonPath("$.data.items", hasSize(2)))
            .andExpect(jsonPath("$.data.published").value(true));
    }

    @Test
    void adminCanCreateAndDeleteProject() throws Exception {
        String accessToken = loginAsAdmin();

        String createdProjectBody = mockMvc.perform(post("/api/admin/projects")
                .header(org.springframework.http.HttpHeaders.AUTHORIZATION, "Bearer " + accessToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.slug").value("nuevo-proyecto"))
            .andExpect(jsonPath("$.data.published").value(false))
            .andReturn()
            .getResponse()
            .getContentAsString();

        String projectId = new com.fasterxml.jackson.databind.ObjectMapper()
            .readTree(createdProjectBody)
            .path("data")
            .path("id")
            .asText();

        mockMvc.perform(delete("/api/admin/projects/{id}", projectId)
                .header(org.springframework.http.HttpHeaders.AUTHORIZATION, "Bearer " + accessToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Project deleted"));
    }

    @Test
    void adminAiTranslateRequiresAuthentication() throws Exception {
        mockMvc.perform(post("/api/admin/ai/translate")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "text": "Resumen profesional",
                      "sourceLanguage": "es",
                      "targetLanguage": "en"
                    }
                    """))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void adminAiTranslateReportsMissingProviderConfiguration() throws Exception {
        String accessToken = loginAsAdmin();

        mockMvc.perform(post("/api/admin/ai/translate")
                .header(org.springframework.http.HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "text": "Resumen profesional",
                      "sourceLanguage": "es",
                      "targetLanguage": "en",
                      "context": "Portfolio CMS"
                    }
                    """))
            .andExpect(status().isServiceUnavailable())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("AI provider is not configured"));
    }

    @Test
    void adminCanLinkDocumentToPublicContentBlockAndPublicCanDownloadItWithoutFilesystemCache() throws Exception {
        String accessToken = loginAsAdmin();
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "profile-cv.pdf",
            "application/pdf",
            "fake-pdf-content".getBytes());

        String uploadedDocumentBody = mockMvc.perform(multipart("/api/admin/documents")
                .file(file)
                .param("purpose", "cv")
                .header(org.springframework.http.HttpHeaders.AUTHORIZATION, "Bearer " + accessToken))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();

        String documentId = new com.fasterxml.jackson.databind.ObjectMapper()
            .readTree(uploadedDocumentBody)
            .path("data")
            .path("id")
            .asText();

        String blocksBody = mockMvc.perform(get("/api/admin/content-blocks")
                .header(org.springframework.http.HttpHeaders.AUTHORIZATION, "Bearer " + accessToken))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();

        com.fasterxml.jackson.databind.JsonNode blocks = new com.fasterxml.jackson.databind.ObjectMapper()
            .readTree(blocksBody)
            .path("data");
        String cvBlockId = null;
        for (com.fasterxml.jackson.databind.JsonNode block : blocks) {
            if ("contact.cv".equals(block.path("key").asText()) && "es".equals(block.path("language").asText())) {
                cvBlockId = block.path("id").asText();
                break;
            }
        }

        org.junit.jupiter.api.Assertions.assertNotNull(cvBlockId);

        mockMvc.perform(patch("/api/admin/content-blocks/{id}", cvBlockId)
                .header(org.springframework.http.HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "title": "CV",
                      "body": "Resumen profesional actualizado.",
                      "items": [],
                      "documentId": "%s",
                      "published": true,
                      "displayOrder": 40
                    }
                    """.formatted(documentId)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.documentId").value(documentId))
            .andExpect(jsonPath("$.data.documentUrl").value("/api/content-blocks/contact.cv/es/document"));

        var document = documentRepository.findById(UUID.fromString(documentId)).orElseThrow();
        Files.deleteIfExists(documentStorageProperties.getBasePath().resolve(document.getStoragePath()));

        mockMvc.perform(get("/api/content-blocks/contact.cv/es/document"))
            .andExpect(status().isOk())
            .andExpect(content().contentType("application/pdf"))
            .andExpect(content().string("fake-pdf-content"));
    }

    @Test
    void adminCanCreateCredentialLinkDocumentAndPublicCanDownloadIt() throws Exception {
        String accessToken = loginAsAdmin();

        String createdCredentialBody = mockMvc.perform(post("/api/admin/credentials")
                .header(org.springframework.http.HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "language": "es"
                    }
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.published").value(false))
            .andReturn()
            .getResponse()
            .getContentAsString();

        String credentialId = new com.fasterxml.jackson.databind.ObjectMapper()
            .readTree(createdCredentialBody)
            .path("data")
            .path("id")
            .asText();

        MockMultipartFile file = new MockMultipartFile(
            "file",
            "utn-diploma.pdf",
            "application/pdf",
            "credential-pdf-content".getBytes());

        String uploadedDocumentBody = mockMvc.perform(multipart("/api/admin/documents")
                .file(file)
                .param("purpose", "credential")
                .header(org.springframework.http.HttpHeaders.AUTHORIZATION, "Bearer " + accessToken))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();

        String documentId = new com.fasterxml.jackson.databind.ObjectMapper()
            .readTree(uploadedDocumentBody)
            .path("data")
            .path("id")
            .asText();

        mockMvc.perform(patch("/api/admin/credentials/{id}", credentialId)
                .header(org.springframework.http.HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "language": "es",
                      "type": "Formacion",
                      "title": "Diplomatura Backend",
                      "institution": "UTN FRC",
                      "description": "Documento academico cargado desde EditMode.",
                      "documentId": "%s",
                      "published": false,
                      "displayOrder": 5
                    }
                    """.formatted(documentId)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.documentId").value(documentId));

        mockMvc.perform(get("/api/admin/credentials/{id}/document", credentialId)
                .header(org.springframework.http.HttpHeaders.AUTHORIZATION, "Bearer " + accessToken))
            .andExpect(status().isOk())
            .andExpect(content().contentType("application/pdf"))
            .andExpect(content().string("credential-pdf-content"));

        mockMvc.perform(patch("/api/admin/credentials/{id}", credentialId)
                .header(org.springframework.http.HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "language": "es",
                      "type": "Formacion",
                      "title": "Diplomatura Backend",
                      "institution": "UTN FRC",
                      "description": "Documento academico cargado desde EditMode.",
                      "documentId": "%s",
                      "published": true,
                      "displayOrder": 5
                    }
                    """.formatted(documentId)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.documentId").value(documentId))
            .andExpect(jsonPath("$.data.documentUrl").value("/api/credentials/" + credentialId + "/document"));

        mockMvc.perform(get("/api/credentials/{id}/document", credentialId))
            .andExpect(status().isOk())
            .andExpect(content().contentType("application/pdf"))
            .andExpect(content().string("credential-pdf-content"));
    }

    @Test
    void adminCanUploadAndListDocuments() throws Exception {
        String accessToken = loginAsAdmin();

        MockMultipartFile file = new MockMultipartFile(
            "file",
            "profile-cv.pdf",
            "application/pdf",
            "fake-pdf-content".getBytes());

        mockMvc.perform(multipart("/api/admin/documents")
                .file(file)
                .param("purpose", "cv")
                .header(org.springframework.http.HttpHeaders.AUTHORIZATION, "Bearer " + accessToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.purpose").value("cv"))
            .andExpect(jsonPath("$.data.originalFilename").value("profile-cv.pdf"))
            .andExpect(jsonPath("$.data.contentType").value("application/pdf"))
            .andExpect(jsonPath("$.data.sizeBytes").value(file.getSize()));

        mockMvc.perform(get("/api/admin/documents")
                .header(org.springframework.http.HttpHeaders.AUTHORIZATION, "Bearer " + accessToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data", hasSize(1)))
            .andExpect(jsonPath("$.data[0].purpose").value("cv"))
            .andExpect(jsonPath("$.data[0].originalFilename").value("profile-cv.pdf"));
    }

    @Test
    void adminCanDeleteDocumentAndUnlinkCmsBlocks() throws Exception {
        String accessToken = loginAsAdmin();
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "old-cv.pdf",
            "application/pdf",
            "old-pdf-content".getBytes());

        String uploadedDocumentBody = mockMvc.perform(multipart("/api/admin/documents")
                .file(file)
                .param("purpose", "cv")
                .header(org.springframework.http.HttpHeaders.AUTHORIZATION, "Bearer " + accessToken))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();

        String documentId = new com.fasterxml.jackson.databind.ObjectMapper()
            .readTree(uploadedDocumentBody)
            .path("data")
            .path("id")
            .asText();

        String cvBlockId = publicContentBlockRepository.findAllByOrderByDisplayOrderAscContentKeyAscLanguageAsc()
            .stream()
            .filter(block -> "contact.cv".equals(block.getContentKey()) && "es".equals(block.getLanguage()))
            .findFirst()
            .orElseThrow()
            .getId()
            .toString();

        mockMvc.perform(patch("/api/admin/content-blocks/{id}", cvBlockId)
                .header(org.springframework.http.HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "title": "CV",
                      "body": "Resumen profesional actualizado.",
                      "items": [],
                      "documentId": "%s",
                      "published": true,
                      "displayOrder": 40
                    }
                    """.formatted(documentId)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.documentId").value(documentId));

        var document = documentRepository.findById(UUID.fromString(documentId)).orElseThrow();
        Files.deleteIfExists(documentStorageProperties.getBasePath().resolve(document.getStoragePath()));

        mockMvc.perform(delete("/api/admin/documents/{id}", documentId)
                .header(org.springframework.http.HttpHeaders.AUTHORIZATION, "Bearer " + accessToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Document deleted"));

        org.junit.jupiter.api.Assertions.assertFalse(documentRepository.existsById(UUID.fromString(documentId)));
        org.junit.jupiter.api.Assertions.assertFalse(documentContentRepository.existsById(UUID.fromString(documentId)));
        org.junit.jupiter.api.Assertions.assertTrue(publicContentBlockRepository.findAllByDocumentId(UUID.fromString(documentId)).isEmpty());

        mockMvc.perform(get("/api/content-blocks/contact.cv/es/document"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.message").value("Public content block has no linked document"));
    }

    @Test
    void adminUploadRejectsUnsupportedDocumentType() throws Exception {
        String accessToken = loginAsAdmin();

        MockMultipartFile file = new MockMultipartFile(
            "file",
            "notes.txt",
            "text/plain",
            "plain-text".getBytes());

        mockMvc.perform(multipart("/api/admin/documents")
                .file(file)
                .param("purpose", "support_file")
                .header(org.springframework.http.HttpHeaders.AUTHORIZATION, "Bearer " + accessToken))
            .andExpect(status().isUnsupportedMediaType())
            .andExpect(jsonPath("$.message").value("Document type is not allowed"));
    }

    @Test
    void eventsEndpointPersistsEventLog() throws Exception {
        mockMvc.perform(post("/api/events")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "eventType": "contact_submit",
                      "source": "portfolio-web",
                      "path": "/contact",
                      "reference": "contact-form",
                      "metadata": {
                        "language": "es"
                      }
                    }
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.eventType").value("contact_submit"));

        var persistedEvents = eventLogRepository.findAll();
        org.junit.jupiter.api.Assertions.assertEquals(1, persistedEvents.size());
        org.junit.jupiter.api.Assertions.assertEquals(EventType.CONTACT_SUBMIT, persistedEvents.get(0).getEventType());
        org.junit.jupiter.api.Assertions.assertEquals("portfolio-web", persistedEvents.get(0).getSource());
        org.junit.jupiter.api.Assertions.assertTrue(persistedEvents.get(0).getMetadataJson().contains("\"path\":\"/contact\""));
    }

    @Test
    void adminCanReadTrackedEvents() throws Exception {
        mockMvc.perform(post("/api/events")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "eventType": "section_view",
                      "source": "portfolio-web",
                      "path": "/projects",
                      "reference": "view:projects",
                      "metadata": {
                        "action": "view:projects",
                        "label": "Proyectos",
                        "route": "/projects"
                      }
                    }
                    """))
            .andExpect(status().isOk());

        String accessToken = loginAsAdmin();

        mockMvc.perform(get("/api/admin/events")
                .header(org.springframework.http.HttpHeaders.AUTHORIZATION, "Bearer " + accessToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("Events retrieved"))
            .andExpect(jsonPath("$.data.length()").value(1))
            .andExpect(jsonPath("$.data[0].type").value("section_view"))
            .andExpect(jsonPath("$.data[0].action").value("view:projects"))
            .andExpect(jsonPath("$.data[0].label").value("Proyectos"))
            .andExpect(jsonPath("$.data[0].route").value("/projects"));
    }

    @Test
    void adminCanReadAndReplyToContactMessages() throws Exception {
        mockMvc.perform(post("/api/contact")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "name": "Ana Cliente",
                      "email": "ana@example.com",
                      "subject": "Consulta freelance",
                      "message": "Necesito una propuesta para una web interna.",
                      "source": "portfolio-web",
                      "context": "contact-form",
                      "language": "es",
                      "userAgent": "Chrome",
                      "submittedAt": "2026-04-11T10:15:00Z"
                    }
                    """))
            .andExpect(status().isOk());

        var messageId = contactMessageRepository.findAll().get(0).getId();
        String accessToken = loginAsAdmin();

        mockMvc.perform(get("/api/admin/contact-messages")
                .header(org.springframework.http.HttpHeaders.AUTHORIZATION, "Bearer " + accessToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data", hasSize(1)))
            .andExpect(jsonPath("$.data[0].name").value("Ana Cliente"))
            .andExpect(jsonPath("$.data[0].messagePreview").value("Necesito una propuesta para una web interna."))
            .andExpect(jsonPath("$.data[0].status").value("NEW"));

        mockMvc.perform(patch("/api/admin/contact-messages/{id}/status", messageId)
                .header(org.springframework.http.HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "status": "SPAM"
                    }
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.status").value("SPAM"));

        mockMvc.perform(patch("/api/admin/contact-messages/{id}/status", messageId)
                .header(org.springframework.http.HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "status": "TRASH"
                    }
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.status").value("TRASH"));

        mockMvc.perform(patch("/api/admin/contact-messages/{id}/status", messageId)
                .header(org.springframework.http.HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "status": "READ"
                    }
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.status").value("READ"));

        mockMvc.perform(post("/api/admin/contact-messages/{id}/reply", messageId)
                .header(org.springframework.http.HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "subject": "Re: Consulta freelance",
                      "message": "Gracias por escribir. Te respondo hoy con mas detalle."
                    }
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.status").value("REPLIED"))
            .andExpect(jsonPath("$.data.replyMessage").value("Gracias por escribir. Te respondo hoy con mas detalle."))
            .andExpect(jsonPath("$.data.repliedBy").value("ferchuz"));

        mockMvc.perform(delete("/api/admin/contact-messages/{id}", messageId)
                .header(org.springframework.http.HttpHeaders.AUTHORIZATION, "Bearer " + accessToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true));

        org.junit.jupiter.api.Assertions.assertTrue(contactMessageRepository.findById(messageId).isEmpty());
    }

    private String loginAsAdmin() throws Exception {
        String loginResponse = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "username": "ferchuz",
                      "password": "ferchuz-test-password"
                    }
                    """))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();

        return new com.fasterxml.jackson.databind.ObjectMapper()
            .readTree(loginResponse)
            .path("data")
            .path("accessToken")
            .asText();
    }
}
