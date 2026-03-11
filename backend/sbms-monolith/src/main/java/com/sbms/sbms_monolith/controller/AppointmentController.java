package com.sbms.sbms_monolith.controller;

import com.sbms.sbms_monolith.dto.appointment.*;
import com.sbms.sbms_monolith.model.enums.AppointmentStatus;
import com.sbms.sbms_monolith.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    // POST /api/appointments/student/{studentId}
    @PostMapping("/student/{studentId}")
    @PreAuthorize("hasRole('STUDENT')")
    public AppointmentResponseDTO createAppointment(
            @PathVariable Long studentId,
            @RequestBody AppointmentCreateDTO dto
    ) {
        return appointmentService.createAppointment(studentId, dto);
    }

    
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('STUDENT')")
    public List<AppointmentResponseDTO> getStudentAppointments(
            @PathVariable Long studentId
    ) {
        return appointmentService.getAppointmentsForStudent(studentId);
    }


    @PutMapping("/student/{studentId}/{appointmentId}/cancel")
    @PreAuthorize("hasRole('STUDENT')")
    public AppointmentResponseDTO cancelAppointment(
            @PathVariable Long studentId,
            @PathVariable Long appointmentId,
            @RequestBody(required = false) java.util.Map<String, String> payload // ✅ Accept JSON Body
    ) {
        String reason = (payload != null) ? payload.get("reason") : null;
        return appointmentService.cancelAppointment(studentId, appointmentId, reason);
    }

    @PutMapping("/student/{studentId}/{appointmentId}/visit")
    @PreAuthorize("hasRole('STUDENT')")
    public AppointmentResponseDTO markAsVisited(
            @PathVariable Long studentId,
            @PathVariable Long appointmentId
    ) {
        // You need to create this method in your AppointmentService!
        return appointmentService.markAsVisited(studentId, appointmentId);
    }

    @PutMapping("/student/{studentId}/{appointmentId}/select")
    @PreAuthorize("hasRole('STUDENT')")
    public AppointmentResponseDTO selectBoarding(
            @PathVariable Long studentId,
            @PathVariable Long appointmentId
    ) {
        return appointmentService.selectBoarding(studentId, appointmentId);
    }

    @PutMapping("/student/{studentId}/{appointmentId}/reject")
    @PreAuthorize("hasRole('STUDENT')")
    public AppointmentResponseDTO rejectBoarding(
            @PathVariable Long studentId,
            @PathVariable Long appointmentId
    ) {
        return appointmentService.rejectBoarding(studentId, appointmentId);
    }

   
    @GetMapping("/owner/{ownerId}")
    @PreAuthorize("hasRole('OWNER')")
    public List<AppointmentResponseDTO> getOwnerAppointments(
            @PathVariable Long ownerId,
            @RequestParam(required = false) AppointmentStatus status
    ) {
        return appointmentService.getAppointmentsForOwner(ownerId, status);
    }

   
    @PutMapping("/owner/{ownerId}/{appointmentId}")
    @PreAuthorize("hasRole('OWNER')")
    public AppointmentResponseDTO respond(
            @PathVariable Long ownerId,
            @PathVariable Long appointmentId,
            @RequestBody AppointmentOwnerDecisionDTO dto
    ) {
        return appointmentService.respondToAppointment(ownerId, appointmentId, dto);
    }

    // ✅ NEW ENDPOINT: Dashboard Recent Appointments
    @GetMapping("/owner/{ownerId}/recent")
    @PreAuthorize("hasRole('OWNER')") // Use hasAnyAuthority to avoid 403 errors
    public List<AppointmentResponseDTO> getRecentAppointments(@PathVariable Long ownerId) {
        return appointmentService.getRecentAppointments(ownerId);
    }
}
