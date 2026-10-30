/* =========================================================
   Question bank. Built from Lec 1–3, the SIR notes and
   Sheets 1–2. Numeric answers are computed in code, never
   typed by hand, so the auto-correction is exact.

   Types
     mcq   options[], answer = index of the correct option
     multi options[], answer = [indices]   (select all that apply)
     tf    answer = true | false
     num   answer = number, tol = relative tolerance, abs = absolute tolerance, unit
     text  answer = [accepted strings]
   For mcq/multi the options are shuffled at runtime unless fixed:true.
   ========================================================= */
(function () {
  const log10 = Math.log10, sqrt = Math.sqrt;
  const dB = (x) => 10 * log10(x);
  const lin = (d) => Math.pow(10, d / 10);
  const sir1 = (N, n) => Math.pow(sqrt(3 * N), n) / 6;           // first-tier SIR (linear)
  const nmin = (dBreq, n) => Math.pow(6 * lin(dBreq), 2 / n) / 3;  // required cluster size
  const r = (x, d = 2) => Math.round(x * Math.pow(10, d)) / Math.pow(10, d);

  const bank = [];
  let counter = {};
  function add(lec, topic, diff, q) {
    counter[lec] = (counter[lec] || 0) + 1;
    q.id = q.id || (lec.toLowerCase() + "-" + String(counter[lec]).padStart(3, "0"));
    q.lec = lec; q.topic = topic; q.diff = diff;
    if (q.pts == null) q.pts = (q.type === "num" || q.type === "multi") ? (diff >= 3 ? 3 : 2) : 1;
    if (q.type === "mcq" && q.answer == null) q.answer = 0;
    bank.push(q);
  }

  /* ======================= LECTURE 1 ======================= */
  const L1 = "L1";
  // Base station & basics
  add(L1, "Base station", 1, { type: "mcq",
    q: "Which base station component converts electrical signals into electromagnetic waves (and back)?",
    options: ["Antenna", "Radio Unit (RU/RRH)", "Baseband Unit (BBU)", "Backhaul"],
    explain: "The antenna sends and receives radio signals and converts electrical signals ↔ EM waves. The RU handles the RF/digital conversion." });
  add(L1, "Base station", 1, { type: "mcq",
    q: "Which component handles the radio-frequency (RF) part, converting digital signals into radio signals for transmission?",
    options: ["Radio Unit (RU / RRH)", "Antenna", "Baseband Unit (BBU)", "Power supply"],
    explain: "The Radio Unit (RU/RRH) converts digital → radio signals for transmission and received radio → digital." });
  add(L1, "Base station", 1, { type: "mcq",
    q: "Modulation/demodulation, coding, scheduling and resource allocation are done by the:",
    options: ["Baseband Unit (BBU)", "Radio Unit (RU)", "Antenna", "Backhaul link"],
    explain: "The BBU processes the digital signals: modulation/demodulation, coding, scheduling, resource allocation." });
  add(L1, "Base station", 1, { type: "mcq",
    q: "The backhaul of a base station connects it to:",
    options: ["The core network", "The user equipment", "The antenna", "Neighboring cells only"],
    explain: "Backhaul links the BS to the core network, usually via fiber, microwave or another high-capacity link." });
  add(L1, "Base station", 1, { type: "tf",
    q: "The RF signal handled by the radio unit is an analog, high-frequency electrical waveform.",
    answer: true, explain: "True. The digital signal is a stream of numbers; the RF signal is analog and high-frequency." });
  add(L1, "Base station", 1, { type: "tf",
    q: "Base stations can only be located at the center of their coverage region.",
    answer: false, explain: "False. The lecture says base stations are located on the edge or at the center of the coverage region." });
  add(L1, "Base station", 1, { type: "mcq",
    q: "A Mobile Station (MS) is defined as:",
    options: ["A station intended for use while in motion, hand-held or vehicle-installed", "A fixed station on a tower", "The switching center of the network", "A database of subscribers"],
    explain: "MS: a station in the cellular radio service intended for use while in motion; hand-held or installed in vehicles." });
  add(L1, "Base station", 1, { type: "mcq",
    q: "In the lecture figure, “eNB” and “UE” refer to:",
    options: ["The base station and the user equipment (phone)", "The user equipment and the base station", "The core network and the SIM card", "Two neighboring base stations"],
    explain: "eNB = eNodeB, the (4G) base station. UE = User Equipment, the mobile unit." });
  add(L1, "Base station", 1, { type: "mcq",
    q: "In 5G, the base station is called the:",
    options: ["gNB (gNodeB)", "eNB (eNodeB)", "BSC", "MSC"],
    explain: "The lecture mentions eNodeB (4G) and gNodeB (5G) as base stations." });

  // Links
  add(L1, "Uplink & downlink", 1, { type: "mcq",
    q: "The uplink is the link that carries information:",
    options: ["From the mobile phone to the base station", "From the base station to the mobile phone", "From the base station to the core network", "Between two phones directly"],
    explain: "Uplink: UE → BS. Downlink: BS → UE." });
  add(L1, "Uplink & downlink", 1, { type: "mcq",
    q: "The downlink carries information:",
    options: ["From the base station to the phone", "From the phone to the base station", "From the MSC to the PSTN", "From the SIM to the phone"],
    explain: "Downlink: BS → UE." });
  add(L1, "Uplink & downlink", 2, { type: "multi",
    q: "Control signals exchanged during a connection are used for (select all that apply):",
    options: ["Resource allocation", "Connection management", "Mobility and handover", "Increasing the transmit power of all cells", "Encrypting the SIM PIN"],
    answer: [0, 1, 2],
    explain: "Control signaling handles resource allocation, connection management, mobility, handover and other network functions." });

  // EM waves & frequency
  add(L1, "Waves & frequency", 1, { type: "tf",
    q: "A modulated EM wave carries only energy, not information.",
    answer: false, explain: "False. An EM wave carries energy; a modulated EM wave carries energy + information." });
  add(L1, "Waves & frequency", 1, { type: "tf",
    q: "In an EM wave, the electric and magnetic fields are perpendicular to each other and to the direction of travel.",
    answer: true, explain: "True, and they share the same frequency and wavelength and travel at c ≈ 3×10⁸ m/s." });
  add(L1, "Waves & frequency", 1, { type: "mcq",
    q: "A 3.5 GHz radio signal oscillates how many times per second?",
    options: ["3.5 billion (3.5 × 10⁹)", "3.5 million (3.5 × 10⁶)", "3.5 thousand", "350 million"],
    explain: "1 GHz = 10⁹ oscillations per second, so 3.5 GHz = 3.5 × 10⁹." });
  add(L1, "Waves & frequency", 2, { type: "num",
    q: "Find the wavelength of a 3.5 GHz 5G signal (c = 3 × 10⁸ m/s).",
    answer: r(3e8 / 3.5e9 * 100, 2), unit: "cm", tol: 0.02,
    explain: "λ = c/f = 3×10⁸ / 3.5×10⁹ = 0.0857 m ≈ 8.57 cm." });
  add(L1, "Waves & frequency", 2, { type: "num",
    q: "Find the wavelength of a 900 MHz GSM signal (c = 3 × 10⁸ m/s).",
    answer: r(3e8 / 900e6 * 100, 2), unit: "cm", tol: 0.02,
    explain: "λ = 3×10⁸ / 9×10⁸ = 0.333 m = 33.3 cm." });
  add(L1, "Waves & frequency", 1, { type: "mcq",
    q: "The interface between the electrical signal and the electromagnetic wave is the:",
    options: ["Antenna", "Baseband unit", "Backhaul", "Core network"],
    explain: "The lecture: the antenna is the interface between the electrical signal and the EM wave." });
  add(L1, "Waves & frequency", 1, { type: "mcq",
    q: "A range of frequencies assigned to carry a system's signals (for example 900–905 MHz) is called a:",
    options: ["Frequency channel", "Cluster", "Dwell time", "Reuse distance"],
    explain: "A communication system is assigned a range of frequencies; that range is called a frequency channel." });

  // UE–BTS steps
  add(L1, "UE–BTS steps", 2, { type: "mcq", fixed: true,
    q: "What is the correct order of the basic UE–BTS communication steps?",
    options: [
      "Discovery → Synchronization → Connection request → Network response → Resource allocation → Data",
      "Synchronization → Discovery → Network response → Connection request → Data → Resource allocation",
      "Discovery → Connection request → Synchronization → Resource allocation → Network response → Data",
      "Connection request → Discovery → Synchronization → Network response → Data → Resource allocation"],
    explain: "1 Network discovery, 2 Synchronization, 3 Connection request, 4 Network response, 5 Radio resource allocation, 6 Data transmission." });
  add(L1, "UE–BTS steps", 1, { type: "mcq",
    q: "In which step does the UE send a control signal to the BTS through the uplink to ask for access?",
    options: ["Connection request", "Network discovery", "Synchronization", "Network response"],
    explain: "Step 3, connection request: the UE sends a control signal on the uplink, e.g. to make a call or send data." });
  add(L1, "UE–BTS steps", 1, { type: "mcq",
    q: "In the network response step, the network sends control information to the UE through the:",
    options: ["Downlink", "Uplink", "Backhaul", "Abis interface"],
    explain: "Step 4: control information goes back through the downlink, telling the UE how and when it can communicate." });
  add(L1, "UE–BTS steps", 1, { type: "mcq",
    q: "The step where the UE locks onto the selected cell and obtains basic information about it and its radio configuration is:",
    options: ["Synchronization", "Network discovery", "Radio resource allocation", "Data transmission"],
    explain: "Step 2, synchronization." });
  add(L1, "UE–BTS steps", 1, { type: "mcq",
    q: "During network discovery, the UE:",
    options: ["Listens to signals transmitted by the base stations", "Transmits data on the uplink", "Receives time/frequency resources", "Authenticates with the AuC"],
    explain: "Step 1: the UE searches for an available network by listening to signals transmitted by the BTS." });
  add(L1, "UE–BTS steps", 1, { type: "mcq",
    q: "Assigning time/frequency resources that the UE can use for transmission happens in the step called:",
    options: ["Radio resource allocation", "Synchronization", "Network discovery", "Connection request"],
    explain: "Step 5, radio resource allocation." });

  // Transmission modes
  add(L1, "Transmission modes", 1, { type: "mcq",
    q: "Radio and television broadcasting are examples of:",
    options: ["Simplex", "Half duplex", "Full duplex", "TDD"],
    explain: "Simplex is one-way communication, like broadcasting." });
  add(L1, "Transmission modes", 1, { type: "mcq",
    q: "“Push to talk, release to listen” describes:",
    options: ["Half duplex", "Simplex", "Full duplex", "FDD"],
    explain: "Half duplex: two directions, one at a time, one channel." });
  add(L1, "Transmission modes", 1, { type: "mcq",
    q: "The land-mobile telephone system, where both users talk at the same time, is an example of:",
    options: ["Full duplex", "Half duplex", "Simplex", "Broadcast"],
    explain: "Full duplex: both directions simultaneously, needing two channels." });
  add(L1, "Transmission modes", 1, { type: "mcq",
    q: "How many communication channels does full-duplex communication require?",
    options: ["Two", "One", "Three", "None"],
    explain: "Full duplex keeps both directions at the same time, requiring two channels." });
  add(L1, "Transmission modes", 1, { type: "tf",
    q: "Half-duplex communication uses one channel and is described as bandwidth efficient.",
    answer: true, explain: "True, as stated in the lecture." });
  add(L1, "Transmission modes", 1, { type: "mcq",
    q: "Computer-to-printer communication is an example of:",
    options: ["Simplex", "Half duplex", "Full duplex", "Soft handoff"],
    explain: "The lecture lists computer-to-printer communication under simplex." });
  add(L1, "Transmission modes", 1, { type: "mcq",
    q: "In FDD (Frequency Division Duplex):",
    options: ["Uplink and downlink use different frequencies", "Uplink and downlink use the same frequency in different time slots", "Only the downlink exists", "The phone transmits on all frequencies"],
    explain: "FDD separates UL and DL in frequency; TDD separates them in time." });
  add(L1, "Transmission modes", 1, { type: "mcq",
    q: "In TDD (Time Division Duplex):",
    options: ["Uplink and downlink use the same frequency in different time slots", "Uplink and downlink use different frequencies", "Only one direction is ever used", "Each user gets a separate antenna"],
    explain: "TDD: same frequency, different time slots." });
  add(L1, "Transmission modes", 1, { type: "tf",
    q: "In TDD, the uplink and downlink transmit at the same time on two different frequency bands.",
    answer: false, explain: "False. That describes FDD. TDD uses one frequency and alternates in time." });
  add(L1, "Transmission modes", 1, { type: "text",
    q: "Full-duplex links are maintained either in the frequency domain or in the ______ domain.",
    answer: ["time", "time domain"],
    explain: "Frequency domain → FDD, time domain → TDD." });

  // Generations
  add(L1, "Generations", 1, { type: "mcq",
    q: "1G mobile systems were:",
    options: ["Analog and voice-only", "Digital with messaging", "Built for mobile data", "LTE broadband"],
    explain: "1G (1980s): analog, voice." });
  add(L1, "Generations", 1, { type: "mcq",
    q: "According to the lecture chart, messaging and global roaming arrived with:",
    options: ["2G", "1G", "4G", "5G"],
    explain: "2G (1990s, digital GSM) added messaging and global roaming." });
  add(L1, "Generations", 1, { type: "mcq",
    q: "LTE is associated with which generation?",
    options: ["4G", "3G", "2G", "5G"],
    explain: "4G = LTE, broadband (2010s)." });
  add(L1, "Generations", 1, { type: "mcq",
    q: "Enhanced Mobile Broadband and Critical Communication are features of:",
    options: ["5G", "4G", "3G", "2G"],
    explain: "The lecture chart lists both under 5G. 5G's radio is NR (New Radio)." });
  add(L1, "Generations", 1, { type: "mcq",
    q: "GSM belongs to which generation?",
    options: ["2G", "1G", "3G", "4G"],
    explain: "GSM is a 2G digital cellular network." });
  add(L1, "Generations", 1, { type: "tf",
    q: "GSM was developed for voice and data exchange using analog modulation.",
    answer: false, explain: "False. GSM uses digital modulation." });

  // GSM
  add(L1, "GSM", 1, { type: "mcq",
    q: "A GSM Mobile Station (MS) consists of:",
    options: ["Mobile Equipment (ME) and SIM", "BTS and BSC", "MSC and HLR", "ME and BTS"],
    explain: "MS = ME + SIM." });
  add(L1, "GSM", 1, { type: "mcq",
    q: "The Mobile Equipment is uniquely identified by its:",
    options: ["IMEI", "IMSI", "PIN", "MSC number"],
    explain: "IMEI = International Mobile Equipment Identity." });
  add(L1, "GSM", 1, { type: "mcq",
    q: "The SIM card contains the:",
    options: ["IMSI (International Mobile Subscriber Identity)", "IMEI", "Encryption algorithms of the AuC", "List of all handsets"],
    explain: "The SIM holds the IMSI. IMEI identifies the device." });
  add(L1, "GSM", 1, { type: "tf",
    q: "A SIM card is protected by a password or PIN and can be moved from phone to phone.",
    answer: true, explain: "True, both are listed SIM properties." });
  add(L1, "GSM", 1, { type: "mcq",
    q: "The Base Station Subsystem (BSS) consists of:",
    options: ["BTS and BSC", "MSC and VLR", "ME and SIM", "HLR and AuC"],
    explain: "BSS = Base Transceiver Station + Base Station Controller." });
  add(L1, "GSM", 2, { type: "multi",
    q: "Which are functions of the BSS? (select all that apply)",
    options: ["Transcoding of speech channels", "Allocation of radio channels to mobile phones", "Transmission and reception over the air interface", "Billing information and collection", "Storing subscriber details of every SIM"],
    answer: [0, 1, 2],
    explain: "Billing is an MSC function; subscriber details are in the HLR." });
  add(L1, "GSM", 2, { type: "multi",
    q: "The BSC handles the allocation of (select all that apply):",
    options: ["Radio channels", "Frequency administration", "Power and signal measurements from the MS", "Handovers between BTSs it controls", "Billing of calls"],
    answer: [0, 1, 2, 3],
    explain: "The BSC manages radio resources, frequencies, measurements and inter-BTS handovers. Billing belongs to the MSC." });
  add(L1, "GSM", 1, { type: "tf",
    q: "A BSC must always be located at the same site as its BTS.",
    answer: false, explain: "False. A BSC may be collocated with a BTS or geographically separate." });
  add(L1, "GSM", 1, { type: "mcq",
    q: "Which element is called “the heart of the GSM network”?",
    options: ["MSC", "BSC", "HLR", "EIR"],
    explain: "The Mobile Switching Center is the heart of GSM." });
  add(L1, "GSM", 1, { type: "mcq",
    q: "Billing information and collection is the responsibility of the:",
    options: ["MSC", "BTS", "VLR", "SIM"],
    explain: "The MSC is responsible for billing information and collection." });
  add(L1, "GSM", 2, { type: "multi",
    q: "Mobility management performed by the MSC includes (select all that apply):",
    options: ["Registration", "Location updating", "Handover", "Transcoding of speech", "Manufacturing IMEI numbers"],
    answer: [0, 1, 2],
    explain: "MSC mobility management: registration, location updating, handover." });
  add(L1, "GSM", 1, { type: "mcq",
    q: "The MSC connects calls to and from other telephony and data systems such as the:",
    options: ["PSTN", "SIM", "Abis interface", "BBU"],
    explain: "The MSC controls calls to and from systems like the PSTN." });
  add(L1, "GSM", 1, { type: "mcq",
    q: "The central database containing details of each subscriber belonging to its MSC, and of every SIM issued by the operator, is the:",
    options: ["HLR", "VLR", "EIR", "AuC"],
    explain: "HLR = Home Location Register." });
  add(L1, "GSM", 1, { type: "mcq",
    q: "When a user visits another network, a temporary record is created in the visited system's:",
    options: ["VLR", "HLR", "EIR", "OMC"],
    explain: "The VLR is a temporary database that controls mobiles roaming in its area." });
  add(L1, "GSM", 1, { type: "mcq",
    q: "Which element contains the authentication algorithms and encryption keys and protects operators from fraud?",
    options: ["AuC", "EIR", "VLR", "BSC"],
    explain: "The Authentication Center (AuC)." });
  add(L1, "GSM", 1, { type: "mcq",
    q: "The AuC is always integrated with the:",
    options: ["HLR", "VLR", "BTS", "EIR"],
    explain: "AuC is always integrated with the HLR for authentication." });
  add(L1, "GSM", 1, { type: "mcq",
    q: "A database that keeps track of handsets and the identities of all devices registered in the network is the:",
    options: ["EIR", "HLR", "VLR", "AuC"],
    explain: "EIR = Equipment Identity Register." });
  add(L1, "GSM", 1, { type: "mcq",
    q: "The air interface between the Mobile Station and the BTS is called:",
    options: ["Um", "Abis", "A", "PSTN"],
    explain: "Um is the air interface; Abis is BTS–BSC; A is BSC–MSC." });
  add(L1, "GSM", 1, { type: "mcq",
    q: "The interface between the BTS and the BSC is:",
    options: ["Abis", "Um", "A", "N6"],
    explain: "Abis: BTS ↔ BSC." });
  add(L1, "GSM", 1, { type: "mcq",
    q: "The interface between the BSC and the MSC is:",
    options: ["A", "Abis", "Um", "X2"],
    explain: "A interface: BSC ↔ MSC." });
  add(L1, "GSM", 2, { type: "multi",
    q: "Which elements belong to the Network Switching Subsystem (NSS)? (select all that apply)",
    options: ["MSC", "HLR", "VLR", "AuC", "EIR", "BTS", "BSC"],
    answer: [0, 1, 2, 3, 4],
    explain: "NSS = MSC, HLR, VLR, AuC, EIR. BTS and BSC form the BSS." });
  add(L1, "GSM", 1, { type: "mcq",
    q: "When a subscriber leaves its current local area, which register is updated with the new information?",
    options: ["HLR", "EIR", "AuC", "BTS"],
    explain: "The HLR is updated when the subscriber leaves its local area." });
  add(L1, "GSM", 1, { type: "mcq",
    q: "In the GSM architecture figure, the OMC belongs to:",
    options: ["Network management", "The Mobile Station", "The air interface", "The SIM card"],
    explain: "The OMC (Operation and Maintenance Center) sits in the network management block." });

  /* ======================= LECTURE 2 ======================= */
  const L2 = "L2";
  add(L2, "Cellular concept", 1, { type: "mcq",
    q: "The main reason for the cellular concept is that:",
    options: ["Radio spectrum is limited, so channels must be reused", "Phones cannot transmit far", "Towers are cheap", "Interference never happens in small cells"],
    explain: "Spectrum is limited and shared; cellular reuses channels to reach high capacity." });
  add(L2, "Cellular concept", 1, { type: "tf",
    q: "A single high-power transmitter covering a whole city supports only a handful of simultaneous calls.",
    answer: true, explain: "True. Each channel can be used only once in its huge coverage area." });
  add(L2, "Cellular concept", 1, { type: "mcq",
    q: "In a cellular system, capacity is increased without extra spectrum by:",
    options: ["Adding more base stations and reducing power", "Raising the transmit power", "Using one tall tower", "Increasing the cluster size N"],
    explain: "Grow by adding cells: more BSs with lower power, so channels are reused more often." });
  add(L2, "Cellular concept", 1, { type: "tf",
    q: "In a single high-power transmitter system, capacity can be grown without more spectrum.",
    answer: false, explain: "False. Without reuse, capacity can only grow with more spectrum." });
  add(L2, "Cellular concept", 1, { type: "mcq",
    q: "Cells that are far enough apart to use the same group of channels are called:",
    options: ["Co-channel cells", "Adjacent cells", "Sector cells", "Umbrella cells"],
    explain: "Co-channel cells share the same channel group." });
  add(L2, "Cellular concept", 1, { type: "mcq",
    q: "Selecting and allocating channel groups for all base stations is called:",
    options: ["Frequency reuse (frequency planning)", "Handoff", "Borrowing", "Synchronization"],
    explain: "Frequency reuse or frequency planning." });
  add(L2, "Cell shapes", 1, { type: "mcq",
    q: "Why is the hexagon chosen as the cell model?",
    options: ["Among shapes that tile without gaps or overlap, it covers the largest area for the same R and is closest to a circle", "It is the only shape that tiles a plane", "It has the smallest area so it holds more cells", "Real cells are exactly hexagonal"],
    explain: "Triangle, square and hexagon tile the plane; the hexagon has the largest area for the same R and is closest to the omni pattern." });
  add(L2, "Cell shapes", 1, { type: "tf",
    q: "Circles are used as the cell model because they tile the area with no gaps.",
    answer: false, explain: "False. Circles leave gaps (dead zones) or overlap." });
  add(L2, "Cell shapes", 1, { type: "mcq",
    q: "In the hexagonal model, the cell radius R is the distance from the cell center to:",
    options: ["A corner (vertex)", "The middle of a side", "The nearest co-channel cell", "The MSC"],
    explain: "R = center to corner; the side length also equals R." });
  add(L2, "Cell shapes", 2, { type: "num",
    q: "The cell radius is R = 1 km. What is the distance between the centers of two adjacent hexagonal cells?",
    answer: r(sqrt(3), 3), unit: "km", tol: 0.01,
    explain: "Adjacent centers = 2 × R·cos30° = √3·R = 1.732 km." });
  add(L2, "Excitation", 1, { type: "mcq",
    q: "A center-excited cell uses:",
    options: ["A transmitter at the center with an omni-directional antenna", "Transmitters on three corners with 120° antennas", "Six transmitters at every corner", "No antenna"],
    explain: "Center-excited: BS at the center, omni antenna (360°)." });
  add(L2, "Excitation", 1, { type: "mcq",
    q: "An edge-excited cell uses:",
    options: ["Transmitters on three of the six corners with sectored directional antennas (~120° each)", "One omni antenna at the center", "Transmitters on all six corners with 60° antennas", "One antenna at the MSC"],
    explain: "Edge-excited: BS transmitters on three of the six corners, each directional antenna covers about 120°." });
  add(L2, "Excitation", 1, { type: "mcq",
    q: "An omni-directional antenna radiates:",
    options: ["Equally in all directions (360°) in the horizontal plane", "In a single 120° sector", "Only toward the MSC", "Only upward"],
    explain: "Omni = 360°, like a lamp lighting a whole room." });
  add(L2, "Excitation", 1, { type: "mcq",
    q: "Common sectoring choices for directional antennas are:",
    options: ["Three 120° sectors or six 60° sectors", "Two 180° sectors only", "Four 90° sectors only", "Twelve 30° sectors only"],
    explain: "The lecture lists three 120° sectors or six 60° sectors; each sector is a mini-cell with its own channel group." });

  // Clusters
  add(L2, "Clusters", 1, { type: "mcq",
    q: "In S = k × N, the symbol k is:",
    options: ["The number of channels per cell", "The number of clusters", "The total number of channels", "The path-loss exponent"],
    explain: "S total channels, k per cell, N cells per cluster." });
  add(L2, "Clusters", 1, { type: "mcq",
    q: "Which of these is NOT a valid cluster size for hexagonal cells?",
    options: ["8", "7", "9", "12"],
    explain: "N = i² + ij + j²: 7 (2,1), 9 (3,0), 12 (2,2). No integers give 8." });
  add(L2, "Clusters", 1, { type: "mcq",
    q: "Which of these is NOT a valid cluster size?",
    options: ["14", "13", "16", "19"],
    explain: "13 (3,1), 16 (4,0), 19 (3,2). No integers give 14." });
  add(L2, "Clusters", 2, { type: "multi",
    q: "Select all valid cluster sizes:",
    options: ["3", "4", "5", "7", "9", "10", "12", "13"], fixed: true,
    answer: [0, 1, 3, 4, 6, 7],
    explain: "Valid: 1, 3, 4, 7, 9, 12, 13, 16, 19, 21 … ; 5 and 10 cannot be written as i² + ij + j²." });
  add(L2, "Clusters", 1, { type: "num",
    q: "Find the cluster size N for i = 3, j = 2.",
    answer: 19, unit: "cells", abs: 0,
    explain: "N = 9 + 6 + 4 = 19." });
  add(L2, "Clusters", 1, { type: "num",
    q: "Find the cluster size N for i = 2, j = 2.",
    answer: 12, unit: "cells", abs: 0,
    explain: "N = 4 + 4 + 4 = 12." });
  add(L2, "Clusters", 1, { type: "num",
    q: "Find the cluster size N for i = 4, j = 0.",
    answer: 16, unit: "cells", abs: 0,
    explain: "N = 16 + 0 + 0 = 16." });
  add(L2, "Clusters", 1, { type: "num",
    q: "Find the cluster size N for i = 3, j = 3.",
    answer: 27, unit: "cells", abs: 0,
    explain: "N = 9 + 9 + 9 = 27." });
  add(L2, "Clusters", 1, { type: "mcq",
    q: "To locate the nearest co-channel cell you:",
    options: ["Move i cells, turn 60° counter-clockwise, move j cells", "Move i cells, turn 90° clockwise, move j cells", "Move N cells in a straight line", "Move j cells, turn 120°, move i cells twice"],
    explain: "Move i cells along a chain of hexagons, turn 60° CCW, move j cells." });
  add(L2, "Clusters", 1, { type: "mcq",
    q: "The values i = 2, j = 1 give:",
    options: ["N = 7", "N = 5", "N = 3", "N = 9"],
    explain: "4 + 2 + 1 = 7." });

  // Reuse distance
  add(L2, "Reuse distance", 2, { type: "num",
    q: "Find the co-channel reuse ratio Q for N = 7.",
    answer: r(sqrt(21), 2), unit: "", tol: 0.01,
    explain: "Q = √(3N) = √21 = 4.58." });
  add(L2, "Reuse distance", 2, { type: "num",
    q: "Find Q for N = 4.",
    answer: r(sqrt(12), 2), unit: "", tol: 0.01,
    explain: "Q = √12 = 3.46." });
  add(L2, "Reuse distance", 2, { type: "num",
    q: "A system uses N = 12 and R = 1 km. Find the reuse distance D.",
    answer: 6, unit: "km", tol: 0.01,
    explain: "D = √(3·12)·R = √36 × 1 = 6 km." });
  add(L2, "Reuse distance", 2, { type: "num",
    q: "A system uses N = 19 and R = 2 km. Find the reuse distance D.",
    answer: r(sqrt(57) * 2, 2), unit: "km", tol: 0.01,
    explain: "D = √57 × 2 = 7.55 × 2 = 15.10 km." });
  add(L2, "Reuse distance", 1, { type: "tf",
    q: "Increasing N increases Q = D/R, which reduces co-channel interference.",
    answer: true, explain: "True. Co-channel cells move farther apart." });
  add(L2, "Reuse distance", 1, { type: "tf",
    q: "With a fixed number of channels S, increasing N increases the number of channels per cell.",
    answer: false, explain: "False. k = S/N falls as N grows, so capacity per cell drops." });
  add(L2, "Reuse distance", 1, { type: "mcq",
    q: "Decreasing the cluster size N (with S fixed) leads to:",
    options: ["More channels per cell (higher capacity) but more co-channel interference", "Fewer channels per cell and less interference", "No change in capacity", "Lower capacity and more interference"],
    explain: "Smaller N: higher capacity, but co-channel cells are closer, so more interference." });
  add(L2, "Reuse distance", 1, { type: "mcq",
    q: "To prove Q = √(3N), the cosine law is applied with legs √3·R·i and √3·R·j and an angle between them of:",
    options: ["120°", "60°", "90°", "30°"],
    explain: "D² = (√3Ri)² + (√3Rj)² − 2(√3Ri)(√3Rj)cos120° = 3R²(i² + ij + j²)." });
  add(L2, "Reuse distance", 1, { type: "num",
    q: "How many co-channel cells are in the 2nd ring (tier) around a cell?",
    answer: 12, unit: "cells", abs: 0,
    explain: "Ring i holds 6i co-channel cells: 6 × 2 = 12." });
  add(L2, "Reuse distance", 1, { type: "num",
    q: "How many co-channel cells are in the 3rd ring around a cell?",
    answer: 18, unit: "cells", abs: 0,
    explain: "6i = 6 × 3 = 18." });
  add(L2, "Reuse distance", 1, { type: "tf",
    q: "The number of co-channel cells in the i-th ring depends on the cluster size N.",
    answer: false, explain: "False. It is always 6i, regardless of N (Sheet 1, Q5)." });

  // Capacity
  add(L2, "Capacity", 2, { type: "num",
    q: "A GSM system has 7 cells per cluster and 18 channels per cell. Find the total capacity for 3 clusters.",
    answer: 3 * 18 * 7, unit: "channels", abs: 0,
    explain: "C = M·k·N = 3 × 18 × 7 = 378 channels." });
  add(L2, "Capacity", 2, { type: "num",
    stem: "Sheet 1, Q2",
    q: "A system uses N = 4, two 35 kHz simplex channels per duplex channel, and 100 channels per cell. Find the total allocated bandwidth.",
    answer: 28, unit: "MHz", tol: 0.005,
    explain: "Duplex channel = 70 kHz. S = 100 × 4 = 400. BW = 400 × 70 kHz = 28 MHz." });
  add(L2, "Capacity", 2, { type: "num",
    stem: "Sheet 1, Q3",
    q: "40 MHz is allocated to a system using two 30 kHz simplex channels. How many duplex channels are available in total? (round down)",
    answer: Math.floor(40e6 / 60e3), unit: "channels", abs: 0,
    explain: "40 MHz / 60 kHz = 666.7 → 666 channels." });
  add(L2, "Capacity", 2, { type: "mcq",
    stem: "Sheet 1, Q3(a)",
    q: "40 MHz, two 30 kHz simplex channels (666 channels). Each cell needs at least 100 channels. Which cluster size should be used?",
    options: ["N = 4", "N = 7", "N = 6.66", "N = 9"],
    explain: "S/k = 6.66. Valid N ≤ 6.66: 1, 3, 4 → largest is 4, giving ≈ 166 per cell. N = 7 gives only ≈ 95 (< 100). 6.66 is not a valid size." });
  add(L2, "Capacity", 2, { type: "mcq",
    stem: "Sheet 1, Q3(b)",
    q: "Same system (666 channels). Each cell needs at least 125 channels. Which cluster size should be used?",
    options: ["N = 4", "N = 7", "N = 5", "N = 9"],
    explain: "S/k = 5.33. Largest valid N ≤ 5.33 is 4 → 166 channels per cell. N = 5 is not a valid size; N = 7 and 9 give too few channels per cell." });
  add(L2, "Capacity", 2, { type: "num",
    stem: "Lecture 2 example / Sheet 1",
    q: "33 MHz is allocated to an FDD system using two 25 kHz simplex channels. Find the total number of duplex channels.",
    answer: 660, unit: "channels", abs: 0,
    explain: "33 MHz / 50 kHz = 660." });
  add(L2, "Capacity", 2, { type: "num",
    stem: "33 MHz, two 25 kHz simplex channels",
    q: "Find the number of channels per cell for 4-cell reuse.",
    answer: 165, unit: "channels", abs: 0,
    explain: "660 / 4 = 165." });
  add(L2, "Capacity", 2, { type: "num",
    stem: "33 MHz, two 25 kHz simplex channels",
    q: "Find the (approximate) number of channels per cell for 7-cell reuse.",
    answer: 94, unit: "channels", abs: 1,
    explain: "660 / 7 = 94.3 ≈ 94 per cell (some cells get one or two extra so all 660 are used)." });
  add(L2, "Capacity", 2, { type: "num",
    stem: "33 MHz, two 25 kHz simplex channels, 1 MHz for control, N = 4",
    q: "How many control channels does each cell get?",
    answer: 5, unit: "channels", abs: 0,
    explain: "Control channels = 1 MHz / 50 kHz = 20 → 20 / 4 = 5 per cell." });
  add(L2, "Capacity", 2, { type: "num",
    stem: "33 MHz, two 25 kHz simplex channels, 1 MHz for control, N = 4",
    q: "How many voice channels does each cell get?",
    answer: 160, unit: "channels", abs: 0,
    explain: "Voice channels = 640 → 640 / 4 = 160 per cell (= 165 − 5)." });
  add(L2, "Capacity", 1, { type: "mcq",
    q: "In the lecture example, the operator wants 8-cell reuse. What is the right conclusion?",
    options: ["N = 8 is not a valid cluster size; use 7 or 9", "Each cell gets 660/8 = 82.5 channels", "8-cell reuse gives the best capacity", "N = 8 is valid with i = 2, j = 2"],
    explain: "No non-negative integers satisfy i² + ij + j² = 8." });
  add(L2, "Capacity", 2, { type: "num",
    q: "20 MHz is allocated to a system using two 25 kHz simplex channels and N = 4. Find the channels per cell.",
    answer: 20e6 / 50e3 / 4, unit: "channels", abs: 0,
    explain: "S = 20 MHz / 50 kHz = 400; k = 400 / 4 = 100." });
  add(L2, "Capacity", 3, { type: "num",
    q: "A system has 12.5 MHz with two 25 kHz simplex channels, N = 7, and the cluster is replicated 10 times. Find the total system capacity C.",
    answer: (12.5e6 / 50e3) * 10, unit: "channels", abs: 0,
    explain: "S = 12.5 MHz / 50 kHz = 250 channels per cluster. C = M × S = 10 × 250 = 2500." });

  /* ======================= INTERFERENCE & SIR ======================= */
  const SI = "SIR";
  add(SI, "Interference", 1, { type: "mcq",
    q: "Adjacent Channel Interference (ACI) is caused by:",
    options: ["Spectral tails of neighboring channels overlapping because filters are not perfect", "Cells using the same frequency", "Too large a cluster size", "Handoff failures"],
    explain: "ACI: a signal on a nearby frequency leaks into yours through imperfect filtering." });
  add(SI, "Interference", 2, { type: "multi",
    q: "Which methods reduce adjacent channel interference? (select all that apply)",
    options: ["Sharp filtering", "Never assigning successive channels to neighboring cells", "Raising the transmit power", "Reducing the cluster size"],
    answer: [0, 1],
    explain: "Fix 1: sharp filtering. Fix 2: spread channels apart in the assignment." });
  add(SI, "Interference", 1, { type: "mcq",
    q: "Co-Channel Interference (CCI) is caused by:",
    options: ["Frequency reuse itself", "Imperfect filters", "Simplex transmission", "Using TDD"],
    explain: "CCI is between cells using the same frequency, a direct result of reuse." });
  add(SI, "Interference", 1, { type: "tf",
    q: "Increasing the transmit power of every base station reduces co-channel interference.",
    answer: false, explain: "False. It raises interference at the other co-channel cells by the same amount." });
  add(SI, "Interference", 1, { type: "tf",
    q: "Co-channel interference can be completely removed by good planning.",
    answer: false, explain: "False. It comes from reuse, so it can only be controlled (by D/R), not removed." });
  add(SI, "Interference", 1, { type: "mcq",
    q: "Co-channel interference is controlled by:",
    options: ["Separating co-channel cells by a minimum distance D relative to R", "Sharper filters", "Higher transmit power", "Switching from FDD to TDD"],
    explain: "Keep D/R large enough, i.e. choose a large enough N." });
  add(SI, "Interference", 1, { type: "mcq",
    q: "Your receiver uses channel 5. A strong transmitter on channel 6 leaks into channel 5. This is:",
    options: ["Adjacent channel interference", "Co-channel interference", "Fading", "Handoff"],
    explain: "The interfering signal is on a neighboring frequency: ACI." });

  // Path loss
  add(SI, "Path loss", 1, { type: "mcq",
    q: "In Pr = P0 (d/d0)^−n, the symbol P0 is:",
    options: ["The reference power measured at a known close distance d0", "The transmit power at the antenna", "The minimum acceptable power", "The interference power"],
    explain: "P0 is the reference received power at the reference distance d0." });
  add(SI, "Path loss", 2, { type: "mcq",
    q: "With n = 4, if the distance doubles, the received power is divided by:",
    options: ["16", "4", "8", "2"],
    explain: "(2)^4 = 16, a drop of about 12 dB." });
  add(SI, "Path loss", 2, { type: "num",
    q: "With path-loss exponent n = 3, how many dB does the received power drop when the distance doubles?",
    answer: r(30 * log10(2), 2), unit: "dB", tol: 0.01,
    explain: "10·n·log10(2) = 30 × 0.301 = 9.03 dB." });
  add(SI, "Path loss", 2, { type: "num",
    q: "P0 = 0 dBm at d0 = 1 m and n = 2.9. Find the received power at d = 1000 m.",
    answer: -87, unit: "dBm", abs: 0.1,
    explain: "Pr = 0 − 29·log10(1000) = −87 dBm." });
  add(SI, "Path loss", 2, { type: "num",
    q: "P0 = 1 mW at d0 = 1 m and n = 3. Find the received power at d = 100 m in dBm.",
    answer: -60, unit: "dBm", abs: 0.1,
    explain: "P0 = 0 dBm. Pr = 0 − 30·log10(100) = −60 dBm." });
  add(SI, "Path loss", 1, { type: "num",
    q: "Convert a required SIR of 15 dB to a linear ratio.",
    answer: r(lin(15), 2), unit: "", tol: 0.01,
    explain: "10^(15/10) = 10^1.5 = 31.62." });
  add(SI, "Path loss", 1, { type: "num",
    q: "Convert the linear SIR 73.5 to dB.",
    answer: r(dB(73.5), 2), unit: "dB", abs: 0.05,
    explain: "10·log10(73.5) = 18.66 dB." });
  add(SI, "Path loss", 1, { type: "num",
    q: "Express a 5 W carrier power in dBm.",
    answer: r(dB(5000), 2), unit: "dBm", abs: 0.05,
    explain: "5 W = 5000 mW → 10·log10(5000) = 36.99 dBm." });
  add(SI, "Path loss", 1, { type: "mcq",
    q: "−100 dBm equals:",
    options: ["10⁻¹⁰ mW", "10⁻¹⁰ W", "−100 mW", "10⁻¹⁰⁰ mW"],
    explain: "P(mW) = 10^(−100/10) = 10⁻¹⁰ mW." });

  // SIR formula
  add(SI, "SIR formula", 1, { type: "mcq",
    q: "In the first-tier approximation, how many co-channel interfering cells (i0) are assumed?",
    options: ["6", "7", "12", "3"],
    explain: "Six nearest co-channel cells in the first tier." });
  add(SI, "SIR formula", 1, { type: "mcq",
    q: "Which expression is equivalent to SIR = (√(3N))ⁿ / 6?",
    options: ["(3N)^(n/2) / 6", "(3N)ⁿ / 6", "(3N)^(2/n) / 6", "6(3N)^(n/2)"],
    explain: "(√(3N))ⁿ = (3N)^(n/2)." });
  add(SI, "SIR formula", 1, { type: "mcq",
    q: "Solving SIR = (3N)^(n/2) / 6 for N gives:",
    options: ["N = (6·SIR)^(2/n) / 3", "N = (6·SIR)^(n/2) / 3", "N = 3(6·SIR)^(2/n)", "N = (SIR/6)^(2/n) / 3"],
    explain: "6·SIR = (3N)^(n/2) → (6·SIR)^(2/n) = 3N → N = (6·SIR)^(2/n)/3." });
  add(SI, "SIR formula", 1, { type: "tf",
    q: "In N = (6·SIR)^(2/n) / 3, SIR may be entered directly in dB.",
    answer: false, explain: "False. SIR must be a linear ratio. Convert with 10^(dB/10) first." });
  add(SI, "SIR formula", 2, { type: "mcq",
    q: "The simplified formula SIR = (D/R)ⁿ / i0 assumes that:",
    options: ["All interferers are at about the same distance D and share the same P0 and n", "There is only one interferer", "The mobile is at the base station", "n = 2 everywhere"],
    explain: "Equal distances D₁ = … = D_i0 = D, and common P0, d0, n that cancel." });
  add(SI, "SIR formula", 1, { type: "mcq",
    q: "In SIR = S / ΣIᵢ, the wanted signal S comes from distance ___ and each interferer from distance ___.",
    options: ["R (serving BS); Dᵢ (interfering BS i)", "D; R", "d0; d", "N; i0"],
    explain: "S ∝ R⁻ⁿ and Iᵢ ∝ Dᵢ⁻ⁿ." });
  add(SI, "SIR formula", 2, { type: "num",
    q: "Find the SIR in dB for N = 7 and n = 4 (six first-tier interferers).",
    answer: r(dB(sir1(7, 4)), 2), unit: "dB", abs: 0.06,
    explain: "Q = √21 = 4.583. SIR = 4.583⁴ / 6 = 73.5 → 18.66 dB." });
  add(SI, "SIR formula", 2, { type: "num",
    q: "Find the SIR in dB for N = 7 and n = 3.",
    answer: r(dB(sir1(7, 3)), 2), unit: "dB", abs: 0.06,
    explain: "4.583³ / 6 = 16.04 → 12.05 dB." });
  add(SI, "SIR formula", 2, { type: "num",
    q: "Find the SIR in dB for N = 12 and n = 3.",
    answer: r(dB(sir1(12, 3)), 2), unit: "dB", abs: 0.06,
    explain: "Q = 6. 6³ / 6 = 36 → 15.56 dB." });
  add(SI, "SIR formula", 2, { type: "num",
    q: "Find the SIR in dB for N = 4 and n = 4.",
    answer: r(dB(sir1(4, 4)), 2), unit: "dB", abs: 0.06,
    explain: "Q = √12; Q⁴ = 144; 144 / 6 = 24 → 13.80 dB." });
  add(SI, "SIR formula", 2, { type: "num",
    q: "Find the SIR in dB for N = 3 and n = 4.",
    answer: r(dB(sir1(3, 4)), 2), unit: "dB", abs: 0.06,
    explain: "Q = 3; 3⁴ = 81; 81 / 6 = 13.5 → 11.30 dB." });
  add(SI, "SIR formula", 2, { type: "num",
    q: "AMPS uses FM with 30 kHz channels, a 7-cell cluster, up to 6 interferers, and the fourth-power law. Find the approximate SIR (linear).",
    answer: r(sir1(7, 4), 1), unit: "", tol: 0.01,
    explain: "(√21)⁴ / 6 = 441 / 6 = 73.5 (18.66 dB)." });

  // Cluster design from SIR
  add(SI, "Cluster design", 2, { type: "num",
    stem: "Required SIR = 15 dB, n = 4, six first-tier interferers",
    q: "Compute the minimum (unrounded) cluster size from N = (6·SIR)^(2/n) / 3.",
    answer: r(nmin(15, 4), 2), unit: "", abs: 0.03,
    explain: "15 dB = 31.62 → (6 × 31.62)^0.5 / 3 = 13.77 / 3 = 4.59." });
  add(SI, "Cluster design", 2, { type: "mcq",
    stem: "Required SIR = 15 dB, n = 4",
    q: "Which cluster size gives maximum capacity while meeting the requirement?",
    options: ["N = 7", "N = 4", "N = 4.59", "N = 12"],
    explain: "N ≥ 4.59 and must be valid → 7. SIR = 18.66 dB ≥ 15 dB." });
  add(SI, "Cluster design", 2, { type: "num",
    stem: "Required SIR = 15 dB, n = 3",
    q: "Compute the minimum (unrounded) cluster size.",
    answer: r(nmin(15, 3), 2), unit: "", abs: 0.05,
    explain: "(6 × 31.62)^(2/3) / 3 = 33.02 / 3 = 11.0." });
  add(SI, "Cluster design", 2, { type: "mcq",
    stem: "Required SIR = 15 dB, n = 3",
    q: "Which cluster size should be used?",
    options: ["N = 12", "N = 7", "N = 11", "N = 9"],
    explain: "N ≥ 11.0 → next valid is 12 (11 is not valid). SIR = 36 = 15.56 dB. N = 7 gives only 12.05 dB." });
  add(SI, "Cluster design", 2, { type: "num",
    stem: "Sheet 2, Q1",
    q: "For 15 dB and n = 3, what is the frequency reuse factor Q of the chosen cluster?",
    answer: 6, unit: "", tol: 0.005,
    explain: "N = 12 → Q = √36 = 6." });
  add(SI, "Cluster design", 2, { type: "mcq",
    stem: "Sheet 2, Q4: C/I must exceed 18 dB",
    q: "Which cluster size do you suggest if the propagation constant is n = 4?",
    options: ["N = 7", "N = 4", "N = 9", "N = 12"],
    explain: "18 dB = 63.1 → N ≥ (378.6)^0.5 / 3 = 6.49 → N = 7, SIR = 18.66 dB." });
  add(SI, "Cluster design", 3, { type: "mcq",
    stem: "Sheet 2, Q4: C/I must exceed 18 dB",
    q: "Which cluster size do you suggest if the propagation constant is n = 3?",
    options: ["N = 19", "N = 16", "N = 13", "N = 12"],
    explain: "N ≥ (378.6)^(2/3) / 3 = 17.44. Valid sizes: 13, 16 are too small → 19. SIR = 57^1.5 / 6 = 71.72 = 18.56 dB." });
  add(SI, "Cluster design", 2, { type: "num",
    q: "For N = 19 and n = 3, find the SIR in dB.",
    answer: r(dB(sir1(19, 3)), 2), unit: "dB", abs: 0.06,
    explain: "(√57)³ / 6 = 430.3 / 6 = 71.72 → 18.56 dB." });
  add(SI, "Cluster design", 1, { type: "tf",
    q: "When the path-loss exponent n decreases, a larger cluster size is needed to keep the same SIR.",
    answer: true, explain: "True. Power falls off more slowly, interferers arrive stronger, so co-channel cells must be farther apart." });
  add(SI, "Cluster design", 1, { type: "mcq",
    q: "The design rule for choosing N is:",
    options: ["The smallest valid N that still meets the required SIR", "The largest N possible", "Always N = 7", "Any N that gives integer channels per cell"],
    explain: "Bigger N improves SIR but lowers capacity, so take the smallest one that works." });
  add(SI, "Cluster design", 3, { type: "num",
    q: "A system needs SIR ≥ 12 dB with n = 4. Compute the minimum (unrounded) cluster size.",
    answer: r(nmin(12, 4), 2), unit: "", abs: 0.03,
    explain: "12 dB = 15.85 → (6 × 15.85)^0.5 / 3 = 9.75 / 3 = 3.25 → use N = 4 (SIR = 13.80 dB)." });

  // Sheet 2 Q2 & Q3
  add(SI, "Sheet problems", 3, { type: "num",
    stem: "Sheet 2, Q2",
    q: "A receiver detects 1 mW at d0 = 1 m. Co-channel signals must be below −100 dBm, n = 3, and 7-cell reuse is used. Find the minimum cell radius R.",
    answer: r(Math.pow(10, 10 / 3) / sqrt(21), 0), unit: "m", tol: 0.01,
    explain: "1 mW·(√21·R)⁻³ < 10⁻¹⁰ mW → √21·R > 10^(10/3) = 2154.4 m → R > 470 m." });
  add(SI, "Sheet problems", 2, { type: "num",
    stem: "Sheet 2, Q3: hexagonal cells, N = 7, propagation constant 3.2",
    q: "Calculate the carrier-to-interference ratio in dB.",
    answer: r(dB(sir1(7, 3.2)), 2), unit: "dB", abs: 0.06,
    explain: "(√21)^3.2 / 6 = 21.75 → 13.37 dB." });
  add(SI, "Sheet problems", 2, { type: "num",
    stem: "Sheet 2, Q3: N = 7, n = 3.2",
    q: "The carrier power is 5 W. Find the interference power.",
    answer: r(5 / sir1(7, 3.2), 3), unit: "W", tol: 0.02,
    explain: "I = S / SIR = 5 / 21.75 = 0.23 W." });
  add(SI, "Sheet problems", 2, { type: "num",
    stem: "Sheet 2, Q3(c): n = 3.2",
    q: "Repeat for N = 12: find C/I in dB.",
    answer: r(dB(sir1(12, 3.2)), 2), unit: "dB", abs: 0.06,
    explain: "6^3.2 / 6 = 51.5 → 17.12 dB." });
  add(SI, "Sheet problems", 2, { type: "num",
    stem: "Sheet 2, Q3(c): n = 3.2, carrier 5 W",
    q: "Repeat for N = 3: find the interference power.",
    answer: r(5 / sir1(3, 3.2), 3), unit: "W", tol: 0.02,
    explain: "SIR = 3^3.2 / 6 = 5.61 → I = 5 / 5.61 = 0.89 W." });
  add(SI, "Sheet problems", 1, { type: "mcq",
    q: "At a fixed path-loss exponent, increasing N causes:",
    options: ["Larger reuse distance, higher SIR, lower interference power", "Smaller reuse distance, lower SIR", "No change in SIR", "Higher interference power"],
    explain: "Sheet 2, Q3: ↑N → ↑D → ↑SIR → ↓I." });

  // Beyond first tier
  add(SI, "Two tiers", 2, { type: "mcq",
    q: "The second ring of co-channel cells holds 12 cells. At what distances are they?",
    options: ["6 at √3·D and 6 at 2D", "All 12 at 2D", "All 12 at √3·D", "6 at D and 6 at 2D"],
    explain: "In the hexagonal pattern of co-channel cells, ring 2 has 6 cells at √3·D and 6 at 2D." });
  add(SI, "Two tiers", 3, { type: "num",
    q: "Including both the first ring (6 at D) and the second ring (6 at √3·D, 6 at 2D), find the SIR in dB for N = 7, n = 4.",
    answer: r(dB(Math.pow(sqrt(21), 4) / (6 + 6 * Math.pow(sqrt(3), -4) + 6 * Math.pow(2, -4))), 2), unit: "dB", abs: 0.06,
    explain: "Q⁴ = 441. Denominator 6(1 + 1/9 + 1/16) = 7.042. SIR = 441 / 7.042 = 62.6 → 17.97 dB (about 0.7 dB below the first-tier value)." });
  add(SI, "Two tiers", 3, { type: "num",
    q: "Worst case (Sheet 2 figure): two interferers at D − R, two at D, two at D + R. Find the SIR in dB for N = 7, n = 4.",
    answer: r(dB(1 / (2 * Math.pow(sqrt(21) - 1, -4) + 2 * Math.pow(sqrt(21), -4) + 2 * Math.pow(sqrt(21) + 1, -4))), 2), unit: "dB", abs: 0.08,
    explain: "Q = 4.583. SIR = 1 / [2(3.583)⁻⁴ + 2(4.583)⁻⁴ + 2(5.583)⁻⁴] = 53.4 → 17.27 dB." });

  /* ======================= LECTURE 3 ======================= */
  const L3 = "L3";
  add(L3, "Channel assignment", 1, { type: "mcq",
    q: "In fixed channel assignment:",
    options: ["Each cell gets a predetermined set of channels permanently", "The MSC assigns a channel per call from a pool", "Channels are shared by all cells at all times", "No channel is ever reused"],
    explain: "Fixed: permanent, predetermined groups. Dynamic: MSC assigns per call." });
  add(L3, "Channel assignment", 1, { type: "mcq",
    q: "In dynamic channel assignment:",
    options: ["Channels are kept in a pool and the MSC assigns one each time a call is requested", "Each cell owns a fixed group forever", "The phone chooses any channel it likes", "The BTS borrows from the HLR"],
    explain: "Channels belong to the system, not to a cell." });
  add(L3, "Channel assignment", 1, { type: "mcq",
    q: "Fixed assignment: a call arrives and all channels in the cell are busy. Without borrowing, the call is:",
    options: ["Blocked", "Handed off", "Queued in the HLR", "Served on a co-channel cell automatically"],
    explain: "No free channel → blocked. Borrowing exists to relieve this." });
  add(L3, "Channel assignment", 1, { type: "mcq",
    q: "In the borrowing strategy, the channel is borrowed from:",
    options: ["A neighboring (donor) cell that has spare capacity", "A co-channel cell in another cluster", "The MSC's private band", "The VLR"],
    explain: "Trigger: all channels busy → borrow from a neighboring donor cell → supervised by the MSC." });
  add(L3, "Channel assignment", 1, { type: "mcq",
    q: "Who supervises borrowing so that no call in the donor cell suffers interference?",
    options: ["The MSC", "The mobile station", "The EIR", "The donor's SIM"],
    explain: "The MSC monitors the borrowing process." });
  add(L3, "Channel assignment", 2, { type: "multi",
    q: "Strengths of fixed channel assignment (select all that apply):",
    options: ["Simple to plan, install and operate", "Low computational load", "Interference planned in advance through D", "Predictable capacity in every cell", "Automatically adapts to hot spots"],
    answer: [0, 1, 2, 3],
    explain: "Adapting to hot spots is a strength of dynamic assignment." });
  add(L3, "Channel assignment", 2, { type: "multi",
    q: "Strengths of dynamic channel assignment (select all that apply):",
    options: ["Lower blocking probability", "Higher capacity", "Adapts to changing traffic", "More channel choice for incoming handoffs", "Lowest computational load"],
    answer: [0, 1, 2, 3],
    explain: "Dynamic needs more storage and computation, not less." });
  add(L3, "Channel assignment", 2, { type: "multi",
    q: "Costs (limitations) of dynamic channel assignment (select all that apply):",
    options: ["Needs real-time knowledge of channel use and traffic", "Higher storage and computational load", "Interference check for every allocation", "More complex to design and maintain", "Busy cells block calls while neighbors are idle"],
    answer: [0, 1, 2, 3],
    explain: "Blocking while neighbors sit idle is the classic limitation of fixed assignment." });
  add(L3, "Channel assignment", 1, { type: "mcq",
    q: "In dynamic assignment, the MSC searches for a channel that is not in use in this cell or:",
    options: ["In any cell within the minimum reuse distance", "In the HLR", "In any cell of the whole network", "In the adjacent channel"],
    explain: "It must not cause co-channel interference with cells closer than the reuse distance." });
  add(L3, "Channel assignment", 2, { type: "multi",
    q: "Typical criteria for selecting a channel in dynamic assignment (select all that apply):",
    options: ["Co-channel interference limit (reuse distance)", "Likelihood of future blocking in the cell", "Cost of using the channel", "The subscriber's IMEI"],
    answer: [0, 1, 2],
    explain: "From the lecture: CCI limit, future blocking likelihood, and cost." });
  add(L3, "Channel assignment", 1, { type: "tf",
    q: "In dynamic assignment, when a call ends the channel stays with that cell permanently.",
    answer: false, explain: "False. The channel returns to the pool and any cell can use it." });
  add(L3, "Channel assignment", 1, { type: "mcq",
    q: "Which strategy needs a new frequency plan when the traffic pattern changes?",
    options: ["Fixed assignment", "Dynamic assignment", "Both", "Neither"],
    explain: "A limitation of fixed assignment." });
  add(L3, "Channel assignment", 2, { type: "num",
    stem: "Lecture 3 review, Q1",
    q: "A system has S = 84 channels and N = 7. How many channels does each cell get under fixed assignment?",
    answer: 12, unit: "channels", abs: 0,
    explain: "K = S/N = 84/7 = 12." });
  add(L3, "Channel assignment", 2, { type: "num",
    stem: "Lecture 3 review, Q2",
    q: "The cluster (S = 84, N = 7) is replicated M = 5 times. Find the total capacity C.",
    answer: 420, unit: "channels", abs: 0,
    explain: "C = M × S = 5 × 84 = 420." });
  add(L3, "Channel assignment", 2, { type: "num",
    q: "Fixed assignment with S = 70, N = 7 and M = 4 clusters. Find the system capacity.",
    answer: 280, unit: "channels", abs: 0,
    explain: "K = 10; C = M × S = 4 × 70 = 280." });

  // Handoff
  add(L3, "Handoff", 1, { type: "mcq",
    q: "A handoff occurs when:",
    options: ["A mobile moves into a different cell while a call is in progress", "A phone is switched on", "A SIM moves to another phone", "A cell borrows a channel"],
    explain: "Handoff = cell change during an ongoing call." });
  add(L3, "Handoff", 1, { type: "mcq",
    q: "Who transfers the call to a new channel belonging to the new base station?",
    options: ["The MSC", "The mobile", "The EIR", "The AuC"],
    explain: "The MSC transfers the call." });
  add(L3, "Handoff", 1, { type: "mcq",
    q: "The handoff threshold is:",
    options: ["A signal level stronger than the minimum acceptable signal, at which the handoff is made", "The lowest usable signal for voice quality", "The time to complete a handoff", "The distance between two BSs"],
    explain: "Threshold > minimum. The gap is the margin Δ." });
  add(L3, "Handoff", 1, { type: "mcq",
    q: "The margin Δ is defined as:",
    options: ["Handoff threshold − minimum acceptable signal", "Minimum acceptable signal − handoff threshold", "Handoff threshold × time to complete handoff", "Transmit power − received power"],
    explain: "Δ = P(r,HO) − P(r,min)." });
  add(L3, "Handoff", 1, { type: "mcq",
    q: "If Δ is too small:",
    options: ["There may not be enough time to complete the handoff, so calls drop", "Unnecessary handoffs burden the MSC", "Capacity doubles", "Nothing changes"],
    explain: "Too small → dropped calls. Too large → unnecessary handoffs and MSC load." });
  add(L3, "Handoff", 1, { type: "mcq",
    q: "If Δ is too large:",
    options: ["Handoffs start too early and unnecessary ones burden the MSC", "Calls drop for lack of time", "The signal never reaches the threshold", "Co-channel interference disappears"],
    explain: "Too large → extra load on the MSC." });
  add(L3, "Handoff", 1, { type: "mcq",
    q: "Why does the BS monitor signal strength for a period before starting a handoff?",
    options: ["To make sure the drop is not caused by momentary fading", "To save battery", "To wait for the HLR update", "To borrow a channel first"],
    explain: "A momentary fade should not trigger an unnecessary handoff." });
  add(L3, "Handoff", 1, { type: "mcq",
    q: "Dwell time is:",
    options: ["The time a call can stay in a cell without a handoff", "The time to complete a handoff", "The time to synchronize with a cell", "The call duration"],
    explain: "Dwell time depends on user speed, so it is a random variable." });
  add(L3, "Handoff", 2, { type: "multi",
    q: "Dwell time is governed by (select all that apply):",
    options: ["Propagation", "Interference", "Distance between the subscriber and the BS", "The IMSI of the subscriber"],
    answer: [0, 1, 2],
    explain: "From the lecture: propagation, interference and subscriber–BS distance; and it depends on speed." });
  add(L3, "Handoff", 1, { type: "tf",
    q: "Dwell time is a fixed constant for every user in a cell.",
    answer: false, explain: "False. It depends on the user's speed, so it is a random variable." });
  add(L3, "Handoff types", 1, { type: "mcq",
    q: "A handoff between two BTSs controlled by the same BSC is:",
    options: ["Inter-BTS / intra-BSC, coordinated by the BSC", "Inter-BSC / intra-MSC, coordinated by the MSC", "Inter-MSC, coordinated by both MSCs", "Soft handoff by definition"],
    explain: "Level that changes: BTS. Coordinator: the BSC." });
  add(L3, "Handoff types", 1, { type: "mcq",
    q: "A handoff between cells whose BTSs are under different BSCs connected to the same MSC is coordinated by:",
    options: ["The MSC", "The old BSC", "Both MSCs", "The mobile"],
    explain: "Inter-BSC / intra-MSC: the MSC coordinates." });
  add(L3, "Handoff types", 1, { type: "mcq",
    q: "An inter-MSC handoff is coordinated by:",
    options: ["Both MSCs", "The BSC only", "The BTS only", "The HLR"],
    explain: "Different MSCs → both MSCs coordinate." });
  add(L3, "Handoff types", 2, { type: "mcq",
    stem: "Lecture 3 review, Q6",
    q: "A mobile moves between cells served by different BSCs on the same MSC, and the old link is released before the new one is set up. Which handoff is this?",
    options: ["Inter-BSC (intra-MSC), hard handoff", "Intra-BSC, soft handoff", "Inter-MSC, hard handoff", "Inter-BSC, soft handoff"],
    explain: "Different BSCs, same MSC → inter-BSC/intra-MSC. Break before make → hard." });
  add(L3, "Handoff types", 1, { type: "mcq",
    q: "Hard handoff follows the policy:",
    options: ["Break before make", "Make before break", "Make and never break", "Break and never make"],
    explain: "Hard: the old link is released before the new one is set up." });
  add(L3, "Handoff types", 1, { type: "mcq",
    q: "In soft handoff, the mobile:",
    options: ["Connects to multiple BSs simultaneously (make before break)", "Is connected to one BS at a time", "Drops the call briefly", "Changes frequency band only"],
    explain: "Soft: at least one link is kept while links are added and removed." });
  add(L3, "Handoff types", 1, { type: "tf",
    q: "In a soft handoff, an actual break occurs while switching cells.",
    answer: false, explain: "False. No break occurs; that is the point of make-before-break." });
  add(L3, "Handoff types", 1, { type: "mcq",
    q: "According to the lecture, hard handoff is generally used for:",
    options: ["Inter-frequency handoffs", "Co-located sites", "Simplex systems", "Borrowed channels"],
    explain: "Hard: generally inter-frequency. Soft: generally co-located sites." });

  // Sheet 2 Q5
  add(L3, "Handoff margin", 2, { type: "num",
    stem: "Sheet 2, Q5: v = 20 m/s, Δt = 4.5 s",
    q: "How far does the mobile travel while the handoff is being completed?",
    answer: 90, unit: "m", abs: 0,
    explain: "d = v·Δt = 20 × 4.5 = 90 m." });
  add(L3, "Handoff margin", 3, { type: "num",
    stem: "Sheet 2, Q5: P0 = 0 dBm, d0 = 1 m, n = 2.9, P(r,min) = −88 dBm",
    q: "At what distance from BS1 does its received power fall to the minimum −88 dBm?",
    answer: r(Math.pow(10, 88 / 29), 1), unit: "m", tol: 0.01,
    explain: "−88 = −29·log10(d) → d = 10^(88/29) ≈ 1082.6 m." });
  add(L3, "Handoff margin", 3, { type: "num",
    stem: "Sheet 2, Q5: v = 20 m/s, D = 2000 m, P0 = 0 dBm, d0 = 1 m, n = 2.9, P(r,min) = −88 dBm, Δt = 4.5 s",
    q: "Determine the minimum required margin Δ = P(r,HO) − P(r,min) so calls are not lost during handoff.",
    answer: r(29 * log10(Math.pow(10, 88 / 29) / (Math.pow(10, 88 / 29) - 90)), 2), unit: "dB", abs: 0.11,
    explain: "d_min = 1082.6 m; handoff must start at 992.6 m where Pr = −86.9 dBm. Δ = 29·log10(1082.6/992.6) ≈ 1.09 dB (≈ 1 dB in the model answer)." });
  add(L3, "Handoff margin", 1, { type: "mcq",
    q: "The handoff margin Δ is the difference of two dBm levels. Its unit is:",
    options: ["dB", "dBm", "mW", "m/s"],
    explain: "dBm − dBm = dB (a ratio)." });
  add(L3, "Handoff margin", 2, { type: "num",
    q: "A mobile moves at 25 m/s and a handoff takes 4 s. How far does it move during the handoff?",
    answer: 100, unit: "m", abs: 0,
    explain: "d = 25 × 4 = 100 m." });

  window.QUESTION_BANK = bank;
  window.QMATH = { dB, lin, sir1, nmin, r };
})();
