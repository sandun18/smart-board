package com.sbms.sbms_monolith.service;

import java.time.LocalDateTime;
import java.util.List;

import com.sbms.sbms_monolith.model.enums.RegistrationStatus;
import com.sbms.sbms_monolith.repository.RegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.sbms.sbms_monolith.dto.maintenance.MaintenanceCreateDTO;
import com.sbms.sbms_monolith.dto.maintenance.MaintenanceDecisionDTO;
import com.sbms.sbms_monolith.dto.maintenance.MaintenanceResponseDTO;
import com.sbms.sbms_monolith.mapper.MaintenanceMapper;
import com.sbms.sbms_monolith.model.Boarding;
import com.sbms.sbms_monolith.model.Maintenance;
import com.sbms.sbms_monolith.model.User;
import com.sbms.sbms_monolith.model.enums.MaintenanceStatus;
import com.sbms.sbms_monolith.repository.BoardingRepository;
import com.sbms.sbms_monolith.repository.MaintenanceRepository;
import com.sbms.sbms_monolith.repository.UserRepository;

@Service
public class MaintenanceService {

    @Autowired
    private MaintenanceRepository maintenanceRepo;

    @Autowired
    private BoardingRepository boardingRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private S3Service s3Service;

    @Autowired
    private RegistrationRepository registrationRepo;

    public MaintenanceResponseDTO create(Long studentId, MaintenanceCreateDTO dto) {

        User student = userRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Boarding boarding = boardingRepo.findById(dto.getBoardingId())
                .orElseThrow(() -> new RuntimeException("Boarding not found"));

        //  SECURITY CHECK: Is student approved for this boarding?
        boolean isResident = registrationRepo.existsByStudentIdAndBoardingIdAndStatus(
                studentId,
                boarding.getId(),
                RegistrationStatus.APPROVED
        );

        if (!isResident) {
            throw new RuntimeException("You can only submit maintenance requests for a boarding you are currently approved in.");
        }

        Maintenance m = new Maintenance();
        m.setStudent(student);
        m.setBoarding(boarding);
        m.setTitle(dto.getTitle());
        m.setDescription(dto.getDescription());
        m.setStudentNote(null);
        m.setImageUrls(dto.getImageUrls()); 
        m.setStatus(MaintenanceStatus.PENDING);
        m.setMaintenanceUrgency(dto.getMaintenanceUrgency());

        maintenanceRepo.save(m);
        return MaintenanceMapper.toDTO(m);
    }


    public List<MaintenanceResponseDTO> getForStudent(Long studentId) {

        User student = userRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return maintenanceRepo.findByStudent(student)
                .stream()
                .map(MaintenanceMapper::toDTO)
                .toList();
    }

    public List<MaintenanceResponseDTO> getForOwner(Long ownerId) {

        User owner = userRepo.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        return maintenanceRepo.findByBoarding_Owner(owner)
                .stream()
                .map(MaintenanceMapper::toDTO)
                .toList();
    }

    public MaintenanceResponseDTO decide(Long ownerId,
                                     Long maintenanceId,
                                     MaintenanceDecisionDTO dto) {

    Maintenance m = maintenanceRepo.findById(maintenanceId)
            .orElseThrow(() -> new RuntimeException("Maintenance not found"));

    if (!m.getBoarding().getOwner().getId().equals(ownerId)) {
        throw new RuntimeException("Unauthorized");
    }

    m.setStatus(dto.getStatus());
    m.setOwnerNote(dto.getOwnerNote());

    // ✅ NEW CODE: Set the updated/finished date
    // This takes the date sent from the frontend (created when you clicked the button)
    if (dto.getUpdatedAt() != null) {
        m.setUpdatedAt(dto.getUpdatedAt());
    } else {
        // Fallback: If for some reason the DTO date is null, use current server time
        m.setUpdatedAt(LocalDateTime.now());
    }

    if (dto.getStatus() == MaintenanceStatus.REJECTED && m.getImageUrls() != null) {
        for (String url : m.getImageUrls()) {
            s3Service.deleteFile(url);
        }
    }

        maintenanceRepo.save(m);
        return MaintenanceMapper.toDTO(m);
    }

    public Maintenance getMaintenanceById(Long id) {
        return maintenanceRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance Request not found with id: " + id));
    }
}
