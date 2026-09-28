/**
 * SwasthyaAI Client-Side Offline Map & Routing Engine
 * Canvas map visualizer, Haversine distance, Dijkstra & A* routing with road-block simulation.
 */
class LocalMapEngine {
  constructor(canvasId = 'mapCanvas') {
    this.canvasId = canvasId;
    this.canvas = null;
    this.ctx = null;
    this.userPos = { lat: 28.6139, lon: 77.2090 }; // Metropolis Central (default user GPS)
    this.facilities = [];
    this.nodes = {};
    this.edges = {};
    this.currentRoute = null;
    this.selectedFacility = null;
    this.initRoadNetwork();
  }

  static haversine(lat1, lon1, lat2, lon2) {
    const R = 6371.0;
    const dLat = (lat2 - lat1) * Math.PI / 180.0;
    const dLon = (lon2 - lon1) * Math.PI / 180.0;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180.0) * Math.cos(lat2 * Math.PI / 180.0) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 100) / 100;
  }

  initRoadNetwork() {
    this.nodes = {
      "N1": { id: "N1", name: "Central Junction", lat: 28.6139, lon: 77.2090 },
      "N2": { id: "N2", name: "North Avenue Sector 4", lat: 28.6200, lon: 77.2120 },
      "N3": { id: "N3", name: "Apollo Hospital Roundabout", lat: 28.6250, lon: 77.2180 },
      "N4": { id: "N4", name: "East Gate Crossing", lat: 28.6080, lon: 77.1980 },
      "N5": { id: "N5", name: "Red Cross Circle", lat: 28.6020, lon: 77.2150 },
      "N6": { id: "N6", name: "Ring Road Metro Pillar 140", lat: 28.6180, lon: 77.2120 },
      "N7": { id: "N7", name: "Sector 7 Flyover", lat: 28.6220, lon: 77.2050 }
    };

    this.edges = {
      "N1": [
        { target: "N2", road_name: "Central Expressway", blocked: false },
        { target: "N4", road_name: "West Ring Connector", blocked: false },
        { target: "N5", road_name: "Civic Center Boulevard", blocked: false },
        { target: "N7", road_name: "Sector 7 Bypass", blocked: false }
      ],
      "N2": [
        { target: "N1", road_name: "Central Expressway", blocked: false },
        { target: "N3", road_name: "North Link Road", blocked: false },
        { target: "N6", road_name: "Metro Corridor Way", blocked: false }
      ],
      "N3": [
        { target: "N2", road_name: "North Link Road", blocked: false },
        { target: "N6", road_name: "Hospital Access Highway", blocked: false },
        { target: "N7", road_name: "Northwest Relief Road", blocked: false }
      ],
      "N4": [
        { target: "N1", road_name: "West Ring Connector", blocked: false },
        { target: "N5", road_name: "South Perimeter Road", blocked: false }
      ],
      "N5": [
        { target: "N1", road_name: "Civic Center Boulevard", blocked: false },
        { target: "N4", road_name: "South Perimeter Road", blocked: false }
      ],
      "N6": [
        { target: "N2", road_name: "Metro Corridor Way", blocked: false },
        { target: "N3", road_name: "Hospital Access Highway", blocked: false }
      ],
      "N7": [
        { target: "N1", road_name: "Sector 7 Bypass", blocked: false },
        { target: "N3", road_name: "Northwest Relief Road", blocked: false }
      ]
    };
  }

  setRoadBlocked(fromId, toId, blocked = true) {
    if (this.edges[fromId]) {
      this.edges[fromId].forEach(e => { if (e.target === toId) e.blocked = blocked; });
    }
    if (this.edges[toId]) {
      this.edges[toId].forEach(e => { if (e.target === fromId) e.blocked = blocked; });
    }
    this.render();
  }

  findNearestNode(lat, lon) {
    let nearest = "N1";
    let minDist = Infinity;
    Object.values(this.nodes).forEach(node => {
      const d = LocalMapEngine.haversine(lat, lon, node.lat, node.lon);
      if (d < minDist) {
        minDist = d;
        nearest = node.id;
      }
    });
    return nearest;
  }

  findShortestPath(startId, targetId, algorithm = 'A*') {
    const distances = {};
    const previous = {};
    const visited = new Set();
    const targetNode = this.nodes[targetId];

    Object.keys(this.nodes).forEach(n => {
      distances[n] = Infinity;
      previous[n] = null;
    });

    distances[startId] = 0;

    // Simple priority queue simulation
    const queue = [startId];

    while (queue.length > 0) {
      // Find node with lowest cost
      queue.sort((a, b) => {
        const costA = algorithm === 'A*' ? distances[a] + LocalMapEngine.haversine(this.nodes[a].lat, this.nodes[a].lon, targetNode.lat, targetNode.lon) : distances[a];
        const costB = algorithm === 'A*' ? distances[b] + LocalMapEngine.haversine(this.nodes[b].lat, this.nodes[b].lon, targetNode.lat, targetNode.lon) : distances[b];
        return costA - costB;
      });

      const curr = queue.shift();
      if (visited.has(curr)) continue;
      visited.add(curr);

      if (curr === targetId) break;

      (this.edges[curr] || []).forEach(edge => {
        if (edge.blocked) return; // Ignore road obstructions
        const neighbor = edge.target;
        const segDist = LocalMapEngine.haversine(this.nodes[curr].lat, this.nodes[curr].lon, this.nodes[neighbor].lat, this.nodes[neighbor].lon);
        const alt = distances[curr] + segDist;

        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = { from: curr, road: edge.road_name, dist: segDist };
          if (!visited.has(neighbor)) queue.push(neighbor);
        }
      });
    }

    if (distances[targetId] === Infinity) return null;

    // Reconstruct path
    const pathNodes = [];
    const turnByTurn = [];
    let curr = targetId;

    while (curr) {
      pathNodes.unshift(this.nodes[curr]);
      const prev = previous[curr];
      if (prev) {
        turnByTurn.unshift({
          instruction: `Take ${prev.road} towards ${this.nodes[curr].name}`,
          distance_km: Math.round(prev.dist * 100) / 100,
          from: this.nodes[prev.from].name,
          to: this.nodes[curr].name
        });
        curr = prev.from;
      } else {
        curr = null;
      }
    }

    return {
      algorithm,
      total_distance_km: Math.round(distances[targetId] * 100) / 100,
      estimated_travel_minutes: Math.round((distances[targetId] / 35.0) * 60 * 10) / 10,
      path_nodes: pathNodes,
      turn_by_turn: turnByTurn,
      is_offline_calculated: true
    };
  }

  async loadFacilities() {
    if (window.offlineStorage) {
      this.facilities = await window.offlineStorage.getAll('facilities');
    }
    this.render();
  }

  latLonToCanvas(lat, lon, width, height) {
    // Metropolis Coordinate Bounding Box
    const minLat = 28.5950, maxLat = 28.6350;
    const minLon = 77.1900, maxLon = 77.2300;
    const pad = 40;

    const x = pad + ((lon - minLon) / (maxLon - minLon)) * (width - 2 * pad);
    const y = height - (pad + ((lat - minLat) / (maxLat - minLat)) * (height - 2 * pad));
    return { x, y };
  }

  render() {
    this.canvas = document.getElementById(this.canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    const width = this.canvas.width = this.canvas.parentElement.clientWidth || 600;
    const height = this.canvas.height = 380;

    // Background Grid
    this.ctx.fillStyle = '#0a0e17';
    this.ctx.fillRect(0, 0, width, height);

    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      this.ctx.beginPath(); this.ctx.moveTo(x, 0); this.ctx.lineTo(x, height); this.ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      this.ctx.beginPath(); this.ctx.moveTo(0, y); this.ctx.lineTo(width, y); this.ctx.stroke();
    }

    // Draw Roads
    Object.keys(this.edges).forEach(fromId => {
      const fromNode = this.nodes[fromId];
      const p1 = this.latLonToCanvas(fromNode.lat, fromNode.lon, width, height);

      (this.edges[fromId] || []).forEach(edge => {
        const toNode = this.nodes[edge.target];
        const p2 = this.latLonToCanvas(toNode.lat, toNode.lon, width, height);

        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);

        if (edge.blocked) {
          this.ctx.strokeStyle = '#e11d48';
          this.ctx.lineWidth = 3;
          this.ctx.setLineDash([4, 4]);
        } else {
          this.ctx.strokeStyle = 'rgba(14, 165, 233, 0.25)';
          this.ctx.lineWidth = 4;
          this.ctx.setLineDash([]);
        }
        this.ctx.stroke();
        this.ctx.setLineDash([]);
      });
    });

    // Draw Active Route if computed
    if (this.currentRoute && this.currentRoute.path_nodes) {
      this.ctx.beginPath();
      this.currentRoute.path_nodes.forEach((node, i) => {
        const p = this.latLonToCanvas(node.lat, node.lon, width, height);
        if (i === 0) this.ctx.moveTo(p.x, p.y);
        else this.ctx.lineTo(p.x, p.y);
      });
      this.ctx.strokeStyle = '#10b981';
      this.ctx.lineWidth = 5;
      this.ctx.stroke();
    }

    // Draw Road Junction Nodes
    Object.values(this.nodes).forEach(node => {
      const p = this.latLonToCanvas(node.lat, node.lon, width, height);
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      this.ctx.fillStyle = '#64748b';
      this.ctx.fill();
    });

    // Draw Healthcare Facility Markers
    this.facilities.forEach(fac => {
      const p = this.latLonToCanvas(fac.latitude, fac.longitude, width, height);
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);

      if (fac.facility_type === 'EMERGENCY_CENTER') this.ctx.fillStyle = '#e11d48';
      else if (fac.facility_type === 'HOSPITAL') this.ctx.fillStyle = '#0ea5e9';
      else if (fac.facility_type === 'CLINIC') this.ctx.fillStyle = '#10b981';
      else if (fac.facility_type === 'PHARMACY') this.ctx.fillStyle = '#f59e0b';
      else this.ctx.fillStyle = '#8b5cf6';

      this.ctx.fill();
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      // Label
      this.ctx.font = '10px Inter, sans-serif';
      this.ctx.fillStyle = '#f8fafc';
      this.ctx.fillText(fac.name.split(' ')[0], p.x + 10, p.y + 3);
    });

    // Draw User Location
    const userP = this.latLonToCanvas(this.userPos.lat, this.userPos.lon, width, height);
    this.ctx.beginPath();
    this.ctx.arc(userP.x, userP.y, 10, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(userP.x, userP.y, 5, 0, Math.PI * 2);
    this.ctx.fillStyle = '#06b6d4';
    this.ctx.fill();
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    this.ctx.font = 'bold 11px Inter, sans-serif';
    this.ctx.fillStyle = '#38bdf8';
    this.ctx.fillText('YOU (GPS)', userP.x + 12, userP.y + 4);
  }
}

window.localMap = new LocalMapEngine();
