package com.sbms.sbms_monolith.service;

import com.sbms.sbms_monolith.mapper.AppointmentMapper;
import com.sbms.sbms_monolith.dto.appointment.*;
import com.sbms.sbms_monolith.model.Appointment;
import com.sbms.sbms_monolith.model.Boarding;
import com.sbms.sbms_monolith.model.User;
import com.sbms.sbms_monolith.model.enums.AppointmentStatus;
import com.sbms.sbms_monolith.model.enums.Status;
import com.sbms.sbms_monolith.model.enums.UserRole;
import com.sbms.sbms_monolith.repository.AppointmentRepository;
import com.sbms.sbms_monolith.repository.BoardingRepository;
import com.sbms.sbms_monolith.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private BoardingRepository boardingRepository;

    @Autowired
    private UserRepository userRepository;

    public AppointmentResponseDTO createAppointment(Long studentId, AppointmentCreateDTO dto) {

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        if (student.getRole() != UserRole.STUDENT) {
            throw new RuntimeException("User is not a student");
        }

        Boarding boarding = boardingRepository.findById(dto.getBoardingId())
                .orElseThrow(() -> new RuntimeException("Boarding not found"));

        // Only approved boardings can accept appointments
        if (boarding.getStatus() != Status.APPROVED) {
            throw new RuntimeException("Boarding is not approved for appointments");
        }

        if (dto.getNumberOfStudents() <= 0) {
            throw new RuntimeException("Number of students must be at least 1");
        }

        // available slots >= numberOfStudents
        if (boarding.getAvailable_slots() < dto.getNumberOfStudents()) {
            throw new RuntimeException("Not enough available slots for requested number of students");
        }

        if (dto.getRequestedStartTime() == null || dto.getRequestedEndTime() == null ||
                !dto.getRequestedEndTime().isAfter(dto.getRequestedStartTime())) {
            throw new RuntimeException("Invalid requested time range");
        }

        Appointment appointment = new Appointment();
        appointment.setStudent(student);
        appointment.setBoarding(boarding);
        appointment.setNumberOfStudents(dto.getNumberOfStudents());
        appointment.setRequestedStartTime(dto.getRequestedStartTime());
        appointment.setRequestedEndTime(dto.getRequestedEndTime());
        appointment.setStudentNote(dto.getStudentNote());
        appointment.setStatus(AppointmentStatus.PENDING);

        Appointment saved = appointmentRepository.save(appointment);

        return AppointmentMapper.toDto(saved);
    }

    public List<AppointmentResponseDTO> getAppointmentsForStudent(Long studentId) {

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<Appointment> list = appointmentRepository.findByStudent(student);

        return list.stream()
                .map(AppointmentMapper::toDto)
                .collect(Collectors.toList());
    }

   
    public List<AppointmentResponseDTO> getAppointmentsForOwner(Long ownerId, AppointmentStatus status) {

        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        List<Appointment> list;
        if (status != null) {
            list = appointmentRepository.findByBoarding_OwnerAndStatus(owner, status);
        } else {
            list = appointmentRepository.findByBoarding_Owner(owner);
        }

        return list.stream()
                .map(AppointmentMapper::toDto)
                .collect(Collectors.toList());
    }

    public AppointmentResponseDTO respondToAppointment(Long ownerId,
                                                       Long appointmentId,
                                                       AppointmentOwnerDecisionDTO dto) {

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // verify owner
        if (!appointment.getBoarding().getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("You are not the owner of this boarding");
        }

        if (dto.getStatus() == AppointmentStatus.DECLINED) {
            appointment.setStatus(AppointmentStatus.DECLINED);
            appointment.setOwnerStartTime(null);
            appointment.setOwnerEndTime(null);
            appointment.setOwnerNote(dto.getOwnerNote());

        } else if (dto.getStatus() == AppointmentStatus.ACCEPTED) {

            if (dto.getOwnerStartTime() == null || dto.getOwnerEndTime() == null) {
                throw new RuntimeException("Owner must provide a time slot when accepting");
            }

            if (!dto.getOwnerEndTime().isAfter(dto.getOwnerStartTime())) {
                throw new RuntimeException("Invalid owner time range");
            }

            LocalDateTime reqStart = appointment.getRequestedStartTime();
            LocalDateTime reqEnd = appointment.getRequestedEndTime();

            if (dto.getOwnerStartTime().isBefore(reqStart) ||
                dto.getOwnerEndTime().isAfter(reqEnd)) {
                throw new RuntimeException("Owner time slot must be within student's requested time range");
            }

            appointment.setOwnerStartTime(dto.getOwnerStartTime());
            appointment.setOwnerEndTime(dto.getOwnerEndTime());
            appointment.setOwnerNote(dto.getOwnerNote());
            appointment.setStatus(AppointmentStatus.ACCEPTED);

        } else if (dto.getStatus() == AppointmentStatus.VISITED) {
        
            if (appointment.getStatus() != AppointmentStatus.ACCEPTED) {
                throw new RuntimeException("Only previously ACCEPTED appointments can be marked as VISITED.");
            }

            appointment.setStatus(AppointmentStatus.VISITED);
            
            if (dto.getOwnerNote() != null && !dto.getOwnerNote().isEmpty()) {
                appointment.setOwnerNote(dto.getOwnerNote());
            } 
            
        } else {
            throw new RuntimeException("Invalid status. Supported: ACCEPTED, DECLINED, VISITED");
        }

        Appointment saved = appointmentRepository.save(appointment);
        return AppointmentMapper.toDto(saved);
    }


    public AppointmentResponseDTO cancelAppointment(Long studentId, Long appointmentId, String reason) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("You are not allowed to cancel this appointment");
        }

        // ✅ Append cancellation reason to the existing note
        if (reason != null && !reason.isBlank()) {
            String oldNote = appointment.getStudentNote();
            String newNote = (oldNote == null ? "" : oldNote + "\n\n") + "[Cancelled]: " + reason;
            appointment.setStudentNote(newNote);
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        Appointment saved = appointmentRepository.save(appointment);
        return AppointmentMapper.toDto(saved);
    }

    public AppointmentResponseDTO markAsVisited(Long studentId, Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // Debug Print
        System.out.println("--- MARK VISITED DEBUG ---");
        System.out.println("Appointment ID: " + appointmentId);
        System.out.println("Current Status in DB: " + appointment.getStatus());

        if (!appointment.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("You are not allowed to update this appointment");
        }

        if (appointment.getStatus() != AppointmentStatus.ACCEPTED) {
            // Include actual status in error message
            throw new RuntimeException("Current status is " + appointment.getStatus() + ". Only ACCEPTED appointments can be marked as visited.");
        }

        appointment.setStatus(AppointmentStatus.VISITED);
        Appointment saved = appointmentRepository.save(appointment);
        return AppointmentMapper.toDto(saved);
    }

    public AppointmentResponseDTO selectBoarding(Long studentId, Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("You are not allowed to update this appointment");
        }

        if (appointment.getStatus() != AppointmentStatus.VISITED) {
            throw new RuntimeException("You must visit the boarding before selecting it.");
        }

        appointment.setStatus(AppointmentStatus.SELECTED);
        Appointment saved = appointmentRepository.save(appointment);
        return AppointmentMapper.toDto(saved);
    }


    public AppointmentResponseDTO rejectBoarding(Long studentId, Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("You are not allowed to update this appointment");
        }

        if (appointment.getStatus() != AppointmentStatus.VISITED) {
            throw new RuntimeException("You can only reject appointments you have marked as visited.");
        }

        appointment.setStatus(AppointmentStatus.NOT_SELECTED);
        Appointment saved = appointmentRepository.save(appointment);
        return AppointmentMapper.toDto(saved);
    }
}
