from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import json
import numpy as np

from preprocessing.text_preprocessor import preprocess

app = FastAPI(title="SBMS ML Intent Service")

# Load model
model = joblib.load("model/intent_model_v2.joblib")

# Load metadata
with open("model/metadata.json") as f:
    META = json.load(f)

class PredictRequest(BaseModel):
    text: str

class PredictResponse(BaseModel):
    intent: str
    confidence: float
    fallback: bool



@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):

    # 1️⃣ Preprocess input
    processed_text = preprocess(req.text)

    # 2️⃣ LIGHT RULE LAYER (BEFORE ML DECISION)
    text_tokens = processed_text.split()

    # ---- Rule-based overrides (high confidence patterns) ----
    if "pay" in text_tokens and ("step" in text_tokens or "how" in text_tokens):
        return PredictResponse(
            intent="PAYMENT_HELP",
            confidence=0.95,
            fallback=False
        )

    if "payment" in text_tokens and "failed" in text_tokens:
        return PredictResponse(
            intent="PAYMENT_FAILED",
            confidence=0.95,
            fallback=False
        )

    # 3️⃣ ML MODEL PREDICTION
    probs = model.predict_proba([processed_text])[0]
    classes = model.classes_

    sorted_indices = np.argsort(probs)[::-1]
    top1, top2 = sorted_indices[0], sorted_indices[1]

    intent = classes[top1]
    confidence = float(probs[top1])

    ambiguous = (probs[top1] - probs[top2]) < META["ambiguity_margin"]

    threshold = META["intent_thresholds"].get(
        intent, META["default_threshold"]
    )

    if confidence < threshold or ambiguous:
        return PredictResponse(
            intent="UNKNOWN",
            confidence=round(confidence, 2),
            fallback=True
        )

    return PredictResponse(
        intent=intent,
        confidence=round(confidence, 2),
        fallback=False
    )
