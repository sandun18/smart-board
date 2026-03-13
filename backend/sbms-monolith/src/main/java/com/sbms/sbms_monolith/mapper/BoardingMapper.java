package com.sbms.sbms_monolith.mapper;


import com.sbms.sbms_monolith.dto.boarding.BoardingCreateDTO;
import com.sbms.sbms_monolith.dto.boarding.BoardingDetailDTO;
import com.sbms.sbms_monolith.dto.boarding.BoardingSummaryDTO;
import com.sbms.sbms_monolith.dto.boarding.OwnerBoardingResponseDTO;
import com.sbms.sbms_monolith.model.Boarding;
import com.sbms.sbms_monolith.model.Review;
import com.sbms.sbms_monolith.model.enums.Status;



public class BoardingMapper {

    public static BoardingSummaryDTO toSummary(Boarding b) {
        BoardingSummaryDTO dto = new BoardingSummaryDTO();

        dto.setId(b.getId());
        dto.setTitle(b.getTitle());
        dto.setAddress(b.getAddress());
        dto.setPricePerMonth(b.getPricePerMonth());
        

        dto.setGenderType(b.getGenderType());
        dto.setBoardingType(b.getBoardingType());
        dto.setStatus(b.getStatus());

        dto.setImageUrls(b.getImageUrls());
        dto.setAvailableSlots(b.getAvailable_slots());

        if (b.getReviews() != null && !b.getReviews().isEmpty()) {
            dto.setReviewCount(b.getReviews().size());
            double average = b.getReviews().stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);
            dto.setRating(Math.round(average * 10.0) / 10.0);
        } else {
            dto.setReviewCount(0);
            dto.setRating(0.0);
        }

        return dto;
    }

    public static BoardingDetailDTO toDetail(Boarding b) {
        BoardingDetailDTO dto = new BoardingDetailDTO();

        dto.setId(b.getId());
        dto.setOwnerId(b.getOwner().getId());
        dto.setTitle(b.getTitle());
        dto.setDescription(b.getDescription());
        dto.setAddress(b.getAddress());

        dto.setLatitude(b.getLatitude());
        dto.setLongitude(b.getLongitude());

        dto.setPricePerMonth(b.getPricePerMonth());
        dto.setKeyMoney(b.getKeyMoney());

        dto.setGenderType(b.getGenderType());
        dto.setBoardingType(b.getBoardingType());
        dto.setStatus(b.getStatus());

        dto.setImageUrls(b.getImageUrls());
        dto.setAvailableSlots(b.getAvailable_slots());
        dto.setMaxOccupants(b.getMaxOccupants());

        dto.setAmenities(b.getAmenities());
        dto.setNearbyPlaces(b.getNearbyPlaces());

        dto.setBosted(b.isBosted());
        dto.setBoostEndDate(b.getBoostEndDate());

        if (b.getReviews() != null && !b.getReviews().isEmpty()) {
            dto.setReviewCount(b.getReviews().size());

            // Calculate Average
            double average = b.getReviews().stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);

            // Round to 1 decimal place (e.g. 4.5)
            dto.setRating(Math.round(average * 10.0) / 10.0);
        } else {
            dto.setReviewCount(0);
            dto.setRating(0.0);
        }

        if (b.getOwner() != null) {
            BoardingDetailDTO.OwnerDto ownerDto = new BoardingDetailDTO.OwnerDto();
            ownerDto.setId(b.getOwner().getId());
            ownerDto.setName(b.getOwner().getFullName() != null ? b.getOwner().getFullName() : "Owner");
            ownerDto.setContact(b.getOwner().getPhone());
            ownerDto.setEmail(b.getOwner().getEmail());
            ownerDto.setImage(b.getOwner().getProfileImageUrl());

            dto.setOwner(ownerDto);
        }

        return dto;
    }
    
    
    public static Boarding toEntityFromCreate(BoardingCreateDTO dto) {
        Boarding b = new Boarding();

        b.setTitle(dto.getTitle());
        b.setDescription(dto.getDescription());
        b.setAddress(dto.getAddress());

        b.setLatitude(dto.getLatitude());
        b.setLongitude(dto.getLongitude());

        b.setPricePerMonth(dto.getPricePerMonth());
        b.setKeyMoney(dto.getKeyMoney());
        b.setGenderType(dto.getGenderType());
        b.setAvailable_slots(dto.getAvailableSlots());
        b.setMaxOccupants(dto.getMaxOccupants());
        b.setBoardingType(dto.getBoardingType());
        b.setImageUrls(dto.getImageUrls());
        b.setAmenities(dto.getAmenities());
        b.setNearbyPlaces(dto.getNearbyPlaces());

        // New ads are always pending admin approval
        b.setStatus(Status.PENDING);

        return b;
    }

    public static OwnerBoardingResponseDTO toOwnerResponse(Boarding b) {
        OwnerBoardingResponseDTO dto = new OwnerBoardingResponseDTO();

        int max = b.getMaxOccupants();
        int now = b.getAvailable_slots();
        
        
        dto.setId(b.getId());
        dto.setTitle(b.getTitle());
        dto.setDescription(b.getDescription());
        dto.setAddress(b.getAddress());

        dto.setLatitude(b.getLatitude());
        dto.setLongitude(b.getLongitude());

        dto.setPricePerMonth(b.getPricePerMonth());
        dto.setKeyMoney(b.getKeyMoney());
        dto.setGenderType(b.getGenderType());
        dto.setBoardingType(b.getBoardingType());
        dto.setAvailableSlots(b.getAvailable_slots());
        dto.setMaxOccupants(b.getMaxOccupants());
        dto.setImageUrls(b.getImageUrls());
        dto.setAmenities(b.getAmenities());
        dto.setNearbyPlaces(b.getNearbyPlaces());
        dto.setCurrentStudents(max - now);

        dto.setStatus(b.getStatus());
        dto.setBoosted(b.isBosted());
        dto.setBoostEndDate(b.getBoostEndDate());

        return dto;
    }

    
    
    
}