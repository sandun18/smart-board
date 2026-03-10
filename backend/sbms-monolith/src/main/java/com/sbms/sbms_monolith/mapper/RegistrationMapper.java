package com.sbms.sbms_monolith.mapper;

import org.springframework.beans.factory.annotation.Autowired;

import com.sbms.sbms_monolith.dto.registration.RegistrationResponseDTO;
import com.sbms.sbms_monolith.model.PaymentIntent;
import com.sbms.sbms_monolith.model.Registration;
import com.sbms.sbms_monolith.repository.PaymentIntentRepository;



public class RegistrationMapper {
	
	@Autowired
    private PaymentIntentRepository paymentIntentRepo;

    public static RegistrationResponseDTO toDTO(Registration r) {
        RegistrationResponseDTO dto = new RegistrationResponseDTO();

        dto.setId(r.getId());

        dto.setBoardingId(r.getBoarding().getId());
        dto.setBoardingTitle(r.getBoarding().getTitle());

        dto.setStudentId(r.getStudent().getId());
        dto.setStudentName(r.getStudent().getFullName());
        dto.setStudentEmail(r.getStudent().getEmail());

        dto.setNumberOfStudents(r.getNumberOfStudents());
        dto.setStatus(r.getStatus());
        dto.setStudentNote(r.getStudentNote());
        dto.setOwnerNote(r.getOwnerNote());

        dto.setKeyMoney(r.getBoarding().getKeyMoney());
        dto.setMonthlyPrice(r.getBoarding().getPricePerMonth());
        dto.setKeyMoneyPaid(r.isKeyMoneyPaid());
        dto.setPaymentSlipUrl(r.getPaymentTransactionRef());
        dto.setAgreementPdfPath(r.getAgreementPdfPath());

        
        dto.setPaymentMethod(r.getPaymentMethod());


        return dto;
    }
}
