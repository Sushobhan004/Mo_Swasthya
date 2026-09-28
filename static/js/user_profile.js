/**
 * SwasthyaAI Patient Profile & Smart Clinical Context Engine
 * 100% Offline client-side medical passport and safety integration.
 * Automatically synchronizes patient demographics, chronic diseases, and allergy matrices
 * across 3D Triage, Clinical Questionnaires, Pharmacy Safety, and Emergency Dispatch.
 */

class UserProfileManager {
  constructor() {
    this.storageKey = 'swasthya_patient_profile';
    this.profile = this.loadProfile();
  }

  getDefaultProfile() {
    return {
      fullName: "",
      age: 28,
      dob: "",
      gender: "male", // male, female, other
      bloodGroup: "O+", // A+, A-, B+, B-, AB+, AB-, O+, O-
      weight: 65, // kg
      height: 170, // cm
      bmi: 22.5,
      allergies: [], // e.g. ["Penicillin", "Aspirin / NSAIDs", "Sulfa drugs"]
      conditions: [], // e.g. ["Hypertension", "Asthma / COPD", "Type 2 Diabetes"]
      medications: "", // e.g. "Metformin 500mg, Salbutamol Inhaler"
      pregnancyStatus: "no", // no, yes, possible
      emergencyContact: {
        name: "",
        relationship: "Spouse",
        phone: ""
      },
      district: "Bhubaneswar",
      lastUpdated: null,
      isConfigured: false
    };
  }

  loadProfile() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...this.getDefaultProfile(), ...parsed, isConfigured: true };
      }
    } catch (e) {
      console.warn('[UserProfile] Error loading profile from storage:', e);
    }
    return this.getDefaultProfile();
  }

  saveProfile(data) {
    // Calculate BMI
    let weight = parseFloat(data.weight) || 65;
    let height = parseFloat(data.height) || 170;
    let bmi = 22.5;
    if (height > 0) {
      const hMeters = height / 100;
      bmi = parseFloat((weight / (hMeters * hMeters)).toFixed(1));
    }

    const updated = {
      ...this.getDefaultProfile(),
      ...data,
      weight: weight,
      height: height,
      bmi: bmi,
      lastUpdated: new Date().toISOString(),
      isConfigured: true
    };

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(updated));
      this.profile = updated;

      // Sync into IndexedDB health records if available
      if (window.cryptoVault && window.offlineStorage) {
        window.cryptoVault.encryptRecord(updated).then(encPayload => {
          if (encPayload) {
            window.offlineStorage.put('health_records', {
              id: 'primary_patient_profile',
              encrypted_data: encPayload,
              timestamp: new Date().toISOString(),
              type: 'PROFILE_PASSPORT'
            }).catch(err => console.log('Vault sync error:', err));
          }
        }).catch(err => console.log('Vault enc error:', err));
      }

      // Dispatch global event for system-wide reactivity
      window.dispatchEvent(new CustomEvent('swasthya_profile_updated', {
        detail: { profile: this.profile }
      }));

      return { success: true, profile: this.profile };
    } catch (err) {
      console.error('[UserProfile] Failed to save profile:', err);
      return { success: false, error: err.message };
    }
  }

  clearProfile() {
    try {
      localStorage.removeItem(this.storageKey);
      this.profile = this.getDefaultProfile();
      window.dispatchEvent(new CustomEvent('swasthya_profile_updated', {
        detail: { profile: this.profile }
      }));
      return true;
    } catch (err) {
      console.error('[UserProfile] Failed to clear profile:', err);
      return false;
    }
  }

  /**
   * Returns a concise summary object that other clinical subsystems can fetch.
   */
  getClinicalContext() {
    const p = this.profile;
    const ageNum = parseInt(p.age, 10) || 28;

    let calculatedAgeGroup = "adult";
    if (ageNum < 12) calculatedAgeGroup = "child";
    else if (ageNum <= 17) calculatedAgeGroup = "adolescent";
    else if (ageNum >= 65) calculatedAgeGroup = "senior";

    return {
      isConfigured: p.isConfigured,
      fullName: p.fullName || "Anonymous Patient",
      age: ageNum,
      ageGroup: calculatedAgeGroup,
      gender: p.gender || "male",
      bloodGroup: p.bloodGroup || "Unknown",
      weightKg: p.weight,
      heightCm: p.height,
      bmi: p.bmi,
      allergies: Array.isArray(p.allergies) ? p.allergies : [],
      conditions: Array.isArray(p.conditions) ? p.conditions : [],
      medications: p.medications || "",
      isPregnancyPossible: p.gender === 'female' && (p.pregnancyStatus === 'yes' || p.pregnancyStatus === 'possible'),
      emergencyContact: p.emergencyContact || {},
      district: p.district || "Bhubaneswar",
      summaryString: p.isConfigured
        ? `${p.fullName || 'Patient'} (${ageNum}y, ${p.bloodGroup || 'Blood Type N/A'}, ${p.gender})`
        : "Guest Profile (Default Adult)"
    };
  }

  /**
   * Safety Conflict Checker: checks if a medication or treatment conflicts with patient profile.
   */
  checkMedicationSafety(medicineNameOrClass) {
    if (!this.profile.isConfigured) return { hasConflict: false, warnings: [] };

    const query = String(medicineNameOrClass).toLowerCase();
    const warnings = [];
    const allergies = this.profile.allergies || [];
    const conditions = this.profile.conditions || [];

    // 1. Check Allergies
    allergies.forEach(allergy => {
      const aLower = allergy.toLowerCase();
      if (
        (aLower.includes('penicillin') && (query.includes('penicillin') || query.includes('amoxicillin') || query.includes('ampicillin') || query.includes('augmentin'))) ||
        (aLower.includes('sulfa') && (query.includes('sulfa') || query.includes('bactrim') || query.includes('cotrimoxazole') || query.includes('sulfamethoxazole'))) ||
        (aLower.includes('aspirin') && (query.includes('aspirin') || query.includes('disprin') || query.includes('ecosprin'))) ||
        (aLower.includes('nsaid') && (query.includes('ibuprofen') || query.includes('diclofenac') || query.includes('naproxen') || query.includes('brufen') || query.includes('voveran'))) ||
        (aLower.includes('paracetamol') && (query.includes('paracetamol') || query.includes('acetaminophen') || query.includes('crocin') || query.includes('dolo')))
      ) {
        warnings.push(`⚠️ ALLERGY WARNING: You have a recorded allergy to "${allergy}". Avoid taking "${medicineNameOrClass}".`);
      }
    });

    // 2. Check Chronic Conditions Contraindications
    conditions.forEach(cond => {
      const cLower = cond.toLowerCase();
      if (cLower.includes('asthma') && (query.includes('aspirin') || query.includes('ibuprofen') || query.includes('diclofenac') || query.includes('nsaid') || query.includes('propranolol') || query.includes('atenolol'))) {
        warnings.push(`⚠️ CONTRAINDICATION: Patient has Asthma. NSAIDs or non-selective Beta-blockers may trigger bronchospasm.`);
      }
      if (cLower.includes('hypertension') && (query.includes('pseudoephedrine') || query.includes('phenylephrine') || query.includes('decongestant') || query.includes('nsaid'))) {
        warnings.push(`⚠️ CAUTION: Patient has Hypertension. Oral decongestants and long-term NSAIDs can elevate arterial blood pressure.`);
      }
      if (cLower.includes('diabetes') && (query.includes('corticosteroid') || query.includes('prednisolone') || query.includes('dexamethasone') || query.includes('cough syrup with sugar'))) {
        warnings.push(`⚠️ CAUTION: Patient has Diabetes. Corticosteroids or sugar-based syrups can cause acute hyperglycemia.`);
      }
      if (cLower.includes('kidney') && (query.includes('ibuprofen') || query.includes('diclofenac') || query.includes('nsaid') || query.includes('aminoglycoside'))) {
        warnings.push(`⚠️ NEPHROTOXICITY ALERT: Patient has Kidney Disease. NSAIDs reduce renal perfusion and should be avoided.`);
      }
      if (cLower.includes('ulcer') && (query.includes('aspirin') || query.includes('nsaid') || query.includes('ibuprofen') || query.includes('diclofenac'))) {
        warnings.push(`⚠️ GI BLEED WARNING: Patient has Peptic Ulcer history. Avoid NSAIDs or Aspirin without gastroprotection.`);
      }
    });

    return {
      hasConflict: warnings.length > 0,
      warnings: warnings
    };
  }
}

// Global Singleton Instance
window.userProfile = new UserProfileManager();
