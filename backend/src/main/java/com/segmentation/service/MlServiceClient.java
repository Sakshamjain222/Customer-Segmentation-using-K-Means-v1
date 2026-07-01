package com.segmentation.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MlServiceClient {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${ml.service.url:http://localhost:8000}")
    private String mlServiceUrl;

    public Map<String, Object> predictSingle(Double age, Double annualIncome, Double spendingScore, String gender) {
        String url = mlServiceUrl + "/ml/predict";
        
        Map<String, Object> features = new HashMap<>();
        features.put("age", age);
        features.put("annual_income", annualIncome);
        features.put("spending_score", spendingScore);
        features.put("gender", gender != null ? gender : "Unknown");

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("features", features);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
        return response.getBody();
    }

    public Map<String, Object> predictBatch(List<Map<String, Object>> items) {
        String url = mlServiceUrl + "/ml/predict/batch";
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("items", items);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
        return response.getBody();
    }

    public Map<String, Object> getModelInfo() {
        String url = mlServiceUrl + "/ml/model-info";
        ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
        return response.getBody();
    }
}
