package com.sbms.sbms_monolith.dto.boarding;





import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;




import lombok.Data;

import com.sbms.sbms_monolith.model.enums.*;



@Data
public class BoardingDetailDTO {

    private Long id;

    private String title;
    private String description;
    private String address;

    private BigDecimal pricePerMonth;
    private BigDecimal keyMoney;
    
    private Double latitude;
    private Double longitude;
    
    private Long ownerId;
    
    private Gender genderType;
    private BoardingType boardingType;
    private Status status;

    private List<String> imageUrls;
    private int availableSlots;
    private Integer maxOccupants;

    private List<String> amenities;
    private Map<String, Double> nearbyPlaces;

    private boolean bosted;             // from isBosted
    private LocalDateTime boostEndDate;

    private int reviewCount;
    private double rating;

    private OwnerDto owner;

    @Data
    public static class OwnerDto {
        private Long id;
        private String name;
        private String contact;
        private String email;
        private String image;
    }
}
