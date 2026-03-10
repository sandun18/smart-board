package com.sbms.sbms_monolith.controller;


import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.sbms.sbms_monolith.service.AgreementBlockchainService;

@RestController
@RequestMapping("/api/admin/blockchain")
public class AdminBlockchainController {

    private final AgreementBlockchainService blockchainService;

    public AdminBlockchainController(
            AgreementBlockchainService blockchainService
    ) {
        this.blockchainService = blockchainService;
    }

    // 🔐 ADMIN ONLY
    @GetMapping("/validate")
    @PreAuthorize("hasRole('ADMIN')")
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
