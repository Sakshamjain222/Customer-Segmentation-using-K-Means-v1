import json
import joblib
import numpy as np
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from app.schemas import (
    SinglePredictionRequest,
    SinglePredictionResponse,
    BatchPredictionRequest,
    BatchPredictionResponse,
    BatchPredictionResultItem,
    ModelInfoResponse
)
from app.train import train, MODELS_DIR

model_state = {}

def load_models():
    model_path = MODELS_DIR / "kmeans_model.pkl"
    scaler_path = MODELS_DIR / "scaler.pkl"
    metadata_path = MODELS_DIR / "metadata.json"

    if not model_path.exists() or not scaler_path.exists() or not metadata_path.exists():
        print("Models not found. Running training script...")
        train()

    model_state["kmeans"] = joblib.load(model_path)
    model_state["scaler"] = joblib.load(scaler_path)
    with open(metadata_path, "r", encoding="utf-8") as f:
        model_state["metadata"] = json.load(f)
    print("ML models and metadata loaded successfully.")

@asynccontextmanager
async def lifespan(app: FastAPI):
    load_models()
    yield
    model_state.clear()

app = FastAPI(title="Customer Segmentation ML Microservice", version="1.0.0", lifespan=lifespan)

@app.get("/ml/health")
def health_check():
    is_loaded = "kmeans" in model_state and model_state["kmeans"] is not None
    return {"status": "healthy" if is_loaded else "degraded", "model_loaded": is_loaded}

def predict_single_sample(age: float, annual_income: float, spending_score: float):
    kmeans = model_state["kmeans"]
    scaler = model_state["scaler"]
    metadata = model_state["metadata"]

    X = np.array([[age, annual_income, spending_score]])
    X_scaled = scaler.transform(X)

    cluster_id = int(kmeans.predict(X_scaled)[0])
    
    # Calculate Euclidean distance to unscaled centroids or scaled centroids
    # Let's calculate Euclidean distance in unscaled feature space for human-interpretable distance
    centroids_unscaled = scaler.inverse_transform(kmeans.cluster_centers_)
    distances = [float(np.linalg.norm(X[0] - c)) for c in centroids_unscaled]

    # Calculate confidence based on distances
    sorted_dists = sorted(distances)
    if sorted_dists[0] == 0:
        confidence = 0.99
    else:
        d1 = sorted_dists[0]
        d2 = sorted_dists[1] if len(sorted_dists) > 1 else d1 * 2
        confidence = float(max(0.65, min(0.99, 1.0 - (d1 / (d1 + d2)))))
        confidence = round(confidence, 2)

    cluster_labels = metadata["cluster_labels"]
    # Handle json dict string keys
    cluster_label = cluster_labels.get(str(cluster_id), cluster_labels.get(cluster_id, f"Cluster {cluster_id}"))
    insights_map = metadata["insights_map"]
    insights = insights_map.get(cluster_label, f"Customer segment classified as {cluster_label}.")

    return {
        "cluster_id": cluster_id,
        "cluster_label": cluster_label,
        "confidence": confidence,
        "distances": [round(d, 2) for d in distances],
        "insights": insights
    }

@app.post("/ml/predict", response_model=SinglePredictionResponse)
def predict(request: SinglePredictionRequest):
    if "kmeans" not in model_state:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    f = request.features
    res = predict_single_sample(f.age, f.annual_income, f.spending_score)
    return res

@app.post("/ml/predict/batch", response_model=BatchPredictionResponse)
def predict_batch(request: BatchPredictionRequest):
    if "kmeans" not in model_state:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    results = []
    for item in request.items:
        res = predict_single_sample(item.age, item.annual_income, item.spending_score)
        results.append(BatchPredictionResultItem(
            customer_id=item.customer_id,
            cluster_id=res["cluster_id"],
            cluster_label=res["cluster_label"],
            confidence=res["confidence"],
            insights=res["insights"]
        ))
    return BatchPredictionResponse(results=results)

@app.get("/ml/model-info", response_model=ModelInfoResponse)
def model_info():
    if "metadata" not in model_state:
        raise HTTPException(status_code=503, detail="Metadata not loaded")
    
    m = model_state["metadata"]
    return ModelInfoResponse(
        n_clusters=m["n_clusters"],
        clusters=m["clusters_summary"],
        elbow_curve=m["elbow_curve"],
        scatter_data=m["scatter_data"]
    )
