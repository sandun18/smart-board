import re
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords

lemmatizer = WordNetLemmatizer()

STOP_WORDS = set(stopwords.words("english"))

# Domain words we KEEP (important!)
DOMAIN_KEEP = {
    "pay", "payment", "bill", "billing",
    "electricity", "water", "utility", "utilities",
    "rent", "fee", "charge",
    "register", "registration",
    "maintenance",
    "step", "steps", "how"
}


def preprocess(text: str) -> str:
    """
    Normalize student text:
    - lowercase
    - remove symbols
    - lemmatize
    - remove stopwords (except domain terms)
    """
    text = text.lower()
    text = re.sub(r"[^a-z\s]", "", text)

    tokens = text.split()

    cleaned = []
    for token in tokens:
        if token not in STOP_WORDS or token in DOMAIN_KEEP:
            cleaned.append(lemmatizer.lemmatize(token))

    return " ".join(cleaned)
