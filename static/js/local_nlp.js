/**
 * SwasthyaAI Client-Side Local NLP & Multi-Attribute Extraction Engine
 * 100% Offline natural language processor for symptom extraction, anatomical parsing,
 * negation cues, duration, severity, and radiation analysis.
 */

class LocalNLPEngine {
  constructor() {
    this.negationCues = [
      "no", "not", "don't have", "dont have", "does not have", "doesn't have",
      "without", "denies", "denied", "free of", "never had", "negative for",
      "neither", "nor", "rule out", "no signs of", "nil"
    ];

    this.pseudoNegations = [
      "no doubt", "not only", "without doubt", "no wonder"
    ];

    this.severityTerms = {
      "mild": "Mild", "slight": "Mild", "low grade": "Mild", "little": "Mild", "bearable": "Mild",
      "moderate": "Moderate", "medium": "Moderate", "uncomfortable": "Moderate", "noticeable": "Moderate",
      "severe": "Severe", "intense": "Severe", "high": "Severe", "extreme": "Severe",
      "unbearable": "Severe", "acute": "Severe", "very high": "Severe", "crushing": "Severe",
      "excruciating": "Severe", "sharp": "Severe", "piercing": "Severe", "worst": "Severe"
    };

    this.durationPatterns = [
      /(\d+)\s*(hour|hours|hr|hrs|h)\b/i,
      /(\d+)\s*(day|days|d)\b/i,
      /(\d+)\s*(week|weeks|wk|wks)\b/i,
      /(\d+)\s*(month|months|mo|mos)\b/i,
      /(since\s+yesterday)/i,
      /(since\s+morning)/i,
      /(since\s+last\s+night)/i,
      /(just\s+started)/i,
      /(few\s+days)/i,
      /(few\s+hours)/i
    ];

    this.sideRadiationPatterns = [
      /(radiat\w+\s+to\s+(?:left|right)?\s*(?:arm|jaw|back|shoulder|neck|groin))/i,
      /(shooting\s+to\s+(?:left|right)?\s*(?:arm|jaw|back|shoulder|neck|groin|leg))/i,
      /\b(left\s+side|right\s+side|left|right|bilateral|both\s+sides)\b/i
    ];

    this.aggravatingPatterns = [
      /(worse\s+when\s+\w+(?:\s+\w+)?)/i,
      /(worsens\s+with\s+\w+(?:\s+\w+)?)/i,
      /(triggered\s+by\s+\w+(?:\s+\w+)?)/i,
      /(after\s+(?:eating|walking|running|lifting|exercise|meals))/i
    ];

    this.injuryPatterns = [
      /\b(trauma|fell|fall|accident|hit|sprain|twisted|injury|struck|fracture|collision)\b/i
    ];
  }

  normalizeText(text) {
    let t = text.toLowerCase();
    const contractions = {
      "can't": "cannot", "won't": "will not", "n't": " not",
      "'re": " are", "'s": " is", "'d": " would",
      "'ll": " will", "'ve": " have", "'m": " am"
    };
    for (const [k, v] of Object.entries(contractions)) {
      t = t.replaceAll(k, v);
    }
    t = t.replace(/[^\w\s\.\,\;\-]/g, ' ');
    return t.replace(/\s+/g, ' ').trim();
  }

  extractDuration(text) {
    for (const pattern of this.durationPatterns) {
      const match = text.match(pattern);
      if (match) return match[0];
    }
    return "Not specified";
  }

  extractSeverity(text) {
    const norm = text.toLowerCase();
    for (const [term, level] of Object.entries(this.severityTerms)) {
      const regex = new RegExp(`\\b${term}\\b`, 'i');
      if (regex.test(norm)) return level;
    }
    return "Moderate";
  }

  extractSideAndRadiation(text) {
    const findings = [];
    for (const pattern of this.sideRadiationPatterns) {
      const match = text.match(pattern);
      if (match) findings.push(match[0]);
    }
    return findings.length > 0 ? findings.join(', ') : "None identified";
  }

  extractAggravatingFactors(text) {
    for (const pattern of this.aggravatingPatterns) {
      const match = text.match(pattern);
      if (match) return match[0];
    }
    return "None reported";
  }

  extractInjury(text) {
    return this.injuryPatterns.some(pat => pat.test(text));
  }

  isNegatedContext(text, startPos, windowChars = 40) {
    let preceding = text.substring(Math.max(0, startPos - windowChars), startPos).toLowerCase();

    const breakers = [", but", ". but", "; but", " but ", " however ", " although ", " yet ", ". ", "; "];
    for (const b of breakers) {
      if (preceding.includes(b)) {
        preceding = preceding.split(b).pop();
      }
    }

    for (const p of this.pseudoNegations) {
      if (preceding.includes(p)) return false;
    }

    for (const cue of this.negationCues) {
      const regex = new RegExp(`\\b${cue}\\b`, 'i');
      if (regex.test(preceding)) return true;
    }
    return false;
  }

  async parse(rawInput, selectedRegionId = null) {
    const cleanText = this.normalizeText(rawInput);
    const presentSymptoms = [];
    const negatedSymptoms = [];

    const duration = this.extractDuration(rawInput);
    const severity = this.extractSeverity(rawInput);
    const radiation = this.extractSideAndRadiation(rawInput);
    const aggravating = this.extractAggravatingFactors(rawInput);
    const hasInjury = this.extractInjury(rawInput);

    // Load canonical symptoms from offlineStorage
    let symList = [];
    if (window.offlineStorage) {
      symList = await window.offlineStorage.getAll('symptoms');
    }

    if (!symList || symList.length === 0) {
      symList = [
        { code: "FEV", name: "Fever", common_names: "fever, high temp, feeling hot, pyrexia, chills" },
        { code: "CHSTP", name: "Chest Pain / Pressure", common_names: "chest pain, chest pressure, crushing chest pain, tightness" },
        { code: "DYSP", name: "Shortness of Breath", common_names: "shortness of breath, difficulty breathing, breathlessness, dyspnea" },
        { code: "HDCH", name: "Headache", common_names: "headache, head pain, migraine, throbbing head" },
        { code: "PAIN", name: "Pain", common_names: "pain, ache, hurting, soreness, cramp, discomfort, sharp pain" },
        { code: "SWELL", name: "Swelling", common_names: "swelling, swollen, puffiness, inflammation, edema" },
        { code: "STIFF", name: "Stiffness", common_names: "stiffness, rigid, reduced movement, tight joint" },
        { code: "NUMB", name: "Numbness / Tingling", common_names: "numbness, tingling, pins and needles, loss of feeling" },
        { code: "BURN", name: "Burning Sensation", common_names: "burning, burning sensation, heartburn, burning urination" }
      ];
    }

    // Match symptoms
    symList.forEach(sym => {
      const aliases = (sym.common_names || sym.name).split(',').map(s => s.trim().toLowerCase());
      for (const alias of aliases) {
        if (!alias || alias.length < 3) continue;
        const regex = new RegExp(`\\b${alias}\\b`, 'gi');
        let match;
        while ((match = regex.exec(cleanText)) !== null) {
          const isNeg = this.isNegatedContext(cleanText, match.index);
          const entry = {
            code: sym.code,
            name: sym.name,
            matched_text: match[0],
            is_emergency: !!sym.is_emergency_flag
          };

          if (isNeg) {
            if (!negatedSymptoms.some(s => s.code === entry.code)) negatedSymptoms.push(entry);
          } else {
            if (!presentSymptoms.some(s => s.code === entry.code)) presentSymptoms.push(entry);
          }
        }
      }
    });

    // If general pain/symptom was described and a specific region was selected
    if (presentSymptoms.length === 0 && rawInput.trim().length > 0) {
      presentSymptoms.push({
        code: "GEN_SYMPTOM",
        name: rawInput.trim().substring(0, 40),
        matched_text: rawInput.trim(),
        is_emergency: false
      });
    }

    return {
      raw_text: rawInput,
      clean_text: cleanText,
      selected_region_id: selectedRegionId,
      present_symptoms: presentSymptoms,
      negated_symptoms: negatedSymptoms,
      duration: duration,
      severity: severity,
      side_radiation: radiation,
      aggravating_factor: aggravating,
      is_injury: hasInjury
    };
  }
}

window.localNLP = new LocalNLPEngine();
