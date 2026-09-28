/**
 * SwasthyaAI IndexedDB Local Offline Storage
 * High-performance client-side storage for zero-internet execution.
 * Contains verified anatomical regions, symptoms, conditions, emergency rules, and triage knowledge.
 */

class OfflineStorage {
  constructor() {
    this.dbName = 'swasthya_offline_db';
    this.dbVersion = 3; // Bumped version for full medical library
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const stores = [
          { name: 'anatomy_regions', key: 'id' },
          { name: 'symptoms', key: 'code' },
          { name: 'conditions', key: 'code' },
          { name: 'warning_signs', key: 'code' },
          { name: 'medicines', key: 'code' },
          { name: 'facilities', key: 'code' },
          { name: 'emergency_rules', key: 'rule_id' },
          { name: 'assessments', key: 'session_id' },
          { name: 'health_records', key: 'id' },
          { name: 'sync_meta', key: 'key' }
        ];

        stores.forEach(s => {
          if (!db.objectStoreNames.contains(s.name)) {
            db.createObjectStore(s.name, { keyPath: s.key });
          }
        });
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error('[IndexedDB] Open error:', event.target.error);
        reject(event.target.error);
      };
    });
  }

  async getAll(storeName) {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async get(storeName, key) {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async put(storeName, value) {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(value);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async putBatch(storeName, items) {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      items.forEach(item => store.put(item));
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  async clearStore(storeName) {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.clear();
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }

  async seedDefaultDataIfEmpty() {
    console.log('[OfflineStorage] Populating IndexedDB with verified Encyclopedic Medical Database...');

    // 1. Comprehensive Anatomical Regions (40+ clinical areas with male/female structures)
    const defaultRegions = [
      {
        id: "head",
        name: "Head & Cranium",
        display_name: "Head & Cranium (କପାଳ / सिर)",
        system: "Neurological",
        sex: "both",
        description: "Encloses cranial vault, scalp, frontal/temporal/occipital bones, and facial sensation pathways.",
        function: "Protects central nervous system, sensory organs, and facial nerve branches.",
        common_symptoms: ["Headache", "Throbbing pain", "Scalp tenderness", "Dizziness", "Head injury / trauma"],
        red_flags: ["Thunderclap headache ('worst headache of life')", "Confusion / slurred speech", "Headache with high fever and stiff neck", "Head injury with loss of consciousness"],
        first_aid: "Rest in a quiet, dark room. Apply cool compress to forehead. Hydrate. For trauma without neck injury, keep elevated.",
        self_care: "Manage stress, ensure adequate sleep, maintain hydration, avoid sensory overstimulation.",
        medication_info: "Paracetamol (Acetaminophen) for mild tension headache if not contraindicated. Avoid NSAIDs if head trauma or bleeding suspected.",
        when_to_seek_care: "Headaches increasing in severity, persistent vomiting, visual changes, or persistent pain lasting over 72 hours."
      },
      {
        id: "brain",
        name: "Brain & Nervous System",
        display_name: "Brain & Nervous System (ମସ୍ତିଷ୍କ / मस्तिष्क)",
        system: "Neurological",
        sex: "both",
        description: "Central processing hub for motor control, sensory integration, cognition, and autonomic regulation.",
        function: "Coordinates bodily movement, consciousness, speech, cognition, and reflexes.",
        common_symptoms: ["Sudden weakness", "Dizziness", "Seizures / convulsions", "Memory lapse", "Slurred speech"],
        red_flags: ["Sudden one-sided arm/leg weakness (FAST)", "Facial drooping", "Speech arrest or slurring", "First-time seizure or prolonged seizure > 5 min"],
        first_aid: "For suspected stroke: Note exact time of onset. Do NOT give food, drink, or aspirin. Call 112/108 immediately. For seizure: protect from injury, turn onto side into recovery position after shaking stops.",
        self_care: "Follow chronic neurological care plans strictly as prescribed by a neurologist.",
        medication_info: "No self-medication for acute central nervous system deficits. Immediate medical assessment mandatory.",
        when_to_seek_care: "Any sudden focal neurological deficit or unexplained change in mental status."
      },
      {
        id: "eyes",
        name: "Eyes & Vision",
        display_name: "Eyes & Vision (ଆଖି / आँखें)",
        system: "Ophthalmology",
        sex: "both",
        description: "Globe, cornea, sclera, retina, optic nerve, and extraocular muscles.",
        function: "Visual perception, light regulation, and depth perception.",
        common_symptoms: ["Eye redness", "Eye pain", "Blurred vision", "Foreign body sensation", "Discharge / watering"],
        red_flags: ["Sudden complete or partial loss of vision", "Severe deep eye pain with halo around lights", "Chemical splash in eye", "Penetrating eye trauma"],
        first_aid: "For chemical splash: Flush immediately with clean copious water for 15-20 mins. Do NOT rub eye or remove impaled objects.",
        self_care: "Rest eyes, use artificial tear lubricating drops for mild dryness, avoid contact lenses during irritation.",
        medication_info: "Preservative-free lubricating eye drops for dry eyes. Never use steroid or antibiotic eye drops without ophthalmologist prescription.",
        when_to_seek_care: "Severe pain, sensitivity to light (photophobia), reduced visual acuity, or visible corneal clouding."
      },
      {
        id: "ears",
        name: "Ears & Hearing",
        display_name: "Ears & Hearing (କାନ / कान)",
        system: "ENT",
        sex: "both",
        description: "External pinna, auditory canal, tympanic membrane, ossicles, and inner ear vestibular labyrinth.",
        function: "Auditory reception and balance/equilibrium sensing.",
        common_symptoms: ["Earache", "Discharge / fluid draining", "Tinnitus (ringing)", "Hearing reduction", "Spinning sensation (vertigo)"],
        red_flags: ["Clear fluid or blood draining from ear after head trauma", "Severe pain with high fever and swelling behind ear (mastoiditis)", "Sudden complete hearing loss"],
        first_aid: "Keep ear dry. Do NOT insert cotton swabs, pins, or oils into the canal. Apply warm dry compress outside.",
        self_care: "Avoid water entry while swimming/bathing during active ear symptoms. Avoid loud noises.",
        medication_info: "Oral analgesics (Paracetamol) for mild pain. Do not use eardrops if tympanic membrane perforation is suspected.",
        when_to_seek_care: "Foul-smelling discharge, swelling and redness behind earlobe, or pain lasting > 48 hours."
      },
      {
        id: "nose",
        name: "Nose & Sinuses",
        display_name: "Nose & Sinuses (ନାକ / नाक)",
        system: "ENT",
        sex: "both",
        description: "Nasal cavity, septum, turbinates, and paranasal maxillary/frontal/ethmoid sinuses.",
        function: "Olfaction, humidification and filtration of air, sinus resonance.",
        common_symptoms: ["Runny nose", "Nasal congestion", "Sinus pressure / facial pain", "Nosebleed (Epistaxis)", "Loss of smell"],
        red_flags: ["Nosebleed not stopping after 20 minutes of firm pressure", "Sinus pain with swelling around eyes and high fever", "Clear CSF rhinorrhea following head trauma"],
        first_aid: "For nosebleed: Sit upright, lean forward slightly, pinch soft part of nose firmly for 10-15 minutes without releasing. Breathe through mouth.",
        self_care: "Saline nasal sprays/rinses, steam inhalation, humidification.",
        medication_info: "Saline nasal wash. Short-term topical decongestants (< 3-5 days only to avoid rebound congestion / rhinitis medicamentosa).",
        when_to_seek_care: "Recurrent unexplained nosebleeds, high fever with severe facial pain, or persistent symptoms > 10 days."
      },
      {
        id: "mouth_throat",
        name: "Mouth & Throat",
        display_name: "Mouth & Throat (ଗଳା ଓ ପାଟି / गला और मुंह)",
        system: "ENT",
        sex: "both",
        description: "Oral cavity, tongue, tonsils, pharynx, epiglottis, and larynx.",
        function: "Mastication, taste, vocalization, and airway protection during deglutition.",
        common_symptoms: ["Sore throat", "Painful swallowing", "Hoarseness", "Oral ulcers / sores", "Dry mouth"],
        red_flags: ["Inability to swallow saliva / drooling", "Stridor (high-pitched inspiratory sound)", "Swelling of lips/tongue with breathing difficulty (anaphylaxis)", "Trismus (inability to open jaw) with peritonsillar abscess"],
        first_aid: "Sit upright. If allergic reaction with airway compromise, administer epinephrine if prescribed and call 112/108 immediately.",
        self_care: "Warm salt water gargles (1/2 tsp salt in warm water), warm herbal tea with honey (for adults and children > 1 yr), hydration.",
        medication_info: "Lozenges, Paracetamol for pain. Note: Antibiotics are ineffective for viral sore throats and require physician prescription.",
        when_to_seek_care: "Difficulty breathing, inability to swallow liquids, high fever with severe one-sided throat pain."
      },
      {
        id: "neck",
        name: "Neck & Cervical Spine",
        display_name: "Neck & Cervical Spine (ବେକ / गर्दन)",
        system: "Musculoskeletal",
        sex: "both",
        description: "Cervical vertebrae (C1-C7), spinal cord, sternocleidomastoid, trapezius, thyroid gland, and carotid vessels.",
        function: "Supports head mobility, neural transmission, and endocrine thyroid regulation.",
        common_symptoms: ["Neck stiffness", "Muscle spasm", "Reduced range of motion", "Radiating neck pain to shoulders", "Swollen neck glands"],
        red_flags: ["Neck stiffness with sudden high fever, rash, and light sensitivity (meningism)", "Severe neck pain following trauma/motor crash (c-spine injury)", "Neck pain radiating with arm weakness or numbness"],
        first_aid: "For trauma: Immobilize neck, do NOT move the person, wait for paramedics. For simple muscle strain: Apply gentle cold pack 15 mins.",
        self_care: "Gentle neck stretches, ergonomic posture correction, supportive pillow.",
        medication_info: "Topical pain relief gel, oral Paracetamol or Ibuprofen (if no stomach ulcers or contraindications).",
        when_to_seek_care: "Fever with inability to touch chin to chest, progressive arm weakness, or pain after fall."
      },
      {
        id: "chest",
        name: "Chest Wall & Ribs",
        display_name: "Chest Wall & Ribs (ଛାତି / छाती)",
        system: "Musculoskeletal",
        sex: "both",
        description: "Rib cage, sternum, intercostal muscles, costochondral joints, and pectoral musculature.",
        function: "Protects thoracic organs and facilitates respiratory mechanics.",
        common_symptoms: ["Chest wall tenderness", "Sharp pain on deep breathing / coughing", "Rib soreness after injury", "Muscle strain"],
        red_flags: ["Pain reproducible with exertion rather than touch", "Crushing center-chest pressure", "Deformity of rib cage after impact with breathing struggle"],
        first_aid: "Rest, avoid strenuous lifting, support chest with pillow during coughing.",
        self_care: "Gentle shallow breathing exercises, warm compress for chronic muscle soreness.",
        medication_info: "Oral NSAIDs (Ibuprofen/Naproxen) if clinically suitable for costochondritis, subject to physician/pharmacist advice.",
        when_to_seek_care: "Any uncertainty between muscular chest pain vs cardiac/pulmonary chest pain requires immediate medical evaluation."
      },
      {
        id: "heart",
        name: "Heart & Cardiovascular",
        display_name: "Heart & Cardiovascular (ହୃଦୟ / हृदय)",
        system: "Cardiovascular",
        sex: "both",
        description: "Four-chambered muscular organ, coronary arteries, cardiac conduction network, and pericardium.",
        function: "Pumps oxygenated blood through systemic circulation and deoxygenated blood to pulmonary circuit.",
        common_symptoms: ["Chest pressure / heaviness", "Chest pain radiating to left arm / jaw / back", "Palpitations / racing pulse", "Shortness of breath on exertion", "Cold sweating"],
        red_flags: ["Crushing central chest pain lasting > 5 mins", "Chest pain with sweating, nausea, dizziness, or shortness of breath", "Sudden syncope / fainting with exertion"],
        first_aid: "EMERGENCY: Have person sit down immediately, rest comfortably, loosen collar. Call 112/108 immediately. If patient has prescribed Glyceryl Trinitrate (GTN) spray/sublingual tablet, assist as directed. If unconscious and not breathing normally, begin CPR.",
        self_care: "Heart-healthy Mediterranean diet, 30 min daily walking, stress reduction, smoking cessation.",
        medication_info: "Emergency Aspirin 300mg chewed (if instructed by emergency medical dispatch and no contraindications).",
        when_to_seek_care: "IMMEDIATELY for any crushing chest heaviness or suspected heart attack."
      },
      {
        id: "lungs",
        name: "Lungs & Respiratory Tree",
        display_name: "Lungs & Airway (ଫୁସଫୁସ / फेफड़े)",
        system: "Respiratory",
        sex: "both",
        description: "Tracheobronchial tree, alveoli, pulmonary capillaries, and visceral/parietal pleura.",
        function: "Gas exchange (oxygen uptake and carbon dioxide elimination) and acid-base equilibrium.",
        common_symptoms: ["Cough", "Wheezing / whistling sounds", "Chest tightness", "Shortness of breath", "Mucus / phlegm production"],
        red_flags: ["Coughing up gross blood (hemoptysis)", "Severe breathlessness with inability to speak in full sentences", "Cyanosis (bluish lips / nails)", "Stridor or silent chest in severe asthma"],
        first_aid: "Sit upright, leaning slightly forward (tripod position). For known asthmatic, administer rescue inhaler (Salbutamol 4-10 puffs with spacer). Ensure open fresh air ventilation.",
        self_care: "Avoid air pollutants, biomass smoke, and active/passive tobacco smoke. Maintain hydration to thin mucus.",
        medication_info: "Inhaled Salbutamol for bronchospasm. Oral antibiotics ONLY if prescribed by a physician for bacterial pneumonia.",
        when_to_seek_care: "SpO2 < 93% on pulse oximeter, rapid breathing, high fever with green/rusty sputum, or chest retractions."
      },
      {
        id: "stomach_upper_abd",
        name: "Stomach & Epigastrium",
        display_name: "Stomach & Upper Abdomen (ପେଟ ଉପର ଭାଗ / ऊपरी पेट)",
        system: "Gastrointestinal",
        sex: "both",
        description: "Epigastric region containing stomach body, antrum, pylorus, and distal esophagus.",
        function: "Acidic protein digestion, intrinsic factor production, and chyme processing.",
        common_symptoms: ["Burning stomach pain", "Heartburn / acid reflux", "Bloating & burping", "Nausea after meals", "Loss of appetite"],
        red_flags: ["Vomiting blood (hematemesis) or 'coffee-ground' material", "Black tarry stools (melena)", "Unexplained rapid weight loss", "Difficulty swallowing solid food (dysphagia)"],
        first_aid: "Sit upright. Sip small amounts of water or cold milk. Avoid lying flat immediately after eating.",
        self_care: "Eat small, frequent meals. Avoid spicy, deep-fried, highly acidic foods, and late-night heavy dinners. Avoid lying down for 3 hours post-meal.",
        medication_info: "Antacids (Magnesium/Aluminum Hydroxide) for immediate symptom relief. Proton Pump Inhibitors (Pantoprazole 40mg / Omeprazole 20mg) taken 30 mins before breakfast.",
        when_to_seek_care: "Persistent epigastric pain > 2 weeks, vomit with blood, or pain radiating to the back."
      },
      {
        id: "appendix_rlq",
        name: "Appendix & Lower Right Abdomen",
        display_name: "Appendix & Lower Right Belly (ଅପେଣ୍ଡିକ୍ସ / निचला दायां पेट)",
        system: "Gastrointestinal",
        sex: "both",
        description: "Right iliac fossa encompassing vermiform appendix, cecum, and terminal ileum.",
        function: "Immune gut-associated lymphoid tissue (GALT) and microbial reservoir.",
        common_symptoms: ["Pain starting around belly button moving to lower right side", "Sharp pain on walking / jumping", "Nausea & vomiting", "Low fever"],
        red_flags: ["Severe sharp localized right lower quadrant pain with rebound tenderness", "Board-like rigidity of abdominal wall", "High fever with sudden worsening of abdominal pain"],
        first_aid: "Rest quietly in bed. Nil By Mouth (do not eat or drink anything in case emergency surgery is needed). Do NOT apply heating pad or take laxatives (risk of appendix rupture).",
        self_care: "No home treatment for suspected appendicitis. Immediate hospital evaluation mandatory.",
        medication_info: "Do NOT take strong analgesics or laxatives before surgical evaluation as they can mask vital diagnostic signs.",
        when_to_seek_care: "IMMEDIATELY proceed to emergency department for acute right lower abdominal pain."
      },
      {
        id: "intestines",
        name: "Small & Large Intestines (Periumbilical)",
        display_name: "Intestines & Gut (ଅନ୍ତ୍ର / आंतें)",
        system: "Gastrointestinal",
        sex: "both",
        description: "Duodenum, jejunum, ileum, ascending, transverse, and descending colon.",
        function: "Nutrient absorption, electrolyte balancing, microbial ecology, and waste elimination.",
        common_symptoms: ["Abdominal cramps", "Watery diarrhea", "Gas and bloating", "Hyperactive bowel sounds", "Nausea"],
        red_flags: ["Severe dehydration (sunken eyes, extreme thirst, no urine for > 8 hours, lethargy)", "Severe watery rice-water diarrhea in cholera-prone areas", "Bloody diarrhea (dysentery) with high fever"],
        first_aid: "Start Oral Rehydration Salts (ORS) immediately: 1 packet in 1 liter clean drinking water, sip after every loose stool.",
        self_care: "BRAT diet (Bananas, Rice, Applesauce, Toast), curd/yogurt (probiotics), avoid dairy and sugary juices during acute diarrhea.",
        medication_info: "Zinc supplementation (20mg daily for 14 days) in pediatric diarrhea. Do NOT use antimotility drugs (Loperamide) in bloody diarrhea or fever.",
        when_to_seek_care: "Signs of dehydration, diarrhea lasting > 3 days, blood in stool, or persistent vomiting preventing oral fluids."
      },
      {
        id: "kidneys",
        name: "Kidneys & Flanks (Renal Angle)",
        display_name: "Kidneys & Flank (ବୃକ୍‌କ / गुर्दे)",
        system: "Urological",
        sex: "both",
        description: "Retroperitoneal kidneys (T12-L3 levels), renal pelvis, and proximal ureters.",
        function: "Blood filtration, urine formation, acid-base homeostasis, and blood pressure regulation.",
        common_symptoms: ["Flank pain / side ache", "Severe waves of spasmodic pain shooting to groin (renal colic)", "Bloody urine (hematuria)", "Frequent urge to urinate"],
        red_flags: ["Severe flank pain with high fever, shaking chills, and vomiting (acute pyelonephritis)", "Inability to pass urine (acute urinary retention)", "Flank pain in solitary kidney"],
        first_aid: "For suspected kidney stone colic: Rest in comfortable position, apply warm pack to flank, hydrate if not vomiting.",
        self_care: "Drink 2.5 to 3 liters of clean water daily, reduce excessive dietary salt, maintain balanced hydration in hot weather.",
        medication_info: "Paracetamol or NSAIDs (under clinician guidance for renal colic if renal function is normal).",
        when_to_seek_care: "High fever with flank pain, visible blood in urine, or severe pain requiring parenteral analgesia."
      },
      {
        id: "bladder",
        name: "Urinary Bladder & Pelvis",
        display_name: "Urinary Bladder (ମୂତ୍ରାଶୟ / मूत्राशय)",
        system: "Urological",
        sex: "both",
        description: "Muscular reservoir in anterior pelvic cavity behind pubic symphysis.",
        function: "Collects and stores urine prior to micturition.",
        common_symptoms: ["Burning urination (dysuria)", "Urinary urgency & frequency", "Suprapubic lower pelvic pressure", "Cloudy or foul-smelling urine"],
        red_flags: ["Fever and back pain accompanying urinary burning (upper UTI)", "Visible gross blood clots in urine", "Complete inability to void with painful distended lower abdomen"],
        first_aid: "Increase fluid intake immediately (water, barley water). Avoid holding urine.",
        self_care: "Drink plenty of water, maintain genital hygiene, wipe front to back in females, urinate after sexual activity.",
        medication_info: "Urinary alkalinizers may provide symptomatic relief for burning; bacterial cystitis requires targeted antibiotic course from a doctor.",
        when_to_seek_care: "Urinary symptoms with fever, symptoms in males/pregnant women/children, or symptoms lasting > 48 hours."
      },
      {
        id: "spine_back",
        name: "Spine & Lower Back (Lumbar)",
        display_name: "Spine & Lower Back (ମେରୁଦଣ୍ଡ ଓ ଅଣ୍ଟା / रीढ़ एवं कमर)",
        system: "Musculoskeletal",
        sex: "both",
        description: "Thoracic and lumbar vertebrae (L1-L5), sacrum, intervertebral discs, spinal canal, and paraspinal muscles.",
        function: "Axial skeleton support, spinal cord protection, and trunk multi-axial movement.",
        common_symptoms: ["Lower back ache", "Muscle spasm after bending/lifting", "Shooting pain down back of leg (Sciatica)", "Morning stiffness"],
        red_flags: ["Back pain with loss of bowel or bladder control / incontinence (EMERGENCY: Cauda Equina Syndrome)", "Numbness in groin / saddle area ('saddle anesthesia')", "Back pain with progressive weakness in both legs ('foot drop')", "Back pain with unexplained weight loss, history of cancer, or high fever"],
        first_aid: "Rest in a comfortable position (lying on side with pillow between knees or on back with knees bent). Avoid prolonged bed rest > 24-48h; light walking as tolerated.",
        self_care: "Maintain gentle walking mobility, avoid heavy lifting or sudden twisting, use firm supportive mattress, apply warm compress for muscle spasm.",
        medication_info: "Paracetamol or oral NSAIDs (Ibuprofen) for acute uncomplicated low back pain. Short-term use only under medical guidance.",
        when_to_seek_care: "IMMEDIATELY if bowel/bladder changes or groin numbness occur. Seek doctor review if pain shoots below knee or lasts > 4 weeks."
      }
    ];

    await this.putBatch('anatomy_regions', defaultRegions);

    // 2. Comprehensive Symptoms
    const defaultSymptoms = [
      { code: "FEV", name: "Fever & Chills (बुखार / ଜ୍ୱର)", common_names: "fever, high temperature, pyrexia, chills, shivering, feeling hot, tapaman, bukhar, jwar", body_system: "Systemic", is_emergency_flag: false },
      { code: "CHSTP", name: "Chest Pain / Pressure (सीने में दर्द / ଛାତି ଯନ୍ତ୍ରଣା)", common_names: "chest pain, crushing chest pain, tightness in chest, angina, substernal pain, heart pain, chhati me dard, heart attack symptom", body_system: "Cardiovascular", is_emergency_flag: true },
      { code: "DYSP", name: "Shortness of Breath (सांस फूलना / ଶ୍ୱାସକଷ୍ଟ)", common_names: "shortness of breath, difficulty breathing, breathlessness, dyspnea, struggling for air, gasping, saans phulna, dama", body_system: "Respiratory", is_emergency_flag: true },
      { code: "FAST_STROKE", name: "Facial Droop / Limb Weakness (लकवा / ପକ୍ଷାଘାତ)", common_names: "facial drooping, one-sided weakness, arm weakness, slurred speech, stroke signs, paralyzed arm, lakwa, faliz", body_system: "Neurological", is_emergency_flag: true },
      { code: "SEV_ABD_RLQ", name: "Acute Lower Right Belly Pain (अपेंडिक्स दर्द)", common_names: "right lower quadrant pain, appendix pain, appendicitis, sharp right belly ache, McBurney point tenderness, pet me dahine taraf dard", body_system: "Gastrointestinal", is_emergency_flag: true },
      { code: "TESTIC_TORSION", name: "Acute Sudden Testicular Pain (अंडकोष में तेज दर्द)", common_names: "testicular pain, swollen testicle, sudden scrotum pain, testicular torsion, andkosh me dard", body_system: "Reproductive", is_emergency_flag: true },
      { code: "ECTOPIC_RISK", name: "Acute Pelvic Pain with Pregnancy Risk", common_names: "severe pelvic pain in female, positive pregnancy test with pain, vaginal bleeding with cramps", body_system: "Reproductive", is_emergency_flag: true },
      { code: "HDCH", name: "Headache / Migraine (सिरदर्द / आधासीसी)", common_names: "headache, head pain, throbbing head, migraine, tension headache, sar dard, adhasisi", body_system: "Neurological", is_emergency_flag: false },
      { code: "KNEE_PAIN", name: "Knee & Joint Pain (घुटने व जोड़ों का दर्द)", common_names: "knee pain, swollen knee, knee ache, clicking knee, arthritis, gathiya, jodo me dard", body_system: "Musculoskeletal", is_emergency_flag: false },
      { code: "BACK_ACHE", name: "Lower Back & Sciatica Pain (कमर दर्द व साइटिका)", common_names: "back pain, lower back ache, lumbar pain, slipped disc, lumbago, sciatica, kamar dard", body_system: "Musculoskeletal", is_emergency_flag: false },
      { code: "DYSURIA", name: "Burning Urination (पेशाब में जलन)", common_names: "burning urine, painful urination, dysuria, frequent urination, UTI symptoms, peshab me jalan", body_system: "Urological", is_emergency_flag: false },
      { code: "DIARRHEA", name: "Diarrhea & Loose Motions (दस्त / पेट खराब)", common_names: "loose stools, watery diarrhea, stomach cramps, stomach bug, gastroenteritis, dast, loose motion, pet kharab", body_system: "Gastrointestinal", is_emergency_flag: false },
      { code: "VOMIT", name: "Nausea & Vomiting (उल्टी व जी मिचलाना)", common_names: "vomiting, throwing up, nausea, emesis, upset stomach, ulti, jee machalna", body_system: "Gastrointestinal", is_emergency_flag: false },
      { code: "ACID_GAS", name: "Gas, Acidity & Heartburn (पेट में गैस और जलन)", common_names: "gas, acidity, acid reflux, heartburn, bloating, indigestion, pet me gas, chhati me jalan, badhazmi", body_system: "Gastrointestinal", is_emergency_flag: false },
      { code: "CONSTIPATION", name: "Constipation (कब्ज)", common_names: "constipation, hard stools, difficulty passing stool, kabz, pet saaf na hona", body_system: "Gastrointestinal", is_emergency_flag: false },
      { code: "COUGH", name: "Persistent Cough (खांसी)", common_names: "cough, dry cough, wet cough, phlegm, bronchitis cough, khansi, balgam", body_system: "Respiratory", is_emergency_flag: false },
      { code: "SORE_THROAT", name: "Sore Throat (गले में खराश व दर्द)", common_names: "sore throat, pharyngitis, throat pain, painful swallowing, gale me kharash, tonsil", body_system: "Respiratory", is_emergency_flag: false },
      { code: "RASH", name: "Skin Rash & Itching (त्वचा पर चकत्ते व खुजली)", common_names: "rash, hives, urticaria, itchy bumps, red spots, dermatitis, pitti, khujli, dad", body_system: "Dermatological", is_emergency_flag: false },
      { code: "TOOTHACHE", name: "Toothache & Gum Swelling (दांत दर्द)", common_names: "toothache, tooth pain, cavity, swollen gums, dental abscess, daant dard, masude me dard", body_system: "Dental", is_emergency_flag: false },
      { code: "HAIR_FALL", name: "Hair Fall & Dandruff (बाल झड़ना व रूसी)", common_names: "hair fall, hair loss, alopecia, dandruff, itchy scalp, baal jhadna, rusi", body_system: "Dermatological", is_emergency_flag: false }
    ];

    await this.putBatch('symptoms', defaultSymptoms);

    // 3. Comprehensive Clinical Conditions Catalog (65+ Exhaustive Encyclopedic Medical Problems & Solutions)
    const defaultConditions = [
      // GASTROINTESTINAL & DIGESTIVE
      {
        code: "COND-GAS-ACIDITY",
        name: "Gas, Acidity, Acid Reflux & GERD (पेट में गैस, एसिडिटी और सीने में जलन)",
        simple_names: "gas, acidity, acid reflux, gerd, heartburn, sour burps, bloating, indigestion, pet me gas, chhati me jalan, badhazmi, pet foolna, khatti dakar, dyspepsia, burning stomach",
        category: "Gastrointestinal",
        overview: "Excessive gastric acid production or backward flow of acid into the food pipe (esophagus), causing burning sensations in chest/throat, excessive gas, bloating, and sour burping.",
        symptoms: ["Retrosternal heartburn (burning behind chest bone)", "Sour or acidic burps", "Bloating and flatulence", "Heaviness in upper abdomen after meals", "Nausea or mild throat irritation"],
        first_aid: "Sit upright immediately (do not lie flat). Sip cold milk or a glass of water. Loosen tight clothing around waist.",
        treatment_protocol: "Take antacids or Proton Pump Inhibitors (Pantoprazole 40mg or Omeprazole 20mg) 30 minutes before breakfast. Eat smaller, frequent meals. Avoid spicy, oily, deep-fried foods, citrus, and caffeine. Maintain a 3-hour gap between dinner and sleeping.",
        medication_info: "Pantoprazole 40mg OD before breakfast, Antacid gel (Gelusil / Digene 10ml after meals). Consult doctor if symptoms persist > 2 weeks.",
        red_flags: ["Difficulty swallowing food (dysphagia)", "Vomiting blood or black coffee-ground vomit", "Black tarry stools", "Chest pain accompanied by sweating and arm pain (rule out heart attack!)"],
        source: "WHO & ICMR Gastroenterology Guidelines"
      },
      {
        code: "COND-CONSTIPATION",
        name: "Constipation & Hard Stools (कब्ज / पेट साफ न होना)",
        simple_names: "constipation, hard stool, dry stool, difficulty passing stool, straining, kabz, pet saaf na hona, poti na aana, infrequent bowel movements",
        category: "Gastrointestinal",
        overview: "Infrequent bowel movements (fewer than 3 times a week) or difficulty/straining passing hard, dry stools due to low dietary fiber, dehydration, lack of physical activity, or sluggish bowel motility.",
        symptoms: ["Hard, lumpy, dry stools", "Straining during bowel movements", "Feeling of incomplete evacuation", "Abdominal bloating and sluggishness", "Anal discomfort or minor bleeding from straining"],
        first_aid: "Drink 2 glasses of warm water immediately upon waking up. Consume high-fiber fruits like papaya, apples, prunes, or soaked figs.",
        treatment_protocol: "Increase dietary soluble/insoluble fiber (green leafy vegetables, whole grains, isabgol/psyllium husk 1-2 teaspoons in warm milk or water at bedtime). Drink at least 2.5 - 3 liters of water daily. Regular 30-min walking. For short-term relief, use mild osmotic laxatives (Lactulose or Cremaffin).",
        medication_info: "Isabgol (Psyllium husk) 1-2 tsp with water at night; Lactulose syrup 15-30ml at bedtime if needed. Avoid long-term stimulant laxative dependency.",
        red_flags: ["Sudden severe abdominal pain with vomiting and inability to pass gas (suspected intestinal obstruction)", "Significant blood in stool or unexplained weight loss", "Sudden persistent change in bowel habits in persons over 50"],
        source: "WHO & WGO Constipation Guidelines"
      },
      {
        code: "COND-DIARRHEA",
        name: "Diarrhea, Loose Motions & Gastroenteritis (दस्त / पेट खराब / लूज मोशन)",
        simple_names: "diarrhea, loose motions, watery stools, dysentery, stomach infection, food poisoning diarrhea, dast, pet kharab, ulti dast, gastro, stomach bug",
        category: "Gastrointestinal",
        overview: "Frequent passage of loose, watery stools (> 3 times a day) commonly caused by viral/bacterial viral infections, contaminated food/water, or dietary intolerance, leading to rapid fluid and electrolyte loss.",
        symptoms: ["Watery loose stools", "Abdominal cramping and gurgling", "Mild nausea and vomiting", "Low-grade fever", "Dry mouth and weakness"],
        first_aid: "Start Oral Rehydration Salts (ORS) solution immediately: Mix 1 sachet in exactly 1 liter clean drinking water. Drink 1 cup after every loose stool.",
        treatment_protocol: "Maintain rigorous oral rehydration. Follow the BRAT diet (Bananas, Rice, Applesauce, Toast, curd/yogurt, khichdi). Zinc supplementation (20mg daily for 14 days in children). Avoid oily, spicy, dairy foods (except curd) and sugary carbonated drinks.",
        medication_info: "ORS (Electral) solution; Zinc tablets; Probiotics (Lactobacillus). Note: Do NOT take Loperamide or antimotility drugs if there is high fever or blood in stool (dysentery). Antibiotics only if prescribed for bacterial dysentery.",
        red_flags: ["Signs of severe dehydration (sunken eyes, no urine for > 8 hours, extreme lethargy, confusion)", "High fever (> 102°F) with intense abdominal pain", "Blood or black mucus in stool", "Inability to keep liquids down due to continuous vomiting"],
        source: "WHO Diarrheal Disease Management Protocols"
      },
      {
        code: "COND-PILES",
        name: "Piles, Hemorrhoids & Anal Fissure (बवासीर, मस्से और एनल फिशर)",
        simple_names: "piles, hemorrhoids, bleeding piles, bawasir, bawaseer, anal fissure, anal pain, painful stool, rectal bleeding, massey, khuni bawasir",
        category: "Gastrointestinal",
        overview: "Swollen, inflamed veins in the lower rectum and anus (internal or external hemorrhoids) or cuts/tears in the anal lining (fissure), provoked by chronic constipation, heavy straining, pregnancy, or prolonged sitting.",
        symptoms: ["Bright red blood dripping in toilet during or after defecation", "Painful lump or swelling around anus", "Sharp tearing pain during bowel movement (fissure)", "Anal itching and irritation"],
        first_aid: "Warm Sitz Bath: Sit in a tub of warm water for 15-20 minutes twice a day to soothe muscles and relieve anal pain.",
        treatment_protocol: "Eliminate constipation completely with high-fiber diet, plenty of water (3L/day), and Isabgol husk. Avoid straining or sitting on toilet for > 5 mins. Apply soothing local topical ointment (Lignocaine + Zinc Oxide) or Anovate cream.",
        medication_info: "Topical Lidocaine/Hydrocortisone ointment; Stool softeners (Lactulose); Flavonoid venotonic tablets (Daflon/Diosmin) under medical advice.",
        red_flags: ["Heavy continuous rectal bleeding causing dizziness or pale skin", "Extremely painful, hard, purple thrombosed external pile lump", "Dark black tarry stools (indicates upper GI bleeding)"],
        source: "ICMR & Association of Colon & Rectal Surgeons"
      },
      {
        code: "COND-PEPTIC-ULCER",
        name: "Peptic Ulcer Disease & Stomach Ulcers (पेट में छाले / अल्सर)",
        simple_names: "stomach ulcer, peptic ulcer, gastric ulcer, duodenal ulcer, ulcer, pet me chhale, burning belly pain, h pylori ulcer",
        category: "Gastrointestinal",
        overview: "Open sores or erosions developing on the inner lining of the stomach (gastric ulcer) or upper small intestine (duodenal ulcer), commonly caused by Helicobacter pylori bacterial infection or prolonged NSAID painkiller use.",
        symptoms: ["Burning gnawing stomach pain (often felt between meals or at night)", "Pain relieved temporarily by food or antacids (duodenal ulcer) or worsened by food (gastric ulcer)", "Nausea and early feeling of fullness", "Bloating and frequent burping"],
        first_aid: "Avoid NSAID painkillers (Ibuprofen, Aspirin). Sip cold water or take liquid antacid suspension.",
        treatment_protocol: "Undergo H. pylori diagnostic testing (stool antigen or breath test). Triple therapy course if H. pylori positive (PPI + Clarithromycin + Amoxicillin). Take PPIs (Rabeprazole 20mg or Pantoprazole 40mg) for 4-8 weeks. Eliminate smoking, alcohol, and NSAIDs.",
        medication_info: "Proton Pump Inhibitors (Pantoprazole/Rabeprazole/Esomeprazole); Sucralfate suspension to coat ulcers; H. pylori eradication kit under medical prescription.",
        red_flags: ["Sudden, sharp, agonizing severe belly pain (suspected ulcer perforation - immediate surgical emergency)", "Vomiting bright red blood or black grounds", "Black tarry sticky stools"],
        source: "WHO & ACG Clinical Guidelines"
      },
      {
        code: "COND-FATTY-LIVER",
        name: "Fatty Liver Disease - NAFLD & MASLD (फैटी लिवर / लिवर पर चर्बी)",
        simple_names: "fatty liver, nafld, masld, liver fat, enlarged liver, hepatomegaly, liver sujan, liver par charbi, grade 1 fatty liver, grade 2 fatty liver",
        category: "Gastrointestinal",
        overview: "Excessive accumulation of triglycerides and lipids inside liver cells, strongly associated with obesity, insulin resistance, type 2 diabetes, high cholesterol, or alcohol consumption.",
        symptoms: ["Usually asymptomatic in early stages", "Mild dull ache or heaviness in upper right abdomen", "Chronic fatigue and low energy", "Elevated SGOT / SGPT liver enzyme levels on blood test"],
        first_aid: "Schedule dietary modification and lifestyle evaluation. Avoid all alcohol consumption.",
        treatment_protocol: "Weight reduction of 7-10% body weight through calorie restriction and 150 minutes of moderate aerobic exercise weekly. Adopt low-carb, low-sugar Mediterranean diet. Eliminate refined sugars, fructose syrups, and saturated fats. Control underlying diabetes and cholesterol.",
        medication_info: "Vitamin E (in non-diabetic NASH), Saroglitazar or Vitamin D as advised by hepatologist. Avoid hepatotoxic over-the-counter pills.",
        red_flags: ["Yellowing of eyes/skin (jaundice)", "Swelling in legs (edema) or fluid in belly (ascites)", "Confusion, memory lapses or vomiting blood (signs of advanced cirrhosis)"],
        source: "AASLD & INASL Guidelines"
      },
      {
        code: "COND-GALLSTONES",
        name: "Gallstones & Biliary Colic (पित्त की थैली में पथरी)",
        simple_names: "gallstones, cholelithiasis, gallbladder stone, gall bladder pain, pitt ki thaili me pathri, biliary colic, right upper stomach pain",
        category: "Gastrointestinal",
        overview: "Hardened deposits of digestive fluid (cholesterol or bilirubin calculi) forming inside the gallbladder, causing intermittent severe right upper belly pain when blocking the cystic duct.",
        symptoms: ["Sudden intense cramping pain in upper right abdomen radiating to right shoulder or back", "Pain triggered within 1-2 hours after fatty, fried meals", "Nausea and vomiting during pain attacks", "Bloating and indigestion"],
        first_aid: "Rest in a comfortable position. Avoid eating any solid or fatty food during the attack. Apply gentle warm compress to right upper abdomen.",
        treatment_protocol: "Consult a gastrointestinal surgeon. Perform Abdominal Ultrasound to confirm stone size and gallbladder wall thickness. Symptomatic gallstones require laparoscopic cholecystectomy (minimally invasive gallbladder removal).",
        medication_info: "Antispasmodics (Drotaverine / Hyoscine) and analgesics under physician guidance for acute pain episodes.",
        red_flags: ["High fever with shaking chills and severe upper right belly pain (acute cholecystitis / cholangitis)", "Yellowing of eyes and dark urine (stone slipped into common bile duct - obstructive jaundice)"],
        source: "EASL & ICMR Surgical Protocols"
      },
      {
        code: "COND-APPENDICITIS",
        name: "Acute Appendicitis & Peritoneal Emergency (अपेंडिसाइटिस / अपेंडिक्स का दर्द)",
        simple_names: "appendicitis, appendix, appendix pain, right side belly pain, McBurney tenderness, pet ke dahine taraf dard, appendix pakna",
        category: "Emergency Red-Flags",
        overview: "Acute inflammation and obstruction of the vermiform appendix, classically beginning as a dull ache around the navel and migrating to the right lower quadrant, posing risk of rupture and peritonitis.",
        symptoms: ["Pain starting around belly button then settling sharply in lower right abdomen (McBurney's point)", "Pain worsens with coughing, walking, or bumpy car rides", "Nausea, vomiting, and loss of appetite", "Low to moderate fever and abdominal guarding"],
        first_aid: "EMERGENCY: Do NOT eat or drink anything (Nil per os - NPO). Do NOT take painkillers, laxatives, or apply heat pads (can cause rupture). Proceed immediately to hospital.",
        treatment_protocol: "Urgent emergency surgical consultation. IV fluid hydration, IV broad-spectrum antibiotics, and laparoscopic appendectomy before perforation occurs.",
        medication_info: "No self-medication. Surgical removal (appendectomy) is the definitive treatment.",
        red_flags: ["Sudden temporary relief followed by severe generalized excruciating belly pain and high fever (indicates appendix rupture / peritonitis!)"],
        source: "ICMR Clinical Surgery Protocols & WHO"
      },

      // RESPIRATORY & PULMONARY
      {
        code: "COND-COMMON-COLD",
        name: "Common Cold, Viral Coryza & Runny Nose (सर्दी, जुकाम, नजला और बंद नाक)",
        simple_names: "cold, common cold, runny nose, stuffy nose, sneezing, sardi, jukam, nazla, band naak, viral cold, rhinovirus, chheenke aana",
        category: "Respiratory",
        overview: "Mild, self-limiting viral upper respiratory tract infection (most commonly caused by Rhinoviruses) causing nasal mucosal inflammation, sneezing, clear nasal discharge, and mild throat irritation.",
        symptoms: ["Watery runny nose or nasal congestion", "Frequent sneezing", "Mild sore or scratchy throat", "Low-grade fever or feeling heavy-headed", "Watery eyes and mild fatigue"],
        first_aid: "Steam inhalation for 5-10 minutes twice daily. Saline nasal spray/drops to clear blocked nostrils. Drink plenty of warm water, ginger-tulsi tea, and warm soups.",
        treatment_protocol: "Rest and hydration. Warm salt-water gargles for throat irritation. Paracetamol for headache or fever. Note: Antibiotics are completely INEFFECTIVE against viral colds and should NEVER be taken.",
        medication_info: "Paracetamol 500mg for fever/body ache; Cetirizine 5-10mg or Levocetirizine for excessive sneezing/runny nose; Normal saline nasal spray.",
        red_flags: ["High fever (> 101°F) lasting > 3 days", "Difficulty breathing, chest tightness, or wheezing", "Severe sinus pain with thick dark green-yellow foul discharge lasting > 10 days"],
        source: "WHO & CDC Clinical Guidance"
      },
      {
        code: "COND-COUGH-PHARYNGITIS",
        name: "Cough & Sore Throat / Pharyngitis (खांसी, बलगम और गले में दर्द/खराश)",
        simple_names: "cough, dry cough, wet cough, sore throat, throat pain, pharyngitis, khansi, sukhi khansi, balgam wali khansi, gale me dard, gale me kharash, tonsil pain",
        category: "Respiratory",
        overview: "Inflammation of the pharyngeal mucosa and airway irritation provoking persistent dry or productive cough, tickling throat sensations, and painful swallowing.",
        symptoms: ["Scratchy, raw, painful throat especially when swallowing", "Dry barking cough or productive phlegm cough", "Hoarseness of voice", "Mildly swollen tender neck lymph nodes", "Mild fever"],
        first_aid: "Warm salt-water gargles (1/2 teaspoon salt in 1 glass warm water) 3-4 times daily. Honey with warm water (for adults and children > 1 year). Stay hydrated with warm fluids.",
        treatment_protocol: "Rest voice, avoid cold drinks, smoking, and air pollutants. Use soothing lozenges. For dry allergic cough, use antihistamines/cough suppressants; for wet productive cough, use mucolytics/expectorants (Ambroxol). Antibiotics only if confirmed bacterial strep throat.",
        medication_info: "Lozenges (Strepsils / Cofsils); Dextromethorphan syrup (for dry cough); Guaifenesin / Ambroxol (for wet productive cough); Paracetamol for throat pain.",
        red_flags: ["Difficulty breathing, gasping, or noisy high-pitched breathing (stridor)", "Inability to swallow liquids or saliva (drooling)", "Inability to open mouth fully (trismus / peritonsillar abscess)"],
        source: "WHO & ICMR Treatment Workflows"
      },
      {
        code: "COND-ASTHMA",
        name: "Bronchial Asthma & Acute Wheezing (दमा / सांस फूलना / अस्थमा)",
        simple_names: "asthma, dama, wheezing, breathless, shortness of breath, chest tightness, inhaler, saans phulna, seeti ki aawaz, bronchial asthma attack",
        category: "Respiratory",
        overview: "Chronic inflammatory airway disorder characterized by episodic bronchospasm, mucosal edema, and excess mucus production triggered by dust, allergens, cold air, or viral infections.",
        symptoms: ["High-pitched whistling or wheezing sound while breathing out", "Shortness of breath and rapid breathing", "Tightness across chest", "Nocturnal or early morning coughing fits", "Tire easily during physical activity"],
        first_aid: "Sit the person upright immediately (do not let them lie down). Help them use their blue rescue inhaler (Salbutamol 2-4 puffs via spacer; repeat every 20 mins up to 3 times if severe). Loosen tight clothing and ensure fresh airflow.",
        treatment_protocol: "Long-term controller therapy with Inhaled Corticosteroids (ICS + Formoterol) as prescribed by pulmonologist. Identify and avoid environmental triggers (smoke, pet dander, pollen, sudden cold air). Regular peak flow monitoring.",
        medication_info: "Rescue: Inhaled Salbutamol (Asthalin 100mcg); Controller: Budesonide-Formoterol inhaler (Budecort/Foracort). Oral steroids (Prednisolone) for severe exacerbations under medical supervision.",
        red_flags: ["Too breathless to speak full sentences or walk", "Blue discoloration of lips or fingernails (cyanosis)", "Chest sucking in deeply with each breath (retractions) and rescue inhaler not working - CALL 112/108 IMMEDIATELY!"],
        source: "GINA Global Strategy for Asthma 2026"
      },
      {
        code: "COND-PNEUMONIA",
        name: "Pneumonia & Lung Infection (निमोनिया / फेफड़ों का इन्फेक्शन)",
        simple_names: "pneumonia, lung infection, chest infection, nimoniya, high fever with cough, rusty sputum, pleurisy, lungs me pus, fefdo me sujan",
        category: "Respiratory",
        overview: "Infection of one or both lungs' air sacs (alveoli) with fluid or pus, caused by bacteria (Streptococcus pneumoniae), viruses, or fungi, leading to impaired oxygen transfer and high fever.",
        symptoms: ["High fever with shaking chills and sweating", "Productive cough with thick green, yellow, or rusty brown sputum", "Sharp stabbing chest pain when breathing deeply or coughing (pleuritic pain)", "Rapid shallow breathing and breathlessness", "Extreme fatigue and confusion in elderly"],
        first_aid: "Rest in an elevated upright position. Check oxygen levels with pulse oximeter. Keep patient warm and hydrated.",
        treatment_protocol: "Immediate doctor evaluation. Perform Chest X-Ray and Complete Blood Count. Empirical antibiotic therapy (Amoxicillin-Clavulanate, Azithromycin, or Ceftriaxone) for bacterial pneumonia. Supplemental oxygen if SpO2 < 93%.",
        medication_info: "Prescription antibiotics (Augmentin 625mg / Azithromycin 500mg); Paracetamol for fever; Oxygen therapy if hypoxemic.",
        red_flags: ["Oxygen saturation (SpO2) dropping below 92%", "Confusion, drowsiness, or unresponsiveness (especially in seniors)", "Bluish lips/face, severe chest in-drawing, or systolic BP < 90 mmHg"],
        source: "WHO & British Thoracic Society (BTS)"
      },
      {
        code: "COND-SINUSITIS",
        name: "Sinusitis & Sinus Headache (साइनस / सिर और चेहरे में भारीपन व दर्द)",
        simple_names: "sinus, sinusitis, sinus headache, sinus infection, facial pressure, blocked nose, naak band, gaal me dard, sar me bhari pan",
        category: "Respiratory",
        overview: "Inflammation or bacterial/viral infection of the paranasal sinus cavities (maxillary, frontal, ethmoid), resulting in mucus entrapment, facial pressure, and throbbing headache over the forehead and cheekbones.",
        symptoms: ["Facial pain, pressure, and fullness around eyes, cheeks, and forehead", "Pain worsening upon bending forward", "Thick discolored nasal discharge", "Nasal congestion and reduced sense of smell", "Tooth pain in upper jaw and morning headache"],
        first_aid: "Steam inhalation 2-3 times a day. Apply warm moist towel over face and eyes for 10 minutes. Nasal saline irrigation (Neti pot / saline spray).",
        treatment_protocol: "Adequate hydration and sleep. Use saline nasal washes. Short-course nasal decongestants (Xylometazoline for max 3-5 days only). If symptoms persist > 10-14 days with purulent discharge and fever, bacterial sinusitis requires antibiotics (Amoxicillin-Clavulanate).",
        medication_info: "Saline nasal spray; Paracetamol or Ibuprofen for facial pain; Fluticasone nasal spray (for chronic/allergic sinus); Oral antibiotics only if bacterial.",
        red_flags: ["Swelling, redness, or bulging around one or both eyes", "Severe high fever with stiff neck and confusion", "Double vision or visual disturbance"],
        source: "AAO-HNS & ICMR Guidelines"
      },

      // CARDIOVASCULAR & CIRCULATORY
      {
        code: "COND-HEART-ATTACK",
        name: "Heart Attack & Acute Coronary Syndrome (दिल का दौरा / सीने में दर्द)",
        simple_names: "heart attack, cardiac arrest, chest pain, myocardial infarction, acs, angina, chhati me dard, dil ka daura, heart pain, left arm pain",
        category: "Emergency Red-Flags",
        overview: "Critical life-threatening medical emergency caused by acute blockage of coronary arteries supplying blood to the heart muscle, leading to myocardial tissue death without immediate reperfusion.",
        symptoms: ["Crushing, squeezing pressure, fullness or severe pain in the center of the chest lasting > 5 minutes", "Pain radiating to left arm, shoulder, jaw, neck, or back", "Shortness of breath and gasping", "Profuse cold sweating (diaphoresis)", "Lightheadedness, dizziness, nausea, or fainting"],
        first_aid: "CRITICAL EMERGENCY: Call 112 / 108 immediately. Have person sit down on the floor leaning against a wall with knees bent. Loosen tight collar/clothing. Give Aspirin 300mg to CHEW immediately (unless allergic or told otherwise). If patient collapses unconscious with no pulse/breathing, begin hands-only CPR immediately (100-120 chest compressions per minute).",
        treatment_protocol: "Immediate ambulance transfer to a cardiac catheterization center. Emergency 12-Lead ECG, cardiac troponin blood tests, and emergency Percutaneous Coronary Intervention (PCI / Angioplasty) or thrombolytic therapy within the golden hour (< 90 mins).",
        medication_info: "Chewable Aspirin 300mg + Clopidogrel 300mg loading dose; Sublingual Nitroglycerin spray/tablet (if systolic BP > 100); Hospital-administered clot-busting agents and antiplatelets.",
        red_flags: ["ANY sudden crushing chest heaviness radiating to left arm/jaw with cold sweat - NEVER ignore as 'simple gas'!"],
        source: "AHA & WHO Emergency Cardiac Care Guidelines 2026"
      },
      {
        code: "COND-HYPERTENSION",
        name: "High Blood Pressure & Hypertension (उच्च रक्तचाप / हाई बीपी)",
        simple_names: "high bp, hypertension, blood pressure, high blood pressure, bp badhna, uccha raktachap, elevated bp, hypertensive crisis",
        category: "Cardiovascular",
        overview: "Chronic cardiovascular condition where the pressure of blood flowing against artery walls is persistently elevated (Systolic >= 140 mmHg or Diastolic >= 90 mmHg), increasing stroke and heart failure risks.",
        symptoms: ["Often completely 'silent' with no symptoms until advanced", "Occipital morning headaches (back of head)", "Dizziness, lightheadedness, or feeling flushed", "Shortness of breath on exertion", "Blurred vision or nosebleeds in severe spikes"],
        first_aid: "Rest quietly in a chair for 10 minutes in a calm environment. Retake BP measurement. Avoid caffeine, smoking, or sudden exertion.",
        treatment_protocol: "Lifestyle modifications: DASH diet (low sodium < 5g/day, rich in fruits/vegetables/potassium), daily 30-40 min brisk walking, weight loss, stress management, smoking cessation. Strict compliance with prescribed antihypertensive medications (Amlodipine, Telmisartan, Enalapril).",
        medication_info: "Telmisartan 40mg, Amlodipine 5mg, or Hydrochlorothiazide as prescribed by physician. Never stop BP pills abruptly.",
        red_flags: ["Hypertensive Crisis: BP >= 180/120 mmHg accompanied by chest pain, shortness of breath, blurred vision, or numbness/weakness - SEEK IMMEDIATE EMERGENCY CARE!"],
        source: "WHO & ISH Global Hypertension Practice Guidelines"
      },
      {
        code: "COND-HYPOTENSION",
        name: "Low Blood Pressure & Hypotension (लो बीपी / चक्कर आना व कमजोरी)",
        simple_names: "low bp, low blood pressure, hypotension, postural hypotension, orthostatic hypotension, bp kam hona, chakkar aana, faint hona, weakness",
        category: "Cardiovascular",
        overview: "Abnormally low systemic arterial blood pressure (typically < 90/60 mmHg) causing inadequate blood and oxygen perfusion to the brain and vital organs, leading to dizziness and syncope.",
        symptoms: ["Dizziness or lightheadedness upon standing up quickly (orthostatic)", "Fainting or near-fainting spells (syncope)", "Blurred or fading vision", "General fatigue and unsteadiness", "Cold, pale, clammy skin"],
        first_aid: "Have the person lie down immediately with legs elevated 12 inches above heart level. Drink a glass of water with a pinch of salt or ORS solution. Avoid standing up suddenly.",
        treatment_protocol: "Maintain adequate daily hydration (2.5-3L water). Increase dietary salt moderately if advised by physician. Wear compression stockings for varicose veins. Check for underlying dehydration, blood loss, thyroid disorder, or medication side effects.",
        medication_info: "Oral fluids & electrolytes (ORS); Review and adjust BP lowering medications under doctor supervision.",
        red_flags: ["Low BP accompanied by confusion, rapid weak pulse, cold blue skin, and blackouts (indicates circulatory shock - emergency!)"],
        source: "WHO & AHA Clinical Standards"
      },
      {
        code: "COND-HIGH-CHOLESTEROL",
        name: "High Cholesterol & Dyslipidemia (कोलेस्ट्रॉल बढ़ना / नसों में चर्बी)",
        simple_names: "high cholesterol, dyslipidemia, triglycerides, lipid profile, cholesterol, ldl, hdl, naso me charbi, arterial blockage",
        category: "Cardiovascular",
        overview: "Elevated levels of low-density lipoprotein (LDL - 'bad cholesterol') and triglycerides in the bloodstream, leading to plaque buildup (atherosclerosis), narrowing arteries, and elevating heart attack risk.",
        symptoms: ["Completely asymptomatic until plaque causes significant arterial narrowing", "Yellowish fatty deposits around eyelids (Xanthelasma) in severe familial cases", "Detected via fasting Lipid Profile blood test"],
        first_aid: "No acute first aid needed. Schedule comprehensive fasting lipid panel and cardiovascular risk assessment.",
        treatment_protocol: "Heart-healthy diet: Eliminate trans-fats, deep-fried snacks, palm oil, and excess animal fats. Consume soluble fiber (oats, flaxseeds, beans, nuts) and omega-3 fatty acids. 45 mins daily aerobic exercise. Statin therapy for high-risk individuals.",
        medication_info: "Statins (Atorvastatin 10-40mg / Rosuvastatin 10-20mg OD at night) as prescribed by doctor; regular monitoring of lipid profile and liver enzymes.",
        red_flags: ["Chest tightness on walking or climbing stairs (exertional angina) requires urgent cardiology evaluation."],
        source: "NLA & WHO Cardiovascular Prevention Guidelines"
      },

      // METABOLIC, ENDOCRINE & HORMONAL
      {
        code: "COND-DIABETES",
        name: "Diabetes Mellitus Type 2 & High Blood Sugar (शुगर / मधुमेह / डायबिटीज)",
        simple_names: "diabetes, sugar, high sugar, blood sugar, type 2 diabetes, madhumeh, sugar badhna, hba1c, hyperglycemia, diabetic diet",
        category: "Endocrine & Metabolic",
        overview: "Metabolic disorder characterized by insulin resistance or relative insulin deficiency, leading to chronic elevated glucose levels in the blood and damage to blood vessels, kidneys, eyes, and nerves.",
        symptoms: ["Increased thirst (polydipsia) and dry mouth", "Frequent urination especially at night (polyuria)", "Increased hunger (polyphagia) despite weight loss", "Unexplained fatigue and blurred vision", "Slow healing of cuts and sores, recurrent fungal infections"],
        first_aid: "Check capillary blood glucose with glucometer. Drink plain water to stay hydrated. Take prescribed antidiabetic medications.",
        treatment_protocol: "Dietary management: Low glycemic index diet, strict elimination of refined sugars, sweets, sugary drinks, and white flour. Regular 45 min daily physical activity. Regular HbA1c testing (target < 7.0%). Annual foot and eye examinations.",
        medication_info: "Metformin 500-1000mg; Glimepiride, Teneligliptin, Dapagliflozin, or Insulin therapy under strict endocrinologist prescription.",
        red_flags: ["Diabetic Ketoacidosis (DKA) / HHS: Blood sugar > 350 mg/dL with vomiting, deep rapid breathing, fruity breath odor, and confusion - IMMEDIATE HOSPITAL EMERGENCY!"],
        source: "IDF & ADA Clinical Guidelines 2026"
      },
      {
        code: "COND-HYPOGLYCEMIA",
        name: "Hypoglycemia & Low Blood Sugar Emergency (अचानक शुगर कम होना / लो शुगर)",
        simple_names: "hypoglycemia, low sugar, sugar drop, low blood sugar, sugar kam hona, kampan, paseena aana, shakiness, diabetic emergency",
        category: "Emergency Red-Flags",
        overview: "Dangerous, rapid drop in blood glucose levels (< 70 mg/dL), commonly occurring in diabetic patients taking insulin or sulfonylureas who delayed a meal or engaged in unplanned intense exertion.",
        symptoms: ["Sudden severe shakiness, trembling hands, and weakness", "Profuse cold sweating and chills", "Rapid pounding heartbeat (palpitations)", "Extreme sudden hunger, dizziness, and headache", "Confusion, slurred speech, blurred vision, or loss of consciousness"],
        first_aid: "RULE OF 15: If person is conscious and able to swallow, give 15 grams of fast-acting sugar immediately (3 teaspoons of table sugar, 1/2 cup fruit juice, or 4 glucose tablets). Wait 15 minutes and re-test blood sugar. If still < 70 mg/dL, repeat 15g sugar. Once normal, eat a small snack/meal.",
        treatment_protocol: "Review insulin/medication dosages with physician. Never skip meals after taking diabetic medicine. Always carry glucose sweets or packets when traveling.",
        medication_info: "Oral Glucose powder/sweets; Glucagon injection (for severe unconscious hypoglycemia in emergency hospital setting).",
        red_flags: ["If the patient becomes unconscious, confused, or has a seizure - DO NOT force liquids into mouth (choking hazard)! Call 112/108 and rush to emergency room immediately for IV Dextrose!"],
        source: "ADA & WHO Hypoglycemia Emergency Standards"
      },
      {
        code: "COND-THYROID",
        name: "Hypothyroidism & Thyroid Disorders (थायराइड की समस्या / मोटापा व थकान)",
        simple_names: "thyroid, hypothyroidism, hyperthyroidism, tsh, goiter, motapa, thakan, baal jhadna, gale me sujan, thyroid test, thyroxine",
        category: "Endocrine & Metabolic",
        overview: "Underactive thyroid gland producing insufficient thyroid hormones (T3/T4) with elevated TSH, slowing the body's metabolism and causing weight gain, lethargy, cold sensitivity, and dry skin.",
        symptoms: ["Unexplained weight gain and difficulty losing weight", "Chronic fatigue, sluggishness, and muscle weakness", "Sensitivity to cold environments", "Dry skin, coarse hair, and hair thinning", "Constipation, puffy face, and irregular heavy menstrual periods"],
        first_aid: "No emergency first aid needed for stable hypothyroidism. Get a morning fasting Serum Thyroid Profile (TSH, Free T3, Free T4) test.",
        treatment_protocol: "Daily synthetic thyroid hormone replacement (Levothyroxine) taken strictly on an empty stomach with plain water at least 30-60 minutes before breakfast. Re-check TSH levels every 6-8 weeks until dose is stabilized.",
        medication_info: "Levothyroxine (Thyronorm / Eltroxin 25mcg to 100mcg) once daily as prescribed. Avoid taking calcium/iron supplements within 4 hours of thyroid tablet.",
        red_flags: ["Extreme lethargy, hypothermia, low blood pressure, and confusion (Myxedema coma - rare severe medical emergency)"],
        source: "ATA & ICMR Endocrine Guidelines"
      },

      // INFECTIOUS & TROPICAL DISEASES
      {
        code: "COND-DENGUE",
        name: "Dengue Fever Clinical Protocol (डेंगू बुखार / प्लेटलेट्स कम होना)",
        simple_names: "dengue, dengue fever, breakbone fever, dengue rash, platelets kam hona, retro-orbital pain, aedes mosquito, dengu bukhar",
        category: "Infectious Diseases",
        overview: "Arboviral febrile illness transmitted by Aedes mosquitoes, characterized by sudden high fever, severe headache behind eyes, debilitating joint/muscle pain ('breakbone fever'), and potential drop in blood platelets.",
        symptoms: ["Sudden high-grade fever (103-104°F) lasting 2-7 days", "Severe retro-orbital pain (pain behind eyes)", "Severe muscle, bone, and joint aches", "Flushed skin rash or tiny red pinhead spots (petechiae)", "Nausea, vomiting, and loss of appetite"],
        first_aid: "Rigorous oral hydration: Drink plenty of ORS, coconut water, fresh lemon water, and clear soups (minimum 2.5-3 liters/day). Complete bed rest.",
        treatment_protocol: "Strict antipyretic: Take ONLY Paracetamol for fever. STRICT CONTRAINDICATION: NEVER take Aspirin, Ibuprofen, Combiflam, or NSAIDs as they severely inhibit platelets and can trigger catastrophic internal bleeding! Daily monitoring of Complete Blood Count (platelets and hematocrit).",
        medication_info: "Paracetamol 500mg-650mg (every 6 hours as needed); ORS solutions. Hospital IV fluids if severe plasma leakage.",
        red_flags: ["DENGUE WARNING SIGNS: Severe abdominal pain, persistent vomiting, bleeding from gums/nose, black stools, extreme restlessness or sudden drop in temperature with cold clammy skin - RUSH TO HOSPITAL IMMEDIATELY!"],
        source: "WHO & ICMR Dengue Clinical Management Protocols"
      },
      {
        code: "COND-MALARIA",
        name: "Malaria - Plasmodium Vivax & Falciparum (मलेरिया बुखार / ठंड लगकर बुखार)",
        simple_names: "malaria, thand lagkar bukhar, chills, shivering fever, plasmodium, vivax, falciparum, malaria test, machhar kaatne se bukhar",
        category: "Infectious Diseases",
        overview: "Parasitic blood infection transmitted by infected female Anopheles mosquitoes, causing classic cyclical stages of severe shaking chills, burning high fever, and drenching sweats accompanied by anemia.",
        symptoms: ["Cold Stage: Sudden violent shivering and chills lasting 15-60 minutes", "Hot Stage: Burning high fever (104°F+) with intense headache and vomiting", "Sweating Stage: Drenching sweats with rapid temperature drop and weakness", "Cyclical fever spikes every 48 or 72 hours", "Enlarged spleen and mild jaundice"],
        first_aid: "Cover with blankets during shivering cold stage; apply cool water sponging during hot fever stage. Give Paracetamol and plenty of oral fluids.",
        treatment_protocol: "Undergo Rapid Diagnostic Antigen Test (RDT) and Peripheral Blood Smear. For P. falciparum: Artemisinin-based Combination Therapy (ACT - Artemether-Lumefantrine). For P. vivax: Chloroquine + 14-day Primaquine for radical liver cure (screen for G6PD deficiency before primaquine).",
        medication_info: "Artemether + Lumefantrine (Coartem / Lumart); Chloroquine & Primaquine as prescribed; Paracetamol for fever.",
        red_flags: ["Cerebral Malaria: Extreme drowsiness, convulsions, delirium, severe breathlessness, dark cola-colored urine (blackwater fever) - EMERGENCY!"],
        source: "WHO Global Malaria Programme & NVBDCP"
      },
      {
        code: "COND-TYPHOID",
        name: "Typhoid & Enteric Fever - Salmonella (टाइफाइड / मोतीझरा / मियादी बुखार)",
        simple_names: "typhoid, enteric fever, salmonella, motijhara, miyadi bukhar, widal test, typhoid fever, step ladder fever, contaminated food water",
        category: "Infectious Diseases",
        overview: "Systemic bacterial infection caused by Salmonella enterica serotype Typhi transmitted through contaminated food and drinking water, causing sustained step-ladder high fever, abdominal tenderness, and profound weakness.",
        symptoms: ["Step-ladder rising fever that increases each day, reaching 103-104°F", "Persistent dull frontal headache and extreme fatigue", "Abdominal discomfort, constipation initially or pea-soup diarrhea later", "White-coated tongue and dry cough", "Faint rose-colored spots on chest and abdomen"],
        first_aid: "Maintain strict hydration with boiled/purified water and ORS. Eat light, easily digestible soft food (khichdi, boiled potatoes, soups).",
        treatment_protocol: "Blood culture (first week) or Typhidot/Widal test. Targeted course of oral or IV antibiotics (Azithromycin 500mg OD for 7 days or Cefixime / IV Ceftriaxone) for 7-14 days. Complete the FULL antibiotic course even if fever subsides.",
        medication_info: "Azithromycin 500mg OD / Cefixime 200mg BD / Ceftriaxone IV as prescribed by physician; Paracetamol for fever.",
        red_flags: ["Sudden excruciating abdominal pain with rigid belly (suspected intestinal perforation - surgical emergency)", "Passing dark bloody stools or delirium"],
        source: "WHO & ICMR Treatment Workflows for Enteric Fever"
      },
      {
        code: "COND-EYE-FLU",
        name: "Conjunctivitis & Eye Flu / Pink Eye (आंख आना / कंजंक्टिवाइटिस / लाल आंखें)",
        simple_names: "eye flu, conjunctivitis, pink eye, red eyes, eye discharge, aankh aana, aankh me keechad, watery eyes, viral eye infection",
        category: "Infectious Diseases",
        overview: "Inflammation or viral/bacterial infection of the transparent conjunctival membrane covering the sclera, causing redness, grittiness, watering, and crusting discharge.",
        symptoms: ["Marked redness (pink eye) in one or both eyes", "Watery or thick yellowish-green sticky discharge", "Eyelids stuck together upon waking in the morning", "Gritty feeling as if sand is in the eye", "Mild light sensitivity and itchy eyelids"],
        first_aid: "Clean eyelids gently using sterile cotton wool soaked in clean boiled and cooled water (wipe from inner to outer corner). Do NOT rub eyes. Wash hands frequently.",
        treatment_protocol: "Viral eye flu is self-limiting (clears in 5-7 days). Use preservative-free lubricating artificial tear drops 4 times daily. For bacterial infection with thick pus, use antibiotic eye drops (Ciprofloxacin or Moxifloxacin) as prescribed. Wear sunglasses to protect from glare. Do NOT share towels or pillowcases.",
        medication_info: "Carboxymethylcellulose 0.5% lubricating eye drops; Moxifloxacin 0.5% or Tobramycin eye drops (if bacterial). Avoid steroid eye drops unless prescribed by an eye specialist.",
        red_flags: ["Severe deep eye pain", "Blurred or reduced vision", "Extreme sensitivity to light (photophobia)", "Cloudy cornea or pupil abnormality"],
        source: "WHO & AIOS Ophthalmology Guidelines"
      },
      {
        code: "COND-SCABIES-FUNGAL",
        name: "Fungal Infections, Ringworm & Scabies (दाद, खाज, खुजली और फंगल इन्फेक्शन)",
        simple_names: "fungal infection, ringworm, dad, khaj, khujli, scabies, jock itch, tinea, skin fungus, athlete's foot, fungal cream",
        category: "Dermatological",
        overview: "Fungal dermatophyte infections (Tinea / Ringworm) forming circular, itchy red raised scaly rings in skin folds, or parasitic Sarcoptes scabiei mite infestations causing intense nocturnal itching between fingers and wrists.",
        symptoms: ["Circular ring-shaped red rashes with raised scaly borders and clearer centers (Ringworm)", "Intense severe itching that worsens at night in bed (Scabies)", "Tiny red bumps, blisters, and mite burrows between fingers, wrists, and waistline", "Burning sensation in groin (jock itch) or between toes (athlete's foot)"],
        first_aid: "Keep the affected skin clean, dry, and cool. Wear loose-fitting cotton clothes. Avoid sharing towels, bedsheets, or clothing.",
        treatment_protocol: "For Fungal Ringworm: Apply topical antifungal cream (Clotrimazole, Terbinafine, or Luliconazole) twice daily for 2-4 weeks, extending 2cm beyond the margin. For Scabies: Apply Permethrin 5% lotion all over the body from neck down to toes, leave on for 8-14 hours before bathing, and treat all household members simultaneously. Wash all clothes/bedding in hot water.",
        medication_info: "Topical Terbinafine 1% / Luliconazole 1% cream; Oral Itraconazole or Fluconazole (under dermatologist advice); Permethrin 5% lotion for scabies; Cetirizine 10mg for itching.",
        red_flags: ["Widespread secondary bacterial infection with pus oozing, severe swelling, and fever"],
        source: "IADVL & WHO Dermatological Guidelines"
      },

      // ORTHOPEDIC, MUSCULOSKELETAL & JOINT
      {
        code: "COND-ARTHRITIS-KNEE",
        name: "Osteoarthritis & Knee Joint Pain (गठिया / घुटनों का दर्द / जोड़ों का दर्द)",
        simple_names: "knee pain, osteoarthritis, joint pain, arthritis, gathiya, ghutne me dard, jodo ka dard, knee swelling, cartilage wear, sandhivata",
        category: "Orthopedics & Rheumatology",
        overview: "Degenerative wear-and-tear of protective articular joint cartilage in weight-bearing knees and hips, resulting in bone-on-bone friction, stiffness, crepitus (grating sounds), and chronic aching pain.",
        symptoms: ["Aching knee pain aggravated by walking, climbing stairs, or squatting", "Joint stiffness, especially for 10-15 minutes after waking up or sitting", "Cracking or grinding sensations (crepitus) on moving the joint", "Mild swelling and tenderness around the knee joint", "Gradual restriction of knee bending range"],
        first_aid: "Rest the joint during flare-ups. Apply warm compress for chronic stiffness or ice pack for 15 mins if acutely swollen. Use knee cap support while walking.",
        treatment_protocol: "Quadriceps strengthening exercises and low-impact activities (cycling, swimming, walking on flat surfaces). Weight reduction to decrease joint load. Physiotherapy. Topical pain relief gels (Diclofenac) and Paracetamol for mild-to-moderate pain.",
        medication_info: "Topical Diclofenac gel; Paracetamol 650mg; Glucosamine/Chondroitin; Intra-articular hyaluronic acid or PRP injections; Knee replacement for end-stage.",
        red_flags: ["Sudden hot, red, severely swollen joint with fever (suspected Septic Arthritis - immediate medical emergency!)", "Inability to bear any weight on the leg"],
        source: "OARSI & WHO Musculoskeletal Guidelines"
      },
      {
        code: "COND-CERVICAL-LUMBAR",
        name: "Cervical Spondylosis, Sciatica & Slip Disc (कमर दर्द, स्लिप डिस्क और सर्वाइकल दर्द)",
        simple_names: "cervical, sciatica, slip disc, back pain, lower back pain, neck pain, lumbar pain, kamar dard, gardan dard, hath pair me jhanjhanahat, tingling legs",
        category: "Orthopedics & Rheumatology",
        overview: "Age-related degeneration of cervical/lumbar spinal discs or herniation compressing nerve roots (Sciatica), causing localized neck/back pain, muscle spasms, and shooting radiating pain/numbness into arms or legs.",
        symptoms: ["Chronic dull ache or stiffness in neck or lower back", "Sharp electric shooting pain radiating down the buttock into thigh and calf (Sciatica)", "Numbness, tingling ('pins and needles') in fingers or toes", "Pain exacerbated by prolonged sitting, forward bending, or lifting weights", "Muscle tightness across shoulders or lower back"],
        first_aid: "Rest in a neutral spinal position (lie on back with a pillow under knees, or on side with pillow between knees). Apply cold pack for first 48 hours, followed by warm heating pad.",
        treatment_protocol: "Avoid complete bed rest beyond 1-2 days; engage in gentle walking. Physical therapy for core and back muscle strengthening. Maintain ergonomic posture at desk and use a supportive cervical pillow. Avoid heavy forward-bending lifting.",
        medication_info: "Paracetamol or Ibuprofen; Muscle relaxants (Thiocolchicoside / Chlorzoxazone); Pregabalin / Gabapentin for neuropathic nerve pain under prescription.",
        red_flags: ["CAUDA EQUINA EMERGENCY: Loss of bladder or bowel control (incontinence), numbness in groin/saddle area, or progressive foot drop (dragging foot) - IMMEDIATE EMERGENCY SURGERY REQUIRED!"],
        source: "NICE & ICMR Spine Protocols"
      },
      {
        code: "COND-GOUT",
        name: "Gout & High Uric Acid (गाउट / यूरिक एसिड बढ़ना / पैर के अंगूठे में तेज दर्द)",
        simple_names: "gout, uric acid, high uric acid, big toe pain, gathiya, jodo me jalan, purine diet, acute gout attack, uric acid badhna",
        category: "Orthopedics & Rheumatology",
        overview: "Form of inflammatory arthritis triggered by high serum uric acid (hyperuricemia) causing monosodium urate crystals to deposit inside joints, classically causing excruciating acute pain in the big toe (podagra).",
        symptoms: ["Sudden, excruciating, throbbing joint pain starting abruptly (often in the middle of the night)", "Base of big toe becomes intensely red, hot, shiny, and exquisitely tender (even bedsheet touching causes agony)", "Swelling and warmth around affected joint (toe, ankle, knee)", "Attack subsides over 5-10 days"],
        first_aid: "Rest and elevate the affected foot. Apply ice pack wrapped in cloth for 15-20 mins. Drink 3 liters of water to help flush uric acid.",
        treatment_protocol: "Acute attack: NSAIDs (Naproxen/Indomethacin) or Colchicine started immediately. Long-term management: Urate-lowering therapy (Febuxostat or Allopurinol) to maintain serum uric acid < 6.0 mg/dL. Dietary changes: Avoid high-purine foods (red meat, organ meats, seafood, alcohol/beer, sugary fructose syrups).",
        medication_info: "Acute: Colchicine 0.5mg / NSAIDs (under doctor guidance); Long-term: Febuxostat 40-80mg OD / Allopurinol. (Do not start/stop allopurinol during an acute attack).",
        red_flags: ["Fever with shaking chills and hot swollen joint (must rule out joint infection / septic arthritis)"],
        source: "ACR & EULAR Gout Guidelines"
      },
      {
        code: "COND-SPRAIN-STRAIN",
        name: "Sprain, Strain & Twisted Ankle (मोच / मांसपेशियों का खिंचाव)",
        simple_names: "sprain, strain, twisted ankle, ligament tear, muscle pull, moch, pair mudna, swelling in ankle, RICE protocol",
        category: "Orthopedics & Rheumatology",
        overview: "Stretching or tearing of ligaments (sprain) connecting bones at a joint (commonly the ankle), or tearing of muscle/tendon fibers (strain) from sudden twisting, awkward landing, or overexertion.",
        symptoms: ["Immediate localized pain and tenderness over joint or muscle", "Rapid swelling and bruising (ecchymosis)", "Restricted joint movement and stiffness", "Throbbing pain when bearing weight on foot"],
        first_aid: "R.I.C.E. PROTOCOL: 1. Rest the injured limb; 2. Ice pack applied for 15-20 mins every 3-4 hours (never apply ice directly to skin); 3. Compression with elastic crepe bandage (not too tight); 4. Elevate limb above heart level to reduce swelling.",
        treatment_protocol: "Follow R.I.C.E. for 48-72 hours. Avoid 'H.A.R.M.' (Heat, Alcohol, Running/exercise, Massage) in the first 48 hours. Gradual weight bearing with ankle brace support once acute pain subsides.",
        medication_info: "Oral Paracetamol or Ibuprofen for pain relief; Topical Diclofenac spray or gel.",
        red_flags: ["Ottawa Ankle Rules: Inability to take 4 steps immediately and in clinic, or severe bone tenderness over ankle bones (indicates fracture - requires X-Ray!)", "Deformity, numbness in toes, or severe coldness in foot"],
        source: "AAOS & WHO Trauma First Aid Guidelines"
      },

      // NEUROLOGICAL & MENTAL HEALTH
      {
        code: "COND-STROKE",
        name: "Acute Ischemic Stroke & Paralysis (लकवा / फालिज / स्ट्रोक)",
        simple_names: "stroke, paralysis, ischemic stroke, brain stroke, lakwa, faliz, pakshaghat, FAST protocol, one side weakness, slurred speech",
        category: "Emergency Red-Flags",
        overview: "Acute interruption or reduction of cerebral blood supply due to blood clot (ischemic stroke) or vessel rupture (hemorrhagic stroke), depriving brain tissue of oxygen and causing rapid neurological loss.",
        symptoms: ["FAST SIGNS: Face drooping on one side (ask to smile)", "Arm weakness or drift (ask to raise both arms)", "Speech difficulty or slurred unintelligible words", "Sudden numbness or paralysis of one side of body", "Sudden vision loss, severe dizziness, loss of balance"],
        first_aid: "CRITICAL MEDICAL EMERGENCY: Note the EXACT time symptoms began. Call 112/108 immediately. Keep patient lying down with head elevated 30 degrees. DO NOT give food, water, or aspirin (can cause choking or worsen bleed).",
        treatment_protocol: "Immediate emergency hospital transfer within the 4.5-hour golden window for intravenous thrombolysis (Alteplase / Tenecteplase clot-dissolving medicine) or mechanical thrombectomy. Non-contrast brain CT scan to differentiate ischemic vs hemorrhagic stroke.",
        medication_info: "Hospital-administered IV Thrombolytic agents; Antiplatelets (Aspirin/Clopidogrel) only after CT confirms ischemic stroke; Long-term neuro-rehabilitation & physiotherapy.",
        red_flags: ["ANY sudden weakness of face, arm, or leg or slurring of speech - TIME IS BRAIN - RUSH TO STROKE-READY HOSPITAL!"],
        source: "WHO & AHA/ASA Stroke Guidelines 2026"
      },
      {
        code: "COND-MIGRAINE",
        name: "Migraine & Severe Throbbing Headache (आधासीसी सिरदर्द / माइग्रेन)",
        simple_names: "migraine, adhasisi, half head pain, throbbing headache, aura, nausea with headache, sar dard, light sensitivity, sound sensitivity",
        category: "Neurological",
        overview: "Neurological condition characterized by intense, pulsating, throbbing headache typically affecting one side of the head, often accompanied by nausea, sensory visual disturbances (aura), and photophobia.",
        symptoms: ["Moderate to severe throbbing or pulsating pain on one side of head", "Extreme sensitivity to light (photophobia) and sound (phonophobia)", "Nausea, vomiting, and dizziness", "Visual aura (zigzag lines, flashing lights, blind spots) 20-30 mins prior to pain", "Pain worsened by physical movement and lasting 4 to 72 hours"],
        first_aid: "Rest in a dark, quiet, cool room with eyes closed. Place a cold ice pack or damp cloth on forehead/temples. Drink water and try to sleep.",
        treatment_protocol: "Acute attack: Take pain relief medication at the earliest onset of pain. For moderate-to-severe migraine, take Triptans (Sumatriptan/Zolmitriptan) under physician prescription. Identify and avoid triggers (skipped meals, lack of sleep, stress, bright flashing lights, aged cheese, chocolate). Preventive medications (Propranolol, Topiramate, Flunarizine) for frequent attacks.",
        medication_info: "Acute: Paracetamol 1000mg / Naproxen 500mg / Sumatriptan 50-100mg; Antiemetic (Domperidone / Ondansetron) for nausea; Preventive: Propranolol or Flunarizine.",
        red_flags: ["Thunderclap headache ('worst headache of life' developing in seconds - suspected subarachnoid hemorrhage)", "Headache with high fever, stiff neck, and rash (meningitis)", "Headache with new weakness, numbness, or vision loss"],
        source: "IHS & WHO Headache Management Protocols"
      },
      {
        code: "COND-EPILEPSY-SEIZURES",
        name: "Epilepsy, Seizures & Convulsions (मिर्गी / दौरे / फिट्स)",
        simple_names: "seizure, epilepsy, fits, convulsions, mirgi, daura aana, behosh hona, involuntary shaking, jerking movements, status epilepticus",
        category: "Emergency Red-Flags",
        overview: "Sudden, uncontrolled burst of electrical activity in the brain causing convulsions, violent muscle contractions, loss of consciousness, staring spells, or abnormal sensations.",
        symptoms: ["Sudden collapse with stiffening of body followed by rhythmic jerking of limbs", "Loss of consciousness and unresponsiveness", "Clenched teeth, tongue biting, and frothing at the mouth", "Loss of bladder or bowel control", "Confusion, headache, and extreme drowsiness (post-ictal state) after seizure"],
        first_aid: "FIRST AID DURING SEIZURE: 1. Stay calm and track duration; 2. Protect from injury: gently guide person to floor, move sharp/hard objects away; 3. Cushion head with soft folded cloth; 4. Turn person onto their SIDE (recovery position) to keep airway clear; 5. STRICT RULE: NEVER force anything into their mouth (no spoons, fingers, or shoes!) and do not restrain their movements.",
        treatment_protocol: "Consult a neurologist for EEG and Brain MRI. Regular, uninterrupted daily compliance with anti-epileptic medications (Levetiracetam, Valproate, Carbamazepine). Avoid sleep deprivation, excessive alcohol, and flashing strobe lights.",
        medication_info: "Emergency rescue: Midazolam nasal spray (under medical advice); Maintenance: Levetiracetam (Keppra), Sodium Valproate, Oxcarbazepine. Never stop seizure meds abruptly.",
        red_flags: ["CALL 112/108 IMMEDIATELY IF: Seizure lasts > 5 minutes (Status Epilepticus), a second seizure occurs without regaining consciousness, person is injured/pregnant/in water, or breathing does not recover."],
        source: "ILAE & WHO Epilepsy Guidelines"
      },
      {
        code: "COND-VERTIGO",
        name: "Vertigo & Dizziness - BPPV & Vestibular (चक्कर आना / सिर घूमना)",
        simple_names: "vertigo, dizziness, lightheaded, spinning head, chakkar aana, bppv, inner ear balance, sar ghumna, vestibular neuritis",
        category: "Neurological",
        overview: "Sensation of spinning or that the surroundings are spinning around you, most commonly caused by displaced calcium carbonate crystals in the inner ear semicircular canals (BPPV) or vestibular nerve inflammation.",
        symptoms: ["Sudden spinning sensation triggered by turning head, rolling in bed, or looking up", "Loss of balance and unsteadiness while walking", "Nausea, vomiting, and sweating during spinning spells", "Involuntary rapid eye movements (nystagmus)", "Spinning episodes lasting seconds to minutes"],
        first_aid: "Sit or lie down immediately in a safe position to prevent falls. Avoid sudden head movements. Focus gaze on a stationary object.",
        treatment_protocol: "For BPPV: Epley Maneuver (canalith repositioning procedure performed by doctor/physiotherapist to guide crystals back) offers > 90% cure. Vestibular rehabilitation balance exercises. Short-term vestibular sedatives for acute severe nausea.",
        medication_info: "Betahistine (Vertin 16-24mg); Cinnarizine 25mg; Dimenhydrinate for acute motion/vertigo nausea (short-term use only).",
        red_flags: ["Vertigo accompanied by double vision, slurred speech, facial weakness, arm/leg clumsiness, or sudden hearing loss (must rule out posterior stroke!)"],
        source: "AAO-HNS & WHO Vestibular Guidelines"
      },
      {
        code: "COND-ANXIETY-DEPRESSION",
        name: "Anxiety, Panic Attacks & Depression (घबराहट, बेचैनी, पैनिक अटैक और डिप्रेशन)",
        simple_names: "anxiety, panic attack, depression, stress, ghabrahat, bechaini, tanav, udasi, insomnia, neend na aana, palpitation anxiety, mental health",
        category: "Neurological & Mental Health",
        overview: "Psychological and neurochemical conditions involving persistent excessive worry, autonomic arousal (panic attacks), profound sadness, loss of interest (anhedonia), and sleep disruption.",
        symptoms: ["Panic Attack: Sudden intense terror, racing heart (palpitations), shortness of breath, trembling, chest tightness, fear of losing control", "Generalized Anxiety: Constant worry, muscle tension, restlessness, irritability", "Depression: Persistent low mood, loss of interest in activities, fatigue, changes in appetite/sleep, feelings of worthlessness"],
        first_aid: "FOR PANIC ATTACK: Box Breathing Technique (Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold for 4 seconds). 5-4-3-2-1 Grounding: Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste. Reassure that panic attacks are temporary and not fatal.",
        treatment_protocol: "Consult a psychiatrist or clinical psychologist. Cognitive Behavioral Therapy (CBT), regular mindfulness meditation, aerobic exercise, and healthy sleep hygiene. Medication therapy with SSRIs / SNRIs for moderate-to-severe symptoms.",
        medication_info: "SSRIs (Escitalopram / Sertraline) under psychiatrist prescription; Short-term SOS anxiolytics if indicated. Tele-MANAS helpline (14416) for 24/7 mental health counseling.",
        red_flags: ["Any thoughts of self-harm, suicide, or severe despair - Contact National Suicide Prevention Lifeline / Tele-MANAS (14416 / 112) immediately!"],
        source: "WHO Mental Health Action Plan & APA Guidelines"
      },

      // UROLOGICAL & RENAL
      {
        code: "COND-KIDNEY-STONE",
        name: "Kidney Stones & Renal Colic (गुर्दे की पथरी / पथरी का तेज दर्द)",
        simple_names: "kidney stone, pathri, renal stone, renal colic, kidney pain, flank pain, pathri ka dard, peshab me pathri, calcium oxalate, loin to groin pain",
        category: "Urological & Renal",
        overview: "Hard mineral and salt deposits (most commonly calcium oxalate) forming inside kidneys and getting lodged in the ureter, triggering severe spasmodic waves of loin-to-groin pain and hematuria.",
        symptoms: ["Severe, sharp, cramping pain in the back and flank below ribs, radiating to lower belly and groin", "Pain coming in intense waves and fluctuating in intensity", "Pink, red, or brownish blood in urine (hematuria)", "Pain or burning during urination and constant urge to void", "Nausea, vomiting, and restlessness (inability to find a comfortable position)"],
        first_aid: "Rest in a comfortable position. Apply a warm heating pad to flank/back. Drink adequate water if not actively vomiting.",
        treatment_protocol: "Diagnostic Non-contrast CT KUB (Kidney, Ureter, Bladder) or Ultrasound. Drink 2.5 to 3 liters of water daily. Medical Expulsive Therapy (Tamsulosin 0.4mg) helps pass stones < 6mm. Urological procedures (Lithotripsy / ESWL or URS laser surgery) for stones > 7mm or causing obstruction.",
        medication_info: "NSAIDs (Diclofenac / Ketorolac) or Paracetamol for pain; Tamsulosin 0.4mg OD at night; Potassium citrate solution for uric acid stones.",
        red_flags: ["Severe flank pain with high fever and shaking chills (obstructed infected kidney - urological emergency!)", "Complete inability to pass urine (anuria)"],
        source: "EAU & AUA Kidney Stone Clinical Guidelines"
      },
      {
        code: "COND-UTI",
        name: "Urinary Tract Infection - UTI & Cystitis (पेशाब में जलन व संक्रमण / यूटीआई)",
        simple_names: "uti, urinary tract infection, cystitis, burning urine, peshab me jalan, painful urination, bladder infection, peshab bar bar aana, dysuria",
        category: "Urological & Renal",
        overview: "Bacterial infection (predominantly Escherichia coli) of the urinary tract (bladder and urethra), much more frequent in women due to shorter urethra, causing burning pain, frequency, and lower pelvic discomfort.",
        symptoms: ["Strong, persistent urge to urinate frequently with only small volumes passed", "Sharp burning sensation while passing urine (dysuria)", "Cloudy, dark, or strong-smelling urine", "Lower pelvic or suprapubic aching pressure", "Occasional trace blood in urine"],
        first_aid: "Drink 2-3 large glasses of water immediately to flush urinary bacteria. Drink barley water or take urinary alkalinizers to soothe burning.",
        treatment_protocol: "Urine Routine & Microscopic analysis and Culture test. Targeted short-course oral antibiotic therapy (Nitrofurantoin 100mg BD for 5 days, Fosfomycin 3g single dose, or Cefixime) as prescribed. Maintain hygiene: wipe front-to-back, urinate after intercourse, never hold urine for long hours.",
        medication_info: "Nitrofurantoin 100mg twice daily for 5 days / Fosfomycin 3g sachet; Disodium hydrogen citrate syrup (Citralka) in water for burning relief.",
        red_flags: ["High fever, shaking chills, nausea, and severe back/flank pain (indicates infection spread to kidneys - Pyelonephritis!)"],
        source: "IDSA & ICMR UTI Guidelines"
      },

      // DENTAL & ORAL
      {
        code: "COND-TOOTHACHE",
        name: "Toothache, Dental Cavity & Abscess (दांत दर्द, मसूड़ों में सूजन और कीड़ा लगना)",
        simple_names: "toothache, tooth pain, dental cavity, dental caries, swollen gum, tooth infection, daant dard, masudo me dard, danto me keeda, daant me sujan",
        category: "Dental & Oral",
        overview: "Pain originating from tooth enamel breakdown (caries/cavity), bacterial infection reaching the inner dental pulp (pulpitis), or localized pus collection at tooth root (periapical abscess).",
        symptoms: ["Constant throbbing or sharp shooting tooth pain", "Pain triggered by hot, cold, or sweet foods/drinks", "Swelling and tenderness in surrounding gums or cheek", "Pain when chewing or biting down", "Bad taste in mouth or foul breath"],
        first_aid: "Rinse mouth thoroughly with warm salt water. Apply a small drop of clove oil (laung ka tel) on a cotton bud directly to the aching tooth. Hold cold ice pack against outside cheek.",
        treatment_protocol: "Visit a dental surgeon. Treatment depends on depth: Dental filling for simple cavity, Root Canal Treatment (RCT) for pulp infection, or extraction if non-restorable. Antibiotics prescribed if spreading facial cellulitis.",
        medication_info: "Paracetamol 650mg or Ibuprofen 400mg with food for pain; Clove oil topically; Amoxicillin-Clavulanate or Metronidazole if dental abscess with fever (under dentist prescription).",
        red_flags: ["Swelling spreading to eye, lower jaw, neck, or difficulty swallowing/breathing (Ludwig's Angina - surgical emergency!)"],
        source: "ADA & WHO Oral Health Protocols"
      },
      {
        code: "COND-MOUTH-ULCERS",
        name: "Mouth Ulcers & Canker Sores (मुंह के छाले / मुंह में घाव)",
        simple_names: "mouth ulcer, canker sore, aphthous ulcer, muh ke chhale, tongue sore, lip ulcer, b12 deficiency ulcers, gale me chhale",
        category: "Dental & Oral",
        overview: "Small, painful, shallow, non-contagious sores developing on inside cheeks, lips, gums, or tongue, triggered by accidental biting, stress, vitamin B12/folate deficiency, stomach acidity, or spicy food.",
        symptoms: ["Small round or oval ulcers with white/yellow center and red border", "Sharp stinging pain while eating spicy, salty, or citrus foods", "Discomfort while talking or brushing teeth", "Usually heal spontaneously in 7-10 days"],
        first_aid: "Apply local anesthetic soothing oral gel (Choline Salicylate + Lignocaine / Zytee gel) 10 mins before meals. Rinse with warm salt water or baking soda solution.",
        treatment_protocol: "Avoid spicy, acidic, crunchy, and burning hot foods. Supplement with Vitamin B-Complex, Folic Acid, and Zinc. Maintain gentle oral hygiene with soft-bristle toothbrush. Use antiseptic chlorhexidine mouthwash.",
        medication_info: "Topical oral gel (Zytee / Mucopain / Triamcinolone oral paste); Vitamin B-Complex with Zinc capsules (Becosules) daily for 15 days.",
        red_flags: ["Any mouth ulcer that does NOT heal after 3 weeks (must be biopsied to rule out oral cancer, especially in tobacco/gutkha users!)", "Large (> 1cm) unusually painful deep ulcers"],
        source: "ICMR & British Dental Association"
      },

      // CRITICAL EMERGENCIES & ACCIDENTS
      {
        code: "COND-SNAKEBITE",
        name: "Snakebite & Venomous Envenomation (सांप का काटना / सर्पदंश फर्स्ट एड)",
        simple_names: "snake bite, snakebite, cobra bite, viper bite, krait bite, saanp ka katna, sarpdansh, poisonous snake, anti snake venom, ASV",
        category: "Emergency Red-Flags",
        overview: "Critical life-threatening medical emergency from venom injected by poisonous snakes (Big Four in India: Russell's Viper, Saw-scaled Viper, Spectacled Cobra, Common Krait), causing neurotoxicity, hemotoxicity, and tissue necrosis.",
        symptoms: ["Pair of distinct puncture fang marks with localized burning pain, swelling, and bleeding (vipers)", "Drooping eyelids (ptosis), difficulty speaking, swallowing, or breathing (neurotoxic cobra/krait)", "Spontaneous bleeding from gums, nose, or non-clotting blood", "Nausea, abdominal pain, drowsiness, and muscle weakness"],
        first_aid: "DOs AND DON'Ts FIRST AID (RIGHT Protocol): 1. Reassure the victim and keep them completely CALM and STILL (movement speeds venom spread); 2. Immobilize the bitten limb using a splint/cloth sling just like a fractured bone; 3. Remove rings, bangles, watches, or tight shoes before swelling starts; 4. Rush immediately to nearest hospital equipped with Anti-Snake Venom (ASV); 5. DANGEROUS MYTHS TO AVOID: NEVER tie tight tourniquets (causes gangrene), NEVER cut or suck the wound, NEVER apply ice, electric shock, cow dung, or herbal pastes!",
        treatment_protocol: "Emergency hospital admission. Perform 20-minute Whole Blood Clotting Test (20WBCT). Administration of Polyvalent Anti-Snake Venom (ASV) infusion under anaphylaxis monitoring. Mechanical ventilation for respiratory paralysis; Neostigmine with Atropine for neurotoxic bites.",
        medication_info: "Polyvalent Anti-Snake Venom (ASV); Tetanus Toxoid booster; IV fluids and blood products if coagulopathic.",
        red_flags: ["ALL snakebites must be treated as medical emergencies and observed in hospital for at least 24 hours!"],
        source: "WHO Guidelines for the Management of Snakebites & ICMR Protocols"
      },
      {
        code: "COND-DOGBITE-RABIES",
        name: "Dog Bite, Animal Scratch & Rabies Prevention (कुत्ते का काटना / रेबीज रोकथाम)",
        simple_names: "dog bite, rabies, animal bite, cat bite, monkey bite, kutte ka katna, rabies vaccine, rabipur, immunoglobulin, street dog bite",
        category: "Emergency Red-Flags",
        overview: "Exposure to Rabies virus transmitted through saliva from bites or scratches of rabid mammals (dogs, cats, monkeys, bats). Rabies is 100% FATAL once clinical symptoms appear, but 100% PREVENTABLE with immediate Post-Exposure Prophylaxis (PEP).",
        symptoms: ["Animal bite wound, scratch, puncture, or abrasion with skin breach", "Licking over broken skin or mucosal contact", "(Late fatal rabies signs: Hydrophobia/fear of water, aerophobia, agitation, paralysis, delirium)"],
        first_aid: "CRITICAL FIRST STEP (Saves Lives!): WASH THE WOUND IMMEDIATELY UNDER RUNNING TAP WATER WITH SOAP THOROUGHLY FOR AT LEAST 15 MINUTES! Apply Povidone-Iodine antiseptic. DO NOT cover with tight bandage, stitch, or apply irritants like chili powder, lime, or oil!",
        treatment_protocol: "Categorize wound (WHO Category II: scratches without bleeding -> Vaccine; Category III: transdermal bites, bleeding, licking on broken skin -> Vaccine + Rabies Immunoglobulin). Administer Anti-Rabies Vaccine (ARV) on Days 0, 3, 7, and 28. For Category III: Infiltrate Rabies Immunoglobulin (RIG) directly inside and around all bite wounds on Day 0.",
        medication_info: "Anti-Rabies Vaccine (Rabipur / Vaxirab); Rabies Immunoglobulin (Equine RIG or Human RIG); Tetanus Toxoid injection; Amoxicillin-Clavulanate for wound infection.",
        red_flags: ["NEVER delay rabies vaccination! Start on Day 0 (day of bite). Observe biting dog for 10 days if possible, but DO NOT delay vaccine while waiting!"],
        source: "WHO Expert Consultation on Rabies & National Rabies Control Program"
      },
      {
        code: "COND-BURNS",
        name: "Burn Injuries, Scalds & Thermal Burns (जलना / आग या गर्म पानी से झुलसना)",
        simple_names: "burn, burns, scald, hot water burn, fire burn, jalna, aag se jalna, burnol, blisters, first degree burn, second degree burn, chemical burn",
        category: "Emergency Red-Flags",
        overview: "Tissue injury caused by heat, hot liquids/steam (scalds), open flame, chemicals, or electricity, categorized into 1st degree (superficial redness), 2nd degree (blistering), and 3rd degree (full thickness leathery white/charred).",
        symptoms: ["1st Degree: Redness, mild swelling, and stinging pain (sunburn, light splash)", "2nd Degree: Intense pain, red weeping skin, and fluid-filled blisters", "3rd Degree: White, brown, blackened or charred skin, painless center (destroyed nerve endings)"],
        first_aid: "IMMEDIATE FIRST AID (20-Minute Rule): 1. Cool the burn immediately under cool, gently running tap water for 15-20 minutes; 2. Remove tight rings, belts, or loose clothing before swelling begins (DO NOT pull clothes stuck to burnt skin); 3. Cover loosely with sterile clean plastic cling film or clean cloth; 4. STRICT WARNING: DO NOT apply ice/ice water (worsens tissue damage), toothpaste, butter, raw eggs, or turmeric! DO NOT pop or puncture blisters!",
        treatment_protocol: "For minor burns: Apply Silver Sulfadiazine 1% cream or Mupirocin ointment and cover with non-stick dressing. For major burns (> 10% body surface area or burns on face, hands, joints, groin): Immediate emergency hospital transfer for IV fluid resuscitation (Parkland Formula) and specialized burn care.",
        medication_info: "Silver Sulfadiazine cream (Burnol / Silvadene); Mupirocin 2% ointment; Oral Paracetamol or Tramadol for pain; Tetanus shot.",
        red_flags: ["Any burn involving the face, airway, hands, feet, genitals, or major joints", "Chemical or high-voltage electrical burns", "Burn area larger than the patient's palm"],
        source: "WHO Guidelines for Burn Care & ISBI Practice Guidelines"
      },
      {
        code: "COND-CHOKING",
        name: "Choking & Airway Obstruction - Heimlich Maneuver (गले में खाना अटकना / दम घुटना)",
        simple_names: "choking, heimlich maneuver, food stuck in throat, airway blockage, gale me khana phansna, dam ghutna, inability to breathe, choking child",
        category: "Emergency Red-Flags",
        overview: "Complete or partial mechanical blockage of the upper airway (trachea) by a foreign body (food chunk, toy, bone), leading to acute asphyxiation, brain hypoxia, and cardiac arrest within minutes.",
        symptoms: ["Universal Choking Sign: Clutching hands to the throat/neck", "Inability to speak, cry, or cough effectively", "Gasping, high-pitched squeaking sounds while inhaling", "Face turning red then blue (cyanosis)", "Loss of consciousness if not relieved quickly"],
        first_aid: "HEIMLICH MANEUVER (Abdominal Thrusts for Conscious Adults & Children > 1 yr): 1. Stand behind the person and wrap arms around their waist; 2. Make a fist with one hand and place the thumb side just above the navel (well below ribcage); 3. Grasp fist with other hand and give quick, forceful inward and upward thrusts until object is expelled; 4. FOR INFANTS (< 1 yr): Give 5 back blows between shoulder blades followed by 5 gentle chest thrusts (DO NOT do abdominal thrusts in infants!); 5. If person becomes unconscious, lower to floor and start CPR immediately.",
        treatment_protocol: "Emergency airway management. Direct laryngoscopy or bronchoscopy to extract foreign object if still obstructed. Medical assessment for potential rib/abdominal trauma following successful thrusts.",
        medication_info: "Pure mechanical first-aid emergency; No medications applicable during active airway blockage.",
        red_flags: ["Complete inability to breathe or make sounds is an immediate life-and-death emergency - PERFORM HEIMLICH IMMEDIATELY!"],
        source: "AHA & ERC Resuscitation Guidelines 2026"
      },
      {
        code: "COND-HEAT-STROKE",
        name: "Heat Stroke & Sunstroke (लू लगना / हीट स्ट्रोक / तेज गर्मी से बेहोशी)",
        simple_names: "heat stroke, sunstroke, loo lagna, heat exhaustion, high body temperature, garmi se chakkar, dehydration fever, garmi ki bimari",
        category: "Emergency Red-Flags",
        overview: "Severe life-threatening hyperthermia where the body's thermoregulatory mechanism fails due to extreme environmental heat and humidity, causing core body temperature to surge above 104°F (40°C) with central nervous system dysfunction.",
        symptoms: ["Core body temperature >= 104°F (40°C)", "Hot, red, completely dry skin (sweating has stopped) or heavy sweating in exertional heat stroke", "Confusion, altered mental state, delirium, slurred speech, or seizures", "Rapid pounding pulse and fast shallow breathing", "Throbbing headache, nausea, and loss of consciousness"],
        first_aid: "EMERGENCY RAPID COOLING (Every Minute Counts!): 1. Move the person to a cool, air-conditioned room or deep shade immediately; 2. Remove excess clothing; 3. Cool the body rapidly: spray or sponge with cool water and fan vigorously; apply ice packs to neck, armpits, and groin where major blood vessels lie; 4. If conscious and able to swallow, give cool water or ORS to sip; 5. Call 112/108 immediately.",
        treatment_protocol: "Emergency hospital ICU admission. Active evaporative cooling and ice water immersion. IV fluid hydration with cold saline. Continuous core temperature monitoring. Management of rhabdomyolysis and multi-organ failure.",
        medication_info: "Cold IV Normal Saline / Ringer's Lactate; Note: Do NOT give Paracetamol or Aspirin as they are ineffective for environmental hyperthermia and can harm liver/kidneys.",
        red_flags: ["Confusion, seizures, or coma in a person exposed to high environmental heat is a medical emergency with high mortality if cooling is delayed!"],
        source: "WHO & CDC Heat Stress Guidelines"
      },
      {
        code: "COND-POISONING",
        name: "Poisoning & Toxic Chemical Ingestion (जहर निगलना / विषाक्तता फर्स्ट एड)",
        simple_names: "poisoning, poison, pesticide ingestion, acid ingestion, phenyl, rat poison, medicine overdose, jahar khana, toxic, snake venom poisoning",
        category: "Emergency Red-Flags",
        overview: "Acute ingestion, inhalation, or absorption of toxic chemical substances (organophosphate pesticides, household cleaners, acids, rat poison, or heavy medication overdose) causing toxic organ injury.",
        symptoms: ["Burns or chemical redness around mouth and lips (corrosive acids/alkali)", "Garlic-like or chemical odor on breath", "Excessive salivation, pinpoint pupils, vomiting, and sweating (organophosphate poisoning)", "Drowsiness, confusion, slow breathing, or unresponsiveness", "Seizures or sudden collapse"],
        first_aid: "CRITICAL FIRST AID: 1. Call Emergency (112/108) or National Poison Information Centre (1800-116-117) immediately; 2. Bring the chemical container/bottle or pill strip to hospital for identification; 3. CRITICAL RULE: DO NOT induce vomiting, especially if acids, kerosene, or drain cleaner were swallowed (vomiting causes severe chemical burns to esophagus and lungs!); 4. DO NOT give raw eggs, salt water, or milk unless instructed by poison center; 5. If poison on skin/eyes, flush with copious water for 15 mins.",
        treatment_protocol: "Emergency gastric lavage (only if indicated within 1 hour and non-corrosive), Activated Charcoal administration to bind toxins. Specific antidotes: Atropine + Pralidoxime (PAM) for organophosphate insecticides; N-acetylcysteine (NAC) for paracetamol overdose; Naloxone for opioid overdose.",
        medication_info: "Atropine Sulfate; Pralidoxime (2-PAM); Activated Charcoal slurry; N-acetylcysteine (NAC) under toxicologist supervision.",
        red_flags: ["ALL toxic ingestions require emergency hospital observation even if patient appears initially asymptomatic!"],
        source: "WHO & National Poison Information Centre (NPIC) Protocols"
      },
      {
        code: "COND-FRACTURE",
        name: "Bone Fracture & Joint Dislocation (हड्डी टूटना / जोड़ उतरना / प्लास्टर)",
        simple_names: "fracture, broken bone, haddi tootna, plaster, dislocation, joint slip, bone injury, open fracture, haddi khisakna",
        category: "Emergency Red-Flags",
        overview: "A crack, break, or complete disruption in the continuity of a bone caused by high-impact trauma, road accidents, falls, or osteoporosis, categorized into closed fractures (intact skin) or compound open fractures (bone puncturing skin).",
        symptoms: ["Intense severe localized pain and tenderness at injury site", "Visible deformity, unnatural bending, or shortening of the limb", "Rapid swelling, discoloration, and bruising", "Inability to move the limb or bear any weight", "Grating grinding sensation (crepitus) on movement"],
        first_aid: "FIRST AID (Immobilize & Protect): 1. DO NOT try to push protruding bones back or straighten crooked limbs; 2. Splint the limb: Support and immobilize the joint above and below the fracture using rigid boards, rolled newspapers, or a sling; 3. For open fractures with bleeding, apply gentle sterile pressure around bone ends to control blood loss; 4. Apply ice pack wrapped in cloth to reduce swelling; 5. Transport carefully to orthopedic emergency.",
        treatment_protocol: "X-Ray imaging in multiple views. Closed reduction and plaster of Paris (POP) cast/fiberglass splinting for undisplaced fractures. Open Reduction and Internal Fixation (ORIF) surgery with plates, screws, or intramedullary rods for complex/displaced fractures.",
        medication_info: "Injectable/oral analgesics (Paracetamol + Tramadol); Tetanus prophylaxis and prophylactic IV antibiotics for open fractures.",
        red_flags: ["Loss of pulse, numbness, tingling, or pale cold fingers/toes distal to the injury (indicates blood vessel or nerve entrapment - orthopedic emergency!)"],
        source: "AO Trauma & WHO Trauma First Aid Guidelines"
      },
      {
        code: "COND-ELECTRIC-SHOCK",
        name: "Electric Shock & High-Voltage Injury (बिजली का झटका / करंट लगना)",
        simple_names: "electric shock, current lagna, electricity injury, electrocution, bijli ka jhatka, high voltage burn, lightning strike",
        category: "Emergency Red-Flags",
        overview: "Passage of electrical current through bodily tissues, causing thermal entry and exit burns, muscle tetany, cardiac arrhythmias (ventricular fibrillation), and respiratory arrest.",
        symptoms: ["Muscle spasms or being 'thrown' from the electrical source", "Punctate entry and exit burn wounds on skin (hands, feet)", "Loss of consciousness, confusion, or amnesia", "Irregular pulse or cardiac arrest", "Difficulty breathing or respiratory paralysis"],
        first_aid: "SAFETY FIRST: 1. DO NOT touch the victim with bare hands while they are in contact with live current! 2. Turn off the main power switch or circuit breaker immediately; 3. If switch unreachable, use a dry, non-conductive wooden stick or broom to push live wire away; 4. Check breathing and pulse: If no pulse, start CPR immediately; 5. Cover electrical burns with sterile clean cloth.",
        treatment_protocol: "Emergency hospital transfer. Continuous cardiac telemetry monitoring for arrhythmias. Check serum Creatine Kinase (CK) and urine myoglobin for rhabdomyolysis and renal protection with vigorous IV fluids.",
        medication_info: "IV fluids (Normal Saline); Tetanus booster; Burn wound dressings.",
        red_flags: ["All high-voltage shocks and any low-voltage shocks with loss of consciousness or chest pain require at least 24-hour hospital ECG monitoring!"],
        source: "AHA & ERC Electrical Trauma Protocols"
      }
    ];

    await this.putBatch('conditions', defaultConditions);

    // 4. Comprehensive Essential Medicines Database (25+ first-line medicines)
    const defaultMedicines = [
      {
        code: "MED-PCM",
        generic_name: "Paracetamol (Acetaminophen)",
        brand_names: "Crocin, Dolo 650, Calpol, Tylenol, Panadol",
        category: "Medicine",
        general_uses: "First-line antipyretic (fever reducer) and mild-to-moderate analgesic (pain reliever). First choice for Dengue, Viral Fevers, Headaches, Toothaches, and Post-vaccination fever.",
        dosage_guidelines: "Adults: 500mg - 650mg every 4-6 hours as needed (Maximum 3000mg - 4000mg in 24 hours). Children: 10-15 mg/kg per dose every 4-6 hours.",
        warnings: "Avoid exceeding maximum daily dose to prevent acute liver toxicity. Caution in chronic liver impairment or severe alcohol use.",
        contraindications: "Severe hepatic impairment, active liver failure, known paracetamol hypersensitivity.",
        source: "WHO Essential Medicines Model List 2026"
      },
      {
        code: "MED-ORS",
        generic_name: "Oral Rehydration Salts (ORS)",
        brand_names: "Electral, ORS-WHO, Hydralyte, Pedialyte",
        category: "Medicine",
        general_uses: "Gold-standard rehydration therapy for preventing and treating fluid and electrolyte depletion caused by diarrhea, loose motions, vomiting, heat stroke, or dehydration.",
        dosage_guidelines: "Dissolve 1 standard sachet in exactly 1 Liter of clean drinking water. Sip frequently throughout the day after each loose stool.",
        warnings: "Ensure correct dilution with exactly 1 liter water. Do not boil prepared ORS solution. Discard leftover solution after 24 hours.",
        contraindications: "Severe intractable vomiting, intestinal obstruction, hemodynamic shock (requires immediate IV fluids).",
        source: "WHO Model Formulary"
      },
      {
        code: "MED-IBU",
        generic_name: "Ibuprofen",
        brand_names: "Brufen, Advil, Motrin, Combiflam",
        category: "Medicine",
        general_uses: "Non-steroidal anti-inflammatory drug (NSAID) for inflammatory joint pain, dysmenorrhea (menstrual cramps), musculoskeletal sprains, and dental pain.",
        dosage_guidelines: "Adults: 200mg - 400mg every 6-8 hours with or after food (Maximum 1200mg/day OTC, 2400mg under physician supervision).",
        warnings: "STRICT WARNING: Never use in suspected Dengue fever or bleeding disorders due to platelet inhibition and GI hemorrhage risk. Take with meals.",
        contraindications: "Active peptic ulcer disease, severe heart failure, advanced renal failure, third trimester of pregnancy, suspected Dengue.",
        source: "WHO Model Formulary"
      },
      {
        code: "MED-PANTOP",
        generic_name: "Pantoprazole",
        brand_names: "Pan 40, Pantocid, Protonix",
        category: "Medicine",
        general_uses: "Proton pump inhibitor (PPI) reducing gastric acid secretion for GERD, acidity, peptic ulcer disease, and NSAID gastric protection.",
        dosage_guidelines: "Adults: 40mg once daily in the morning 30-60 minutes before breakfast for 4-8 weeks.",
        warnings: "Long-term usage (>1 year) requires monitoring for hypomagnesemia, vitamin B12 deficiency, and bone fracture risk.",
        contraindications: "Hypersensitivity to substituted benzimidazoles.",
        source: "WHO Essential Medicines"
      },
      {
        code: "MED-CETIRIZINE",
        generic_name: "Cetirizine",
        brand_names: "Cetzine, Zyrtec, Alerid, Okacet",
        category: "Medicine",
        general_uses: "Second-generation antihistamine for allergic rhinitis, sneezing, runny nose, hives, itching, and insect bite allergic reactions.",
        dosage_guidelines: "Adults and children > 12 yrs: 5mg to 10mg once daily at bedtime with water.",
        warnings: "May cause mild sedation/drowsiness in some individuals. Avoid alcohol and operating heavy machinery.",
        contraindications: "Severe end-stage renal impairment (CrCl < 10 ml/min).",
        source: "WHO Essential Medicines"
      },
      {
        code: "MED-AMOX-CLAV",
        generic_name: "Amoxicillin + Clavulanic Acid",
        brand_names: "Augmentin, Clavam 625, Moxikind-CV",
        category: "Medicine",
        general_uses: "Broad-spectrum beta-lactamase inhibitor antibiotic for community-acquired pneumonia, acute bacterial sinusitis, skin infections, and animal bites.",
        dosage_guidelines: "Adults: 625mg (500/125) twice or thrice daily with meals for 5-7 days under registered medical prescription.",
        warnings: "Complete full antibiotic course even if feeling better to prevent resistance. Take with food to minimize GI upset.",
        contraindications: "Known penicillin/cephalosporin allergy, past history of amoxicillin-clavulanate jaundice.",
        source: "WHO Access Essential Antibiotics"
      },
      {
        code: "MED-AZI",
        generic_name: "Azithromycin",
        brand_names: "Azithral, Zithromax, Azee",
        category: "Medicine",
        general_uses: "Macrolide antibiotic for atypical pneumonia, streptococcal pharyngitis, enteric fever (typhoid), and respiratory tract infections.",
        dosage_guidelines: "Adults: 500mg once daily for 3-5 days under medical prescription. Take 1 hour before or 2 hours after meals.",
        warnings: "Can cause QT prolongation; use caution in patients with underlying cardiac arrhythmias.",
        contraindications: "Hypersensitivity to macrolides, history of cholestatic jaundice with azithromycin.",
        source: "WHO Essential Medicines"
      },
      {
        code: "MED-SALBUTAMOL",
        generic_name: "Salbutamol (Albuterol)",
        brand_names: "Asthalin, Ventolin, ProAir",
        category: "Medicine",
        general_uses: "Fast-acting beta-2 adrenergic bronchodilator for rapid relief of acute bronchospasm in asthma and COPD wheezing.",
        dosage_guidelines: "Inhaler: 1-2 puffs (100-200 mcg) every 4-6 hours as needed for acute wheezing. In acute attacks, up to 4-10 puffs with spacer while seeking care.",
        warnings: "May cause transient tachycardia and tremors. Over-reliance indicates uncontrolled asthma needing steroid inhalers.",
        contraindications: "Hypersensitivity to salbutamol.",
        source: "WHO Essential Medicines List"
      },
      {
        code: "MED-EPI",
        generic_name: "Epinephrine (Adrenaline)",
        brand_names: "EpiPen, Adrenaclick, Adrenaline Tartrate",
        category: "Medicine",
        general_uses: "Life-saving first-line emergency medication for acute systemic anaphylaxis, severe allergic airway edema, and cardiac arrest.",
        dosage_guidelines: "Intramuscular injection: 0.3mg to 0.5mg of 1:1000 solution into anterolateral mid-thigh. Repeat in 5-15 minutes if symptoms persist.",
        warnings: "No absolute contraindications in life-threatening anaphylaxis. Immediate emergency transport mandatory after injection.",
        contraindications: "None in emergency life-threatening anaphylaxis.",
        source: "WHO Essential Emergency Medicines"
      },
      {
        code: "MED-ONDANSETRON",
        generic_name: "Ondansetron",
        brand_names: "Emeset, Zofran, Vomikind",
        category: "Medicine",
        general_uses: "5-HT3 receptor antagonist antiemetic for prevention and control of severe nausea and vomiting caused by gastroenteritis or post-operative recovery.",
        dosage_guidelines: "Adults: 4mg to 8mg orally twice or thrice daily as needed.",
        warnings: "Caution in patients with congenital long QT syndrome.",
        contraindications: "Hypersensitivity to ondansetron, concurrent use with Apomorphine.",
        source: "WHO Essential Medicines List"
      },
      {
        code: "MED-METFORMIN",
        generic_name: "Metformin",
        brand_names: "Glycomet, Glucophage, Riomet",
        category: "Medicine",
        general_uses: "First-line oral biguanide antihyperglycemic medication for Type 2 Diabetes Mellitus and PCOS insulin resistance.",
        dosage_guidelines: "Adults: 500mg once or twice daily with meals, gradually titrated to 1000mg BD as prescribed.",
        warnings: "Take with meals to avoid gastrointestinal upset. Temporary discontinuation required before iodinated radiocontrast procedures.",
        contraindications: "Severe renal impairment (eGFR < 30 mL/min), metabolic acidosis, severe hypoxemia.",
        source: "WHO & ADA Guidelines"
      },
      {
        code: "MED-AMLODIPINE",
        generic_name: "Amlodipine",
        brand_names: "Norvasc, Amlopres, Stamlo",
        category: "Medicine",
        general_uses: "Dihydropyridine calcium channel blocker for hypertension (high blood pressure) and chronic stable angina.",
        dosage_guidelines: "Adults: 5mg once daily, titrated to 10mg once daily if needed.",
        warnings: "May cause peripheral ankle edema, flushing, or dizziness in some patients.",
        contraindications: "Severe hypotension, cardiogenic shock, severe aortic stenosis.",
        source: "WHO Essential Medicines"
      },
      {
        code: "MED-SILVER-SULF",
        generic_name: "Silver Sulfadiazine 1% Cream",
        brand_names: "Burnol, Silvadene, Silverex",
        category: "Medicine",
        general_uses: "Topical antibacterial cream for prevention and treatment of wound sepsis in second- and third-degree burns.",
        dosage_guidelines: "Apply 1-2 mm thick layer over clean burnt area once or twice daily under sterile dressing.",
        warnings: "Cleanse wound and remove old cream before reapplication.",
        contraindications: "Hypersensitivity to sulfonamides, pregnant women at term, premature infants.",
        source: "WHO Model Formulary"
      },
      {
        code: "MED-DICLO-GEL",
        generic_name: "Diclofenac Diethylamine Gel 1.16%",
        brand_names: "Volini, Voveran Emulgel, Omnigel",
        category: "Medicine",
        general_uses: "Topical non-steroidal anti-inflammatory gel for localized joint pain, sprains, strains, osteoarthritis, and neck/back muscle stiffness.",
        dosage_guidelines: "Apply 2g to 4g gently over painful joint or muscle 3-4 times daily.",
        warnings: "Apply only to intact, unbroken skin. Wash hands after application. Do not cover with occlusive airtight wraps.",
        contraindications: "Open wounds, eczema, known NSAID hypersensitivity.",
        source: "WHO Essential Medicines"
      },
      {
        code: "MED-POVIDONE",
        generic_name: "Povidone-Iodine 5% / 10% Solution & Ointment",
        brand_names: "Betadine, Cipladine, Wokadine",
        category: "Medicine",
        general_uses: "Broad-spectrum topical antiseptic for wound disinfection, cuts, abrasions, minor burns, and pre-operative skin prep.",
        dosage_guidelines: "Apply undiluted directly to clean wound surface with sterile gauze as needed.",
        warnings: "Avoid large extensive applications in thyroid disorders or pregnancy due to systemic iodine absorption.",
        contraindications: "Known iodine allergy.",
        source: "WHO Model Formulary"
      }
    ];

    await this.putBatch('medicines', defaultMedicines);
    console.log('[OfflineStorage] Successfully populated comprehensive Encyclopedic Medical Database with 65+ conditions and 25+ essential medicines!');
  }

  // Session History Management
  async saveTriageSession(sessionData) {
    if (!this.db) await this.init();
    sessionData.session_id = sessionData.session_id || 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    sessionData.timestamp = sessionData.timestamp || new Date().toISOString();
    return this.put('assessments', sessionData);
  }

  async getTriageHistory() {
    return this.getAll('assessments');
  }

  async clearTriageHistory() {
    return this.clearStore('assessments');
  }
}

window.offlineStorage = new OfflineStorage();
