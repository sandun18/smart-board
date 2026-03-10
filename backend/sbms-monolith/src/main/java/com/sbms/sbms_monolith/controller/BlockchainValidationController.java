package com.sbms.sbms_monolith.controller;


import com.sbms.sbms_monolith.service.AgreementBlockchainService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/blockchain")
public class BlockchainValidationController {

    @Autowired
    private AgreementBlockchainService blockchainService;

    /**
     * Validates entire agreement blockchain
     * ADMIN or SYSTEM access recommended
     */
    @GetMapping("/validate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> validateBlockchain() {

        boolean valid =
                blockchainService.validateChain();

        return ResponseEntity.ok(
                Map.of(
                        "valid", valid,
                        "message",
                        valid
                            ? "Blockchain integrity verified"
                            : "Blockchain has been tampered"
                )
        );
    }
    
    @GetMapping("/validate/{registrationId}")
    public ResponseEntity<?> validateSingleBlock(
            @PathVariable Long registrationId
    ) {

        boolean valid =
                blockchainService.validateBlock(registrationId);

        return ResponseEntity.ok(
                Map.of(
                        "registrationId", registrationId,
                        "valid", valid,
                        "message",
                        valid
                            ? "Agreement block is valid"
                            : "Agreement block has been tampered or missing"
                )
        );
    }
}

