"""from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI(title="SBMS ML Intent Service")

model = joblib.load("model/intent_model.joblib")

class PredictRequest(BaseModel):
    text: str

class PredictResponse(BaseModel):
    intent: str
    confidence: float

@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    probs = model.predict_proba([req.text])[0]
    classes = model.classes_

    max_index = int(np.argmax(probs))
    intent = classes[max_index]
    confidence = float(probs[max_index])

    return PredictResponse(
        intent=intent,
        confidence=round(confidence, 2)
    )

"""