package com.fernandogferreyra.portfolio.backend.controller.admin;

import com.fernandogferreyra.portfolio.backend.domain.enums.ContactMessageStatus;
import com.fernandogferreyra.portfolio.backend.dto.ApiResponse;
import com.fernandogferreyra.portfolio.backend.dto.contact.ContactMessageAdminDetailResponse;
import com.fernandogferreyra.portfolio.backend.dto.contact.ContactMessageAdminSummaryResponse;
import com.fernandogferreyra.portfolio.backend.dto.contact.ContactMessageReplyRequest;
import com.fernandogferreyra.portfolio.backend.dto.contact.ContactMessageStatusUpdateRequest;
import com.fernandogferreyra.portfolio.backend.service.ContactService;
import com.fernandogferreyra.portfolio.backend.util.ApiPaths;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiPaths.API_BASE + "/admin/contact-messages")
@RequiredArgsConstructor
public class ContactMessageAdminController {

    private final ContactService contactService;

    @GetMapping
    public ApiResponse<List<ContactMessageAdminSummaryResponse>> listMessages(
        @RequestParam(required = false) ContactMessageStatus status
    ) {
        return ApiResponse.success("Contact messages retrieved", contactService.getMessages(status));
    }

    @GetMapping("/{id}")
    public ApiResponse<ContactMessageAdminDetailResponse> getMessage(@PathVariable UUID id) {
        return ApiResponse.success("Contact message retrieved", contactService.getMessageById(id));
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<ContactMessageAdminDetailResponse> updateStatus(
        @PathVariable UUID id,
        @Valid @RequestBody ContactMessageStatusUpdateRequest request
    ) {
        return ApiResponse.success("Contact message status updated", contactService.updateStatus(id, request.status()));
    }

    @PostMapping("/{id}/reply")
    public ApiResponse<ContactMessageAdminDetailResponse> reply(
        @PathVariable UUID id,
        @Valid @RequestBody ContactMessageReplyRequest request
    ) {
        return ApiResponse.success("Contact reply sent", contactService.replyToMessage(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteMessage(@PathVariable UUID id) {
        contactService.deleteMessage(id);
        return ApiResponse.success("Contact message deleted", null);
    }
}
