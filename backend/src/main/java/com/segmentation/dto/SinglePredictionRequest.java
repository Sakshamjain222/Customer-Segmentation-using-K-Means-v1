package com.segmentation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SinglePredictionRequest {
    private String customerId;
    private Double age;
    private Double annualIncome;
    private Double spendingScore;
    private String gender;
}
