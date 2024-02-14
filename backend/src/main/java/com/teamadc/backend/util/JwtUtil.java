package com.teamadc.backend.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import com.teamadc.backend.enums.Role;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    // Expiration times
    private static final String secretKey = "pwc-team-adc";
    private static final String refreshSecretKey = "pwc-team-adc";
    private static final long ACCESS_TOKEN_EXPIRATION_TIME = 3_600_000; // 60 minutes
    private static final long REFRESH_TOKEN_EXPIRATION_TIME = 28_800_000; // 8 hours

    public String generateAccessToken(String userId, String role, String businessUnit, String firstName, String lastName) {
        return JWT.create()
                .withSubject(userId)
                .withClaim("role", role)
                .withClaim("businessUnit", businessUnit)
                .withClaim("firstName", firstName)
                .withClaim("lastName", lastName)
                .withExpiresAt(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION_TIME))
                .sign(Algorithm.HMAC512(secretKey.getBytes()));
    }

    public String generateRefreshToken(String userId) {
        return JWT.create()
                .withSubject(userId)
                .withExpiresAt(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION_TIME))
                .sign(Algorithm.HMAC512(refreshSecretKey.getBytes()));
    }

    public String getUserIdFromToken(String token) {
        DecodedJWT decodedJWT = decodeToken(token);
        return decodedJWT.getSubject();
    }

    public Role getRoleFromToken(String token) {
        DecodedJWT decodedJWT = decodeToken(token);
        Claim roleClaim = decodedJWT.getClaim("role");
        return Role.stringToRole(roleClaim.asString());
    }

    public DecodedJWT decodeToken(String token) {
        Algorithm algorithm = Algorithm.HMAC512(secretKey.getBytes());
        JWTVerifier verifier = JWT.require(algorithm).build();
        return verifier.verify(token);
    }

    public boolean isTokenExpired(String token) {
        try {
            DecodedJWT decodedJWT = decodeToken(token);
            return decodedJWT.getExpiresAt().before(new Date());
        } catch (TokenExpiredException e) {
            // Token is expired
            return true;
        } catch (Exception e) {
            // Other exceptions can be handled here if necessary
            throw e;
        }
    }
}