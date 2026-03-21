package com.sbms.sbms_monolith.model;

import com.sbms.sbms_monolith.common.BaseEntity;
import com.sbms.sbms_monolith.model.enums.Gender;
import com.sbms.sbms_monolith.model.enums.MaintenanceIssueType;
import com.sbms.sbms_monolith.model.enums.UserRole;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.List;

@Data
@Entity
@Table(name = "users")
public class User extends BaseEntity implements UserDetails {

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phone;

    private String profileImageUrl;  // stored in S3 later
    
    private Gender gender;
    
    private String nicNumber;
    
    private String address;

    private String dob;

    // Student
    private String emergencyContact;
    private String studentIdNumber;
    private String studentUniversity;

    // Owner
    private boolean verifiedOwner = true;
    private int subscription_id;
    private String accNo;

    // TECHNICIAN SPECIFIC FIELDS
    private String province;
    private String city;
    private Double basePrice;

    // Stores Skills (e.g. PLUMBING, ELECTRICAL)
    @ElementCollection(targetClass = MaintenanceIssueType.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "technician_skills", joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "skill")
    private List<MaintenanceIssueType> skills;

    // Technician Rating Stats
    @Column(precision = 3, scale = 1)
    private BigDecimal technicianAverageRating = BigDecimal.ZERO;
    private Integer technicianTotalJobs = 0;
 
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
    private List<Boarding> boardings;   // List of ads owner created

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // This converts your Enum "OWNER" -> "ROLE_OWNER"
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getUsername() {
        return email; // We use email as the username
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}
