package com.fernandogferreyra.portfolio.backend.service;

import com.fernandogferreyra.portfolio.backend.dto.auth.LoginRequest;
import com.fernandogferreyra.portfolio.backend.dto.auth.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);
}
