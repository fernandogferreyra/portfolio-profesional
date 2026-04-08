package com.fernandogferreyra.portfolio.backend.service;

import com.fernandogferreyra.portfolio.backend.dto.contact.ContactRequest;
import com.fernandogferreyra.portfolio.backend.dto.contact.ContactResponse;

public interface ContactService {

    ContactResponse submit(ContactRequest request);
}

