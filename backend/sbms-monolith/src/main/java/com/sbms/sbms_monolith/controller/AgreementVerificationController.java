package com.sbms.sbms_monolith.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.sbms.sbms_monolith.model.AgreementBlock;
import com.sbms.sbms_monolith.model.Registration;
import com.sbms.sbms_monolith.repository.AgreementBlockRepository;
import com.sbms.sbms_monolith.repository.RegistrationRepository;
import com.sbms.sbms_monolith.service.S3Service;
import com.sbms.sbms_monolith.util.HashUtil;

@RestController
@RequestMapping("/api/verify")
public class AgreementVerificationController {

    private final RegistrationRepository registrationRepo;
    private final AgreementBlockRepository blockRepo;
    private final S3Service s3Service;

    public AgreementVerificationController(
            RegistrationRepository registrationRepo,
            AgreementBlockRepository blockRepo,
            S3Service s3Service
    ) {
        this.registrationRepo = registrationRepo;
        this.blockRepo = blockRepo;
        this.s3Service = s3Service;
    }

    // ================= MODEL 1: QR / SERVER SIDE =================

    @GetMapping("/{registrationId}")
    public Map<String, Object> verifyFromServer(
            @PathVariable Long registrationId
    ) {

        Registration reg = registrationRepo.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        AgreementBlock block = blockRepo.findByRegistrationId(registrationId)
                .orElseThrow(() -> new RuntimeException("Blockchain record missing"));

        byte[] pdfBytes =
                s3Service.downloadFile(reg.getAgreementPdfPath());

        String computedHash = HashUtil.sha256(pdfBytes);

        boolean pdfIntegrity =
                computedHash.equals(reg.getAgreementHash());

        boolean blockchainIntegrity =
                reg.getAgreementHash().equals(block.getAgreementHash());

        boolean valid = pdfIntegrity && blockchainIntegrity;

        return Map.of(
                "registrationId", registrationId,
                "valid", valid,
                "pdfIntegrity", pdfIntegrity,
                "blockchainIntegrity", blockchainIntegrity,
                "method", "SERVER_SIDE"
        );
    }

    // ================= MODEL 2: CLIENT SIDE =================

    @PostMapping("/{registrationId}/upload")
    public Map<String, Object> verifyByUpload(
            @PathVariable Long registrationId,
            @RequestParam("file") MultipartFile file
    ) throws Exception {

        Registration reg = registrationRepo.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        AgreementBlock block = blockRepo.findByRegistrationId(registrationId)
                .orElseThrow(() -> new RuntimeException("Blockchain record missing"));

        byte[] uploadedBytes = file.getBytes();

        String uploadedHash = HashUtil.sha256(uploadedBytes);

        boolean pdfIntegrity =
                uploadedHash.equals(reg.getAgreementHash());

        boolean blockchainIntegrity =
                reg.getAgreementHash().equals(block.getAgreementHash());

        boolean valid = pdfIntegrity && blockchainIntegrity;

        return Map.of(
                "registrationId", registrationId,
                "valid", valid,
                "pdfIntegrity", pdfIntegrity,
                "blockchainIntegrity", blockchainIntegrity,
                "method", "CLIENT_SIDE"
        );
    }
}
