package com.sbms.sbms_monolith.scheduler;

import com.sbms.sbms_monolith.service.OwnerSubscriptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class OwnerSubscriptionExpiryScheduler {

    private final OwnerSubscriptionService ownerSubscriptionService;

    // Run every hour to expire outdated subscriptions.
    @Scheduled(cron = "0 0 * * * *")
    public void expireOwnerSubscriptions() {
        int expiredCount = ownerSubscriptionService.expireSubscriptionsIfDue();
        if (expiredCount > 0) {
            log.info("Expired {} owner subscriptions based on endDate", expiredCount);
        }
    }
}
