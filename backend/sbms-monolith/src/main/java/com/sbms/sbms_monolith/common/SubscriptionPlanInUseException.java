package com.sbms.sbms_monolith.common;

public class SubscriptionPlanInUseException extends RuntimeException {

    private final Long planId;
    private final long ownerSubscriptionCount;
    private final long subscriptionCount;

    public SubscriptionPlanInUseException(Long planId, long ownerSubscriptionCount, long subscriptionCount) {
        super(buildMessage(ownerSubscriptionCount, subscriptionCount));
        this.planId = planId;
        this.ownerSubscriptionCount = ownerSubscriptionCount;
        this.subscriptionCount = subscriptionCount;
    }

    public Long getPlanId() {
        return planId;
    }

    public long getOwnerSubscriptionCount() {
        return ownerSubscriptionCount;
    }

    public long getSubscriptionCount() {
        return subscriptionCount;
    }

    private static String buildMessage(long ownerSubscriptionCount, long subscriptionCount) {
        return "This plan is currently used by active subscriptions. "
            + "ownerSubscriptions=" + ownerSubscriptionCount
            + ", adSubscriptions=" + subscriptionCount;
    }
}
