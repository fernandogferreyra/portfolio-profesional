package com.fernandogferreyra.portfolio.backend.service.impl;

import com.fernandogferreyra.portfolio.backend.domain.publiccontent.entity.PublicContentBlockEntity;
import com.fernandogferreyra.portfolio.backend.dto.publiccontent.PublicContentBlockResponse;
import com.fernandogferreyra.portfolio.backend.dto.publiccontent.PublicContentBlockUpdateRequest;
import com.fernandogferreyra.portfolio.backend.mapper.publiccontent.PublicContentBlockMapper;
import com.fernandogferreyra.portfolio.backend.repository.publiccontent.PublicContentBlockRepository;
import com.fernandogferreyra.portfolio.backend.service.PublicContentBlockService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class PublicContentBlockServiceImpl implements PublicContentBlockService {

    private final PublicContentBlockMapper publicContentBlockMapper;
    private final PublicContentBlockRepository publicContentBlockRepository;

    @Override
    @Transactional(readOnly = true)
    public List<PublicContentBlockResponse> getPublicBlocks() {
        return publicContentBlockRepository.findByPublishedTrueOrderByDisplayOrderAscContentKeyAscLanguageAsc()
            .stream()
            .map(publicContentBlockMapper::toResponse)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PublicContentBlockResponse> getAdminBlocks() {
        return publicContentBlockRepository.findAllByOrderByDisplayOrderAscContentKeyAscLanguageAsc()
            .stream()
            .map(publicContentBlockMapper::toResponse)
            .toList();
    }

    @Override
    @Transactional
    public PublicContentBlockResponse updateBlock(UUID id, PublicContentBlockUpdateRequest request) {
        PublicContentBlockEntity entity = publicContentBlockRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Public content block not found"));

        publicContentBlockMapper.applyUpdate(entity, request);
        return publicContentBlockMapper.toResponse(publicContentBlockRepository.save(entity));
    }
}
