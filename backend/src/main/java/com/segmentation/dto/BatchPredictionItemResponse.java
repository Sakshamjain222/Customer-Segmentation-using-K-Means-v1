package com.segmentation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatchPredictionItemResponse {
    private String customerId;
    private Integer clusterId;
    private String clusterLabel;
    private Double confidence;
    private String insights;
}
