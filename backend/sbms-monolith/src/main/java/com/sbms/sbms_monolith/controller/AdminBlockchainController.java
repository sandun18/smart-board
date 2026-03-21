package com.sbms.sbms_monolith.controller;

import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sbms.sbms_monolith.service.AgreementBlockchainService;

@RestController
@RequestMapping("/api/admin/blockchain")
@PreAuthorize("hasRole('ADMIN')")
public class AdminBlockchainController {

    private final AgreementBlockchainService blockchainService;

    public AdminBlockchainController(
            AgreementBlockchainService blockchainService
    ) {
        this.blockchainService = blockchainService;
    }

    // Validates the full agreement chain and returns an integrity status payload.
    @GetMapping("/validate")
    public Map<String, Object> validateBlockchain() {

        boolean valid = blockchainService.validateChain();

        return Map.of(
                "valid", valid,
                "message",
                valid
                        ? "Blockchain integrity intact"
                        : "Blockchain integrity compromised"
        );
    }
}
