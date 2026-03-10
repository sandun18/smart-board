package com.sbms.sbms_monolith.service;


import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sbms.sbms_monolith.model.Boarding;
import com.sbms.sbms_monolith.model.UtilityBill;
import com.sbms.sbms_monolith.repository.BoardingRepository;
import com.sbms.sbms_monolith.repository.UtilityBillRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AutoUtilityBillService {

    private final BoardingRepository boardingRepo;
    private final UtilityBillRepository utilityRepo;

  
    @Transactional
    public void generateForMonth(String month) {

        List<Boarding> boardings = boardingRepo.findAll();

        for (Boarding boarding : boardings) {

            boolean exists = utilityRepo
                    .findByBoarding_IdAndMonth(boarding.getId(), month)
                    .isPresent();

            if (exists) continue;

            UtilityBill bill = new UtilityBill();
            bill.setBoarding(boarding);
            bill.setMonth(month);

            // 🔹 Default / estimated utilities
            bill.setElectricityAmount(defaultElectricity(boarding));
            bill.setWaterAmount(defaultWater(boarding));

            utilityRepo.save(bill);
        }
    }

    /* =========================
       DEFAULT LOGIC (REALISTIC)
    ========================= */

    private BigDecimal defaultElectricity(Boarding boarding) {
        // Example logic — can evolve later
        return boarding.getPricePerMonth()
                .multiply(new BigDecimal("0.15")); // ~15%
    }

    private BigDecimal defaultWater(Boarding boarding) {
        return boarding.getPricePerMonth()
                .multiply(new BigDecimal("0.05")); // ~5%
    }
}
