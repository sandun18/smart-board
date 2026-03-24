package com.sbms.sbms_monolith.controller;

import com.sbms.sbms_monolith.dto.report.ReportCreateDTO;
import com.sbms.sbms_monolith.dto.report.ReportResponseDTO;
import com.sbms.sbms_monolith.repository.UserRepository;
import com.sbms.sbms_monolith.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @Autowired
    private UserRepository userRepo;

    // Create Report
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ReportResponseDTO> create(
            @ModelAttribute ReportCreateDTO dto
//            @RequestParam(value = "evidence", required = false) MultipartFile evidence
    ) throws IOException {
        // If your service needs a list, we wrap the single file here
//        List<MultipartFile> evidenceList = (evidence != null) ? List.of(evidence) : null;
        return ResponseEntity.ok(reportService.create(dto, dto.getEvidence()));
    }

    // Get My Sent Reports
    @GetMapping("/sent/{userId}")
    public ResponseEntity<List<ReportResponseDTO>> getSentReports(@PathVariable Long userId) {
        return ResponseEntity.ok(reportService.getSentReports(userId));
    }

    // Get Profile History
    @GetMapping("/history/{userId}")
    public ResponseEntity<List<ReportResponseDTO>> getUserHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(reportService.getUserHistory(userId));
    }

    // Admin: All
    @GetMapping("/admin/all")
    public ResponseEntity<List<ReportResponseDTO>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    // Admin: Actions
    @PutMapping("/{id}/investigate")
    public ResponseEntity<ReportResponseDTO> investigate(@PathVariable Long id) {
        return ResponseEntity.ok(reportService.startInvestigation(id));
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<ReportResponseDTO> resolve(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(reportService.resolveReport(
                id, body.get("text"), body.get("action"), body.get("duration"))
        );
    }

    @PutMapping("/{id}/dismiss")
    public ResponseEntity<ReportResponseDTO> dismiss(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(reportService.dismissReport(id, body.get("text")));
    }

}
