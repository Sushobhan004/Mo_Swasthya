from django.test import TestCase
from swasthya_core.engines.routing_engine import RoutingEngine

class RoutingEngineTests(TestCase):
    def setUp(self):
        self.router = RoutingEngine()
        self.router.add_node("A", "Node A", 28.6139, 77.2090)
        self.router.add_node("B", "Node B", 28.6200, 77.2120)
        self.router.add_node("C", "Node C", 28.6250, 77.2180)
        self.router.add_road("A", "B", "Direct Road")
        self.router.add_road("B", "C", "Hospital Road")
        self.router.add_road("A", "C", "Bypass Expressway")

    def test_haversine_distance(self):
        d = RoutingEngine.haversine_distance(28.6139, 77.2090, 28.6250, 77.2180)
        self.assertGreater(d, 1.0)
        self.assertLess(d, 3.0)

    def test_dijkstra_shortest_path(self):
        res = self.router.dijkstra("A", "C")
        self.assertIsNotNone(res)
        self.assertEqual(res["algorithm"], "Dijkstra")
        self.assertGreater(res["total_distance_km"], 0.0)

    def test_a_star_with_roadblock(self):
        # Block direct bypass road
        self.router.set_road_block("A", "C", blocked=True)
        res = self.router.a_star("A", "C")
        self.assertIsNotNone(res)
        # Should now route through B
        node_names = [n["id"] for n in res["path_nodes"]]
        self.assertEqual(node_names, ["A", "B", "C"])
