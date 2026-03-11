package com.sbms.sbms_monolith.service;

import com.sbms.sbms_monolith.dto.maintenance.MaintenanceResponseDTO;
import com.sbms.sbms_monolith.dto.technician.TechnicianReviewDTO;
import com.sbms.sbms_monolith.model.Maintenance;
import com.sbms.sbms_monolith.model.TechnicianReview;
import com.sbms.sbms_monolith.model.User;
import com.sbms.sbms_monolith.model.enums.MaintenanceIssueType;
import com.sbms.sbms_monolith.model.enums.MaintenanceStatus;
import com.sbms.sbms_monolith.model.enums.UserRole;
import com.sbms.sbms_monolith.repository.MaintenanceRepository;
import com.sbms.sbms_monolith.repository.TechnicianReviewRepository;
import com.sbms.sbms_monolith.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TechnicianWorkflowService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MaintenanceRepository maintenanceRepo;

    @Autowired
    private TechnicianReviewRepository techReviewRepo;

    // 1. OWNER: Find Technicians matching the issue (e.g., Plumbing)
    public List<User> findTechniciansForIssue(MaintenanceIssueType skill, String city) {
        return userRepository.findByRole(UserRole.TECHNICIAN).stream()
                .filter(t -> t.getSkills() != null && t.getSkills().contains(skill))
                .filter(t -> city == null || city.isEmpty() || (t.getCity() != null && t.getCity().equalsIgnoreCase(city)))
                .collect(Collectors.toList());
    }

    // 2. OWNER: Assign Technician
    public void assignTechnician(Long maintenanceId, Long technicianId, Long ownerId) {
        Maintenance m = maintenanceRepo.findById(maintenanceId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!m.getBoarding().getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("Unauthorized");
        }

        User tech = userRepository.findById(technicianId)
                .orElseThrow(() -> new RuntimeException("Technician not found"));

        m.setAssignedTechnician(tech);
        m.setStatus(MaintenanceStatus.ASSIGNED);
        m.setRejectedByTechnician(false);
        maintenanceRepo.save(m);
    }

    // 3. TECHNICIAN: Get Assigned Jobs
    public List<MaintenanceResponseDTO> getAssignedJobs(Long technicianId) {
        List<Maintenance> jobs = maintenanceRepo.findByAssignedTechnician_Id(technicianId);

        return jobs.stream()
                .map(this::mapToDTO) // Convert Entity -> DTO
                .collect(Collectors.toList());
    }

    // 4. TECHNICIAN: Accept/Reject
    public void technicianDecision(Long maintenanceId, Long technicianId, boolean accepted, String reason) {
        Maintenance m = maintenanceRepo.findById(maintenanceId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!m.getAssignedTechnician().getId().equals(technicianId)) {
            throw new RuntimeException("Unauthorized");
        }

        if (accepted) {
            m.setStatus(MaintenanceStatus.IN_PROGRESS);
        } else {
            m.setAssignedTechnician(null);
            m.setStatus(MaintenanceStatus.PENDING); // Goes back to owner
            m.setRejectedByTechnician(true);
            m.setTechnicianRejectionReason(reason);
        }
        maintenanceRepo.save(m);
    }

    // 5. TECHNICIAN: Mark Work Done
    public void markWorkDone(Long maintenanceId, Long technicianId, BigDecimal finalAmount) {
        Maintenance m = maintenanceRepo.findById(maintenanceId).orElseThrow();

        if(!m.getAssignedTechnician().getId().equals(technicianId)) {
            throw new RuntimeException("Unauthorized: Job not assigned to you");
        }

        if(finalAmount == null || finalAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("You must enter a valid final amount.");
        }

        m.setStatus(MaintenanceStatus.WORK_DONE);
        m.setTechnicianFee(finalAmount);

        maintenanceRepo.save(m);

        //  ADD THIS LINE: Update the profile count immediately!
        updateTechnicianStats(m.getAssignedTechnician());
    }

    // 6. OWNER: Review & Complete
    @Transactional
    public MaintenanceResponseDTO reviewTechnician(Long maintenanceId, int rating, String comment) {
        Maintenance m = maintenanceRepo.findById(maintenanceId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // Allow review if status is PAID or WORK_DONE (flexible for testing)
        if (m.getStatus() != MaintenanceStatus.PAID && m.getStatus() != MaintenanceStatus.WORK_DONE) {
            throw new RuntimeException("Work not finished yet (Must be PAID)");
        }

        //  IMPORTANT: Save directly to Maintenance Entity (So Controller sees it)
        m.setOwnerRating(rating);
        m.setOwnerComment(comment);
        m.setStatus(MaintenanceStatus.COMPLETED);

        Maintenance saved = maintenanceRepo.save(m);

        //  Also try to save to side table (TechnicianReview), but don't crash if duplicate
        try {
            TechnicianReview review = new TechnicianReview();
            review.setMaintenance(m); // This sets the Unique Key
            review.setOwner(m.getBoarding().getOwner());
            review.setTechnician(m.getAssignedTechnician());
            review.setRating(rating);
            review.setComment(comment);
            techReviewRepo.save(review);
        } catch (Exception e) {
            // Ignore duplicate error. The main data is already safe in 'Maintenance' table.
            System.out.println("LOG: Review record already exists in side table.");
        }

        // Update Average Rating Stats
        if (m.getAssignedTechnician() != null) {
            updateTechnicianStats(m.getAssignedTechnician());
        }

        return mapToDTO(saved);
    }

    // 7.  Get Reviews directly from Review Table
    public List<TechnicianReviewDTO> getReviewsForTechnician(User technician) {
        // Uses your existing repository method: findByTechnician(User)
        return techReviewRepo.findByTechnician(technician).stream()
                .map(review -> {
                    TechnicianReviewDTO dto = new TechnicianReviewDTO();
                    dto.setId(review.getId());

                    if (review.getOwner() != null) {
                        dto.setOwnerName(review.getOwner().getFullName());
                    } else {
                        dto.setOwnerName("Unknown Owner");
                    }

                    dto.setRating(review.getRating());
                    dto.setComment(review.getComment());

                    // Handle Date
                    if (review.getCreatedAt() != null) {
                        dto.setDate(review.getCreatedAt().toLocalDate());
                    } else {
                        dto.setDate(java.time.LocalDate.now());
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    //  Helper Method: Calculate Stats directly from Maintenance History
    public void updateTechnicianStats(User tech) {
        List<Maintenance> jobs = maintenanceRepo.findByAssignedTechnician_Id(tech.getId());

        double totalRatingScore = 0;
        int ratingCount = 0;
        int completedJobCount = 0;

        for (Maintenance job : jobs) {
            if (job.getStatus() == MaintenanceStatus.WORK_DONE ||
                    job.getStatus() == MaintenanceStatus.PAID ||
                    job.getStatus() == MaintenanceStatus.COMPLETED) {
                completedJobCount++;
            }

            if (job.getOwnerRating() > 0) {
                totalRatingScore += job.getOwnerRating();
                ratingCount++;
            }
        }

        tech.setTechnicianTotalJobs(completedJobCount);

        if (ratingCount > 0) {
            double average = (double) totalRatingScore / ratingCount;

            // Convert to BigDecimal with 1 decimal place precision
            tech.setTechnicianAverageRating(BigDecimal.valueOf(average)
                    .setScale(1, java.math.RoundingMode.HALF_UP));

        } else {
            tech.setTechnicianAverageRating(BigDecimal.ZERO);
        }

        userRepository.saveAndFlush(tech);
    }


    // Missing Helper Method: Map Entity -> DTO
    private MaintenanceResponseDTO mapToDTO(Maintenance m) {
        MaintenanceResponseDTO dto = new MaintenanceResponseDTO();

        dto.setId(m.getId());
        dto.setTitle(m.getTitle());
        dto.setDescription(m.getDescription());
        dto.setStatus(m.getStatus());
        dto.setTechnicianFee(m.getTechnicianFee());
        dto.setCreatedAt(m.getCreatedAt());
        dto.setMaintenanceUrgency(m.getMaintenanceUrgency());

        if (m.getImageUrls() != null && !m.getImageUrls().isEmpty()) {
            dto.setImageUrls(m.getImageUrls());
        } else {
            dto.setImageUrls(new java.util.ArrayList<>());
        }

        // --------------------------------------------------------
        //  FIX 1: Smart Review Mapping (Check both tables)
        // --------------------------------------------------------
        if (m.getOwnerRating() > 0) {
            // Data exists in Main Table
            dto.setOwnerRating(m.getOwnerRating()); // Ensure DTO has 'ownerRating' field
            dto.setOwnerComment(m.getOwnerComment());
        } else {
            // Data missing in Main Table? Check Side Table!
            Optional<TechnicianReview> sideReview = techReviewRepo.findByMaintenance(m);
            if (sideReview.isPresent()) {
                dto.setOwnerRating(sideReview.get().getRating());
                dto.setOwnerComment(sideReview.get().getComment());
            } else {
                dto.setOwnerRating(0);
                dto.setOwnerComment(null);
            }
        }

        // For DTO field naming consistency (if your DTO uses 'rating' instead of 'ownerRating')
        dto.setRating(dto.getOwnerRating());
        dto.setReviewComment(dto.getOwnerComment());


        // --------------------------------------------------------
        //  FIX 2: Explicit Phone Mapping
        // --------------------------------------------------------
        if (m.getBoarding() != null) {

            dto.setBoardingTitle(m.getBoarding().getTitle());
            dto.setBoardingAddress(m.getBoarding().getAddress());

            dto.setLatitude(m.getBoarding().getLatitude());
            dto.setLongitude(m.getBoarding().getLongitude());

            if (m.getBoarding().getOwner() != null) {
                User owner = m.getBoarding().getOwner();
                dto.setOwnerId(owner.getId());
                dto.setOwnerName(owner.getFullName());

                //  HERE IS THE PHONE NUMBER
                dto.setOwnerPhone(owner.getPhone());
            }
        }

        if (m.getAssignedTechnician() != null) {
            dto.setTechnicianId(m.getAssignedTechnician().getId());
            dto.setTechnicianName(m.getAssignedTechnician().getFullName());
        }

        return dto;
    }
}
