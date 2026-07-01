package com.segmentation.repository;

import com.segmentation.model.CustomerPrediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CustomerPredictionRepository extends JpaRepository<CustomerPrediction, Long> {

    List<CustomerPrediction> findByOrderByCreatedAtDesc();

    @Query("SELECT c.clusterId as clusterId, c.clusterLabel as label, COUNT(c) as count, AVG(c.annualIncome) as avgIncome, AVG(c.spendingScore) as avgSpendingScore FROM CustomerPrediction c GROUP BY c.clusterId, c.clusterLabel")
    List<Object[]> findClusterAggregates();
}
