import joblib
import numpy as np

# load models once
model_complaint = joblib.load("models/xgb_complaint.pkl")
model_root = joblib.load("models/xgb_root.pkl")
model_priority = joblib.load("models/xgb_priority.pkl")

tfidf = joblib.load("models/tfidf.pkl")
le1 = joblib.load("models/le1.pkl")
le2 = joblib.load("models/le2.pkl")
le3 = joblib.load("models/le3.pkl")

def predict_all(text, product, issue, sub_issue, company):
    
    combined = issue + " " + sub_issue + " " + text
    
    embed_vec = embed_model.encode([combined])
    tfidf_vec = tfidf.transform([combined])

    # complaint
    complaint = le1.inverse_transform(
        model_complaint.predict(embed_vec)
    )[0]

    # root
    root = le2.inverse_transform(
        model_root.predict(embed_vec)
    )[0]

    # priority
    priority = le3.inverse_transform(
        model_priority.predict(tfidf_vec)
    )[0]

    # routing (rule-based)
    routing = route_complaint(issue, root)

    return {
        "complaint": complaint,
        "root_cause": root,
        "priority": priority,
        "routing": routing
    }
