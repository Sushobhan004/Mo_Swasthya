import json
import hashlib
from django.test import TestCase
from swasthya_core.engines.sync_engine import SynchronizationEngine

class SynchronizationEngineTests(TestCase):
    def test_checksum_verification_and_application(self):
        payload = {
            "symptoms": [
                {"code": "TEST_SYM", "name": "Test Symptom", "common_names": "test", "body_system": "General", "is_emergency_flag": False}
            ]
        }
        payload_str = json.dumps(payload, sort_keys=True)
        valid_checksum = hashlib.sha256(payload_str.encode('utf-8')).hexdigest()

        pkg = {
            "package_version": 99,
            "previous_version": 18,
            "checksum": valid_checksum,
            "delta_payload": payload,
            "description": "Test delta sync package"
        }

        res = SynchronizationEngine.apply_delta_update(pkg)
        self.assertTrue(res["success"])
        self.assertEqual(res["package_version"], 99)

    def test_corrupted_package_rollback(self):
        """Tampered package must fail integrity check and preserve state."""
        payload = {"symptoms": [{"code": "CORRUPT", "name": "Corrupt"}]}
        pkg = {
            "package_version": 100,
            "previous_version": 18,
            "checksum": "0000000000000000000000000000000000000000000000000000000000000000",
            "delta_payload": payload
        }
        res = SynchronizationEngine.apply_delta_update(pkg)
        self.assertFalse(res["success"])
        self.assertEqual(res["action"], "ROLLBACK_APPLIED")
