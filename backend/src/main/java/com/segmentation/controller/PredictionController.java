package com.segmentation.controller;

import com.segmentation.dto.*;
import com.segmentation.model.CustomerPrediction;
import com.segmentation.service.PredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class PredictionController {

    @Autowired
    private PredictionService predictionService;

    @PostMapping("/predict/single")
    public ResponseEntity<SinglePredictionResponse> predictSingle(@RequestBody SinglePredictionRequest request) {
        SinglePredictionResponse response = predictionService.predictSingle(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/predict/batch")
    public ResponseEntity<BatchPredictionResponse> predictBatch(@RequestParam("file") MultipartFile file) {
        try {
            BatchPredictionResponse response = predictionService.predictBatch(file);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(BatchPredictionResponse.builder()
                    .status("error: " + e.getMessage())
                    .build());
        }
    }

    @GetMapping("/clusters/summary")
    public ResponseEntity<ClusterSummaryResponse> getClusterSummary() {
        return ResponseEntity.ok(predictionService.getClusterSummary());
    }

    @GetMapping("/analytics/model")
    public ResponseEntity<Map<String, Object>> getModelAnalytics() {
        return ResponseEntity.ok(predictionService.getModelAnalytics());
    }

    @GetMapping("/history")
    public ResponseEntity<List<CustomerPrediction>> getPredictionHistory() {
        return ResponseEntity.ok(predictionService.getHistory());
    }
}
