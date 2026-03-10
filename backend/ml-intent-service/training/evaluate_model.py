import joblib
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.metrics import confusion_matrix

from preprocessing.text_preprocessor import preprocess

model = joblib.load("model/intent_model_v1.joblib")
df = pd.read_csv("dataset/sbms_intents.csv")

df["clean_text"] = df["text"].apply(preprocess)

X = df["clean_text"]
y_true = df["intent"]
y_pred = model.predict(X)

cm = confusion_matrix(y_true, y_pred, labels=model.classes_)

plt.figure(figsize=(14, 10))
sns.heatmap(
    cm,
    xticklabels=model.classes_,
    yticklabels=model.classes_,
    annot=True,
    fmt="d"
)
plt.title("SBMS Intent Classification Confusion Matrix")
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.tight_layout()
plt.show()
