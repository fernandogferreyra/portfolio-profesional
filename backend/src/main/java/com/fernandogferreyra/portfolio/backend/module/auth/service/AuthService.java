package com.fernandogferreyra.portfolio.backend.module.auth.service;

import com.fernandogferreyra.portfolio.backend.module.auth.domain.dto.LoginRequest;
import com.fernandogferreyra.portfolio.backend.module.auth.domain.dto.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);
}
