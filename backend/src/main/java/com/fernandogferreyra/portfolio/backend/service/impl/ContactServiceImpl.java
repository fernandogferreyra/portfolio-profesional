package com.fernandogferreyra.portfolio.backend.service.impl;

import com.fernandogferreyra.portfolio.backend.config.ContactMailProperties;
import com.fernandogferreyra.portfolio.backend.domain.enums.ContactMessageStatus;
import com.fernandogferreyra.portfolio.backend.dto.contact.ContactRequest;
import com.fernandogferreyra.portfolio.backend.dto.contact.ContactMessageAdminDetailResponse;
import com.fernandogferreyra.portfolio.backend.dto.contact.ContactMessageAdminSummaryResponse;
import com.fernandogferreyra.portfolio.backend.dto.contact.ContactMessageReplyRequest;
import com.fernandogferreyra.portfolio.backend.dto.contact.ContactResponse;
import com.fernandogferreyra.portfolio.backend.domain.contact.entity.ContactMessage;
import com.fernandogferreyra.portfolio.backend.mapper.contact.ContactMessageMapper;
import com.fernandogferreyra.portfolio.backend.repository.contact.ContactMessageRepository;
import com.fernandogferreyra.portfolio.backend.service.ContactService;
import com.fernandogferreyra.portfolio.backend.service.EmailService;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Slf4j
@RequiredArgsConstructor
public class ContactServiceImpl implements ContactService {

    private static final Sort MESSAGE_SORT = Sort.by(Sort.Direction.DESC, "createdAt");

    private final ContactMessageMapper contactMessageMapper;
    private final ContactMessageRepository contactMessageRepository;
    private final EmailService emailService;
    private final ContactMailProperties contactMailProperties;

    @Override
    @Transactional
    public ContactResponse submit(ContactRequest request) {
        ContactMessage contactMessage = contactMessageMapper.toEntity(request);
        ContactMessage savedMessage = contactMessageRepository.save(contactMessage);

        deliverPostSubmitEmails(savedMessage);

        log.info("Contact message persisted with id={} from {}", savedMessage.getId(), savedMessage.getEmail());
        return contactMessageMapper.toResponse(savedMessage);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactMessageAdminSummaryResponse> getMessages(ContactMessageStatus status) {
        List<ContactMessage> messages = status == null
            ? contactMessageRepository.findAll(MESSAGE_SORT)
            : contactMessageRepository.findAllByStatus(status, MESSAGE_SORT);

        return messages.stream()
            .map(contactMessageMapper::toAdminSummary)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ContactMessageAdminDetailResponse getMessageById(UUID id) {
        return contactMessageMapper.toAdminDetail(findMessage(id));
    }

    @Override
    @Transactional
    public ContactMessageAdminDetailResponse updateStatus(UUID id, ContactMessageStatus status) {
        ContactMessage message = findMessage(id);
        message.setStatus(status);
        return contactMessageMapper.toAdminDetail(contactMessageRepository.save(message));
    }

    @Override
    @Transactional
    public ContactMessageAdminDetailResponse replyToMessage(UUID id, ContactMessageReplyRequest request) {
        ContactMessage message = findMessage(id);
        String replyBody = request.message().trim();
        String replySubject = resolveReplySubject(message, request.subject());

        emailService.send(new EmailService.EmailMessage(
            message.getEmail(),
            contactMailProperties.inboxAddress(),
            replySubject,
            replyBody + "\n\n" + contactMailProperties.autoReplySignature()
        ));

        message.setReplyMessage(replyBody);
        message.setRepliedAt(OffsetDateTime.now());
        message.setRepliedBy(resolveCurrentUser());
        message.setStatus(ContactMessageStatus.REPLIED);

        return contactMessageMapper.toAdminDetail(contactMessageRepository.save(message));
    }

    private ContactMessage findMessage(UUID id) {
        return contactMessageRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contact message not found"));
    }

    private String resolveCurrentUser() {
        String name = SecurityContextHolder.getContext().getAuthentication() != null
            ? SecurityContextHolder.getContext().getAuthentication().getName()
            : null;
        return name == null || name.isBlank() ? "system" : name;
    }

    private String resolveReplySubject(ContactMessage message, String requestedSubject) {
        if (requestedSubject != null && !requestedSubject.isBlank()) {
            return requestedSubject.trim();
        }

        return "Re: " + message.getSubject();
    }

    private void sendInboxNotification(ContactMessage message) {
        if (contactMailProperties.inboxAddress() == null || contactMailProperties.inboxAddress().isBlank()) {
            return;
        }

        emailService.send(new EmailService.EmailMessage(
            contactMailProperties.inboxAddress(),
            message.getEmail(),
            "[Portfolio] " + message.getSubject(),
            buildInboxNotificationBody(message)
        ));
    }

    private void sendAutoReply(ContactMessage message) {
        emailService.send(new EmailService.EmailMessage(
            message.getEmail(),
            contactMailProperties.inboxAddress(),
            resolveAutoReplySubject(message.getLanguage()),
            buildAutoReplyBody(message)
        ));
    }

    private void deliverPostSubmitEmails(ContactMessage message) {
        try {
            sendInboxNotification(message);
        } catch (Exception exception) {
            log.warn("Unable to send inbox notification for contact message id={}", message.getId(), exception);
        }

        try {
            sendAutoReply(message);
        } catch (Exception exception) {
            log.warn("Unable to send auto-reply for contact message id={} recipient={}", message.getId(), message.getEmail(), exception);
        }
    }

    private String resolveAutoReplySubject(String language) {
        return "en".equalsIgnoreCase(language)
            ? contactMailProperties.autoReplySubjectEn()
            : contactMailProperties.autoReplySubjectEs();
    }

    private String buildInboxNotificationBody(ContactMessage message) {
        return "Nuevo mensaje desde el portfolio\n\n"
            + "Nombre: " + message.getName() + "\n"
            + "Email: " + message.getEmail() + "\n"
            + "Asunto: " + message.getSubject() + "\n"
            + "Contexto: " + safe(message.getContext()) + "\n"
            + "Idioma: " + safe(message.getLanguage()) + "\n\n"
            + message.getMessage();
    }

    private String buildAutoReplyBody(ContactMessage message) {
        boolean english = "en".equalsIgnoreCase(message.getLanguage());
        return english
            ? "Hi " + message.getName() + ",\n\nThanks for reaching out through the portfolio. I received your message and will review it soon.\n\n"
                + contactMailProperties.autoReplySignature()
            : "Hola " + message.getName() + ",\n\nGracias por contactarte desde el portfolio. Ya recibi tu mensaje y lo voy a revisar en breve.\n\n"
                + contactMailProperties.autoReplySignature();
    }

    private String safe(String value) {
        return value == null || value.isBlank() ? "-" : value;
    }
}
