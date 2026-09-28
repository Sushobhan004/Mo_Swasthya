from django.test import TestCase
from swasthya_core.engines.nlp_engine import NLPEngine

class NLPEngineTests(TestCase):
    def setUp(self):
        self.nlp = NLPEngine()

    def test_basic_symptom_extraction(self):
        text = "I have fever and headache since yesterday."
        res = self.nlp.parse(text)
        present_codes = [s["code"] for s in res["present_symptoms"]]
        self.assertIn("FEV", present_codes)
        self.assertIn("HDCH", present_codes)
        self.assertEqual(len(res["negated_symptoms"]), 0)
        self.assertEqual(res["duration"], "since yesterday")

    def test_negation_detection(self):
        """Must correctly isolate negated symptoms from present symptoms."""
        text = "I have high fever and severe cough, but I don't have breathing difficulty."
        res = self.nlp.parse(text)
        present_codes = [s["code"] for s in res["present_symptoms"]]
        negated_codes = [s["code"] for s in res["negated_symptoms"]]
        
        self.assertIn("FEV", present_codes)
        self.assertIn("COUGH", present_codes)
        self.assertIn("DYSP", negated_codes)
        self.assertNotIn("DYSP", present_codes)

    def test_spelling_correction(self):
        """1-character typo tolerance."""
        text = "fevr and hedache"
        res = self.nlp.parse(text)
        present_names = [s["name"] for s in res["present_symptoms"]]
        self.assertTrue(any("Fever" in n for n in present_names))
        self.assertTrue(any("Headache" in n for n in present_names))

    def test_duration_and_severity_extraction(self):
        text = "I have severe abdominal pain for 3 days."
        res = self.nlp.parse(text)
        self.assertEqual(res["severity"], "Severe")
        self.assertEqual(res["duration"], "3 days")

    def test_multisystem_organ_symptom_parsing(self):
        """Validates that various organ systems (cardiac, neuro, GI, renal, derm) are detected."""
        # Cardiac & Vascular
        res_cardiac = self.nlp.parse("Patient has crushing chest pain radiating to left arm with cold clammy skin")
        present_codes = [s["code"] for s in res_cardiac["present_symptoms"]]
        self.assertIn("CHSTP", present_codes)
        self.assertIn("CHEST_RAD", present_codes)
        self.assertIn("COLD_CLAMMY", present_codes)

        # Neurological / Stroke FAST
        res_stroke = self.nlp.parse("Sudden facial drooping and slurred speech with arm weakness")
        present_codes = [s["code"] for s in res_stroke["present_symptoms"]]
        self.assertIn("FACE_DROOP", present_codes)
        self.assertIn("SLUR_SPEECH", present_codes)

        # Renal / Urology
        res_renal = self.nlp.parse("Severe flank pain and burning urination with blood in urine")
        present_codes = [s["code"] for s in res_renal["present_symptoms"]]
        self.assertIn("FLANK_PAIN", present_codes)
        self.assertIn("DYSURIA", present_codes)
        self.assertIn("HEMATURIA", present_codes)

        # Gastrointestinal surgical
        res_gi = self.nlp.parse("Sharp pain in right lower belly and vomiting blood")
        present_codes = [s["code"] for s in res_gi["present_symptoms"]]
        self.assertIn("RLQ_PAIN", present_codes)
        self.assertIn("HEMATEMESIS", present_codes)

