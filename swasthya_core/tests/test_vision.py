import io
from PIL import Image
from django.test import TestCase
from swasthya_core.engines.vision_engine import MedicalVisionEngine

class MedicalVisionEngineTests(TestCase):
    def setUp(self):
        self.vision = MedicalVisionEngine()

    def test_unsupported_task_rejection(self):
        img = Image.new('RGB', (200, 200), color=(120, 120, 120))
        buf = io.BytesIO()
        img.save(buf, format='JPEG')
        res = self.vision.analyze(buf.getvalue(), task="unsupported_brain_mri")
        self.assertEqual(res["status"], "UNSUPPORTED")

    def test_adequate_quality_screening(self):
        # Create patterned synthetic image with high gradient variance
        img = Image.new('RGB', (224, 224), color=(180, 100, 90))
        for x in range(50, 150):
            for y in range(50, 150):
                img.putpixel((x, y), (50, 30, 20))
        buf = io.BytesIO()
        img.save(buf, format='JPEG')
        
        res = self.vision.analyze(buf.getvalue(), task="skin_lesion")
        self.assertEqual(res["status"], "SUCCESS")
        self.assertIn("confidence_score", res)
        self.assertIn("findings_summary", res)
