from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
from fastapi.middleware.cors import CORSMiddleware


# Load your trained model (which has been trained on 13 features)
model = joblib.load('housing.pkl')

# Initialize FastAPI app
app = FastAPI()

origins = [
    "http://localhost:8080",  # Add the address of your React frontend here
    "http://127.0.0.1:3000", 
    "https://houseprice-prediction-satish.vercel.app" # You can add any origin that needs to access your API
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Define input data model with all required fields (13 features)
class HouseFeatures(BaseModel):
    bedrooms: int
    bathrooms: float
    sqft_living: float
    sqft_lot: float
    floors: float
    condition: int
    grade: int
    yr_built: int
    zipcode: int
    lat: float
    long: float
    sqft_living15: float
    sqft_lot15: float

@app.get("/")
def read_root():
    return {"message": "backend connected to uvicorn"}


# Define prediction route
@app.post("/predict")
def predict_price(features: HouseFeatures):
    # Prepare input features for prediction
    input_data = np.array([[features.bedrooms, features.bathrooms, features.sqft_living,
                            features.sqft_lot, features.floors, features.condition,
                            features.grade, features.yr_built, features.zipcode,
                            features.lat, features.long, features.sqft_living15, features.sqft_lot15]])
    
    # Make prediction
    predicted_price = model.predict(input_data)[0]

    # Convert to native Python float for JSON response
    return {"predicted_price": float(predicted_price)}
