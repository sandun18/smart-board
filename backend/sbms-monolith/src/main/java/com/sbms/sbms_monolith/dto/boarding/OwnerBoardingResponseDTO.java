package com.sbms.sbms_monolith.dto.boarding;

import com.sbms.sbms_monolith.model.enums.BoardingType;
import com.sbms.sbms_monolith.model.enums.Gender;
import com.sbms.sbms_monolith.model.enums.Status;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
public class OwnerBoardingResponseDTO {

    private Long id;

    private String title;
    private String description;
    private String address;

    private Double latitude;
    private Double longitude;

    private BigDecimal pricePerMonth;
    private BigDecimal keyMoney;

    private Gender genderType;
    private BoardingType boardingType;

    private int availableSlots;
    private int maxOccupants;
    
    private int currentStudents;

    private List<String> imageUrls;
    private List<String> amenities;

    private Map<String, Double> nearbyPlaces;

    private Status status;

    private boolean isBoosted;
    private LocalDateTime boostEndDate;
}