package com.sbms.sbms_monolith.dto.boarding;

import com.sbms.sbms_monolith.model.enums.BoardingType;
import com.sbms.sbms_monolith.model.enums.Gender;
import com.sbms.sbms_monolith.model.enums.Status;

import lombok.Data;


import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
public class BoardingUpdateDTO {

    private String title;
    private String description;
    private String address;

    private Double latitude;
    private Double longitude;

    private BigDecimal pricePerMonth;
    private BigDecimal keyMoney;

    private Gender genderType;

    private int availableSlots;

    private Integer maxOccupants;

    private BoardingType boardingType;

    private List<String> imageUrls;

    private List<String> amenities;

    private Map<String, Double> nearbyPlaces;

    private Status status;
}
