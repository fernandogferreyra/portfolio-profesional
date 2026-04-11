package com.fernandogferreyra.portfolio.backend.service;

import com.fernandogferreyra.portfolio.backend.dto.contact.ContactRequest;
import com.fernandogferreyra.portfolio.backend.dto.contact.ContactMessageAdminDetailResponse;
import com.fernandogferreyra.portfolio.backend.dto.contact.ContactMessageAdminSummaryResponse;
import com.fernandogferreyra.portfolio.backend.dto.contact.ContactMessageReplyRequest;
import com.fernandogferreyra.portfolio.backend.dto.contact.ContactResponse;
import com.fernandogferreyra.portfolio.backend.domain.enums.ContactMessageStatus;
import java.util.List;
import java.util.UUID;

public interface ContactService {

    ContactResponse submit(ContactRequest request);

    List<ContactMessageAdminSummaryResponse> getMessages(ContactMessageStatus status);

    ContactMessageAdminDetailResponse getMessageById(UUID id);

    ContactMessageAdminDetailResponse updateStatus(UUID id, ContactMessageStatus status);

    ContactMessageAdminDetailResponse replyToMessage(UUID id, ContactMessageReplyRequest request);
}
