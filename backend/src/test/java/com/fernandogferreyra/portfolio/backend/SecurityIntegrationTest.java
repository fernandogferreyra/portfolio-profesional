package com.fernandogferreyra.portfolio.backend;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fernandogferreyra.portfolio.backend.domain.dto.ApiResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(SecurityIntegrationTest.AdminProbeController.class)
class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void loginEndpointReturnsJwtForBootstrapAdmin() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "username": "ferchuz",
                      "password": "ferchuz-test-password"
                    }
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("Login successful"))
            .andExpect(jsonPath("$.data.accessToken").isNotEmpty())
            .andExpect(jsonPath("$.data.tokenType").value("Bearer"))
            .andExpect(jsonPath("$.data.username").value("ferchuz"))
            .andExpect(jsonPath("$.data.role").value("ROLE_FERCHUZ"));
    }

    @Test
    void loginEndpointRejectsInvalidCredentials() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "username": "ferchuz",
                      "password": "wrong-password"
                    }
                    """))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.code").value("UNAUTHORIZED"))
            .andExpect(jsonPath("$.message").value("Invalid credentials"));
    }

    @Test
    void adminRouteRequiresValidRoleToken() throws Exception {
        mockMvc.perform(get("/api/admin/probe"))
            .andExpect(status().isUnauthorized());

        String loginResponseBody = mockMvc.perform(post("/api/auth/login")
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

        JsonNode loginResponse = objectMapper.readTree(loginResponseBody);
        String accessToken = loginResponse.path("data").path("accessToken").asText();

        mockMvc.perform(get("/api/admin/probe")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data").value("ok"));
    }

    @RestController
    static class AdminProbeController {

        @GetMapping("/api/admin/probe")
        public ApiResponse<String> probe() {
            return ApiResponse.success("Admin route is available", "ok");
        }
    }
}
