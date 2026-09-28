from django.test import TestCase
from swasthya_core.engines.risk_engine import RiskSafetyEngine

class RiskSafetyEngineTests(TestCase):
    def setUp(self):
        self.risk_engine = RiskSafetyEngine()

    def test_emergency_red_flag_acs(self):
        """Chest Pain + Breathing Difficulty must trigger URGENT."""
        symptoms = [
            {"code": "CHSTP", "name": "Chest Pain", "matched_text": "crushing chest pain"},
            {"code": "DYSP", "name": "Breathing Difficulty", "matched_text": "shortness of breath"}
        ]
        res = self.risk_engine.evaluate(symptoms, duration="1 hour", severity="Severe")
        self.assertEqual(res["risk_level"], "URGENT")
        self.assertTrue(res["is_emergency"])
        self.assertIn("URGENT", res["summary"])

    def test_caution_febrile_illness(self):
        """Fever + Cough + Fatigue triggers CAUTION."""
        symptoms = [
            {"code": "FEV", "name": "Fever", "matched_text": "fever"},
            {"code": "COUGH", "name": "Cough", "matched_text": "cough"},
            {"code": "FATIG", "name": "Fatigue", "matched_text": "tired"}
        ]
        res = self.risk_engine.evaluate(symptoms, duration="2 days", severity="Moderate")
        self.assertEqual(res["risk_level"], "CAUTION")
        self.assertFalse(res["is_emergency"])

    def test_routine_low_risk(self):
        """Single mild symptom returns LOW/INFORMATIONAL."""
        symptoms = [
            {"code": "FATIG", "name": "Fatigue", "matched_text": "feeling tired"}
        ]
        res = self.risk_engine.evaluate(symptoms, duration="1 day", severity="Mild")
        self.assertEqual(res["risk_level"], "LOW")
        self.assertFalse(res["is_emergency"])
