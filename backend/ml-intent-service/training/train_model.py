import pandas as pd
import joblib

from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report

from preprocessing.text_preprocessor import preprocess

# Load dataset
df = pd.read_csv("dataset/sbms_intents.csv")
df["clean_text"] = df["text"].apply(preprocess)

X = df["clean_text"]
y = df["intent"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model = Pipeline([
    ("tfidf", TfidfVectorizer(
        ngram_range=(1,3),
        analyzer="word",
        sublinear_tf=True,
        min_df=1,
        max_df=0.9
    )),
    ("clf", LogisticRegression(
        max_iter=3000,
        class_weight="balanced",
        C=4.0
    ))
])

model.fit(X_train, y_train)
y_pred = model.predict(X_test)

print("\n=== CLASSIFICATION REPORT ===")
print(classification_report(y_test, y_pred, zero_division=0))

joblib.dump(model, "model/intent_model_v2.joblib")
print("Model saved as intent_model_v2.joblib")
