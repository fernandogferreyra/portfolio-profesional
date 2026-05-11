package com.fernandogferreyra.portfolio.backend.controller;

import com.fernandogferreyra.portfolio.backend.dto.ApiResponse;
import com.fernandogferreyra.portfolio.backend.dto.publiccontent.PublicContentBlockResponse;
import com.fernandogferreyra.portfolio.backend.service.PublicContentBlockService;
import com.fernandogferreyra.portfolio.backend.util.ApiPaths;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiPaths.API_BASE)
@RequiredArgsConstructor
public class PublicContentBlockController {

    private final PublicContentBlockService publicContentBlockService;

    @GetMapping("/content-blocks")
    public ApiResponse<List<PublicContentBlockResponse>> listContentBlocks() {
        return ApiResponse.success("Public content blocks retrieved", publicContentBlockService.getPublicBlocks());
    }
}
