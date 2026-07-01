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
public class BatchPredictionResponse {
    private String jobId;
    private String status;
    private Integer totalRecords;
    private List<BatchPredictionItemResponse> results;
}
