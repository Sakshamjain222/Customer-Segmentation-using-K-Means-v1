package com.segmentation.service;

import com.segmentation.dto.*;
import com.segmentation.model.CustomerPrediction;
import com.segmentation.repository.CustomerPredictionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class PredictionService {

    @Autowired
    private MlServiceClient mlServiceClient;

    @Autowired
    private CustomerPredictionRepository predictionRepository;

    @Transactional
    public SinglePredictionResponse predictSingle(SinglePredictionRequest req) {
        Map<String, Object> mlRes = mlServiceClient.predictSingle(
                req.getAge(), req.getAnnualIncome(), req.getSpendingScore(), req.getGender()
        );

        Integer clusterId = (Integer) mlRes.get("cluster_id");
        String clusterLabel = (String) mlRes.get("cluster_label");
        Double confidence = ((Number) mlRes.get("confidence")).doubleValue();
        String insights = (String) mlRes.get("insights");
        List<Double> distances = (List<Double>) mlRes.get("distances");

        CustomerPrediction entity = CustomerPrediction.builder()
                .customerId(req.getCustomerId() != null && !req.getCustomerId().isEmpty() ? req.getCustomerId() : "CUST-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase())
                .age(req.getAge())
                .annualIncome(req.getAnnualIncome())
                .spendingScore(req.getSpendingScore())
                .gender(req.getGender() != null ? req.getGender() : "Unknown")
                .clusterId(clusterId)
                .clusterLabel(clusterLabel)
                .confidence(confidence)
                .insights(insights)
                .createdAt(LocalDateTime.now())
                .build();

        predictionRepository.save(entity);

        return SinglePredictionResponse.builder()
                .customerId(entity.getCustomerId())
                .clusterId(clusterId)
                .clusterLabel(clusterLabel)
                .confidence(confidence)
                .distances(distances)
                .insights(insights)
                .build();
    }

    @Transactional
    public BatchPredictionResponse predictBatch(MultipartFile file) throws Exception {
        List<Map<String, Object>> mlItems = new ArrayList<>();
        List<CustomerPrediction> entitiesToSave = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            boolean firstLine = true;
            while ((line = reader.readLine()) != null) {
                if (line.trim().isEmpty()) continue;
                if (firstLine) {
                    firstLine = false;
                    continue; // skip header
                }
                String[] cols = line.split(",");
                if (cols.length < 5) continue;

                String customerId = cols[0].trim();
                String gender = cols[1].trim();
                Double age = Double.parseDouble(cols[2].trim());
                Double income = Double.parseDouble(cols[3].trim());
                Double score = Double.parseDouble(cols[4].trim());

                Map<String, Object> item = new HashMap<>();
                item.put("customer_id", customerId);
                item.put("age", age);
                item.put("annual_income", income);
                item.put("spending_score", score);
                item.put("gender", gender);
                mlItems.add(item);
            }
        }

        if (mlItems.isEmpty()) {
            throw new IllegalArgumentException("No valid customer records found in uploaded CSV.");
        }

        Map<String, Object> batchRes = mlServiceClient.predictBatch(mlItems);
        List<Map<String, Object>> resList = (List<Map<String, Object>>) batchRes.get("results");

        List<BatchPredictionItemResponse> itemResponses = new ArrayList<>();
        String jobId = "job-" + LocalDateTime.now().toString().replaceAll("[-:.T]", "").substring(0, 14);

        for (int i = 0; i < mlItems.size(); i++) {
            Map<String, Object> reqItem = mlItems.get(i);
            Map<String, Object> resItem = resList.get(i);

            String cid = (String) resItem.get("customer_id");
            Integer cId = (Integer) resItem.get("cluster_id");
            String cLabel = (String) resItem.get("cluster_label");
            Double conf = ((Number) resItem.get("confidence")).doubleValue();
            String ins = (String) resItem.get("insights");

            CustomerPrediction entity = CustomerPrediction.builder()
                    .customerId(cid)
                    .age((Double) reqItem.get("age"))
                    .annualIncome((Double) reqItem.get("annual_income"))
                    .spendingScore((Double) reqItem.get("spending_score"))
                    .gender((String) reqItem.get("gender"))
                    .clusterId(cId)
                    .clusterLabel(cLabel)
                    .confidence(conf)
                    .insights(ins)
                    .createdAt(LocalDateTime.now())
                    .build();

            entitiesToSave.add(entity);

            itemResponses.add(BatchPredictionItemResponse.builder()
                    .customerId(cid)
                    .clusterId(cId)
                    .clusterLabel(cLabel)
                    .confidence(conf)
                    .insights(ins)
                    .build());
        }

        predictionRepository.saveAll(entitiesToSave);

        return BatchPredictionResponse.builder()
                .jobId(jobId)
                .status("completed")
                .totalRecords(itemResponses.size())
                .results(itemResponses)
                .build();
    }

    public ClusterSummaryResponse getClusterSummary() {
        // Fetch from ML model info to get authoritative dataset cluster statistics
        Map<String, Object> modelInfo = mlServiceClient.getModelInfo();
        List<Map<String, Object>> clustersList = (List<Map<String, Object>>) modelInfo.get("clusters");

        List<ClusterItemSummary> summaries = new ArrayList<>();
        if (clustersList != null) {
            for (Map<String, Object> c : clustersList) {
                summaries.add(ClusterItemSummary.builder()
                        .clusterId((Integer) c.get("cluster_id"))
                        .label((String) c.get("label"))
                        .count(((Number) c.get("count")).longValue())
                        .avgIncome(((Number) c.get("avg_income")).doubleValue())
                        .avgSpendingScore(((Number) c.get("avg_spending_score")).doubleValue())
                        .build());
            }
        }
        return ClusterSummaryResponse.builder().clusters(summaries).build();
    }

    public Map<String, Object> getModelAnalytics() {
        return mlServiceClient.getModelInfo();
    }
    
    public List<CustomerPrediction> getHistory() {
        return predictionRepository.findByOrderByCreatedAtDesc();
    }
}
