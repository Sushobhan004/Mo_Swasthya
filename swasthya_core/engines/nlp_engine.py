"""
SwasthyaAI Local NLP & Negation Engine
Offline-capable Natural Language Processing pipeline for medical symptom extraction.
"""
import re
import math
from typing import List, Dict, Any, Tuple, Optional

class NLPEngine:
    def __init__(self, vocabulary_symptoms: Optional[List[Dict[str, Any]]] = None):
        self.negation_cues = [
            "no", "not", "don't have", "dont have", "does not have", "doesn't have",
            "without", "denies", "denied", "free of", "never had", "negative for",
            "neither", "nor", "rule out", "ruled out", "no signs of", "no history of"
        ]
        self.pseudo_negations = [
            "no doubt", "not only", "without doubt", "no wonder"
        ]
        self.severity_terms = {
            "mild": "Mild", "slight": "Mild", "low grade": "Mild", "little": "Mild",
            "moderate": "Moderate", "medium": "Moderate", "uncomfortable": "Moderate",
            "severe": "Severe", "intense": "Severe", "high": "Severe", "extreme": "Severe",
            "unbearable": "Severe", "acute": "Severe", "very high": "Severe", "crushing": "Severe"
        }
        self.duration_patterns = [
            r'(\d+)\s*(days|day|d)\b',
            r'(\d+)\s*(hours|hour|hrs|hr|h)\b',
            r'(\d+)\s*(weeks|week|wks|wk)\b',
            r'(\d+)\s*(months|month|mos|mo)\b',
            r'(since\s+yesterday)',
            r'(since\s+morning)',
            r'(since\s+last\s+night)',
            r'(just\s+started)',
            r'(few\s+days)',
            r'(couple\s+of\s+days)'
        ]
        self.body_parts = [
            "chest", "head", "throat", "abdomen", "stomach", "back", "neck",
            "shoulder", "arm", "leg", "eye", "ear", "skin", "joint", "wrist", "knee"
        ]
        # Canonical dictionary of symptoms (with synonyms)
        self.symptom_dictionary = vocabulary_symptoms or self._load_dynamic_symptoms() or self._default_symptoms()

    def _load_dynamic_symptoms(self) -> Optional[List[Dict[str, Any]]]:
        """Attempts to load symptom vocabulary directly from the Django database if available."""
        try:
            from swasthya_core.models import Symptom
            symptoms = Symptom.objects.all()
            if symptoms.exists():
                vocab = []
                for sym in symptoms:
                    syns = sym.synonyms if isinstance(sym.synonyms, list) else []
                    syns.append(sym.name.lower())
                    vocab.append({
                        "code": sym.code,
                        "name": sym.name,
                        "category": sym.category,
                        "synonyms": list(set([s.strip().lower() for s in syns if s]))
                    })
                return vocab
        except Exception:
            pass
        return None

    def _default_symptoms(self) -> List[Dict[str, Any]]:
        return [
            # 1. Systemic / General
            {"code": "FEV", "name": "Fever", "category": "General", "synonyms": ["fever", "high temperature", "pyrexia", "feeling hot", "feverish", "high fever", "elevated temperature"]},
            {"code": "CHILLS", "name": "Chills and Rigors", "category": "General", "synonyms": ["chills", "rigors", "shivering", "feeling cold", "teeth chattering", "cold sweats"]},
            {"code": "FATIG", "name": "Fatigue and Malaise", "category": "General", "synonyms": ["fatigue", "tiredness", "exhaustion", "weakness", "lethargy", "loss of energy", "drowsiness", "malaise", "feeling drained"]},
            {"code": "NIGHT_SWEATS", "name": "Drenching Night Sweats", "category": "General", "synonyms": ["night sweats", "waking up sweating", "sweating at night", "nocturnal sweating", "drenched in sweat"]},
            {"code": "WEIGHT_LOSS", "name": "Unexplained Weight Loss", "category": "General", "synonyms": ["weight loss", "losing weight", "rapid weight loss", "unintentional weight loss", "clothes getting loose"]},
            {"code": "POLYURIA_DIPS", "name": "Excessive Thirst and Urination", "category": "Endocrine", "synonyms": ["excessive thirst", "frequent urination", "polydipsia", "polyuria", "drinking too much water", "peeing constantly"]},
            {"code": "COLD_HEAT_INTOL", "name": "Cold / Heat Intolerance", "category": "Endocrine", "synonyms": ["cold intolerance", "heat intolerance", "sensitive to cold", "sensitive to heat", "always cold", "always hot"]},
            {"code": "DIFF_SWAL", "name": "Difficulty Swallowing (Dysphagia)", "category": "General", "synonyms": ["difficulty swallowing", "dysphagia", "cannot swallow", "food sticking in throat", "painful swallowing"]},
            {"code": "SWOLLEN_LN", "name": "Swollen Lymph Nodes", "category": "General", "synonyms": ["swollen lymph nodes", "swollen glands", "lumps in neck", "swollen neck glands", "lymphadenopathy", "tender lump in armpit"]},
            
            # 2. Neurological & Head
            {"code": "HDCH", "name": "Headache", "category": "Neurological", "synonyms": ["headache", "head pain", "throbbing head", "migraine", "pain in head", "cephalalgia", "frontal headache", "temple pain"]},
            {"code": "DIZZ", "name": "Dizziness and Vertigo", "category": "Neurological", "synonyms": ["dizziness", "lightheadedness", "fainting feeling", "vertigo", "spinning sensation", "loss of balance", "wooziness", "head spinning"]},
            {"code": "SYNCOPE", "name": "Fainting / Loss of Consciousness", "category": "Neurological", "synonyms": ["fainting", "passed out", "blacked out", "loss of consciousness", "syncope", "collapsed", "swooned"]},
            {"code": "SEIZURE", "name": "Convulsions / Seizures", "category": "Neurological", "synonyms": ["seizure", "convulsion", "fits", "epileptic fit", "shaking uncontrollably", "involuntary jerking", "loss of awareness"]},
            {"code": "NUMB", "name": "Numbness or Tingling", "category": "Neurological", "synonyms": ["numbness", "tingling", "pins and needles", "paresthesia", "loss of sensation", "asleep limb", "dead feeling in fingers"]},
            {"code": "HEMIPARESIS", "name": "One-Sided Limb Weakness", "category": "Neurological", "synonyms": ["weakness on one side", "arm weakness", "leg weakness", "hemiparesis", "cannot lift arm", "dragging leg"]},
            {"code": "FACE_DROOP", "name": "Facial Drooping / Asymmetry", "category": "Neurological", "synonyms": ["facial drooping", "drooping face", "crooked smile", "one side of face falling", "facial weakness", "mouth drooping"]},
            {"code": "SLUR_SPEECH", "name": "Slurred Speech (Dysarthria)", "category": "Neurological", "synonyms": ["slurred speech", "difficulty speaking", "garbled words", "cannot talk properly", "dysarthria", "jumbled speech"]},
            {"code": "SUDDEN_CONF", "name": "Sudden Confusion / Delirium", "category": "Neurological", "synonyms": ["confusion", "disorientation", "altered mental state", "delirium", "brain fog", "dazed", "not making sense"]},
            {"code": "TREMOR", "name": "Tremors / Involuntary Shaking", "category": "Neurological", "synonyms": ["tremor", "shaking hands", "trembling fingers", "hand tremor", "quivering hands", "involuntary twitching"]},
            {"code": "NECK_STIFF", "name": "Stiff Neck (Nuchal Rigidity)", "category": "Neurological", "synonyms": ["stiff neck", "nuchal rigidity", "cannot touch chin to chest", "neck stiffness with fever", "rigid neck"]},
            
            # 3. Cardiovascular
            {"code": "CHSTP", "name": "Chest Pain / Pressure", "category": "Cardiovascular", "synonyms": ["chest pain", "chest pressure", "tightness in chest", "chest discomfort", "heaviness in chest", "crushing chest pain", "substernal pain", "elephant on chest"]},
            {"code": "CHEST_RAD", "name": "Chest Pain Radiating to Arm/Jaw/Back", "category": "Cardiovascular", "synonyms": ["pain radiating to left arm", "pain radiating to jaw", "pain in left shoulder and chest", "chest pain moving to back"]},
            {"code": "PALP", "name": "Heart Palpitations", "category": "Cardiovascular", "synonyms": ["palpitations", "racing heartbeat", "fluttering heart", "rapid pulse", "irregular heartbeat", "heart pounding", "skipped beats"]},
            {"code": "PEDAL_EDEMA", "name": "Swelling in Legs and Ankles (Edema)", "category": "Cardiovascular", "synonyms": ["swollen ankles", "leg swelling", "swollen feet", "pedal edema", "puffy legs", "fluid in feet", "pitting edema"]},
            {"code": "CYANOSIS", "name": "Bluish Discoloration (Cyanosis)", "category": "Cardiovascular", "synonyms": ["bluish skin", "blue lips", "cyanosis", "blue fingers", "purple lips", "bluish tongue", "lack of oxygen color"]},
            {"code": "ORTHOPNEA", "name": "Breathing Difficulty when Lying Flat", "category": "Cardiovascular", "synonyms": ["orthopnea", "cannot sleep flat", "need extra pillows to breathe", "short of breath lying down"]},
            {"code": "COLD_CLAMMY", "name": "Cold Clammy Skin and Diaphoresis", "category": "Cardiovascular", "synonyms": ["cold clammy skin", "profuse cold sweating", "diaphoresis", "clamminess", "sweaty pale skin"]},
            
            # 4. Respiratory
            {"code": "DYSP", "name": "Shortness of Breath (Dyspnea)", "category": "Respiratory", "synonyms": ["breathing difficulty", "shortness of breath", "dyspnea", "hard to breathe", "breathlessness", "trouble breathing", "suffocating", "winded"]},
            {"code": "COUGH", "name": "Cough", "category": "Respiratory", "synonyms": ["cough", "coughing", "dry cough", "persistent cough", "hacking cough", "barking cough"]},
            {"code": "PROD_COUGH", "name": "Productive / Phlegm Cough", "category": "Respiratory", "synonyms": ["cough with phlegm", "mucus cough", "wet cough", "green phlegm", "yellow mucus", "productive cough", "expectoration"]},
            {"code": "HEMOPTYSIS", "name": "Coughing Up Blood (Hemoptysis)", "category": "Respiratory", "synonyms": ["coughing up blood", "blood in sputum", "hemoptysis", "blood tinged phlegm", "coughing blood"]},
            {"code": "WHEEZE", "name": "Wheezing / Whistling Breath", "category": "Respiratory", "synonyms": ["wheezing", "whistling breath", "noisy breathing", "musical sound when breathing", "tight chest wheeze"]},
            {"code": "STRIDOR", "name": "High-Pitched Harsh Breathing (Stridor)", "category": "Respiratory", "synonyms": ["stridor", "high pitched breathing", "crowing breath", "gasping noise", "upper airway obstruction"]},
            {"code": "PLEURITIC_P", "name": "Sharp Pain on Deep Inhalation", "category": "Respiratory", "synonyms": ["pleuritic pain", "sharp chest pain when breathing", "pain on deep breath", "stabbing rib pain breathing"]},
            
            # 5. Gastrointestinal
            {"code": "ABDP", "name": "Abdominal Pain", "category": "Gastrointestinal", "synonyms": ["abdominal pain", "stomach ache", "belly pain", "cramps in stomach", "gut pain", "pain in abdomen", "tummy ache"]},
            {"code": "EPIGASTRIC_P", "name": "Upper Abdominal Burning / Heartburn", "category": "Gastrointestinal", "synonyms": ["heartburn", "acid reflux", "burning in stomach", "epigastric pain", "indigestion", "acidity", "sour burps", "gerd"]},
            {"code": "RUQ_PAIN", "name": "Right Upper Quadrant Abdominal Pain", "category": "Gastrointestinal", "synonyms": ["pain under right ribs", "right upper belly pain", "liver area pain", "gallbladder pain", "ruq pain"]},
            {"code": "RLQ_PAIN", "name": "Right Lower Quadrant Pain (Appendicitis)", "category": "Gastrointestinal", "synonyms": ["pain in right lower belly", "right lower abdomen pain", "appendix pain", "rlq pain", "rebound tenderness in right groin"]},
            {"code": "RIGID_ABD", "name": "Board-like Rigid Abdomen", "category": "Gastrointestinal", "synonyms": ["hard rigid abdomen", "board like stomach", "severe belly guarding", "cannot touch stomach", "peritonitis signs"]},
            {"code": "NAUS", "name": "Nausea", "category": "Gastrointestinal", "synonyms": ["nausea", "feeling sick", "queasy", "upset stomach", "vomiting feeling", "bilious feeling"]},
            {"code": "VOMIT", "name": "Vomiting", "category": "Gastrointestinal", "synonyms": ["vomiting", "threw up", "throwing up", "emesis", "puking", "cannot keep food down"]},
            {"code": "HEMATEMESIS", "name": "Vomiting Blood / Coffee-Ground Emesis", "category": "Gastrointestinal", "synonyms": ["vomiting blood", "coffee ground vomiting", "hematemesis", "blood in throw up", "black vomitus"]},
            {"code": "DIARR", "name": "Diarrhea", "category": "Gastrointestinal", "synonyms": ["diarrhea", "loose stools", "loose motions", "watery stool", "frequent bowel movements", "runny stomach"]},
            {"code": "MELENA", "name": "Black Tarry Stools (Melena)", "category": "Gastrointestinal", "synonyms": ["black stools", "tarry stools", "melena", "dark black poop", "blood in stool dark"]},
            {"code": "HEMATOCHEZIA", "name": "Fresh Red Blood in Stool", "category": "Gastrointestinal", "synonyms": ["blood in stool", "red blood when wiping", "rectal bleeding", "hematochezia", "bleeding from rectum"]},
            {"code": "CONSTIP", "name": "Severe Constipation / Obstipation", "category": "Gastrointestinal", "synonyms": ["constipation", "cannot pass stool", "no bowel movement", "obstipation", "hard dry stools", "straining for stool"]},
            {"code": "JAUNDICE", "name": "Yellow Skin and Eyes (Jaundice)", "category": "Gastrointestinal", "synonyms": ["yellow eyes", "yellow skin", "jaundice", "dark yellow urine", "icterus", "yellow sclera"]},
            {"code": "BLOATING", "name": "Abdominal Distension / Bloating", "category": "Gastrointestinal", "synonyms": ["bloating", "swollen belly", "gas distension", "tympanites", "feeling overly full"]},
            
            # 6. Musculoskeletal
            {"code": "JOINT_PAIN", "name": "Joint Pain (Arthralgia)", "category": "Musculoskeletal", "synonyms": ["joint pain", "arthralgia", "knee pain", "elbow pain", "stiff joints", "hurting joints", "finger joint pain"]},
            {"code": "JOINT_SWELL", "name": "Swollen Warm Joint (Arthritis)", "category": "Musculoskeletal", "synonyms": ["swollen joint", "red warm joint", "joint effusion", "swelling in knee", "inflamed joint", "hot joint"]},
            {"code": "BACK_PAIN", "name": "Lower Back Pain", "category": "Musculoskeletal", "synonyms": ["lower back pain", "lumbar pain", "lumbago", "backache", "pain in spine", "strained back"]},
            {"code": "SCIATICA", "name": "Shooting Leg Pain (Sciatica)", "category": "Musculoskeletal", "synonyms": ["sciatica", "shooting pain down leg", "nerve pain in buttock", "electric shock sensation in leg", "radiculopathy"]},
            {"code": "MUSCLE_PAIN", "name": "Muscle Aches (Myalgia)", "category": "Musculoskeletal", "synonyms": ["muscle ache", "body ache", "myalgia", "sore muscles", "muscle tenderness", "generalized aching"]},
            {"code": "MUSCLE_CRAMP", "name": "Muscle Spasms and Cramps", "category": "Musculoskeletal", "synonyms": ["muscle cramps", "muscle spasms", "charley horse", "painful contractions", "tetany"]},
            
            # 7. Dermatology & Allergy
            {"code": "RASH", "name": "Skin Rash / Erythema", "category": "Dermatology", "synonyms": ["skin rash", "rash", "red spots", "hives", "erythema", "lesion", "skin redness", "skin eruption", "maculopapular rash"]},
            {"code": "PRURITUS", "name": "Severe Skin Itching (Pruritus)", "category": "Dermatology", "synonyms": ["itchy skin", "itching", "pruritus", "scratching uncontrollably", "severe itch"]},
            {"code": "ANGIOEDEMA", "name": "Lip, Tongue, and Facial Swelling", "category": "Dermatology", "synonyms": ["swollen lips", "swollen tongue", "swollen face", "angioedema", "puffy eyelids", "facial swelling allergic"]},
            {"code": "PETECHIAE", "name": "Tiny Red/Purple Spots (Petechiae/Purpura)", "category": "Dermatology", "synonyms": ["petechiae", "purpura", "purple spots on skin", "non-blanching rash", "pinpoint red dots on skin"]},
            {"code": "SKIN_ULCER", "name": "Skin Ulcer / Non-Healing Wound", "category": "Dermatology", "synonyms": ["skin ulcer", "open sore", "non healing wound", "bedsore", "diabetic foot ulcer", "skin lesion with pus"]},
            {"code": "BLISTERS", "name": "Skin Blisters / Bullae", "category": "Dermatology", "synonyms": ["blisters", "fluid filled bumps", "bullae", "vesicles", "skin peeling in sheets", "burn blisters"]},
            
            # 8. Renal & Urological
            {"code": "DYSURIA", "name": "Painful / Burning Urination", "category": "Urological", "synonyms": ["painful urination", "burning urination", "dysuria", "stinging urine", "burning pee", "pain when peeing"]},
            {"code": "HEMATURIA", "name": "Blood in Urine (Hematuria)", "category": "Urological", "synonyms": ["blood in urine", "pink urine", "cola colored urine", "red pee", "hematuria"]},
            {"code": "FLANK_PAIN", "name": "Severe Flank / Kidney Pain", "category": "Urological", "synonyms": ["flank pain", "kidney pain", "pain in side and back", "renal colic", "loins pain", "kidney stone pain"]},
            {"code": "URGENCY_FREQ", "name": "Urinary Urgency and Frequency", "category": "Urological", "synonyms": ["frequent urination", "urgent need to pee", "peeing very often", "nocturia", "cannot hold urine"]},
            {"code": "ANURIA", "name": "No Urine Output (Anuria/Oliguria)", "category": "Urological", "synonyms": ["no urine output", "cannot pee at all", "anuria", "oliguria", "stopped passing urine", "scanty urine"]},
            
            # 9. ENT, Eyes & Oral
            {"code": "SORE_THR", "name": "Sore Throat (Pharyngitis)", "category": "ENT", "synonyms": ["sore throat", "throat pain", "scratchy throat", "pain swallowing", "pharyngitis", "raw throat", "tonsillitis"]},
            {"code": "RHINORRHEA", "name": "Runny Nose / Congestion", "category": "ENT", "synonyms": ["runny nose", "blocked nose", "nasal congestion", "stuffy nose", "sneezing", "coryza", "sniffling"]},
            {"code": "ANOSMIA", "name": "Loss of Smell or Taste (Anosmia/Ageusia)", "category": "ENT", "synonyms": ["loss of smell", "loss of taste", "cannot taste food", "anosmia", "ageusia", "no smell"]},
            {"code": "EAR_PAIN", "name": "Ear Pain (Otalgia) / Discharge", "category": "ENT", "synonyms": ["ear pain", "earache", "otalgia", "fluid leaking from ear", "plugged ear", "ear discharge"]},
            {"code": "TINNITUS", "name": "Ringing in Ears (Tinnitus)", "category": "ENT", "synonyms": ["ringing in ears", "tinnitus", "buzzing in ear", "high pitch sound in ear", "hissing in ears"]},
            {"code": "EPISTAXIS", "name": "Nosebleed (Epistaxis)", "category": "ENT", "synonyms": ["nosebleed", "bleeding from nose", "epistaxis", "bloody nose"]},
            {"code": "EYE_PAIN", "name": "Severe Eye Pain", "category": "Ophthalmology", "synonyms": ["eye pain", "orbital pain", "aching in eye", "severe pain in eyeball", "sharp eye pain"]},
            {"code": "BLUR_VIS", "name": "Blurred or Double Vision", "category": "Ophthalmology", "synonyms": ["blurred vision", "double vision", "dim vision", "diplopia", "cloudy eyesight", "cannot see clearly"]},
            {"code": "VIS_LOSS", "name": "Sudden Vision Loss / Darkness", "category": "Ophthalmology", "synonyms": ["sudden vision loss", "blind spot", "cannot see out of one eye", "curtain coming over eye", "blackout in eye"]},
            {"code": "PHOTOPHOBIA", "name": "Extreme Sensitivity to Light (Photophobia)", "category": "Ophthalmology", "synonyms": ["light sensitivity", "photophobia", "eyes hurt with light", "cannot look at bright lights", "squinting in light"]},
            {"code": "RED_EYE", "name": "Red Eye / Conjunctival Congestion", "category": "Ophthalmology", "synonyms": ["red eye", "bloodshot eyes", "pink eye", "conjunctivitis", "watery red eyes", "crusty eye discharge"]},
            
            # 10. Mental & Psychiatric
            {"code": "ANX", "name": "Severe Anxiety / Panic", "category": "Psychiatric", "synonyms": ["anxiety", "panic attack", "restlessness", "feeling nervous", "trembling with fear", "sense of impending doom"]},
            {"code": "INSOMNIA", "name": "Severe Insomnia / Sleep Disruption", "category": "Psychiatric", "synonyms": ["insomnia", "cannot sleep", "waking up constantly", "sleeplessness", "sleep disturbance"]},
            {"code": "DEPR_MOOD", "name": "Persistent Low Mood / Anhedonia", "category": "Psychiatric", "synonyms": ["feeling depressed", "hopelessness", "persistent sadness", "loss of interest", "crying spells", "depressed mood"]},
            {"code": "HALLUCIN", "name": "Hallucinations / Psychosis", "category": "Psychiatric", "synonyms": ["hallucinations", "hearing voices", "seeing things not there", "paranoia", "delusions", "psychosis"]}
        ]

    def normalize_text(self, text: str) -> str:
        """Lowercases, expands contractions, cleans punctuation."""
        text = text.lower()
        contractions = {
            "can't": "cannot", "won't": "will not", "n't": " not",
            "'re": " are", "'s": " is", "'d": " would",
            "'ll": " will", "'ve": " have", "'m": " am"
        }
        for k, v in contractions.items():
            text = text.replace(k, v)
        text = re.sub(r'[^\w\s\.\,\;\-]', ' ', text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def levenshtein_distance(self, s1: str, s2: str) -> int:
        """Calculates edit distance for spelling correction."""
        if len(s1) < len(s2):
            return self.levenshtein_distance(s2, s1)
        if len(s2) == 0:
            return len(s1)
        previous_row = range(len(s2) + 1)
        for i, c1 in enumerate(s1):
            current_row = [i + 1]
            for j, c2 in enumerate(s2):
                insertions = previous_row[j + 1] + 1
                deletions = current_row[j] + 1
                substitutions = previous_row[j] + (c1 != c2)
                current_row.append(min(insertions, deletions, substitutions))
            previous_row = current_row
        return previous_row[-1]

    def extract_duration(self, text: str) -> str:
        """Extracts temporal duration statements."""
        for pattern in self.duration_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(0).strip()
        return "Not specified"

    def extract_severity(self, text: str) -> str:
        """Extracts stated severity qualifiers."""
        norm = text.lower()
        for term, level in self.severity_terms.items():
            if re.search(r'\b' + re.escape(term) + r'\b', norm):
                return level
        return "Unknown"

    def extract_body_parts(self, text: str) -> List[str]:
        """Extracts referenced anatomical locations."""
        found = []
        norm = text.lower()
        for part in self.body_parts:
            if re.search(r'\b' + re.escape(part) + r'\b', norm):
                found.append(part.capitalize())
        return list(set(found))

    def _is_negated_context(self, text: str, start_pos: int, window_chars: int = 40) -> bool:
        """
        Checks if the symptom occurrence at start_pos is preceded by a negation cue
        within the scope window and without a clause-terminating boundary (e.g. 'but', ';', '.').
        """
        preceding = text[max(0, start_pos - window_chars):start_pos].lower()
        
        # Check for clause boundaries that reset negation
        clause_breakers = [", but", ". but", "; but", " but ", " however ", " although ", " yet ", ". ", "; "]
        for breaker in clause_breakers:
            if breaker in preceding:
                preceding = preceding.split(breaker)[-1]

        # Check for pseudo-negations
        for pseudo in self.pseudo_negations:
            if pseudo in preceding:
                return False

        for cue in self.negation_cues:
            pattern = r'\b' + re.escape(cue) + r'\b'
            if re.search(pattern, preceding):
                return True
        return False

    def parse(self, raw_input: str) -> Dict[str, Any]:
        """
        Main NLP pipeline: Extracts present symptoms, negated symptoms, duration,
        severity, and body location without any external API calls.
        """
        clean_text = self.normalize_text(raw_input)
        present_symptoms = []
        negated_symptoms = []
        matched_spans = []

        # 1. Exact & phrase matching on synonyms
        for item in self.symptom_dictionary:
            code = item["code"]
            canonical_name = item["name"]
            synonyms = item.get("synonyms", [canonical_name])

            # Sort synonyms by length descending to match longest phrases first
            sorted_synonyms = sorted(synonyms, key=len, reverse=True)
            for syn in sorted_synonyms:
                syn_norm = self.normalize_text(syn)
                pattern = r'\b' + re.escape(syn_norm) + r'\b'
                for match in re.finditer(pattern, clean_text):
                    span = (match.start(), match.end())
                    # Check if already covered by an overlapping longer match
                    if any(s[0] <= span[0] and s[1] >= span[1] for s in matched_spans):
                        continue
                    
                    is_neg = self._is_negated_context(clean_text, match.start())
                    entry = {
                        "code": code,
                        "name": canonical_name,
                        "matched_text": match.group(0),
                        "negated": is_neg
                    }
                    if is_neg:
                        if not any(n["code"] == code for n in negated_symptoms):
                            negated_symptoms.append(entry)
                    else:
                        if not any(p["code"] == code for p in present_symptoms):
                            present_symptoms.append(entry)
                    matched_spans.append(span)

        # 2. Fuzzy spelling correction for unmatched words if no present symptom found
        if not present_symptoms and not negated_symptoms:
            tokens = re.findall(r'\b[a-z]{4,}\b', clean_text)
            for token in tokens:
                for item in self.symptom_dictionary:
                    for syn in item.get("synonyms", []):
                        if len(syn.split()) == 1 and abs(len(token) - len(syn)) <= 2:
                            dist = self.levenshtein_distance(token, syn.lower())
                            if dist == 1: # 1 character typo
                                entry = {
                                    "code": item["code"],
                                    "name": item["name"],
                                    "matched_text": f"{token} (corrected to {syn})",
                                    "negated": False,
                                    "spelling_corrected": True
                                }
                                if not any(p["code"] == item["code"] for p in present_symptoms):
                                    present_symptoms.append(entry)

        duration = self.extract_duration(raw_input)
        severity = self.extract_severity(raw_input)
        body_parts = self.extract_body_parts(raw_input)

        return {
            "raw_input": raw_input,
            "cleaned_text": clean_text,
            "present_symptoms": present_symptoms,
            "negated_symptoms": negated_symptoms,
            "duration": duration,
            "severity": severity,
            "body_parts": body_parts,
            "symptom_count": len(present_symptoms)
        }
