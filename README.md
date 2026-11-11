# NeuroNexus Hospital Management System

NeuroNexus is a hospital management and clinical intelligence application built with React, TypeScript, and Vite. It brings patient and appointment workflows together with ICU deterioration monitoring and clinical decision-support features.

> **Clinical use notice:** NeuroNexus is a research and demonstration prototype, not a medical device. It does not provide autonomous diagnosis or treatment recommendations and must not replace qualified clinical judgment. The predictive model requires prospective validation before any clinical use.

## Features

- Role-based dashboards for hospital staff and patients
- Patient registration, records, appointments, and referrals
- Doctor, nurse, intern, and receptionist workflows
- Prescriptions, discharge documentation, billing, and vitals
- ICU risk monitoring, alert analytics, and chronological demo replay
- Model performance and dataset quality views

## Technology

- React 19 and TypeScript
- Vite
- Recharts
- Google GenAI SDK for AI-assisted features
- Python ML pipeline and PhysioNet 2012 sample dataset

## Requirements

- Node.js 18 or later
- npm
- Python 3.10 or later for the ML scripts

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (by default, `http://localhost:3000/`).

Build the production bundle with:

```bash
npm run build
```

## Machine-learning scripts

The Python scripts under `ml/` provide dataset reporting, model training, prediction, and a temporal-leakage check. Install the Python dependencies used by those scripts in your environment before running them:

```bash
python ml/dataset_report.py
python ml/train.py
python ml/test_leakage.py
```

## Configuration

AI-assisted features require a Google GenAI API key. Configure it through your local development environment; do not commit API keys or other secrets to the repository.

## Developer

**Kritagya Subedi**