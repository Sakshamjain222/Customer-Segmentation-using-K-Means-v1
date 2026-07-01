package com.segmentation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClusterItemSummary {
    private Integer clusterId;
    private String label;
    private Long count;
    private Double avgIncome;
    private Double avgSpendingScore;
}
