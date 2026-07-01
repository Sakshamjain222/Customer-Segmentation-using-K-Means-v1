from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    with TestClient(app) as c:
        response = c.get("/ml/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"

def test_predict():
    with TestClient(app) as c:
        payload = {
            "features": {
                "age": 34,
                "annual_income": 88,
                "spending_score": 80
            }
        }
        response = c.post("/ml/predict", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["cluster_label"] == "High Value Spender"
        assert len(data["distances"]) == 5

def test_model_info():
    with TestClient(app) as c:
        response = c.get("/ml/model-info")
        assert response.status_code == 200
        data = response.json()
        assert data["n_clusters"] == 5
        assert len(data["clusters"]) == 5
        assert len(data["elbow_curve"]) == 10
        assert len(data["scatter_data"]) == 200

if __name__ == "__main__":
    test_health()
    test_predict()
    test_model_info()
    print("All FastAPI HTTP Endpoint Tests Passed Successfully!")
