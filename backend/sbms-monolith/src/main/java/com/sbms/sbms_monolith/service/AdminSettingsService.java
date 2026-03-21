package com.sbms.sbms_monolith.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sbms.sbms_monolith.dto.admin.AdminActivityLogDTO;
import com.sbms.sbms_monolith.dto.admin.SystemBackupDTO;
import com.sbms.sbms_monolith.dto.admin.SystemHealthDTO;
import com.sbms.sbms_monolith.dto.admin.SystemSettingsDTO;
import com.sbms.sbms_monolith.model.AdminActivityLog;
import com.sbms.sbms_monolith.model.SystemBackup;
import com.sbms.sbms_monolith.model.SystemSetting;
import com.sbms.sbms_monolith.repository.AdminActivityLogRepository;
import com.sbms.sbms_monolith.repository.SystemBackupRepository;
import com.sbms.sbms_monolith.repository.SystemSettingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class AdminSettingsService {

    private static final String KEY_PLATFORM_NAME = "platform_name";
    private static final String KEY_SUPPORT_EMAIL = "support_email";
    private static final String KEY_SUPPORT_PHONE = "support_phone";
    private static final String KEY_ADDRESS = "address";
    private static final String KEY_MAINTENANCE_MODE = "maintenance_mode";
    private static final String DEFAULT_PLATFORM_NAME = "SmartBoAD";
    private static final String DEFAULT_SUPPORT_EMAIL = "support@smartboad.lk";
    private static final String DEFAULT_SUPPORT_PHONE = "+94 77 123 4567";
    private static final String DEFAULT_ADDRESS = "123, High Level Road, Colombo 07, Sri Lanka";
    private static final String BACKUP_NAME_PATTERN = "yyyy_MM_dd_HH_mm";
    private static final String LOG_STATUS_SUCCESS = "Success";

    private final SystemSettingRepository systemSettingRepository;
    private final SystemBackupRepository systemBackupRepository;
    private final AdminActivityLogRepository adminActivityLogRepository;
    private final ObjectMapper objectMapper;

    public AdminSettingsService(
            SystemSettingRepository systemSettingRepository,
            SystemBackupRepository systemBackupRepository,
            AdminActivityLogRepository adminActivityLogRepository,
            ObjectMapper objectMapper
    ) {
        this.systemSettingRepository = systemSettingRepository;
        this.systemBackupRepository = systemBackupRepository;
        this.adminActivityLogRepository = adminActivityLogRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional(readOnly = true)
    public SystemSettingsDTO getSettings() {
        SystemSettingsDTO dto = new SystemSettingsDTO();
        dto.setPlatformName(getSettingValue(KEY_PLATFORM_NAME, DEFAULT_PLATFORM_NAME));
        dto.setSupportEmail(getSettingValue(KEY_SUPPORT_EMAIL, DEFAULT_SUPPORT_EMAIL));
        dto.setSupportPhone(getSettingValue(KEY_SUPPORT_PHONE, DEFAULT_SUPPORT_PHONE));
        dto.setAddress(getSettingValue(KEY_ADDRESS, DEFAULT_ADDRESS));
        dto.setMaintenanceMode(Boolean.parseBoolean(getSettingValue(KEY_MAINTENANCE_MODE, "false")));
        return dto;
    }

    @Transactional(readOnly = true)
    public boolean isMaintenanceModeEnabled() {
        return Boolean.parseBoolean(getSettingValue(KEY_MAINTENANCE_MODE, "false"));
    }

    public SystemSettingsDTO saveSettings(SystemSettingsDTO dto, String actorEmail) {
        saveSetting(KEY_PLATFORM_NAME, safe(dto.getPlatformName()), actorEmail);
        saveSetting(KEY_SUPPORT_EMAIL, safe(dto.getSupportEmail()), actorEmail);
        saveSetting(KEY_SUPPORT_PHONE, safe(dto.getSupportPhone()), actorEmail);
        saveSetting(KEY_ADDRESS, safe(dto.getAddress()), actorEmail);
        saveSetting(KEY_MAINTENANCE_MODE, String.valueOf(Boolean.TRUE.equals(dto.getMaintenanceMode())), actorEmail);

        createLog(actorEmail, "Updated general system configuration", LOG_STATUS_SUCCESS, "fa-edit");
        return getSettings();
    }

    @Transactional(readOnly = true)
    public SystemHealthDTO getHealth() {
        Runtime rt = Runtime.getRuntime();
        long total = rt.totalMemory();
        long free = rt.freeMemory();
        int ramUsage = total > 0 ? (int) Math.min(100, ((total - free) * 100 / total)) : 0;

        // Lightweight placeholders for CPU/storage until infra metrics are integrated.
        int cpu = 10;
        int storage = 28;
        return new SystemHealthDTO(cpu, ramUsage, storage);
    }

    @Transactional(readOnly = true)
    public List<SystemBackupDTO> listBackups() {
        return systemBackupRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toBackupDto)
                .toList();
    }

    public SystemBackupDTO createBackup(String actorEmail) {
        byte[] payload = generateBackupPayload();
        SystemBackup backup = new SystemBackup();
        backup.setType("System");
        backup.setName("Full_System_Backup_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern(BACKUP_NAME_PATTERN)) + ".json");
        backup.setFileContent(payload);
        backup.setSizeBytes((long) payload.length);
        backup.setCreatedBy(actorEmail);

        SystemBackup saved = systemBackupRepository.save(backup);
        createLog(actorEmail, "Created system backup: " + saved.getName(), LOG_STATUS_SUCCESS, "fa-database");
        return toBackupDto(saved);
    }

    @Transactional(readOnly = true)
    public SystemBackup getBackupForDownload(Long backupId, String actorEmail) {
        SystemBackup backup = findBackupOrThrow(backupId);
        createLog(actorEmail, "Downloaded backup: " + backup.getName(), LOG_STATUS_SUCCESS, "fa-download");
        return backup;
    }

    public void restoreBackup(Long backupId, String actorEmail) {
        SystemBackup backup = findBackupOrThrow(backupId);
        createLog(actorEmail, "Restore requested for backup: " + backup.getName(), LOG_STATUS_SUCCESS, "fa-undo-alt");
    }

    public void deleteBackup(Long backupId, String actorEmail) {
        SystemBackup backup = findBackupOrThrow(backupId);
        String backupName = backup.getName();
        systemBackupRepository.delete(backup);
        createLog(actorEmail, "Deleted backup: " + backupName, LOG_STATUS_SUCCESS, "fa-trash-alt");
    }

    @Transactional(readOnly = true)
    public List<AdminActivityLogDTO> getLogs() {
        return adminActivityLogRepository.findTop200ByOrderByCreatedAtDesc()
                .stream()
            .map(this::toActivityLogDto)
                .toList();
    }

        private SystemBackup findBackupOrThrow(Long backupId) {
        return systemBackupRepository.findById(backupId)
            .orElseThrow(() -> new RuntimeException("Backup not found"));
        }

        private AdminActivityLogDTO toActivityLogDto(AdminActivityLog log) {
        return AdminActivityLogDTO.builder()
            .eventId(log.getEventId())
            .user(log.getActor())
            .action(log.getActionDescription())
            .status(log.getStatus())
            .icon(log.getIcon())
            .createdAt(log.getCreatedAt())
            .build();
        }

    private String getSettingValue(String key, String fallback) {
        return systemSettingRepository.findBySettingKey(key)
                .map(SystemSetting::getSettingValue)
                .orElse(fallback);
    }

    private void saveSetting(String key, String value, String actorEmail) {
        SystemSetting setting = systemSettingRepository.findBySettingKey(key)
                .orElseGet(SystemSetting::new);
        setting.setSettingKey(key);
        setting.setSettingValue(value);
        setting.setUpdatedBy(actorEmail);
        systemSettingRepository.save(setting);
    }

    private void createLog(String actorEmail, String action, String status, String icon) {
        AdminActivityLog log = new AdminActivityLog();
        log.setEventId("LOG-" + System.currentTimeMillis());
        log.setActor(actorEmail != null ? actorEmail : "System");
        log.setActionDescription(action);
        log.setStatus(status);
        log.setIcon(icon);
        adminActivityLogRepository.save(log);
    }

    private SystemBackupDTO toBackupDto(SystemBackup backup) {
        return SystemBackupDTO.builder()
                .id(backup.getId())
                .name(backup.getName())
                .type(backup.getType())
                .sizeBytes(backup.getSizeBytes())
                .size(formatSize(backup.getSizeBytes()))
                .createdAt(backup.getCreatedAt())
                .build();
    }

    private String formatSize(Long bytes) {
        if (bytes == null) return "0 B";
        double value = bytes;
        if (value >= 1024 * 1024) {
            return String.format("%.1f MB", value / (1024 * 1024));
        }
        if (value >= 1024) {
            return String.format("%.1f KB", value / 1024);
        }
        return bytes + " B";
    }

    private byte[] generateBackupPayload() {
        // Keep backup payload intentionally small and deterministic for quick restore previews.
        Map<String, Object> payload = new HashMap<>();
        payload.put("generatedAt", LocalDateTime.now().toString());
        payload.put("settings", getSettings());
        payload.put("meta", Map.of("source", "sbms-admin-settings", "version", 1));
        try {
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsBytes(payload);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to generate backup payload", e);
        }
    }

    private String safe(String value) {
        return value == null ? "" : value.trim();
    }
}
