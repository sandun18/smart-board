package com.sbms.sbms_monolith.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sbms.sbms_monolith.service.AutoUtilityBillService;
import com.sbms.sbms_monolith.service.MonthlyBillService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/billing")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminBillingController {

    private final AutoUtilityBillService autoUtilityService;
    private final MonthlyBillService monthlyBillService;

    // Generates both utility and monthly bills for a given billing period (for example: 2026-03).
    @PostMapping("/generate/{month}")
    public void generate(@PathVariable String month) {
        autoUtilityService.generateForMonth(month);
        monthlyBillService.generateBillsForMonth(month);
    }
}
