package com.sbms.sbms_monolith.service;


import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sbms.sbms_monolith.dto.billing.CreateUtilityBillDTO;
import com.sbms.sbms_monolith.dto.billing.UtilityBillResponseDTO;
import com.sbms.sbms_monolith.mapper.UtilityBillMapper;
import com.sbms.sbms_monolith.model.Boarding;
import com.sbms.sbms_monolith.model.UtilityBill;
import com.sbms.sbms_monolith.model.enums.RegistrationStatus;
import com.sbms.sbms_monolith.repository.BoardingRepository;
import com.sbms.sbms_monolith.repository.RegistrationRepository;
import com.sbms.sbms_monolith.repository.UtilityBillRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UtilityBillService {

    private final UtilityBillRepository utilityRepo;
    private final BoardingRepository boardingRepo;
    private final RegistrationRepository registrationRepo;
    private final MonthlyBillService monthlyBillService;

    @Transactional
    public void createOrUpdate(CreateUtilityBillDTO dto) {

        Boarding boarding = boardingRepo.findById(dto.getBoardingId())
                .orElseThrow();

        UtilityBill bill = utilityRepo
                .findByBoarding_IdAndMonth(dto.getBoardingId(), dto.getMonth())
                .orElseGet(UtilityBill::new);

        bill.setBoarding(boarding);
        bill.setMonth(dto.getMonth());
        bill.setElectricityAmount(dto.getElectricityAmount());
        bill.setWaterAmount(dto.getWaterAmount());
        bill.setProofUrl(dto.getProofUrl());

        utilityRepo.save(bill);

        // 🔥 IMPORTANT: generate student bills AFTER owner input
        monthlyBillService.generateBillsForMonth(dto.getMonth());
    }

    public List<UtilityBillResponseDTO> getForOwner(Long ownerId) {

        return utilityRepo.findByBoarding_Owner_Id(ownerId)
                .stream()
                .map(this::map)
                .toList();
    }

    private UtilityBillResponseDTO map(UtilityBill bill) {

        int studentCount = registrationRepo
                .countByBoarding_IdAndStatus(
                        bill.getBoarding().getId(),
                        RegistrationStatus.APPROVED
                );

        BigDecimal perStudent =
                studentCount == 0
                        ? BigDecimal.ZERO
                        : bill.getElectricityAmount()
                              .add(bill.getWaterAmount())
                              .divide(BigDecimal.valueOf(studentCount), 2, RoundingMode.HALF_UP);

        UtilityBillResponseDTO dto = new UtilityBillResponseDTO();
        dto.setId(bill.getId());
        dto.setBoardingId(bill.getBoarding().getId());
        dto.setBoardingName(bill.getBoarding().getTitle());
        dto.setMonth(bill.getMonth());
        dto.setElectricityAmount(bill.getElectricityAmount());
        dto.setWaterAmount(bill.getWaterAmount());
        dto.setPerStudentUtility(perStudent);

        return dto;
    }
}

