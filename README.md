# AI-Generated Misinformation Risk Analysis Engine

> A hybrid DS/ER and Belief Rule-Based (BRB) decision framework for ranking AI-generated misinformation threats under uncertainty.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Online-brightgreen)](https://super-tartufo-135961.netlify.app/)
[![API](https://img.shields.io/badge/Backend%20API-Node.js-blue)](https://mis-information-server-api.vercel.app)


---

## 📌 Overview

This project implements a **hybrid Multi-Criteria Decision-Making (MCDM) framework** that integrates:

- **Dempster-Shafer Evidential Reasoning (DS/ER)**
- **Belief Rule-Based (BRB) Model**

to systematically evaluate and rank four categories of AI-generated misinformation:

| Rank | Alternative | Risk Grade | Combined Score |
|------|-------------|------------|----------------|
| 🥇 1 | Deepfake Video | Very High Risk (VHR) | 3.9459 |
| 🥈 2 | Fake News Article | High Risk (HR) | 2.6945 |
| 🥉 3 | AI Phishing Email | Medium Risk (MR) | 2.0101 |
| 4 | AI Voice Scam | Medium Risk (MR) | 2.0002 |

The framework operates on a **three-level hierarchical decision structure**:

```
Level 1 (Goal)
    └── Ranking AI-Generated Misinformation Risk (Highest → Lowest)

Level 2 (Main Criteria)
    ├── C1: Technical Feasibility of Creation      (w1 = 0.20)
    ├── C2: Detection Difficulty                   (w2 = 0.25)
    ├── C3: Dissemination & Spread Potential       (w3 = 0.20)
    ├── C4: Severity of Potential Impact           (w4 = 0.20)
    └── C5: Victim Susceptibility                  (w5 = 0.15)

Level 3 (Sub-Criteria) — 4 per criterion = 20 total
    ├── C1: Required AI skills/tools (w11=0.35) | Time to generate (w12=0.20)
    │       Cost involved (w13=0.20) | Scalability (w14=0.25)
    ├── C2: Detection tool accuracy (w21=0.30) | Human perception (w22=0.25)
    │       Forensic difficulty (w23=0.25) | Platform auto-detection (w24=0.20)
    ├── C3: Virality on social media (w31=0.35) | Ease of sharing (w32=0.20)
    │       Audience reach (w33=0.25) | Platform vulnerability (w34=0.20)
    ├── C4: Financial/Economic loss (w41=0.25) | Social/Psychological harm (w42=0.30)
    │       Political/Societal division (w43=0.25) | Reputation damage (w44=0.20)
    └── C5: Emotional manipulation (w51=0.30) | Trust exploitation (w52=0.30)
            Target group size (w53=0.20) | Urgency/pressure factor (w54=0.20)
```

---

## 📊 Data Source

Belief degree data were collected through a **structured Google Form survey** administered to **35 participants** (faculty members and students) at Rangamati Science and Technology University. Respondents assigned belief degrees across five risk grades for each of the four alternatives across all 20 sub-criteria:

| Risk Grade | Label | Utility Value | Interpretation |
|------------|-------|---------------|----------------|
| VHR | Very High Risk | 4 | Requires immediate intervention |
| HR | High Risk | 3 | Demands close monitoring |
| MR | Medium Risk | 2 | Standard precautions apply |
| LR | Low Risk | 1 | Awareness sufficient |
| VLR | Very Low Risk | 0 | Routine operations continue |

Aggregated belief degree matrices are stored in `riskData.json` and served via the backend API.

---

## 🧮 Algorithms Implemented

### Algorithm 1 — DS/ER (Dempster-Shafer Evidential Reasoning)

Based on Dempster (1967) and Yang & Xu (2002). Recursively combines belief masses from multiple evidence sources.

**Key Steps:**

```
Step 1: Initialize mass function
        m(A) = β(A) for each risk grade A
        m(Θ) = 1 − Σ β(A)   ← ignorance

Step 2: Compute conflict coefficient
        K = Σ m₁(A) · m₂(B)  for all A ≠ B

Step 3: Compute unnormalized combined mass
        m̃(A) = m₁(A)·m₂(A) + m₁(A)·m₂(Θ) + m₁(Θ)·m₂(A)
        m̃(Θ) = m₁(Θ) · m₂(Θ)

Step 4: Normalize
        m(A) = m̃(A) / (1 − K)

Step 5: Iterate across all sub-criteria → criteria → final result
```

### Algorithm 2 — BRB (Belief Rule-Based Model)

Based on Yang et al. (2006) and Yang & Xu (2013). Aggregates weighted belief rules with explicit ignorance handling.

**Key Steps:**

```
Step 1: Normalize rule weights
        αₖ = wₖ / Σwⱼ

Step 2: Compute weighted belief and ignorance
        w·β(A)ₖ = αₖ × β(A)ₖ
        w·Θₖ    = αₖ × (1 − Σβ(A)ₖ)

Step 3: Compute BRB score
        S(A) = Π[w·β(A)ₖ + w·Θₖ] − Π[w·Θₖ]

Step 4: Compute normalization factor
        μ = ΣS(A) + Π[w·Θₖ]

Step 5: Final belief
        β(A) = S(A) / μ
```

### Combined Scoring

```
Score = Σ u(A) × [(β_DS(A) + β_BRB(A)) / 2]

where u(VHR)=4, u(HR)=3, u(MR)=2, u(LR)=1, u(VLR)=0
```

**Result: 100% agreement between DS/ER and BRB across all four alternatives.**

---

## 🚀 Features

### Frontend
- **5-tab interactive dashboard**: Overview, DS/ER, BRB Model, Combined, Methodology
- **Overview tab**: Final risk ranking, KPI cards, composite score chart, radar chart
- **DS/ER tab**: Per-alternative belief distribution, per-criterion accordion with sub-criteria breakdown, VHR dominance chart
- **BRB tab**: Weighted belief aggregation results, per-criterion breakdown
- **Combined tab**: Inter-algorithm agreement panel, final ranking table, radar + VHR dominance charts
- **Methodology tab**: Step-by-step algorithm explanation, hierarchical structure, risk grade definitions
- **Dynamic JSON loading**: Data fetched from backend API at runtime
- **Fully responsive** design

### Backend
- REST API serving `riskData.json` belief degree data
- Endpoints for fetching criteria, sub-criteria, and belief matrices
- CORS-enabled for frontend consumption
- MongoDB integration for storing and retrieving survey data
- Express.js routing with structured error handling

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, HTML, CSS, JavaScript |
| Styling | Tailwind CSS, DaisyUI |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Data Format | JSON |
| Deployment | https://super-tartufo-135961.netlify.app/ |

---

## 📁 Project Structure

```
├── frontend/
│   ├── public/
│   │   └── riskData.json          # Belief degree data
│   ├── src/
│   │   ├── RiskAnalysisEngine.jsx # Main React component
│   │   └── ...
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/
│   ├── vercel.json
│   ├── inputData.json     
│   ├── index.js                  # API routes
│   └── package.json
│
├── data/
│   └── riskData.json              # Master belief degree dataset
│
└── README.md
```

---

## ⚙️ Installation and Setup

### Prerequisites

```bash
Node.js >= 16.x
MongoDB >= 5.x
npm >= 8.x
```

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/MdJashim18/MisInformation/
cd MisInformation

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env and add your MongoDB URI:
# MONGO_URI=http://localhost:3000/
# PORT=3000

# Start the server
npm start
```

### Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Place riskData.json in /public folder
# Update API endpoint in src/config.js if needed

# Start development server
npm run dev
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/inputSurvey` | Fetch full belief degree dataset |

**Base URL:** `https://mis-information-server-api.vercel.app`

---

## 🔗 Links

| Resource | Link |
|----------|------|
| 🌍 Live Application | https://super-tartufo-135961.netlify.app/ |
| 🔌 Backend API | https://mis-information-server-api.vercel.app/ |
| 📋 Survey Form | https://forms.gle/Dpd6eqpuHQVtjJy77 |
| 📄 Research Paper |  |

---

## 📚 References

1. Dempster, A. P. (1967). Upper and lower probabilities induced by a multivalued mapping. *The Annals of Mathematical Statistics*, 38(2), 325–339.
2. Shafer, G. (1976). *A Mathematical Theory of Evidence*. Princeton University Press.
3. Yang, J. B., & Singh, M. G. (1994). An evidential reasoning approach for multiple-attribute decision making with uncertainty. *IEEE Transactions on Systems, Man, and Cybernetics*, 24(1), 1–18.
4. Yang, J. B., & Xu, D. L. (2002). On the evidential reasoning algorithm for multiple attribute decision analysis under uncertainty. *IEEE Transactions on Systems, Man, and Cybernetics Part A*, 32(3), 289–304.
5. Yang, J. B., et al. (2006). Belief rule-base inference methodology using the evidential reasoning approach — RIMER. *IEEE Transactions on Systems, Man, and Cybernetics Part A*, 36(2), 266–285.
6. Yang, J. B., & Xu, D. L. (2013). A belief rule-based inference methodology using extended evidential reasoning rule. *IEEE Transactions on Fuzzy Systems*, 21(4), 707–722.

---

## 👤 Author

**Mohammad Jashim Uddin**
Computer Science and Engineering, Rangamati Science and Technology University
📧 mdjashimuddinjnn22990@gmail.com
🔗 https://www.linkedin.com/in/mohammadjashimuddinrubel/

---

## 📄 License

This project is intended for academic and research purposes only. 
Any commercial use requires explicit permission from the author.
Contact: mdjashimuddinjnn22990@gmail.com

---

## 🙏 Acknowledgment

This research was conducted as part of Artificial Intelligence Lab at Rangamati Science and Technology University. Survey data were collected from faculty members and students who volunteered their time and expertise.
