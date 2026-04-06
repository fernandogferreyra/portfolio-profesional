package com.fernandogferreyra.portfolio.backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfiguration {

    @Bean
    OpenAPI portfolioOpenApi() {
        return new OpenAPI()
            .info(new Info()
                .title("Portfolio Backend API")
                .version("v1")
                .description("Backend V1 for Fernando Ferreyra's professional portfolio.")
                .contact(new Contact()
                    .name("Fernando Ferreyra")
                    .email("contact@portfolio.local")))
            .components(new Components()
                .addSecuritySchemes("bearerAuth", new SecurityScheme()
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")));
    }
}
