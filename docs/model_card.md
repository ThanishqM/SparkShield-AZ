# 🧠 Model Card — Risk Scoring System

## 📌 Overview

This model is designed to estimate the **risk level of an individual or community** for a potential infectious disease outbreak.

Instead of predicting a specific disease, the goal is to **flag elevated risk early** using a combination of self-reported data and contextual signals.

---

## 🎯 Intended Use

This model is intended for:

* Early awareness and risk indication
* Supporting public health monitoring
* Providing users with simple, interpretable risk feedback

It is **not intended for medical diagnosis** or clinical decision-making.

---

## 📥 Inputs

The model uses a mix of user-provided and contextual data:

### User Inputs

* Reported symptoms (e.g., fever, cough, fatigue)
* Recent travel history
* Exposure to animals or crowded environments

### Contextual Inputs

* Location (city/region in Arizona)
* Environmental factors (e.g., temperature, humidity)
* General outbreak trends (simulated/public data)

---

## 📤 Outputs

The model produces:

* **Risk Score (0–100)**
* **Risk Category**:

  * Low
  * Moderate
  * High

The output is designed to be **easy to understand for non-expert users**.

---

## ⚙️ Model Approach

We used a **hybrid approach**:

* Rule-based scoring for known risk factors
* Weighted aggregation of:

  * symptom severity
  * exposure likelihood
  * environmental risk

This approach was chosen because:

* It is transparent
* Easy to adjust
* Works well with limited real-world data

---

## 📊 Performance

As this is a prototype, the model is evaluated using scenario-based testing rather than real-world labeled datasets.

### Evaluation Approach

We assessed performance by testing the model across a range of realistic input combinations to ensure consistent and logical behavior.

We specifically checked for:

* Consistency across different input scenarios
* Alignment with general public health expectations
* Gradual increase in risk with higher symptom severity and exposure

---

### Example Scenarios

* High symptoms + high-risk location → High risk
* Moderate symptoms + recent travel → Moderate to high risk
* Mild symptoms + low exposure → Low risk

---

### Consistency Checks

We verified that:

* Increasing symptom intensity raises the overall risk score
* Exposure-related factors (travel, contact) significantly influence outcomes
* Environmental conditions appropriately adjust risk levels

---

## ⚠️ Limitations

* Does not predict specific diseases
* Relies on simulated or limited public data
* May oversimplify complex epidemiological factors
* Not validated against real clinical outcomes

---

## ⚖️ Bias and Fairness

Potential risks:

* Geographic bias if data is uneven across regions
* Overweighting certain symptoms
* Underrepresentation of vulnerable populations

We attempt to mitigate this by:

* Keeping scoring rules adjustable
* Avoiding sensitive personal data
* Focusing on general risk rather than diagnosis

---

## 🔍 Explainability

The model is designed to be explainable:

* Risk is derived from visible factors
* Users can understand why their score is high or low
* No black-box predictions

---

## 🔄 Human-in-the-Loop

* Users provide and update their own data
* Public health officials can interpret aggregated results
* The system is meant to support—not replace—human judgment

---

## 🚀 Future Improvements

* Incorporate real epidemiological datasets
* Train ML models on labeled outbreak data
* Add time-based prediction (trend forecasting)
* Improve personalization of risk scoring

---

## 🧩 Summary

This model prioritizes:

* Simplicity
* Transparency
* Early warning capability

Rather than being perfectly accurate, it aims to be **useful, understandable, and actionable**.

