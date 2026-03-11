//package com.sbms.sbms_monolith.controller;
//
//import com.sbms.sbms_monolith.dto.boarding.*;
//import com.sbms.sbms_monolith.service.OwnerBoardingService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/boardings/owner")
//@CrossOrigin
//public class OwnerBoardingController {
//
//    @Autowired
//    private OwnerBoardingService ownerBoardingService;
//
//    @PostMapping("/{ownerId}")
//    @PreAuthorize("hasRole('OWNER')")
//    public OwnerBoardingResponseDTO create(
//            @PathVariable Long ownerId,
//            @RequestBody BoardingCreateDTO dto
//    ) {
//        return ownerBoardingService.create(ownerId, dto);
//    }
//
//    @PutMapping("/{ownerId}/{boardingId}")
//    @PreAuthorize("hasRole('OWNER')")
//    public OwnerBoardingResponseDTO update(
//            @PathVariable Long ownerId,
//            @PathVariable Long boardingId,
//            @RequestBody BoardingUpdateDTO dto
//    ) {
//        return ownerBoardingService.update(ownerId, boardingId, dto);
//    }
//
//    @DeleteMapping("/{ownerId}/{boardingId}")
//    @PreAuthorize("hasRole('OWNER')")
//    public String delete(
//            @PathVariable Long ownerId,
//            @PathVariable Long boardingId
//    ) {
//        ownerBoardingService.delete(ownerId, boardingId);
//        return "Boarding deleted successfully.";
//    }
//
//    @GetMapping("/{ownerId}")
//    @PreAuthorize("hasRole('OWNER')")
//    public List<OwnerBoardingResponseDTO> getAll(@PathVariable Long ownerId) {
//        return ownerBoardingService.getAllByOwner(ownerId);
//    }
//
//    @PostMapping("/{ownerId}/{boardingId}/boost")
//    @PreAuthorize("hasRole('OWNER')")
//    public OwnerBoardingResponseDTO boost(
//            @PathVariable Long ownerId,
//            @PathVariable Long boardingId,
//            @RequestParam int days
//    ) {
//        return ownerBoardingService.boost(ownerId, boardingId, days);
//    }
//}





package com.sbms.sbms_monolith.controller;

import com.sbms.sbms_monolith.dto.boarding.*;
import com.sbms.sbms_monolith.model.User;
import com.sbms.sbms_monolith.repository.UserRepository;
import com.sbms.sbms_monolith.service.OwnerBoardingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/boardings/owner")
public class OwnerBoardingController {

    @Autowired
    private OwnerBoardingService ownerBoardingService;

    @Autowired
    private UserRepository userRepository;

    // ----------------------------------------------------
    // CREATE BOARDING
    // ----------------------------------------------------
    @PostMapping
    @PreAuthorize("hasRole('OWNER')")
    public OwnerBoardingResponseDTO create(
            Authentication authentication,
            @RequestBody BoardingCreateDTO dto
    ) {
        User owner = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ownerBoardingService.create(owner.getId(), dto);
    }

    // ----------------------------------------------------
    // UPDATE BOARDING
    // ----------------------------------------------------
    @PutMapping("/{boardingId}")
    @PreAuthorize("hasRole('OWNER')")
    public OwnerBoardingResponseDTO update(
            Authentication authentication,
            @PathVariable Long boardingId,
            @RequestBody BoardingUpdateDTO dto
    ) {
        User owner = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ownerBoardingService.update(owner.getId(), boardingId, dto);
    }

    // ----------------------------------------------------
    // DELETE BOARDING
    // ----------------------------------------------------
    @DeleteMapping("/{boardingId}")
    @PreAuthorize("hasRole('OWNER')")
    public String delete(
            Authentication authentication,
            @PathVariable Long boardingId
    ) {
        User owner = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        ownerBoardingService.delete(owner.getId(), boardingId);
        return "Boarding deleted successfully.";
    }

    // ----------------------------------------------------
    // GET ALL OWNER BOARDINGS
    // ----------------------------------------------------
    @GetMapping
    @PreAuthorize("hasRole('OWNER')")
    public List<OwnerBoardingResponseDTO> getAll(Authentication authentication) {

        User owner = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ownerBoardingService.getAllByOwner(owner.getId());
    }

    // ----------------------------------------------------
    // GET SINGLE BOARDING (OWNER VIEW)
    // ----------------------------------------------------
    @GetMapping("/{boardingId}")
    @PreAuthorize("hasRole('OWNER')")
    public OwnerBoardingResponseDTO getOne(
            Authentication authentication,
            @PathVariable Long boardingId
    ) {
        // 1. Get the logged-in owner
        User owner = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Call the service (Ensure this method exists in OwnerBoardingService!)
        return ownerBoardingService.getOne(owner.getId(), boardingId);
    }

    // ----------------------------------------------------
    // BOOST BOARDING
    // ----------------------------------------------------
    @PostMapping("/{boardingId}/boost")
    @PreAuthorize("hasRole('OWNER')")
    public OwnerBoardingResponseDTO boost(
            Authentication authentication,
            @PathVariable Long boardingId,
            @RequestParam int days
    ) {
        User owner = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ownerBoardingService.boost(owner.getId(), boardingId, days);
    }
}

