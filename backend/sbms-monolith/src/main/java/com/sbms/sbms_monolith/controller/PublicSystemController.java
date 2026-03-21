package com.sbms.sbms_monolith.controller;

import com.sbms.sbms_monolith.service.AdminSettingsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/public")
public class PublicSystemController {

    private final AdminSettingsService adminSettingsService;

    public PublicSystemController(AdminSettingsService adminSettingsService) {
        this.adminSettingsService = adminSettingsService;
    }

    @GetMapping("/system-status")
    public Map<String, Object> systemStatus() {
        return Map.of("maintenanceMode", adminSettingsService.isMaintenanceModeEnabled());
    }
}
