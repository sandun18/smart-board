package com.sbms.sbms_monolith.dto.admin;

import com.sbms.sbms_monolith.model.Boarding;
import com.sbms.sbms_monolith.model.Review;
import com.sbms.sbms_monolith.model.enums.Status;
import lombok.Data;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
public class AdminBoardingResponseDTO {
    private Long id;
    private String title;
    private String address;
    private String description;
    private String price;
    private String boardingType;
    private Integer availableSlots;
    private String genderType;
    private List<String> amenities;
    private List<ReviewSummaryDTO> reviews;
    private Status status;
    private Long ownerId;
    private String ownerName;
    private List<String> images;
    private OwnerInfoDTO owner;

    @Data
    public static class ReviewSummaryDTO {
        private String userName;
        private int rating;
        private String comment;
    }

    public static AdminBoardingResponseDTO fromEntity(Boarding b) {
        AdminBoardingResponseDTO dto = new AdminBoardingResponseDTO();
        dto.setId(b.getId());
        dto.setTitle(b.getTitle());
        dto.setAddress(b.getAddress());
        dto.setDescription(b.getDescription());
        dto.setPrice(b.getPricePerMonth() != null ? b.getPricePerMonth().toString() : BigDecimal.ZERO.toString());
        dto.setBoardingType(b.getBoardingType() != null ? b.getBoardingType().toString() : "");
        dto.setAvailableSlots(b.getAvailable_slots());
        dto.setGenderType(b.getGenderType() != null ? b.getGenderType().toString() : "");
        dto.setAmenities(b.getAmenities());
        dto.setStatus(b.getStatus());

        if (b.getOwner() != null) {
            dto.setOwnerId(b.getOwner().getId());
            dto.setOwnerName(b.getOwner().getFullName());
            dto.setOwner(OwnerInfoDTO.fromEntity(b.getOwner()));
        } else {
            dto.setOwnerName("Unknown");
            dto.setOwner(null);
        }

        dto.setImages(b.getImageUrls() != null ? b.getImageUrls() : new ArrayList<>());

        List<ReviewSummaryDTO> reviewDtos = new ArrayList<>();
        if (b.getReviews() != null) {
            for (Review review : b.getReviews()) {
                ReviewSummaryDTO reviewDto = new ReviewSummaryDTO();
                reviewDto.setRating(review.getRating());
                reviewDto.setComment(review.getComment());
                reviewDto.setUserName(
                        review.getStudent() != null && review.getStudent().getFullName() != null
                                ? review.getStudent().getFullName()
                                : "Anonymous"
                );
                reviewDtos.add(reviewDto);
            }
        }
        dto.setReviews(reviewDtos);

        return dto;
    }
}
