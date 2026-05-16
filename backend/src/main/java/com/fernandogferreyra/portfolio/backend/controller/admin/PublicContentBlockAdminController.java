package com.fernandogferreyra.portfolio.backend.controller.admin;

import com.fernandogferreyra.portfolio.backend.dto.ApiResponse;
import com.fernandogferreyra.portfolio.backend.dto.publiccontent.PublicContentBlockCreateRequest;
import com.fernandogferreyra.portfolio.backend.dto.publiccontent.PublicContentBlockResponse;
import com.fernandogferreyra.portfolio.backend.dto.publiccontent.PublicContentBlockUpdateRequest;
import com.fernandogferreyra.portfolio.backend.service.PublicContentBlockService;
import com.fernandogferreyra.portfolio.backend.util.ApiPaths;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiPaths.API_BASE + "/admin/content-blocks")
@RequiredArgsConstructor
public class PublicContentBlockAdminController {

    private final PublicContentBlockService publicContentBlockService;

    @GetMapping
    public ApiResponse<List<PublicContentBlockResponse>> listContentBlocks() {
        return ApiResponse.success("Admin public content blocks retrieved", publicContentBlockService.getAdminBlocks());
    }

    @PostMapping
    public ApiResponse<PublicContentBlockResponse> createContentBlock(
        @Valid @RequestBody PublicContentBlockCreateRequest request
    ) {
        return ApiResponse.success("Public content block created", publicContentBlockService.createBlock(request));
    }

    @PatchMapping("/{id}")
    public ApiResponse<PublicContentBlockResponse> updateContentBlock(
        @PathVariable UUID id,
        @Valid @RequestBody PublicContentBlockUpdateRequest request
    ) {
        return ApiResponse.success("Public content block updated", publicContentBlockService.updateBlock(id, request));
    }
}
