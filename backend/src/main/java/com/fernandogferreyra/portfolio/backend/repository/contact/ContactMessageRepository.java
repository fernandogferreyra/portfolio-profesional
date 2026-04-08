package com.fernandogferreyra.portfolio.backend.repository.contact;

import com.fernandogferreyra.portfolio.backend.domain.contact.entity.ContactMessage;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, UUID> {
}
