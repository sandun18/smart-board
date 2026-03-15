package com.sbms.sbms_monolith.controller;

import com.sbms.sbms_monolith.dto.admin.AdminActivityLogDTO;
import com.sbms.sbms_monolith.dto.admin.SystemBackupDTO;
import com.sbms.sbms_monolith.dto.admin.SystemHealthDTO;
import com.sbms.sbms_monolith.dto.admin.SystemSettingsDTO;
import com.sbms.sbms_monolith.model.SystemBackup;
import com.sbms.sbms_monolith.service.AdminSettingsService;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/settings")
@PreAuthorize("hasRole('ADMIN')")
public class AdminSettingsController {

    private final AdminSettingsService adminSettingsService;

    public AdminSettingsController(AdminSettingsService adminSettingsService) {
        this.adminSettingsService = adminSettingsService;
    }

    // General platform settings and health endpoints.
    @GetMapping("/general")
    public SystemSettingsDTO getGeneralSettings() {
        return adminSettingsService.getSettings();
    }

    @PutMapping("/general")
    public SystemSettingsDTO updateGeneralSettings(
            @RequestBody SystemSettingsDTO dto,
            Authentication auth
    ) {
        return adminSettingsService.saveSettings(dto, auth.getName());
    }

    @GetMapping("/health")
    public SystemHealthDTO getHealth() {
        return adminSettingsService.getHealth();
    }

    // Backup lifecycle endpoints.
    @GetMapping("/backups")
    public List<SystemBackupDTO> listBackups() {
        return adminSettingsService.listBackups();
    }

    @PostMapping("/backups")
    public SystemBackupDTO createBackup(Authentication auth) {
        return adminSettingsService.createBackup(auth.getName());
    }

    @GetMapping("/backups/{backupId}/download")
    public ResponseEntity<byte[]> downloadBackup(
            @PathVariable Long backupId,
            Authentication auth
    ) {
        SystemBackup backup = adminSettingsService.getBackupForDownload(backupId, auth.getName());
        HttpHeaders headers = new HttpHeaders();
        headers.setContentDisposition(ContentDisposition.attachment().filename(backup.getName()).build());
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        return ResponseEntity.ok().headers(headers).body(backup.getFileContent());
    }

    @PostMapping("/backups/{backupId}/restore")
    public void restoreBackup(@PathVariable Long backupId, Authentication auth) {
        adminSettingsService.restoreBackup(backupId, auth.getName());
    }

    @DeleteMapping("/backups/{backupId}")
    public void deleteBackup(@PathVariable Long backupId, Authentication auth) {
        adminSettingsService.deleteBackup(backupId, auth.getName());
    }

    // Activity audit stream for admin actions.
    @GetMapping("/logs")
    public List<AdminActivityLogDTO> getLogs() {
        return adminSettingsService.getLogs();
    }
}
