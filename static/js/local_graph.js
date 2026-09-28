/**
 * SwasthyaAI Client-Side Medical Knowledge Graph
 * In-memory graph structure with BFS, DFS, and relation matching.
 */
class LocalKnowledgeGraph {
  constructor() {
    this.nodes = {};
    this.adj = {};
  }

  addNode(id, label, type, metadata = {}) {
    this.nodes[id] = { id, label, type, metadata };
    if (!this.adj[id]) this.adj[id] = [];
  }

  addEdge(source, target, relation, weight = 1.0, bidirectional = true) {
    if (!this.adj[source]) this.adj[source] = [];
    if (!this.adj[target]) this.adj[target] = [];

    if (!this.adj[source].some(e => e.target === target && e.relation === relation)) {
      this.adj[source].push({ target, relation, weight });
    }
    if (bidirectional) {
      const invRel = `rev_${relation}`;
      if (!this.adj[target].some(e => e.target === source && e.relation === invRel)) {
        this.adj[target].push({ target: source, relation: invRel, weight });
      }
    }
  }

  bfsTraverse(startId, maxDepth = 2) {
    if (!this.nodes[startId]) return { nodes: [], edges: [] };
    const visited = new Set([startId]);
    const queue = [[startId, 0]];
    const resNodes = [this.nodes[startId]];
    const resEdges = [];

    while (queue.length > 0) {
      const [currId, depth] = queue.shift();
      if (depth >= maxDepth) continue;

      (this.adj[currId] || []).forEach(edge => {
        const neighbor = this.nodes[edge.target];
        if (!neighbor) return;

        resEdges.push({ source: currId, target: edge.target, relation: edge.relation, weight: edge.weight });
        if (!visited.has(edge.target)) {
          visited.add(edge.target);
          queue.push([edge.target, depth + 1]);
          resNodes.push(neighbor);
        }
      });
    }

    return { root_node: this.nodes[startId], nodes: resNodes, edges: resEdges };
  }

  rankConditionsForSymptoms(observedSymptomNames) {
    if (!observedSymptomNames || !observedSymptomNames.length) return [];
    const conditionScores = {};

    observedSymptomNames.forEach(symName => {
      // Find matching symptom nodes
      const symNodes = Object.values(this.nodes).filter(n => n.type === 'Symptom' && n.label.toLowerCase() === symName.toLowerCase());

      symNodes.forEach(symNode => {
        (this.adj[symNode.id] || []).forEach(edge => {
          const targetNode = this.nodes[edge.target];
          if (!targetNode || targetNode.type !== 'Condition') return;

          if (!conditionScores[targetNode.id]) {
            conditionScores[targetNode.id] = {
              condition_id: targetNode.id,
              name: targetNode.label,
              category: targetNode.metadata.category || 'General',
              overview: targetNode.metadata.overview || '',
              matched_symptoms: [],
              total_weight: 0.0,
              warning_signs: [],
              source: targetNode.metadata.source || 'Clinical Knowledge Base',
              last_verified: targetNode.metadata.last_verified || '2026-09-18'
            };
          }

          if (!conditionScores[targetNode.id].matched_symptoms.includes(symNode.label)) {
            conditionScores[targetNode.id].matched_symptoms.push(symNode.label);
            conditionScores[targetNode.id].total_weight += edge.weight || 1.0;
          }
        });
      });
    });

    return Object.values(conditionScores).sort((a, b) => {
      if (b.matched_symptoms.length !== a.matched_symptoms.length) {
        return b.matched_symptoms.length - a.matched_symptoms.length;
      }
      return b.total_weight - a.total_weight;
    });
  }

  async buildFromStorage() {
    if (!window.offlineStorage) return;
    const symptoms = await window.offlineStorage.getAll('symptoms');
    const conditions = await window.offlineStorage.getAll('conditions');
    const warningSigns = await window.offlineStorage.getAll('warning_signs');

    symptoms.forEach(s => {
      this.addNode(`SYM_${s.code}`, s.name, 'Symptom', { body_system: s.body_system });
    });

    warningSigns.forEach(ws => {
      this.addNode(`WS_${ws.code}`, ws.name, 'WarningSign', { severity: ws.severity_level, action: ws.immediate_action });
    });

    conditions.forEach(c => {
      this.addNode(`COND_${c.code}`, c.name, 'Condition', {
        category: c.category,
        overview: c.overview,
        source: c.source || 'WHO Guidelines'
      });

      // Link symptoms
      (c.symptoms || []).forEach(symName => {
        const sym = symptoms.find(s => s.name.toLowerCase() === symName.toLowerCase());
        if (sym) {
          this.addEdge(`SYM_${sym.code}`, `COND_${c.code}`, 'indicatesCondition', 1.0);
        }
      });

      // Link warning signs
      (c.warning_signs || []).forEach(wsName => {
        const ws = warningSigns.find(w => w.name.toLowerCase().includes(wsName.toLowerCase()));
        if (ws) {
          this.addEdge(`COND_${c.code}`, `WS_${ws.code}`, 'hasWarningSign', 1.5);
        }
      });
    });

    console.log(`[LocalKnowledgeGraph] Built offline graph with ${Object.keys(this.nodes).length} nodes`);
  }
}

window.localGraph = new LocalKnowledgeGraph();
