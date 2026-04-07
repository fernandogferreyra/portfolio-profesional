package com.fernandogferreyra.portfolio.backend.module.contact.repository;

import com.fernandogferreyra.portfolio.backend.module.contact.domain.entity.ContactMessage;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, UUID> {
}
