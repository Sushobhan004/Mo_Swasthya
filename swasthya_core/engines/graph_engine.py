"""
SwasthyaAI Local Medical Knowledge Graph Engine
Graph traversals (BFS, DFS, relationship ranking, multi-hop condition analysis)
"""
from collections import deque
from typing import List, Dict, Any, Set, Tuple, Optional

class MedicalKnowledgeGraph:
    def __init__(self):
        # Adjacency list: node_id -> list of (neighbor_id, relation_type, weight, metadata)
        self.adj: Dict[str, List[Dict[str, Any]]] = {}
        # Node metadata store: node_id -> dict
        self.nodes: Dict[str, Dict[str, Any]] = {}

    def add_node(self, node_id: str, label: str, node_type: str, metadata: Optional[Dict[str, Any]] = None) -> None:
        """Adds or updates a node in the medical knowledge graph."""
        self.nodes[node_id] = {
            "id": node_id,
            "label": label,
            "type": node_type,  # 'Symptom', 'Condition', 'WarningSign', 'RiskFactor', 'Medicine'
            "metadata": metadata or {}
        }
        if node_id not in self.adj:
            self.adj[node_id] = []

    def add_edge(self, source_id: str, target_id: str, relation: str, weight: float = 1.0, bidirectional: bool = True) -> None:
        """Adds a directed or undirected medical relation."""
        if source_id not in self.adj:
            self.adj[source_id] = []
        if target_id not in self.adj:
            self.adj[target_id] = []

        # Avoid duplicate edges
        if not any(e["target"] == target_id and e["relation"] == relation for e in self.adj[source_id]):
            self.adj[source_id].append({
                "target": target_id,
                "relation": relation,
                "weight": weight
            })

        if bidirectional:
            inverse_rel = f"rev_{relation}"
            if not any(e["target"] == source_id and e["relation"] == inverse_rel for e in self.adj[target_id]):
                self.adj[target_id].append({
                    "target": source_id,
                    "relation": inverse_rel,
                    "weight": weight
                })

    def bfs_traverse(self, start_node_id: str, max_depth: int = 2, filter_types: Optional[Set[str]] = None) -> Dict[str, Any]:
        """
        Executes Breadth-First Search from start_node_id up to max_depth.
        Returns reachable nodes grouped by depth, plus traversed edges.
        """
        if start_node_id not in self.nodes:
            return {"nodes": [], "edges": [], "depth_levels": {}}

        visited: Set[str] = {start_node_id}
        queue = deque([(start_node_id, 0)])
        result_nodes = [self.nodes[start_node_id]]
        result_edges = []
        depth_levels: Dict[int, List[str]] = {0: [start_node_id]}

        while queue:
            current_id, depth = queue.popleft()
            if depth >= max_depth:
                continue

            for edge in self.adj.get(current_id, []):
                neighbor_id = edge["target"]
                neighbor_node = self.nodes.get(neighbor_id)
                if not neighbor_node:
                    continue

                if filter_types and neighbor_node["type"] not in filter_types:
                    continue

                result_edges.append({
                    "source": current_id,
                    "target": neighbor_id,
                    "relation": edge["relation"],
                    "weight": edge["weight"]
                })

                if neighbor_id not in visited:
                    visited.add(neighbor_id)
                    next_depth = depth + 1
                    queue.append((neighbor_id, next_depth))
                    result_nodes.append(neighbor_node)

                    if next_depth not in depth_levels:
                        depth_levels[next_depth] = []
                    depth_levels[next_depth].append(neighbor_id)

        return {
            "root_node": self.nodes[start_node_id],
            "nodes": result_nodes,
            "edges": result_edges,
            "depth_levels": depth_levels,
            "total_nodes_found": len(result_nodes)
        }

    def dfs_find_paths(self, start_id: str, target_id: str, max_depth: int = 4) -> List[List[Dict[str, Any]]]:
        """
        Executes Depth-First Search to discover reasoning paths between two medical entities.
        """
        if start_id not in self.nodes or target_id not in self.nodes:
            return []

        paths = []

        def dfs_visit(current: str, target: str, visited: Set[str], current_path: List[Dict[str, Any]], depth: int):
            if depth > max_depth:
                return
            if current == target:
                paths.append(list(current_path))
                return

            for edge in self.adj.get(current, []):
                nxt = edge["target"]
                if nxt not in visited:
                    visited.add(nxt)
                    current_path.append({
                        "from": current,
                        "to": nxt,
                        "relation": edge["relation"],
                        "target_node": self.nodes.get(nxt)
                    })
                    dfs_visit(nxt, target, visited, current_path, depth + 1)
                    current_path.pop()
                    visited.remove(nxt)

        visited_set = {start_id}
        dfs_visit(start_id, target_id, visited_set, [], 0)
        return paths

    def rank_conditions_for_symptoms(self, observed_symptom_ids: List[str]) -> List[Dict[str, Any]]:
        """
        Evaluates knowledge graph overlap between a set of observed symptoms and conditions.
        Returns ranked conditions with matched symptoms and associated warning signs.
        *Strictly decision support, NOT diagnostic probability.*
        """
        if not observed_symptom_ids:
            return []

        condition_scores: Dict[str, Dict[str, Any]] = {}

        for sym_id in observed_symptom_ids:
            if sym_id not in self.adj:
                continue

            for edge in self.adj[sym_id]:
                target_id = edge["target"]
                target_node = self.nodes.get(target_id)
                if not target_node or target_node["type"] != "Condition":
                    continue

                if target_id not in condition_scores:
                    # Gather condition's warning signs and risk factors from graph
                    warning_signs = []
                    for c_edge in self.adj.get(target_id, []):
                        c_target = self.nodes.get(c_edge["target"])
                        if c_target and c_target["type"] == "WarningSign":
                            warning_signs.append(c_target["label"])

                    condition_scores[target_id] = {
                        "condition_id": target_id,
                        "name": target_node["label"],
                        "category": target_node["metadata"].get("category", "General"),
                        "overview": target_node["metadata"].get("overview", ""),
                        "matched_symptoms": [],
                        "total_weight": 0.0,
                        "warning_signs": warning_signs,
                        "source": target_node["metadata"].get("source", "Clinical Knowledge Base"),
                        "last_verified": target_node["metadata"].get("last_verified", "2026-09-18")
                    }

                sym_node = self.nodes.get(sym_id, {"label": sym_id})
                condition_scores[target_id]["matched_symptoms"].append(sym_node["label"])
                condition_scores[target_id]["total_weight"] += edge.get("weight", 1.0)

        # Sort by total matching weight
        ranked = sorted(condition_scores.values(), key=lambda x: (len(x["matched_symptoms"]), x["total_weight"]), reverse=True)
        return ranked
