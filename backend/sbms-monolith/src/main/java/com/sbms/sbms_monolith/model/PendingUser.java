package com.sbms.sbms_monolith.model;

import com.sbms.sbms_monolith.model.enums.Gender;
import com.sbms.sbms_monolith.model.enums.MaintenanceIssueType;
import com.sbms.sbms_monolith.model.enums.UserRole;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "pending_users")
public class PendingUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String email;
    private String password;
    private String phone;
    private String address;
    private Gender gender;
    private String nicNumber;
    private String accNo;
    private String studentUniversity;
    @Enumerated(EnumType.STRING)
    private UserRole role;

    private String province;
    private String city;
    private Double basePrice;

    @ElementCollection(targetClass = MaintenanceIssueType.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "pending_technician_skills", joinColumns = @JoinColumn(name = "pending_user_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "skill")
    private List<MaintenanceIssueType> skills;
}
