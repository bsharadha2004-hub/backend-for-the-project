import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# 1. Create a synthetic dataset for school results
# Features: [Attendance (%), Study Hours (per week), Previous Score (0-100)]
def create_dataset():
    print("Creating synthetic school result dataset...")
    np.random.seed(42)
    n_samples = 1000
    
    # Generate random features
    attendance = np.random.randint(40, 100, n_samples)
    study_hours = np.random.randint(5, 40, n_samples)
    prev_scores = np.random.randint(30, 100, n_samples)
    
    X = np.column_stack((attendance, study_hours, prev_scores))
    
    # Define target logic: Pass if weighted sum is above threshold
    # Logic: 0.3*Att + 0.2*Study + 0.5*PrevScore + Noise
    noise = np.random.normal(0, 5, n_samples)
    scores = 0.3 * attendance + 0.2 * study_hours + 0.5 * prev_scores + noise
    y = (scores > 50).astype(int)  # 1: Pass, 0: Fail
    
    return X, y

# 2. Train the model
def train_model():
    X, y = create_dataset()
    
    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print(f"Training on {len(X_train)} samples...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate performance
    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)
    print(f"Model Training Complete. Accuracy: {accuracy * 100:.2f}%")
    
    # 3. Save the model
    joblib.dump(model, 'model.pkl')
    print("Model saved as model.pkl")

if __name__ == "__main__":
    train_model()
