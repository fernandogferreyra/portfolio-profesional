package com.fernandogferreyra.portfolio.backend.service;

import com.fernandogferreyra.portfolio.backend.dto.publiccontent.PublicContentBlockResponse;
import com.fernandogferreyra.portfolio.backend.dto.publiccontent.PublicContentBlockUpdateRequest;
import java.util.List;
import java.util.UUID;

public interface PublicContentBlockService {

    List<PublicContentBlockResponse> getPublicBlocks();

    List<PublicContentBlockResponse> getAdminBlocks();

    PublicContentBlockResponse updateBlock(UUID id, PublicContentBlockUpdateRequest request);
}
