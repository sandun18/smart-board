package com.sbms.sbms_monolith.service;

import com.sbms.sbms_monolith.dto.subscription.SubscriptionCreateDTO;
import com.sbms.sbms_monolith.dto.subscription.SubscriptionResponseDTO;
import com.sbms.sbms_monolith.mapper.SubscriptionMapper;
import com.sbms.sbms_monolith.model.Subscription;
import com.sbms.sbms_monolith.model.SubscriptionPlan;
import com.sbms.sbms_monolith.model.User;
import com.sbms.sbms_monolith.repository.SubscriptionPlanRepository;
import com.sbms.sbms_monolith.repository.SubscriptionRepository;
import com.sbms.sbms_monolith.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final SubscriptionMapper subscriptionMapper;

    @Transactional
    public SubscriptionResponseDTO createSubscription(SubscriptionCreateDTO dto) {
        User owner = userRepository.findById(dto.getOwnerId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, 
                        "Owner not found with id: " + dto.getOwnerId()));

        // Validate subscription plan exists
        SubscriptionPlan plan = subscriptionPlanRepository.findById(dto.getPlanId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, 
                        "Subscription plan not found with id: " + dto.getPlanId()));

        // Create subscription
        Subscription subscription = new Subscription();
        subscription.setOwner(owner);
        subscription.setSubscriptionPlan(plan);
        subscription.setStartDate(dto.getStartDate() != null ? dto.getStartDate() : LocalDateTime.now());
        
        // Calculate end date based on plan duration if not provided
        if (dto.getEndDate() != null) {
            subscription.setEndDate(dto.getEndDate());
        } else {
            subscription.setEndDate(calculateEndDate(subscription.getStartDate(), plan.getDuration()));
        }
        
        String statusValue = dto.getStatus() == null ? "ACTIVE" : dto.getStatus().trim().toUpperCase();
        subscription.setStatus(Subscription.SubscriptionStatus.valueOf(statusValue));
        subscription.setAdId(dto.getAdId());

        Subscription saved = subscriptionRepository.save(subscription);
        return subscriptionMapper.toResponseDto(saved);
    }
    public List<SubscriptionResponseDTO> getOwnerSubscriptions(Long ownerId) {
        return subscriptionRepository.findByOwnerIdOrderByCreatedAtDesc(ownerId)
                .stream()
                .map(subscriptionMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    public List<SubscriptionResponseDTO> getActiveSubscriptions() {
        return subscriptionRepository.findByStatusOrderByCreatedAtDesc(Subscription.SubscriptionStatus.ACTIVE)
                .stream()
                .map(subscriptionMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    public SubscriptionResponseDTO getSubscriptionById(Long id) {
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, 
                        "Subscription not found with id: " + id));
        return subscriptionMapper.toResponseDto(subscription);
    }

    @Transactional
    public void cancelSubscription(Long id) {
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, 
                        "Subscription not found with id: " + id));
        
        subscription.setStatus(Subscription.SubscriptionStatus.CANCELLED);
        subscriptionRepository.save(subscription);
    }

    private LocalDateTime calculateEndDate(LocalDateTime startDate, String duration) {
        // Parse duration string (e.g., "30 Days", "1 Month", "7 Days")
        String[] parts = duration.toLowerCase().split(" ");
        if (parts.length >= 2) {
            try {
                int amount = Integer.parseInt(parts[0]);
                String unit = parts[1];
                
                if (unit.startsWith("day")) {
                    return startDate.plusDays(amount);
                } else if (unit.startsWith("week")) {
                    return startDate.plusWeeks(amount);
                } else if (unit.startsWith("month")) {
                    return startDate.plusMonths(amount);
                } else if (unit.startsWith("year")) {
                    return startDate.plusYears(amount);
                }
            } catch (NumberFormatException e) {
                // Default to 30 days if parsing fails
                return startDate.plusDays(30);
            }
        }
        
        // Default to 30 days
        return startDate.plusDays(30);
    }
}