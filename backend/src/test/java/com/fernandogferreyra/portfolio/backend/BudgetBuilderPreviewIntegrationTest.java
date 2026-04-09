package com.fernandogferreyra.portfolio.backend;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fernandogferreyra.portfolio.backend.repository.budgetbuilder.BudgetSnapshotRepository;
import org.junit.jupiter.api.BeforeEach;
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
class BudgetBuilderPreviewIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private BudgetSnapshotRepository budgetSnapshotRepository;

    @BeforeEach
    void cleanBudgets() {
        budgetSnapshotRepository.deleteAll();
    }

    @Test
    void previewEndpointRequiresAdminAuthentication() throws Exception {
        mockMvc.perform(post("/api/admin/budget-builder/preview")
                .contentType(MediaType.APPLICATION_JSON)
                .content(validPreviewRequest()))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void configurationEndpointReturnsActiveSnapshotOptions() throws Exception {
        String accessToken = loginAsBootstrapAdmin();

        mockMvc.perform(get("/api/admin/budget-builder/configuration/active")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("Budget configuration retrieved"))
            .andExpect(jsonPath("$.data.configurationSnapshotId").value("budget-builder-seed-v1"))
            .andExpect(jsonPath("$.data.currency").value("USD"))
            .andExpect(jsonPath("$.data.modules.length()").value(5))
            .andExpect(jsonPath("$.data.projectTypeDefaults.length()").value(6))
            .andExpect(jsonPath("$.data.surchargeRules.length()").value(8))
            .andExpect(jsonPath("$.data.maintenancePlans.length()").value(1));
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
            .andExpect(jsonPath("$.data.currency").value("USD"))
            .andExpect(jsonPath("$.data.totalHours").value(60.00))
            .andExpect(jsonPath("$.data.baseAmount").value(1038.00))
            .andExpect(jsonPath("$.data.oneTimeSubtotal").value(1038.00))
            .andExpect(jsonPath("$.data.monthlySubtotal").value(114.00))
            .andExpect(jsonPath("$.data.finalOneTimeTotal").value(1588.00))
            .andExpect(jsonPath("$.data.finalMonthlyTotal").value(114.00))
            .andExpect(jsonPath("$.data.modules.length()").value(5))
            .andExpect(jsonPath("$.data.modules[0].id").value("ANALYSIS_DISCOVERY"))
            .andExpect(jsonPath("$.data.surcharges.length()").value(2))
            .andExpect(jsonPath("$.data.discounts.length()").value(0));
    }

    @Test
    void adminCanSaveListAndReadBudgets() throws Exception {
        String accessToken = loginAsBootstrapAdmin();
        String previewResponse = mockMvc.perform(post("/api/admin/budget-builder/preview")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(validPreviewRequest()))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();

        JsonNode previewJson = objectMapper.readTree(previewResponse);
        String configurationSnapshotId = previewJson.path("data").path("configurationSnapshotId").asText();
        String previewHash = previewJson.path("data").path("previewHash").asText();

        String savePayload = objectMapper.writeValueAsString(objectMapper.createObjectNode()
            .put("expectedConfigurationSnapshotId", configurationSnapshotId)
            .put("expectedPreviewHash", previewHash)
            .set("input", objectMapper.readTree(validPreviewRequest())));

        String saveResponse = mockMvc.perform(post("/api/admin/budget-builder")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(savePayload))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("Budget saved successfully"))
            .andReturn()
            .getResponse()
            .getContentAsString();

        JsonNode saveJson = objectMapper.readTree(saveResponse);
        String budgetId = saveJson.path("data").path("id").asText();

        mockMvc.perform(get("/api/admin/budget-builder")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("Budgets retrieved"))
            .andExpect(jsonPath("$.data.length()").value(1))
            .andExpect(jsonPath("$.data[0].id").value(budgetId))
            .andExpect(jsonPath("$.data[0].finalOneTimeTotal").value(1588.00));

        mockMvc.perform(get("/api/admin/budget-builder/{id}", budgetId)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("Budget retrieved"))
            .andExpect(jsonPath("$.data.id").value(budgetId))
            .andExpect(jsonPath("$.data.configurationSnapshotId").value("budget-builder-seed-v1"))
            .andExpect(jsonPath("$.data.requestJson.projectType").value("standard_project"))
            .andExpect(jsonPath("$.data.resultJson.finalOneTimeTotal").value(1588.00));
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
              "selectedModuleIds": [
                "ANALYSIS_DISCOVERY",
                "BACKEND_DEVELOPMENT",
                "FRONTEND_DELIVERY",
                "QA_VALIDATION",
                "DEPLOY_RELEASE"
              ],
              "moduleSelectionMode": "EXPLICIT",
              "selectedSurchargeRuleIds": [
                "hosting-licenses-fixed",
                "management-contingency-fixed"
              ],
              "supportEnabled": true,
              "supportPlanId": "support-basic",
              "maintenancePlanId": "maintenance-standard",
              "notes": []
            }
            """;
    }
}
