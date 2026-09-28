# SwasthyaAI - Offline AI Medical Decision-Support & Emergency Assistance System

**SwasthyaAI** is a production-style, offline-first healthcare assistance platform designed to deliver verified medical information, natural-language symptom assessment, drug interaction analysis, supported image triage, emergency red-flag detection, and offline healthcare facility routing **without requiring an Internet connection for core functionality**.

---

## Key Features

1. **Full Offline Mode**
   - No Internet or external cloud AI APIs required for core triage.
   - Operates using local SQLite / IndexedDB databases, local NLP tokenization & negation parser, probabilistic BM25 search, knowledge graph BFS/DFS traversals, and auditable risk rules.
2. **Online Synchronization Mode**
   - When Internet is available, synchronizes delta update packages with cryptographic SHA-256 integrity verification and atomic rollback protection.
3. **Medical Safety & Disclaimers**
   - Never claims definitive diagnosis; provides structured clinical decision support for doctor consultation.
   - Never autonomously prescribes medications.
   - Explicit emergency red flags trigger instant high-contrast emergency guidance with zero delay.
4. **Offline Map & Road Graph Routing**
   - Geodesic Haversine distance calculation and shortest path finding using **Dijkstra** and **A\*** algorithms with road blockage detection.
5. **Supported Medical Image Analysis**
   - Pre-inference quality validation (resolution, brightness, contrast, blur variance), supported category verification, and uncertainty quantification.
6. **Encrypted Health Records & QR Export**
   - Client-side AES-GCM encrypted local vault and offline device-to-device QR code transfer.

---

## Directory Structure

```text
creative/
├── manage.py
├── requirements.txt
├── README.md
├── swasthya_offline.sqlite3
├── swasthya_project/             # Django root configuration
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── swasthya_core/                # Unified Full-Stack Core App
│   ├── models/                   # Normalized clinical data models
│   ├── engines/                  # Algorithmic engines (NLP, BM25, Graph, Risk, Routing, Vision, Sync)
│   ├── api/                      # Django REST Framework API Endpoints
│   ├── management/commands/      # Seed data & package manager commands
│   ├── tests/                    # Comprehensive automated test suite
│   ├── views.py                  # PWA and Dashboard views
│   └── admin.py                  # Customized Django Admin
├── static/
│   ├── css/                      # Main & component stylesheets
│   └── js/                       # Local offline JavaScript engines & Service Worker
└── templates/                    # Responsive HTML templates
```

---

## Quick Start Guide

### 1. Run Migrations & Seed Medical Knowledge
```bash
python manage.py makemigrations swasthya_core
python manage.py migrate
python manage.py seed_medical_data
```

### 2. Run Automated Test Suite
```bash
python manage.py test swasthya_core
```

### 3. Launch the Server
```bash
python manage.py runserver 8000
```
Open your browser at `http://localhost:8000/`.

---

## Offline Demonstration Procedure

1. **Step 1:** Disconnect Wi-Fi / Mobile Data (or click the **Status Pill** in the top bar to toggle OFFLINE mode).
2. **Step 2:** Navigate to **Symptom Assessment** and enter: *"I have fever and headache for 2 days but no breathing difficulty"*.
3. **Step 3:** Notice that the local NLP engine identifies `Fever` and `Headache` as present, while correctly identifying `Breathing Difficulty` as **Absent / Negated**.
4. **Step 4:** Navigate to **Offline Facilities & Map**, select a facility, and click **Route Offline** to view the computed A* turn-by-turn directions.
5. **Step 5:** Navigate to **Offline System Check** to view the 10-point self-diagnostic matrix confirming all systems are operational.
6. **Step 6:** Re-enable Internet and click **Synchronize Now** in the Admin Dashboard to demonstrate delta update verification.
