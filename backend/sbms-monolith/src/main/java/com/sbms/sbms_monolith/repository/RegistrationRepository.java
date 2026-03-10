package com.sbms.sbms_monolith.repository;

import com.sbms.sbms_monolith.model.Boarding;
import com.sbms.sbms_monolith.model.Registration;
import com.sbms.sbms_monolith.model.User;
import com.sbms.sbms_monolith.model.enums.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    List<Registration> findByStudent(User student);
    
    List<Registration> findByStudentId(Long studentId);


    List<Registration> findByBoarding(Boarding boarding);

    List<Registration> findByBoarding_Owner(User owner);
    
    Optional<Registration> findById(Long id);
    
    int countByBoarding_IdAndStatus(Long boardingId, RegistrationStatus status);
    
    List<Registration> findByBoarding_IdAndStatus(Long boardingId, RegistrationStatus status);

    List<Registration> findByBoarding_OwnerAndStatus(User owner, RegistrationStatus status);
    
    @Query("SELECT r FROM Registration r WHERE r.boarding.owner.id = :ownerId " +
            "AND (:status IS NULL OR r.status = :status)")
     List<Registration> findByBoardingOwnerId(Long ownerId, RegistrationStatus status);

    // CHECK FOR DUPLICATES: Returns true if student has a live registration
    @Query("SELECT COUNT(r) > 0 FROM Registration r WHERE r.student.id = :studentId AND r.boarding.id = :boardingId AND r.status IN ('PENDING', 'APPROVED', 'LEAVE_REQUESTED')")
    boolean existsActiveRegistration(@Param("studentId") Long studentId, @Param("boardingId") Long boardingId);

    boolean existsByStudentIdAndBoardingIdAndStatus(Long studentId, Long boardingId, RegistrationStatus status);
}
