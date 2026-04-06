package com.fernandogferreyra.portfolio.backend;

import static org.hamcrest.Matchers.hasItems;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fernandogferreyra.portfolio.backend.domain.enums.ContactMessageStatus;
import com.fernandogferreyra.portfolio.backend.domain.enums.EventType;
import com.fernandogferreyra.portfolio.backend.module.analytics.repository.EventLogRepository;
import com.fernandogferreyra.portfolio.backend.module.contact.repository.ContactMessageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @Autowired
    private EventLogRepository eventLogRepository;

    @BeforeEach
    void cleanMutableTables() {
        contactMessageRepository.deleteAll();
        eventLogRepository.deleteAll();
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
            .andExpect(jsonPath("$.data[0].slug").value("obrasmart"));
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
}
