package com.fernandogferreyra.portfolio.backend.repository.contact;

import com.fernandogferreyra.portfolio.backend.domain.contact.entity.ContactMessage;
import com.fernandogferreyra.portfolio.backend.domain.enums.ContactMessageStatus;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, UUID> {

    java.util.List<ContactMessage> findAllByStatus(ContactMessageStatus status, Sort sort);
}
