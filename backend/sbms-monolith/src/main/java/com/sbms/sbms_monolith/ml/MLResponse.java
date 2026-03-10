package com.sbms.sbms_monolith.ml;


import lombok.Data;

@Data
public class MLResponse {
    private String intent;
    private double confidence;
}
