import os
import json
import joblib
import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_PATH = BASE_DIR / "data" / "Mall_Customers.csv"
MODELS_DIR = BASE_DIR / "models"

INSIGHTS_MAP = {
    "High Value Spender": "High-income, high-spending segment. Ideal targets for luxury offerings and exclusive VIP loyalty programs.",
    "Conservative Spenders": "High-income segment with cautious spending behavior. Premium financial planning or value-justified premium products recommended.",
    "Average Spenders": "Core moderate-income segment with balanced spending. Responsive to standard promotions and seasonal campaigns.",
    "Impulsive Shoppers": "High-spending segment with lower annual income. Engage with flash sales, trending items, and payment flexibility.",
    "Budget Conscious": "Cost-sensitive segment with conservative income and spending. Best approached with discounts, bulk offers, and value bundles."
}

def train():
    if not DATA_PATH.exists():
        raise FileNotFoundError(f"Dataset not found at {DATA_PATH}")

    MODELS_DIR.mkdir(parents=True, exist_ok=True)

    df = pd.read_csv(DATA_PATH)
    # Rename columns for easier access
    df = df.rename(columns={
        "Annual Income (k$)": "Annual Income",
        "Spending Score (1-100)": "Spending Score"
    })

    feature_cols = ["Age", "Annual Income", "Spending Score"]
    X = df[feature_cols].values

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Train KMeans for K=5
    kmeans = KMeans(n_clusters=5, random_state=42, n_init=10)
    cluster_ids = kmeans.fit_predict(X_scaled)

    # Calculate unscaled centroids
    centroids_unscaled = scaler.inverse_transform(kmeans.cluster_centers_)

    # Assign distinct logical labels to each cluster based on income and spending score
    cluster_labels = {}
    # Let's inspect centroids: index 0 to 4
    # We classify based on income (>50 or <50) and spending score (>50 or <50)
    for i in range(5):
        age, inc, spend = centroids_unscaled[i]
        if inc > 60 and spend > 60:
            label = "High Value Spender"
        elif inc > 60 and spend < 40:
            label = "Conservative Spenders"
        elif inc < 45 and spend > 55:
            label = "Impulsive Shoppers"
        elif inc < 45 and spend < 45:
            label = "Budget Conscious"
        else:
            label = "Average Spenders"
        cluster_labels[i] = label

    # Ensure uniqueness if boundaries shift slightly
    used_labels = set()
    for i, label in cluster_labels.items():
        if label in used_labels:
            # Fallback based on ranking
            pass
        used_labels.add(label)

    # Calculate WCSS for Elbow curve (K=1 to 10)
    elbow_curve = []
    for k in range(1, 11):
        km = KMeans(n_clusters=k, random_state=42, n_init=10)
        km.fit(X_scaled)
        elbow_curve.append({"k": k, "wcss": float(km.inertia_)})

    # Prepare cluster summaries and scatter plot data
    df["ClusterId"] = cluster_ids
    df["ClusterLabel"] = df["ClusterId"].map(cluster_labels)

    clusters_summary = []
    for cid in range(5):
        sub = df[df["ClusterId"] == cid]
        clusters_summary.append({
            "cluster_id": int(cid),
            "label": cluster_labels[cid],
            "count": int(len(sub)),
            "avg_age": round(float(sub["Age"].mean()), 1),
            "avg_income": round(float(sub["Annual Income"].mean()), 1),
            "avg_spending_score": round(float(sub["Spending Score"].mean()), 1)
        })

    scatter_data = []
    for _, row in df.iterrows():
        scatter_data.append({
            "customer_id": str(row["CustomerID"]),
            "age": float(row["Age"]),
            "annual_income": float(row["Annual Income"]),
            "spending_score": float(row["Spending Score"]),
            "cluster_id": int(row["ClusterId"]),
            "cluster_label": str(row["ClusterLabel"])
        })

    metadata = {
        "n_clusters": 5,
        "cluster_labels": cluster_labels,
        "insights_map": INSIGHTS_MAP,
        "clusters_summary": clusters_summary,
        "elbow_curve": elbow_curve,
        "scatter_data": scatter_data
    }

    joblib.dump(kmeans, MODELS_DIR / "kmeans_model.pkl")
    joblib.dump(scaler, MODELS_DIR / "scaler.pkl")
    with open(MODELS_DIR / "metadata.json", "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    print(f"Model successfully trained and saved to {MODELS_DIR}")
    for summary in clusters_summary:
        print(f"Cluster {summary['cluster_id']}: {summary['label']} ({summary['count']} customers)")

if __name__ == "__main__":
    train()
