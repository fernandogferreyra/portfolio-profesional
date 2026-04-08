package com.fernandogferreyra.portfolio.backend.controller;

import com.fernandogferreyra.portfolio.backend.dto.ApiResponse;
import com.fernandogferreyra.portfolio.backend.dto.contact.ContactRequest;
import com.fernandogferreyra.portfolio.backend.dto.contact.ContactResponse;
import com.fernandogferreyra.portfolio.backend.service.ContactService;
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
        return ApiResponse.success("Message received successfully", contactService.submit(request));
    }
}

