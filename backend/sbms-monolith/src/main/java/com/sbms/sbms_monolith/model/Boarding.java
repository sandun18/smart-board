package com.sbms.sbms_monolith.model;


import jakarta.persistence.*;

import lombok.Data;
import com.sbms.sbms_monolith.model.enums.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.sbms.sbms_monolith.common.BaseEntity;

@Data
@Entity
@Table(name = "boardings")
public class Boarding extends BaseEntity {

	
	@ManyToOne
	@JoinColumn(name = "owner_id")
	private User owner;

	
    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 500)
    private String description;

    @Column(nullable = false)
    private String address;

    private Double latitude;
    private Double longitude;
    
    @Column(nullable = false)
    private BigDecimal pricePerMonth;
    
    @Column(nullable = true)
    private BigDecimal keyMoney;
    
    private List<String> imageUrls;

    @Column(nullable = false)
    private Gender genderType; // MALE/FEMALE/MIXED

    @Column(nullable=false)
   private int available_slots;

    @ElementCollection
    private Map<String, Double> nearbyPlaces = new HashMap<>();
    

    @ElementCollection
    @CollectionTable(name = "boarding_amenities", joinColumns = @JoinColumn(name = "boarding_id"))
    @Column(name = "amenity")
    private List<String> amenities;

    @Column(nullable=false)
    private Integer maxOccupants;
    
    private BoardingType boardingType;
    
    @Column(nullable=false)
    @Enumerated(EnumType.STRING)
    private Status status;
    
    private boolean isBosted = false;
    protected LocalDateTime boostEndDate;

    @OneToMany(mappedBy = "boarding", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Review> reviews;

}
