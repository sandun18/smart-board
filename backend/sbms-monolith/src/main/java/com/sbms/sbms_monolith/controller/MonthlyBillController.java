package com.sbms.sbms_monolith.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sbms.sbms_monolith.dto.billing.MonthlyBillResponseDTO;
import com.sbms.sbms_monolith.model.User;
import com.sbms.sbms_monolith.repository.UserRepository;
import com.sbms.sbms_monolith.service.MonthlyBillService;

@RestController
@RequestMapping("/api/bills")
public class MonthlyBillController {

    @Autowired
    private MonthlyBillService billService;

    @Autowired
    private UserRepository userRepository;

    // ============================
    // STUDENT: My Bills (FIXED)
    // ============================
    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    public List<MonthlyBillResponseDTO> studentBills(
            Authentication authentication
    ) {
        String email = authentication.getName(); // JWT sub
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return billService.getForStudent(student.getId());
    }

    // ============================
    // OWNER: Bills
    // ============================
    @GetMapping("/owner")
    @PreAuthorize("hasRole('OWNER')")
    public List<MonthlyBillResponseDTO> ownerBills(
            Authentication authentication
    ) {
        String email = authentication.getName();
        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return billService.getForOwner(owner.getId());
    }

    // ============================
    // ADMIN / CRON
    // ============================
    @PostMapping("/generate/{month}")
    public String generate(@PathVariable String month) {
        billService.generateBillsForMonth(month);
        return "Monthly bills generated for " + month;
    }
}

