package com.sbms.sbms_monolith.mapper;

import com.sbms.sbms_monolith.dto.billing.MonthlyBillResponseDTO;
import com.sbms.sbms_monolith.model.MonthlyBill;
import com.sbms.sbms_monolith.model.enums.BillDueStatus;

public class MonthlyBillMapper {

    public static MonthlyBillResponseDTO toDTO(MonthlyBill b , 
    		BillDueStatus dueStatus,
            int dueInDays
        ) {

        MonthlyBillResponseDTO dto = new MonthlyBillResponseDTO();

        dto.setId(b.getId());
        dto.setStudentId(b.getStudent().getId());
        dto.setStudentName(b.getStudent().getFullName());

        dto.setBoardingId(b.getBoarding().getId());
        dto.setBoardingTitle(b.getBoarding().getTitle());
        dto.setOwnerId(b.getBoarding().getOwner().getId());

        dto.setMonth(b.getMonth());

        dto.setBoardingFee(b.getBoardingFee());
        dto.setElectricityFee(b.getElectricityFee());
        dto.setWaterFee(b.getWaterFee());
        dto.setTotalAmount(b.getTotalAmount());

        dto.setStatus(b.getStatus());
        
        dto.setDueDate(b.getDueDate());
        dto.setDueStatus(dueStatus);
        dto.setDueInDays(dueInDays);

        return dto;
    }
}
