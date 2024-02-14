package com.teamadc.backend.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    // Expiration times
    private static final String secretKey = "pwc-team-adc";
    private static final String refreshSecretKey = "pwc-team-adc";
    private static final long ACCESS_TOKEN_EXPIRATION_TIME = 3_600_000; // 60 minutes
    private static final long REFRESH_TOKEN_EXPIRATION_TIME = 28_800_000; // 8 hours

    public String generateAccessToken(String userId, String role, String businessUnit) {
        return JWT.create()
                .withSubject(userId)
                .withClaim("role", role)
                .withClaim("businessUnit", businessUnit)
                .withExpiresAt(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION_TIME))
                .sign(Algorithm.HMAC512(secretKey.getBytes()));
    }

    public String generateRefreshToken(String userId) {
        return JWT.create()
                .withSubject(userId)
                .withExpiresAt(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION_TIME))
                .sign(Algorithm.HMAC512(refreshSecretKey.getBytes()));
    }
}