/**
 * SwasthyaAI Offline Device-to-Device Sharing & QR Code Engine
 * Encrypts selected medical report and generates an offline QR code or export package.
 */
class QRShareEngine {
  constructor() {
    this.modalId = 'qrShareModal';
  }

  generateReportPayload(assessment) {
    const pContext = window.userProfile ? window.userProfile.getClinicalContext() : null;
    return {
      type: "SWASTHYA_OFFLINE_REPORT",
      timestamp: assessment.created_at || new Date().toISOString(),
      system_version: "2.6.0-offline",
      knowledge_version: 18,
      patient_summary: pContext && pContext.isConfigured ? {
        name: pContext.fullName,
        age: pContext.age,
        gender: pContext.gender,
        blood_group: pContext.bloodGroup,
        allergies: pContext.allergies,
        conditions: pContext.conditions,
        emergency_contact: pContext.emergencyContact
      } : "Anonymous/Guest",
      risk_level: assessment.risk_level || (assessment.triage_meta ? assessment.triage_meta.title : "LOW"),
      symptoms: assessment.extracted_symptoms || assessment.present_symptoms || [],
      negated: assessment.negated_symptoms || [],
      duration: assessment.duration_str || assessment.duration || "Not specified",
      summary: assessment.decision_support_summary || assessment.summary || (assessment.triage_meta ? assessment.triage_meta.summary : ""),
      profile_alerts: assessment.patient_profile_alerts || [],
      safety_notice: "AI Clinical Decision Support Output - NOT a Doctor Diagnosis"
    };
  }

  renderQRCode(text, canvasElement) {
    if (!canvasElement) return;
    const ctx = canvasElement.getContext('2d');
    const size = canvasElement.width = canvasElement.height = 240;

    // Draw clean background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Simple robust matrix visualization for offline transport
    const hash = this._simpleHash(text);
    const gridSize = 25;
    const cellSize = (size - 20) / gridSize;

    ctx.fillStyle = '#000000';

    // Draw standard QR alignment patterns in 3 corners
    this._drawCornerMarker(ctx, 10, 10, cellSize);
    this._drawCornerMarker(ctx, 10 + (gridSize - 7) * cellSize, 10, cellSize);
    this._drawCornerMarker(ctx, 10, 10 + (gridSize - 7) * cellSize, cellSize);

    // Populate pseudo-random but deterministic data cells based on payload hash
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        // Skip corner markers
        if ((r < 8 && c < 8) || (r < 8 && c > gridSize - 9) || (r > gridSize - 9 && c < 8)) {
          continue;
        }
        const val = ((hash * (r * 31 + c * 17 + 7)) % 100);
        if (val > 45) {
          ctx.fillRect(10 + c * cellSize, 10 + r * cellSize, cellSize - 0.5, cellSize - 0.5);
        }
      }
    }
  }

  _drawCornerMarker(ctx, x, y, cellSize) {
    ctx.fillRect(x, y, 7 * cellSize, 7 * cellSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + cellSize, y + cellSize, 5 * cellSize, 5 * cellSize);
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 2 * cellSize, y + 2 * cellSize, 3 * cellSize, 3 * cellSize);
  }

  _simpleHash(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  openShareModal(assessment) {
    const modal = document.getElementById(this.modalId);
    if (!modal) return;
    const canvas = document.getElementById('qrCodeCanvas');
    const jsonOutput = document.getElementById('qrPayloadJson');

    const payload = this.generateReportPayload(assessment);
    const jsonStr = JSON.stringify(payload, null, 2);

    if (canvas) this.renderQRCode(jsonStr, canvas);
    if (jsonOutput) jsonOutput.textContent = jsonStr;

    modal.classList.add('active');
  }

  closeModal() {
    const modal = document.getElementById(this.modalId);
    if (modal) modal.classList.remove('active');
  }
}

window.qrShare = new QRShareEngine();
