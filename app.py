import os
import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import model_train

# Initialize FastAPI app
app = FastAPI(title="School Result Prediction API")

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request body schema
class StudentData(BaseModel):
    attendance: float
    study_hours: float
    previous_score: float

# Global variable to hold the model
model = None

@app.on_event("startup")
async def startup_event():
    """Load model on startup, or train if missing."""
    global model
    model_path = 'model.pkl'
    
    if not os.path.exists(model_path):
        print("model.pkl not found. Training model automatically...")
        model_train.train_model()
    
    model = joblib.load(model_path)
    print("Model loaded successfully.")

@app.post("/predict")
async def predict(data: StudentData):
    """Predict if a student will pass or fail."""
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Prepare input for prediction
        input_data = np.array([[data.attendance, data.study_hours, data.previous_score]])
        
        # Get prediction and probability
        prediction_val = model.predict(input_data)[0]
        prediction_proba = model.predict_proba(input_data)[0]
        
        # Convert prediction result to human-readable format
        result = "Pass" if prediction_val == 1 else "Fail"
        confidence = float(np.max(prediction_proba))
        
        return {
            "prediction": result,
            "confidence": confidence
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Optional: Serve React frontend if built
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

dist_path = os.path.join(os.getcwd(), "dist")
if os.path.exists(dist_path):
    app.mount("/assets", StaticFiles(directory=os.path.join(dist_path, "assets")), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_react(full_path: str):
        # Serve index.html for all routes to support SPA
        return FileResponse(os.path.join(dist_path, "index.html"))
