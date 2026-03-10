package com.sbms.sbms_monolith.mapper;


import com.sbms.sbms_monolith.dto.billing.CreateUtilityBillDTO;
import com.sbms.sbms_monolith.dto.billing.UtilityBillResponseDTO;
import com.sbms.sbms_monolith.model.Boarding;
import com.sbms.sbms_monolith.model.UtilityBill;

public class UtilityBillMapper {

    public static UtilityBill toEntity(CreateUtilityBillDTO dto, Boarding boarding) {

        UtilityBill bill = new UtilityBill();
        bill.setBoarding(boarding);
        bill.setMonth(dto.getMonth());
        bill.setElectricityAmount(dto.getElectricityAmount());
        bill.setWaterAmount(dto.getWaterAmount());

        return bill;
    }

    public static UtilityBillResponseDTO toDTO(UtilityBill bill) {

        UtilityBillResponseDTO dto = new UtilityBillResponseDTO();
        dto.setId(bill.getId());
        dto.setBoardingId(bill.getBoarding().getId());
        dto.setBoardingName(bill.getBoarding().getTitle());
        dto.setMonth(bill.getMonth());
        dto.setElectricityAmount(bill.getElectricityAmount());
        dto.setWaterAmount(bill.getWaterAmount());

        return dto;
    }
}
