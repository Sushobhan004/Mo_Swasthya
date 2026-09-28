/**
 * SwasthyaAI Comprehensive Multilingual Internationalization Engine (i18n)
 * 100% Offline localization for English (EN), Odia (ଓଡ଼ିଆ - OD), and Hindi (हिंदी - HI).
 * Covers every UI field, navigation, 3D anatomy, triage questions, medical terms, conditions, and modals.
 */

class LocalI18nEngine {
  constructor() {
    this.currentLang = localStorage.getItem('swasthya_lang') || 'en';

    this.translations = {
      en: {
        // Top Header & Brand
        app_title: "Mo Swasthya",
        badge_ai: "3D NEURAL CORE",
        app_subtitle: "Offline Medical Decision-Support & Emergency System",
        offline_mode: "OFFLINE MODE (100% Local)",
        online_mode: "ONLINE MODE (Sync Available)",
        header_settings_title: "Medical Content Manager & AI Registry",
        header_diagnostics_title: "10-Point Offline Diagnostic Check",
        header_profile_title: "Patient Medical Profile & Emergency ID",

        // Emergency Top Banner
        emergency_banner_title: "EMERGENCY RED-FLAG ADVISORY SYSTEM",
        emergency_banner_desc: "Immediate clinical guidance for acute coronary distress, stroke FAST alerts, respiratory obstruction, or surgical peritonitis.",
        emergency_activate_btn: "⚡ Activate Emergency Console",

        // 8 Navigation Deck Modules
        nav_triage_title: "3D Triage & NLP",
        nav_triage_desc: "3D anatomy scanner & natural language triage.",
        nav_atlas_title: "Medical Atlas",
        nav_atlas_desc: "Probabilistic BM25 search across WHO & ICMR.",
        nav_pharmacy_title: "Pharmacy Matrix",
        nav_pharmacy_desc: "Generic database & pairwise drug safety.",
        nav_vision_title: "Vision Screening",
        nav_vision_desc: "Local sharpness validation & CXR/lesion AI.",
        nav_emergency_title: "Emergency Dispatch",
        nav_emergency_desc: "Immediate 112/108 SOS & trauma routing.",
        nav_map_title: "Offline GPS Map",
        nav_map_desc: "Haversine distance & Dijkstra / A* routing.",
        nav_records_title: "Patient Profile",
        nav_records_desc: "Encrypted medical ID, baseline vitals & allergy safety matrix.",
        nav_sentinel_title: "System Sentinel",
        nav_sentinel_desc: "10-point real-time offline engine audit.",

        // 3D Anatomy Visualizer Controls
        anatomy_model_label: "Anatomy Model:",
        male_anatomy: "♂ Male Anatomy",
        female_anatomy: "♀ Female Anatomy",
        search_anatomy_placeholder: "🔍 Search body part (e.g. Heart, Right Knee, Liver, Appendix)...",
        triage_history_btn: "📜 Triage History",
        active_region_label: "Active Anatomical Region:",
        body_system_label: "Body System:",
        region_ready_badge: "Region Ready",
        selected_target_badge: "Selected Target",
        default_region_name: "Chest Wall & Heart Area",
        default_system_name: "Cardiovascular / Musculoskeletal",

        // Clinical Triage Intake & Questions
        triage_section_title: "Offline Clinical Triage & Multi-Factor Intake",
        triage_section_subtitle: "Touch any body region on the 3D anatomy visualizer or search above to initiate rule-based offline triage.",
        questionnaire_title: "Clinical Assessment Questions",
        questionnaire_subtitle: "Select the specific signs describing your condition for pinpoint analysis:",
        questionnaire_tap_tag: "Tap Answers",
        additional_symptoms_label: "⚡ Additional Region Symptoms:",
        symptom_prompt_label: "What problem or symptoms are you experiencing?",
        symptom_input_placeholder: "e.g. My lower right abdomen has been hurting for 8 hours and it becomes worse when I walk with nausea...",
        voice_input_btn: "🎤 Voice Input",
        voice_listening: "🔴 Listening...",
        clear_prompt_btn: "Clear prompt",

        // Demographics Matrix
        age_group_label: "Age Group",
        age_adult: "Adult (18-64)",
        age_child: "Child (<12 yrs)",
        age_adolescent: "Adolescent (12-17)",
        age_senior: "Senior (65+ yrs)",
        severity_label: "Severity",
        severity_moderate: "Moderate",
        severity_mild: "Mild",
        severity_severe: "Severe / Intense",
        duration_label: "Duration",
        duration_hours: "Hours (<24h)",
        duration_days: "1 - 3 Days",
        duration_weeks: "Weeks / Chronic (>2w)",
        pregnancy_label: "Pregnancy Possible?",
        pregnancy_no: "No / Unlikely",
        pregnancy_yes: "Yes / Possible",

        // Presets & Action
        presets_label: "⚡ Instant Case Simulations:",
        preset_cardiac: "❤️ Cardiac MI / Angina",
        preset_stroke: "🧠 Stroke Warning (FAST)",
        preset_asthma: "🫁 Asthma Distress",
        preset_appendicitis: "🩺 Acute Appendicitis",
        preset_kidney_stone: "🚽 Kidney Stone Colic",
        preset_knee_strain: "🦵 Knee Muscle Strain",
        run_triage_btn: "Run Offline Clinical Triage",
        triage_evaluating: "⚡ Evaluating Offline Clinical Rules...",

        // Triage Results Section
        triage_result_header: "Offline Clinical Triage Assessment",
        btn_read_aloud: "🔊 Read Aloud",
        recommended_action_label: "Recommended Action:",
        possible_explanations_title: "Possible Explanations & Context:",
        first_aid_title: "Immediate First-Aid & What to Do:",
        otc_info_title: "Safe Medication Guidance:",
        red_flags_title: "Critical Red-Flags & Hospital Triggers:",
        btn_qr_share: "📱 View Paramedic QR Report",
        btn_nearest_facility: "🏥 Nearest Clinic / Hospital",
        zero_cloud_footer: "100% Zero-Cloud Execution | Data Stored Locally",
        clinical_disclaimer_label: "Clinical Disclaimer:",

        // Triage History Modal
        history_modal_title: "📜 Local Offline Triage History",
        history_modal_desc: "All session records are stored 100% locally in your browser's private IndexedDB storage. No health data is uploaded to external clouds.",
        btn_export_history: "📥 Export Data (JSON)",
        btn_clear_history: "🗑️ Clear History",
        btn_close_history: "Close Window",
        no_history_records: "No prior triage records found in local storage.",

        // Module 2: Medical Atlas
        atlas_title: "Verified Medical Knowledge Atlas",
        atlas_subtitle: "Full-text Inverted Index and Probabilistic BM25 search across WHO & ICMR medical topics with zero latency.",
        atlas_search_placeholder: "🔍 Ask any medical question or search condition (e.g. 'What to do for Dengue?', 'Pneumonia CURB-65', 'Paracetamol dosage', 'Appendicitis signs')...",
        atlas_empty_prompt: "Type a medical query above or tap any category to search WHO & ICMR medical topics with zero latency.",
        cat_all: "🌐 All Topics",
        cat_infectious: "🦠 Infectious Diseases",
        cat_cardio: "❤️ Cardiovascular",
        cat_resp: "🫁 Respiratory",
        cat_gastro: "🩺 Gastrointestinal",
        cat_emergency: "🚨 Emergency Red-Flags",
        cat_medicine: "💊 Essential Medicines",

        // Atlas Modal & Cards
        modal_overview_title: "📋 Verified Clinical Overview & Protocol:",
        modal_firstaid_title: "🩹 Immediate First-Aid & Home Care Steps:",
        modal_treatment_title: "📋 Standard Clinical Treatment Protocol:",
        modal_medication_title: "💊 Medication Guidance, Dosage & Safety:",
        modal_emergency_title: "🚨 EMERGENCY WARNING SIGNS & HOSPITAL TRIGGERS (112 / 108):",
        modal_authority_title: "🏛️ Authoritative Source & Verification:",
        modal_offline_title: "⚡ Offline Availability:",
        modal_guidance_note: "⚠️ Clinical Practice Guidance Note:",
        modal_guidance_desc: "This entry is provided for clinical decision-support and rapid emergency verification. In cases of acute distress, trigger emergency transport immediately.",
        btn_launch_triage_modal: "🩺 Launch 3D Triage for this Condition",
        btn_close_modal: "Close Window",
        btn_view_deepdive: "📖 View Clinical Deep-Dive & Protocol",
        btn_start_triage_card: "🩺 Start 3D Triage for This",
        btn_check_drug_card: "⚡ Check Drug Interaction",

        // Module 3: Pharmacy Matrix
        pharmacy_title: "Offline Pharmacy Repository & Drug Matrix",
        pharmacy_subtitle: "Verified reference information on approved medicines, contraindications, and pairwise drug interactions.",
        drug_eval_title: "⚡ Pairwise Drug Interaction Engine",
        med_a_label: "Primary Medication (Drug A)",
        med_b_label: "Secondary Medication (Drug B)",
        btn_check_interaction: "⚡ Evaluate Safety Matrix",

        // Module 4: Vision Screening
        vision_title: "Clinical Image Quality Assessment & Screening",
        vision_subtitle: "Local edge-based image quality gating (Laplacian sharpness & brightness) with benchmark diagnostic classification.",
        select_task_label: "Select Clinical Task",
        task_skin_lesion: "Dermatological Lesion Screening (ISIC Benchmark)",
        task_chest_xray: "Chest Radiograph Pneumonia Screening (CXR Benchmark)",
        dropzone_title: "Drop or select clinical image for quality triage",
        dropzone_subtitle: "Offline validation checks sharpness, resolution & exposure prior to neural classification",
        btn_run_vision: "Run Edge Diagnostics",
        vision_empty_prompt: "Select an image above to run local quality triage and view benchmark performance metrics.",

        // Module 5: Emergency Dispatch
        emergency_protocol_title: "Emergency Dispatch & Trauma Response",
        emergency_protocol_subtitle: "Immediate clinical intervention protocols for acute life-threatening emergencies.",
        national_dispatch_label: "National Emergency Dispatch",
        dispatch_numbers: "📞 112 / 108",
        dispatch_desc: "24/7 Universal Emergency Dispatch & Ambulance Network",
        nearest_trauma_label: "Nearest 24/7 Level-1 Trauma Facility",
        trauma_center_name: "Metropolis Central Trauma Center",
        trauma_center_desc: "Distance: 0.8 km | 24/7 ICU, Cath Lab & Stroke Unit Available",
        btn_view_map_route: "🗺️ View GPS Map & Route",
        btn_display_emergency_qr: "📱 Display Emergency QR Passport",

        // Module 6: Facilities & Map
        map_title: "Offline GPS Hospital Radar & Routing",
        map_subtitle: "Pre-cached spatial facility index with client-side Haversine distance and Dijkstra obstacle avoidance routing.",
        simulate_blocked_road: "Simulate Road Obstacle (Recalculate Route)",
        legend_emergency: "24/7 Emergency / Trauma",
        legend_hospital: "General Hospital",
        legend_clinic: "Primary Health Center",
        legend_pharmacy: "24/7 Pharmacy",
        legend_you: "Current GPS Location",
        facilities_heading: "Local Healthcare Directory",
        filter_all_facilities: "All Facilities",
        filter_emergency: "Emergency Only",
        filter_hospitals: "Hospitals",
        filter_clinics: "Clinics",
        filter_pharmacies: "Pharmacies",

        // Module 7: Health Vault & Patient Profile
        vault_title: "Patient Medical Profile & Encrypted ID",
        vault_subtitle: "Client-side AES-GCM 256-bit encrypted health profile. Triage engine, drug interactions, and emergency SOS automatically adapt to your allergies and conditions.",
        vault_status_title: "Patient Clinical Profile",
        vault_badge_enc: "AES-GCM 256-Bit Encrypted",
        vault_desc: "Health data is stored securely in your browser's private storage. Triage calculations and drug interaction checkers automatically reference your profile.",
        profile_heading: "Patient Medical Profile & Emergency ID",
        profile_subheading: "Your profile information automatically customizes triage recommendations, medication safety alerts, and emergency reports.",
        profile_section_personal: "1. Personal Identification & Vitals",
        profile_section_clinical: "2. Allergies, Chronic Conditions & Medications",
        profile_section_emergency: "3. Emergency Contacts & Home Location",
        profile_full_name: "Full Name",
        profile_age: "Age (Years)",
        profile_dob: "Date of Birth",
        profile_gender: "Biological Sex",
        profile_blood_group: "Blood Group",
        profile_weight: "Weight (kg)",
        profile_height: "Height (cm)",
        profile_bmi: "Calculated BMI",
        profile_allergies_label: "Drug & Food Allergies",
        profile_allergies_placeholder: "e.g. Penicillin, Sulfa, Aspirin, Peanuts...",
        profile_conditions_label: "Chronic Medical Conditions",
        profile_conditions_placeholder: "e.g. Hypertension, Type 2 Diabetes, Asthma, Kidney Disease...",
        profile_medications_label: "Current Regular Medications",
        profile_medications_placeholder: "e.g. Metformin 500mg, Amlodipine 5mg, Inhaler...",
        profile_pregnancy_label: "Pregnancy Status (if applicable)",
        profile_emergency_name: "Emergency Contact Person",
        profile_emergency_phone: "Emergency Phone Number",
        profile_emergency_relation: "Relationship",
        profile_district: "Home District / Region (Odisha)",
        btn_save_profile: "💾 Save & Sync Profile",
        btn_clear_profile: "🗑️ Clear Profile",
        btn_export_id: "🪪 Print Emergency Medical ID Card",
        profile_synced_badge: "👤 Profile Auto-Synced",
        profile_active_label: "Active Patient:",
        profile_auto_fetch_tip: "⚡ Profile details automatically apply to 3D Triage, Pharmacy Safety, and Emergency SOS.",
        vault_allergies_label: "Allergies & Chronic Diseases (Locally Encrypted)",
        vault_allergies_placeholder: "e.g. Penicillin allergy, Type 2 Diabetes, Hypertension, Asthma...",
        btn_save_vault: "💾 Save Health Profile",

        // Module 8: Sentinel Diagnostics
        sentinel_title: "10-Point Offline System Sentinel",
        sentinel_subtitle: "Real-time automated diagnostic audit verifying zero-cloud functionality across all local subsystems.",
        btn_rerun_diag: "🔄 Rerun Diagnostic Suite",
        diag_page_title: "OFFLINE SYSTEM DIAGNOSTICS",
        diag_page_subtitle: "Comprehensive 10-point self-diagnostic matrix for zero-network validation.",
        btn_back_app: "← Back to App",

        // QR Share Modal
        qr_modal_title: "Offline Health Passport QR",
        qr_modal_desc: "Present this encrypted QR code to healthcare providers for instant triage handoff without internet.",
        btn_close_qr: "Close Window",

        // Footer
        footer_disclaimer_title: "Medical Information & Decision-Support System:",
        footer_disclaimer_body: "SwasthyaAI is designed for informational, decision-support, and emergency triage guidance. It is NOT a replacement for a licensed physician, does NOT make definitive diagnoses, and does NOT autonomously prescribe medications.",
        footer_meta: "Mo Swasthya v2.5.0 | Knowledge Base v18 | 100% Zero Cloud API Dependency"
      },

      od: {
        // Top Header & Brand
        app_title: "ମୋ ସ୍ୱାସ୍ଥ୍ୟ",
        badge_ai: "୩D ଏଆଇ କୋର୍",
        app_subtitle: "ଅଫଲାଇନ୍ ଡାକ୍ତରୀ ନିଷ୍ପତ୍ତି ସହାୟତା ଓ ଜରୁରୀକାଳୀନ ପ୍ରଣାଳୀ",
        offline_mode: "ଅଫଲାଇନ୍ ମୋଡ୍ (୧୦୦% ସ୍ଥାନୀୟ)",
        online_mode: "ଅନଲାଇନ୍ ମୋଡ୍ (ସିଙ୍କ୍ ଉପଲବ୍ଧ)",
        header_settings_title: "ମେଡିକାଲ୍ ତଥ୍ୟ ପରିଚାଳନା ଓ ଏଆଇ ରେଜିଷ୍ଟ୍ରି",
        header_diagnostics_title: "୧୦-ପଏଣ୍ଟ ଅଫଲାଇନ୍ ସିଷ୍ଟମ୍ ଯାଞ୍ଚ",
        header_profile_title: "ରୋଗୀ ମେଡିକାଲ୍ ପ୍ରୋଫାଇଲ୍ ଓ ଜରୁରୀକାଳୀନ ଆଇଡି",

        // Emergency Top Banner
        emergency_banner_title: "ଜରୁରୀକାଳୀନ ବିପଦ ସତର୍କତା ପ୍ରଣାଳୀ",
        emergency_banner_desc: "ହୃଦଘାତ (Heart Attack), ଷ୍ଟ୍ରୋକ୍ (FAST), ଶ୍ୱାସରୋଧ କିମ୍ବା ତୀବ୍ର ପେଟ ଯନ୍ତ୍ରଣା ପାଇଁ ତୁରନ୍ତ ଡାକ୍ତରୀ ପରାମର୍ଶ।",
        emergency_activate_btn: "⚡ ଜରୁରୀକାଳୀନ କନସୋଲ୍ ଆରମ୍ଭ କରନ୍ତୁ",

        // 8 Navigation Deck Modules
        nav_triage_title: "୩D ଟ୍ରିଆଜ୍ ଓ ଏନଏଲପି",
        nav_triage_desc: "୩D ଶରୀର ସ୍କାନର୍ ଓ ପ୍ରାକୃତିକ ଭାଷା ଲକ୍ଷଣ ବିଶ୍ଳେଷଣ।",
        nav_atlas_title: "ମେଡିକାଲ୍ ଜ୍ଞାନକୋଷ",
        nav_atlas_desc: "WHO ଓ ICMR ଅନୁମୋଦିତ ରୋଗ ଓ ଚିକିତ୍ସା ଖୋଜନ୍ତୁ।",
        nav_pharmacy_title: "ଔଷଧ ନିର୍ଦ୍ଦେଶିକା",
        nav_pharmacy_desc: "ଔଷଧ ତାଲିକା, ଡୋଜ୍ ଓ ପାରସ୍ପରିକ ସୁରକ୍ଷା ଯାଞ୍ଚ।",
        nav_vision_title: "ଚକ୍ଷୁ ଓ ଚର୍ମ ଫଟୋ ଯାଞ୍ଚ",
        nav_vision_desc: "ଅଫଲାଇନ୍ ଚର୍ମ ରୋଗ ଓ ଛାତି ଏକ୍ସ-ରେ ସ୍କ୍ରିନିଂ।",
        nav_emergency_title: "ଜରୁରୀକାଳୀନ ସେବା",
        nav_emergency_desc: "ତୁରନ୍ତ ୧୧୨/୧୦୮ ଆମ୍ବୁଲାନ୍ସ ଓ ଟ୍ରମା ସହାୟତା।",
        nav_map_title: "ଅଫଲାଇନ୍ ମ୍ୟାପ୍",
        nav_map_desc: "ନିକଟସ୍ଥ ଡାକ୍ତରଖାନା ଓ ରାସ୍ତା ନିର୍ଣ୍ଣୟ।",
        nav_records_title: "ରୋଗୀ ପ୍ରୋଫାଇଲ୍",
        nav_records_desc: "ଏନକ୍ରିପ୍ଟେଡ୍ ସ୍ୱାସ୍ଥ୍ୟ ରେକର୍ଡ, ଆଲର୍ଜି ଓ କ୍ୟୁଆର୍ ଆଇଡି।",
        nav_sentinel_title: "ସିଷ୍ଟମ୍ ସେଣ୍ଟିନେଲ୍",
        nav_sentinel_desc: "୧୦-ପଏଣ୍ଟ ରିଅଲ୍-ଟାଇମ୍ ଅଫଲାଇନ୍ ଯାଞ୍ଚ।",

        // 3D Anatomy Visualizer Controls
        anatomy_model_label: "ଶରୀର ମଡେଲ୍:",
        male_anatomy: "♂ ପୁରୁଷ ଶରୀର",
        female_anatomy: "♀ ମହିଳା ଶରୀର",
        search_anatomy_placeholder: "🔍 ଶରୀରର ଅଙ୍ଗ ଖୋଜନ୍ତୁ (ଯଥା: ହୃଦୟ, ଆଣ୍ଠୁ, ଯକୃତ, ଆପେଣ୍ଡିକ୍ସ)...",
        triage_history_btn: "📜 ଟ୍ରିଆଜ୍ ଇତିହାସ",
        active_region_label: "ମନୋନୀତ ଶାରୀରିକ ଅଙ୍ଗ:",
        body_system_label: "ଶାରୀରିକ ପ୍ରଣାଳୀ:",
        region_ready_badge: "ଅଙ୍ଗ ପ୍ରସ୍ତୁତ",
        selected_target_badge: "ମନୋନୀତ ଅଙ୍ଗ",
        default_region_name: "ଛାତି ଓ ହୃଦୟ ଅଞ୍ଚଳ",
        default_system_name: "ହୃଦରୋଗ / ମାଂସପେଶୀ ପ୍ରଣାଳୀ",

        // Clinical Triage Intake & Questions
        triage_section_title: "ଅଫଲାଇନ୍ କ୍ଲିନିକାଲ୍ ଟ୍ରିଆଜ୍ ଓ ଲକ୍ଷଣ ତଥ୍ୟ",
        triage_section_subtitle: "୩D ଶରୀରର ଯେକୌଣସି ଅଙ୍ଗକୁ ସ୍ପର୍ଶ କରନ୍ତୁ କିମ୍ବା ଉପରେ ଖୋଜି ଟ୍ରିଆଜ୍ ପରୀକ୍ଷା ଆରମ୍ଭ କରନ୍ତୁ।",
        questionnaire_title: "ଡାକ୍ତରୀ ପ୍ରଶ୍ନାବଳୀ",
        questionnaire_subtitle: "ଆପଣଙ୍କ ଲକ୍ଷଣ ଅନୁଯାୟୀ ଉପଯୁକ୍ତ ବିକଳ୍ପ ଉପରେ କ୍ଲିକ୍ କରନ୍ତୁ:",
        questionnaire_tap_tag: "ଉତ୍ତର ବାଛନ୍ତୁ",
        additional_symptoms_label: "⚡ ଅତିରିକ୍ତ ଶାରୀରିକ ଲକ୍ଷଣ:",
        symptom_prompt_label: "ଏହି ଅଙ୍ଗରେ ଆପଣ କି ଅସୁବିଧା କିମ୍ବା ଲକ୍ଷଣ ଅନୁଭବ କରୁଛନ୍ତି?",
        symptom_input_placeholder: "ଯଥା: ମୋର ତଳ ପେଟ ଡାହାଣ ପାର୍ଶ୍ୱରେ ୮ ଘଣ୍ଟା ହେଲା ଯନ୍ତ୍ରଣା ହେଉଛି ଏବଂ ଚାଲିବା ବେଳେ ବାନ୍ତି ଲାଗୁଛି...",
        voice_input_btn: "🎤 ଭଏସ୍ ଇନପୁଟ୍",
        voice_listening: "🔴 ଶୁଣୁଛି...",
        clear_prompt_btn: "ଫର୍ମ ସଫା କରନ୍ତୁ",

        // Demographics Matrix
        age_group_label: "ବୟସ ସୀମା",
        age_adult: "ପ୍ରାପ୍ତବୟସ୍କ (୧୮-୬୪)",
        age_child: "ଶିଶୁ (<୧୨ ବର୍ଷ)",
        age_adolescent: "କିଶୋର (୧୨-୧୭)",
        age_senior: "ବରିଷ୍ଠ ନାଗରିକ (୬୫+)",
        severity_label: "ତୀବ୍ରତା",
        severity_moderate: "ମଧ୍ୟମ",
        severity_mild: "ମୃଦୁ (ସହନୀୟ)",
        severity_severe: "ଅତ୍ୟଧିକ (ତୀବ୍ର ଯନ୍ତ୍ରଣା)",
        duration_label: "ସମୟ ଅବଧି",
        duration_hours: "ଘଣ୍ଟା ମଧ୍ୟରେ (< ୨୪ ଘଣ୍ଟା)",
        duration_days: "୧ - ୩ ଦିନ",
        duration_weeks: "ସପ୍ତାହ / ପୁରୁଣା (> ୨ ସପ୍ତାହ)",
        pregnancy_label: "ଗର୍ଭଧାରଣ ସମ୍ଭାବନା ଅଛି କି?",
        pregnancy_no: "ନାହିଁ",
        pregnancy_yes: "ହଁ / ସମ୍ଭାବନା ଅଛି",

        // Presets & Action
        presets_label: "⚡ ତୁରନ୍ତ କେସ୍ ପରୀକ୍ଷଣ:",
        preset_cardiac: "❤️ ହୃଦଘାତ / ଛାତି ଯନ୍ତ୍ରଣା",
        preset_stroke: "🧠 ଷ୍ଟ୍ରୋକ୍ ଚେତାବନୀ (FAST)",
        preset_asthma: "🫁 ଆଜମା / ଶ୍ୱାସକଷ୍ଟ",
        preset_appendicitis: "🩺 ଆପେଣ୍ଡିସାଇଟିସ୍ ଯନ୍ତ୍ରଣା",
        preset_kidney_stone: "🚽 ପଥୁରୀ ଯନ୍ତ୍ରଣା",
        preset_knee_strain: "🦵 ଆଣ୍ଠୁ ମାଂସପେଶୀ ଆଘାତ",
        run_triage_btn: "ଅଫଲାଇନ୍ କ୍ଲିନିକାଲ୍ ଟ୍ରିଆଜ୍ ଚଲାନ୍ତୁ",
        triage_evaluating: "⚡ ତଥ୍ୟ ବିଶ୍ଳେଷଣ ଚାଲିଛି...",

        // Triage Results Section
        triage_result_header: "ଅଫଲାଇନ୍ ଡାକ୍ତରୀ ଟ୍ରିଆଜ୍ ରିପୋର୍ଟ",
        btn_read_aloud: "🔊 ପଢ଼ି ଶୁଣାନ୍ତୁ",
        recommended_action_label: "ପରାମର୍ଶିତ ପଦକ୍ଷେପ:",
        possible_explanations_title: "ସମ୍ଭାବ୍ୟ କାରଣ ଓ ବିବରଣୀ:",
        first_aid_title: "ବର୍ତ୍ତମାନ କ’ଣ କରିପାରିବେ (ପ୍ରାଥମିକ ଚିକିତ୍ସା):",
        otc_info_title: "ସାଧାରଣ ଔଷଧ ସୂଚନା:",
        red_flags_title: "ଜରୁରୀକାଳୀନ ସତର୍କତା ଚିହ୍ନ (ତୁରନ୍ତ ଡାକ୍ତରଖାନା ଯାଆନ୍ତୁ):",
        btn_qr_share: "📱 ପାରାମେଡିକ୍ QR ରିପୋର୍ଟ ଦେଖାନ୍ତୁ",
        btn_nearest_facility: "🏥 ନିକଟସ୍ଥ ଡାକ୍ତରଖାନା / କ୍ଲିନିକ୍",
        zero_cloud_footer: "ସମ୍ପୂର୍ଣ୍ଣ ଅଫଲାଇନ୍ | କୌଣସି ଇଣ୍ଟରନେଟ୍ ଆବଶ୍ୟକ ନାହିଁ",
        clinical_disclaimer_label: "ଡାକ୍ତରୀ ସତର୍କତା:",

        // Triage History Modal
        history_modal_title: "📜 ଅଫଲାଇନ୍ ଟ୍ରିଆଜ୍ ଇତିହାସ",
        history_modal_desc: "ସମସ୍ତ ତଥ୍ୟ ଆପଣଙ୍କ ବ୍ରାଉଜରର ସୁରକ୍ଷିତ IndexedDB ରେ ସଂରକ୍ଷିତ। କୌଣସି କ୍ଲାଉଡ୍ କୁ ଯାଏ ନାହିଁ।",
        btn_export_history: "📥 ତଥ୍ୟ ଡାଉନଲୋଡ୍ (JSON)",
        btn_clear_history: "🗑️ ରେକର୍ଡ ଲିଭାନ୍ତୁ",
        btn_close_history: "ବନ୍ଦ କରନ୍ତୁ",
        no_history_records: "କୌଣସି ପୂର୍ବ ରେକର୍ଡ ମିଳିଲା ନାହିଁ।",

        // Module 2: Medical Atlas
        atlas_title: "ପ୍ରମାଣିତ ମେଡିକାଲ୍ ଜ୍ଞାନକୋଷ",
        atlas_subtitle: "WHO ଓ ICMR ଅନୁମୋଦିତ ସ୍ୱାସ୍ଥ୍ୟ ତଥ୍ୟ ତୁରନ୍ତ ଖୋଜନ୍ତୁ।",
        atlas_search_placeholder: "🔍 ରୋଗ, ଲକ୍ଷଣ, ଔଷଧ ଖୋଜନ୍ତୁ (ଯଥା: 'ଡେଙ୍ଗୁ ଜ୍ୱର', 'ଗ୍ୟାସ ଏସିଡିଟି', 'ନିମୋନିଆ', 'ଆଜମା', 'ପଥୁରୀ', 'ପାରାସିଟାମୋଲ')...",
        atlas_empty_prompt: "ରୋଗ କିମ୍ବା ଔଷଧ ବିଷୟରେ ଜାଣିବା ପାଇଁ ଉପରେ ଲେଖି ଖୋଜନ୍ତୁ।",
        cat_all: "🌐 ସମସ୍ତ ବିଷୟ",
        cat_infectious: "🦠 ସଂକ୍ରାମକ ରୋଗ",
        cat_cardio: "❤️ ହୃଦରୋଗ",
        cat_resp: "🫁 ଶ୍ୱାସକ୍ରିୟା",
        cat_gastro: "🩺 ପାଚନ ପ୍ରଣାଳୀ",
        cat_emergency: "🚨 ଜରୁରୀକାଳୀନ ବିପଦ",
        cat_medicine: "💊 ଅତ୍ୟାବଶ୍ୟକ ଔଷଧ",

        // Atlas Modal & Cards
        modal_overview_title: "📋 ପ୍ରମାଣିତ କ୍ଲିନିକାଲ୍ ବିବରଣୀ ଓ ପ୍ରୋଟୋକଲ୍:",
        modal_firstaid_title: "🩹 ତୁରନ୍ତ ପ୍ରାଥମିକ ଚିକିତ୍ସା ଓ ଘରୋଇ ପଦକ୍ଷେପ:",
        modal_treatment_title: "📋 ମାନକ ଚିକିତ୍ସା ପ୍ରୋଟୋକଲ୍ (WHO/ICMR):",
        modal_medication_title: "💊 ଔଷଧ ସୂଚନା, ଡୋଜ୍ ଓ ସୁରକ୍ଷା ନିର୍ଦ୍ଦେଶାବଳୀ:",
        modal_emergency_title: "🚨 ଜରୁରୀକାଳୀନ ବିପଦ ସଙ୍କେତ (୧୧୨ / ୧୦୮):",
        modal_authority_title: "🏛️ ପ୍ରମାଣିତ ସ୍ୱାସ୍ଥ୍ୟ ସଂସ୍ଥା:",
        modal_offline_title: "⚡ ଅଫଲାଇନ୍ ଉପଲବ୍ଧତା:",
        modal_guidance_note: "⚠️ ଡାକ୍ତରୀ ନିର୍ଦ୍ଦେଶିକା ସୂଚନା:",
        modal_guidance_desc: "ଏହି ତଥ୍ୟ କେବଳ ଡାକ୍ତରୀ ନିଷ୍ପତ୍ତି ସହାୟତା ଏବଂ ଜରୁରୀକାଳୀନ ଯାଞ୍ଚ ପାଇଁ ଉଦ୍ଦିଷ୍ଟ। ଗୁରୁତର ସ୍ଥିତିରେ ତୁରନ୍ତ ଡାକ୍ତରଖାନା ଯାଆନ୍ତୁ।",
        btn_launch_triage_modal: "🩺 ଏହି ରୋଗ ପାଇଁ ୩D ଟ୍ରିଆଜ୍ ଚଲାନ୍ତୁ",
        btn_close_modal: "ୱିଣ୍ଡୋ ବନ୍ଦ କରନ୍ତୁ",
        btn_view_deepdive: "📖 ସମ୍ପୂର୍ଣ୍ଣ ଚିକିତ୍ସା ବିବରଣୀ ଦେଖନ୍ତୁ",
        btn_start_triage_card: "🩺 ଏଥିପାଇଁ ୩D ଟ୍ରିଆଜ୍ କରନ୍ତୁ",
        btn_check_drug_card: "⚡ ଔଷଧ ସୁରକ୍ଷା ଯାଞ୍ଚ କରନ୍ତୁ",

        // Module 3: Pharmacy Matrix
        pharmacy_title: "ଅଫଲାଇନ୍ ଔଷଧ ନିର୍ଦ୍ଦେଶିକା ଓ ସୁରକ୍ଷା",
        pharmacy_subtitle: "ଅନୁମୋଦିତ ଔଷଧ, ପାର୍ଶ୍ୱ ପ୍ରତିକ୍ରିୟା ଏବଂ ଔଷଧ ମଧ୍ୟରେ ପାରସ୍ପରିକ ସମ୍ପର୍କ।",
        drug_eval_title: "⚡ ଦୁଇଟି ଔଷଧ ମଧ୍ୟରେ ସୁରକ୍ଷା ପରୀକ୍ଷା",
        med_a_label: "ପ୍ରଥମ ଔଷଧ (A)",
        med_b_label: "ଦ୍ୱିତୀୟ ଔଷଧ (B)",
        btn_check_interaction: "⚡ ଔଷଧ ସୁରକ୍ଷା ଯାଞ୍ଚ କରନ୍ତୁ",

        // Module 4: Vision Screening
        vision_title: "ଚକ୍ଷୁ ଓ ଚର୍ମ ଫଟୋ ବିଶ୍ଳେଷଣ",
        vision_subtitle: "ସ୍ଥାନୀୟ ଅଫଲାଇନ୍ ଫଟୋ ଗୁଣବତ୍ତା ଯାଞ୍ଚ ଓ ଚର୍ମ ରୋଗ ସ୍କ୍ରିନିଂ।",
        select_task_label: "ପରୀକ୍ଷା ପ୍ରକାର ବାଛନ୍ତୁ",
        task_skin_lesion: "ଚର୍ମ ରୋଗ ପରୀକ୍ଷା (ISIC Benchmark)",
        task_chest_xray: "ଛାତି ଏକ୍ସ-ରେ ସ୍କ୍ରିନିଂ (CXR Benchmark)",
        dropzone_title: "ମେଡିକାଲ୍ ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ",
        dropzone_subtitle: "ଫଟୋର ସ୍ପଷ୍ଟତା ଓ ତୀକ୍ଷ୍ଣତା ଅଫଲାଇନ୍ ପରୀକ୍ଷା କରାଯିବ",
        btn_run_vision: "ଏଆଇ ପରୀକ୍ଷା ଆରମ୍ଭ କରନ୍ତୁ",
        vision_empty_prompt: "ଫଟୋ ବାଛି ବିଶ୍ଳେଷଣ କରନ୍ତୁ ଏବଂ ସଠିକତା ମାପ ଦେଖନ୍ତୁ।",

        // Module 5: Emergency Dispatch
        emergency_protocol_title: "ଜରୁରୀକାଳୀନ ମେଡିକାଲ୍ ପ୍ରୋଟୋକଲ୍",
        emergency_protocol_subtitle: "ଗୁରୁତର ଲକ୍ଷଣ ଥିଲେ ବିଳମ୍ବ ନକରି ତୁରନ୍ତ ଡାକ୍ତରୀ ସହାୟତା ନିଅନ୍ତୁ।",
        national_dispatch_label: "ଜାତୀୟ ଜରୁରୀକାଳୀନ ନମ୍ବର",
        dispatch_numbers: "📞 ୧୧୨ / ୧୦୮",
        dispatch_desc: "୨୪/୭ ଆମ୍ବୁଲାନ୍ସ, ପୋଲିସ ଓ ଅଗ୍ନିଶମ ସେବା",
        nearest_trauma_label: "ନିକଟସ୍ଥ ୨୪/୭ ଟ୍ରମା ସେଣ୍ଟର",
        trauma_center_name: "ମେଟ୍ରୋପଲିସ୍ କେନ୍ଦ୍ରୀୟ ଟ୍ରମା",
        trauma_center_desc: "ଦୂରତା: ୦.୮ କି.ମି. | ଆଇସିୟୁ, ହାର୍ଟ କେୟାର ଓ ଷ୍ଟ୍ରୋକ୍ ୟୁନିଟ୍",
        btn_view_map_route: "🗺️ ଅଫଲାଇନ୍ ମ୍ୟାପ୍ ଓ ନାଭିଗେସନ୍ ରୁଟ୍",
        btn_display_emergency_qr: "📱 ଜରୁରୀକାଳୀନ QR କୋଡ୍ ଦେଖାନ୍ତୁ",

        // Module 6: Facilities & Map
        map_title: "ଅଫଲାଇନ୍ ସ୍ୱାସ୍ଥ୍ୟକେନ୍ଦ୍ର ଓ ରୁଟ୍ ନାଭିଗେସନ୍",
        map_subtitle: "ପୂର୍ବରୁ ଲୋଡ୍ ଥିବା ଡାକ୍ତରଖାନା ତାଲିକା ଏବଂ ସର୍ବୋତ୍ତମ ରାସ୍ତା ନିର୍ଣ୍ଣୟ।",
        simulate_blocked_road: "ଅବରୋଧ ରାସ୍ତା ଅନୁକରଣ କରନ୍ତୁ",
        legend_emergency: "୨୪/୭ ଜରୁରୀକାଳୀନ / ଟ୍ରମା",
        legend_hospital: "ଡାକ୍ତରଖାନା",
        legend_clinic: "ପ୍ରାଥମିକ କ୍ଲିନିକ୍",
        legend_pharmacy: "୨୪/୭ ଔଷଧ ଦୋକାନ",
        legend_you: "ଆପଣଙ୍କ ଅବସ୍ଥିତି (GPS)",
        facilities_heading: "ସ୍ଥାନୀୟ ସ୍ୱାସ୍ଥ୍ୟକେନ୍ଦ୍ର ସମୂହ",
        filter_all_facilities: "ସମସ୍ତ ସ୍ୱାସ୍ଥ୍ୟକେନ୍ଦ୍ର",
        filter_emergency: "ଜରୁରୀକାଳୀନ ଓ ଟ୍ରମା",
        filter_hospitals: "ଡାକ୍ତରଖାନା",
        filter_clinics: "କ୍ଲିନିକ୍",
        filter_pharmacies: "ଔଷଧାଳୟ",

        // Module 7: Health Vault & Patient Profile
        vault_title: "ରୋଗୀ ପ୍ରୋଫାଇଲ୍ ଓ ସୁରକ୍ଷିତ ମେଡିକାଲ୍ ଆଇଡି",
        vault_subtitle: "AES-GCM ୨୫୬-ବିଟ୍ ଏନକ୍ରିପ୍ଟେଡ୍ ଡାକ୍ତରୀ ପ୍ରୋଫାଇଲ୍। ଆପଣଙ୍କ ତଥ୍ୟ ଅନୁଯାୟୀ ସିଷ୍ଟମ୍ ସ୍ୱୟଂଚାଳିତ ଭାବରେ ସଠିକ୍ ପରାମର୍ଶ ଏବଂ ସୁରକ୍ଷା ଯାଞ୍ଚ କରିବ।",
        vault_status_title: "ରୋଗୀ ଡାକ୍ତରୀ ପ୍ରୋଫାଇଲ୍",
        vault_badge_enc: "AES-GCM ୨୫୬-ବିଟ୍ ଏନକ୍ରିପ୍ଟେଡ୍",
        vault_desc: "ସ୍ୱାସ୍ଥ୍ୟ ତଥ୍ୟ କେବଳ ଆପଣଙ୍କ ବ୍ରାଉଜରରେ ସୁରକ୍ଷିତ ରହେ। ଟ୍ରିଆଜ୍, ଔଷଧ ସୁରକ୍ଷା ଓ ଜରୁରୀକାଳୀନ ସେବା ଆପଣଙ୍କ ଆଲର୍ଜି ଓ ରୋଗ ତଥ୍ୟ ସ୍ୱୟଂଚାଳିତ ଭାବରେ ଯାଞ୍ଚ କରେ।",
        profile_heading: "ରୋଗୀ ଡାକ୍ତରୀ ପ୍ରୋଫାଇଲ୍ ଓ ଜରୁରୀକାଳୀନ ଆଇଡି",
        profile_subheading: "ଆପଣଙ୍କ ପ୍ରୋଫାଇଲ୍ ତଥ୍ୟ ଅନୁଯାୟୀ ସିଷ୍ଟମ୍ ସ୍ୱୟଂଚାଳିତ ଭାବରେ ସଠିକ୍ ପରାମର୍ଶ ଏବଂ ସୁରକ୍ଷା ଯାଞ୍ଚ କରିବ।",
        profile_section_personal: "୧. ବ୍ୟକ୍ତିଗତ ପରିଚୟ ଓ ଶାରୀରିକ ତଥ୍ୟ",
        profile_section_clinical: "୨. ଆଲର୍ଜି, ଦୀର୍ଘକାଳୀନ ରୋଗ ଓ ନିୟମିତ ଔଷଧ",
        profile_section_emergency: "୩. ଜରୁରୀକାଳୀନ ଯୋଗାଯୋଗ ଓ ଠିକଣା",
        profile_full_name: "ପୂରା ନାମ",
        profile_age: "ବୟସ (ବର୍ଷ)",
        profile_dob: "ଜନ୍ମ ତାରିଖ",
        profile_gender: "ଲିଙ୍ଗ",
        profile_blood_group: "ରକ୍ତ ବର୍ଗ (Blood Group)",
        profile_weight: "ଓଜନ (କି.ଗ୍ରା.)",
        profile_height: "ଉଚ୍ଚତା (ସେ.ମି.)",
        profile_bmi: "ହିସାବିତ BMI",
        profile_allergies_label: "ଔଷଧ କିମ୍ବା ଖାଦ୍ୟ ଆଲର୍ଜି",
        profile_allergies_placeholder: "ଯଥା: ପେନିସିଲିନ୍, ସଲଫା, ଆସ୍ପିରିନ୍, ଚିନାବାଦାମ...",
        profile_conditions_label: "ଦୀର୍ଘକାଳୀନ ରୋଗ (Chronic Conditions)",
        profile_conditions_placeholder: "ଯଥା: ଉଚ୍ଚ ରକ୍ତଚାପ, ମଧୁମେହ, ଆଜମା, ହୃଦରୋଗ...",
        profile_medications_label: "ବର୍ତ୍ତମାନ ନେଉଥିବା ନିୟମିତ ଔଷଧ",
        profile_medications_placeholder: "ଯଥା: ମେଟଫର୍ମିନ୍, ଆମଲୋଡିପାଇନ୍, ଇନହେଲର...",
        profile_pregnancy_label: "ଗର୍ଭାବସ୍ଥା ସ୍ଥିତି",
        profile_emergency_name: "ଜରୁରୀକାଳୀନ ଯୋଗାଯୋଗକାରୀଙ୍କ ନାମ",
        profile_emergency_phone: "ଜରୁରୀକାଳୀନ ଫୋନ୍ ନମ୍ବର",
        profile_emergency_relation: "ସମ୍ପର୍କ",
        profile_district: "ନିଜ ଜିଲ୍ଲା / ଅଞ୍ଚଳ (ଓଡ଼ିଶା)",
        btn_save_profile: "💾 ପ୍ରୋଫାଇଲ୍ ସଂରକ୍ଷଣ ଓ ସିଙ୍କ୍ କରନ୍ତୁ",
        btn_clear_profile: "🗑️ ପ୍ରୋଫାଇଲ୍ ହଟାନ୍ତୁ",
        btn_export_id: "🪪 ଜରୁରୀକାଳୀନ ମେଡିକାଲ୍ ଆଇଡି ପ୍ରିଣ୍ଟ କରନ୍ତୁ",
        profile_synced_badge: "👤 ପ୍ରୋଫାଇଲ୍ ସିଙ୍କ୍ ହୋଇଛି",
        profile_active_label: "ସକ୍ରିୟ ରୋଗୀ:",
        profile_auto_fetch_tip: "⚡ ପ୍ରୋଫାଇଲ୍ ତଥ୍ୟ ସ୍ୱୟଂଚାଳିତ ଭାବେ ୩D ଟ୍ରିଆଜ୍, ଔଷଧ ସୁରକ୍ଷା ଓ ଜରୁରୀକାଳୀନ SOS ରେ ଲାଗୁ ହେବ।",
        vault_allergies_label: "ଆଲର୍ଜି ଓ ଦୀର୍ଘକାଳୀନ ରୋଗ (ସୁରକ୍ଷିତ ଏନକ୍ରିପ୍ଟେଡ୍)",
        vault_allergies_placeholder: "ଯଥା: ପେନିସିଲିନ୍ ଆଲର୍ଜି, ମଧୁମେହ, ରକ୍ତଚାପ, ଆଜମା...",
        btn_save_vault: "💾 ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରୋଫାଇଲ୍ ସଂରକ୍ଷଣ କରନ୍ତୁ",

        // Module 8: Sentinel Diagnostics
        sentinel_title: "୧୦-ପଏଣ୍ଟ ସିଷ୍ଟମ୍ ସେଣ୍ଟିନେଲ୍",
        sentinel_subtitle: "ସମସ୍ତ ଅଫଲାଇନ୍ ସବସିଷ୍ଟମ୍ ସଠିକ୍ ଭାବରେ କାର୍ଯ୍ୟ କରୁଛି କି ନାହିଁ ଯାଞ୍ଚ।",
        btn_rerun_diag: "🔄 ପୁନର୍ବାର ଯାଞ୍ଚ କରନ୍ତୁ",
        diag_page_title: "ଅଫଲାଇନ୍ ସିଷ୍ଟମ୍ ଡାଇଗ୍ନୋଷ୍ଟିକ୍ସ",
        diag_page_subtitle: "ଶୂନ୍ୟ ନେଟୱାର୍କ ସତ୍ୟାପନ ପାଇଁ ୧୦-ପଏଣ୍ଟ ସ୍ୱୟଂ-ଡାଇଗ୍ନୋଷ୍ଟିକ୍ ମ୍ୟାଟ୍ରିକ୍ସ।",
        btn_back_app: "← ମୁଖ୍ୟ ଆପ୍ କୁ ଫେରନ୍ତୁ",

        // QR Share Modal
        qr_modal_title: "ଅଫଲାଇନ୍ ରିପୋର୍ଟ ସେୟାର୍",
        qr_modal_desc: "ଇଣ୍ଟରନେଟ୍ ବିନା ଡାକ୍ତର କିମ୍ବା ପାରାମେଡିକ୍ ଙ୍କୁ ଏହି QR କୋଡ୍ ଦେଖାଇ ତଥ୍ୟ ପ୍ରଦାନ କରନ୍ତୁ।",
        btn_close_qr: "ୱିଣ୍ଡୋ ବନ୍ଦ କରନ୍ତୁ",

        // Footer
        footer_disclaimer_title: "ଡାକ୍ତରୀ ସୂଚନା ଓ ନିଷ୍ପତ୍ତି ସହାୟତା ପ୍ରଣାଳୀ:",
        footer_disclaimer_body: "ସ୍ୱାସ୍ଥ୍ୟAI କେବଳ ସୂଚନା, ନିଷ୍ପତ୍ତି ସହାୟତା ଏବଂ ପ୍ରାଥମିକ ଚିକିତ୍ସା ପାଇଁ ଉଦ୍ଦିଷ୍ଟ। ଏହା ପଞ୍ଜୀକୃତ ଡାକ୍ତରଙ୍କ ବିକଳ୍ପ ନୁହେଁ, ଅନ୍ତିମ ନିଦାନ କରେ ନାହିଁ କିମ୍ବା ନିଜେ ଔଷଧ ଲେଖେ ନାହିଁ।",
        footer_meta: "ମୋ ସ୍ୱାସ୍ଥ୍ୟ v୨.୫.୦ | ଜ୍ଞାନକୋଷ v୧୮ | ୧୦୦% କ୍ଲାଉଡ୍ ମୁକ୍ତ ପ୍ରଣାଳୀ"
      },

      hi: {
        // Top Header & Brand
        app_title: "मो स्वास्थ्य",
        badge_ai: "3D न्यूरल कोर",
        app_subtitle: "ऑफ़लाइन मेडिकल निर्णय सहायता एवं आपातकालीन प्रणाली",
        offline_mode: "ऑफ़लाइन मोड (100% स्थानीय)",
        online_mode: "ऑनलाइन मोड (सिंक उपलब्ध)",
        header_settings_title: "चिकित्सा सामग्री प्रबंधक एवं एआई रजिस्ट्री",
        header_diagnostics_title: "10-पॉइंट ऑफ़लाइन डायग्नोस्टिक चेक",
        header_profile_title: "रोगी मेडिकल प्रोफ़ाइल एवं आपातकालीन आईडी",

        // Emergency Top Banner
        emergency_banner_title: "आपातकालीन रेड-फ्लैग चेतावनी प्रणाली",
        emergency_banner_desc: "हार्ट अटैक, स्ट्रोक (FAST), सांस फूलना या पेट के गंभीर दर्द के लिए त्वरित चिकित्सीय मार्गदर्शन।",
        emergency_activate_btn: "⚡ आपातकालीन कंसोल शुरू करें",

        // 8 Navigation Deck Modules
        nav_triage_title: "3D ट्राइएज एवं एनएलपी",
        nav_triage_desc: "3D एनाटॉमी स्कैनर एवं प्राकृतिक भाषा ट्राइएज।",
        nav_atlas_title: "मेडिकल एटलस",
        nav_atlas_desc: "WHO एवं ICMR ज्ञानकोष में त्वरित खोज।",
        nav_pharmacy_title: "फ़ार्मेसी मैट्रिक्स",
        nav_pharmacy_desc: "दवा विवरण एवं परस्पर सुरक्षा विश्लेषण।",
        nav_vision_title: "विज़न स्क्रीनिंग",
        nav_vision_desc: "स्थानीय इमेज विश्लेषण एवं त्वचा/एक्स-रे जांच।",
        nav_emergency_title: "आपातकालीन डिस्पैच",
        nav_emergency_desc: "त्वरित 112/108 एम्बुलेंस एवं ट्रॉमा सहायता।",
        nav_map_title: "ऑफ़लाइन जीपीएस मैप",
        nav_map_desc: "निकटतम अस्पताल एवं नेविगेशन रूट।",
        nav_records_title: "रोगी प्रोफ़ाइल",
        nav_records_desc: "एन्क्रिप्टेड स्वास्थ्य आईडी, एलर्जी व क्यूआर पासपोर्ट।",
        nav_sentinel_title: "सिस्टम सेंटिनल",
        nav_sentinel_desc: "10-पॉइंट रियल-टाइम ऑफ़लाइन इंजन ऑडिट।",

        // 3D Anatomy Visualizer Controls
        anatomy_model_label: "शरीर रचना:",
        male_anatomy: "♂ पुरुष शरीर",
        female_anatomy: "♀ महिला शरीर",
        search_anatomy_placeholder: "🔍 शरीर का अंग खोजें (जैसे: हृदय, दायां घुटना, यकृत, पेट)...",
        triage_history_btn: "📜 पुराना इतिहास",
        active_region_label: "चयनित शारीरिक अंग:",
        body_system_label: "शारीरिक प्रणाली:",
        region_ready_badge: "अंग तैयार",
        selected_target_badge: "चयनित अंग",
        default_region_name: "छाती एवं हृदय क्षेत्र",
        default_system_name: "हृदय / मस्कुलोस्केलेटल प्रणाली",

        // Clinical Triage Intake & Questions
        triage_section_title: "ऑफ़लाइन क्लिनिकल ट्राइएज एवं लक्षण डेटा",
        triage_section_subtitle: "3D शरीर के किसी भी अंग को स्पर्श करें या ऊपर खोजकर ट्राइएज शुरू करें।",
        questionnaire_title: "चिकित्सीय मूल्यांकन प्रश्न",
        questionnaire_subtitle: "अपनी स्थिति के सटीक विश्लेषण के लिए उपयुक्त विकल्प चुनें:",
        questionnaire_tap_tag: "उत्तर चुनें",
        additional_symptoms_label: "⚡ अतिरिक्त शारीरिक लक्षण:",
        symptom_prompt_label: "इस अंग में आप क्या समस्या या लक्षण महसूस कर रहे हैं?",
        symptom_input_placeholder: "जैसे: मेरे पेट के निचले दाएं हिस्से में 8 घंटे से दर्द है और चलने पर उल्टी जैसा लगता है...",
        voice_input_btn: "🎤 बोलकर बताएं",
        voice_listening: "🔴 सुन रहे हैं...",
        clear_prompt_btn: "साफ़ करें",

        // Demographics Matrix
        age_group_label: "आयु वर्ग",
        age_adult: "वयस्क (18-64 वर्ष)",
        age_child: "बच्चा (<12 वर्ष)",
        age_adolescent: "किशोर (12-17 वर्ष)",
        age_senior: "वरिष्ठ नागरिक (65+ वर्ष)",
        severity_label: "गंभीरता",
        severity_moderate: "मध्यम",
        severity_mild: "हल्का (सहनीय)",
        severity_severe: "गंभीर (असहनीय दर्द)",
        duration_label: "अवधि",
        duration_hours: "घंटों में (< 24 घंटे)",
        duration_days: "1 - 3 दिन",
        duration_weeks: "सप्ताह / पुराना (> 2 सप्ताह)",
        pregnancy_label: "क्या गर्भावस्था संभव है?",
        pregnancy_no: "नहीं",
        pregnancy_yes: "हाँ / संभव है",

        // Presets & Action
        presets_label: "⚡ त्वरित केस सिमुलेशन:",
        preset_cardiac: "❤️ हार्ट अटैक / सीने में दर्द",
        preset_stroke: "🧠 स्ट्रोक चेतावनी (FAST)",
        preset_asthma: "🫁 अस्थमा / सांस की तकलीफ",
        preset_appendicitis: "🩺 तीव्र अपेंडिसाइटिस",
        preset_kidney_stone: "🚽 पथरी का दर्द",
        preset_knee_strain: "🦵 घुटने की मांसपेशियों में खिंचाव",
        run_triage_btn: "ऑफ़लाइन क्लिनिकल ट्राइएज शुरू करें",
        triage_evaluating: "⚡ ऑफ़लाइन विश्लेषण जारी है...",

        // Triage Results Section
        triage_result_header: "ऑफ़लाइन चिकित्सीय ट्राइएज मूल्यांकन",
        btn_read_aloud: "🔊 बोलकर सुनाएं",
        recommended_action_label: "अनुशंसित कार्रवाई:",
        possible_explanations_title: "संभावित कारण और विवरण:",
        first_aid_title: "आप अभी क्या कर सकते हैं (प्राथमिक उपचार):",
        otc_info_title: "सुरक्षित दवा संबंधी जानकारी:",
        red_flags_title: "आपातकालीन खतरे के संकेत (तुरंत अस्पताल जाएं):",
        btn_qr_share: "📱 पैरामेडिक क्यूआर रिपोर्ट देखें",
        btn_nearest_facility: "🏥 निकटतम अस्पताल / क्लिनिक",
        zero_cloud_footer: "100% ऑफ़लाइन | किसी इंटरनेट की आवश्यकता नहीं",
        clinical_disclaimer_label: "चिकित्सीय अस्वीकरण:",

        // Triage History Modal
        history_modal_title: "📜 ऑफ़लाइन ट्राइएज इतिहास",
        history_modal_desc: "सभी सत्र रिकॉर्ड आपके ब्राउज़र के सुरक्षित IndexedDB में संग्रहीत हैं। कोई डेटा क्लाउड पर नहीं जाता।",
        btn_export_history: "📥 डेटा डाउनलोड (JSON)",
        btn_clear_history: "🗑️ इतिहास हटाएं",
        btn_close_history: "बंद करें",
        no_history_records: "कोई पुराना रिकॉर्ड नहीं मिला।",

        // Module 2: Medical Atlas
        atlas_title: "प्रमाणित मेडिकल ज्ञानकोष",
        atlas_subtitle: "WHO एवं ICMR प्रमाणित स्वास्थ्य विषयों में त्वरित खोज।",
        atlas_search_placeholder: "🔍 बीमारी, लक्षण, दवा खोजें (जैसे: 'डेंगू बुखार', 'गैस एसिडिटी', 'निमोनिया', 'अस्थमा', 'पथरी', 'पैरासिटामोल')...",
        atlas_empty_prompt: "बीमारी या दवा के बारे में जानने के लिए ऊपर लिखकर खोजें।",
        cat_all: "🌐 सभी विषय",
        cat_infectious: "🦠 संक्रामक रोग",
        cat_cardio: "❤️ हृदय रोग",
        cat_resp: "🫁 श्वसन रोग",
        cat_gastro: "🩺 पाचन तंत्र",
        cat_emergency: "🚨 आपातकालीन खतरे",
        cat_medicine: "💊 आवश्यक दवाएं",

        // Atlas Modal & Cards
        modal_overview_title: "📋 सत्यापित नैदानिक विवरण एवं प्रोटोकॉल:",
        modal_firstaid_title: "🩹 त्वरित प्राथमिक उपचार एवं घरेलू उपाय:",
        modal_treatment_title: "📋 मानक प्रबंधन एवं उपचार प्रोटोकॉल (WHO/ICMR):",
        modal_medication_title: "💊 सुरक्षित दवा मार्गदर्शन, खुराक एवं सुरक्षा:",
        modal_emergency_title: "🚨 आपातकालीन खतरे के संकेत एवं अस्पताल ट्रिगर (112 / 108):",
        modal_authority_title: "🏛️ प्रमाणित स्वास्थ्य संस्था:",
        modal_offline_title: "⚡ ऑफ़लाइन उपलब्धता:",
        modal_guidance_note: "⚠️ चिकित्सीय मार्गदर्शन नोट:",
        modal_guidance_desc: "यह प्रविष्टि नैदानिक निर्णय समर्थन और त्वरित आपातकालीन सत्यापन के लिए है। गंभीर स्थिति में तुरंत आपातकालीन एम्बुलेंस (112/108) बुलाएं।",
        btn_launch_triage_modal: "🩺 इस बीमारी के लिए 3D ट्राइएज शुरू करें",
        btn_close_modal: "विंडो बंद करें",
        btn_view_deepdive: "📖 संपूर्ण उपचार विवरण देखें",
        btn_start_triage_card: "🩺 इसके लिए 3D ट्राइएज करें",
        btn_check_drug_card: "⚡ दवा सुरक्षा की जांच करें",

        // Module 3: Pharmacy Matrix
        pharmacy_title: "ऑफ़लाइन फ़ार्मेसी डायरेक्टरी एवं सुरक्षा",
        pharmacy_subtitle: "स्वीकृत दवाओं, दुष्प्रभावों और दवाओं के परस्पर प्रभाव की प्रामाणिक जानकारी।",
        drug_eval_title: "⚡ दो दवाओं के परस्पर प्रभाव की जांच",
        med_a_label: "पहली दवा (A)",
        med_b_label: "दूसरी दवा (B)",
        btn_check_interaction: "⚡ दवा सुरक्षा की जांच करें",

        // Module 4: Vision Screening
        vision_title: "चिकित्सीय इमेज गुणवत्ता एवं स्क्रीनिंग",
        vision_subtitle: "स्थानीय ऑफ़लाइन फोटो स्पष्टता जांच एवं त्वचा/एक्स-रे विश्लेषण।",
        select_task_label: "स्क्रीनिंग प्रकार चुनें",
        task_skin_lesion: "त्वचा रोग स्क्रीनिंग (ISIC Benchmark)",
        task_chest_xray: "चेस्ट एक्स-रे स्क्रीनिंग (CXR Benchmark)",
        dropzone_title: "मेडिकल फोटो अपलोड करें",
        dropzone_subtitle: "फोटो की स्पष्टता और रिज़ॉल्यूशन की ऑफ़लाइन जांच होगी",
        btn_run_vision: "एआई विश्लेषण शुरू करें",
        vision_empty_prompt: "फोटो चुनें और गुणवत्ता विश्लेषण एवं परिणाम देखें।",

        // Module 5: Emergency Dispatch
        emergency_protocol_title: "आपातकालीन मेडिकल प्रोटोकॉल",
        emergency_protocol_subtitle: "गंभीर लक्षणों में बिना देरी किए तुरंत चिकित्सीय सहायता प्राप्त करें।",
        national_dispatch_label: "राष्ट्रीय आपातकालीन नंबर",
        dispatch_numbers: "📞 112 / 108",
        dispatch_desc: "24/7 एम्बुलेंस, पुलिस और अग्निशमन सेवाएं",
        nearest_trauma_label: "निकटतम 24/7 ट्रॉमा सेंटर",
        trauma_center_name: "मेट्रोपोलिस सेंट्रल ट्रॉमा",
        trauma_center_desc: "दूरी: 0.8 किमी | आईसीयू, हृदय रोग एवं स्ट्रोक यूनिट",
        btn_view_map_route: "🗺️ ऑफ़लाइन मैप एवं नेविगेशन रूट",
        btn_display_emergency_qr: "📱 आपातकालीन क्यूआर कोड देखें",

        // Module 6: Facilities & Map
        map_title: "ऑफ़लाइन अस्पताल रडार एवं रूट नेविगेशन",
        map_subtitle: "प्रीलोडेड अस्पताल सूची और निकटतम सुरक्षित रास्ते की गणना।",
        simulate_blocked_road: "बंद सड़क का सिमुलेशन करें",
        legend_emergency: "24/7 आपातकालीन / ट्रॉमा",
        legend_hospital: "अस्पताल",
        legend_clinic: "प्राथमिक क्लिनिक",
        legend_pharmacy: "24/7 मेडिकल स्टोर",
        legend_you: "आपकी स्थिति (GPS)",
        facilities_heading: "स्थानीय स्वास्थ्य केंद्र",
        filter_all_facilities: "सभी स्वास्थ्य केंद्र",
        filter_emergency: "आपातकालीन एवं ट्रॉमा",
        filter_hospitals: "अस्पताल",
        filter_clinics: "क्लिनिक",
        filter_pharmacies: "दवा की दुकानें",

        // Module 7: Health Vault & Patient Profile
        vault_title: "रोगी प्रोफ़ाइल एवं सुरक्षित मेडिकल आईडी",
        vault_subtitle: "क्लाइंट-साइड AES-GCM 256-बिट एन्क्रिप्टेड स्टोरेज। आपकी प्रोफ़ाइल के अनुसार सिस्टम स्वचालित रूप से सटीक परामर्श और सुरक्षा जांच करेगा।",
        vault_status_title: "रोगी नैदानिक प्रोफ़ाइल",
        vault_badge_enc: "AES-GCM 256-बिट एन्क्रिप्टेड",
        vault_desc: "स्वास्थ्य डेटा केवल आपके ब्राउज़र में सुरक्षित रहता है। ट्राइएज इंजन, फार्मेसी चेकर और आपातकालीन एसओएस दवा एलर्जी और मतभेदों से बचाने के लिए स्वचालित रूप से इस प्रोफ़ाइल का उपयोग करते हैं।",
        profile_heading: "रोगी मेडिकल प्रोफ़ाइल एवं आपातकालीन आईडी",
        profile_subheading: "आपकी प्रोफ़ाइल डेटा के अनुसार सिस्टम स्वचालित रूप से सटीक परामर्श और सुरक्षा जांच करेगा।",
        profile_section_personal: "1. व्यक्तिगत पहचान एवं शारीरिक विवरण",
        profile_section_clinical: "2. एलर्जी, पुरानी बीमारियां एवं नियमित दवाएं",
        profile_section_emergency: "3. आपातकालीन संपर्क एवं गृह स्थान",
        profile_full_name: "पूरा नाम",
        profile_age: "उम्र (वर्ष)",
        profile_dob: "जन्म तिथि",
        profile_gender: "जैविक लिंग",
        profile_blood_group: "रक्त समूह (Blood Group)",
        profile_weight: "वजन (किग्रा)",
        profile_height: "ऊंचाई (सेमी)",
        profile_bmi: "अनुमानित बीएमआई (BMI)",
        profile_allergies_label: "दवा या खाद्य एलर्जी",
        profile_allergies_placeholder: "जैसे: पेनिसिलिन, सल्फा, एस्पिरिन, एनएसएआईडी, मूंगफली...",
        profile_conditions_label: "पुरानी बीमारियां (Chronic Conditions)",
        profile_conditions_placeholder: "जैसे: उच्च रक्तचाप, टाइप 2 मधुमेह, अस्थमा, हृदय रोग, गुर्दे की बीमारी...",
        profile_medications_label: "वर्तमान में ली जाने वाली नियमित दवाएं",
        profile_medications_placeholder: "जैसे: मेटफॉर्मिन 500mg, एम्लोडिपिन 5mg, इनहेलर...",
        profile_pregnancy_label: "गर्भावस्था की स्थिति (यदि लागू हो)",
        profile_emergency_name: "आपातकालीन संपर्क व्यक्ति का नाम",
        profile_emergency_phone: "आपातकालीन फोन नंबर",
        profile_emergency_relation: "संबंध",
        profile_district: "गृह जिला / क्षेत्र (ओडिशा)",
        btn_save_profile: "💾 प्रोफ़ाइल सुरक्षित एवं सिंक करें",
        btn_clear_profile: "🗑️ प्रोफ़ाइल साफ़ करें",
        btn_export_id: "🪪 आपातकालीन मेडिकल आईडी प्रिंट करें",
        profile_synced_badge: "👤 प्रोफ़ाइल ऑटो-सिंक",
        profile_active_label: "सक्रिय रोगी:",
        profile_auto_fetch_tip: "⚡ प्रोफ़ाइल विवरण स्वचालित रूप से 3D ट्राइएज, फार्मेसी सुरक्षा अलर्ट और आपातकालीन एसओएस में लागू होते हैं।",
        vault_allergies_label: "एलर्जी एवं पुरानी बीमारियां (स्थानीय एन्क्रिप्टेड)",
        vault_allergies_placeholder: "जैसे: पेनिसिलिन एलर्जी, टाइप 2 डायबिटीज, हाइपरटेंशन, अस्थमा...",
        btn_save_vault: "💾 स्वास्थ्य प्रोफ़ाइल सुरक्षित करें",

        // Module 8: Sentinel Diagnostics
        sentinel_title: "10-पॉइंट सिस्टम सेंटिनल",
        sentinel_subtitle: "पुष्टि करता है कि सभी ऑफ़लाइन सब-सिस्टम बिना क्लाउड के पूरी तरह सक्रिय हैं।",
        btn_rerun_diag: "🔄 पुनः परीक्षण करें",
        diag_page_title: "ऑफ़लाइन सिस्टम डायग्नोस्टिक्स",
        diag_page_subtitle: "शून्य नेटवर्क सत्यापन के लिए व्यापक 10-पॉइंट स्व-निदान मैट्रिक्स।",
        btn_back_app: "← मुख्य ऐप पर लौटें",

        // QR Share Modal
        qr_modal_title: "ऑफ़लाइन रिपोर्ट शेयर",
        qr_modal_desc: "बिना इंटरनेट के डॉक्टर या पैरामेडिक को यह क्यूआर कोड दिखाकर अपनी रिपोर्ट साझा करें।",
        btn_close_qr: "विंडो बंद करें",

        // Footer
        footer_disclaimer_title: "चिकित्सीय सूचना एवं निर्णय सहायता प्रणाली:",
        footer_disclaimer_body: "SwasthyaAI केवल सूचना, निर्णय सहायता और आपातकालीन प्राथमिक उपचार मार्गदर्शन के लिए है। यह लाइसेंस प्राप्त डॉक्टर का विकल्प नहीं है, अंतिम निदान नहीं करता और न ही दवाएं लिखता है।",
        footer_meta: "मो स्वास्थ्य v2.5.0 | ज्ञानकोष v18 | 100% शून्य क्लाउड निर्भरता"
      }
    };

    // Dictionary of anatomical regions for 3D body and tooltips
    this.regionNames = {
      head: { en: "Head & Cranium", od: "ମୁଣ୍ଡ ଓ କପାଳ", hi: "सिर और खोपड़ी" },
      brain: { en: "Brain & Nervous System", od: "ମସ୍ତିଷ୍କ ଓ ସ୍ନାୟୁ ପ୍ରଣାଳୀ", hi: "मस्तिष्क और तंत्रिका तंत्र" },
      face: { en: "Face & Jaw", od: "ମୁହଁ ଓ ପାଟି ଗାଲ", hi: "चेहरा और जबड़ा" },
      eyes: { en: "Eyes & Vision", od: "ଆଖି ଓ ଦୃଷ୍ଟିଶକ୍ତି", hi: "आंखें और दृष्टि" },
      ears: { en: "Ears & Hearing", od: "କାନ ଓ ଶ୍ରବଣ", hi: "कान और श्रवण" },
      nose: { en: "Nose & Sinuses", od: "ନାକ ଓ ସାଇନସ୍", hi: "नाक और साइनस" },
      throat: { en: "Throat & Pharynx", od: "ଗଳା ଓ ଶ୍ୱାସନଳୀ", hi: "गला और ग्रसनी" },
      neck: { en: "Neck & Cervical Spine", od: "ବେକ ଓ ମେରୁଦଣ୍ଡ", hi: "गर्दन और ग्रीवा रीढ़" },
      right_shoulder: { en: "Right Shoulder", od: "ଡାହାଣ କାନ୍ଧ", hi: "दायां कंधा" },
      left_shoulder: { en: "Left Shoulder", od: "ବାମ କାନ୍ଧ", hi: "बायां कंधा" },
      chest: { en: "Chest Wall", od: "ଛାତି କାନ୍ଥ", hi: "छाती की दीवार" },
      heart: { en: "Heart Area", od: "ହୃଦୟ ଅଞ୍ଚଳ", hi: "हृदय क्षेत्र" },
      lungs: { en: "Lungs & Respiratory", od: "ଫୁସଫୁସ ଓ ଶ୍ୱାସକ୍ରିୟା", hi: "फेफड़े और श्वसन" },
      breast: { en: "Breast & Mammary Tissue", od: "ସ୍ତନ ଓ ମାମାରି ଟିସୁ", hi: "स्तन ऊतक" },
      right_breast: { en: "Right Breast", od: "ଡାହାଣ ସ୍ତନ", hi: "दायां स्तन" },
      left_breast: { en: "Left Breast", od: "ବାମ ସ୍ତନ", hi: "बायां स्तन" },
      right_bicep: { en: "Right Upper Arm", od: "ଡାହାଣ ଉପର ବାହୁ", hi: "दायां ऊपरी हाथ" },
      left_bicep: { en: "Left Upper Arm", od: "ବାମ ଉପର ବାହୁ", hi: "बायां ऊपरी हाथ" },
      right_elbow: { en: "Right Elbow", od: "ଡାହାଣ କହୁଣୀ", hi: "दाहिनी कोहनी" },
      left_elbow: { en: "Left Elbow", od: "ବାମ କହୁଣୀ", hi: "बाईं कोहनी" },
      right_forearm: { en: "Right Forearm", od: "ଡାହାଣ ହାତ ଅଗ୍ରବାହୁ", hi: "दायां अग्रभाग" },
      left_forearm: { en: "Left Forearm", od: "ବାମ ହାତ ଅଗ୍ରବାହୁ", hi: "बायां अग्रभाग" },
      right_wrist: { en: "Right Wrist & Hand", od: "ଡାହାଣ ମଣିବନ୍ଧ ଓ ହାତ", hi: "दाहिनी कलाई और हाथ" },
      left_wrist: { en: "Left Wrist & Hand", od: "ବାମ ମଣିବନ୍ଧ ଓ ହାତ", hi: "बाईं कलाई और हाथ" },
      upper_abdomen: { en: "Epigastrium & Upper Abdomen", od: "ଉପର ପେଟ ଅଞ୍ଚଳ", hi: "ऊपरी पेट क्षेत्र" },
      stomach: { en: "Stomach Area", od: "ପାକସ୍ଥଳୀ ଅଞ୍ଚଳ", hi: "आमाशय / पेट क्षेत्र" },
      liver: { en: "Liver & Gallbladder", od: "ଯକୃତ ଓ ପିତ୍ତାଶୟ", hi: "यकृत और पित्ताशय" },
      pancreas: { en: "Pancreas", od: "ଅଗ୍ନାଶୟ", hi: "अग्न्याशय" },
      spleen: { en: "Spleen", od: "ପ୍ଲୀହା", hi: "प्लीहा / तिल्ली" },
      lower_right_abdomen: { en: "Lower Right Abdomen (Appendix)", od: "ତଳ ଡାହାଣ ପେଟ (ଆପେଣ୍ଡିକ୍ସ)", hi: "निचला दायां पेट (अपेंडिक्स)" },
      lower_left_abdomen: { en: "Lower Left Abdomen (Colon)", od: "ତଳ ବାମ ପେଟ (କୋଲନ)", hi: "निचला बायां पेट (कोलन)" },
      pelvis: { en: "Pelvis & Hypogastrium", od: "ପେଲଭିସ୍ ଓ ନିମ୍ନ ପେଟ", hi: "श्रोणि एवं निचला पेट" },
      bladder: { en: "Urinary Bladder", od: "ମୂତ୍ରାଶୟ", hi: "मूत्राशय" },
      right_hip: { en: "Right Hip & Pelvic Girdle", od: "ଡାହାଣ ଅଣ୍ଟା ଓ ନିତମ୍ବ", hi: "दायां कूल्हा" },
      left_hip: { en: "Left Hip & Pelvic Girdle", od: "ବାମ ଅଣ୍ଟା ଓ ନିତମ୍ବ", hi: "बायां कूल्हा" },
      upper_back: { en: "Upper Back & Thoracic Spine", od: "ଉପର ପିଠି ଓ ମେରୁଦଣ୍ଡ", hi: "ऊपरी पीठ और रीढ़" },
      spine: { en: "Spine & Vertebral Column", od: "ମେରୁଦଣ୍ଡ ସ୍ତମ୍ଭ", hi: "रीढ़ की हड्डी" },
      lower_back: { en: "Lower Back / Lumbar Spine", od: "ତଳ ପିଠି / ଅଣ୍ଟା", hi: "निचली पीठ / कमर" },
      kidneys: { en: "Kidneys & Flanks", od: "ବୃକ୍‌କ ଓ କୋଳିଥାପଟ", hi: "गुर्दे और पार्श्व" },
      gluteal: { en: "Gluteal Region & Hips", od: "ନିତମ୍ବ ଅଞ୍ଚଳ", hi: "नितंब क्षेत्र" },
      testes_scrotum: { en: "Testicles & Scrotum", od: "ଅଣ୍ଡକୋଷ", hi: "अंडकोष" },
      penis: { en: "Penis & Urethra", od: "ମୂତ୍ରମାର୍ଗ", hi: "मूत्रमार्ग" },
      prostate: { en: "Prostate Gland", od: "ପ୍ରୋଷ୍ଟେଟ୍ ଗ୍ରନ୍ଥି", hi: "प्रोस्टेट ग्रंथि" },
      uterus_ovaries: { en: "Uterus & Ovaries", od: "ଜରାୟୁ ଓ ଡିମ୍ବାଶୟ", hi: "गर्भाशय और अंडाशय" },
      vulva_vagina: { en: "Vulva & Pelvic Floor", od: "ପେଲଭିକ୍ ଫ୍ଲୋର୍", hi: "पेल्विक फ्लोर" },
      right_thigh: { en: "Right Thigh & Quadriceps", od: "ଡାହାଣ ଜଙ୍ଘ", hi: "दाहिनी जांघ" },
      left_thigh: { en: "Left Thigh & Quadriceps", od: "ବାମ ଜଙ୍ଘ", hi: "बाईं जांघ" },
      right_knee: { en: "Right Knee Joint", od: "ଡାହାଣ ଆଣ୍ଠୁ ଗଣ୍ଠି", hi: "दायां घुटना जोड़" },
      left_knee: { en: "Left Knee Joint", od: "ବାମ ଆଣ୍ଠୁ ଗଣ୍ଠି", hi: "बायां घुटना जोड़" },
      right_lower_leg: { en: "Right Shin & Calf", od: "ଡାହାଣ ଗୋଡ଼ ନଳୀ ଓ ପିଣ୍ଡୁଳା", hi: "दाहिनी पिंडली" },
      left_lower_leg: { en: "Left Shin & Calf", od: "ବାମ ଗୋଡ଼ ନଳୀ ଓ ପିଣ୍ଡୁଳା", hi: "बाईं पिंडली" },
      right_ankle: { en: "Right Ankle & Foot", od: "ଡାହାଣ ଗୋଇଠି ଓ ପାଦ", hi: "दायां टखना और पैर" },
      left_ankle: { en: "Left Ankle & Foot", od: "ବାମ ଗୋଇଠି ଓ ପାଦ", hi: "बायां टखना और पैर" }
    };

    // Body Systems Dictionary
    this.systemNames = {
      "Neurological": { en: "Neurological", od: "ସ୍ନାୟୁ ପ୍ରଣାଳୀ", hi: "तंत्रिका तंत्र" },
      "Neurological / Dental": { en: "Neurological / Dental", od: "ସ୍ନାୟୁ ଓ ଦନ୍ତ ଚିକିତ୍ସା", hi: "तंत्रिका एवं दंत चिकित्सा" },
      "Ophthalmology": { en: "Ophthalmology", od: "ଚକ୍ଷୁ ବିଜ୍ଞାନ", hi: "नेत्र विज्ञान" },
      "ENT": { en: "ENT", od: "ନାକ, କାନ ଓ ଗଳା", hi: "ईएनटी (नाक, कान, गला)" },
      "ENT / Respiratory": { en: "ENT / Respiratory", od: "ଗଳା ଓ ଶ୍ୱାସନଳୀ", hi: "श्वसन एवं ईएनटी" },
      "Musculoskeletal / Neurological": { en: "Musculoskeletal / Neurological", od: "ମାଂସପେଶୀ ଓ ସ୍ନାୟୁ ପ୍ରଣାଳୀ", hi: "मस्कुलोस्केलेटल एवं तंत्रिका" },
      "Musculoskeletal": { en: "Musculoskeletal", od: "ମାଂସପେଶୀ ଓ ଅସ୍ଥି ପ୍ରଣାଳୀ", hi: "मस्कुलोस्केलेटल (हड्डी व मांसपेशी)" },
      "Cardiovascular / Musculoskeletal": { en: "Cardiovascular / Musculoskeletal", od: "ହୃଦରୋଗ / ମାଂସପେଶୀ ପ୍ରଣାଳୀ", hi: "कार्डियोवस्कुलर एवं मस्कुलोस्केलेटल" },
      "Cardiovascular": { en: "Cardiovascular", od: "ହୃଦୟ ଓ ରକ୍ତ ସଞ୍ଚାଳନ", hi: "कार्डियोवैस्कुलर (हृदय प्रणाली)" },
      "Respiratory": { en: "Respiratory", od: "ଶ୍ୱାସକ୍ରିୟା ପ୍ରଣାଳୀ", hi: "श्वसन प्रणाली" },
      "Pulmonology": { en: "Pulmonology", od: "ଫୁସଫୁସ ବିଜ୍ଞାନ", hi: "पल्मोनोलॉजी (श्वसन प्रणाली)" },
      "Reproductive / Gynaecology": { en: "Reproductive / Gynaecology", od: "ପ୍ରଜନନ ଓ ସ୍ତ୍ରୀରୋଗ", hi: "प्रजनन एवं स्त्री रोग" },
      "Gastrointestinal": { en: "Gastrointestinal", od: "ପାଚନ ପ୍ରଣାଳୀ", hi: "गैस्ट्रोइंटेस्टाइनल (पाचन तंत्र)" },
      "Infectious Diseases": { en: "Infectious Diseases", od: "ସଂକ୍ରାମକ ରୋଗ", hi: "संक्रामक रोग" },
      "Emergency Red-Flags": { en: "Emergency Red-Flags", od: "ଜରୁରୀକାଳୀନ ବିପଦ ସଙ୍କେତ", hi: "आपातकालीन खतरे" },
      "Endocrine & Metabolic": { en: "Endocrine & Metabolic", od: "ଏଣ୍ଡୋକ୍ରାଇନ୍ ଓ ମେଟାବୋଲିକ୍", hi: "अंतःस्रावी एवं चयापचय" },
      "Orthopedics & Rheumatology": { en: "Orthopedics & Rheumatology", od: "ଅସ୍ଥିଶଲ୍ୟ ଓ ବାତ ରୋଗ", hi: "अस्थि एवं गठिया रोग" },
      "Neurological & Mental Health": { en: "Neurological & Mental Health", od: "ସ୍ନାୟୁ ଓ ମାନସିକ ସ୍ୱାସ୍ଥ୍ୟ", hi: "तंत्रिका एवं मानसिक स्वास्थ्य" },
      "Urological & Renal": { en: "Urological & Renal", od: "ମୂତ୍ର ଓ ବୃକ୍‌କ ପ୍ରଣାଳୀ", hi: "मूत्र एवं गुर्दा रोग" },
      "Dental & Oral": { en: "Dental & Oral", od: "ଦନ୍ତ ଓ ମୁଖ ସ୍ୱାସ୍ଥ୍ୟ", hi: "दंत एवं मुख स्वास्थ्य" },
      "Dermatological": { en: "Dermatological", od: "ଚର୍ମ ରୋଗ ବିଜ୍ଞାନ", hi: "त्वचा रोग विज्ञान" },
      "Medicine": { en: "Essential Medicine", od: "ଅତ୍ୟାବଶ୍ୟକ ଔଷଧ", hi: "आवश्यक दवा" }
    };

    // Common Symptoms Dictionary
    this.symptomTranslations = {
      "Pain": { en: "Pain", od: "ଯନ୍ତ୍ରଣା", hi: "दर्द" },
      "Swelling": { en: "Swelling", od: "ଫୁଲା", hi: "सूजन" },
      "Stiffness": { en: "Stiffness", od: "ଟାଣ ଲାଗିବା", hi: "अकड़न" },
      "Weakness": { en: "Weakness", od: "ଦୁର୍ବଳତା", hi: "कमज़ोरी" },
      "Burning Sensation": { en: "Burning Sensation", od: "ପୋଡ଼ାଜଳା", hi: "जलन" },
      "Numbness": { en: "Numbness", od: "ଝିମ୍ ଝିମ୍ ହେବା", hi: "सुन्नपन" },
      "Injury / Strain": { en: "Injury / Strain", od: "ଆଘାତ / ଟାଣ", hi: "चोट / खिंचाव" },
      "Spasm": { en: "Spasm", od: "ମାଂସପେଶୀ ଟାଣିବା", hi: "ऐंठन" },
      "Cough": { en: "Cough", od: "କାଶ", hi: "खांसी" },
      "Shortness of Breath": { en: "Shortness of Breath", od: "ଶ୍ୱାସକଷ୍ଟ", hi: "सांस फूलना" },
      "Fever": { en: "Fever", od: "ଜ୍ୱର", hi: "बुखार" },
      "Nausea": { en: "Nausea", od: "ବାନ୍ତି ଭାବ", hi: "जी मिचलाना" },
      "Dizziness": { en: "Dizziness", od: "ମୁଣ୍ଡ ବୁଲାଇବା", hi: "चक्कर आना" },
      "Headache": { en: "Headache", od: "ମୁଣ୍ଡବିନ୍ଧା", hi: "सिरदर्द" }
    };
  }

  setLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLang = lang;
      localStorage.setItem('swasthya_lang', lang);
      this.applyTranslationsToDOM();

      // Dispatch global event for all subsystems to refresh dynamic contents
      window.dispatchEvent(new CustomEvent('swasthya_language_changed', { detail: { lang } }));
      return true;
    }
    return false;
  }

  t(key, fallback = "") {
    const langDict = this.translations[this.currentLang] || this.translations['en'];
    return langDict[key] || this.translations['en'][key] || fallback || key;
  }

  translateRegion(regionId, fallbackName = "") {
    if (this.regionNames[regionId] && this.regionNames[regionId][this.currentLang]) {
      return this.regionNames[regionId][this.currentLang];
    }
    return fallbackName || regionId;
  }

  translateSystem(systemName) {
    if (this.systemNames[systemName] && this.systemNames[systemName][this.currentLang]) {
      return this.systemNames[systemName][this.currentLang];
    }
    return systemName;
  }

  translateSymptom(sName) {
    if (this.symptomTranslations[sName] && this.symptomTranslations[sName][this.currentLang]) {
      return this.symptomTranslations[sName][this.currentLang];
    }
    return sName;
  }

  /**
   * Localizes any medical topic or search document into the chosen language (en, hi, od)
   */
  localizeMedicalTopic(topicData, lang = null) {
    const l = lang || this.currentLang;
    const doc = (topicData && topicData.rawData) ? topicData.rawData : (topicData || {});

    let title = doc.name || doc.title || topicData.title || 'Medical Topic';
    let category = this.translateSystem(doc.category || topicData.category || 'General Medicine');
    let source = (typeof doc.source === 'object' && doc.source !== null ? doc.source.name : doc.source) ||
                 (typeof topicData.source === 'object' && topicData.source !== null ? topicData.source.name : topicData.source) ||
                 'WHO & ICMR Guidelines 2026';
    let simpleNames = doc.simple_names || doc.synonyms || topicData.simple_names || '';
    let overview = doc.overview || topicData.overview || '';
    let symptoms = Array.isArray(doc.symptoms) ? doc.symptoms.join(', ') : (doc.symptoms || topicData.symptoms || '');
    let firstAid = doc.first_aid || topicData.first_aid || '';
    let treatment = doc.treatment_protocol || doc.non_pharmacological_care || doc.general_uses || topicData.treatment_protocol || '';
    let medicationInfo = doc.medication_info || topicData.medication_info || '';
    let dosage = doc.dosage_guidelines || topicData.dosage_guidelines || '';
    let warnings = doc.warnings || topicData.warnings || '';
    let redFlags = Array.isArray(doc.red_flags) ? doc.red_flags.join('<br>• ') : (doc.red_flags || topicData.red_flags || '');

    // Smart fallback parser if overview is empty or doc.content has full combined text
    const content = doc.content || topicData.content || '';
    if (!overview && content) {
      if (content.includes('Overview:')) {
        const ovMatch = content.match(/Overview:\s*([^]+?)(?=(Symptoms:|First Aid|Diagnostic Protocol|Management Protocol|Medication Guidance|Warning Signs|$))/i);
        if (ovMatch) overview = ovMatch[1].trim();
      } else {
        overview = content;
      }
    }
    if (!symptoms && content && content.includes('Symptoms:')) {
      const symMatch = content.match(/Symptoms:\s*([^]+?)(?=(First Aid|Diagnostic Protocol|Management Protocol|Medication Guidance|Warning Signs|$))/i);
      if (symMatch) symptoms = symMatch[1].trim();
    }
    if (!firstAid && content && content.includes('First Aid')) {
      const faMatch = content.match(/First Aid[^:]*:\s*([^]+?)(?=(Diagnostic Protocol|Management Protocol|Medication Guidance|Warning Signs|$))/i);
      if (faMatch) firstAid = faMatch[1].trim();
    }
    if (!treatment && content && content.includes('Management Protocol:')) {
      const trMatch = content.match(/Management Protocol:\s*([^]+?)(?=(Medication Guidance|Warning Signs|$))/i);
      if (trMatch) treatment = trMatch[1].trim();
    }
    if (!medicationInfo && content && content.includes('Medication Guidance:')) {
      const medMatch = content.match(/Medication Guidance:\s*([^]+?)(?=(Warning Signs|$))/i);
      if (medMatch) medicationInfo = medMatch[1].trim();
    }
    if (!redFlags && content && content.includes('Warning Signs')) {
      const rfMatch = content.match(/Warning Signs[^:]*:\s*([^]+?)$/i);
      if (rfMatch) redFlags = rfMatch[1].trim();
    }

    // Format clean Title depending on language
    if (l === 'od') {
      if (title.includes('(') && title.includes('/')) {
        const parts = title.split('(');
        title = parts[0].trim();
      }
    } else if (l === 'hi') {
      if (title.includes('(') && title.includes('/')) {
        const inner = title.substring(title.indexOf('(') + 1, title.indexOf(')'));
        if (inner.includes('/')) {
          title = inner.split('/')[0].trim() + ' (' + title.split('(')[0].trim() + ')';
        }
      }
    }

    return {
      title,
      category,
      source,
      simple_names: simpleNames,
      overview,
      symptoms,
      first_aid: firstAid,
      treatment,
      medication_info: medicationInfo,
      dosage,
      warnings,
      red_flags: redFlags,
      labels: {
        overview_title: this.t('modal_overview_title'),
        firstaid_title: this.t('modal_firstaid_title'),
        treatment_title: this.t('modal_treatment_title'),
        medication_title: this.t('modal_medication_title'),
        emergency_title: this.t('modal_emergency_title'),
        authority_title: this.t('modal_authority_title'),
        offline_title: this.t('modal_offline_title'),
        guidance_note: this.t('modal_guidance_note'),
        guidance_desc: this.t('modal_guidance_desc'),
        launch_triage_btn: this.t('btn_launch_triage_modal'),
        close_modal_btn: this.t('btn_close_modal'),
        view_deepdive_btn: this.t('btn_view_deepdive'),
        start_triage_card: this.t('btn_start_triage_card'),
        check_drug_card: this.t('btn_check_drug_card'),
        read_aloud: this.t('btn_read_aloud')
      }
    };
  }

  /**
   * Translates targeted clinical questionnaire for any anatomy region into en, hi, od
   */
  getLocalizedQuestions(regionId, regionName, regionSystem) {
    const l = this.currentLang;
    const rName = this.translateRegion(regionId, regionName);
    const rSys = this.translateSystem(regionSystem);

    const questionsDb = {
      head: {
        en: {
          title: "Head & Cranial Clinical Assessment",
          groups: [
            { label: "1. Symptom Quality & Nature:", options: ["Throbbing / Pulsating", "Sudden Thunderclap / Worst ever", "Tight band / Heavy pressure", "Sharp stabbing pain", "Constant dull ache", "Dizziness / Vertigo / Lightheaded"] },
            { label: "2. Red Flag Neurological Warning Signs:", isRedFlag: true, options: ["Facial drooping or slurred speech", "Weakness / Numbness on one side", "High fever with stiff neck", "Recent head injury / trauma", "Confusion / Memory blackout"] },
            { label: "3. Accompanying Triggers & Sensations:", options: ["Visual aura / Flashing lights", "Nausea or vomiting", "Sensitivity to light & sound", "Worse with coughing or bending"] }
          ]
        },
        od: {
          title: "ମୁଣ୍ଡ ଓ କପାଳ ଡାକ୍ତରୀ ପ୍ରଶ୍ନାବଳୀ",
          groups: [
            { label: "୧. ଯନ୍ତ୍ରଣାର ପ୍ରକୃତି ଓ ଲକ୍ଷଣ:", options: ["ମୁଣ୍ଡ ଭିତରେ ବିନ୍ଧା / ଧପ୍ ଧପ୍ ହେବା", "ହଠାତ୍ ପ୍ରଚଣ୍ଡ ଯନ୍ତ୍ରଣା (ଜୀବନର ସବୁଠାରୁ ଖରାପ)", "ମୁଣ୍ଡରେ ଚାପ / ଭାରୀ ଲାଗିବା", "ତୀବ୍ର ଛୁଞ୍ଚି ଫୋଡ଼ିଲା ଭଳି ଯନ୍ତ୍ରଣା", "ଲଗାତାର ସାମାନ୍ୟ ଯନ୍ତ୍ରଣା", "ମୁଣ୍ଡ ବୁଲାଇବା / ଚକ୍କର"] },
            { label: "୨. ଜରୁରୀକାଳୀନ ବିପଦ ସଙ୍କେତ (Red Flags):", isRedFlag: true, options: ["ମୁହଁ ବଙ୍କା ହେବା କିମ୍ବା କଥା ଅସ୍ପଷ୍ଟ ହେବା", "ଗୋଟିଏ ପାର୍ଶ୍ୱରେ ଦୁର୍ବଳତା / ଝିମ୍ ଝିମ୍", "ଅତ୍ୟଧିକ ଜ୍ୱର ସହ ବେକ ଟାଣ ହେବା", "ମୁଣ୍ଡରେ ଆଘାତ ଲାଗିବା", "ଭ୍ରମ / ଚେତା ହରାଇବା"] },
            { label: "୩. ସମ୍ପର୍କିତ ଅସୁବିଧା:", options: ["ଆଲୋକ ସହନ ନହେବା / ଆଖି ଆଗରେ ଝଲକ", "ବାନ୍ତି ଭାବ କିମ୍ବା ବାନ୍ତି", "ଆଲୋକ ଓ ଶବ୍ଦ ପ୍ରତି ଅସହନଶୀଳତା", "କାଶିଲେ କିମ୍ବା ନଇଁଲେ ବଢ଼ିବା"] }
          ]
        },
        hi: {
          title: "सिर एवं कपाल चिकित्सीय प्रश्नावली",
          groups: [
            { label: "1. दर्द की प्रकृति एवं लक्षण:", options: ["सिर में धड़कन / टीस जैसा दर्द", "अचानक असहनीय तेज सिरदर्द", "सिर पर भारीपन / दबाव", "तेज चुभने वाला दर्द", "लगातार धीमा दर्द", "चक्कर आना / सिर घूमना"] },
            { label: "2. आपातकालीन खतरे के संकेत (Red Flags):", isRedFlag: true, options: ["चेहरे का टेढ़ापन या बोली लड़खड़ाना", "एक तरफ कमजोरी या सुन्नपन", "तेज बुखार के साथ गर्दन में अकड़न", "सिर पर हालिया चोट", "भ्रम / बेहोशी"] },
            { label: "3. संबंधित परेशानियां:", options: ["आंखों के आगे रोशनी चमकना", "जी मिचलाना या उल्टी", "रोशनी और आवाज से परेशानी", "खांसने या झुकने पर दर्द बढ़ना"] }
          ]
        }
      },
      brain: {
        en: {
          title: "Brain & Neurological Function Evaluation",
          groups: [
            { label: "1. Neurological Signs:", options: ["Sudden weakness in arm or leg", "Slurred or garbled speech", "Facial asymmetry / drooping", "Loss of balance / Coordination", "Sudden severe headache", "Confusion / Altered awareness"] },
            { label: "2. Critical FAST Stroke Screen:", isRedFlag: true, options: ["Symptoms started within last 4.5 hours", "Difficulty understanding speech", "Sudden numbness down one side", "Vision loss in one eye"] }
          ]
        },
        od: {
          title: "ମସ୍ତିଷ୍କ ଓ ସ୍ନାୟୁ ପ୍ରଣାଳୀ ପରୀକ୍ଷା",
          groups: [
            { label: "୧. ସ୍ନାୟୁଗତ ଲକ୍ଷଣ:", options: ["ହାତ କିମ୍ବା ଗୋଡ଼ରେ ହଠାତ୍ ଦୁର୍ବଳତା", "କଥା କହିବାରେ ଅସୁବିଧା / ଅସ୍ପଷ୍ଟ ଭାଷା", "ମୁହଁର ଗୋଟିଏ ପାର୍ଶ୍ୱ ଝୁଲିପଡ଼ିବା", "ଭାରସାମ୍ୟ ହରାଇବା", "ହଠାତ୍ ପ୍ରବଳ ମୁଣ୍ଡବିନ୍ଧା", "ମାନସିକ ଭ୍ରମ / ଚେତା ହରାଇବା"] },
            { label: "୨. ଷ୍ଟ୍ରୋକ୍ (FAST) ଜରୁରୀ ଯାଞ୍ଚ:", isRedFlag: true, options: ["ଲକ୍ଷଣ ଗତ ୪.୫ ଘଣ୍ଟା ମଧ୍ୟରେ ଆରମ୍ଭ ହୋଇଛି", "କଥା ବୁଝିବାରେ ଅସୁବିଧା", "ଗୋଟିଏ ପାର୍ଶ୍ୱ ସମ୍ପୂର୍ଣ୍ଣ ଅବଶ ହେବା", "ଗୋଟିଏ ଆଖିରେ ଦୃଷ୍ଟିଶକ୍ତି ହ୍ରାସ"] }
          ]
        },
        hi: {
          title: "मस्तिष्क एवं तंत्रिका तंत्र मूल्यांकन",
          groups: [
            { label: "1. न्यूरोलॉजिकल लक्षण:", options: ["हाथ या पैर में अचानक कमजोरी", "बोली में लड़खड़ाहट", "चेहरे का एक तरफ झुकना", "संतुलन खोना / लड़खड़ाना", "अचानक तेज सिरदर्द", "मानसिक भ्रम / बेहोशी"] },
            { label: "2. स्ट्रोक (FAST) आपातकालीन जांच:", isRedFlag: true, options: ["लक्षण पिछले 4.5 घंटे में शुरू हुए", "बात समझने में कठिनाई", "एक तरफ का शरीर सुन्न होना", "एक आंख से दिखना बंद होना"] }
          ]
        }
      },
      heart: {
        en: {
          title: "Cardiac & Cardiovascular Triage Questions",
          groups: [
            { label: "1. Chest Discomfort Character:", options: ["Crushing / Heavy central pressure ('Elephant on chest')", "Sharp stabbing pain with deep breath", "Burning / Acid pressure behind breastbone", "Fast fluttering / Skipped beats (Palpitations)", "Tight band across chest"] },
            { label: "2. Critical Cardiac Red Flags:", isRedFlag: true, options: ["Pain radiates to left arm, neck, jaw or back", "Cold clammy sweating & lightheadedness", "Shortness of breath at rest or minimal effort", "Worsens immediately upon walking / exertion", "Fainting / Near syncope"] },
            { label: "3. Timing & Relieving Factors:", options: ["Relieved within minutes by rest", "Relieved by antacids", "Relieved by leaning forward", "Constant without relief (> 20 mins)"] }
          ]
        },
        od: {
          title: "ହୃଦୟ ଓ ଛାତି ଡାକ୍ତରୀ ପ୍ରଶ୍ନାବଳୀ",
          groups: [
            { label: "୧. ଛାତି ଯନ୍ତ୍ରଣାର ସ୍ୱରୂପ:", options: ["ଛାତି ମଝିରେ ଭାରୀ ଚାପ ('ଛାତି ଉପରେ ପଥର ରହିଲା ଭଳି')", "ନିଶ୍ୱାସ ନେବା ବେଳେ ତୀବ୍ର ଯନ୍ତ୍ରଣା", "ଛାତି ଭିତରେ ଜଳାପୋଡ଼ା / ଏସିଡିଟି", "ହୃତ୍‌ସ୍ପନ୍ଦନ ଦ୍ରୁତ ହେବା (Palpitations)", "ଛାତି ଚାରିପାଖେ ଟାଣ ଲାଗିବା"] },
            { label: "୨. ଜରୁରୀକାଳୀନ ହୃଦରୋଗ ସଙ୍କେତ (Red Flags):", isRedFlag: true, options: ["ବାମ ହାତ, ବେକ, ମୁହଁ କିମ୍ବା ପିଠିକୁ ଯନ୍ତ୍ରଣା ବ୍ୟାପିବା", "ଥଣ୍ଡା ଝାଳ ବୋହିବା ଓ ମୁଣ୍ଡ ବୁଲାଇବା", "ବସିଥିବା ବେଳେ ଶ୍ୱାସକଷ୍ଟ ହେବା", "ଚାଲିଲେ ତୁରନ୍ତ ଯନ୍ତ୍ରଣା ବଢ଼ିବା", "ଚେତା ହରାଇବା / ମୂର୍ଚ୍ଛା"] },
            { label: "୩. ଉପଶମ ଓ ସମୟ:", options: ["ବିଶ୍ରାମ ନେଲେ କମିଯିବା", "ଏଣ୍ଟାସିଡ୍ ଖାଇଲେ କମିବା", "ଆଗକୁ ନଇଁ ବସିଲେ ଆରାମ ଲାଗିବା", "୨୦ ମିନିଟରୁ ଅଧିକ ଲଗାତାର ରହିବା"] }
          ]
        },
        hi: {
          title: "हृदय एवं सीना चिकित्सीय प्रश्नावली",
          groups: [
            { label: "1. सीने में दर्द की प्रकृति:", options: ["सीने के बीच में भारी दबाव ('सीने पर वजन जैसा')", "गहरी सांस लेने पर तेज दर्द", "सीने में जलन / एसिडिटी", "दिल की धड़कन तेज होना", "सीने में जकड़न"] },
            { label: "2. आपातकालीन हृदय खतरे के संकेत (Red Flags):", isRedFlag: true, options: ["दर्द बाएं हाथ, गर्दन, जबड़े या पीठ तक फैलना", "ठंडा पसीना आना और चक्कर आना", "बैठे-बैठे सांस फूलना", "चलने पर तुरंत दर्द बढ़ जाना", "बेहोशी या गिर जाना"] },
            { label: "3. राहत एवं समय:", options: ["आराम करने पर तुरंत ठीक होना", "एंटासिड से राहत मिलना", "आगे झुककर बैठने पर आराम", "20 मिनट से अधिक लगातार दर्द"] }
          ]
        }
      },
      chest: {
        en: {
          title: "Chest Wall & Thoracic Evaluation",
          groups: [
            { label: "1. Chest Symptoms:", options: ["Tenderness when pressing on ribs / sternum", "Sharp pain worse with deep inspiration / cough", "Burning sensation worse when lying flat", "Chest tightness after strenuous exercise"] },
            { label: "2. High-Risk Screening:", isRedFlag: true, options: ["Pain radiates to arm or jaw", "Shortness of breath or gasping", "Sweating, nausea or pale skin", "Coughing up blood"] }
          ]
        },
        od: {
          title: "ଛାତି ଓ ପଞ୍ଜରା ହାଡ଼ ପରୀକ୍ଷା",
          groups: [
            { label: "୧. ଛାତିର ଲକ୍ଷଣ:", options: ["ଛାତି କିମ୍ବା ପଞ୍ଜରା ହାଡ଼ ଉପରେ ଚିପିଲେ ଯନ୍ତ୍ରଣା", "ନିଶ୍ୱାସ ନେଲେ କିମ୍ବା କାଶିଲେ ଯନ୍ତ୍ରଣା ବଢ଼ିବା", "ଶୋଇଲେ ଛାତିରେ ପୋଡ଼ାଜଳା ବଢ଼ିବା", "କଠିନ ପରିଶ୍ରମ ପରେ ଛାତି ଟାଣିବା"] },
            { label: "୨. ବିପଦ ସଙ୍କେତ:", isRedFlag: true, options: ["ହାତ କିମ୍ବା ବେକକୁ ଯନ୍ତ୍ରଣା ବ୍ୟାପିବା", "ଶ୍ୱାସକଷ୍ଟ କିମ୍ବା ଧଇଁସଇଁ ହେବା", "ଝାଳ ବୋହିବା, ବାନ୍ତି ଭାବ ଓ ଚର୍ମ ଫିକା ପଡ଼ିବା", "କାଶରେ ରକ୍ତ ପଡ଼ିବା"] }
          ]
        },
        hi: {
          title: "छाती एवं पसलियों का मूल्यांकन",
          groups: [
            { label: "1. छाती के लक्षण:", options: ["पसलियों या छाती की हड्डी दबाने पर दर्द", "गहरी सांस या खांसने पर दर्द बढ़ना", "लेटने पर सीने में जलन बढ़ना", "परिश्रम के बाद छाती में भारीपन"] },
            { label: "2. खतरे के संकेत:", isRedFlag: true, options: ["दर्द हाथ या जबड़े की ओर फैलना", "सांस फूलना या घबराहट", "पसीना आना, जी मिचलाना", "खांसी में खून आना"] }
          ]
        }
      },
      lungs: {
        en: {
          title: "Pulmonary & Respiratory Assessment",
          groups: [
            { label: "1. Respiratory Signs:", options: ["Severe shortness of breath / Gasping", "Audible high-pitched wheezing", "Persistent dry or productive cough", "Coughing up blood or pink froth", "Chest tightness with history of asthma / COPD"] },
            { label: "2. Critical Respiratory Red Flags:", isRedFlag: true, options: ["Bluish lips or fingertips (Cyanosis)", "Unable to speak full sentences in one breath", "Rapid shallow breathing > 25 breaths/min", "High fever with shaking chills (Pneumonia)"] }
          ]
        },
        od: {
          title: "ଫୁସଫୁସ ଓ ଶ୍ୱାସକ୍ରିୟା ପରୀକ୍ଷା",
          groups: [
            { label: "୧. ଶ୍ୱାସଜନିତ ଲକ୍ଷଣ:", options: ["ଅତ୍ୟଧିକ ଶ୍ୱାସକଷ୍ଟ / ଧଇଁସଇଁ ହେବା", "ଶ୍ୱାସ ନେବା ବେଳେ ଶଁ ଶଁ ଶବ୍ଦ (Wheezing)", "ଲଗାତାର ଶୁଖିଲା କିମ୍ବା କଫ କାଶ", "କାଶରେ ରକ୍ତ ପଡ଼ିବା", "ପୂର୍ବରୁ ଆଜମା / ସିଓପିଡି ରୋଗ ଥିବା"] },
            { label: "୨. ଗୁରୁତର ଶ୍ୱାସରୋଧ ବିପଦ ସଙ୍କେତ:", isRedFlag: true, options: ["ଓଠ କିମ୍ବା ଆଙ୍ଗୁଠି ନୀଳ ପଡ଼ିଯିବା (Cyanosis)", "ଗୋଟିଏ ନିଶ୍ୱାସରେ ପୂରା ବାକ୍ୟ କହିନପାରିବା", "ଦ୍ରୁତ ଅଗଭୀର ନିଶ୍ୱାସ", "ଥରିକି ପ୍ରବଳ ଜ୍ୱର (ନିମୋନିଆ)"] }
          ]
        },
        hi: {
          title: "फेफड़े एवं श्वसन संबंधी प्रश्नावली",
          groups: [
            { label: "1. श्वसन लक्षण:", options: ["गंभीर सांस फूलना / हांफना", "सांस लेते समय सीटी जैसी आवाज (Wheezing)", "लगातार सूखी या बलगम वाली खांसी", "खांसी में खून आना", "अस्थमा या सांस की पुरानी बीमारी"] },
            { label: "2. गंभीर श्वसन खतरे के संकेत:", isRedFlag: true, options: ["होंठ या उंगलियों का नीला पड़ना (Cyanosis)", "एक सांस में पूरा वाक्य न बोल पाना", "बहुत तेज सांस चलना", "कंपकंपी के साथ तेज बुखार (निमोनिया)"] }
          ]
        }
      },
      lower_right_abdomen: {
        en: {
          title: "Right Lower Abdomen (Appendix) Triage",
          groups: [
            { label: "1. Appendiceal Sign Screening:", options: ["Pain started around navel and moved to right lower belly", "Sharp localized pain that intensifies when walking or coughing", "Rebound tenderness (hurts more when releasing pressure)", "Loss of appetite & nausea", "Low-grade fever"] },
            { label: "2. Critical Surgical Emergency Flags:", isRedFlag: true, options: ["Rigid board-like abdominal muscle spasm", "High fever > 101°F with chills", "Severe uncontrollable vomiting", "Sudden temporary pain relief followed by widespread agony"] }
          ]
        },
        od: {
          title: "ଡାହାଣ ତଳ ପେଟ (ଆପେଣ୍ଡିକ୍ସ) ଯାଞ୍ଚ",
          groups: [
            { label: "୧. ଆପେଣ୍ଡିସାଇଟିସ୍ ଲକ୍ଷଣ:", options: ["ନାଭି ପାଖରୁ ଆରମ୍ଭ ହୋଇ ଡାହାଣ ତଳ ପେଟକୁ ଯନ୍ତ୍ରଣା ଯିବା", "ଚାଲିଲେ କିମ୍ବା କାଶିଲେ ଯନ୍ତ୍ରଣା ବଢ଼ିବା", "ପେଟ ଚିପି ଛାଡ଼ିଦେଲେ ଅଧିକ କାଟିବା (Rebound tenderness)", "ଭୋକ ନଲାଗିବା ଓ ବାନ୍ତି ଭାବ", "ସାମାନ୍ୟ ଜ୍ୱର"] },
            { label: "୨. ଜରୁରୀକାଳୀନ ଅସ୍ତ୍ରୋପଚାର ବିପଦ ସଙ୍କେତ:", isRedFlag: true, options: ["ପେଟ କାଠ ପରି ଟାଣ ହୋଇଯିବା", "୧୦୧°F ରୁ ଅଧିକ ଜ୍ୱର ଓ ଥରିବା", "ଅନିୟନ୍ତ୍ରିତ କ୍ରମାଗତ ବାନ୍ତି", "ହଠାତ୍ ଯନ୍ତ୍ରଣା କମି ପୁଣି ସାରା ପେଟରେ ଅସହ୍ୟ ଯନ୍ତ୍ରଣା (ଫାଟିବା ଆଶଙ୍କା)"] }
          ]
        },
        hi: {
          title: "दाहिने निचले पेट (अपेंडिक्स) की जांच",
          groups: [
            { label: "1. अपेंडिसाइटिस लक्षण जांच:", options: ["नाभि के पास से शुरू होकर दाहिने निचले पेट में दर्द फैलना", "चलने या खांसने पर दर्द तेज होना", "पेट दबाकर छोड़ने पर ज्यादा दर्द (Rebound tenderness)", "भूख न लगना और उल्टी का मन", "हल्का बुखार"] },
            { label: "2. आपातकालीन सर्जरी के खतरे के संकेत:", isRedFlag: true, options: ["पेट का तख्ते की तरह कड़ा हो जाना", "101°F से अधिक तेज बुखार", "लगातार बेकाबू उल्टियां", "अचानक दर्द कम होकर पूरे पेट में असहनीय दर्द फैलना (फटने का खतरा)"] }
          ]
        }
      },
      kidneys: {
        en: {
          title: "Kidneys & Flank Colic Assessment",
          groups: [
            { label: "1. Renal Signs & Colic:", options: ["Excruciating sharp waves of pain in flank/back", "Pain radiating down to groin / testicle / labia", "Blood in urine (visible red or tea-colored)", "Nausea and vomiting with pain spikes"] },
            { label: "2. Critical Renal Infection Red Flags:", isRedFlag: true, options: ["High spiking fever > 101°F with shaking chills", "Uncontrollable vomiting unable to retain liquids", "Severe constant unremitting flank pain"] }
          ]
        },
        od: {
          title: "ବୃକ୍‌କ ଓ ପାର୍ଶ୍ୱ ପଥୁରୀ ଯନ୍ତ୍ରଣା ଯାଞ୍ଚ",
          groups: [
            { label: "୧. ପଥୁରୀ ଓ ବୃକ୍‌କ ସମ୍ବନ୍ଧୀୟ ଲକ୍ଷଣ:", options: ["କଟି / ପିଠି ପାର୍ଶ୍ୱରେ ଅସହ୍ୟ ତୀବ୍ର ଯନ୍ତ୍ରଣା ତରଙ୍ଗ", "ତଳିପେଟ କିମ୍ବା ଜଙ୍ଘକୁ ଯନ୍ତ୍ରଣା ଖସିବା", "ପରିସ୍ରାରେ ରକ୍ତ କିମ୍ବା ନାଲି ରଙ୍ଗ", "ଯନ୍ତ୍ରଣା ସହ ବାନ୍ତି ଭାବ ଓ ବାନ୍ତି"] },
            { label: "୨. ଗୁରୁତର ସଂକ୍ରମଣ ବିପଦ ସଙ୍କେତ:", isRedFlag: true, options: ["୧୦୧°F ରୁ ଅଧିକ ଜ୍ୱର ଓ ଥରିବା", "ଅତ୍ୟଧିକ ବାନ୍ତି ଯୋଗୁଁ ପାଣି ମଧ୍ୟ ନରହିବା", "ଲଗାତାର ପ୍ରଚଣ୍ଡ ପାର୍ଶ୍ୱ ଯନ୍ତ୍ରଣା"] }
          ]
        },
        hi: {
          title: "गुर्दा एवं पथरी दर्द मूल्यांकन",
          groups: [
            { label: "1. गुर्दे और पथरी के लक्षण:", options: ["कमर / पीठ के एक तरफ असहनीय तेज दर्द की लहरें", "दर्द का पेट के निचले हिस्से या जांघ तक फैलना", "पेशाब में खून या लाल रंग आना", "दर्द के साथ जी मिचलाना और उल्टी"] },
            { label: "2. गंभीर संक्रमण के खतरे के संकेत:", isRedFlag: true, options: ["101°F से अधिक कंपकंपी वाला बुखार", "अत्यधिक उल्टियां और पानी न रुकना", "लगातार असहनीय असहज दर्द"] }
          ]
        }
      }
    };

    const targetKey = questionsDb[regionId] ? regionId : (
      regionId.includes('abdomen') || regionId === 'stomach' || regionId === 'liver' ? 'lower_right_abdomen' :
      (regionId === 'heart' || regionId === 'chest' ? 'heart' :
      (regionId === 'lungs' || regionId === 'throat' || regionId === 'mouth_throat' ? 'lungs' :
      (regionId === 'kidneys' || regionId === 'pelvis' || regionId === 'bladder' ? 'kidneys' : 'head')))
    );

    const localizedSet = questionsDb[targetKey] && questionsDb[targetKey][l]
      ? questionsDb[targetKey][l]
      : (questionsDb[targetKey] ? questionsDb[targetKey]['en'] : null);

    if (localizedSet) {
      return {
        title: localizedSet.title.replace("Head", rName).replace("ମୁଣ୍ଡ", rName).replace("सिर", rName),
        groups: localizedSet.groups
      };
    }

    // Default Fallback
    const fallbackTitle = l === 'od' ? `${rName} ପରୀକ୍ଷା ପ୍ରଶ୍ନାବଳୀ` : (l === 'hi' ? `${rName} मूल्यांकन प्रश्नावली` : `${rName} Assessment Questions`);
    const g1Label = l === 'od' ? `୧. ${rName} ର ଲକ୍ଷଣ ସ୍ୱରୂପ:` : (l === 'hi' ? `1. ${rName} के लक्षण:` : `1. Nature of ${rName} Complaint:`);
    const g2Label = l === 'od' ? "୨. ଜରୁରୀକାଳୀନ ବିପଦ ସଙ୍କେତ:" : (l === 'hi' ? "2. आपातकालीन खतरे के संकेत:" : "2. Critical Red Flag Warning Signs:");

    return {
      title: fallbackTitle,
      groups: [
        {
          label: g1Label,
          options: l === 'od'
            ? ["ତୀବ୍ର ସ୍ଥାନୀୟ ଯନ୍ତ୍ରଣା", "ଲଗାତାର ସାମାନ୍ୟ ଯନ୍ତ୍ରଣା", "ଫୁଲା ଓ ଜଳାପୋଡ଼ା", "ଝିମ୍ ଝିମ୍ ଲାଗିବା", "ଟାଣ ଲାଗିବା ଓ ହଲଚଲ ହେବାରେ କଷ୍ଟ", "ମାଂସପେଶୀ ଦୁର୍ବଳତା"]
            : (l === 'hi'
            ? ["तेज स्थानीय दर्द", "लगातार धीमा दर्द", "सूजन एवं जलन", "सुन्नपन या झुनझुनी", "अकड़न और चलने में तकलीफ", "मांसपेशियों में कमजोरी"]
            : ["Sharp localized pain", "Dull constant ache", "Swelling & inflammation", "Burning / Tingling sensation", "Stiffness & limited motion", "Muscle spasm / weakness"])
        },
        {
          label: g2Label,
          isRedFlag: true,
          options: l === 'od'
            ? ["ଥରିକି ପ୍ରବଳ ଜ୍ୱର", "ଅସହ୍ୟ ଅନିୟନ୍ତ୍ରିତ ଯନ୍ତ୍ରଣା", "ହଠାତ୍ ଅବଶ ହେବା କିମ୍ବା କାର୍ଯ୍ୟକ୍ଷମତା ହରାଇବା", "ସ୍ପଷ୍ଟ ଆଘାତ କିମ୍ବା ବିକୃତି"]
            : (l === 'hi'
            ? ["कंपकंपी के साथ तेज बुखार", "असहनीय बेकाबू दर्द", "अचानक सुन्नपन या काम न करना", "स्पष्ट चोट या विकृति"]
            : ["High fever with chills", "Severe agonizing unmanageable pain", "Sudden numbness or loss of function", "Visible injury or deformity"])
        }
      ]
    };
  }

  /**
   * Localizes triage metadata and results into active language
   */
  getLocalizedTriageResult(triage) {
    const l = this.currentLang;
    const level = triage.triage_level || 1;
    const rName = this.translateRegion(triage.region_id, triage.region_name);
    const rSys = this.translateSystem(triage.region_system);

    const levelDetails = {
      4: {
        en: {
          title: "LEVEL 4: EMERGENCY MEDICAL ALERT",
          urgency: "Immediate 112 / 108 Emergency Dispatch",
          summary: "CRITICAL: Detected signs match life-threatening clinical red-flag criteria. Proceed immediately to the nearest Emergency Department or call emergency ambulance services."
        },
        od: {
          title: "ସ୍ତର ୪: ଜରୁରୀକାଳୀନ ମେଡିକାଲ୍ ସତର୍କତା",
          urgency: "ତୁରନ୍ତ ୧୧୨ / ୧୦୮ କୁ ଫୋନ୍ କରନ୍ତୁ କିମ୍ବା ଡାକ୍ତରଖାନା ଯାଆନ୍ତୁ",
          summary: "ଗୁରୁତର: ଲକ୍ଷଣଗୁଡ଼ିକ ଜରୁରୀକାଳୀନ ବିପଦ ସଙ୍କେତ ସହିତ ମେଳ ଖାଉଛି। ବିଳମ୍ବ ନକରି ତୁରନ୍ତ ନିକଟସ୍ଥ ଜରୁରୀକାଳୀନ ବିଭାଗ (ER) କୁ ଯାଆନ୍ତୁ କିମ୍ବା ଆମ୍ବୁଲାନ୍ସ ଡାକନ୍ତୁ।"
        },
        hi: {
          title: "स्तर 4: आपातकालीन मेडिकल चेतावनी",
          urgency: "तुरंत 112 / 108 आपातकालीन सेवा पर कॉल करें",
          summary: "गंभीर: लक्षण जीवन के लिए खतरनाक आपातकालीन खतरे के संकेतों से मेल खाते हैं। तुरंत निकटतम आपातकालीन विभाग (ER) जाएं या एम्बुलेंस बुलाएं।"
        }
      },
      3: {
        en: {
          title: "LEVEL 3: URGENT CLINICAL EVALUATION",
          urgency: "Seek Urgent Medical Care Today",
          summary: "Symptoms require timely professional medical attention today at a nearby clinic or urgent care facility to prevent complications or worsening distress."
        },
        od: {
          title: "ସ୍ତର ୩: ଜରୁରୀ ଡାକ୍ତରୀ ମୂଲ୍ୟାୟନ",
          urgency: "ଆଜି ହିଁ ନିକଟସ୍ଥ କ୍ଲିନିକ୍ କିମ୍ବା ଡାକ୍ତରଙ୍କ ପରାମର୍ଶ ନିଅନ୍ତୁ",
          summary: "ଲକ୍ଷଣଗୁଡ଼ିକ ପାଇଁ ଆଜି ହିଁ ଜଣେ ପଞ୍ଜୀକୃତ ଡାକ୍ତର କିମ୍ବା କ୍ଲିନିକରେ ପରୀକ୍ଷା କରାଇବା ଆବଶ୍ୟକ ଯାହାଦ୍ୱାରା ଅବସ୍ଥା ଅଧିକ ଗୁରୁତର ନହୁଏ।"
        },
        hi: {
          title: "स्तर 3: त्वरित चिकित्सीय मूल्यांकन",
          urgency: "आज ही नजदीकी डॉक्टर या क्लिनिक से परामर्श लें",
          summary: "जटिलताओं या स्थिति बिगड़ने से रोकने के लिए आज ही नजदीकी क्लिनिक या डॉक्टर से चिकित्सीय परामर्श आवश्यक है।"
        }
      },
      2: {
        en: {
          title: "LEVEL 2: MEDICAL REVIEW RECOMMENDED",
          urgency: "Consult a Doctor Within 24 - 48 Hours",
          summary: "Symptoms suggest an active condition that warrants clinical review by a healthcare practitioner. Schedule a routine doctor or outpatient clinic consultation within 24 to 48 hours."
        },
        od: {
          title: "ସ୍ତର ୨: ସାଧାରଣ ଡାକ୍ତରୀ ପରାମର୍ଶ",
          urgency: "୨୪ ରୁ ୪୮ ଘଣ୍ଟା ମଧ୍ୟରେ ଡାକ୍ତରଙ୍କ ସହ ପରାମର୍ଶ କରନ୍ତୁ",
          summary: "ଲକ୍ଷଣଗୁଡ଼ିକ ସାଧାରଣ ସ୍ୱାସ୍ଥ୍ୟ ସମସ୍ୟା ଦର୍ଶାଉଛି। ଆଗାମୀ ୨୪ ରୁ ୪୮ ଘଣ୍ଟା ମଧ୍ୟରେ ଜଣେ ଡାକ୍ତରଙ୍କ ସହ ପରାମର୍ଶ କରନ୍ତୁ।"
        },
        hi: {
          title: "स्तर 2: सामान्य चिकित्सीय परामर्श",
          urgency: "24 से 48 घंटे के भीतर डॉक्टर से संपर्क करें",
          summary: "लक्षण एक सक्रिय स्थिति का संकेत देते हैं। आगामी 24 से 48 घंटों के भीतर किसी डॉक्टर या ओपीडी में सामान्य परामर्श लें।"
        }
      },
      1: {
        en: {
          title: "LEVEL 1: SELF-CARE & FIRST-AID",
          urgency: "Safe Home Measures & Symptom Monitoring",
          summary: "Symptoms appear mild or self-limiting. Implement supportive first-aid care, maintain hydration, and monitor for changes."
        },
        od: {
          title: "ସ୍ତର ୧: ଘରୋଇ ଯତ୍ନ ଓ ପ୍ରାଥମିକ ଚିକିତ୍ସା",
          urgency: "ସୁରକ୍ଷିତ ଘରୋଇ ଉପଚାର ଓ ଲକ୍ଷଣ ଉପରେ ନଜର ରଖନ୍ତୁ",
          summary: "ଲକ୍ଷଣଗୁଡ଼ିକ ସାମାନ୍ୟ ଅଟେ। ଘରୋଇ ପ୍ରାଥମିକ ଚିକିତ୍ସା କରନ୍ତୁ, ପ୍ରଚୁର ପାଣି ପିଅନ୍ତୁ ଏବଂ ପରିବର୍ତ୍ତନ ଉପରେ ନଜର ରଖନ୍ତୁ।"
        },
        hi: {
          title: "स्तर 1: घरेलू देखभाल एवं प्राथमिक उपचार",
          urgency: "सुरक्षित घरेलू उपाय एवं लक्षणों पर निगरानी",
          summary: "लक्षण हल्के प्रतीत होते हैं। उचित प्राथमिक उपचार अपनाएं, पर्याप्त तरल पदार्थ लें और लक्षणों पर नजर रखें।"
        }
      }
    };

    const targetMeta = levelDetails[level] && levelDetails[level][l]
      ? levelDetails[level][l]
      : levelDetails[level]['en'];

    return {
      title: targetMeta.title,
      urgency: targetMeta.urgency,
      summary: targetMeta.summary,
      regionName: rName,
      regionSystem: rSys
    };
  }

  applyTranslationsToDOM() {
    // 1. Text Content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        const text = this.t(key);
        if (text) {
          el.textContent = text;
        }
      }
    });

    // 2. HTML Content
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (key) {
        const html = this.t(key);
        if (html) {
          el.innerHTML = html;
        }
      }
    });

    // 3. Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) {
        const text = this.t(key);
        if (text) {
          el.setAttribute('placeholder', text);
        }
      }
    });

    // 4. Titles & Tooltips
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (key) {
        const text = this.t(key);
        if (text) {
          el.setAttribute('title', text);
        }
      }
    });

    // 5. Select dropdowns with translated option texts
    document.querySelectorAll('select[data-i18n-select]').forEach(selectEl => {
      Array.from(selectEl.options).forEach(opt => {
        const optKey = opt.getAttribute('data-i18n');
        if (optKey) {
          opt.textContent = this.t(optKey);
        }
      });
    });

    // 6. Update Category Filter Buttons in Medical Atlas
    const catBtns = document.querySelectorAll('.atlas-cat-btn');
    if (catBtns.length) {
      const catMap = {
        'all': this.t('cat_all'),
        'Infectious': this.t('cat_infectious'),
        'Cardiovascular': this.t('cat_cardio'),
        'Respiratory': this.t('cat_resp'),
        'Gastrointestinal': this.t('cat_gastro'),
        'Emergency': this.t('cat_emergency'),
        'Medicine': this.t('cat_medicine')
      };
      catBtns.forEach(btn => {
        const cat = btn.getAttribute('data-cat');
        if (catMap[cat]) {
          btn.textContent = catMap[cat];
        }
      });
    }

    // Update Language Dropdown if present
    const langSelect = document.getElementById('langSelectDropdown');
    if (langSelect && langSelect.value !== this.currentLang) {
      langSelect.value = this.currentLang;
    }
  }
}

window.localI18n = new LocalI18nEngine();

// Auto-run translation on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  if (window.localI18n) {
    window.localI18n.applyTranslationsToDOM();
  }
});
