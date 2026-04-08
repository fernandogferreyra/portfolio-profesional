package com.fernandogferreyra.portfolio.backend;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
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
class BudgetBuilderPreviewIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void previewEndpointRequiresAdminAuthentication() throws Exception {
        mockMvc.perform(post("/api/admin/budget-builder/preview")
                .contentType(MediaType.APPLICATION_JSON)
                .content(validPreviewRequest()))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void previewEndpointReturnsOfficialBackendCalculation() throws Exception {
        String accessToken = loginAsBootstrapAdmin();

        mockMvc.perform(post("/api/admin/budget-builder/preview")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(validPreviewRequest()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("Budget preview generated successfully"))
            .andExpect(jsonPath("$.data.configurationSnapshotId").value("budget-builder-seed-v1"))
            .andExpect(jsonPath("$.data.previewHash").isNotEmpty())
            .andExpect(jsonPath("$.data.totalHours").value(25.00))
            .andExpect(jsonPath("$.data.baseAmount").value(450.00))
            .andExpect(jsonPath("$.data.oneTimeSubtotal").value(450.00))
            .andExpect(jsonPath("$.data.monthlySubtotal").value(24.00))
            .andExpect(jsonPath("$.data.finalOneTimeTotal").value(750.00))
            .andExpect(jsonPath("$.data.finalMonthlyTotal").value(24.00))
            .andExpect(jsonPath("$.data.modules.length()").value(2))
            .andExpect(jsonPath("$.data.modules[0].id").value("DISCOVERY"))
            .andExpect(jsonPath("$.data.surcharges.length()").value(1))
            .andExpect(jsonPath("$.data.surcharges[0].code").value("management_contingency_fixed"))
            .andExpect(jsonPath("$.data.discounts.length()").value(0))
            .andExpect(jsonPath("$.data.explanation.length()").value(4));
    }

    private String loginAsBootstrapAdmin() throws Exception {
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

        JsonNode loginJson = objectMapper.readTree(loginResponse);
        return loginJson.path("data").path("accessToken").asText();
    }

    private String validPreviewRequest() {
        return """
            {
              "budgetName": "Operations MVP",
              "projectType": "standard_project",
              "pricingMode": "PROJECT",
              "desiredStackId": "default_web_stack",
              "complexity": "MEDIUM",
              "urgency": "STANDARD",
              "selectedModuleIds": ["DISCOVERY", "CORE_BACKEND"],
              "moduleSelectionMode": "EXPLICIT",
              "selectedSurchargeRuleIds": ["management-contingency-fixed"],
              "supportEnabled": true,
              "supportPlanId": "support-basic",
              "notes": []
            }
            """;
    }
}
