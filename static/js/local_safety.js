/**
 * SwasthyaAI Auditable Deterministic 4-Tier Clinical Triage & Safety Engine
 * 100% Offline rule-based triage system for multi-factor clinical risk stratification.
 * 
 * Triage Hierarchy:
 * LEVEL 4: EMERGENCY (Immediate 112/108 / Emergency Department)
 * LEVEL 3: URGENT MEDICAL CARE (Same-day clinic evaluation)
 * LEVEL 2: MEDICAL REVIEW (Routine doctor consultation within 24-48 hours)
 * LEVEL 1: SELF-CARE & FIRST-AID (Safe home measures & symptom monitoring)
 */

class LocalSafetyEngine {
  constructor() {
    this.emergencyRules = [
      {
        rule_id: "EMERG-CARD-01",
        name: "Suspected Acute Coronary Syndrome (Myocardial Infarction / Angina)",
        region_ids: ["heart", "chest", "shoulder", "right_shoulder", "left_shoulder", "upper_abdomen", "all"],
        keywords: ["crushing", "radiating to arm", "radiating to jaw", "sweating", "cold clammy", "shortness of breath", "heart attack", "crushing chest pain"],
        min_severity: "Moderate",
        triage_level: 4,
        triage_name: "LEVEL 4: EMERGENCY MEDICAL ALERT",
        urgency: "Immediate Emergency Dispatch (112 / 108)",
        warning_message: "RED FLAG: Symptoms are consistent with acute cardiac distress or myocardial ischemia. Immediate emergency hospital transfer is crucial.",
        first_aid: [
          "Have the person sit down immediately, rest comfortably, and remain calm.",
          "Loosen tight clothing around the neck and chest.",
          "Call national emergency dispatch (112 or 108) without delay.",
          "If the patient has prescribed sublingual nitroglycerin (GTN), assist them in taking it as directed.",
          "If the person becomes unresponsive and stops breathing normally, begin cardiopulmonary resuscitation (CPR) immediately."
        ],
        otc_guidance: "Do NOT attempt home self-treatment or oral painkillers. Emergency chewable Aspirin (300mg) should only be given if specifically directed by emergency medical dispatch and no known aspirin allergy exists."
      },
      {
        rule_id: "EMERG-STROKE-01",
        name: "Acute Stroke / Focal Neurological Deficit (FAST Alert)",
        region_ids: ["brain", "head", "mouth_throat", "all"],
        keywords: ["facial drooping", "drooping face", "arm weakness", "one-sided", "slurred speech", "speech arrest", "hemiparesis", "stroke"],
        min_severity: "Any",
        triage_level: 4,
        triage_name: "LEVEL 4: EMERGENCY MEDICAL ALERT",
        urgency: "Immediate Emergency Dispatch (112 / 108)",
        warning_message: "RED FLAG: Symptoms indicate potential acute cerebral ischemia or stroke. 'Time is Brain'—every minute counts for thrombolysis window.",
        first_aid: [
          "Note the EXACT time symptoms first started.",
          "Do NOT give anything to eat or drink (choking hazard due to swallowing impairment).",
          "Keep the patient lying comfortably with head slightly elevated (30 degrees).",
          "Call 112 / 108 immediately and inform the dispatcher of a suspected acute stroke."
        ],
        otc_guidance: "Do NOT administer aspirin or medications at home prior to a hospital CT/MRI scan, as bleeding strokes (hemorrhagic) must first be ruled out."
      },
      {
        rule_id: "EMERG-RESP-01",
        name: "Severe Acute Respiratory Compromise / Hypoxemia",
        region_ids: ["lungs", "mouth_throat", "chest", "throat", "all"],
        keywords: ["cannot breathe", "gasping", "struggling for air", "cyanosis", "blue lips", "stridor", "asthma attack", "choking"],
        min_severity: "Severe",
        triage_level: 4,
        triage_name: "LEVEL 4: EMERGENCY MEDICAL ALERT",
        urgency: "Immediate Emergency Dispatch (112 / 108)",
        warning_message: "RED FLAG: Severe airway constriction or respiratory failure requires urgent oxygenation and clinical airway management.",
        first_aid: [
          "Help the person sit upright in a tripod position (leaning slightly forward).",
          "Administer rescue bronchodilator inhaler (e.g. Salbutamol via spacer) if prescribed for asthma/COPD.",
          "Ensure fresh ventilation and keep the person calm.",
          "Call 112 / 108 immediately if lips turn blue or the person cannot speak complete words."
        ],
        otc_guidance: "Do NOT use over-the-counter cough suppressants or sedatives during acute breathing distress."
      },
      {
        rule_id: "EMERG-SURG-01",
        name: "Acute Peritonitis / Suspected Appendicitis with Perforation Risk",
        region_ids: ["lower_right_abdomen", "upper_abdomen", "lower_left_abdomen", "intestines", "stomach", "all"],
        keywords: ["rigid belly", "board like", "severe right lower", "rebound tenderness", "appendicitis", "sharp pain when walking", "vomiting with severe belly pain"],
        min_severity: "Severe",
        triage_level: 4,
        triage_name: "LEVEL 4: EMERGENCY MEDICAL ALERT",
        urgency: "Immediate Hospital Surgical Evaluation",
        warning_message: "RED FLAG: Symptoms are suspicious for acute surgical abdomen (such as acute appendicitis or hollow organ perforation).",
        first_aid: [
          "Keep the patient fasting (Nil by Mouth)—do not give food or drink in case emergency surgery is required.",
          "Do NOT apply heat pads or hot water bottles to the abdomen (heat increases risk of appendix rupture).",
          "Do NOT give laxatives or enemas.",
          "Transport immediately to the nearest hospital with general surgical facilities."
        ],
        otc_guidance: "Avoid heavy painkillers before surgical examination as they can mask vital diagnostic signs."
      },
      {
        rule_id: "EMERG-MALE-01",
        name: "Acute Testicular Torsion Warning",
        region_ids: ["testes_scrotum", "penis", "prostate", "pelvis", "male_reproductive", "all"],
        keywords: ["sudden testicular pain", "severe scrotum pain", "swollen testicle", "testicular torsion", "groin pain in male", "testis pain", "scrotum pain"],
        min_severity: "Moderate",
        triage_level: 4,
        triage_name: "LEVEL 4: EMERGENCY MEDICAL ALERT",
        urgency: "Emergency Surgical Evaluation (Within 6 Hours)",
        warning_message: "RED FLAG: Sudden acute testicular pain must be treated as suspected testicular torsion until proven otherwise. Ischemic damage can occur within 6 hours without detorsion.",
        first_aid: [
          "Proceed immediately to the Emergency Room.",
          "Avoid walking if painful; keep patient resting comfortably.",
          "Keep patient fasting in preparation for potential emergency Doppler ultrasound and exploration."
        ],
        otc_guidance: "Do NOT delay hospital arrival to try home remedies or analgesics."
      },
      {
        rule_id: "EMERG-FEM-01",
        name: "Acute Ectopic Pregnancy or Ovarian Torsion Warning",
        region_ids: ["uterus_ovaries", "vulva_vagina", "breast", "lower_right_abdomen", "lower_left_abdomen", "pelvis", "all"],
        keywords: ["pregnant with pain", "positive pregnancy test", "severe pelvic pain", "ectopic", "fainting with pelvic pain", "heavy vaginal bleeding", "ovary pain"],
        min_severity: "Moderate",
        triage_level: 4,
        triage_name: "LEVEL 4: EMERGENCY MEDICAL ALERT",
        urgency: "Immediate Emergency Gynecological Care",
        warning_message: "RED FLAG: Acute unilateral pelvic pain in women of childbearing potential, especially with pregnancy possibility or syncope, warrants emergency ultrasound.",
        first_aid: [
          "Have the patient lie flat with legs elevated if dizzy.",
          "Do NOT insert tampons; use pads to monitor bleeding amount.",
          "Transport immediately to the nearest hospital with emergency obstetric/gynecologic care."
        ],
        otc_guidance: "All NSAIDs and standard home analgesics are contraindicated when pregnancy is suspected."
      },
      {
        rule_id: "EMERG-TRAUMA-01",
        name: "High-Energy Trauma / Suspected Fracture with Deformity or Neurovascular Deficit",
        region_ids: ["knee", "right_knee", "left_knee", "hip_pelvis", "gluteal", "ankle_foot", "right_ankle", "left_ankle", "shoulder", "right_shoulder", "left_shoulder", "arm_elbow", "right_bicep", "left_bicep", "right_elbow", "left_elbow", "right_wrist", "left_wrist", "spine_back", "spine", "upper_back", "lower_back", "head", "all"],
        keywords: ["deformity", "bone sticking out", "cannot bear weight", "hit by car", "fell from height", "loss of pulse", "numb leg after fracture"],
        min_severity: "Severe",
        triage_level: 4,
        triage_name: "LEVEL 4: EMERGENCY MEDICAL ALERT",
        urgency: "Immediate Emergency Orthopedic / Trauma Care",
        warning_message: "RED FLAG: Severe deformity, inability to bear weight after high-energy impact, or neurovascular compromise requires emergency stabilization.",
        first_aid: [
          "Do NOT attempt to straighten or push back a deformed or fractured limb.",
          "Splint and support the limb in the position found.",
          "Apply sterile dressing over open wounds without putting pressure on exposed bone.",
          "Call 112 / 108 immediately."
        ],
        otc_guidance: "Keep patient fasting for potential orthopedic reduction or surgical fixation under anesthesia."
      }
    ];

    this.urgentRules = [
      {
        rule_id: "URGENT-RENAL-01",
        name: "Renal Colic / Obstructive Urolithiasis",
        region_ids: ["kidneys", "bladder", "lower_right_abdomen", "lower_left_abdomen"],
        keywords: ["kidney stone", "severe flank", "pain shooting to groin", "blood in urine", "waves of pain"],
        triage_level: 3,
        triage_name: "LEVEL 3: URGENT MEDICAL CARE (Today)",
        urgency: "Same-Day Clinic / Urgent Care Center",
        warning_message: "URGENT: Intense spasmodic flank pain with hematuria suggests an acute obstructing kidney stone requiring ultrasound and medical expulsion therapy.",
        first_aid: [
          "Rest in a comfortable position, applying warm compress to the painful flank.",
          "Drink fluids moderately if able to keep liquids down.",
          "Seek medical evaluation today to rule out urinary obstruction or infection."
        ],
        otc_guidance: "Oral Paracetamol or Ibuprofen (only if normal kidney function confirmed) may be used short-term as directed by a healthcare provider."
      },
      {
        rule_id: "URGENT-INFECTION-01",
        name: "Febrile Localized Infection / Spreading Cellulitis",
        region_ids: ["wrist_hand", "lower_leg_calf", "ankle_foot", "knee", "breast", "mouth_throat"],
        keywords: ["high fever", "spreading redness", "hot to touch", "pus", "swollen glands", "fever with joint pain"],
        triage_level: 3,
        triage_name: "LEVEL 3: URGENT MEDICAL CARE (Today)",
        urgency: "Clinic Consultation Within 12-24 Hours",
        warning_message: "URGENT: Signs of active bacterial soft tissue infection, joint effusion, or tonsillitis requiring physician diagnosis and appropriate prescription antimicrobials.",
        first_aid: [
          "Keep the affected area clean and elevated.",
          "Mark the border of redness with a clean pen to monitor if it spreads.",
          "Drink clean water and rest."
        ],
        otc_guidance: "Paracetamol for fever relief. Antibiotics should NEVER be taken without a prescription and clinical examination."
      }
    ];
  }

  evaluate({
    regionData = null,
    nlpResult = {},
    duration = "",
    severity = "Moderate",
    ageGroup = "adult",
    isPregnancyPossible = false,
    selectedSymptoms = []
  }) {
    const rawText = (nlpResult.clean_text || "").toLowerCase();
    const regionId = (regionData ? regionData.id : nlpResult.selected_region_id) || "";
    const symNames = (nlpResult.present_symptoms || []).map(s => s.name.toLowerCase()).concat(selectedSymptoms.map(s => s.toLowerCase()));

    let highestTriageLevel = 1;
    let matchedRule = null;
    let emergencyAlert = false;

    // Check Level 4 Emergency Rules First
    for (const rule of this.emergencyRules) {
      let regionMatch = rule.region_ids.includes(regionId) || rule.region_ids.includes("all");
      let keywordMatch = rule.keywords.some(kw => rawText.includes(kw) || symNames.some(sn => sn.includes(kw)));

      if (regionMatch && keywordMatch) {
        highestTriageLevel = 4;
        matchedRule = rule;
        emergencyAlert = true;
        break;
      }
    }

    // Check Pregnancy-specific Red Flag override
    if (isPregnancyPossible && (regionId === "uterus_ovaries" || regionId === "lower_right_abdomen" || regionId === "lower_left_abdomen" || regionId === "bladder")) {
      if (severity === "Severe" || rawText.includes("pain") || rawText.includes("bleeding") || rawText.includes("spotting")) {
        highestTriageLevel = 4;
        matchedRule = this.emergencyRules.find(r => r.rule_id === "EMERG-FEM-01");
        emergencyAlert = true;
      }
    }

    // Check Level 3 Urgent Rules if not emergency
    if (highestTriageLevel < 4) {
      for (const rule of this.urgentRules) {
        let regionMatch = rule.region_ids.includes(regionId) || rule.region_ids.includes("all");
        let keywordMatch = rule.keywords.some(kw => rawText.includes(kw) || symNames.some(sn => sn.includes(kw)));

        if (regionMatch && keywordMatch) {
          highestTriageLevel = 3;
          matchedRule = rule;
          break;
        }
      }
    }

    // Level 2 Medical Review: Moderate severity, chronic duration (> 2 weeks), high-risk age (child or senior), or specific persistent symptoms
    if (highestTriageLevel < 3) {
      if (severity === "Severe" || duration.includes("week") || duration.includes("month") || ageGroup === "child" || ageGroup === "senior" || rawText.includes("lump") || rawText.includes("weight loss") || rawText.includes("fever")) {
        highestTriageLevel = 2;
      }
    }

    // Construct Structured Clinical Output
    const triageLevelMetadata = {
      1: {
        code: "LEVEL_1_SELF_CARE",
        badge_class: "badge-low",
        title: "LEVEL 1: SELF-CARE & FIRST-AID",
        urgency: "Home Self-Care & Active Monitoring",
        color: "var(--neon-emerald)",
        banner_bg: "rgba(16, 185, 129, 0.12)",
        banner_border: "rgba(16, 185, 129, 0.4)",
        summary: "Symptoms appear mild and consistent with low-acuity musculoskeletal strain, minor irritation, or self-limiting complaints. Safe home first-aid and observational rest are appropriate initial steps."
      },
      2: {
        code: "LEVEL_2_MEDICAL_REVIEW",
        badge_class: "badge-medium",
        title: "LEVEL 2: MEDICAL REVIEW RECOMMENDED",
        urgency: "Consult a Doctor Within 24 - 48 Hours",
        color: "var(--neon-amber)",
        banner_bg: "rgba(245, 158, 11, 0.12)",
        banner_border: "rgba(245, 158, 11, 0.4)",
        summary: "Symptoms suggest an active condition that warrants clinical review by a healthcare practitioner. Schedule a routine doctor or outpatient clinic consultation within 24 to 48 hours."
      },
      3: {
        code: "LEVEL_3_URGENT_CARE",
        badge_class: "badge-high",
        title: "LEVEL 3: URGENT CLINICAL EVALUATION",
        urgency: "Seek Urgent Medical Care Today",
        color: "var(--neon-orange, #f97316)",
        banner_bg: "rgba(249, 115, 22, 0.15)",
        banner_border: "rgba(249, 115, 22, 0.5)",
        summary: "Symptoms require timely professional medical attention today at a nearby clinic or urgent care facility to prevent complications or worsening distress."
      },
      4: {
        code: "LEVEL_4_EMERGENCY",
        badge_class: "badge-urgent",
        title: "LEVEL 4: EMERGENCY MEDICAL ALERT",
        urgency: "Immediate 112 / 108 Emergency Dispatch",
        color: "var(--neon-rose)",
        banner_bg: "rgba(225, 29, 72, 0.22)",
        banner_border: "rgba(225, 29, 72, 0.8)",
        summary: "CRITICAL: Detected signs match life-threatening clinical red-flag criteria. Proceed immediately to the nearest Emergency Department or call emergency ambulance services."
      }
    };

    const currentLevelMeta = triageLevelMetadata[highestTriageLevel];

    // Build Possible Causes / Explanations based on Region and Keywords
    let possibleExplanations = [];
    if (regionData && regionData.common_symptoms) {
      possibleExplanations = [
        `Symptoms in the ${regionData.name} may be associated with localized musculoskeletal strain, tissue inflammation, or organ-specific irritation.`,
        `Clinical presentation may correspond to common functional conditions affecting the ${regionData.system} system.`,
        `Further physical examination by a licensed medical practitioner is necessary to establish a verified clinical diagnosis.`
      ];
    } else {
      possibleExplanations = [
        "Reported symptoms may correspond to localized inflammatory or strain processes.",
        "Differential possibilities depend on comprehensive laboratory and clinical examination."
      ];
    }

    if (matchedRule) {
      possibleExplanations.unshift(`Primary Clinical Consideration: ${matchedRule.name}`);
    }

    // Build First-Aid Steps
    let firstAidList = [];
    if (matchedRule && matchedRule.first_aid) {
      firstAidList = matchedRule.first_aid;
    } else if (regionData && regionData.first_aid) {
      firstAidList = [regionData.first_aid];
    } else {
      firstAidList = [
        "Rest the affected body area and avoid activities that trigger or intensify pain.",
        "Apply a cold pack wrapped in a protective cloth for 15 minutes if acute swelling or injury is present.",
        "Maintain adequate oral hydration and monitor for any progressive warning signs."
      ];
    }

    // Build What to Avoid
    let whatToAvoid = [
      "Avoid dangerous unverified home remedies or forceful manipulation of painful joints.",
      "Avoid heavy physical exertion, lifting, or sudden strenuous movements.",
      "Do NOT delay seeking emergency medical help if red-flag signs manifest."
    ];

    // Build Safe OTC Medicine Guidance
    let otcGuidanceText = "";
    if (matchedRule && matchedRule.otc_guidance) {
      otcGuidanceText = matchedRule.otc_guidance;
    } else if (regionData && regionData.medication_info) {
      otcGuidanceText = regionData.medication_info;
    } else {
      otcGuidanceText = "Over-the-counter pain relief (such as Paracetamol) may be used strictly following package directions for mild discomfort, provided no contraindications exist.";
    }

    // High-Risk Demographic Warnings
    let demographicPrecautions = [];
    if (ageGroup === "child") {
      demographicPrecautions.push("PEDIATRIC WARNING: Children require precise weight-based dosing. Aspirin is strictly contraindicated in children due to Reye's syndrome risk. Consult a pediatrician.");
    }
    if (ageGroup === "senior") {
      demographicPrecautions.push("GERIATRIC CAUTION: Elderly individuals have higher susceptibility to medication side effects, renal clearance changes, and atypical symptom presentation. Consult a physician.");
    }
    if (isPregnancyPossible) {
      demographicPrecautions.push("PREGNANCY WARNING: NSAIDs and most OTC medicines are contraindicated or require obstetric clearance during pregnancy. Consult an obstetrician before taking any medication.");
    }

    // Patient Profile Auto-Fetched Safety Alerts
    const patientProfileAlerts = [];
    const activeProfile = (window.userProfile && window.userProfile.profile && window.userProfile.profile.isConfigured)
      ? window.userProfile.profile
      : null;

    if (activeProfile) {
      const allergies = activeProfile.allergies || [];
      const conditions = activeProfile.conditions || [];

      // Check allergies
      allergies.forEach(allg => {
        const aLow = allg.toLowerCase();
        if (aLow.includes('aspirin') || aLow.includes('nsaid')) {
          patientProfileAlerts.push(`⚠️ PROFILE ALLERGY CONFLICT: Patient has documented allergy to "${allg}". DO NOT take Aspirin, Ibuprofen, or other NSAIDs.`);
          whatToAvoid.push(`Aspirin or NSAID painkillers (Patient is allergic to ${allg})`);
        }
        if (aLow.includes('penicillin') || aLow.includes('amoxicillin')) {
          patientProfileAlerts.push(`⚠️ PROFILE ALLERGY ALERT: Patient has Penicillin allergy. If antibiotics are discussed by a clinician, non-penicillin classes must be selected.`);
        }
        if (aLow.includes('sulfa')) {
          patientProfileAlerts.push(`⚠️ PROFILE ALLERGY ALERT: Patient has Sulfa allergy.`);
        }
      });

      // Check chronic conditions
      conditions.forEach(cond => {
        const cLow = cond.toLowerCase();
        if (cLow.includes('asthma') || cLow.includes('copd')) {
          patientProfileAlerts.push(`🫁 COMORBIDITY ALERT: Patient has Asthma / COPD. Avoid NSAID analgesics which can precipitate bronchospasms.`);
          if (regionId === 'lungs' || regionId === 'chest') {
            if (highestTriageLevel < 3) highestTriageLevel = 3; // Elevate acuity for respiratory distress with history of asthma
          }
        }
        if (cLow.includes('heart') || cLow.includes('cad') || cLow.includes('hypertension')) {
          patientProfileAlerts.push(`❤️ CARDIOVASCULAR VULNERABILITY: Patient has documented ${cond}. Chest symptoms or shortness of breath must be monitored with high vigilance.`);
          if ((regionId === 'heart' || regionId === 'chest') && highestTriageLevel < 3) {
            highestTriageLevel = 3;
          }
        }
        if (cLow.includes('diabetes')) {
          patientProfileAlerts.push(`🩺 METABOLIC ALERT: Patient has Diabetes. Wound healing is impaired and atypical painless ischemic signs can occur.`);
        }
        if (cLow.includes('kidney')) {
          patientProfileAlerts.push(`🚽 RENAL FUNCTION CAUTION: Patient has Kidney Disease. Avoid nephrotoxic OTC agents (NSAIDs).`);
        }
      });
    }

    // When to Seek Urgent Care
    let whenToSeekCare = regionData && regionData.when_to_seek_care
      ? regionData.when_to_seek_care
      : "Seek immediate medical care if pain worsens progressively, high fever develops, shortness of breath occurs, or you experience dizziness.";

    // Red Flags
    let redFlagsList = regionData && regionData.red_flags ? regionData.red_flags : [
      "Sudden loss of consciousness or severe confusion",
      "Severe chest pressure or breathing difficulty",
      "Inability to move a limb or bear weight",
      "Uncontrolled bleeding or signs of shock"
    ];

    return {
      triage_level: highestTriageLevel,
      triage_meta: currentLevelMeta,
      is_emergency: emergencyAlert,
      region_name: regionData ? regionData.name : (regionId || "General Anatomical Area"),
      region_system: regionData ? regionData.system : "General",
      duration: duration,
      severity: severity,
      age_group: ageGroup,
      pregnancy_status: isPregnancyPossible ? "Pregnancy Possible" : "Not Applicable / Negative",
      matched_rule: matchedRule ? matchedRule.name : null,
      patient_profile: activeProfile,
      patient_profile_alerts: patientProfileAlerts,
      possible_explanations: possibleExplanations,
      first_aid_steps: firstAidList,
      what_to_avoid: whatToAvoid,
      otc_guidance: otcGuidanceText,
      demographic_precautions: demographicPrecautions,
      when_to_seek_care: whenToSeekCare,
      red_flags: redFlagsList,
      disclaimer: "This triage summary is provided strictly for informational and decision-support guidance under offline conditions. It does NOT constitute a definitive medical diagnosis and cannot replace a physical examination by a licensed healthcare professional."
    };
  }
}

window.localSafety = new LocalSafetyEngine();
