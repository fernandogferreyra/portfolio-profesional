package com.fernandogferreyra.portfolio.backend.module.contact.service;

import com.fernandogferreyra.portfolio.backend.module.contact.domain.dto.ContactRequest;
import com.fernandogferreyra.portfolio.backend.module.contact.domain.dto.ContactResponse;

public interface ContactService {

    ContactResponse submit(ContactRequest request);
}

