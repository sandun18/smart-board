package com.sbms.sbms_monolith.repository;

import com.sbms.sbms_monolith.model.Appointment;
import com.sbms.sbms_monolith.model.User;
import com.sbms.sbms_monolith.model.Boarding;
import com.sbms.sbms_monolith.model.enums.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByStudent(User student);

    List<Appointment> findByBoarding(Boarding boarding);

    List<Appointment> findByBoarding_Owner(User owner);

    List<Appointment> findByBoarding_OwnerAndStatus(User owner, AppointmentStatus status);

    List<Appointment> findTop5ByBoarding_OwnerOrderByCreatedAtDesc(User owner);
}
