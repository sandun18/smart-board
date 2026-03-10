package com.sbms.sbms_monolith.scheduler;


import java.time.YearMonth;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.sbms.sbms_monolith.service.AutoUtilityBillService;
import com.sbms.sbms_monolith.service.MonthlyBillService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class UtilityBillScheduler {

    private final AutoUtilityBillService autoUtilityService;
    private final MonthlyBillService monthlyBillService;

    /**
     * Runs at 00:05 on the 1st day of every month
     */
    @Scheduled(cron = "0 5 0 1 * ?")
    public void generateMonthlyBills() {

        String month = YearMonth.now().toString(); // YYYY-MM

        autoUtilityService.generateForMonth(month);

        monthlyBillService.generateBillsForMonth(month);
    }
}
