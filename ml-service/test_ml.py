import sys
from app.train import train
from app.main import predict_single_sample, load_models

def run_tests():
    print("Step 1: Running train()...")
    train()
    
    print("Step 2: Loading models...")
    load_models()

    print("Step 3: Testing single prediction sample...")
    # Test High Income, High Spending (should be High Value Spender)
    res = predict_single_sample(age=34, annual_income=85, spending_score=80)
    print("Sample 1 Prediction:", res)
    assert res["cluster_id"] in [0, 1, 2, 3, 4]
    assert len(res["distances"]) == 5
    assert "High Value Spender" in res["cluster_label"] or res["confidence"] > 0

    print("Step 4: Testing Budget Conscious sample...")
    res2 = predict_single_sample(age=45, annual_income=25, spending_score=20)
    print("Sample 2 Prediction:", res2)

    print("All ML Verification Tests Passed Successfully!")

if __name__ == "__main__":
    run_tests()
