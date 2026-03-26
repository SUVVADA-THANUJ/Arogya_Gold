# Arogya

<p align="center">
  <b>React + Express + Flask + ML + DL + NLP</b><br/>
  Upload medical reports → Predict disease → Get AI-generated summary
</p>

---

## 📌 Overview
**Arogya** is a full-stack AI-based medical report analysis web application.  
It combines **React, Express, Flask, Machine Learning, Deep Learning, and NLP** into one system.

The user can upload a medical report (PDF) and also enter symptoms manually.  
Based on this, the system predicts the possible disease and provides:

- Predicted disease  
- AI-generated medical summary  
- Risk factors  
- Important features from report  
- Similar cases  

The main idea of this project is to build a **real-world healthcare system** by integrating full-stack + AI.
# Application link at bottom
---

## 🚀 What the Application Does

When the user uploads a medical report and enters symptoms:

1. Extracts text from the PDF  
2. Uses regex-based Named Entity Recognition concept  
3. Extracts required medical features  
4. Sends features to ML models  
5. Models predict disease + confidence score  
6. Predicted disease + symptoms are structured  
7. Sent to NLP model (BART)  
8. NLP generates summary  
9. Everything is displayed in UI  

---

## 🛠️ Tech Stack

### Frontend
- React.js  

### Backend
- Express.js  
- Flask  

### AI / ML / DL
- Python  
- Machine Learning models  
- ANN  
- NLP (BART - Transfer Learning)  

---

## 📚 Libraries & Tools

### AI/ML
- Scikit-learn  
- TensorFlow  
- Keras  
- spaCy  

### Other Tools
- Deployment: Vercel, ngrok  
- Development: VS Code, GitHub  
- API Testing: Postman  
- Icons: SVG Repo  
- Training: Google Colab (T4 GPU)  
- Support: ChatGPT, Gemini  

---

## ⚙️ How It Works (Step by Step)

### Step 1 – User Input
- User enters the app (sample data shown)
- Uploads PDF  
- Enters symptoms  
- Clicks submit  

---

### Step 2 – Backend Flow
- React → Express  
- Express → Flask  

---

### Step 3 – Text Extraction
- Extract text from PDF  

---

### Step 4 – Feature Extraction
- Regex-based extraction  
- Missing values → NULL  
- Prepare 20 features  

---

## 🤖 Machine Learning Models

All models are trained on **20 features** and predict **15 diseases**

### Models Used

**1. Logistic Regression**
- Predicts disease  
- Returns confidence score  

**2. Random Forest**
- Predicts disease  
- Confidence score  
- Important features  
- Used for risk factor analysis  

**3. KNN**
- Finds similar cases  
- Returns similar cases + features  

**4. SVC**
- Predicts disease  

**5. ANN (Main Model)**
- Learns deeper patterns  
- Final decision model  

---

## 🔧 Model Optimization
- Hyperparameter tuning done  
- Best models selected  
- Saved using sklearn pipeline  

Pipeline includes:
- NULL handling  
- StandardScaler  
- Prediction  

*(Not used for ANN and Random Forest)*

---

## 🧠 Text Preprocessing
Using spaCy:
- Abbreviation mapping  
- Lemmatization  
- Normalization  
- Feature mapping  

---

## 🔍 KNN Logic
- Takes disease from highest confidence model  
- Finds similar cases  

---

## 📝 NLP Summary Generation
- Disease + symptoms → structured input  
- Sent to BART model  
- BART generates summary  

---

## 🔄 Final Flow
React → Express → Flask
→ Text Extraction
→ Feature Extraction
→ ML Models
→ ANN
→ KNN
→ BART NLP
→ JSON Response
→ React UI


---

## ✨ Main Features

- Upload PDF + manual symptoms  
- Predicted disease display  
- NLP summary  
- Similar cases  
- Important features  
- Risk factors  

---

## 💡 Key Features

- Progress bar (backend steps)  
- Scrollable results section  
- Model cards showing:
  - F1 Score  
  - Precision  
  - Recall  
  - Confidence score  
  - Predicted disease  
- Clean modern UI  

---

## ⚠️ Drawbacks

**1. BART model**
- Trained with fewer epochs (Colab limit)  
- Sometimes summary not perfectly structured  

**2. Dataset issue**
- Needed common dataset for 15 diseases  
- Only 20 features used  
- No proper dataset found  

**3. Synthetic dataset**
- Generated using Python script  
- Lower accuracy  
- Less pattern learning  
- Affects BART also  

---

## 🔮 Future Improvements

- Use real dataset  
- Improve model accuracy  
- Train better NLP model (T5-large)  
- Add more diseases  
- Deploy on cloud (AWS/GCP)  
- Add user login + history  
- Improve report parsing  

---

## 📌 Conclusion

Arogya is a complete **end-to-end AI healthcare system** that combines:

- Full-stack development  
- Machine Learning  
- Deep Learning  
- NLP  
- Deployment  

This project shows how AI can be integrated into real applications to analyze medical reports.

## Application Link
[https://food-sense-cyan.vercel.app/](https://arogya-gold.vercel.app/)
- Backend APIs are currently turned off because they are deployed on free services with limited CPU and resources, so the application cannot be used live at the moment.
---
**SUVVADA THANUJ**  
---
