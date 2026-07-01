export interface ClusterSummary {
  clusterId: number;
  label: string;
  count: number;
  avgIncome: number;
  avgSpendingScore: number;
}

export interface SinglePredictionRequest {
  customerId?: string;
  age: number;
  annualIncome: number;
  spendingScore: number;
  gender: string;
}

export interface SinglePredictionResponse {
  customerId: string;
  clusterId: number;
  clusterLabel: string;
  confidence: number;
  distances?: number[];
  insights: string;
}

export interface BatchPredictionItem {
  customerId: string;
  clusterId: number;
  clusterLabel: string;
  confidence: number;
  insights: string;
}

export interface BatchPredictionResponse {
  jobId: string;
  status: string;
  totalRecords: number;
  results: BatchPredictionItem[];
}

export interface ElbowPoint {
  k: number;
  wcss: number;
}

export interface ScatterPoint {
  customer_id: string;
  age: number;
  annual_income: number;
  spending_score: number;
  cluster_id: number;
  cluster_label: string;
}
