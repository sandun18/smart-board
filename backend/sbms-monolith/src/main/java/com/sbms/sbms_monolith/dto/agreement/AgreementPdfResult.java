package com.sbms.sbms_monolith.dto.agreement;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AgreementPdfResult {
    private String pdfUrl;
    private String pdfHash;
}
