package com.fernandogferreyra.portfolio.backend.service.impl;

import com.fernandogferreyra.portfolio.backend.dto.contact.ContactRequest;
import com.fernandogferreyra.portfolio.backend.dto.contact.ContactResponse;
import com.fernandogferreyra.portfolio.backend.domain.contact.entity.ContactMessage;
import com.fernandogferreyra.portfolio.backend.mapper.contact.ContactMessageMapper;
import com.fernandogferreyra.portfolio.backend.repository.contact.ContactMessageRepository;
import com.fernandogferreyra.portfolio.backend.service.ContactService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class ContactServiceImpl implements ContactService {

    private final ContactMessageMapper contactMessageMapper;
    private final ContactMessageRepository contactMessageRepository;

    @Override
    @Transactional
    public ContactResponse submit(ContactRequest request) {
        ContactMessage contactMessage = contactMessageMapper.toEntity(request);
        ContactMessage savedMessage = contactMessageRepository.save(contactMessage);

        log.info("Contact message persisted with id={} from {}", savedMessage.getId(), savedMessage.getEmail());
        return contactMessageMapper.toResponse(savedMessage);
    }
}
