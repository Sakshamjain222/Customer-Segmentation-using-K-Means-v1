import React, { useState } from 'react';
import { CustomerForm } from '../components/CustomerForm';
import { PredictionResultCard } from '../components/PredictionResultCard';
import type { SinglePredictionRequest, SinglePredictionResponse } from '../types';

export const PredictPage: React.FC = () => {
  const [result, setResult] = useState<SinglePredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async (data: SinglePredictionRequest) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/v1/predict/single', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const mlResponse = await fetch('http://localhost:8000/ml/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ features: data }),
        });
        const mlData = await mlResponse.json();
        setResult({
          customerId: data.customerId || 'CUST-DEMO',
          clusterId: mlData.cluster_id,
          clusterLabel: mlData.cluster_label,
          confidence: mlData.confidence,
          distances: mlData.distances,
          insights: mlData.insights,
        });
      } else {
        const resData = await response.json();
        setResult(resData);
      }
    } catch (err) {
      console.error('Prediction API error, attempting direct ML call fallback:', err);
      try {
        const mlResponse = await fetch('http://localhost:8000/ml/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ features: data }),
        });
        const mlData = await mlResponse.json();
        setResult({
          customerId: data.customerId || 'CUST-DEMO',
          clusterId: mlData.cluster_id,
          clusterLabel: mlData.cluster_label,
          confidence: mlData.confidence,
          distances: mlData.distances,
          insights: mlData.insights,
        });
      } catch (fallbackErr) {
        alert('Could not reach backend or ML service. Ensure backend/ML service is running on port 8080 or 8000.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', color: '#fff' }}>Real-Time Customer Segmentation</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Enter customer telemetry attributes to compute Euclidean distances against cluster centroids.
        </p>
      </div>

      <div className="chart-grid">
        <CustomerForm onSubmit={handlePredict} loading={loading} />
        <PredictionResultCard result={result} />
      </div>
    </div>
  );
};
