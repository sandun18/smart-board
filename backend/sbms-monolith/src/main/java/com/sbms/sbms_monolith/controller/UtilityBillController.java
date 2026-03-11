package com.sbms.sbms_monolith.controller;


import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.sbms.sbms_monolith.dto.billing.CreateUtilityBillDTO;
import com.sbms.sbms_monolith.dto.billing.UtilityBillResponseDTO;
import com.sbms.sbms_monolith.repository.UserRepository;
import com.sbms.sbms_monolith.service.UtilityBillService;

import lombok.RequiredArgsConstructor;





@RestController
@RequestMapping("/api/owner/utilities")
@RequiredArgsConstructor
@PreAuthorize("hasRole('OWNER')")
public class UtilityBillController {

    private final UtilityBillService utilityService;
    private final UserRepository userRepository;

    @GetMapping
    public List<UtilityBillResponseDTO> myUtilities(Authentication auth) {

        // auth.getName() == email
        String email = auth.getName();

        Long ownerId = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        return utilityService.getForOwner(ownerId);
    }

    @PostMapping
    public void save(@RequestBody CreateUtilityBillDTO dto) {
        utilityService.createOrUpdate(dto);
    }
}
