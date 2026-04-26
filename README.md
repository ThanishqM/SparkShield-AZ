# 🦠 Arizona Outbreak Risk AI

## 🚨 Catching Outbreaks Early — Before They Spread

During outbreaks, timing is everything. Most systems react too late — after patterns are already visible.

Our goal was simple: **what if we could detect risk earlier using everyday signals?**

---

## 🌍 The Problem

People may report symptoms, but those reports don’t exist in context.

A mild fever means something very different if:

* you recently traveled,
* you’re in a high-risk area,
* or there’s already a local outbreak.

Right now, there’s no simple way to combine all of that into something useful for everyday people.

---

## 💡 Our Approach

We built a system that takes basic self-reported data and **adds context to it**.

Instead of just storing symptoms, we combine:

* environmental data (like weather and vector conditions),
* travel and exposure patterns,
* and general outbreak trends

From that, we generate a **risk score** that actually means something.

---

## 🧠 How It Works (Simplified)

1. A user submits symptoms and recent activity
2. The system pulls in external signals (location, environment, etc.)
3. A scoring model evaluates overall risk
4. The user sees a clear, simple risk level

We also aggregate this to understand **community-level risk trends**.

---

## 🤖 About the AI

We didn’t overcomplicate this.

The model combines:

* symptom severity
* likelihood of exposure
* location-based risk

It’s designed to be:

* understandable
* adjustable
* and transparent

More details are in `docs/model_card.md`.

---

## 🏜️ Why Arizona?

Arizona is actually a really interesting test case:

* extreme heat affects disease patterns
* mosquito-borne risks vary by region
* cross-border travel adds complexity
* rural areas have limited access to care

So a localized, adaptive system actually matters here.

---

## 🧩 What We Built

* A simple interface for reporting symptoms
* A backend that enriches that data
* A risk scoring system
* A way to visualize both individual and community risk

---

## 🏗️ Tech Stack

* Frontend: Vite + React + Tailwind
* Backend: (your backend here)
* Data: public datasets + simulated inputs
* AI: lightweight risk scoring model

---

## 🔄 Human-in-the-Loop

We didn’t want a black-box system.

* Users can update their data
* Results are explainable
* The system is meant to support decisions — not replace them

---

## 🚀 What’s Next

If we had more time, we would:

* connect to real-time APIs (like EpiCore)
* build a mobile version
* improve predictive modeling
* integrate with public health workflows

---

## ⚙️ Running the Project

```bash
npm install
npm run dev
```

---

## 🎥 Demo

[(Add your demo link here)] (https://asu.zoom.us/rec/share/JG8xNNojRISndbiHVM_cwM9P4lpndkS230nGSiXAmED0CQNktKn7vyUie3_FIBdQ.W1uzFIYrJA6yRJzC?startTime=1777225000000
Passcode: Nr0n3@Q4)

---

## 📄 Documentation

* Model details → `docs/model_card.md`
* System design → `docs/technical_overview.md`

---

## 👥 Team

Krithika Kondeti,
Thanishq Maddela,
Sai Meghana Angara,
Poorna Sai Karthik Lallaboyina

---

## 🏁 Final Thoughts

This project isn’t about predicting the future perfectly.

It’s about giving people **just enough information, early enough, to make better decisions**.
