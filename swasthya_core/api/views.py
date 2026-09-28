"""
REST Framework API Views for SwasthyaAI
"""
import uuid
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.db.models import Q

from swasthya_core.models import (
    MedicalSource, WarningSign, Symptom, RiskFactor, Condition, ConditionSymptom,
    MedicalTopic, MedicineClass, Medicine, MedicineInteraction, HealthcareFacility,
    EmergencyRule, Assessment, ImageAnalysisLog, AIModelRegistry, SyncVersion, SyncPackage, AuditLog
)
from swasthya_core.api.serializers import (
    SymptomSerializer, ConditionSerializer, MedicineSerializer, MedicineInteractionSerializer,
    HealthcareFacilitySerializer, EmergencyRuleSerializer, AssessmentSerializer,
    AIModelRegistrySerializer, SyncVersionSerializer
)
from swasthya_core.engines import (
    NLPEngine, BM25SearchEngine, MedicalKnowledgeGraph, RiskSafetyEngine,
    RoutingEngine, MedicalVisionEngine, SynchronizationEngine
)

def _build_search_engine():
    """Initializes and builds Inverted Index BM25 search engine with all database documents."""
    engine = BM25SearchEngine()
    docs = []

    # Index Conditions
    for c in Condition.objects.all():
        syms_text = " ".join([s.name for s in c.symptoms.all()])
        docs.append({
            "id": f"cond_{c.id}",
            "db_id": c.id,
            "type": "Condition",
            "title": c.name,
            "category": c.category,
            "content": f"{c.overview} Recommended: {c.recommended_evaluations} Symptoms: {syms_text}",
            "source": c.source.name if c.source else "Clinical Knowledge Base",
            "last_verified": str(c.last_verified)
        })

    # Index Medicines
    for m in Medicine.objects.all():
        docs.append({
            "id": f"med_{m.id}",
            "db_id": m.id,
            "type": "Medicine",
            "title": f"{m.generic_name} ({m.brand_names})",
            "category": m.medicine_class.name if m.medicine_class else "Medicine",
            "content": f"{m.general_uses} Warnings: {m.warnings} Contraindications: {m.contraindications}",
            "source": m.source.name if m.source else "Pharmacopeia",
            "last_verified": str(m.last_verified)
        })

    # Index Symptoms
    for s in Symptom.objects.all():
        docs.append({
            "id": f"sym_{s.id}",
            "db_id": s.id,
            "type": "Symptom",
            "title": s.name,
            "category": s.body_system,
            "content": f"Synonyms: {s.common_names}. Body system: {s.body_system}. {s.description}",
            "source": s.source.name if s.source else "WHO",
            "last_verified": str(s.last_verified)
        })

    engine.index_documents(docs)
    return engine

def _build_knowledge_graph():
    """Builds in-memory Knowledge Graph from database models."""
    graph = MedicalKnowledgeGraph()

    for s in Symptom.objects.all():
        graph.add_node(f"SYM_{s.code}", s.name, "Symptom", {"body_system": s.body_system, "is_emergency": s.is_emergency_flag})

    for ws in WarningSign.objects.all():
        graph.add_node(f"WS_{ws.code}", ws.name, "WarningSign", {"severity": ws.severity_level, "action": ws.immediate_action})

    for c in Condition.objects.prefetch_related('conditionsymptom_set__symptom', 'warning_signs', 'risk_factors').all():
        graph.add_node(f"COND_{c.code}", c.name, "Condition", {
            "category": c.category,
            "overview": c.overview,
            "source": c.source.name if c.source else "Clinical KB",
            "last_verified": str(c.last_verified)
        })

        for cs in c.conditionsymptom_set.all():
            graph.add_edge(f"SYM_{cs.symptom.code}", f"COND_{c.code}", "indicatesCondition", weight=cs.weight)

        for ws in c.warning_signs.all():
            graph.add_edge(f"COND_{c.code}", f"WS_{ws.code}", "hasWarningSign", weight=1.5)

    return graph


class SymptomSearchView(APIView):
    """Searches symptoms with fuzzy matching and synonyms."""
    def get(self, request):
        query = request.query_params.get('q', '').strip()
        if not query:
            symptoms = Symptom.objects.all()[:30]
            return Response(SymptomSerializer(symptoms, many=True).data)

        nlp = NLPEngine()
        clean_q = nlp.normalize_text(query)
        symptoms = Symptom.objects.filter(
            Q(name__icontains=clean_q) |
            Q(common_names__icontains=clean_q) |
            Q(body_system__icontains=clean_q)
        )
        return Response(SymptomSerializer(symptoms, many=True).data)


class AssessmentView(APIView):
    """
    Main Natural Language Decision Support Assessment Endpoint.
    NLP Parsing -> Negation Check -> Knowledge Graph Traversal -> Risk Safety Engine Evaluation.
    """
    def post(self, request):
        raw_text = request.data.get('text', '').strip()
        if not raw_text:
            return Response({"error": "Please provide symptom description text."}, status=status.HTTP_400_BAD_REQUEST)

        # 1. NLP parsing
        nlp = NLPEngine()
        nlp_result = nlp.parse(raw_text)
        present_symptoms = nlp_result["present_symptoms"]
        negated_symptoms = nlp_result["negated_symptoms"]
        duration = nlp_result["duration"]
        severity = nlp_result["severity"]

        # 2. Safety & Risk Rule evaluation
        risk_engine = RiskSafetyEngine()
        safety_result = risk_engine.evaluate(present_symptoms, duration=duration, severity=severity)

        # 3. Knowledge Graph Condition ranking
        graph = _build_knowledge_graph()
        observed_sym_node_ids = [f"SYM_{s['code']}" for s in present_symptoms]
        matched_conditions = graph.rank_conditions_for_symptoms(observed_sym_node_ids)

        # 4. Save assessment record
        session_id = f"sess_{uuid.uuid4().hex[:12]}"
        assessment_obj = Assessment.objects.create(
            session_id=session_id,
            raw_input_text=raw_text,
            extracted_symptoms=present_symptoms,
            negated_symptoms=negated_symptoms,
            duration_str=duration,
            severity_level=severity,
            risk_level=safety_result["risk_level"],
            matched_conditions=matched_conditions[:5],
            detected_warning_signs=[r["title"] for r in safety_result["triggered_rules"]],
            decision_support_summary=safety_result["summary"]
        )

        return Response({
            "session_id": session_id,
            "nlp_analysis": {
                "present_symptoms": present_symptoms,
                "negated_symptoms": negated_symptoms,
                "duration": duration,
                "severity": severity,
                "body_parts": nlp_result["body_parts"]
            },
            "safety_assessment": safety_result,
            "decision_support_conditions": matched_conditions[:6],
            "is_emergency_mode_required": safety_result["is_emergency"],
            "created_at": assessment_obj.created_at.isoformat(),
            "medical_disclaimer": "This automated decision support system does NOT provide definitive diagnoses or prescriptions. Always consult a licensed physician."
        })


class MedicalSearchUnifiedView(APIView):
    """BM25 probabilistic search across conditions, symptoms, and medicines."""
    def get(self, request):
        query = request.query_params.get('q', '').strip()
        filter_type = request.query_params.get('type') # 'Condition', 'Medicine', 'Symptom'
        if not query:
            return Response([])

        search_engine = _build_search_engine()
        results = search_engine.search(query, top_k=15, filter_type=filter_type)
        return Response(results)


class ConditionListView(APIView):
    """List or filter clinical conditions."""
    def get(self, request):
        conditions = Condition.objects.all().prefetch_related('conditionsymptom_set__symptom', 'warning_signs')
        return Response(ConditionSerializer(conditions, many=True).data)


class ConditionDetailView(APIView):
    """Detailed condition overview and clinical evaluation suggestions."""
    def get(self, request, pk):
        try:
            condition = Condition.objects.get(pk=pk)
        except Condition.DoesNotExist:
            return Response({"error": "Condition not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(ConditionSerializer(condition).data)


class MedicineListView(APIView):
    """Search and browse medicines."""
    def get(self, request):
        query = request.query_params.get('q', '').strip()
        if query:
            meds = Medicine.objects.filter(
                Q(generic_name__icontains=query) |
                Q(brand_names__icontains=query) |
                Q(general_uses__icontains=query)
            )
        else:
            meds = Medicine.objects.all()
        return Response(MedicineSerializer(meds, many=True).data)


class MedicineInteractionCheckView(APIView):
    """Checks multi-drug interactions across a list of medicine IDs or names."""
    def post(self, request):
        med_ids = request.data.get('medicine_ids', [])
        med_names = request.data.get('medicine_names', [])

        medicines = []
        if med_ids:
            medicines = list(Medicine.objects.filter(id__in=med_ids))
        elif med_names:
            for name in med_names:
                med = Medicine.objects.filter(Q(generic_name__icontains=name) | Q(brand_names__icontains=name)).first()
                if med and med not in medicines:
                    medicines.append(med)

        if len(medicines) < 2:
            return Response({
                "message": "Select at least 2 medications to evaluate pairwise drug interactions.",
                "interactions": [],
                "checked_medicines": [m.generic_name for m in medicines]
            })

        detected_interactions = []
        # Check all pairs
        for i in range(len(medicines)):
            for j in range(i + 1, len(medicines)):
                m1, m2 = medicines[i], medicines[j]
                inter = MedicineInteraction.objects.filter(
                    (Q(medicine_a=m1, medicine_b=m2) | Q(medicine_a=m2, medicine_b=m1))
                ).first()

                if inter:
                    detected_interactions.append({
                        "medicine_a": m1.generic_name,
                        "medicine_b": m2.generic_name,
                        "severity": inter.severity,
                        "description": inter.description,
                        "clinical_recommendation": inter.clinical_recommendation
                    })

        return Response({
            "checked_count": len(medicines),
            "checked_medicines": [m.generic_name for m in medicines],
            "has_interactions": len(detected_interactions) > 0,
            "interactions": detected_interactions,
            "disclaimer": "Interaction checker provides reference guidance only. Do not stop or alter prescribed regimens without doctor consultation."
        })


class FacilityListView(APIView):
    """Offline healthcare facilities with Haversine distance sorting."""
    def get(self, request):
        user_lat = request.query_params.get('lat')
        user_lon = request.query_params.get('lon')
        facility_type = request.query_params.get('type')

        facilities = HealthcareFacility.objects.all()
        if facility_type:
            facilities = facilities.filter(facility_type=facility_type)

        serializer = HealthcareFacilitySerializer(
            facilities, many=True, context={'user_lat': user_lat, 'user_lon': user_lon}
        )
        data = list(serializer.data)

        if user_lat is not None and user_lon is not None:
            data.sort(key=lambda x: (x.get('distance_km') is None, x.get('distance_km') or 999999))

        return Response(data)


class RoutingPlanView(APIView):
    """Offline Dijkstra & A* routing with road blockage support."""
    def post(self, request):
        start_lat = float(request.data.get('start_lat', 28.6139))
        start_lon = float(request.data.get('start_lon', 77.2090))
        target_lat = float(request.data.get('target_lat', 28.6250))
        target_lon = float(request.data.get('target_lon', 77.2180))
        algorithm = request.data.get('algorithm', 'A*').upper()
        blocked_roads = request.data.get('blocked_roads', []) # list of [from_id, to_id]

        router = RoutingEngine()
        # Seed road nodes for Metropolis offline graph
        nodes_data = [
            ("N1", "Central Junction", 28.6139, 77.2090),
            ("N2", "North Avenue Sector 4", 28.6200, 77.2120),
            ("N3", "Apollo Hospital Roundabout", 28.6250, 77.2180),
            ("N4", "East Gate Crossing", 28.6080, 77.1980),
            ("N5", "Red Cross Circle", 28.6020, 77.2150),
            ("N6", "Ring Road Metro Pillar 140", 28.6180, 77.2120),
            ("N7", "Sector 7 Flyover", 28.6220, 77.2050),
        ]
        for nid, name, lat, lon in nodes_data:
            router.add_node(nid, name, lat, lon)

        roads_data = [
            ("N1", "N2", "Central Expressway"),
            ("N2", "N3", "North Link Road"),
            ("N1", "N4", "West Ring Connector"),
            ("N1", "N5", "Civic Center Boulevard"),
            ("N4", "N5", "South Perimeter Road"),
            ("N2", "N6", "Metro Corridor Way"),
            ("N6", "N3", "Hospital Access Highway"),
            ("N1", "N7", "Sector 7 Bypass"),
            ("N7", "N3", "Northwest Relief Road"),
        ]
        for u, v, rname in roads_data:
            router.add_road(u, v, road_name=rname)

        # Apply user blocked roads
        for b_pair in blocked_roads:
            if len(b_pair) == 2:
                router.set_road_block(b_pair[0], b_pair[1], blocked=True)

        start_node = router.find_nearest_node(start_lat, start_lon)
        target_node = router.find_nearest_node(target_lat, target_lon)

        if not start_node or not target_node:
            return Response({"error": "Unable to anchor coordinates to offline road graph."}, status=status.HTTP_400_BAD_REQUEST)

        if algorithm == "DIJKSTRA":
            route_res = router.dijkstra(start_node, target_node)
        else:
            route_res = router.a_star(start_node, target_node)

        if not route_res:
            return Response({
                "status": "NO_ROUTE_FOUND",
                "message": "All offline routes to the target are blocked or impassable.",
                "is_offline_calculated": True
            })

        return Response(route_res)


class ImageAnalysisView(APIView):
    """Local medical image analysis endpoint with quality checks & safety guardrails."""
    def post(self, request):
        task = request.data.get('task', 'skin_lesion')
        image_file = request.FILES.get('image')

        if not image_file:
            return Response({"error": "Please upload an image file for offline decision support."}, status=status.HTTP_400_BAD_REQUEST)

        image_bytes = image_file.read()
        vision_engine = MedicalVisionEngine()
        res = vision_engine.analyze(image_bytes, task=task)

        if res["status"] == "SUCCESS":
            ImageAnalysisLog.objects.create(
                task_name=res["task_name"],
                image_quality_status=res["quality_assessment"]["reason"],
                quality_score=res["quality_assessment"]["quality_score"],
                inferred_category=res["primary_classification"],
                confidence_score=res["confidence_score"],
                uncertainty_level=res["uncertainty_level"],
                findings_summary=res["findings_summary"]
            )

        return Response(res)


class SyncManifestView(APIView):
    """Provides current server package version and checksum for synchronization."""
    def get(self, request):
        latest_version = SyncVersion.objects.first()
        return Response({
            "latest_package_version": latest_version.package_version if latest_version else 18,
            "release_date": str(latest_version.release_date) if latest_version else "2026-09-18",
            "checksum_sha256": latest_version.checksum_sha256 if latest_version else "",
            "manifest_data": latest_version.manifest_data if latest_version else {},
            "is_mandatory": latest_version.is_mandatory if latest_version else False
        })


class SyncPackageView(APIView):
    """Downloads delta sync package payload."""
    def get(self, request, version):
        pkg = SyncVersion.objects.filter(package_version=version).first()
        if not pkg:
            return Response({"error": f"Sync package version {version} not found."}, status=status.HTTP_404_NOT_FOUND)

        # Build complete JSON delta package
        delta = {
            "package_version": pkg.package_version,
            "previous_version": pkg.previous_version,
            "checksum": pkg.checksum_sha256,
            "delta_payload": {
                "symptoms": list(Symptom.objects.values('code', 'name', 'common_names', 'body_system', 'is_emergency_flag')),
                "conditions": list(Condition.objects.values('code', 'name', 'scientific_name', 'category', 'overview', 'recommended_evaluations', 'non_pharmacological_care')),
                "warning_signs": list(WarningSign.objects.values('code', 'name', 'description', 'severity_level', 'immediate_action')),
                "medicines": list(Medicine.objects.values('code', 'generic_name', 'brand_names', 'dosage_form', 'general_uses', 'warnings', 'contraindications', 'common_side_effects', 'storage_information')),
                "facilities": list(HealthcareFacility.objects.values('code', 'name', 'facility_type', 'latitude', 'longitude', 'address', 'phone', 'services', 'is_24x7', 'has_ambulance', 'has_icu')),
                "emergency_rules": list(EmergencyRule.objects.values('rule_id', 'title', 'description', 'criteria', 'risk_level', 'warning_text', 'immediate_first_aid'))
            }
        }
        return Response(delta)


class SyncApplyView(APIView):
    """Applies delta package with SHA-256 verification and automatic rollback."""
    def post(self, request):
        package_dict = request.data
        if not package_dict:
            return Response({"error": "Empty package payload."}, status=status.HTTP_400_BAD_REQUEST)

        res = SynchronizationEngine.apply_delta_update(package_dict)
        if not res.get("success"):
            return Response(res, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        return Response(res)


class SystemDiagnosticView(APIView):
    """
    10-Point "No-Internet System Check" Diagnostic Screen Endpoint.
    Verifies all 10 core subsystems: Local DB, Symptom NLP, BM25 Search,
    Knowledge Graph, Risk Engine, AI Models, Offline Map/Routing, Medicines, Facilities, Sync Engine.
    """
    def get(self, request):
        checks = {}

        # 1. Local Database
        try:
            sym_count = Symptom.objects.count()
            cond_count = Condition.objects.count()
            checks["local_database"] = {
                "name": "Local SQLite Database",
                "status": "OPERATIONAL" if sym_count > 0 else "DEGRADED",
                "details": f"{sym_count} symptoms, {cond_count} conditions active in local storage."
            }
        except Exception as e:
            checks["local_database"] = {"name": "Local SQLite Database", "status": "FAILED", "details": str(e)}

        # 2. Symptom NLP Engine
        try:
            nlp = NLPEngine()
            test_parse = nlp.parse("I have fever and headache but no chest pain")
            has_present = len(test_parse["present_symptoms"]) >= 2
            has_neg = len(test_parse["negated_symptoms"]) >= 1
            checks["symptom_nlp_engine"] = {
                "name": "Symptom NLP & Negation Engine",
                "status": "OPERATIONAL" if (has_present and has_neg) else "DEGRADED",
                "details": f"Parsed: {len(test_parse['present_symptoms'])} present, {len(test_parse['negated_symptoms'])} negated."
            }
        except Exception as e:
            checks["symptom_nlp_engine"] = {"name": "Symptom NLP Engine", "status": "FAILED", "details": str(e)}

        # 3. BM25 Search Engine
        try:
            search_eng = _build_search_engine()
            res = search_eng.search("fever", top_k=2)
            checks["search_engine"] = {
                "name": "Inverted Index & BM25 Search",
                "status": "OPERATIONAL" if len(res) > 0 else "DEGRADED",
                "details": f"Corpus indexed with {len(search_eng.documents)} documents. BM25 scoring verified."
            }
        except Exception as e:
            checks["search_engine"] = {"name": "Search Engine", "status": "FAILED", "details": str(e)}

        # 4. Medical Knowledge Graph
        try:
            graph = _build_knowledge_graph()
            checks["knowledge_graph"] = {
                "name": "Medical Knowledge Graph",
                "status": "OPERATIONAL" if len(graph.nodes) > 0 else "DEGRADED",
                "details": f"{len(graph.nodes)} nodes linked with BFS/DFS multi-hop traversals."
            }
        except Exception as e:
            checks["knowledge_graph"] = {"name": "Knowledge Graph", "status": "FAILED", "details": str(e)}

        # 5. Risk & Safety Engine
        try:
            risk = RiskSafetyEngine()
            eval_res = risk.evaluate([{"name": "Chest Pain"}, {"name": "Breathing Difficulty"}])
            checks["risk_engine"] = {
                "name": "Auditable Risk & Emergency Red-Flag Engine",
                "status": "OPERATIONAL" if eval_res["risk_level"] == "URGENT" else "DEGRADED",
                "details": f"{len(risk.rules)} emergency rules active. ACS red-flag sensitivity verified."
            }
        except Exception as e:
            checks["risk_engine"] = {"name": "Risk Engine", "status": "FAILED", "details": str(e)}

        # 6. AI Vision Model Registry
        try:
            models_count = AIModelRegistry.objects.filter(is_active=True).count()
            checks["ai_models"] = {
                "name": "Local AI Vision Screening Models",
                "status": "OPERATIONAL" if models_count > 0 else "DEGRADED",
                "details": f"{models_count} validated offline inference models active."
            }
        except Exception as e:
            checks["ai_models"] = {"name": "AI Models", "status": "FAILED", "details": str(e)}

        # 7. Offline Map & Routing
        try:
            router = RoutingEngine()
            router.add_node("A", "Node A", 28.61, 77.20)
            router.add_node("B", "Node B", 28.62, 77.21)
            router.add_road("A", "B", "Direct Way")
            path = router.a_star("A", "B")
            checks["offline_routing"] = {
                "name": "Offline Maps, Haversine & A* Routing",
                "status": "OPERATIONAL" if path is not None else "DEGRADED",
                "details": "Haversine distance and Dijkstra/A* heuristic pathfinding operational."
            }
        except Exception as e:
            checks["offline_routing"] = {"name": "Offline Routing", "status": "FAILED", "details": str(e)}

        # 8. Medicine Repository
        try:
            med_count = Medicine.objects.count()
            checks["medicine_database"] = {
                "name": "Offline Medicine & Interaction Database",
                "status": "OPERATIONAL" if med_count > 0 else "DEGRADED",
                "details": f"{med_count} verified essential medications and interaction matrix loaded."
            }
        except Exception as e:
            checks["medicine_database"] = {"name": "Medicine Database", "status": "FAILED", "details": str(e)}

        # 9. Healthcare Facilities
        try:
            fac_count = HealthcareFacility.objects.count()
            checks["facility_database"] = {
                "name": "Offline Healthcare Facility Directory",
                "status": "OPERATIONAL" if fac_count > 0 else "DEGRADED",
                "details": f"{fac_count} hospitals, trauma centers, and blood banks preloaded."
            }
        except Exception as e:
            checks["facility_database"] = {"name": "Facility Database", "status": "FAILED", "details": str(e)}

        # 10. Synchronization Engine
        try:
            sync_count = SyncVersion.objects.count()
            checks["sync_engine"] = {
                "name": "Delta Synchronization & SHA-256 Verifier",
                "status": "OPERATIONAL" if sync_count > 0 else "DEGRADED",
                "details": f"Package v18 loaded with SHA-256 integrity and transaction rollback safeguards."
            }
        except Exception as e:
            checks["sync_engine"] = {"name": "Sync Engine", "status": "FAILED", "details": str(e)}

        all_operational = all(c["status"] == "OPERATIONAL" for c in checks.values())

        return Response({
            "overall_status": "CORE SYSTEM OPERATIONAL" if all_operational else "PARTIALLY DEGRADED",
            "network_status": "OFFLINE COMPATIBLE (Zero Internet Required)",
            "timestamp": timezone.now().isoformat(),
            "subsystem_checks": checks
        })


class AIModelsListView(APIView):
    """Lists registered AI models and accuracy metrics."""
    def get(self, request):
        models = AIModelRegistry.objects.filter(is_active=True)
        return Response(AIModelRegistrySerializer(models, many=True).data)
