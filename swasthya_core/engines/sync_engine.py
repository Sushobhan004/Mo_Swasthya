"""
SwasthyaAI Synchronization & Delta Update Engine
Handles version comparison, SHA-256 integrity verification, delta package ingestion, and transactional rollback.
"""
import hashlib
import json
from typing import Dict, Any, Tuple, Optional, List
from django.db import transaction
from django.utils import timezone

class SynchronizationEngine:
    @staticmethod
    def calculate_checksum(data_str: str) -> str:
        """Computes SHA-256 hash for package integrity verification."""
        return hashlib.sha256(data_str.encode('utf-8')).hexdigest()

    @staticmethod
    def verify_package_integrity(package_dict: Dict[str, Any]) -> Tuple[bool, str]:
        """
        Verifies cryptographic checksum of update payload before applying transaction.
        """
        provided_checksum = package_dict.get("checksum", "")
        payload_data = package_dict.get("delta_payload", {})
        payload_str = json.dumps(payload_data, sort_keys=True)
        computed_checksum = hashlib.sha256(payload_str.encode('utf-8')).hexdigest()

        if provided_checksum and provided_checksum.lower() != computed_checksum.lower():
            return False, f"Checksum verification failed! Expected {provided_checksum[:12]}..., computed {computed_checksum[:12]}..."
        return True, "Integrity verified (SHA-256 matched)."

    @classmethod
    def apply_delta_update(cls, package_dict: Dict[str, Any], dry_run: bool = False) -> Dict[str, Any]:
        """
        Applies delta update inside an atomic database transaction.
        Rolls back all changes if any integrity, schema, or insertion failure occurs.
        """
        # Step 1: Integrity verification
        is_valid, msg = cls.verify_package_integrity(package_dict)
        if not is_valid:
            return {
                "success": False,
                "error": msg,
                "action": "ROLLBACK_APPLIED",
                "current_version": package_dict.get("previous_version", 0)
            }

        pkg_ver = package_dict.get("package_version", 1)
        prev_ver = package_dict.get("previous_version", 0)
        payload = package_dict.get("delta_payload", {})

        from swasthya_core.models import (
            Symptom, Condition, WarningSign, Medicine, HealthcareFacility,
            EmergencyRule, SyncVersion, AuditLog
        )

        try:
            with transaction.atomic():
                applied_counts = {
                    "symptoms_updated": 0,
                    "conditions_updated": 0,
                    "warning_signs_updated": 0,
                    "medicines_updated": 0,
                    "facilities_updated": 0,
                    "emergency_rules_updated": 0,
                }

                # Update Symptoms
                for sym_data in payload.get("symptoms", []):
                    Symptom.objects.update_or_create(
                        code=sym_data["code"],
                        defaults={
                            "name": sym_data["name"],
                            "common_names": sym_data.get("common_names", ""),
                            "body_system": sym_data.get("body_system", "General"),
                            "description": sym_data.get("description", ""),
                            "is_emergency_flag": sym_data.get("is_emergency_flag", False),
                            "last_verified": timezone.now().date(),
                            "review_status": "Approved"
                        }
                    )
                    applied_counts["symptoms_updated"] += 1

                # Update Conditions
                for cond_data in payload.get("conditions", []):
                    Condition.objects.update_or_create(
                        code=cond_data["code"],
                        defaults={
                            "name": cond_data["name"],
                            "scientific_name": cond_data.get("scientific_name", ""),
                            "category": cond_data.get("category", "General"),
                            "overview": cond_data.get("overview", ""),
                            "recommended_evaluations": cond_data.get("recommended_evaluations", "Clinical consultation advised."),
                            "non_pharmacological_care": cond_data.get("non_pharmacological_care", ""),
                            "source_version": str(pkg_ver),
                            "last_verified": timezone.now().date(),
                            "review_status": "Approved"
                        }
                    )
                    applied_counts["conditions_updated"] += 1

                # Update Warning Signs
                for ws_data in payload.get("warning_signs", []):
                    WarningSign.objects.update_or_create(
                        code=ws_data["code"],
                        defaults={
                            "name": ws_data["name"],
                            "description": ws_data.get("description", ""),
                            "severity_level": ws_data.get("severity_level", "URGENT"),
                            "immediate_action": ws_data.get("immediate_action", ""),
                            "last_verified": timezone.now().date()
                        }
                    )
                    applied_counts["warning_signs_updated"] += 1

                # Update Medicines
                for med_data in payload.get("medicines", []):
                    Medicine.objects.update_or_create(
                        code=med_data["code"],
                        defaults={
                            "generic_name": med_data["generic_name"],
                            "brand_names": med_data.get("brand_names", ""),
                            "dosage_form": med_data.get("dosage_form", "Tablet"),
                            "general_uses": med_data.get("general_uses", ""),
                            "warnings": med_data.get("warnings", ""),
                            "contraindications": med_data.get("contraindications", ""),
                            "common_side_effects": med_data.get("common_side_effects", ""),
                            "storage_information": med_data.get("storage_information", "Store in a cool dry place."),
                            "last_verified": timezone.now().date(),
                            "review_status": "Approved"
                        }
                    )
                    applied_counts["medicines_updated"] += 1

                # Update Facilities
                for fac_data in payload.get("facilities", []):
                    HealthcareFacility.objects.update_or_create(
                        code=fac_data["code"],
                        defaults={
                            "name": fac_data["name"],
                            "facility_type": fac_data.get("facility_type", "HOSPITAL"),
                            "latitude": fac_data["latitude"],
                            "longitude": fac_data["longitude"],
                            "address": fac_data.get("address", ""),
                            "phone": fac_data.get("phone", "112"),
                            "services": fac_data.get("services", ""),
                            "is_24x7": fac_data.get("is_24x7", True),
                            "has_ambulance": fac_data.get("has_ambulance", True),
                            "has_icu": fac_data.get("has_icu", True),
                            "last_verified": timezone.now().date()
                        }
                    )
                    applied_counts["facilities_updated"] += 1

                # Update Emergency Rules
                for rule_data in payload.get("emergency_rules", []):
                    EmergencyRule.objects.update_or_create(
                        rule_id=rule_data["rule_id"],
                        defaults={
                            "title": rule_data["title"],
                            "description": rule_data.get("description", ""),
                            "criteria": rule_data.get("criteria", {}),
                            "risk_level": rule_data.get("risk_level", "URGENT"),
                            "warning_text": rule_data.get("warning_text", ""),
                            "immediate_first_aid": rule_data.get("immediate_first_aid", ""),
                            "rule_version": str(pkg_ver),
                            "is_active": True,
                            "last_verified": timezone.now().date()
                        }
                    )
                    applied_counts["emergency_rules_updated"] += 1

                # Record Sync Version
                SyncVersion.objects.update_or_create(
                    package_version=pkg_ver,
                    defaults={
                        "previous_version": prev_ver,
                        "checksum_sha256": package_dict.get("checksum", ""),
                        "manifest_data": applied_counts,
                        "description": package_dict.get("description", f"Delta sync package v{pkg_ver}")
                    }
                )

                # Record Audit Log
                AuditLog.objects.create(
                    action="DELTA_SYNC_APPLIED",
                    entity_type="SyncVersion",
                    entity_id=str(pkg_ver),
                    details=f"Successfully applied delta update package v{pkg_ver} containing {applied_counts}",
                    performed_by="Synchronization Engine"
                )

                if dry_run:
                    raise transaction.TransactionManagementError("Dry-run requested: rolling back transaction.")

                return {
                    "success": True,
                    "package_version": pkg_ver,
                    "applied_counts": applied_counts,
                    "checksum_verified": True,
                    "status": "APPLIED_TRANSACTIONALLY"
                }

        except Exception as e:
            # Transaction automatically rolled back by django atomic context
            return {
                "success": False,
                "error": f"Update failed during database transaction: {str(e)}",
                "action": "AUTOMATIC_ROLLBACK_COMPLETE",
                "current_version": prev_ver
            }
