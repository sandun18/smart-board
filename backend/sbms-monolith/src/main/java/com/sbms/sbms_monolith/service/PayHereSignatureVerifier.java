package com.sbms.sbms_monolith.service;


import org.springframework.stereotype.Component;

import java.security.MessageDigest;

@Component
public class PayHereSignatureVerifier {

    private static final String SECRET = "PAYHERE_SECRET_KEY"; // dummy for now

    public boolean verify(String payload, String receivedHash) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] hashBytes = md.digest((payload + SECRET).getBytes());

            StringBuilder sb = new StringBuilder();
            for (byte b : hashBytes) {
                sb.append(String.format("%02x", b));
            }

            return sb.toString().equalsIgnoreCase(receivedHash);

        } catch (Exception e) {
            return false;
        }
    }
}
