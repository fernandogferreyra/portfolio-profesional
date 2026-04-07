package com.fernandogferreyra.portfolio.backend;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fernandogferreyra.portfolio.backend.module.quote.repository.QuoteRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class QuoteIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private QuoteRepository quoteRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void cleanQuotes() {
        quoteRepository.deleteAll();
    }

    @Test
    void quoteEndpointCalculatesHoursAndCost() throws Exception {
        mockMvc.perform(post("/api/quote")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "projectType": "saas-platform",
                      "modules": ["discovery", "authentication", "core-backend", "dashboard"],
                      "complexity": "HIGH"
                    }
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("Quote generated successfully"))
            .andExpect(jsonPath("$.data.projectType").value("SAAS_PLATFORM"))
            .andExpect(jsonPath("$.data.projectLabel").value("SaaS platform"))
            .andExpect(jsonPath("$.data.complexity").value("HIGH"))
            .andExpect(jsonPath("$.data.hourlyRate").value(35.00))
            .andExpect(jsonPath("$.data.totalHours").value(197.21))
            .andExpect(jsonPath("$.data.totalCost").value(6902.35))
            .andExpect(jsonPath("$.data.items.length()").value(4))
            .andExpect(jsonPath("$.data.items[0].name").value("Discovery and planning"))
            .andExpect(jsonPath("$.data.items[0].hours").value(21.12))
            .andExpect(jsonPath("$.data.items[0].cost").value(739.20));

        org.junit.jupiter.api.Assertions.assertEquals(1, quoteRepository.count());
        var persistedQuote = quoteRepository.findAll().get(0);
        org.junit.jupiter.api.Assertions.assertEquals("SAAS_PLATFORM", persistedQuote.getProjectType());
        org.junit.jupiter.api.Assertions.assertNotNull(persistedQuote.getRequestJson());
        org.junit.jupiter.api.Assertions.assertNotNull(persistedQuote.getResultJson());
    }

    @Test
    void quoteEndpointRejectsUnsupportedModule() throws Exception {
        mockMvc.perform(post("/api/quote")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "projectType": "corporate_website",
                      "modules": ["unknown-module"],
                      "complexity": "MEDIUM"
                    }
                    """))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("Unsupported module: UNKNOWN_MODULE"));
    }

    @Test
    void adminCanListAndReadPersistedQuotes() throws Exception {
        String createQuoteResponse = mockMvc.perform(post("/api/quote")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "projectType": "corporate_website",
                      "modules": ["discovery", "ui_foundation"],
                      "complexity": "MEDIUM"
                    }
                    """))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();

        JsonNode createdQuote = objectMapper.readTree(createQuoteResponse);
        org.junit.jupiter.api.Assertions.assertEquals(1, quoteRepository.count());
        String quoteId = quoteRepository.findAll().get(0).getId().toString();
        org.junit.jupiter.api.Assertions.assertEquals("CORPORATE_WEBSITE", createdQuote.path("data").path("projectType").asText());

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

        String accessToken = objectMapper.readTree(loginResponse).path("data").path("accessToken").asText();

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/api/admin/quotes")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("Quotes retrieved"))
            .andExpect(jsonPath("$.data.length()").value(1))
            .andExpect(jsonPath("$.data[0].id").value(quoteId))
            .andExpect(jsonPath("$.data[0].projectType").value("CORPORATE_WEBSITE"));

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/api/admin/quotes/{id}", quoteId)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("Quote retrieved"))
            .andExpect(jsonPath("$.data.id").value(quoteId))
            .andExpect(jsonPath("$.data.projectType").value("CORPORATE_WEBSITE"))
            .andExpect(jsonPath("$.data.requestJson.projectType").value("corporate_website"))
            .andExpect(jsonPath("$.data.resultJson.projectType").value("CORPORATE_WEBSITE"));
    }
}
