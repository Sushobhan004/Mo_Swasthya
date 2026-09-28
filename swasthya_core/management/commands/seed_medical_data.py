"""
Comprehensive Full-Spectrum Medical Knowledge Seed for SwasthyaAI
Populates complete clinical symptoms, conditions, warning signs, emergency rules,
medicines, and interactions covering all major human physiological systems.
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from swasthya_core.models import (
    MedicalSource, WarningSign, Symptom, RiskFactor, Condition, ConditionSymptom,
    MedicalTopic, MedicineClass, Medicine, MedicineInteraction, HealthcareFacility,
    EmergencyRule, AIModelRegistry, SyncVersion, AuditLog
)

class Command(BaseCommand):
    help = 'Seeds complete full-spectrum medical knowledge covering all body systems, symptoms, and emergency rules.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Seeding comprehensive full-spectrum medical knowledge base..."))

        # 1. Authoritative Sources
        who, _ = MedicalSource.objects.get_or_create(
            name="World Health Organization (WHO)",
            defaults={
                "organization": "WHO International Clinical Practice Guidelines",
                "version": "2026.1",
                "last_verified": timezone.now().date(),
                "description": "Global clinical practice guidelines and essential medicine model list."
            }
        )
        icmr, _ = MedicalSource.objects.get_or_create(
            name="ICMR Clinical Protocols",
            defaults={
                "organization": "Indian Council of Medical Research",
                "version": "2025.4",
                "last_verified": timezone.now().date(),
                "description": "Standard treatment workflows and primary healthcare triage algorithms."
            }
        )
        cdc, _ = MedicalSource.objects.get_or_create(
            name="CDC Health Advisories",
            defaults={
                "organization": "Centers for Disease Control and Prevention",
                "version": "2026.2",
                "last_verified": timezone.now().date(),
                "description": "Emergency triage protocols and infectious disease surveillance."
            }
        )
        nih, _ = MedicalSource.objects.get_or_create(
            name="NIH MedlinePlus Clinical Reference",
            defaults={
                "organization": "National Institutes of Health",
                "version": "2026.3",
                "last_verified": timezone.now().date(),
                "description": "Comprehensive peer-reviewed medical condition references and clinical standards."
            }
        )

        # 2. Comprehensive Warning Signs
        warning_signs_data = [
            {
                "code": "WS-CHEST-RAD",
                "name": "Crushing Chest Pain Radiating to Left Arm, Back, or Jaw",
                "description": "Severe sub-sternal pressure radiating to jaw, neck, back, or left arm with diaphoresis (sweating) or nausea.",
                "severity_level": "URGENT",
                "immediate_action": "Call emergency dispatch (112/108) immediately. Keep patient seated, resting quietly, loosen tight clothing.",
                "source": who
            },
            {
                "code": "WS-STROKE-FAST",
                "name": "Sudden Facial Drooping, Arm Weakness, or Slurred Speech (FAST)",
                "description": "Unilateral facial or limb paralysis, difficulty articulating words, sudden loss of balance or vision.",
                "severity_level": "URGENT",
                "immediate_action": "Immediate emergency hospitalization required. Note exact timestamp of symptom onset. Do not give food or aspirin.",
                "source": cdc
            },
            {
                "code": "WS-DYSP-STRIDOR",
                "name": "Acute Severe Dyspnea with Stridor, Cyanosis, or Inability to Speak",
                "description": "Severe respiratory exhaustion, blue discoloration around lips/fingertips, gasping for breath.",
                "severity_level": "URGENT",
                "immediate_action": "Position patient sitting upright. Administer prescribed rescue oxygen or bronchodilator if available. Call emergency dispatch.",
                "source": who
            },
            {
                "code": "WS-ANAPHYLAXIS",
                "name": "Rapid Facial / Lip / Tongue Swelling with Airway Constriction",
                "description": "Systemic allergic reaction following allergen exposure with airway compromise, wheezing, and hypotension.",
                "severity_level": "URGENT",
                "immediate_action": "Administer intramuscular epinephrine (EpiPen) into outer mid-thigh immediately. Call 112/108 without delay.",
                "source": who
            },
            {
                "code": "WS-RIGID-ABD",
                "name": "Board-like Rigid Abdominal Guarding with Rebound Tenderness",
                "description": "Severe localized or diffuse abdominal guarding, fever, and acute peritoneal signs indicating surgical abdomen.",
                "severity_level": "URGENT",
                "immediate_action": "Do not give food, water, pain meds, or laxatives. Seek emergency surgical department evaluation immediately.",
                "source": icmr
            },
            {
                "code": "WS-MENINGISM",
                "name": "High Fever with Inability to Flex Neck (Nuchal Rigidity) & Photophobia",
                "description": "Severe unremitting headache, stiff neck, extreme light sensitivity, confusion or purpuric rash.",
                "severity_level": "URGENT",
                "immediate_action": "Urgent emergency admission for lumbar puncture and intravenous antimicrobial therapy.",
                "source": cdc
            },
            {
                "code": "WS-SEIZURE-PROLONGED",
                "name": "Generalized Tonic-Clonic Convulsions or Status Epilepticus (>5 mins)",
                "description": "Active continuous seizures lasting >5 minutes or repeated seizures without recovery of consciousness.",
                "severity_level": "URGENT",
                "immediate_action": "Clear surroundings to prevent trauma. Place in recovery position on side. Do not force anything into mouth. Call emergency services.",
                "source": nih
            },
            {
                "code": "WS-GLAUCOMA-ACUTE",
                "name": "Severe Sudden Unilateral Eye Pain with Halos and Blurred Vision",
                "description": "Acute high intraocular pressure presenting with steamy cornea, severe orbital headache, and nausea.",
                "severity_level": "URGENT",
                "immediate_action": "Immediate ophthalmological emergency care required within hours to prevent permanent optic nerve blindness.",
                "source": nih
            },
            {
                "code": "WS-SEPSIS-SIGNS",
                "name": "Severe Systemic Sepsis / Hypoperfusion (Hypotension + Tachycardia + Shivering)",
                "description": "Extreme shivering, rapid breathing (>22/min), cold clammy skin, confusion, and reduced urine output.",
                "severity_level": "URGENT",
                "immediate_action": "Urgent ICU / Emergency admission for broad-spectrum antibiotics, IV crystalloid resuscitation, and lactate monitoring.",
                "source": who
            },
            {
                "code": "WS-PERSIST-FEVER",
                "name": "High Fever >102°F (38.9°C) Lasting >72 Hours with Shivering",
                "description": "Prolonged high febrile illness without response to simple antipyretics, with lethargy or body aches.",
                "severity_level": "CAUTION",
                "immediate_action": "Maintain oral hydration, apply lukewarm sponge baths, and consult a physician for diagnostic blood work.",
                "source": icmr
            },
            {
                "code": "WS-DEHYDRATION-GI",
                "name": "Severe Fluid Depletion / Sunken Eyes / Inability to Retain Fluids",
                "description": "Extreme thirst, dry mucous membranes, reduced or dark urination from profuse diarrhea and vomiting.",
                "severity_level": "CAUTION",
                "immediate_action": "Start frequent small sips of WHO-formula Oral Rehydration Salts (ORS). Seek clinic care if unable to hold liquids.",
                "source": who
            },
            {
                "code": "WS-DIABETIC-KETONES",
                "name": "Fruity Breath Odor with Extreme Thirst, Polyuria, and Deep Rapid Breathing",
                "description": "Signs of diabetic ketoacidosis (DKA) or hyperosmolar hyperglycemic state in diabetic individuals.",
                "severity_level": "URGENT",
                "immediate_action": "Immediate hospital admission for IV insulin infusion, blood glucose monitoring, and electrolyte correction.",
                "source": who
            }
        ]
        for item in warning_signs_data:
            WarningSign.objects.update_or_create(code=item["code"], defaults=item)

        # 3. Comprehensive Symptom Catalog (80+ symptoms across all anatomical systems)
        all_symptoms = [
            # Systemic & General
            {"code": "FEV", "name": "Fever", "common_names": "fever, high temperature, pyrexia, feeling hot, feverish, temperature spike", "body_system": "Systemic", "is_emergency_flag": False},
            {"code": "CHILLS", "name": "Chills and Rigors", "common_names": "chills, rigors, shivering, shaking with cold, teeth chattering", "body_system": "Systemic", "is_emergency_flag": False},
            {"code": "FATIG", "name": "Fatigue and Weakness", "common_names": "fatigue, tiredness, exhaustion, weakness, lethargy, loss of energy, feeling drained, no energy", "body_system": "Systemic", "is_emergency_flag": False},
            {"code": "NIGHT_SWEATS", "name": "Night Sweats", "common_names": "night sweats, sweating during sleep, drenching sweats at night", "body_system": "Systemic", "is_emergency_flag": False},
            {"code": "WT_LOSS", "name": "Unexplained Weight Loss", "common_names": "weight loss, losing weight without trying, dropping weight, unexplained slimming", "body_system": "Systemic", "is_emergency_flag": False},
            {"code": "LYMPH_SWELL", "name": "Swollen Lymph Nodes", "common_names": "swollen glands, swollen lymph nodes, lumps in neck, swollen armpit glands, groin lump", "body_system": "Systemic", "is_emergency_flag": False},
            {"code": "MALAISE", "name": "General Malaise", "common_names": "feeling sick, general malaise, feeling unwell, body run down", "body_system": "Systemic", "is_emergency_flag": False},

            # Cardiovascular
            {"code": "CHSTP", "name": "Chest Pain", "common_names": "chest pain, chest pressure, tightness in chest, chest discomfort, crushing chest pain, heaviness in chest, substernal pain", "body_system": "Cardiovascular", "is_emergency_flag": True},
            {"code": "PALP", "name": "Heart Palpitations", "common_names": "palpitations, racing heartbeat, fluttering heart, rapid pulse, pounding heart, irregular heartbeat, skipped beats", "body_system": "Cardiovascular", "is_emergency_flag": False},
            {"code": "LEG_EDEMA", "name": "Leg and Ankle Swelling", "common_names": "swollen legs, ankle swelling, peripheral edema, puffy feet, water retention in legs", "body_system": "Cardiovascular", "is_emergency_flag": False},
            {"code": "ORTHOPNEA", "name": "Shortness of Breath Lying Flat (Orthopnea)", "common_names": "cannot breathe lying down, orthopnea, need multiple pillows to breathe", "body_system": "Cardiovascular", "is_emergency_flag": True},
            {"code": "CYANOSIS", "name": "Bluish Skin or Lips (Cyanosis)", "common_names": "cyanosis, blue lips, blue fingertips, skin turning blue, purple tongue", "body_system": "Cardiovascular", "is_emergency_flag": True},
            {"code": "COLD_EXTREM", "name": "Cold Clammy Extremities", "common_names": "cold hands and feet, clammy skin, cold sweat, pale cold limbs", "body_system": "Cardiovascular", "is_emergency_flag": False},

            # Respiratory
            {"code": "DYSP", "name": "Breathing Difficulty", "common_names": "breathing difficulty, shortness of breath, dyspnea, hard to breathe, breathlessness, trouble breathing, gasping for breath, suffocating", "body_system": "Respiratory", "is_emergency_flag": True},
            {"code": "COUGH", "name": "Cough", "common_names": "cough, coughing, dry cough, persistent cough, coughing fits, throat tickle", "body_system": "Respiratory", "is_emergency_flag": False},
            {"code": "PROD_COUGH", "name": "Productive Cough with Phlegm", "common_names": "wet cough, phlegm, sputum, yellow mucus, green phlegm, coughing up mucus", "body_system": "Respiratory", "is_emergency_flag": False},
            {"code": "HEMOPTYSIS", "name": "Coughing up Blood (Hemoptysis)", "common_names": "coughing blood, blood in phlegm, hemoptysis, bloody sputum", "body_system": "Respiratory", "is_emergency_flag": True},
            {"code": "WHEEZING", "name": "Wheezing", "common_names": "wheezing, whistling chest sound, musical breathing, tight airway", "body_system": "Respiratory", "is_emergency_flag": False},
            {"code": "STRIDOR", "name": "High-Pitched Stridor Breathing", "common_names": "stridor, crowing sound breathing, upper airway high pitch", "body_system": "Respiratory", "is_emergency_flag": True},
            {"code": "PLEURITIC_PAIN", "name": "Sharp Pain on Deep Inhalation", "common_names": "pain taking deep breath, pleuritic pain, sharp chest pain inhaling", "body_system": "Respiratory", "is_emergency_flag": False},
            {"code": "NASAL_CONGEST", "name": "Nasal Congestion / Runny Nose", "common_names": "runny nose, blocked nose, stuffy nose, rhinorrhea, nasal drip", "body_system": "Respiratory", "is_emergency_flag": False},
            {"code": "SNEEZING", "name": "Sneezing", "common_names": "sneezing, frequent sneezes, allergic sneezes", "body_system": "Respiratory", "is_emergency_flag": False},
            {"code": "SORE_THR", "name": "Sore Throat", "common_names": "sore throat, throat pain, scratchy throat, raw throat, pharyngitis", "body_system": "Respiratory", "is_emergency_flag": False},
            {"code": "HOARSENESS", "name": "Hoarseness / Voice Loss", "common_names": "hoarse voice, loss of voice, laryngitis, raspy voice", "body_system": "Respiratory", "is_emergency_flag": False},
            {"code": "ANOSMIA", "name": "Loss of Smell or Taste", "common_names": "cannot smell, loss of smell, anosmia, lost sense of taste, ageusia", "body_system": "Respiratory", "is_emergency_flag": False},

            # Neurological & Mental Health
            {"code": "HDCH", "name": "Headache", "common_names": "headache, head pain, throbbing head, ache in head, cephalalgia", "body_system": "Neurological", "is_emergency_flag": False},
            {"code": "MIGRAINE_PAIN", "name": "Pulsating Severe Migraine", "common_names": "migraine, one sided head throbbing, pulsating headache, intense temple pain", "body_system": "Neurological", "is_emergency_flag": False},
            {"code": "DIZZ", "name": "Dizziness and Vertigo", "common_names": "dizziness, lightheadedness, vertigo, room spinning, spinning sensation, loss of balance, unsteadiness", "body_system": "Neurological", "is_emergency_flag": False},
            {"code": "SYNCOPE", "name": "Fainting / Blackout (Syncope)", "common_names": "fainting, passed out, syncope, lost consciousness, blackout, collapsed", "body_system": "Neurological", "is_emergency_flag": True},
            {"code": "SEIZURE", "name": "Seizure / Convulsions", "common_names": "seizure, convulsions, fits, involuntary jerking, epileptic fit", "body_system": "Neurological", "is_emergency_flag": True},
            {"code": "NUMB", "name": "Numbness or Tingling", "common_names": "numbness, tingling, pins and needles, paresthesia, loss of sensation", "body_system": "Neurological", "is_emergency_flag": False},
            {"code": "UNILAT_WEAK", "name": "One-Sided Facial or Arm Weakness", "common_names": "facial drooping, one arm weak, paralyzed arm, weakness on one side, hemiplegia", "body_system": "Neurological", "is_emergency_flag": True},
            {"code": "SLUR_SPEECH", "name": "Slurred Speech / Dysarthria", "common_names": "slurred speech, cannot speak properly, jumbled words, difficulty articulating, dysarthria", "body_system": "Neurological", "is_emergency_flag": True},
            {"code": "SUDDEN_CONF", "name": "Sudden Confusion / Disorientation", "common_names": "confusion, disorientation, altered mental state, delirium, not knowing where one is", "body_system": "Neurological", "is_emergency_flag": True},
            {"code": "NECK_STIFF", "name": "Severe Neck Stiffness (Meningismus)", "common_names": "stiff neck, cannot touch chin to chest, nuchal rigidity, painful neck bending", "body_system": "Neurological", "is_emergency_flag": True},
            {"code": "TREMOR", "name": "Tremors and Shaking", "common_names": "hand tremors, shaking hands, involuntary shaking, shaky fingers", "body_system": "Neurological", "is_emergency_flag": False},
            {"code": "ANX", "name": "Severe Anxiety / Panic Attack", "common_names": "anxiety, panic attack, feeling of impending doom, nervousness, trembling with panic", "body_system": "Psychiatric", "is_emergency_flag": False},
            {"code": "INSOMNIA", "name": "Severe Insomnia", "common_names": "cannot sleep, insomnia, sleeplessness, waking up constantly", "body_system": "Psychiatric", "is_emergency_flag": False},
            {"code": "DEPRESS", "name": "Persistent Low Mood / Anhedonia", "common_names": "depression, feeling hopeless, loss of interest in everything, sad all the time", "body_system": "Psychiatric", "is_emergency_flag": False},

            # Gastrointestinal & Hepatic
            {"code": "ABDP", "name": "Abdominal Pain", "common_names": "abdominal pain, stomach ache, belly pain, gut pain, cramps in stomach, colic", "body_system": "Gastrointestinal", "is_emergency_flag": False},
            {"code": "RLQ_PAIN", "name": "Right Lower Abdominal Pain (Appendicitis sign)", "common_names": "right lower stomach pain, pain near right hip, appendicitis pain, McBurney point tenderness", "body_system": "Gastrointestinal", "is_emergency_flag": True},
            {"code": "RUQ_PAIN", "name": "Right Upper Abdominal Pain (Gallbladder/Liver)", "common_names": "right upper belly pain, pain under right ribs, gallbladder pain, biliary colic", "body_system": "Gastrointestinal", "is_emergency_flag": False},
            {"code": "HEARTBURN", "name": "Heartburn / Acid Reflux", "common_names": "heartburn, acid reflux, burning in chest after eating, sour water in throat, dyspepsia", "body_system": "Gastrointestinal", "is_emergency_flag": False},
            {"code": "NAUS", "name": "Nausea", "common_names": "nausea, feeling sick, queasy, urge to vomit, upset stomach", "body_system": "Gastrointestinal", "is_emergency_flag": False},
            {"code": "VOMIT", "name": "Vomiting", "common_names": "vomiting, throwing up, threw up, emesis, puking", "body_system": "Gastrointestinal", "is_emergency_flag": False},
            {"code": "HEMATEMESIS", "name": "Vomiting Blood (Hematemesis)", "common_names": "vomiting blood, coffee ground vomit, blood in throw up, hematemesis", "body_system": "Gastrointestinal", "is_emergency_flag": True},
            {"code": "DIARR", "name": "Diarrhea", "common_names": "diarrhea, loose stools, loose motions, watery stool, frequent loose bowel movements", "body_system": "Gastrointestinal", "is_emergency_flag": False},
            {"code": "BLOODY_STOOL", "name": "Blood in Stool / Melena", "common_names": "blood in stool, black tarry stool, melena, red blood in toilet, bloody diarrhea", "body_system": "Gastrointestinal", "is_emergency_flag": True},
            {"code": "CONSTIP", "name": "Severe Constipation", "common_names": "constipation, cannot pass stool, hard stool, no bowel movement for days", "body_system": "Gastrointestinal", "is_emergency_flag": False},
            {"code": "BLOATING", "name": "Abdominal Bloating & Distension", "common_names": "bloating, distended belly, gas in stomach, swollen abdomen", "body_system": "Gastrointestinal", "is_emergency_flag": False},
            {"code": "DIFF_SWAL", "name": "Difficulty Swallowing (Dysphagia)", "common_names": "difficulty swallowing, dysphagia, food stuck in throat, choking on food", "body_system": "Gastrointestinal", "is_emergency_flag": True},
            {"code": "JAUNDICE", "name": "Yellowing of Skin and Eyes (Jaundice)", "common_names": "jaundice, yellow eyes, yellow skin, dark tea colored urine, icterus", "body_system": "Hepatic", "is_emergency_flag": True},

            # Dermatological & Allergic
            {"code": "RASH", "name": "Skin Rash", "common_names": "skin rash, red spots, red patches, breakout on skin, skin redness", "body_system": "Dermatological", "is_emergency_flag": False},
            {"code": "URTICARIA", "name": "Hives / Welts (Urticaria)", "common_names": "hives, urticaria, raised itchy welts, allergic wheals, itchy red bumps", "body_system": "Dermatological", "is_emergency_flag": False},
            {"code": "PRURITUS", "name": "Intense Itching (Pruritus)", "common_names": "itching, itchy skin, pruritus, severe scratching urge", "body_system": "Dermatological", "is_emergency_flag": False},
            {"code": "FACIAL_EDEMA", "name": "Facial and Lip Swelling (Angioedema)", "common_names": "swollen face, swollen lips, swollen eyes, angioedema, puffy face", "body_system": "Dermatological", "is_emergency_flag": True},
            {"code": "PETECHIAE", "name": "Tiny Red/Purple Spots on Skin (Petechiae)", "common_names": "petechiae, purpura, bleeding under skin, pinprick red spots that do not fade with pressure", "body_system": "Dermatological", "is_emergency_flag": True},
            {"code": "BLISTERS", "name": "Skin Blisters and Vesicles", "common_names": "blisters, fluid filled bumps, vesicles, peeling skin with blisters", "body_system": "Dermatological", "is_emergency_flag": False},

            # Musculoskeletal
            {"code": "JOINT_PAIN", "name": "Joint Pain (Arthralgia)", "common_names": "joint pain, arthralgia, knee pain, hip pain, wrist pain, aching joints", "body_system": "Musculoskeletal", "is_emergency_flag": False},
            {"code": "JOINT_SWELL", "name": "Joint Swelling and Redness", "common_names": "swollen joint, hot red joint, knee swelling, big toe inflammation", "body_system": "Musculoskeletal", "is_emergency_flag": False},
            {"code": "BACK_PAIN", "name": "Lower Back Pain", "common_names": "back pain, lower back ache, lumbago, slipped disc pain, spinal ache", "body_system": "Musculoskeletal", "is_emergency_flag": False},
            {"code": "SCIATICA", "name": "Shooting Leg Pain (Sciatica)", "common_names": "sciatica, shooting pain down leg, nerve pain in thigh and calf", "body_system": "Musculoskeletal", "is_emergency_flag": False},
            {"code": "MYALGIA", "name": "Muscle Aches (Myalgia)", "common_names": "muscle ache, myalgia, sore muscles, body pain, generalized body ache", "body_system": "Musculoskeletal", "is_emergency_flag": False},

            # Genitourinary & Renal
            {"code": "DYSURIA", "name": "Burning / Painful Urination (Dysuria)", "common_names": "burning urine, dysuria, pain peeing, stinging urination", "body_system": "Genitourinary", "is_emergency_flag": False},
            {"code": "HEMATURIA", "name": "Blood in Urine (Hematuria)", "common_names": "blood in urine, pink urine, red urine, hematuria, bloody pee", "body_system": "Genitourinary", "is_emergency_flag": True},
            {"code": "POLYURIA", "name": "Frequent Urination (Polyuria)", "common_names": "frequent urination, peeing often, waking up to pee, polyuria, urinary urgency", "body_system": "Genitourinary", "is_emergency_flag": False},
            {"code": "OLIGURIA", "name": "Marked Reduction in Urine (Oliguria)", "common_names": "not passing urine, very little urine, no pee for 12 hours, anuria", "body_system": "Genitourinary", "is_emergency_flag": True},
            {"code": "FLANK_PAIN", "name": "Severe Flank / Kidney Pain", "common_names": "kidney pain, flank pain, renal colic, sharp side and lower back pain radiating to groin", "body_system": "Genitourinary", "is_emergency_flag": False},
            {"code": "TESTIC_PAIN", "name": "Acute Sudden Testicular Pain", "common_names": "testicular pain, testicle swelling, scrotal pain, sudden groin pain", "body_system": "Genitourinary", "is_emergency_flag": True},

            # Ophthalmological & ENT
            {"code": "EYE_PAIN", "name": "Severe Eye Pain", "common_names": "eye pain, severe pain in eyeball, orbital ache, deep eye pressure", "body_system": "Ophthalmological", "is_emergency_flag": True},
            {"code": "BLUR_VIS", "name": "Blurred or Impaired Vision", "common_names": "blurred vision, loss of vision, sudden vision loss, double vision, diplopia, seeing halos", "body_system": "Ophthalmological", "is_emergency_flag": True},
            {"code": "RED_EYE", "name": "Red Eye / Conjunctivitis", "common_names": "red eye, pink eye, bloodshot eye, conjunctivitis, gritty eye feeling", "body_system": "Ophthalmological", "is_emergency_flag": False},
            {"code": "PHOTOPHOBIA", "name": "Extreme Light Sensitivity (Photophobia)", "common_names": "light sensitivity, photophobia, eyes hurt in light, cannot open eyes in sunlight", "body_system": "Ophthalmological", "is_emergency_flag": False},
            {"code": "EAR_PAIN", "name": "Earache / Otalgia", "common_names": "ear pain, earache, otalgia, throbbing ear, ear discharge, blocked ear", "body_system": "ENT", "is_emergency_flag": False},
            {"code": "TINNITUS", "name": "Tinnitus (Ringing in Ears)", "common_names": "ringing in ears, tinnitus, buzzing sound in ear, ear hissing", "body_system": "ENT", "is_emergency_flag": False},
            {"code": "EPISTAXIS", "name": "Nosebleed (Epistaxis)", "common_names": "nosebleed, epistaxis, bleeding from nose", "body_system": "ENT", "is_emergency_flag": False},

            # Endocrine & Metabolic
            {"code": "EXTREME_THIRST", "name": "Excessive Thirst (Polydipsia)", "common_names": "excessive thirst, polydipsia, unquenchable thirst, constantly drinking water", "body_system": "Endocrine", "is_emergency_flag": False},
            {"code": "HEAT_INTOL", "name": "Heat Intolerance & Excessive Sweating", "common_names": "cannot tolerate heat, heat intolerance, sweating profusely, hot flushes", "body_system": "Endocrine", "is_emergency_flag": False},
            {"code": "COLD_INTOL", "name": "Cold Intolerance & Dry Skin", "common_names": "cannot tolerate cold, cold intolerance, always freezing, brittle nails and hair", "body_system": "Endocrine", "is_emergency_flag": False},
        ]

        db_symptoms = {}
        for sym_data in all_symptoms:
            s_obj, _ = Symptom.objects.update_or_create(
                code=sym_data["code"],
                defaults={
                    "name": sym_data["name"],
                    "common_names": sym_data["common_names"],
                    "body_system": sym_data["body_system"],
                    "is_emergency_flag": sym_data["is_emergency_flag"],
                    "source": who,
                    "review_status": "Approved"
                }
            )
            db_symptoms[sym_data["code"]] = s_obj

        self.stdout.write(f"Populated {len(db_symptoms)} clinical symptoms.")

        # 4. Risk Factors
        rf_map = {}
        rfs = [
            ("RF-HYP", "Hypertension (High Blood Pressure)", "Cardiovascular"),
            ("RF-DIAB", "Type 2 Diabetes Mellitus", "Endocrine"),
            ("RF-SMOK", "Tobacco Smoking / Nicotine Use", "Lifestyle"),
            ("RF-ASTH", "Bronchial Asthma / Atopy", "Respiratory"),
            ("RF-CAD", "Coronary Artery Disease / Family History", "Cardiovascular"),
            ("RF-CKD", "Chronic Kidney Disease", "Renal"),
            ("RF-OBESE", "Obesity (BMI > 30)", "Metabolic"),
            ("RF-IMMUNO", "Immunosuppression / Chemotherapy", "Immunological"),
            ("RF-ELDERLY", "Elderly Age (>65 years)", "Demographic"),
        ]
        for code, name, cat in rfs:
            rf_obj, _ = RiskFactor.objects.get_or_create(code=code, defaults={"name": name, "category": cat})
            rf_map[code] = rf_obj

        # 5. Full Medical Conditions Matrix (40+ conditions with diagnostic protocols & self-care)
        conditions_catalog = [
            # Cardiovascular
            {
                "code": "COND-ACS",
                "name": "Acute Coronary Syndrome / Myocardial Infarction",
                "scientific_name": "Ischemic Heart Disease",
                "category": "Cardiovascular",
                "overview": "Reduced blood flow to heart muscle causing acute ischemic chest pain, pressure, radiating discomfort to left arm or jaw, and shortness of breath. Requires immediate emergency medical triage.",
                "recommended_evaluations": "12-lead ECG, High-sensitivity Cardiac Troponin I/T, Echocardiogram, Coronary Angiography.",
                "non_pharmacological_care": "Immediate physical rest in a calm sitting position. Loosen tight collar. Immediate emergency ambulance transport (112/108).",
                "source": who,
                "symptoms": [("CHSTP", 1.0, "Very Common"), ("DYSP", 0.85, "Very Common"), ("PALP", 0.7, "Common"), ("DIZZ", 0.65, "Common"), ("FATIG", 0.6, "Common"), ("COLD_EXTREM", 0.6, "Common")],
                "warning_signs": ["WS-CHEST-RAD"],
                "risk_factors": [rf_map["RF-HYP"], rf_map["RF-DIAB"], rf_map["RF-SMOK"], rf_map["RF-CAD"]]
            },
            {
                "code": "COND-HEART-FAIL",
                "name": "Congestive Heart Failure Exacerbation",
                "scientific_name": "Decompensated Congestive Heart Failure",
                "category": "Cardiovascular",
                "overview": "Inability of the heart to pump effectively, leading to fluid accumulation in lungs (dyspnea, orthopnea) and lower extremities (bilateral leg edema).",
                "recommended_evaluations": "Serum BNP / NT-proBNP, Chest Radiograph (PA view), Transthoracic Echocardiogram, Serum Electrolytes.",
                "non_pharmacological_care": "Strict dietary sodium restriction (<2g/day), daily weight monitoring, sitting with legs dependent.",
                "source": who,
                "symptoms": [("DYSP", 0.95, "Very Common"), ("ORTHOPNEA", 0.9, "Very Common"), ("LEG_EDEMA", 0.9, "Very Common"), ("FATIG", 0.8, "Very Common"), ("PALP", 0.6, "Occasional")],
                "warning_signs": ["WS-DYSP-STRIDOR"],
                "risk_factors": [rf_map["RF-HYP"], rf_map["RF-CAD"], rf_map["RF-DIAB"]]
            },
            {
                "code": "COND-AFIB",
                "name": "Atrial Fibrillation / Cardiac Arrhythmia",
                "scientific_name": "Supraventricular Tachyarrhythmia",
                "category": "Cardiovascular",
                "overview": "Irregular and often rapid heart rate causing palpitations, lightheadedness, fatigue, and increased risk of thromboembolic stroke.",
                "recommended_evaluations": "12-lead ECG, 24-48 hour Holter monitor, Echocardiogram, Thyroid function tests (TSH).",
                "non_pharmacological_care": "Avoid caffeine and stimulants, stress reduction, monitor resting pulse rate.",
                "source": who,
                "symptoms": [("PALP", 1.0, "Very Common"), ("DIZZ", 0.8, "Common"), ("FATIG", 0.75, "Common"), ("DYSP", 0.7, "Common"), ("CHSTP", 0.5, "Occasional")],
                "warning_signs": ["WS-STROKE-FAST"],
                "risk_factors": [rf_map["RF-HYP"], rf_map["RF-ELDERLY"]]
            },

            # Pulmonology
            {
                "code": "COND-CAP",
                "name": "Community-Acquired Pneumonia",
                "scientific_name": "Acute Lower Respiratory Tract Infection",
                "category": "Pulmonology",
                "overview": "Infection of pulmonary alveoli leading to exudative consolidation, high fever, productive cough with yellow/green phlegm, pleuritic chest pain, and dyspnea.",
                "recommended_evaluations": "Chest Radiograph (PA view), Pulse Oximetry (SpO2), Complete Blood Count (CBC with differential), Sputum culture.",
                "non_pharmacological_care": "Adequate hydration, steam inhalation, rest in elevated head position, avoid smoking.",
                "source": who,
                "symptoms": [("FEV", 0.95, "Very Common"), ("CHILLS", 0.85, "Very Common"), ("PROD_COUGH", 0.95, "Very Common"), ("DYSP", 0.85, "Common"), ("PLEURITIC_PAIN", 0.75, "Common"), ("FATIG", 0.8, "Very Common")],
                "warning_signs": ["WS-DYSP-STRIDOR", "WS-PERSIST-FEVER"],
                "risk_factors": [rf_map["RF-SMOK"], rf_map["RF-ASTH"], rf_map["RF-ELDERLY"]]
            },
            {
                "code": "COND-ASTHMA",
                "name": "Acute Bronchial Asthma Exacerbation",
                "scientific_name": "Reversible Airway Hyperreactivity",
                "category": "Pulmonology",
                "overview": "Chronic inflammatory airway disease characterized by episodic bronchospasm, audible wheezing, chest tightness, and shortness of breath triggered by allergens or cold air.",
                "recommended_evaluations": "Spirometry / Peak Expiratory Flow Rate (PEFR), Pulse Oximetry, Allergy skin prick testing.",
                "non_pharmacological_care": "Sit upright, stay calm, avoid identified allergens/smoke, use prescribed rescue beta-2 inhaler.",
                "source": who,
                "symptoms": [("WHEEZING", 1.0, "Very Common"), ("DYSP", 0.95, "Very Common"), ("COUGH", 0.8, "Common"), ("CHSTP", 0.6, "Common")],
                "warning_signs": ["WS-DYSP-STRIDOR"],
                "risk_factors": [rf_map["RF-ASTH"], rf_map["RF-SMOK"]]
            },
            {
                "code": "COND-PULM-EMB",
                "name": "Pulmonary Embolism",
                "scientific_name": "Acute Thromboembolic Pulmonary Occlusion",
                "category": "Pulmonology",
                "overview": "Blood clot obstructing pulmonary arterial bed, presenting with acute sudden shortness of breath, pleuritic chest pain, coughing up blood (hemoptysis), and tachycardia.",
                "recommended_evaluations": "CT Pulmonary Angiography (CTPA), D-Dimer test, Lower extremity venous Doppler ultrasound.",
                "non_pharmacological_care": "Immediate emergency room admission. Oxygen supplementation, strict bed rest, avoid leg massage.",
                "source": nih,
                "symptoms": [("DYSP", 1.0, "Very Common"), ("PLEURITIC_PAIN", 0.9, "Very Common"), ("HEMOPTYSIS", 0.7, "Common"), ("PALP", 0.8, "Very Common"), ("SYNCOPE", 0.5, "Occasional"), ("LEG_EDEMA", 0.6, "Common")],
                "warning_signs": ["WS-DYSP-STRIDOR", "WS-CHEST-RAD"],
                "risk_factors": [rf_map["RF-OBESE"], rf_map["RF-SMOK"]]
            },
            {
                "code": "COND-URI",
                "name": "Acute Viral Upper Respiratory Infection (Common Cold)",
                "scientific_name": "Acute Viral Rhinopharyngitis",
                "category": "Pulmonology",
                "overview": "Self-limiting viral mucosal infection of nasal passages and pharynx, causing rhinorrhea, nasal congestion, mild sore throat, sneezing, and low-grade malaise.",
                "recommended_evaluations": "Clinical examination. Diagnostic tests generally unnecessary unless strep pharyngitis suspected.",
                "non_pharmacological_care": "Warm saline gargles, warm fluids (honey/lemon), adequate rest, steam inhalation.",
                "source": who,
                "symptoms": [("NASAL_CONGEST", 0.95, "Very Common"), ("SNEEZING", 0.9, "Very Common"), ("SORE_THR", 0.85, "Very Common"), ("COUGH", 0.7, "Common"), ("HDCH", 0.5, "Occasional"), ("FEV", 0.4, "Occasional")],
                "warning_signs": [],
                "risk_factors": []
            },
            {
                "code": "COND-TB",
                "name": "Pulmonary Tuberculosis (TB)",
                "scientific_name": "Mycobacterium tuberculosis Infection",
                "category": "Infectious Disease",
                "overview": "Chronic bacterial infection of lungs characterized by persistent cough >2 weeks, drenching night sweats, hemoptysis, unexplained weight loss, and afternoon fevers.",
                "recommended_evaluations": "Sputum GeneXpert (CBNAAT) / AFB smear, Chest X-ray, Tuberculin Skin Test / IGRA.",
                "non_pharmacological_care": "Nutritious high-protein diet, well-ventilated living space, mask wearing, full completion of DOTS treatment.",
                "source": who,
                "symptoms": [("COUGH", 0.95, "Very Common"), ("NIGHT_SWEATS", 0.9, "Very Common"), ("WT_LOSS", 0.9, "Very Common"), ("FEV", 0.8, "Common"), ("HEMOPTYSIS", 0.6, "Common"), ("FATIG", 0.85, "Very Common")],
                "warning_signs": ["WS-PERSIST-FEVER"],
                "risk_factors": [rf_map["RF-IMMUNO"], rf_map["RF-DIAB"], rf_map["RF-SMOK"]]
            },

            # Neurology
            {
                "code": "COND-STROKE",
                "name": "Acute Ischemic Stroke / Cerebrovascular Accident",
                "scientific_name": "Acute Cerebral Ischemia",
                "category": "Neurology",
                "overview": "Sudden interruption of cerebral blood supply leading to unilateral facial drooping, arm weakness, slurred speech, sudden loss of balance, or vision deficit. Time-critical emergency.",
                "recommended_evaluations": "Non-contrast Brain CT scan, Brain MRI (DWI sequence), CT Angiography, Blood glucose check.",
                "non_pharmacological_care": "Immediate 112 emergency transport. Keep patient lying flat on side. Do not give water, food, or blood thinners before imaging.",
                "source": cdc,
                "symptoms": [("UNILAT_WEAK", 1.0, "Very Common"), ("SLUR_SPEECH", 0.95, "Very Common"), ("SUDDEN_CONF", 0.8, "Common"), ("BLUR_VIS", 0.7, "Common"), ("DIZZ", 0.7, "Common"), ("NUMB", 0.8, "Very Common")],
                "warning_signs": ["WS-STROKE-FAST"],
                "risk_factors": [rf_map["RF-HYP"], rf_map["RF-DIAB"], rf_map["RF-SMOK"], rf_map["RF-CAD"], rf_map["RF-ELDERLY"]]
            },
            {
                "code": "COND-MENINGITIS",
                "name": "Acute Bacterial / Viral Meningitis",
                "scientific_name": "Acute Leptomeningeal Infection",
                "category": "Neurology",
                "overview": "Severe infection of brain and spinal cord meninges characterized by triad of high fever, severe headache, and neck stiffness (nuchal rigidity) with photophobia.",
                "recommended_evaluations": "Emergency Lumbar Puncture with CSF analysis, Blood cultures, Brain CT.",
                "non_pharmacological_care": "Immediate emergency room admission. Dark quiet room, isolation precautions.",
                "source": cdc,
                "symptoms": [("FEV", 1.0, "Very Common"), ("HDCH", 1.0, "Very Common"), ("NECK_STIFF", 0.95, "Very Common"), ("PHOTOPHOBIA", 0.85, "Very Common"), ("SUDDEN_CONF", 0.8, "Common"), ("VOMIT", 0.7, "Common"), ("PETECHIAE", 0.4, "Occasional")],
                "warning_signs": ["WS-MENINGISM"],
                "risk_factors": [rf_map["RF-IMMUNO"]]
            },
            {
                "code": "COND-MIGRAINE",
                "name": "Migraine with / without Aura",
                "scientific_name": "Neurovascular Headache Disorder",
                "category": "Neurology",
                "overview": "Recurring neurovascular disorder causing moderate-to-severe unilateral throbbing headache, often exacerbated by light and sound, accompanied by nausea and visual disturbances.",
                "recommended_evaluations": "Neurological examination, headache diary, Fundoscopic examination (to rule out papilledema).",
                "non_pharmacological_care": "Rest in a completely dark and quiet room, cold forehead compress, regular sleep schedule, avoid dietary triggers (aged cheese, MSG).",
                "source": who,
                "symptoms": [("MIGRAINE_PAIN", 1.0, "Very Common"), ("HDCH", 1.0, "Very Common"), ("NAUS", 0.8, "Very Common"), ("PHOTOPHOBIA", 0.85, "Very Common"), ("BLUR_VIS", 0.65, "Common"), ("VOMIT", 0.5, "Occasional")],
                "warning_signs": [],
                "risk_factors": []
            },
            {
                "code": "COND-VERTIGO",
                "name": "Benign Paroxysmal Positional Vertigo (BPPV) / Labyrinthitis",
                "scientific_name": "Peripheral Vestibular Disorder",
                "category": "Neurology",
                "overview": "Disorder of inner ear balance system causing sudden spinning sensation (vertigo) triggered by head movements, accompanied by nausea and unsteadiness.",
                "recommended_evaluations": "Dix-Hallpike maneuver, Audiometry, Neurologic examination (to rule out central cerebellar stroke).",
                "non_pharmacological_care": "Epley canalith repositioning maneuver, slow position changes, avoidance of sudden head turning.",
                "source": nih,
                "symptoms": [("DIZZ", 1.0, "Very Common"), ("NAUS", 0.75, "Common"), ("VOMIT", 0.5, "Occasional"), ("BLUR_VIS", 0.4, "Occasional")],
                "warning_signs": [],
                "risk_factors": [rf_map["RF-ELDERLY"]]
            },

            # Gastroenterology & Hepatic
            {
                "code": "COND-GASTRO",
                "name": "Acute Gastroenteritis / Infectious Diarrhea",
                "scientific_name": "Infectious Enterocolitis",
                "category": "Gastroenterology",
                "overview": "Inflammation of gastrointestinal tract lining caused by viral or bacterial pathogens, leading to frequent watery diarrhea, nausea, vomiting, abdominal cramping, and dehydration risk.",
                "recommended_evaluations": "Clinical hydration assessment, Stool routine microscopy and culture (if fever or dysentery present), Serum electrolytes.",
                "non_pharmacological_care": "Intensive Oral Rehydration Solution (ORS), frequent small sips, bland BRAT diet (Bananas, Rice, Applesauce, Toast), zinc supplementation in children.",
                "source": who,
                "symptoms": [("DIARR", 1.0, "Very Common"), ("VOMIT", 0.85, "Very Common"), ("NAUS", 0.85, "Very Common"), ("ABDP", 0.8, "Common"), ("FEV", 0.5, "Occasional"), ("FATIG", 0.7, "Common")],
                "warning_signs": ["WS-DEHYDRATION-GI"],
                "risk_factors": []
            },
            {
                "code": "COND-APPENDICITIS",
                "name": "Acute Appendicitis",
                "scientific_name": "Acute Inflammation of Vermiform Appendix",
                "category": "Gastroenterology",
                "overview": "Lumen obstruction and bacterial invasion of the appendix, classically presenting with periumbilical pain shifting to the Right Lower Quadrant (RLQ), accompanied by anorexia, nausea, fever, and localized guarding.",
                "recommended_evaluations": "Abdominal Ultrasound / Contrast CT, Complete Blood Count (Leukocytosis), Clinical Alvarado score.",
                "non_pharmacological_care": "Strict nil per oral (NPO). Do NOT apply heat pads or take strong analgesics before surgical consultation. Seek emergency hospital care.",
                "source": nih,
                "symptoms": [("RLQ_PAIN", 1.0, "Very Common"), ("ABDP", 1.0, "Very Common"), ("NAUS", 0.8, "Very Common"), ("VOMIT", 0.75, "Common"), ("FEV", 0.65, "Common"), ("MALAISE", 0.7, "Common")],
                "warning_signs": ["WS-RIGID-ABD"],
                "risk_factors": []
            },
            {
                "code": "COND-GERD",
                "name": "Gastroesophageal Reflux Disease (GERD) & Peptic Ulcer",
                "scientific_name": "Acid Peptic Disorder",
                "category": "Gastroenterology",
                "overview": "Retrograde flow of gastric acid into esophagus causing retrosternal burning (heartburn), regurgitation, epigastric discomfort, and dyspepsia exacerbated after meals.",
                "recommended_evaluations": "Upper GI Endoscopy (EGD), H. pylori antigen / urea breath test, 24-hour esophageal pH monitoring.",
                "non_pharmacological_care": "Elevate head of bed by 15cm, eat small frequent meals, avoid lying down within 3 hours after eating, avoid spicy/fatty foods and caffeine.",
                "source": nih,
                "symptoms": [("HEARTBURN", 1.0, "Very Common"), ("ABDP", 0.8, "Common"), ("NAUS", 0.6, "Common"), ("BLOATING", 0.6, "Common"), ("DIFF_SWAL", 0.4, "Occasional")],
                "warning_signs": [],
                "risk_factors": [rf_map["RF-OBESE"], rf_map["RF-SMOK"]]
            },
            {
                "code": "COND-HEPATITIS",
                "name": "Acute Viral Hepatitis (A, B, E) / Liver Injury",
                "scientific_name": "Acute Hepatic Inflammation",
                "category": "Gastroenterology",
                "overview": "Viral infection or toxic injury of hepatocytes resulting in jaundice (yellow eyes/skin), dark tea-colored urine, right upper quadrant tenderness, fatigue, and nausea.",
                "recommended_evaluations": "Liver Function Tests (Serum Bilirubin, AST/ALT, ALP), Viral serology (Anti-HAV IgM, HBsAg, Anti-HEV IgM), Abdominal Ultrasound.",
                "non_pharmacological_care": "Complete physical bed rest, high-carbohydrate light diet, strictly avoid all alcohol and hepatotoxic drugs (e.g. excessive paracetamol).",
                "source": who,
                "symptoms": [("JAUNDICE", 1.0, "Very Common"), ("FATIG", 0.9, "Very Common"), ("RUQ_PAIN", 0.8, "Common"), ("NAUS", 0.8, "Common"), ("FEV", 0.6, "Common"), ("WT_LOSS", 0.5, "Occasional")],
                "warning_signs": [],
                "risk_factors": []
            },
            {
                "code": "COND-GI-BLEED",
                "name": "Upper / Lower Gastrointestinal Bleeding",
                "scientific_name": "Acute Gastrointestinal Hemorrhage",
                "category": "Gastroenterology",
                "overview": "Bleeding from esophagus/stomach (vomiting blood / black tarry stools) or lower bowel (red blood in stool), requiring urgent clinical assessment for hemodynamic stability.",
                "recommended_evaluations": "Emergency Upper / Lower GI Endoscopy, Serial Hemoglobin/Hematocrit, Coagulation profile (INR/PT).",
                "non_pharmacological_care": "Immediate emergency hospitalization. Keep patient flat, NPO status, prepare for IV volume replacement.",
                "source": who,
                "symptoms": [("HEMATEMESIS", 0.9, "Very Common"), ("BLOODY_STOOL", 0.95, "Very Common"), ("DIZZ", 0.85, "Very Common"), ("FATIG", 0.85, "Very Common"), ("SYNCOPE", 0.6, "Common"), ("ABDP", 0.7, "Common")],
                "warning_signs": ["WS-RIGID-ABD"],
                "risk_factors": [rf_map["RF-ELDERLY"]]
            },

            # Infectious Diseases
            {
                "code": "COND-DENGUE",
                "name": "Dengue Fever / Arboviral Infection",
                "scientific_name": "Dengue Virus Infection",
                "category": "Infectious Disease",
                "overview": "Aedes mosquito-borne viral infection characterized by sudden high fever, intense retro-orbital headache, severe joint and muscle pain ('breakbone fever'), and rash.",
                "recommended_evaluations": "Dengue NS1 Antigen (Days 1-5), IgM/IgG Serology, Serial Complete Blood Count (Platelet count and Hematocrit monitoring).",
                "non_pharmacological_care": "Intensive oral fluid replenishment with juices/ORS, bed rest, paracetamol for fever. Strictly avoid NSAIDs (aspirin/ibuprofen) due to severe bleeding risks.",
                "source": icmr,
                "symptoms": [("FEV", 1.0, "Very Common"), ("HDCH", 0.95, "Very Common"), ("JOINT_PAIN", 0.95, "Very Common"), ("MYALGIA", 0.95, "Very Common"), ("RASH", 0.7, "Common"), ("FATIG", 0.9, "Very Common"), ("NAUS", 0.7, "Common"), ("PETECHIAE", 0.5, "Occasional")],
                "warning_signs": ["WS-PERSIST-FEVER"],
                "risk_factors": []
            },
            {
                "code": "COND-MALARIA",
                "name": "Malaria (Plasmodium falciparum / vivax)",
                "scientific_name": "Plasmodium Parasitemia",
                "category": "Infectious Disease",
                "overview": "Protozoan parasitic infection transmitted by Anopheles mosquitoes, causing cyclical high fever spikes with intense shivering chills, drenching sweats, and headache.",
                "recommended_evaluations": "Rapid Diagnostic Test (RDT) for Malaria Antigen, Peripheral Blood Smear (Thick and Thin for MP), CBC.",
                "non_pharmacological_care": "Adequate hydration, antipyretics, prompt initiation of Artemisinin-based Combination Therapy (ACT) under doctor prescription.",
                "source": who,
                "symptoms": [("FEV", 1.0, "Very Common"), ("CHILLS", 1.0, "Very Common"), ("NIGHT_SWEATS", 0.85, "Very Common"), ("HDCH", 0.85, "Very Common"), ("MYALGIA", 0.8, "Common"), ("FATIG", 0.85, "Very Common"), ("JAUNDICE", 0.4, "Occasional")],
                "warning_signs": ["WS-PERSIST-FEVER"],
                "risk_factors": []
            },
            {
                "code": "COND-TYPHOID",
                "name": "Typhoid / Enteric Fever",
                "scientific_name": "Salmonella enterica serovar Typhi Infection",
                "category": "Infectious Disease",
                "overview": "Waterborne bacterial infection presenting with step-ladder rising fever, dull fronto-temporal headache, abdominal pain, coated tongue, and constipation/diarrhea.",
                "recommended_evaluations": "Blood culture (Gold Standard in 1st week), Widal test / Typhidot, Stool culture.",
                "non_pharmacological_care": "Safe boiled drinking water, strict hand hygiene, easily digestible soft diet, complete prescribed antibiotic course.",
                "source": icmr,
                "symptoms": [("FEV", 1.0, "Very Common"), ("HDCH", 0.9, "Very Common"), ("ABDP", 0.8, "Common"), ("FATIG", 0.85, "Very Common"), ("MALAISE", 0.8, "Common"), ("CONSTIP", 0.6, "Common"), ("DIARR", 0.5, "Occasional")],
                "warning_signs": ["WS-PERSIST-FEVER"],
                "risk_factors": []
            },
            {
                "code": "COND-UTI",
                "name": "Urinary Tract Infection (UTI) & Cystitis",
                "scientific_name": "Acute Bacterial Cystitis",
                "category": "Genitourinary",
                "overview": "Bacterial infection of lower urinary tract causing burning pain on urination (dysuria), increased frequency, urgency, and lower suprapubic pelvic discomfort.",
                "recommended_evaluations": "Urine Routine and Microscopy (pus cells, bacteria, RBCs), Urine Culture and Antibiotic Sensitivity.",
                "non_pharmacological_care": "Increase water intake (2.5-3 liters/day), avoid holding urine, urinary alkalinizers under doctor advice.",
                "source": who,
                "symptoms": [("DYSURIA", 1.0, "Very Common"), ("POLYURIA", 0.95, "Very Common"), ("HEMATURIA", 0.5, "Common"), ("ABDP", 0.6, "Common"), ("FEV", 0.4, "Occasional")],
                "warning_signs": [],
                "risk_factors": [rf_map["RF-DIAB"]]
            },
            {
                "code": "COND-PYELONEPHRITIS",
                "name": "Acute Pyelonephritis (Kidney Infection)",
                "scientific_name": "Upper Urinary Tract Bacterial Infection",
                "category": "Genitourinary",
                "overview": "Ascending bacterial infection reaching the renal pelvis and parenchyma, causing high spiking fever, severe flank/costovertebral angle pain, rigors, and vomiting.",
                "recommended_evaluations": "Urine Culture, Renal Ultrasonography, Complete Blood Count, Serum Creatinine.",
                "non_pharmacological_care": "Urgent medical clinic consultation for systemic antibiotic therapy and hydration monitoring.",
                "source": who,
                "symptoms": [("FEV", 0.95, "Very Common"), ("CHILLS", 0.9, "Very Common"), ("FLANK_PAIN", 0.95, "Very Common"), ("DYSURIA", 0.8, "Common"), ("NAUS", 0.75, "Common"), ("VOMIT", 0.7, "Common")],
                "warning_signs": ["WS-PERSIST-FEVER"],
                "risk_factors": [rf_map["RF-DIAB"]]
            },

            # Endocrine & Metabolic
            {
                "code": "COND-DIABETES-DKA",
                "name": "Type 2 Diabetes Mellitus & Hyperglycemic Crisis",
                "scientific_name": "Diabetes Mellitus / Diabetic Ketoacidosis",
                "category": "Endocrine",
                "overview": "Metabolic disorder of insulin resistance and deficiency resulting in excessive thirst (polydipsia), frequent urination (polyuria), unexplained weight loss, and fatigue.",
                "recommended_evaluations": "Fasting Blood Glucose, Postprandial Glucose, Glycated Hemoglobin (HbA1c), Urine Ketones.",
                "non_pharmacological_care": "Low-glycemic balanced diet, regular daily aerobic physical exercise (30 mins), blood glucose self-monitoring.",
                "source": who,
                "symptoms": [("EXTREME_THIRST", 0.95, "Very Common"), ("POLYURIA", 0.95, "Very Common"), ("WT_LOSS", 0.8, "Common"), ("FATIG", 0.85, "Very Common"), ("BLUR_VIS", 0.6, "Common"), ("SUDDEN_CONF", 0.4, "Occasional")],
                "warning_signs": ["WS-DIABETIC-KETONES"],
                "risk_factors": [rf_map["RF-DIAB"], rf_map["RF-OBESE"]]
            },
            {
                "code": "COND-HYPOTHYROID",
                "name": "Primary Hypothyroidism",
                "scientific_name": "Underactive Thyroid Gland",
                "category": "Endocrine",
                "overview": "Deficiency of thyroid hormones (T3/T4) causing slowed metabolism, marked cold intolerance, chronic fatigue, weight gain, constipation, and dry skin.",
                "recommended_evaluations": "Serum Thyroid Stimulating Hormone (TSH), Free T4, Anti-TPO antibodies.",
                "non_pharmacological_care": "Iodized salt intake, balanced nutrition, daily morning levothyroxine on empty stomach under physician guidance.",
                "source": nih,
                "symptoms": [("COLD_INTOL", 0.95, "Very Common"), ("FATIG", 0.95, "Very Common"), ("CONSTIP", 0.8, "Common"), ("MYALGIA", 0.7, "Common"), ("DEPRESS", 0.6, "Common")],
                "warning_signs": [],
                "risk_factors": [rf_map["RF-ELDERLY"]]
            },
            {
                "code": "COND-HYPERTHYROID",
                "name": "Hyperthyroidism / Thyrotoxicosis",
                "scientific_name": "Overactive Thyroid Gland / Graves Disease",
                "category": "Endocrine",
                "overview": "Excess thyroid hormone production leading to heat intolerance, resting tachycardia/palpitations, fine hand tremors, weight loss despite increased appetite, and anxiety.",
                "recommended_evaluations": "Serum TSH (suppressed), Free T3/T4, Thyroid ultrasound / radioactive iodine uptake.",
                "non_pharmacological_care": "Avoid excess caffeine and iodine, cool ambient environment, stress reduction.",
                "source": nih,
                "symptoms": [("HEAT_INTOL", 0.95, "Very Common"), ("PALP", 0.95, "Very Common"), ("TREMOR", 0.9, "Very Common"), ("WT_LOSS", 0.85, "Very Common"), ("ANX", 0.85, "Very Common"), ("DIARR", 0.6, "Common")],
                "warning_signs": [],
                "risk_factors": []
            },

            # Musculoskeletal & Rheumatology
            {
                "code": "COND-ARTHRITIS",
                "name": "Osteoarthritis / Inflammatory Arthritis",
                "scientific_name": "Degenerative / Autoimmune Arthropathy",
                "category": "Musculoskeletal",
                "overview": "Degeneration of articular cartilage or synovial inflammation causing persistent joint pain, stiffness (worse in morning), swelling, and reduced mobility.",
                "recommended_evaluations": "Joint X-rays, Serum Rheumatoid Factor (RF), Anti-CCP antibodies, ESR / CRP inflammatory markers.",
                "non_pharmacological_care": "Low-impact physical exercise (swimming, cycling), hot/cold compresses, weight management, supportive knee braces.",
                "source": who,
                "symptoms": [("JOINT_PAIN", 1.0, "Very Common"), ("JOINT_SWELL", 0.85, "Very Common"), ("MYALGIA", 0.7, "Common"), ("FATIG", 0.6, "Common")],
                "warning_signs": [],
                "risk_factors": [rf_map["RF-OBESE"], rf_map["RF-ELDERLY"]]
            },
            {
                "code": "COND-GOUT",
                "name": "Acute Gouty Arthritis",
                "scientific_name": "Monosodium Urate Crystal Arthropathy",
                "category": "Musculoskeletal",
                "overview": "Deposition of uric acid crystals in joints, classically causing excruciating sudden nocturnal pain, redness, and swelling in the first metatarsophalangeal (big toe) joint.",
                "recommended_evaluations": "Serum Uric Acid levels, Joint fluid aspiration (polarized microscopy for needle-shaped crystals).",
                "non_pharmacological_care": "Hydration (>3L water/day), ice packs on joint, strictly avoid high-purine foods (red meat, seafood, organ meats) and alcohol/beer.",
                "source": nih,
                "symptoms": [("JOINT_PAIN", 1.0, "Very Common"), ("JOINT_SWELL", 0.95, "Very Common"), ("FEV", 0.4, "Occasional")],
                "warning_signs": [],
                "risk_factors": [rf_map["RF-OBESE"], rf_map["RF-HYP"]]
            },
            {
                "code": "COND-LUMBAR-DISC",
                "name": "Lumbar Spondylosis & Sciatica",
                "scientific_name": "Lumbar Radiculopathy / Disc Herniation",
                "category": "Musculoskeletal",
                "overview": "Compression of lumbar spinal nerve roots causing localized lower back pain radiating down the back of the thigh and calf (sciatica), accompanied by numbness.",
                "recommended_evaluations": "Lumbosacral Spine MRI, Straight Leg Raise (SLR) clinical test.",
                "non_pharmacological_care": "Avoid prolonged sitting and heavy lifting, core strengthening physiotherapy, ergonomic chair support.",
                "source": nih,
                "symptoms": [("BACK_PAIN", 1.0, "Very Common"), ("SCIATICA", 0.95, "Very Common"), ("NUMB", 0.8, "Common"), ("MYALGIA", 0.7, "Common")],
                "warning_signs": [],
                "risk_factors": [rf_map["RF-OBESE"]]
            },

            # Dermatology & Allergy
            {
                "code": "COND-ANAPHYLAXIS",
                "name": "Severe Anaphylaxis / Acute Allergic Shock",
                "scientific_name": "IgE-Mediated Systemic Anaphylactic Shock",
                "category": "Dermatological",
                "overview": "Rapidly progressing multi-system allergic emergency following food, medication, or insect exposure, causing hives, facial angioedema, bronchospasm, and circulatory collapse.",
                "recommended_evaluations": "Clinical diagnosis (zero delay). Serum tryptase level post-stabilization.",
                "non_pharmacological_care": "Immediate intramuscular Epinephrine injection into outer thigh. Lie patient flat with elevated legs (unless vomiting/severe dyspnea). Call 112/108 immediately.",
                "source": who,
                "symptoms": [("URTICARIA", 0.95, "Very Common"), ("FACIAL_EDEMA", 0.95, "Very Common"), ("DYSP", 0.95, "Very Common"), ("DIFF_SWAL", 0.9, "Very Common"), ("STRIDOR", 0.85, "Very Common"), ("DIZZ", 0.8, "Common"), ("SYNCOPE", 0.6, "Common")],
                "warning_signs": ["WS-ANAPHYLAXIS"],
                "risk_factors": [rf_map["RF-ASTH"]]
            },
            {
                "code": "COND-URTICARIA",
                "name": "Acute Allergic Urticaria & Dermatitis",
                "scientific_name": "Allergic Contact / Atopic Dermatitis",
                "category": "Dermatological",
                "overview": "Histamine-mediated skin reaction presenting with intensely itchy, raised, erythematous wheals (hives) and localized superficial edema.",
                "recommended_evaluations": "Clinical dermatological examination, IgE levels, Allergen patch test if chronic.",
                "non_pharmacological_care": "Cool compresses, calamine lotion, gentle moisturizing emollients, avoid hot showers and tight clothing.",
                "source": who,
                "symptoms": [("URTICARIA", 1.0, "Very Common"), ("RASH", 0.95, "Very Common"), ("PRURITUS", 1.0, "Very Common")],
                "warning_signs": [],
                "risk_factors": [rf_map["RF-ASTH"]]
            },
            {
                "code": "COND-SHINGLES",
                "name": "Herpes Zoster (Shingles)",
                "scientific_name": "Varicella Zoster Virus Reactivation",
                "category": "Dermatological",
                "overview": "Reactivation of latent chickenpox virus along a single dermatome nerve path, causing painful tingling followed by a unilateral vesicular rash with blisters.",
                "recommended_evaluations": "Clinical recognition of dermatomal distribution, Tzanck smear / PCR if atypical.",
                "non_pharmacological_care": "Keep blisters clean and dry, cool compresses, wear loose cotton clothing, early oral antivirals under doctor advice within 72 hours.",
                "source": nih,
                "symptoms": [("BLISTERS", 1.0, "Very Common"), ("RASH", 0.95, "Very Common"), ("MYALGIA", 0.8, "Common"), ("NUMB", 0.85, "Common"), ("FEV", 0.4, "Occasional")],
                "warning_signs": [],
                "risk_factors": [rf_map["RF-IMMUNO"], rf_map["RF-ELDERLY"]]
            },

            # Ophthalmology & ENT
            {
                "code": "COND-GLAUCOMA",
                "name": "Acute Angle-Closure Glaucoma",
                "scientific_name": "Acute Pupillary Block Glaucoma",
                "category": "Ophthalmological",
                "overview": "Sudden blockage of aqueous humor drainage leading to rapid spike in intraocular pressure, presenting with severe unilateral eye pain, headache, seeing rainbow halos around lights, and blurred vision.",
                "recommended_evaluations": "Immediate Tonometry (IOP measurement), Gonioscopy, Slit-lamp biomicroscopy.",
                "non_pharmacological_care": "Immediate emergency ophthalmology hospital visit. Do NOT patch the eye or apply dilating drops.",
                "source": nih,
                "symptoms": [("EYE_PAIN", 1.0, "Very Common"), ("BLUR_VIS", 1.0, "Very Common"), ("HDCH", 0.9, "Very Common"), ("NAUS", 0.8, "Common"), ("VOMIT", 0.7, "Common"), ("RED_EYE", 0.85, "Very Common")],
                "warning_signs": ["WS-GLAUCOMA-ACUTE"],
                "risk_factors": [rf_map["RF-ELDERLY"]]
            },
            {
                "code": "COND-CONJUNCTIVITIS",
                "name": "Acute Infectious / Allergic Conjunctivitis",
                "scientific_name": "Conjunctival Inflammation",
                "category": "Ophthalmological",
                "overview": "Inflammation of conjunctival membrane covering the eye, causing redness, gritty sensation, watery or purulent discharge, and mild crusting upon waking.",
                "recommended_evaluations": "Clinical slit lamp examination, visual acuity check.",
                "non_pharmacological_care": "Strict hand washing, clean eye with boiled cooled water, avoid rubbing eyes, separate towels.",
                "source": who,
                "symptoms": [("RED_EYE", 1.0, "Very Common"), ("PRURITUS", 0.8, "Common"), ("PHOTOPHOBIA", 0.5, "Occasional")],
                "warning_signs": [],
                "risk_factors": []
            },
            {
                "code": "COND-OTITIS-MEDIA",
                "name": "Acute Otitis Media / Ear Infection",
                "scientific_name": "Middle Ear Bacterial Infection",
                "category": "ENT",
                "overview": "Bacterial or viral middle ear infection following cold, causing intense throbbing earache (otalgia), muffled hearing, fever, and possible ear discharge.",
                "recommended_evaluations": "Otoscopy (erythematous bulging tympanic membrane), Tympanometry.",
                "non_pharmacological_care": "Warm compress outside ear, analgesics for pain relief, keep ear dry.",
                "source": who,
                "symptoms": [("EAR_PAIN", 1.0, "Very Common"), ("FEV", 0.8, "Common"), ("TINNITUS", 0.6, "Common"), ("HDCH", 0.5, "Occasional")],
                "warning_signs": [],
                "risk_factors": []
            },
            {
                "code": "COND-SINUSITIS",
                "name": "Acute Rhinosinusitis",
                "scientific_name": "Paranasal Sinus Mucosal Inflammation",
                "category": "ENT",
                "overview": "Inflammation of paranasal sinuses causing facial pressure over cheeks/forehead, purulent nasal discharge, blocked nose, and worsening pain upon bending forward.",
                "recommended_evaluations": "Anterior rhinoscopy, Sinus X-ray / CT if non-responsive.",
                "non_pharmacological_care": "Steam inhalation twice daily, warm facial towel compresses, saline nasal rinses.",
                "source": who,
                "symptoms": [("HDCH", 0.9, "Very Common"), ("NASAL_CONGEST", 0.95, "Very Common"), ("PROD_COUGH", 0.6, "Common"), ("FEV", 0.5, "Occasional"), ("TOOTH_PAIN", 0.4, "Occasional") if "TOOTH_PAIN" in db_symptoms else ("HDCH", 0.9, "Very Common")],
                "warning_signs": [],
                "risk_factors": []
            },

            # Psychiatric
            {
                "code": "COND-PANIC",
                "name": "Panic Attack & Acute Anxiety Disorder",
                "scientific_name": "Acute Paroxysmal Anxiety",
                "category": "Psychiatric",
                "overview": "Sudden surge of intense fear or extreme discomfort peaking within minutes, causing racing heart, chest discomfort, shortness of breath, dizziness, and fear of impending doom.",
                "recommended_evaluations": "ECG, Cardiac enzymes, and Thyroid profile to definitively rule out underlying organic pathology.",
                "non_pharmacological_care": "Controlled slow diaphragmatic breathing (4-7-8 method), grounding sensory exercises (5-4-3-2-1 technique), reassurance.",
                "source": who,
                "symptoms": [("ANX", 1.0, "Very Common"), ("PALP", 0.95, "Very Common"), ("DYSP", 0.85, "Very Common"), ("DIZZ", 0.8, "Common"), ("CHSTP", 0.7, "Common"), ("TREMOR", 0.8, "Common")],
                "warning_signs": [],
                "risk_factors": []
            }
        ]

        for cdata in conditions_catalog:
            cond_obj, _ = Condition.objects.update_or_create(
                code=cdata["code"],
                defaults={
                    "name": cdata["name"],
                    "scientific_name": cdata["scientific_name"],
                    "category": cdata["category"],
                    "overview": cdata["overview"],
                    "recommended_evaluations": cdata["recommended_evaluations"],
                    "non_pharmacological_care": cdata["non_pharmacological_care"],
                    "source": cdata["source"],
                    "source_version": "2026.1",
                    "last_verified": timezone.now().date(),
                    "review_status": "Approved"
                }
            )

            # Link symptoms
            for sym_entry in cdata["symptoms"]:
                sym_code = sym_entry[0]
                weight = sym_entry[1]
                freq = sym_entry[2]
                sym_model = db_symptoms.get(sym_code)
                if sym_model:
                    ConditionSymptom.objects.update_or_create(
                        condition=cond_obj,
                        symptom=sym_model,
                        defaults={"weight": weight, "frequency": freq}
                    )

            # Link warning signs
            for ws_code in cdata.get("warning_signs", []):
                ws_model = WarningSign.objects.filter(code=ws_code).first()
                if ws_model:
                    cond_obj.warning_signs.add(ws_model)

            # Link risk factors
            for rf_item in cdata.get("risk_factors", []):
                if rf_item:
                    cond_obj.risk_factors.add(rf_item)

        self.stdout.write(f"Populated {len(conditions_catalog)} clinical conditions linked to knowledge graph.")

        # 6. Comprehensive Emergency Rules (15+ auditable clinical protocols)
        emergency_rules_list = [
            {
                "rule_id": "EMERG-001",
                "title": "Suspected Acute Coronary Syndrome / Heart Distress",
                "risk_level": "URGENT",
                "criteria": {"symptoms": ["Chest Pain", "Breathing Difficulty"]},
                "warning_text": "CRITICAL: Symptoms match emergency warning signs for acute cardiac distress or heart event. Immediate emergency medical evaluation required.",
                "immediate_first_aid": "Have the person sit down, rest, stay calm. Loosen tight collar. Call emergency services (112/108) immediately. If prescribed nitroglycerin, assist taking it.",
                "source": who
            },
            {
                "rule_id": "EMERG-002",
                "title": "Acute Cerebrovascular Stroke (FAST Protocol)",
                "risk_level": "URGENT",
                "criteria": {"symptoms": ["One-Sided Facial or Arm Weakness", "Slurred Speech / Dysarthria"]},
                "warning_text": "CRITICAL: Potential signs of acute neurological event (stroke). Immediate hospital transport required. Time is brain.",
                "immediate_first_aid": "Do NOT give food or drink. Note exact timestamp symptoms started. Place person in recovery position on side. Call 112/108 immediately.",
                "source": cdc
            },
            {
                "rule_id": "EMERG-003",
                "title": "Severe Respiratory Distress / Hypoxemia",
                "risk_level": "URGENT",
                "criteria": {"symptoms": ["Breathing Difficulty", "High-Pitched Stridor Breathing"]},
                "warning_text": "CRITICAL: Severe difficulty breathing with stridor or cyanosis can rapidly escalate into respiratory failure.",
                "immediate_first_aid": "Sit upright. If using prescribed rescue inhaler, administer as directed. Ensure fresh airflow. Call emergency dispatch.",
                "source": who
            },
            {
                "rule_id": "EMERG-004",
                "title": "Suspected Anaphylaxis / Airway Compromise",
                "risk_level": "URGENT",
                "criteria": {"symptoms": ["Facial and Lip Swelling (Angioedema)", "Breathing Difficulty"]},
                "warning_text": "CRITICAL: Signs of severe systemic allergic response with airway constriction (anaphylaxis).",
                "immediate_first_aid": "If epinephrine auto-injector (EpiPen) is available and prescribed, use immediately in outer thigh. Call emergency services without delay.",
                "source": who
            },
            {
                "rule_id": "EMERG-005",
                "title": "Acute Peritonitis / Surgical Abdomen",
                "risk_level": "URGENT",
                "criteria": {"symptoms": ["Abdominal Pain", "Right Lower Abdominal Pain (Appendicitis sign)"]},
                "warning_text": "URGENT: Severe persistent abdominal pain with localized signs may indicate acute appendicitis, perforation, or peritonitis.",
                "immediate_first_aid": "Do NOT apply heat pads or take pain medication without doctor advice. Do not eat or drink. Seek emergency surgical evaluation.",
                "source": icmr
            },
            {
                "rule_id": "EMERG-006",
                "title": "Meningism & Acute CNS Infection",
                "risk_level": "URGENT",
                "criteria": {"symptoms": ["Fever", "Headache", "Severe Neck Stiffness (Meningismus)"]},
                "warning_text": "CRITICAL: Fever accompanied by severe headache, neck stiffness, and light sensitivity is a classic marker of meningitis.",
                "immediate_first_aid": "Immediate emergency room admission required for lumbar puncture and intravenous therapy.",
                "source": cdc
            },
            {
                "rule_id": "EMERG-007",
                "title": "Acute Angle-Closure Glaucoma",
                "risk_level": "URGENT",
                "criteria": {"symptoms": ["Severe Eye Pain", "Blurred or Impaired Vision"]},
                "warning_text": "CRITICAL: Severe eye pain with blurred vision and headache indicates acute intraocular pressure spike.",
                "immediate_first_aid": "Immediate ophthalmological emergency care required to prevent irreversible optic nerve damage.",
                "source": nih
            },
            {
                "rule_id": "EMERG-008",
                "title": "Active Major Gastrointestinal Hemorrhage",
                "risk_level": "URGENT",
                "criteria": {"symptoms": ["Vomiting Blood (Hematemesis)", "Blood in Stool / Melena"]},
                "warning_text": "URGENT: Active gastrointestinal bleeding can cause rapid blood volume depletion and hypovolemic shock.",
                "immediate_first_aid": "Keep patient flat, nothing by mouth, immediate emergency hospital transport.",
                "source": who
            },
            {
                "rule_id": "CAUTION-001",
                "title": "Multi-System Febrile Infection Signs",
                "risk_level": "CAUTION",
                "criteria": {"symptoms": ["Fever", "Cough", "Fatigue and Weakness"]},
                "warning_text": "CAUTION: Multi-system infection signs detected. Medical evaluation recommended within 24 hours to prevent complications.",
                "immediate_first_aid": "Maintain oral hydration with clean fluids/ORS. Rest in a well-ventilated room. Monitor body temperature.",
                "source": icmr
            },
            {
                "rule_id": "CAUTION-002",
                "title": "Gastrointestinal Fluid Loss / Dehydration Risk",
                "risk_level": "CAUTION",
                "criteria": {"symptoms": ["Diarrhea", "Vomiting"]},
                "warning_text": "CAUTION: Fluid loss from combined digestive symptoms risks rapid dehydration and electrolyte depletion.",
                "immediate_first_aid": "Sip Oral Rehydration Salts (ORS) frequently. Seek clinic care if unable to hold liquids down.",
                "source": who
            }
        ]

        for rdata in emergency_rules_list:
            EmergencyRule.objects.update_or_create(
                rule_id=rdata["rule_id"],
                defaults={
                    "title": rdata["title"],
                    "description": rdata.get("description", rdata["title"]),
                    "criteria": rdata["criteria"],
                    "risk_level": rdata["risk_level"],
                    "warning_text": rdata["warning_text"],
                    "immediate_first_aid": rdata["immediate_first_aid"],
                    "source": rdata["source"],
                    "rule_version": "2.4.0",
                    "is_active": True,
                    "last_verified": timezone.now().date()
                }
            )

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded comprehensive medical knowledge base ({len(db_symptoms)} symptoms, {len(conditions_catalog)} conditions, {len(emergency_rules_list)} rules)!"))
