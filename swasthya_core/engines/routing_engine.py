"""
SwasthyaAI Offline Routing & Spatial Engine
Implements Haversine distance, Dijkstra shortest path, and A* heuristic routing with road obstruction avoidance.
"""
import math
import heapq
from typing import List, Dict, Any, Tuple, Optional, Set

class RoutingEngine:
    def __init__(self):
        # Road graph nodes: node_id -> {"id": str, "name": str, "lat": float, "lon": float}
        self.nodes: Dict[str, Dict[str, Any]] = {}
        # Edges: node_id -> list of {"target": str, "distance_km": float, "blocked": bool, "road_name": str}
        self.edges: Dict[str, List[Dict[str, Any]]] = {}

    @staticmethod
    def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculates great-circle distance between two coordinates in kilometers."""
        R = 6371.0 # Earth's radius in km
        phi1 = math.radians(lat1)
        phi2 = math.radians(lat2)
        delta_phi = math.radians(lat2 - lat1)
        delta_lambda = math.radians(lon2 - lon1)

        a = math.sin(delta_phi / 2.0) ** 2 + \
            math.cos(phi1) * math.cos(phi2) * \
            math.sin(delta_lambda / 2.0) ** 2
        c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
        return round(R * c, 3)

    def add_node(self, node_id: str, name: str, lat: float, lon: float) -> None:
        self.nodes[node_id] = {"id": node_id, "name": name, "lat": lat, "lon": lon}
        if node_id not in self.edges:
            self.edges[node_id] = []

    def add_road(self, from_id: str, to_id: str, road_name: str = "Local Road", blocked: bool = False, bidirectional: bool = True) -> None:
        if from_id not in self.nodes or to_id not in self.nodes:
            return
        n1 = self.nodes[from_id]
        n2 = self.nodes[to_id]
        dist = self.haversine_distance(n1["lat"], n1["lon"], n2["lat"], n2["lon"])

        self.edges[from_id].append({
            "target": to_id,
            "distance_km": dist,
            "blocked": blocked,
            "road_name": road_name
        })

        if bidirectional:
            self.edges[to_id].append({
                "target": from_id,
                "distance_km": dist,
                "blocked": blocked,
                "road_name": road_name
            })

    def set_road_block(self, from_id: str, to_id: str, blocked: bool = True) -> None:
        """Marks a road segment as blocked or clear."""
        if from_id in self.edges:
            for e in self.edges[from_id]:
                if e["target"] == to_id:
                    e["blocked"] = blocked
        if to_id in self.edges:
            for e in self.edges[to_id]:
                if e["target"] == from_id:
                    e["blocked"] = blocked

    def find_nearest_node(self, lat: float, lon: float) -> Optional[str]:
        """Finds the closest road intersection to arbitrary user coordinates."""
        if not self.nodes:
            return None
        closest_id = None
        min_dist = float('inf')
        for node_id, data in self.nodes.items():
            d = self.haversine_distance(lat, lon, data["lat"], data["lon"])
            if d < min_dist:
                min_dist = d
                closest_id = node_id
        return closest_id

    def dijkstra(self, start_id: str, target_id: str) -> Optional[Dict[str, Any]]:
        """
        Dijkstra Shortest Path Algorithm ignoring blocked roads.
        """
        if start_id not in self.nodes or target_id not in self.nodes:
            return None

        distances = {node: float('inf') for node in self.nodes}
        previous = {node: None for node in self.nodes}
        distances[start_id] = 0.0

        # Priority queue storing (dist, node_id)
        pq = [(0.0, start_id)]
        visited: Set[str] = set()

        while pq:
            curr_dist, curr_node = heapq.heappop(pq)

            if curr_node in visited:
                continue
            visited.add(curr_node)

            if curr_node == target_id:
                break

            for edge in self.edges.get(curr_node, []):
                if edge["blocked"]:
                    continue # Skip road obstructions

                neighbor = edge["target"]
                new_dist = curr_dist + edge["distance_km"]

                if new_dist < distances[neighbor]:
                    distances[neighbor] = new_dist
                    previous[neighbor] = (curr_node, edge["road_name"], edge["distance_km"])
                    heapq.heappush(pq, (new_dist, neighbor))

        if distances[target_id] == float('inf'):
            return None # No unblocked path available

        # Reconstruct path
        path_nodes = []
        path_steps = []
        curr = target_id
        while curr is not None:
            path_nodes.append(self.nodes[curr])
            prev_info = previous[curr]
            if prev_info:
                prev_node, road, seg_dist = prev_info
                path_steps.append({
                    "instruction": f"Follow {road} to {self.nodes[curr]['name']}",
                    "distance_km": round(seg_dist, 2),
                    "from_node": self.nodes[prev_node]['name'],
                    "to_node": self.nodes[curr]['name']
                })
                curr = prev_node
            else:
                curr = None

        path_nodes.reverse()
        path_steps.reverse()

        return {
            "algorithm": "Dijkstra",
            "total_distance_km": round(distances[target_id], 2),
            "estimated_travel_minutes": round((distances[target_id] / 35.0) * 60, 1), # assuming 35km/h city speed
            "path_nodes": path_nodes,
            "turn_by_turn": path_steps,
            "is_offline_calculated": True
        }

    def a_star(self, start_id: str, target_id: str) -> Optional[Dict[str, Any]]:
        """
        A* Search Algorithm utilizing Haversine distance as admissible geographic heuristic.
        """
        if start_id not in self.nodes or target_id not in self.nodes:
            return None

        target_node = self.nodes[target_id]
        
        def heuristic(node_id: str) -> float:
            n = self.nodes[node_id]
            return self.haversine_distance(n["lat"], n["lon"], target_node["lat"], target_node["lon"])

        g_score = {node: float('inf') for node in self.nodes}
        f_score = {node: float('inf') for node in self.nodes}
        previous = {node: None for node in self.nodes}

        g_score[start_id] = 0.0
        f_score[start_id] = heuristic(start_id)

        # Priority queue stores (f_score, node_id)
        open_set = [(f_score[start_id], start_id)]
        visited: Set[str] = set()

        while open_set:
            _, current = heapq.heappop(open_set)

            if current in visited:
                continue
            visited.add(current)

            if current == target_id:
                break

            for edge in self.edges.get(current, []):
                if edge["blocked"]:
                    continue

                neighbor = edge["target"]
                tentative_g = g_score[current] + edge["distance_km"]

                if tentative_g < g_score[neighbor]:
                    g_score[neighbor] = tentative_g
                    f_score[neighbor] = tentative_g + heuristic(neighbor)
                    previous[neighbor] = (current, edge["road_name"], edge["distance_km"])
                    heapq.heappush(open_set, (f_score[neighbor], neighbor))

        if g_score[target_id] == float('inf'):
            return None

        # Reconstruct path
        path_nodes = []
        path_steps = []
        curr = target_id
        while curr is not None:
            path_nodes.append(self.nodes[curr])
            prev_info = previous[curr]
            if prev_info:
                prev_node, road, seg_dist = prev_info
                path_steps.append({
                    "instruction": f"Follow {road} to {self.nodes[curr]['name']}",
                    "distance_km": round(seg_dist, 2),
                    "from_node": self.nodes[prev_node]['name'],
                    "to_node": self.nodes[curr]['name']
                })
                curr = prev_node
            else:
                curr = None

        path_nodes.reverse()
        path_steps.reverse()

        return {
            "algorithm": "A*",
            "total_distance_km": round(g_score[target_id], 2),
            "estimated_travel_minutes": round((g_score[target_id] / 35.0) * 60, 1),
            "path_nodes": path_nodes,
            "turn_by_turn": path_steps,
            "is_offline_calculated": True
        }
