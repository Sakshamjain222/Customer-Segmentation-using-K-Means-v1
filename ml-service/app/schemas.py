from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class CustomerFeatures(BaseModel):
    age: float = Field(..., example=34)
    annual_income: float = Field(..., alias="annual_income", example=72)
    spending_score: float = Field(..., alias="spending_score", example=61)
    gender: Optional[str] = Field("Female", example="Female")

    class Config:
        populate_by_name = True

class SinglePredictionRequest(BaseModel):
    features: CustomerFeatures

class SinglePredictionResponse(BaseModel):
    cluster_id: int
    cluster_label: str
    confidence: float
    distances: List[float]
    insights: str

class BatchPredictionItem(BaseModel):
    customer_id: str
    age: float
    annual_income: float
    spending_score: float
    gender: Optional[str] = "Unknown"

class BatchPredictionRequest(BaseModel):
    items: List[BatchPredictionItem]

class BatchPredictionResultItem(BaseModel):
    customer_id: str
    cluster_id: int
    cluster_label: str
    confidence: float
    insights: str

class BatchPredictionResponse(BaseModel):
    results: List[BatchPredictionResultItem]

class ClusterSummary(BaseModel):
    cluster_id: int
    label: str
    count: int
    avg_age: float
    avg_income: float
    avg_spending_score: float

class ElbowPoint(BaseModel):
    k: int
    wcss: float

class ScatterPoint(BaseModel):
    customer_id: str
    age: float
    annual_income: float
    spending_score: float
    cluster_id: int
    cluster_label: str

class ModelInfoResponse(BaseModel):
    n_clusters: int
    clusters: List[ClusterSummary]
    elbow_curve: List[ElbowPoint]
    scatter_data: List[ScatterPoint]
