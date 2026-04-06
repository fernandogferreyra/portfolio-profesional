package com.fernandogferreyra.portfolio.backend.module.contact.controller;

import com.fernandogferreyra.portfolio.backend.domain.dto.ApiResponse;
import com.fernandogferreyra.portfolio.backend.module.contact.domain.dto.ContactRequest;
import com.fernandogferreyra.portfolio.backend.module.contact.domain.dto.ContactResponse;
import com.fernandogferreyra.portfolio.backend.module.contact.service.ContactService;
import com.fernandogferreyra.portfolio.backend.util.ApiPaths;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiPaths.API_BASE)
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping("/contact")
    public ApiResponse<ContactResponse> submit(@Valid @RequestBody ContactRequest request) {
        return ApiResponse.success("Contact message accepted", contactService.submit(request));
    }
}

