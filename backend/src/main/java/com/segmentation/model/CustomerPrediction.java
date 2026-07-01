package com.segmentation.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_predictions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerPrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_id", nullable = false)
    private String customerId;

    @Column(name = "age", nullable = false)
    private Double age;

    @Column(name = "annual_income", nullable = false)
    private Double annualIncome;

    @Column(name = "spending_score", nullable = false)
    private Double spendingScore;

    @Column(name = "gender")
    private String gender;

    @Column(name = "cluster_id", nullable = false)
    private Integer clusterId;

    @Column(name = "cluster_label", nullable = false)
    private String clusterLabel;

    @Column(name = "confidence")
    private Double confidence;

    @Column(name = "insights", length = 1000)
    private String insights;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
