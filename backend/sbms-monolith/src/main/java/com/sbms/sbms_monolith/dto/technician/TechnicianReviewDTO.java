package com.sbms.sbms_monolith.dto.technician;

import lombok.Data;

import java.time.LocalDate;

@Data
public class TechnicianReviewDTO {
    private Long id;
    private String ownerName;
    private int rating;
    private String comment;
    private LocalDate date;
}
