# ⚙️ Technical Overview

## 🧩 System Overview

Our system is designed as a simple pipeline that takes user input, enriches it with contextual data, and produces a risk score.

We focused on keeping the system modular so each component can be improved independently.

---

## 🏗️ Architecture

The system has three main parts:

### 1. Frontend

* Built using React + Vite + Tailwind
* Allows users to:

  * Input symptoms and recent activity
  * View their risk score
  * Understand basic risk insights

---

### 2. Backend (API Layer)

* Handles incoming user data
* Processes and formats inputs
* Connects to external or simulated data sources
* Sends processed data to the risk model

---

### 3. Risk Scoring Module

* Core logic for generating risk scores
* Combines:

  * symptom severity
  * exposure likelihood
  * environmental context

---

## 🔄 Data Flow

1. User submits data through the frontend
2. Data is sent to the backend API
3. Backend enriches input with contextual signals:

   * location-based assumptions
   * environmental factors
4. Risk scoring module calculates a score
5. Result is returned to the frontend and displayed

---

## 🌐 Data Sources

We used a combination of:

* Public health references (CDC guidelines)
* Environmental assumptions (temperature, vector risk)
* Simulated datasets for testing user scenarios

Future versions would integrate:

* EpiCore API
* Real-time weather APIs
* Travel and mobility datasets

---

## 🤖 AI / Risk Model Integration

The system uses a lightweight scoring model instead of a heavy ML pipeline.

Key factors:

* Symptom intensity
* Exposure probability
* Location-based risk

The model is:

* Deterministic and explainable
* Easy to tune and extend
* Suitable for early-stage prototyping

---

## 🔍 Design Decisions

### Why not a complex ML model?

* Lack of real labeled outbreak data
* Need for explainability
* Faster development during hackathon

---

### Why modular architecture?

* Allows swapping data sources easily
* Makes it easier to scale later
* Separates UI, logic, and data concerns

---

## 🔄 Human-in-the-Loop Integration

* Users provide and update data directly
* Outputs are interpretable, not black-box
* System supports decision-making rather than automating it

---

## 🚧 Limitations

* No real-time data integration yet
* Uses simulated or assumed datasets
* Not validated with real-world epidemiological data

---

## 🚀 Future Improvements

* Replace scoring logic with trained ML model
* Integrate real-time APIs
* Add geospatial risk visualization
* Improve personalization of risk

---

## 🧠 Summary

The system prioritizes:

* clarity over complexity
* explainability over black-box models
* usability for real-world scenarios

It is designed as a **practical starting point for participatory disease surveillance systems**.

