package com.sbms.sbms_monolith.config;

import com.sbms.sbms_monolith.model.User;
import com.sbms.sbms_monolith.model.enums.UserRole;
import com.sbms.sbms_monolith.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminSeeder {

    private static final Logger logger = LoggerFactory.getLogger(AdminSeeder.class);

    @Bean
    public CommandLineRunner seedAdminUser(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${sbms.admin.seed.enabled:true}") boolean adminSeedEnabled,
            @Value("${sbms.admin.email:admin@smartboard.com}") String adminEmail,
            @Value("${sbms.admin.password:Admin@123}") String adminPassword,
            @Value("${sbms.admin.full-name:System Admin}") String adminFullName) {
        return args -> {
            if (!adminSeedEnabled) {
                logger.info("Admin seed is disabled.");
                return;
            }

            if (userRepository.countByRole(UserRole.ADMIN) > 0) {
                logger.info("Admin user already exists. Skipping seed.");
                return;
            }

            if (userRepository.existsByEmail(adminEmail)) {
                logger.warn("Admin seed skipped because email {} already exists without ADMIN role.", adminEmail);
                return;
            }

            User adminUser = new User();
            adminUser.setFullName(adminFullName);
            adminUser.setEmail(adminEmail);
            adminUser.setPassword(passwordEncoder.encode(adminPassword));
            adminUser.setRole(UserRole.ADMIN);
            adminUser.setVerifiedOwner(true);

            userRepository.save(adminUser);
            logger.info("Seeded default admin user with email {}.", adminEmail);
        };
    }
}