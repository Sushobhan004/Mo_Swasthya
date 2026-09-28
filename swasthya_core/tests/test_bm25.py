from django.test import TestCase
from swasthya_core.engines.search_engine import BM25SearchEngine

class BM25SearchEngineTests(TestCase):
    def setUp(self):
        self.engine = BM25SearchEngine()
        self.sample_docs = [
            {
                "id": "1",
                "title": "Acute Coronary Syndrome",
                "content": "Ischemic chest pain pressure radiating to arm shortness of breath",
                "category": "Cardiovascular",
                "type": "Condition"
            },
            {
                "id": "2",
                "title": "Community Acquired Pneumonia",
                "content": "Productive cough high fever consolidation and dyspnea",
                "category": "Pulmonology",
                "type": "Condition"
            },
            {
                "id": "3",
                "title": "Paracetamol Tablet",
                "content": "First line analgesic and antipyretic for fever and mild pain",
                "category": "Medicine",
                "type": "Medicine"
            }
        ]
        self.engine.index_documents(self.sample_docs)

    def test_relevance_ranking(self):
        results = self.engine.search("chest pain pressure", top_k=2)
        self.assertGreater(len(results), 0)
        top_doc = results[0]["document"]
        self.assertEqual(top_doc["title"], "Acute Coronary Syndrome")
        self.assertGreater(results[0]["bm25_score"], 0.0)

    def test_filter_type(self):
        results = self.engine.search("fever", top_k=5, filter_type="Medicine")
        for r in results:
            self.assertEqual(r["document"]["type"], "Medicine")
