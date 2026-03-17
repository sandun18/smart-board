package com.sbms.sbms_monolith.config;

import com.sbms.sbms_monolith.model.SubscriptionPlan;
import com.sbms.sbms_monolith.repository.SubscriptionPlanRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class SubscriptionPlanSeeder {

    private static final Logger logger = LoggerFactory.getLogger(SubscriptionPlanSeeder.class);

    @Bean
    public CommandLineRunner seedDefaultSubscriptionPlans(SubscriptionPlanRepository subscriptionPlanRepository) {
        return args -> {
            if (subscriptionPlanRepository.count() > 0) {
                logger.info("Subscription plans already exist. Skipping default seed.");
                return;
            }

            logger.info("Seeding default subscription plans...");

            List<SubscriptionPlan> plans = new ArrayList<>();

            // Owner plans
            SubscriptionPlan ownerStarter = new SubscriptionPlan();
            ownerStarter.setName("Owner Starter");
            ownerStarter.setPrice(1500.0);
            ownerStarter.setDurationDays(30);
            ownerStarter.setDuration("30 days");
            ownerStarter.setMaxAds(2);
            ownerStarter.setBoostAllowed(false);
            ownerStarter.setFeatures(String.join("\n",
                    "Basic listing visibility",
                    "Up to 2 active boarding ads",
                    "Shown in standard search results",
                    "Email notifications for student inquiries"
            ));
            ownerStarter.setDescription("Entry-level plan for new boarding owners who want basic visibility for a small number of ads.");
            ownerStarter.setActive(true);
            plans.add(ownerStarter);

            SubscriptionPlan ownerGrowth = new SubscriptionPlan();
            ownerGrowth.setName("Owner Growth");
            ownerGrowth.setPrice(3500.0);
            ownerGrowth.setDurationDays(30);
            ownerGrowth.setDuration("30 days");
            ownerGrowth.setMaxAds(5);
            ownerGrowth.setBoostAllowed(true);
            ownerGrowth.setFeatures(String.join("\n",
                    "Higher position in search results",
                    "Up to 5 active boarding ads",
                    "Ad boosting available once per ad",
                    "Highlight in listing cards",
                    "Basic performance metrics (views and inquiries)"
            ));
            ownerGrowth.setDescription("Designed for growing boarding owners who manage multiple listings and need higher visibility.");
            ownerGrowth.setActive(true);
            plans.add(ownerGrowth);

            SubscriptionPlan ownerPremium = new SubscriptionPlan();
            ownerPremium.setName("Owner Premium");
            ownerPremium.setPrice(6500.0);
            ownerPremium.setDurationDays(30);
            ownerPremium.setDuration("30 days");
            ownerPremium.setMaxAds(10);
            ownerPremium.setBoostAllowed(true);
            ownerPremium.setFeatures(String.join("\n",
                    "Top position in search and recommendation sections",
                    "Up to 10 active boarding ads",
                    "Unlimited ad boosting",
                    "Featured badge on listings",
                    "Advanced analytics (views, inquiries, conversions)",
                    "Priority support"
            ));
            ownerPremium.setDescription("Full-featured plan for professional owners who want maximum reach and insights.");
            ownerPremium.setActive(true);
            plans.add(ownerPremium);

            // Student plans
            SubscriptionPlan studentBasic = new SubscriptionPlan();
            studentBasic.setName("Student Basic");
            studentBasic.setPrice(0.0);
            studentBasic.setDurationDays(30);
            studentBasic.setDuration("30 days");
            studentBasic.setMaxAds(1);
            studentBasic.setBoostAllowed(false);
            studentBasic.setFeatures(String.join("\n",
                    "Browse all available boardings",
                    "Save a limited number of favorites",
                    "Send basic inquiries to owners",
                    "Standard support"
            ));
            studentBasic.setDescription("Free access to core student features for exploring available boardings.");
            studentBasic.setActive(true);
            plans.add(studentBasic);

            SubscriptionPlan studentPlus = new SubscriptionPlan();
            studentPlus.setName("Student Plus");
            studentPlus.setPrice(500.0);
            studentPlus.setDurationDays(30);
            studentPlus.setDuration("30 days");
            studentPlus.setMaxAds(1);
            studentPlus.setBoostAllowed(false);
            studentPlus.setFeatures(String.join("\n",
                    "Advanced filters for boardings",
                    "Unlimited saved favorites",
                    "Priority shown to owners when you inquire",
                    "Reminders for appointments and payments",
                    "Email support"
            ));
            studentPlus.setDescription("Adds extra tools and better visibility when contacting owners.");
            studentPlus.setActive(true);
            plans.add(studentPlus);

            SubscriptionPlan studentPremium = new SubscriptionPlan();
            studentPremium.setName("Student Premium");
            studentPremium.setPrice(1000.0);
            studentPremium.setDurationDays(30);
            studentPremium.setDuration("30 days");
            studentPremium.setMaxAds(1);
            studentPremium.setBoostAllowed(false);
            studentPremium.setFeatures(String.join("\n",
                    "All Plus features",
                    "Top priority to owners when you inquire",
                    "Access to premium and verified boardings",
                    "Early access to new features",
                    "Priority chat and email support"
            ));
            studentPremium.setDescription("Full student experience with top visibility and verified boardings.");
            studentPremium.setActive(true);
            plans.add(studentPremium);

            subscriptionPlanRepository.saveAll(plans);
            logger.info("Seeded {} default subscription plans.", plans.size());
        };
    }
}

