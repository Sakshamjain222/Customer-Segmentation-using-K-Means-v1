package com.segmentation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SinglePredictionResponse {
    private String customerId;
    private Integer clusterId;
    private String clusterLabel;
    private Double confidence;
    private List<Double> distances;
    private String insights;
}
