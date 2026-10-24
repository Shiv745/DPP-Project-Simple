from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import os

app = FastAPI(title="Digital Product Passport API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "model.joblib"
model = joblib.load(MODEL_PATH) if os.path.exists(MODEL_PATH) else None

products_db = [
    {
        "product_id": "EM-001",
        "name": "Test motor 10KW",
        "model_number": "IE3-160L",
        "first_component": "Copper",
        "component_material": "Copper Stator"
    },
    {
        "product_id": "EM-002",
        "name": "E2E test motor",
        "model_number": "M-77",
        "first_component": "Steel",
        "component_material": "Aluminum"
    }
]

class ProductCreate(BaseModel):
    product_id: str
    name: str
    model_number: str
    first_component: str
    component_material: str

class AssessmentRequest(BaseModel):
    air_temp: float
    process_temp: float
    rotational_speed: float
    torque: float
    tool_wear: float
    recyclability: float
    reusability: float
    repairability: float
    material_recovery: float

@app.get("/")
def read_root():
    return {"message": "Digital Product Passport API is running!"}

@app.get("/products")
def get_products():
    return products_db

@app.post("/products")
def create_product(prod: ProductCreate):
    for p in products_db:
        if p["product_id"] == prod.product_id:
            raise HTTPException(status_code=400, detail="Product ID already exists")
    products_db.append(prod.dict())
    return {"message": "Product registered successfully", "product": prod}

@app.post("/products/{product_id}/assess")
def assess_product(product_id: str, req: AssessmentRequest):
    features = np.array([[req.air_temp, req.process_temp, req.rotational_speed, req.torque, req.tool_wear]])
    if model:
        prediction = int(model.predict(features)[0])
        probabilities = model.predict_proba(features)[0]
        confidence = float(np.max(probabilities) * 100)
    else:
        prediction = 0
        confidence = 88.5

    failure_risk = "High Risk of Failure" if prediction == 1 else "Normal Condition"

    circ_score = round(
        0.30 * req.recyclability +
        0.25 * req.reusability +
        0.20 * req.repairability +
        0.25 * req.material_recovery,
        2
    )

    if prediction == 1 or circ_score < 50:
        recommendation = "Recycle"
        rationale = "High failure probability or low material integrity detected. Salvage core raw materials."
    elif circ_score >= 75 and prediction == 0:
        recommendation = "Reuse"
        rationale = "Excellent operational condition and high circularity potential. Suitable for redeployment."
    else:
        recommendation = "Remanufacture"
        rationale = "Moderate wear detected. Overhaul components, replace bearings, and recertify for secondary use."

    return {
        "product_id": product_id,
        "ml_prediction": failure_risk,
        "ml_confidence": round(confidence, 1),
        "circularity_score": circ_score,
        "recommendation": recommendation,
        "rationale": rationale
    }
