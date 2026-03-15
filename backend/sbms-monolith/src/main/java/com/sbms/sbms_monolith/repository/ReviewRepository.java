package com.sbms.sbms_monolith.repository;

import com.sbms.sbms_monolith.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review,Long> {

    // Get all reviews for a specific boarding, newest first
    List<Review> findByBoardingIdOrderByCreatedAtDesc(Long boardingId);

    // Find a specific review by a student for a specific property
    Optional<Review> findByStudentIdAndBoardingId(Long studentId, Long boardingId);

    // Check if a student has already reviewed this boarding (to prevent duplicates)
    boolean existsByStudentIdAndBoardingId(Long studentId, Long boardingId);

    int countByBoardingId(Long boardingId);

    List<Review> findByStudentIdOrderByCreatedAtDesc(Long studentId);

    // Calculate the average rating for a boarding house
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.boarding.id = :boardingId")
    Double getAverageRatingForBoarding(Long boardingId);

    long deleteByStudent_Id(Long studentId);

    long deleteByBoarding_IdIn(List<Long> boardingIds);

}
