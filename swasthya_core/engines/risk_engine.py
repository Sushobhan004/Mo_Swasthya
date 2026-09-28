"""
SwasthyaAI Auditable Risk & Safety Engine
Evaluates clinical red flags, vital warning signs, and risk tiers (LOW, CAUTION, URGENT).
"""
from typing import List, Dict, Any, Tuple, Optional

class RiskSafetyEngine:
    def __init__(self, custom_rules: Optional[List[Dict[str, Any]]] = None):
        self.rules = custom_rules or self._default_emergency_rules()

    def _default_emergency_rules(self) -> List[Dict[str, Any]]:
        return [
            {
                "rule_id": "EMERG-001",
                "title": "Suspected Acute Coronary Syndrome / Myocardial Infarction",
                "risk_level": "URGENT",
                "triggers_all": [],
                "triggers_any": [
                    ["Chest Pain", "Breathing Difficulty"],
                    ["Chest Pain", "Heart Palpitations"],
                    ["Chest Pain", "Dizziness"]
                ],
                "single_critical_symptoms": ["crushing chest pain"],
                "warning_message": "CRITICAL: Symptoms match warning signs for acute cardiac distress or heart event. Immediate emergency medical evaluation required.",
                "first_aid": "Have the person sit down, rest, stay calm. Loosen tight clothing. Call emergency services (112/108/911) immediately. If prescribed nitroglycerin, assist taking it."
            },
            {
                "rule_id": "EMERG-002",
                "title": "Stroke / Acute Neurological Deficit (FAST Protocol)",
                "risk_level": "URGENT",
                "triggers_all": [],
                "triggers_any": [
                    ["Numbness or Weakness", "Sudden Confusion"],
                    ["Numbness or Weakness", "Blurred Vision"],
                    ["Sudden Confusion", "Dizziness"]
                ],
                "single_critical_symptoms": ["facial drooping", "slurred speech", "unilateral arm weakness"],
                "warning_message": "CRITICAL: Potential signs of acute neurological event (stroke). Time is brain — immediate emergency hospital transport needed.",
                "first_aid": "Do NOT give food or drink. Note the exact time symptoms started. Place person in safe position. Call emergency services immediately."
            },
            {
                "rule_id": "EMERG-003",
                "title": "Severe Respiratory Compromise / Acute Hypoxemia",
                "risk_level": "URGENT",
                "triggers_all": ["Breathing Difficulty"],
                "severity_override": ["Severe"],
                "triggers_any": [
                    ["Breathing Difficulty", "Fatigue"],
                    ["Breathing Difficulty", "Dizziness"]
                ],
                "warning_message": "CRITICAL: Severe difficulty breathing can rapidly escalate into respiratory failure. Urgent medical attention is mandatory.",
                "first_aid": "Sit upright. If using prescribed rescue inhaler, administer as directed. Ensure fresh airflow. Call emergency assistance."
            },
            {
                "rule_id": "EMERG-004",
                "title": "Suspected Anaphylaxis / Severe Systemic Allergic Reaction",
                "risk_level": "URGENT",
                "triggers_all": [],
                "triggers_any": [
                    ["Skin Rash", "Breathing Difficulty"],
                    ["Skin Rash", "Difficulty Swallowing"],
                    ["Difficulty Swallowing", "Breathing Difficulty"]
                ],
                "warning_message": "CRITICAL: Signs of systemic allergic response with respiratory or airway involvement (anaphylaxis).",
                "first_aid": "If epinephrine auto-injector (EpiPen) is available and prescribed, use immediately in outer thigh. Call emergency services without delay."
            },
            {
                "rule_id": "EMERG-005",
                "title": "Acute Peritonitis / Severe Surgical Abdomen",
                "risk_level": "URGENT",
                "triggers_all": ["Abdominal Pain"],
                "severity_override": ["Severe"],
                "triggers_any": [
                    ["Abdominal Pain", "High Fever", "Vomiting"],
                    ["Abdominal Pain", "Vomiting", "Dizziness"]
                ],
                "warning_message": "URGENT: Severe persistent abdominal pain with systemic signs may indicate acute appendicitis, obstruction, or perforation.",
                "first_aid": "Do NOT apply heat pads or take pain medication without doctor advice. Do not eat or drink. Seek emergency surgical evaluation."
            },
            {
                "rule_id": "CAUTION-001",
                "title": "Persistent Febrile Illness or Multi-System Infection",
                "risk_level": "CAUTION",
                "triggers_all": ["Fever"],
                "triggers_any": [
                    ["Fever", "Cough", "Fatigue"],
                    ["Fever", "Sore Throat", "Headache"],
                    ["Fever", "Joint Pain", "Skin Rash"],
                    ["Fever", "Diarrhea", "Vomiting"]
                ],
                "warning_message": "CAUTION: Multi-system infection signs detected. Medical evaluation recommended within 24 hours to identify cause and prevent complications.",
                "first_aid": "Maintain oral hydration with clean fluids/ORS. Rest in a well-ventilated room. Monitor body temperature."
            },
            {
                "rule_id": "CAUTION-002",
                "title": "Severe Gastrointestinal Fluid Loss / Dehydration Risk",
                "risk_level": "CAUTION",
                "triggers_all": [],
                "triggers_any": [
                    ["Diarrhea", "Vomiting"],
                    ["Diarrhea", "Dizziness"],
                    ["Vomiting", "Dizziness"]
                ],
                "warning_message": "CAUTION: Fluid loss from combined gastrointestinal symptoms can cause rapid dehydration, electrolyte imbalance, or shock.",
                "first_aid": "Sip Oral Rehydration Salt (ORS) solution frequently. Avoid caffeinated drinks. Consult a clinician if inability to keep fluids down."
            }
        ]

    def evaluate(self, present_symptoms: List[Dict[str, Any]], duration: str = "", severity: str = "Unknown") -> Dict[str, Any]:
        """
        Evaluates observations against auditable safety rules.
        Returns safety assessment, risk level, triggered rules, and immediate advisory.
        """
        symptom_names = [s["name"] for s in present_symptoms]
        symptom_names_lower = [s.lower() for s in symptom_names]
        matched_texts = [s.get("matched_text", "").lower() for s in present_symptoms]

        triggered_rules = []
        highest_risk = "LOW"

        for rule in self.rules:
            is_triggered = False

            # Check single critical symptoms
            for crit in rule.get("single_critical_symptoms", []):
                if any(crit in mt for mt in matched_texts):
                    is_triggered = True
                    break

            # Check triggers_all with severity override
            if not is_triggered and rule.get("triggers_all"):
                if all(req in symptom_names for req in rule["triggers_all"]):
                    if rule.get("severity_override"):
                        if severity in rule["severity_override"]:
                            is_triggered = True
                    else:
                        is_triggered = True

            # Check triggers_any combinations
            if not is_triggered and rule.get("triggers_any"):
                for combo in rule["triggers_any"]:
                    if all(req in symptom_names for req in combo):
                        is_triggered = True
                        break

            if is_triggered:
                triggered_rules.append(rule)
                if rule["risk_level"] == "URGENT":
                    highest_risk = "URGENT"
                elif rule["risk_level"] == "CAUTION" and highest_risk != "URGENT":
                    highest_risk = "CAUTION"

        # If high severity was explicitly mentioned even if specific combo missed
        if highest_risk == "LOW" and severity == "Severe":
            highest_risk = "CAUTION"

        # Generate guidance text
        if highest_risk == "URGENT":
            summary = "URGENT MEDICAL ATTENTION MAY BE REQUIRED. Critical warning signs detected."
            action_guidance = "Proceed immediately to the nearest Emergency Department or call local emergency dispatch (112/108/911). Do not delay."
        elif highest_risk == "CAUTION":
            summary = "MODERATE CLINICAL CONCERN: Symptoms suggest an active condition that warrants timely medical consultation."
            action_guidance = "Schedule a consultation with a qualified doctor or healthcare clinic within 24 hours. Monitor for any worsening symptoms."
        else:
            summary = "INFORMATIONAL / ROUTINE SUPPORT: No critical red flags detected in the provided symptoms."
            action_guidance = "Rest, hydrate, and monitor symptoms. If symptoms worsen, new warning signs appear, or distress develops, seek professional medical care promptly."

        return {
            "risk_level": highest_risk,
            "is_emergency": highest_risk == "URGENT",
            "summary": summary,
            "action_guidance": action_guidance,
            "triggered_rules": [
                {
                    "rule_id": r["rule_id"],
                    "title": r["title"],
                    "risk_level": r["risk_level"],
                    "warning_message": r["warning_message"],
                    "first_aid": r.get("first_aid", "")
                } for r in triggered_rules
            ],
            "first_aid_protocols": [r.get("first_aid", "") for r in triggered_rules if r.get("first_aid")],
            "disclaimer": "SwasthyaAI is an offline medical information & decision-support system. It is NOT a doctor and does not make definitive medical diagnoses or autonomous prescriptions."
        }
