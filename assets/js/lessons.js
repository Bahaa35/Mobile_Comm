/* =========================================================
   Study content. Every lesson is built only from the course
   lectures (Lec 1, Lec 2, SIR notes, Lec 3) and Sheets 1–2.
   ========================================================= */
window.LESSONS = [

/* ---------------------------------------------------------- */
{
  id: "basics",
  lec: "L1",
  title: "How a mobile network talks",
  subtitle: "Base stations, phones, radio waves and the six steps of a connection",
  minutes: 12,
  sections: [
    {
      h: "The big picture",
      html: `
<p>A mobile network has two sides. On one side is your phone, called the <b>UE</b> (User Equipment) or <b>MS</b> (Mobile Station). On the other side is a <b>base station</b>: a fixed radio station on a tower. In 4G the base station is called an <b>eNB</b> (eNodeB). In 5G it is a <b>gNB</b> (gNodeB). In GSM (2G) it is a <b>BTS</b>.</p>
<figure class="diagram">
<svg viewBox="0 0 520 170" role="img" aria-label="Downlink goes from base station to phone, uplink from phone to base station">
  <g class="d-stroke" stroke-width="2" fill="none">
    <path d="M70 140 L90 40 L110 140 M78 100 H102 M82 80 H98 M86 60 H94"/>
    <rect x="410" y="80" width="34" height="58" rx="7"/>
    <line x1="420" y1="128" x2="434" y2="128"/>
  </g>
  <path d="M135 62 L395 92" class="d-accent" stroke-width="3" marker-end="url(#arA)"/>
  <path d="M395 118 L135 88" class="d-red" stroke-width="3" marker-end="url(#arR)"/>
  <defs>
    <marker id="arA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="d-accent-fill"/></marker>
    <marker id="arR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="d-red-fill"/></marker>
  </defs>
  <text x="255" y="62" class="d-text d-accent-text" text-anchor="middle">Downlink (BS → UE)</text>
  <text x="255" y="128" class="d-text d-red-text" text-anchor="middle">Uplink (UE → BS)</text>
  <text x="90" y="162" class="d-text" text-anchor="middle">Base station (eNB)</text>
  <text x="427" y="162" class="d-text" text-anchor="middle">UE (phone)</text>
</svg>
</figure>
<ul>
  <li><b>Uplink (UL)</b>: from the phone to the base station.</li>
  <li><b>Downlink (DL)</b>: from the base station to the phone.</li>
  <li><b>Control signaling</b> keeps flowing during a call. It handles resource allocation, connection management, mobility, handover and other network functions.</li>
</ul>`
    },
    {
      h: "Inside a base station",
      html: `
<p>A base station has five basic parts. Follow a signal from the antenna inward:</p>
<div class="table-wrap"><table>
<thead><tr><th>Part</th><th>What it does</th></tr></thead>
<tbody>
<tr><td><b>Antenna</b></td><td>Sends and receives radio signals to and from the UEs. Converts electrical signals ↔ electromagnetic waves.</td></tr>
<tr><td><b>Radio Unit</b> (RU / RRH)</td><td>Handles the <b>radio-frequency (RF)</b> part. Converts digital signals to radio signals for transmission, and received radio signals back to digital.</td></tr>
<tr><td><b>Baseband Unit</b> (BBU)</td><td>Processes the digital signals: modulation/demodulation, coding, scheduling, resource allocation.</td></tr>
<tr><td><b>Backhaul</b></td><td>Connects the base station to the <b>core network</b>, usually by fiber, microwave or another high-capacity link.</td></tr>
<tr><td><b>Power supply</b></td><td>Powers all the other components.</td></tr>
</tbody></table></div>
<div class="callout"><b>Digital vs RF.</b> A <b>digital signal</b> is a stream of numbers (0s and 1s or quantized samples) that processors can work on. The <b>RF signal</b> is an <b>analog, high-frequency electrical waveform</b>. The radio unit sits between the two.</div>
<p>From the lecture's definitions:</p>
<ul>
<li><b>Base Station (BS)</b>: a <b>fixed</b> station used for radio communication with mobile stations. It has radio channels and transmitter/receiver antennas on a tower. Base stations sit at the <b>edge or at the center</b> of the coverage region.</li>
<li><b>Mobile Station (MS)</b>: a station intended for use <b>while in motion</b>. It can be hand-held or installed in a vehicle.</li>
</ul>`
    },
    {
      h: "Radio waves and frequency",
      html: `
<p>An <b>electromagnetic (EM) wave</b> is made of changing electric (E) and magnetic (B) fields that travel together. The two fields are <b>perpendicular to each other and to the direction of travel</b>. They have the same frequency and wavelength and travel at the speed of light, <span class="m">c ≈ 3 × 10<sup>8</sup> m/s</span>.</p>
<ul>
<li>An EM wave carries <b>energy</b>.</li>
<li>A <b>modulated</b> EM wave carries <b>energy + information</b>.</li>
<li>The <b>antenna</b> is the interface between the electrical signal and the EM wave.</li>
</ul>
<p><b>Frequency</b> is how many times the wave repeats (oscillates) per second, measured in hertz (Hz).</p>
<div class="chips-row"><span class="pill">1 Hz = 1 oscillation/s</span><span class="pill">1 MHz = 10<sup>6</sup>/s</span><span class="pill">1 GHz = 10<sup>9</sup>/s</span></div>
<div class="formula">λ = c / f</div>
<div class="example">
<div class="example-h">Worked example: 5G at 3.5 GHz</div>
<p>λ = (3 × 10<sup>8</sup>) / (3.5 × 10<sup>9</sup>) = 0.0857 m ≈ <b>8.6 cm</b>. The field oscillates 3.5 billion times every second.</p>
</div>
<p>A system is assigned a <b>range</b> of frequencies, and one such range is called a <b>frequency channel</b>. For example: channel 1 = 900–905 MHz, channel 2 = 905–910 MHz.</p>`
    },
    {
      h: "The six steps of a UE–BTS connection",
      html: `
<ol class="steps">
<li><b>Network discovery.</b> The UE listens to signals transmitted by base stations to find an available network.</li>
<li><b>Synchronization.</b> The UE locks onto the chosen cell and reads basic information about the cell and its radio configuration.</li>
<li><b>Connection request.</b> The UE sends a <b>control signal</b> on the <b>uplink</b> asking for access (to make a call or send data).</li>
<li><b>Network response.</b> The network sends <b>control information</b> on the <b>downlink</b> telling the UE how and when it can communicate.</li>
<li><b>Radio resource allocation.</b> The network assigns time/frequency resources to the UE.</li>
<li><b>Data transmission.</b> User data flows: voice, messages, Internet data. UL = UE → BTS, DL = BTS → UE.</li>
</ol>
<div class="tip"><b>Exam tip.</b> Requests go <b>up</b> (uplink), responses come <b>down</b> (downlink). The order is: Discovery → Sync → Request → Response → Allocation → Data.</div>`
    }
  ],
  keyPoints: [
    "Uplink = UE → BS. Downlink = BS → UE.",
    "Antenna: electrical ↔ EM wave. RU: digital ↔ RF. BBU: digital processing. Backhaul: BS ↔ core.",
    "λ = c / f. 3.5 GHz gives about 8.6 cm.",
    "Modulated EM wave = energy + information.",
    "Six steps: discovery, synchronization, request (UL), response (DL), allocation, data."
  ]
},

/* ---------------------------------------------------------- */
{
  id: "modes",
  lec: "L1",
  title: "Transmission modes and generations",
  subtitle: "Simplex, half duplex, full duplex, FDD vs TDD, and 1G to 5G",
  minutes: 8,
  sections: [
    {
      h: "Three transmission modes",
      html: `
<div class="table-wrap"><table>
<thead><tr><th>Mode</th><th>Direction</th><th>Channels</th><th>Examples</th></tr></thead>
<tbody>
<tr><td><b>Simplex</b></td><td>One way only</td><td>1</td><td>Radio and TV broadcasting, computer → printer</td></tr>
<tr><td><b>Half duplex</b></td><td>Both ways, <b>one at a time</b></td><td>1 (bandwidth efficient)</td><td>Push-to-talk, release-to-listen (walkie-talkie)</td></tr>
<tr><td><b>Full duplex</b></td><td>Both ways <b>at the same time</b></td><td>2</td><td>Land-mobile telephone system</td></tr>
</tbody></table></div>`
    },
    {
      h: "FDD vs TDD: two ways to do full duplex",
      html: `
<p>Full duplex keeps the link in both directions either in the <b>frequency domain</b> or in the <b>time domain</b>:</p>
<figure class="diagram">
<svg viewBox="0 0 520 190" role="img" aria-label="FDD uses two frequency bands at all times; TDD alternates uplink and downlink slots on one band">
  <text x="20" y="22" class="d-text d-bold">FDD</text>
  <rect x="60" y="34" width="190" height="22" rx="5" class="d-accent-fill" opacity=".85"/>
  <rect x="60" y="66" width="190" height="22" rx="5" class="d-orange-fill" opacity=".85"/>
  <text x="155" y="50" class="d-text d-on" text-anchor="middle">Downlink, f1</text>
  <text x="155" y="82" class="d-text d-on" text-anchor="middle">Uplink, f2</text>
  <line x1="60" y1="104" x2="255" y2="104" class="d-stroke" stroke-width="1.5" marker-end="url(#arG)"/>
  <text x="155" y="122" class="d-text d-muted" text-anchor="middle">time →</text>
  <text x="285" y="22" class="d-text d-bold">TDD</text>
  <g>
    <rect x="320" y="50" width="34" height="22" rx="5" class="d-accent-fill" opacity=".85"/>
    <rect x="356" y="50" width="34" height="22" rx="5" class="d-orange-fill" opacity=".85"/>
    <rect x="392" y="50" width="34" height="22" rx="5" class="d-accent-fill" opacity=".85"/>
    <rect x="428" y="50" width="34" height="22" rx="5" class="d-orange-fill" opacity=".85"/>
    <rect x="464" y="50" width="34" height="22" rx="5" class="d-accent-fill" opacity=".85"/>
  </g>
  <text x="409" y="40" class="d-text d-muted" text-anchor="middle">one frequency f</text>
  <line x1="320" y1="104" x2="505" y2="104" class="d-stroke" stroke-width="1.5" marker-end="url(#arG)"/>
  <text x="409" y="122" class="d-text d-muted" text-anchor="middle">time →</text>
  <rect x="110" y="150" width="14" height="14" rx="3" class="d-accent-fill"/><text x="130" y="162" class="d-text">Downlink</text>
  <rect x="230" y="150" width="14" height="14" rx="3" class="d-orange-fill"/><text x="250" y="162" class="d-text">Uplink</text>
  <defs><marker id="arG" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="d-stroke-fill"/></marker></defs>
</svg>
</figure>
<ul>
<li><b>FDD</b> (Frequency Division Duplex): UL and DL use <b>different frequencies</b>, all the time.</li>
<li><b>TDD</b> (Time Division Duplex): UL and DL use the <b>same frequency</b> in <b>different time slots</b>.</li>
</ul>
<div class="tip"><b>Memory hook.</b> <b>F</b>DD splits <b>F</b>requency, <b>T</b>DD splits <b>T</b>ime.</div>`
    },
    {
      h: "Mobile generations",
      html: `
<div class="table-wrap"><table>
<thead><tr><th>Gen</th><th>Era</th><th>Main idea</th></tr></thead>
<tbody>
<tr><td><b>1G</b></td><td>1980s</td><td>Analog, voice. Human to human.</td></tr>
<tr><td><b>2G</b></td><td>1990s</td><td>Digital (GSM). Adds messaging and global roaming.</td></tr>
<tr><td><b>3G</b></td><td>2000s</td><td>Mobile data.</td></tr>
<tr><td><b>4G</b></td><td>2010s</td><td>LTE, broadband. Always connected: cloud computing, streaming. LTE-M and NB-IoT appear.</td></tr>
<tr><td><b>5G</b></td><td>2020s</td><td>NR (New Radio), ultra-fast, IoT. Enhanced Mobile Broadband and Critical Communication.</td></tr>
</tbody></table></div>
<p>Each generation keeps the earlier services. Voice runs through all of them.</p>`
    }
  ],
  keyPoints: [
    "Simplex: 1 way, 1 channel. Half duplex: 2 ways one at a time, 1 channel. Full duplex: 2 ways at once, 2 channels.",
    "FDD: different frequencies. TDD: same frequency, different time slots.",
    "1G analog voice → 2G digital GSM → 3G data → 4G LTE → 5G NR."
  ]
},

/* ---------------------------------------------------------- */
{
  id: "gsm",
  lec: "L1",
  title: "GSM architecture",
  subtitle: "MS, BSS and NSS: who does what in a 2G network",
  minutes: 12,
  sections: [
    {
      h: "Three subsystems",
      html: `
<p><b>GSM</b> (Global System for Mobile Communications) is a <b>2G</b> cellular network. It was built for voice and data using <b>digital modulation</b>. Its architecture has three blocks joined by named interfaces:</p>
<figure class="diagram">
<svg viewBox="0 0 640 230" role="img" aria-label="GSM architecture: Mobile station connects over Um to BTS, BTS over Abis to BSC, BSC over A to MSC, MSC to HLR, VLR, AuC, EIR and the PSTN">
  <g class="d-box">
    <rect x="10" y="80" width="86" height="64" rx="10"/>
    <rect x="148" y="40" width="70" height="40" rx="8"/>
    <rect x="148" y="140" width="70" height="40" rx="8"/>
    <rect x="268" y="90" width="70" height="44" rx="8"/>
    <rect x="392" y="90" width="76" height="44" rx="8"/>
    <rect x="510" y="20" width="56" height="30" rx="7"/>
    <rect x="576" y="20" width="56" height="30" rx="7"/>
    <rect x="510" y="174" width="56" height="30" rx="7"/>
    <rect x="576" y="174" width="56" height="30" rx="7"/>
    <rect x="530" y="97" width="96" height="30" rx="15"/>
  </g>
  <g class="d-stroke" stroke-width="1.6" fill="none">
    <line x1="96" y1="112" x2="148" y2="60"/><line x1="96" y1="112" x2="148" y2="160"/>
    <line x1="218" y1="60" x2="268" y2="112"/><line x1="218" y1="160" x2="268" y2="112"/>
    <line x1="338" y1="112" x2="392" y2="112"/>
    <line x1="468" y1="105" x2="538" y2="50"/><line x1="468" y1="105" x2="604" y2="50"/>
    <line x1="468" y1="120" x2="538" y2="174"/><line x1="468" y1="120" x2="604" y2="174"/>
    <line x1="468" y1="112" x2="530" y2="112"/>
  </g>
  <g class="d-dash" stroke-width="1.2">
    <line x1="122" y1="16" x2="122" y2="214"/><line x1="243" y1="16" x2="243" y2="214"/><line x1="365" y1="16" x2="365" y2="214"/>
  </g>
  <text x="53" y="108" class="d-text d-bold" text-anchor="middle">MS</text>
  <text x="53" y="126" class="d-text d-muted" text-anchor="middle">ME + SIM</text>
  <text x="183" y="65" class="d-text" text-anchor="middle">BTS</text>
  <text x="183" y="165" class="d-text" text-anchor="middle">BTS</text>
  <text x="303" y="117" class="d-text" text-anchor="middle">BSC</text>
  <text x="430" y="117" class="d-text d-bold" text-anchor="middle">MSC</text>
  <text x="538" y="40" class="d-text" text-anchor="middle">HLR</text>
  <text x="604" y="40" class="d-text" text-anchor="middle">VLR</text>
  <text x="538" y="194" class="d-text" text-anchor="middle">EIR</text>
  <text x="604" y="194" class="d-text" text-anchor="middle">AuC</text>
  <text x="578" y="117" class="d-text" text-anchor="middle">PSTN</text>
  <text x="122" y="228" class="d-text d-accent-text" text-anchor="middle">Um</text>
  <text x="243" y="228" class="d-text d-accent-text" text-anchor="middle">Abis</text>
  <text x="365" y="228" class="d-text d-accent-text" text-anchor="middle">A</text>
  <text x="243" y="14" class="d-text d-muted" text-anchor="middle">BSS</text>
  <text x="571" y="14" class="d-text d-muted" text-anchor="middle">NSS</text>
</svg>
</figure>
<div class="table-wrap"><table>
<thead><tr><th>Subsystem</th><th>Contains</th></tr></thead>
<tbody>
<tr><td><b>Mobile Station (MS)</b></td><td>Mobile Equipment (ME) + Subscriber Identity Module (SIM)</td></tr>
<tr><td><b>Base Station Subsystem (BSS)</b></td><td>Base Transceiver Station (BTS) + Base Station Controller (BSC)</td></tr>
<tr><td><b>Network Switching Subsystem (NSS)</b></td><td>MSC, HLR, VLR, AuC, EIR</td></tr>
</tbody></table></div>
<p>Interfaces: <b>Um</b> = air interface (MS ↔ BTS). <b>Abis</b> = BTS ↔ BSC. <b>A</b> = BSC ↔ MSC. The <b>OMC</b> (Operation and Maintenance Center) handles network management. The MSC connects to outside networks such as the <b>PSTN</b> (public telephone network), ISDN and data networks.</p>`
    },
    {
      h: "Mobile Station",
      html: `
<div class="two-col">
<div class="mini-card"><h4>Mobile Equipment (ME)</h4><ul>
<li>Portable, hand-held device</li>
<li>Uniquely identified by its <b>IMEI</b> (International Mobile Equipment Identity)</li>
<li>Voice and data transmission</li>
<li>Monitors power and signal quality</li></ul></div>
<div class="mini-card"><h4>SIM card</h4><ul>
<li>Smart card holding the <b>IMSI</b> (International Mobile Subscriber Identity)</li>
<li>Lets the user make/receive calls and use subscribed services</li>
<li>Protected by a password or <b>PIN</b></li>
<li>Can be moved from phone to phone</li></ul></div>
</div>
<div class="tip"><b>Don't mix them up.</b> IM<b>E</b>I identifies the <b>E</b>quipment (phone). IM<b>S</b>I identifies the <b>S</b>ubscriber (SIM).</div>`
    },
    {
      h: "Base Station Subsystem",
      html: `
<p>The BSS has two modules: the <b>BTS</b> and the <b>BSC</b>. A BSC may sit at the same site as a BTS or be geographically separate.</p>
<div class="two-col">
<div class="mini-card"><h4>BTS</h4><ul>
<li>Fixed station for radio communication with mobile stations</li>
<li>Radio channels plus transmitter/receiver antennas (transceiver units) on a tower</li></ul></div>
<div class="mini-card"><h4>BSC</h4><p>Talks to the BTSs and the MSC, and allocates:</p><ul>
<li>Radio channels</li><li>Frequency administration</li>
<li>Power and signal measurements from the MS</li>
<li>Handovers between BTSs it controls</li></ul></div>
</div>
<p><b>Functions of the BSS:</b> transcoding of speech channels, allocation of radio channels to phones, and transmission/reception over the air interface.</p>`
    },
    {
      h: "Network Switching Subsystem",
      html: `
<div class="table-wrap"><table>
<thead><tr><th>Element</th><th>Role</th></tr></thead>
<tbody>
<tr><td><b>MSC</b><br><small>Mobile Switching Center</small></td><td>The <b>heart</b> of GSM. One MSC handles many BSCs and talks to other MSCs. Does telephony switching, <b>billing</b>, calls to/from PSTN and data networks, and <b>mobility management</b>: registration, location updating, handover.</td></tr>
<tr><td><b>HLR</b><br><small>Home Location Register</small></td><td><b>Central</b> database of every subscriber that belongs to this MSC. Stores details of every SIM issued by the operator. Updated when the subscriber leaves the local area.</td></tr>
<tr><td><b>VLR</b><br><small>Visitor Location Register</small></td><td><b>Temporary</b> database. When a user visits another network, a temporary record is created in the visited system's VLR. Controls mobiles roaming in its area.</td></tr>
<tr><td><b>AuC</b><br><small>Authentication Center</small></td><td>Holds the authentication algorithms and encryption keys. Protects operators from fraud. Always integrated with the <b>HLR</b>.</td></tr>
<tr><td><b>EIR</b><br><small>Equipment Identity Register</small></td><td>Stores the identities of all devices registered in the network and keeps track of handsets, so that bad equipment can be identified and blocked.</td></tr>
</tbody></table></div>`
    },
    {
      h: "A glance at 5G",
      html: `<p>The lecture ends with a 5G core diagram. For this course, recognize the main names: the phone is the <b>UE</b>, the 5G base station is the <b>gNB</b>, the <b>AMF</b> manages access and mobility, and the <b>UPF</b> carries user data toward the Internet. The GSM ideas you just learned (base station, controller, switching core, subscriber databases) carry over in new forms.</p>`
    }
  ],
  keyPoints: [
    "MS = ME (IMEI) + SIM (IMSI, PIN).",
    "BSS = BTS + BSC. NSS = MSC + HLR + VLR + AuC + EIR.",
    "Um: MS–BTS. Abis: BTS–BSC. A: BSC–MSC.",
    "MSC: heart, switching, billing, mobility (registration, location update, handover).",
    "HLR permanent/central, VLR temporary/visitors, AuC with HLR, EIR tracks handsets."
  ]
},

/* ---------------------------------------------------------- */
{
  id: "cellular",
  lec: "L2",
  title: "The cellular concept",
  subtitle: "Why we use small cells, cell shapes and excitation modes",
  minutes: 9,
  sections: [
    {
      h: "The capacity problem",
      html: `
<p>Radio spectrum is <b>limited and shared</b>. It cannot grow with demand. Meanwhile the number of users and the data each one uses keep rising (voice, then video, cloud and IoT).</p>
<p>Early mobile systems used <b>one tall tower with one high-power transmitter</b> for a whole city. Coverage was wide, but only a handful of calls could happen at once, because each channel could be used only once.</p>
<div class="table-wrap"><table>
<thead><tr><th>Aspect</th><th>Single high-power TX</th><th>Cellular system</th></tr></thead>
<tbody>
<tr><td>Coverage</td><td>One large area</td><td>Many small cells joined together</td></tr>
<tr><td>Transmit power</td><td>Very high</td><td>Low, per base station</td></tr>
<tr><td>Capacity</td><td>Very limited, channels used once</td><td>High, channels reused in many cells</td></tr>
<tr><td>Interference</td><td>None nearby, but huge range</td><td>Controlled by distance between co-channel cells</td></tr>
<tr><td>Growing capacity</td><td>Not possible without more spectrum</td><td>Add cells, lower power</td></tr>
</tbody></table></div>
<div class="callout"><b>Key idea:</b> the same channels are reused many times over the service area.</div>`
    },
    {
      h: "Four ideas behind cellular",
      html: `
<ol class="steps">
<li><b>Many small transmitters.</b> Replace one high-power TX with many low-power ones. Each covers a small area called a <b>cell</b>.</li>
<li><b>Channel groups.</b> Each base station gets part of the total channels.</li>
<li><b>Different groups for neighbors.</b> Nearby base stations use different groups to keep interference low.</li>
<li><b>Grow by adding cells.</b> Need more channels? Add base stations and reduce power. Capacity rises with no extra spectrum.</li>
</ol>`
    },
    {
      h: "Cell shapes: why hexagons",
      html: `
<ul>
<li>The <b>ideal</b> cell is a circle of radius R, but circles leave gaps (dead zones) or overlap.</li>
<li>A <b>real</b> cell is irregular, shaped by terrain and buildings.</li>
<li>A model must tile the region with <b>no gaps, no overlap and equal area</b>. Only the triangle, square and hexagon do this.</li>
<li>The <b>hexagon</b> has the largest area for the same R, so the fewest cells cover the region, and it is closest to a circular (omni) pattern.</li>
</ul>
<figure class="diagram">
<svg viewBox="0 0 420 190" role="img" aria-label="Two adjacent hexagons with radius R from center to corner; distance between centers is root 3 times R">
  <polygon points="130,30 182,60 182,120 130,150 78,120 78,60" class="d-hex-a"/>
  <polygon points="234,30 286,60 286,120 234,150 182,120 182,60" class="d-hex-b"/>
  <line x1="130" y1="90" x2="130" y2="30" class="d-red" stroke-width="2.5"/>
  <text x="116" y="64" class="d-text d-red-text">R</text>
  <circle cx="130" cy="90" r="4" class="d-accent-fill"/><circle cx="234" cy="90" r="4" class="d-stroke-fill"/>
  <line x1="130" y1="172" x2="234" y2="172" class="d-stroke" stroke-width="1.5" marker-start="url(#arS)" marker-end="url(#arE)"/>
  <text x="182" y="166" class="d-text" text-anchor="middle">√3 · R</text>
  <text x="300" y="70" class="d-text">R = center to corner</text>
  <text x="300" y="92" class="d-text">side length = R</text>
  <text x="300" y="114" class="d-text">adjacent centers = √3·R</text>
  <defs>
    <marker id="arS" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M10 0L0 5L10 10z" class="d-stroke-fill"/></marker>
    <marker id="arE" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="d-stroke-fill"/></marker>
  </defs>
</svg>
</figure>
<div class="tip"><b>Why √3·R?</b> From the center to the middle of a side is R·cos 30° = (√3/2)·R. Two of those make the distance between adjacent centers: 2 × (√3/2)·R = <b>√3·R</b>.</div>`
    },
    {
      h: "Cell excitation modes",
      html: `
<div class="two-col">
<div class="mini-card"><h4>Center-excited cell</h4><ul>
<li>Base station transmitter at the <b>center</b></li>
<li><b>Omni-directional</b> antenna: radiates equally in all directions (360°) in the horizontal plane, like a lamp lighting a whole room</li></ul></div>
<div class="mini-card"><h4>Edge-excited cell</h4><ul>
<li>Transmitters on <b>three of the six corners</b></li>
<li><b>Sectored directional</b> antennas, each covering about <b>120°</b></li>
<li>Common sectoring: three 120° sectors or six 60° sectors. Each sector is a mini-cell with its own channel group.</li></ul></div>
</div>`
    }
  ],
  keyPoints: [
    "Spectrum is limited, so cellular reuses channels across many small cells.",
    "Capacity grows by adding cells and lowering power, not by adding spectrum.",
    "Hexagon: no gaps, no overlap, largest area for the same R, closest to a circle.",
    "R = center to corner. Adjacent centers are √3·R apart.",
    "Center-excited: omni 360°. Edge-excited: 3 corners, 120° sectors."
  ]
},

/* ---------------------------------------------------------- */
{
  id: "reuse",
  lec: "L2",
  title: "Frequency reuse and clusters",
  subtitle: "Cluster size N, reuse distance D, reuse ratio Q and capacity C",
  minutes: 18,
  sections: [
    {
      h: "Clusters and channel groups",
      html: `
<p>Each base station gets a <b>group of radio channels</b> for use inside its own cell. Cells far enough apart can use the same group; these are <b>co-channel cells</b>. Choosing and allocating the channel groups is called <b>frequency reuse</b> or <b>frequency planning</b>.</p>
<p>A <b>cluster</b> is a group of N neighboring cells that together use the <b>complete set</b> of channels, each cell with a different group. The cluster is then copied across the service area.</p>
<div class="formula">S = k × N</div>
<div class="legend-grid"><span><b>S</b> total duplex channels in the system</span><span><b>k</b> channels per cell</span><span><b>N</b> cells per cluster (cluster size)</span></div>`
    },
    {
      h: "Cluster size: which N are allowed",
      html: `
<p>For hexagonal cells the cluster size must satisfy</p>
<div class="formula">N = i² + i·j + j²</div>
<p>where i and j are non-negative integers. Only these values let the clusters tile perfectly.</p>
<div class="table-wrap"><table class="center">
<thead><tr><th></th><th>j = 0</th><th>j = 1</th><th>j = 2</th><th>j = 3</th><th>j = 4</th></tr></thead>
<tbody>
<tr><th>i = 1</th><td>1</td><td>3</td><td>7</td><td>13</td><td>21</td></tr>
<tr><th>i = 2</th><td>4</td><td>7</td><td>12</td><td>19</td><td>28</td></tr>
<tr><th>i = 3</th><td>9</td><td>13</td><td>19</td><td>27</td><td>37</td></tr>
<tr><th>i = 4</th><td>16</td><td>21</td><td>28</td><td>37</td><td>48</td></tr>
</tbody></table></div>
<p><b>Valid N:</b> 1, 3, 4, 7, 9, 12, 13, 16, 19, 21, 25, 27, 28, …</p>
<p><b>Not valid:</b> 2, 5, 6, 8, 10, 11, 14, 15, 17, 18, 20, …</p>
<div class="callout warn"><b>Watch out.</b> The Sheet 1 model answer lists 14, but i = 3, j = 2 gives 9 + 6 + 4 = <b>19</b>, not 14. No pair of integers gives 14. Also 16 (i = 4, j = 0) is valid even though the lecture's short list skips it.</div>
<h4>Finding the nearest co-channel cell</h4>
<ol class="steps">
<li>Move <b>i</b> cells along any chain of hexagons.</li>
<li>Turn <b>60° counter-clockwise</b>.</li>
<li>Move <b>j</b> more cells.</li>
</ol>
<p>Example: i = 2, j = 1 gives N = 4 + 2 + 1 = <b>7</b>. Try it in the explorer below: pick i and j and see where the co-channel cells land.</p>
<div data-widget="hex"></div>`
    },
    {
      h: "Reuse distance D and reuse ratio Q",
      html: `
<div class="formula">D = √(3N) · R &nbsp;&nbsp;&nbsp;&nbsp; Q = D / R = √(3N)</div>
<p><b>D</b> is the distance between the centers of two co-channel cells. <b>Q</b> is the co-channel reuse ratio (also called the frequency reuse factor in the sheets). A larger D, and so a larger Q, means less chance of interference.</p>
<div class="table-wrap"><table class="center">
<thead><tr><th>(i, j)</th><th>N</th><th>Q = √(3N)</th></tr></thead>
<tbody>
<tr><td>(1, 1)</td><td>3</td><td>3.00</td></tr>
<tr><td>(2, 0)</td><td>4</td><td>3.46</td></tr>
<tr><td>(2, 1)</td><td>7</td><td>4.58</td></tr>
<tr><td>(3, 0)</td><td>9</td><td>5.20</td></tr>
<tr><td>(2, 2)</td><td>12</td><td>6.00</td></tr>
<tr><td>(3, 1)</td><td>13</td><td>6.24</td></tr>
<tr><td>(3, 2)</td><td>19</td><td>7.55</td></tr>
</tbody></table></div>
<h4>Proof that Q = √(3N) (Sheet 1, Q4)</h4>
<ol class="steps">
<li>Adjacent centers are √3·R apart (shown in the previous lesson).</li>
<li>To reach the co-channel cell you walk i cells, turn 60°, and walk j cells. So the two legs are <b>√3·R·i</b> and <b>√3·R·j</b>, and the angle between them inside the triangle is <b>120°</b>.</li>
<li>Cosine law: D² = (√3Ri)² + (√3Rj)² − 2(√3Ri)(√3Rj)·cos 120°.</li>
<li>cos 120° = −½, so D² = 3R²i² + 3R²j² + 3R²ij = 3R²(i² + ij + j²) = <b>3R²N</b>.</li>
<li>So D = √(3N)·R and Q = D/R = <b>√(3N)</b>. ∎</li>
</ol>
<h4>Co-channel cells in each ring (Sheet 1, Q5)</h4>
<p>The co-channel cells around any cell form a larger hexagonal pattern, the same pattern as the cells themselves, scaled by D. In any hexagonal pattern, ring number i around a center holds <b>6i</b> cells: a hexagon of rings has 6 sides, and each side of ring i contains i cells. So ring 1 has 6, ring 2 has 12, ring 3 has 18, whatever N is.</p>`
    },
    {
      h: "System capacity and the trade-off in N",
      html: `
<div class="formula">C = M × S = M × k × N</div>
<div class="legend-grid"><span><b>C</b> total capacity (duplex channels)</span><span><b>M</b> number of clusters (times the cluster is copied)</span><span><b>S</b> channels per cluster</span><span><b>k</b> channels per cell</span></div>
<div class="two-col">
<div class="mini-card"><h4>Increase N</h4><p>Q grows, co-channel cells move apart → <b>less interference</b>. But S is fixed, so k = S/N falls → <b>lower capacity</b>.</p></div>
<div class="mini-card"><h4>Decrease N</h4><p>More channels per cell → <b>higher capacity</b>. But co-channel cells come closer → <b>more interference</b>.</p></div>
</div>
<div class="callout"><b>Design rule:</b> choose the <b>smallest valid N</b> that still meets the required signal quality (SIR).</div>`
    },
    {
      h: "Worked examples from the lecture",
      html: `
<div class="example">
<div class="example-h">Example 1: GSM capacity</div>
<p>7 cells per cluster, 18 channels per cell, 3 clusters. Find the total capacity.</p>
<p>C = M × k × N = 3 × 18 × 7 = <b>378 channels</b>.</p>
</div>
<div class="example">
<div class="example-h">Example 2: 33 MHz FDD system</div>
<p>33 MHz is allocated to an FDD system using two 25 kHz simplex channels. 1 MHz is for control channels. Find channels per cell for (a) 4-cell reuse, (b) 8-cell reuse.</p>
<ol class="steps">
<li>Duplex channel bandwidth = 2 × 25 kHz = 50 kHz.</li>
<li>Total channels = 33 MHz / 50 kHz = <b>660</b>.</li>
<li>Control channels = 1 MHz / 50 kHz = <b>20</b>. Voice channels = 660 − 20 = <b>640</b>.</li>
<li>(a) N = 4 is valid (i = 2, j = 0): 660/4 = <b>165</b> per cell, of which 20/4 = <b>5</b> control and 165 − 5 = <b>160</b> voice.</li>
<li>(b) N = 8 is <b>not valid</b>: no integers give i² + ij + j² = 8. The nearest valid sizes are 7 and 9.</li>
</ol>
</div>
<div class="tip"><b>Exam tip.</b> Always convert simplex to duplex first: a "two 25 kHz simplex channels" system uses <b>50 kHz per duplex channel</b>.</div>`
    }
  ],
  keyPoints: [
    "S = k × N and C = M × k × N.",
    "N = i² + ij + j²: valid 1, 3, 4, 7, 9, 12, 13, 16, 19, 21 …",
    "D = √(3N)·R and Q = √(3N). N = 7 gives Q = 4.58.",
    "Proof uses the cosine law with legs √3Ri and √3Rj and a 120° angle.",
    "Ring i holds 6i co-channel cells.",
    "Bigger N: less interference, less capacity. Pick the smallest N that meets the SIR."
  ]
},

/* ---------------------------------------------------------- */
{
  id: "sir",
  lec: "SIR",
  title: "Interference and SIR",
  subtitle: "ACI vs CCI, path loss, and the SIR formula that sets the cluster size",
  minutes: 20,
  sections: [
    {
      h: "Two kinds of interference",
      html: `
<div class="two-col">
<div class="mini-card"><h4>Adjacent Channel Interference (ACI)</h4><ul>
<li>A signal on a <b>nearby frequency</b> spills into yours</li>
<li>Cause: spectral tails of neighboring channels overlap because filters are not perfect</li>
<li>Fix 1: <b>sharp filtering</b></li>
<li>Fix 2: <b>channel assignment</b>: never give successive channels to neighboring cells; spread them apart</li></ul>
<p class="small">Example: your receiver uses channel 5; a strong transmitter on channel 6 leaks into channel 5.</p></div>
<div class="mini-card"><h4>Co-Channel Interference (CCI)</h4><ul>
<li>Interference between cells using the <b>same frequency</b></li>
<li>Cause: frequency reuse itself, so it <b>cannot be removed, only controlled</b></li>
<li>Raising TX power does <b>not</b> help: it also raises interference at the other co-channel cells</li>
<li>Fix: separate co-channel cells by a minimum distance D relative to the cell radius R</li></ul></div>
</div>`
    },
    {
      h: "Path loss: how power drops with distance",
      html: `
<div class="formula">P<sub>r</sub> = P<sub>0</sub> (d / d<sub>0</sub>)<sup>−n</sup></div>
<div class="formula">P<sub>r</sub>(dBm) = P<sub>0</sub>(dBm) − 10·n·log<sub>10</sub>(d / d<sub>0</sub>)</div>
<div class="legend-grid">
<span><b>P<sub>r</sub></b> received power at distance d</span>
<span><b>P<sub>0</sub></b> reference power, measured at a known close distance d<sub>0</sub></span>
<span><b>d</b> actual distance</span><span><b>d<sub>0</sub></b> reference distance</span>
<span><b>n</b> path-loss exponent (bigger n = power drops faster)</span></div>
<h4>dB toolkit</h4>
<ul>
<li>Ratio to dB: <span class="m">x(dB) = 10·log<sub>10</sub>(x)</span>. Back: <span class="m">x = 10<sup>dB/10</sup></span>.</li>
<li>Power to dBm: <span class="m">P(dBm) = 10·log<sub>10</sub>(P / 1 mW)</span>. So 1 mW = 0 dBm, and −100 dBm = 10<sup>−10</sup> mW.</li>
<li>15 dB = 31.62 &nbsp;·&nbsp; 18 dB = 63.10 &nbsp;·&nbsp; 73.5 = 18.66 dB.</li>
</ul>
<div class="example"><div class="example-h">Quick check</div><p>P<sub>0</sub> = 0 dBm at d<sub>0</sub> = 1 m, n = 2.9, d = 1000 m: P<sub>r</sub> = 0 − 29 × log<sub>10</sub>(1000) = 0 − 29 × 3 = <b>−87 dBm</b>.</p></div>`
    },
    {
      h: "Deriving SIR step by step",
      html: `
<ol class="steps">
<li><b>Definition.</b> SIR = S / ΣI<sub>i</sub> = S / (I<sub>1</sub> + I<sub>2</sub> + … + I<sub>i0</sub>), where i<sub>0</sub> is the number of interfering base stations.</li>
<li><b>Apply path loss.</b> The wanted signal comes from distance R: S = P<sub>0</sub>(R/d<sub>0</sub>)<sup>−n</sup>. Each interferer is at D<sub>i</sub>: I<sub>i</sub> = P<sub>0</sub>(D<sub>i</sub>/d<sub>0</sub>)<sup>−n</sup>.</li>
<li><b>Cancel constants.</b> With the same P<sub>0</sub> and n everywhere: SIR = R<sup>−n</sup> / ΣD<sub>i</sub><sup>−n</sup>.</li>
<li><b>Equal distances.</b> Put all interferers at about the same distance D: SIR = R<sup>−n</sup> / (i<sub>0</sub>·D<sup>−n</sup>) = (D/R)<sup>n</sup> / i<sub>0</sub>.</li>
<li><b>Use D/R = √(3N).</b> SIR = (√(3N))<sup>n</sup> / i<sub>0</sub>.</li>
<li><b>First tier: i<sub>0</sub> = 6.</b></li>
</ol>
<div class="formula big">SIR = (√(3N))<sup>n</sup> / 6 = (3N)<sup>n/2</sup> / 6</div>
<p>Solve for the cluster size: multiply by 6, raise both sides to 2/n, divide by 3:</p>
<div class="formula big">N = (6 · SIR)<sup>2/n</sup> / 3</div>
<div class="callout warn"><b>Important:</b> use SIR as a <b>linear ratio</b>, never in dB, inside these formulas. Convert first: SIR = 10<sup>dB/10</sup>.</div>
<figure class="diagram">
<svg viewBox="0 0 360 260" role="img" aria-label="Serving cell in the center with six first-tier co-channel cells around it at distance D">
  <circle cx="180" cy="130" r="98" class="d-dash" fill="none" stroke-width="1.2"/>
  <polygon points="180,108 199,119 199,141 180,152 161,141 161,119" class="d-hex-a"/>
  <g class="d-hex-b">
    <polygon points="180,10 199,21 199,43 180,54 161,43 161,21"/>
    <polygon points="265,59 284,70 284,92 265,103 246,92 246,70"/>
    <polygon points="265,157 284,168 284,190 265,201 246,190 246,168"/>
    <polygon points="180,206 199,217 199,239 180,250 161,239 161,217"/>
    <polygon points="95,157 114,168 114,190 95,201 76,190 76,168"/>
    <polygon points="95,59 114,70 114,92 95,103 76,92 76,70"/>
  </g>
  <g class="d-stroke" stroke-width="1.2">
    <line x1="180" y1="130" x2="180" y2="32"/><line x1="180" y1="130" x2="265" y2="81"/>
    <line x1="180" y1="130" x2="265" y2="179"/><line x1="180" y1="130" x2="180" y2="228"/>
    <line x1="180" y1="130" x2="95" y2="179"/><line x1="180" y1="130" x2="95" y2="81"/>
  </g>
  <text x="188" y="80" class="d-text">D</text>
  <text x="180" y="134" class="d-text d-bold" text-anchor="middle">A</text>
  <text x="300" y="30" class="d-text d-muted">6 interferers</text>
</svg>
<figcaption>First tier: six co-channel cells, all at about distance D.</figcaption>
</figure>`
    },
    {
      h: "Design procedure (use this in the exam)",
      html: `
<ol class="steps">
<li>Convert the required SIR from dB to linear: SIR = 10<sup>dB/10</sup>.</li>
<li>Compute N<sub>min</sub> = (6·SIR)<sup>2/n</sup> / 3.</li>
<li>Round <b>up</b> to the next <b>valid</b> cluster size (1, 3, 4, 7, 9, 12, 13, 16, 19 …).</li>
<li>Check: SIR = (√(3N))<sup>n</sup>/6, convert to dB, and confirm it is ≥ the requirement.</li>
</ol>
<div class="example">
<div class="example-h">Example (lecture + Sheet 2 Q1): SIR ≥ 15 dB</div>
<p>15 dB → 10<sup>1.5</sup> = 31.62.</p>
<p><b>(a) n = 4:</b> N ≥ (6 × 31.62)<sup>2/4</sup> / 3 = (189.7)<sup>0.5</sup>/3 = 4.59 → <b>N = 7</b>. Q = √21 = 4.58. Check: (4.583)<sup>4</sup>/6 = 73.5 = <b>18.66 dB</b> ≥ 15 dB ✓.</p>
<p><b>(b) n = 3:</b> N ≥ (189.7)<sup>2/3</sup>/3 = 11.0 → next valid is <b>N = 12</b>. Q = √36 = 6. Check: 6<sup>3</sup>/6 = 36 = <b>15.56 dB</b> ✓. (N = 7 would give 16.04 = 12.05 dB, too low.)</p>
<p class="small">Note: one lecture slide prints 75.3 for (4.583)<sup>4</sup>/6. The correct value is 73.5; the dB value 18.66 dB on the slide is right.</p>
</div>
<div class="callout"><b>Why does a smaller n need a bigger N?</b> With small n, power falls off slowly with distance, so interferers arrive stronger. To keep SIR up you must push co-channel cells farther away, which means a larger cluster.</div>
<div class="example">
<div class="example-h">Example (lecture): AMPS, 30 kHz FM, N = 7, n = 4</div>
<p>D/R = √21 = 4.583 → SIR = (4.583)<sup>4</sup>/6 = 73.5 = <b>18.66 dB</b>.</p>
</div>`
    },
    {
      h: "Beyond the first tier",
      html: `
<p>Each ring i has 6i co-channel cells, so ring 2 adds 12 interferers. By the geometry of the hexagonal pattern, 6 of them are at <b>√3·D</b> and 6 at <b>2D</b>. Including both rings:</p>
<div class="formula">SIR = (D/R)<sup>n</sup> / [ 6 + 6(√3)<sup>−n</sup> + 6(2)<sup>−n</sup> ]</div>
<p>For n = 4 the bracket is 6(1 + 1/9 + 1/16) ≈ 7.04, so the second ring lowers SIR by only about 0.7 dB. That is why the first-tier formula is a good approximation.</p>
<h4>Worst case (figure on Sheet 2)</h4>
<p>If the mobile sits at the cell <b>edge</b>, the six interferers are not equally far. The figure on Sheet 2 uses distances D − R (two cells), D (two cells) and D + R (two cells):</p>
<div class="formula">SIR<sub>worst</sub> = R<sup>−n</sup> / [ 2(D−R)<sup>−n</sup> + 2D<sup>−n</sup> + 2(D+R)<sup>−n</sup> ]</div>
<p>Dividing top and bottom by R<sup>−n</sup>: SIR = 1 / [2(Q−1)<sup>−n</sup> + 2Q<sup>−n</sup> + 2(Q+1)<sup>−n</sup>]. For N = 7, n = 4 this gives about 53.4 = <b>17.3 dB</b>, a little below the 18.66 dB average-case value.</p>`
    }
  ],
  keyPoints: [
    "ACI: neighbor frequency, fix with filters and spreading channels. CCI: same frequency, fix with distance D (bigger N).",
    "Raising power never fixes CCI.",
    "Pr = P0(d/d0)^−n, or in dBm: Pr = P0 − 10n·log10(d/d0).",
    "SIR = (√(3N))ⁿ / 6 and N = (6·SIR)^(2/n) / 3. SIR must be linear.",
    "15 dB: n = 4 → N = 7 (18.66 dB); n = 3 → N = 12 (15.56 dB).",
    "18 dB: n = 4 → N = 7; n = 3 → N = 19 (18.56 dB)."
  ]
},

/* ---------------------------------------------------------- */
{
  id: "assignment",
  lec: "L3",
  title: "Channel assignment",
  subtitle: "Fixed vs dynamic strategies and channel borrowing",
  minutes: 10,
  sections: [
    {
      h: "What a strategy decides",
      html: `<p>A <b>channel assignment strategy</b> describes how frequency resources are given to each base station. It also affects how well the system handles handoff. There are two strategies:</p>
<div class="two-col">
<div class="mini-card"><h4>Fixed</h4><p>Each cell gets a <b>predetermined</b> set of voice channels that stays with it <b>permanently</b>.</p></div>
<div class="mini-card"><h4>Dynamic</h4><p>Channels are <b>not</b> permanently allocated. The <b>MSC</b> assigns a channel to a cell <b>each time a call is requested</b>.</p></div>
</div>`
    },
    {
      h: "Fixed channel assignment",
      html: `
<ol class="steps">
<li>The S channels are split into groups of <b>K = S / N</b>, one group per cell of a cluster.</li>
<li>Each cell owns its group permanently. Only calls inside that cell may use it.</li>
<li>The same groups are reused in other clusters, separated by D, so interference is planned in advance.</li>
</ol>
<div class="example"><div class="example-h">Illustration from the lecture</div><p>S = 70, N = 7 → K = 10 channels per cell. With M = 4 clusters, C = M × S = <b>280</b>.</p></div>
<h4>When a call arrives</h4>
<p>Is there an unused channel in this cell? <b>Yes</b> → the call is served. <b>No</b> → the call is <b>blocked</b>. Blocking is not user-friendly, so <b>borrowing</b> exists.</p>
<h4>Borrowing strategy</h4>
<ol class="steps">
<li><b>Trigger:</b> all channels of the cell are busy, so a new call would be blocked.</li>
<li><b>Borrow:</b> the cell borrows a channel from a neighboring <b>donor</b> cell that has spare capacity. (Lecture picture: borrowing cell 10 of 10 busy; donor 6 of 10 busy.)</li>
<li><b>Supervise:</b> the <b>MSC</b> monitors the process so that no call in the donor cell suffers interference.</li>
</ol>
<div class="two-col">
<div class="mini-card good"><h4>Strengths</h4><ul><li>Simple to plan, install and operate</li><li>Low computational load: no real-time channel search</li><li>Interference planned in advance through D</li><li>Predictable capacity in every cell</li></ul></div>
<div class="mini-card bad"><h4>Limitations</h4><ul><li>A busy cell blocks calls while neighbors hold idle channels</li><li>Capacity per cell is fixed at K = S/N</li><li>Borrowing needs MSC supervision</li><li>A change in traffic pattern needs a new frequency plan</li></ul></div>
</div>`
    },
    {
      h: "Dynamic channel assignment",
      html: `
<p>Channels stay in a <b>pool managed by the MSC</b>. <b>Key idea:</b> channels belong to the system, not to a single cell. The result is a <b>lower blocking probability</b> and <b>higher capacity</b>.</p>
<ol class="steps">
<li><b>Request:</b> a call is requested and the serving BS forwards the request to the MSC.</li>
<li><b>Search the pool:</b> the MSC looks for a channel not in use in this cell or in any cell within the minimum reuse distance.</li>
<li><b>Allocate or block:</b> if a suitable channel exists it is given to the cell; otherwise the call is blocked.</li>
<li><b>Release:</b> when the call ends, the channel returns to the pool for any cell to use.</li>
</ol>
<p><b>Typical selection criteria:</b> co-channel interference limit (reuse distance), likelihood of future blocking in the cell, and the cost of using the channel.</p>
<div class="two-col">
<div class="mini-card good"><h4>Strengths</h4><ul><li>Lower blocking: idle channels are not locked inside one cell</li><li>Higher capacity from better channel use</li><li>Adapts automatically to hot spots and changing traffic</li><li>More choice of channel for an incoming handoff</li></ul></div>
<div class="mini-card bad"><h4>Limitations</h4><ul><li>Needs real-time knowledge of channel use and traffic</li><li>Higher storage and computational load</li><li>Every allocation needs an interference check</li><li>More complex to design, test and maintain</li></ul></div>
</div>`
    }
  ],
  keyPoints: [
    "Fixed: permanent groups of K = S/N. Simple, but a busy cell blocks calls.",
    "Borrowing: take a channel from a donor neighbor, supervised by the MSC.",
    "Dynamic: MSC assigns from a pool per call. Lower blocking, higher capacity, more computation.",
    "Lecture review: S = 84, N = 7 → 12 channels per cell; with M = 5, C = 420."
  ]
},

/* ---------------------------------------------------------- */
{
  id: "handoff",
  lec: "L3",
  title: "Handoff",
  subtitle: "Threshold, margin Δ, dwell time, and hard vs soft handoff",
  minutes: 14,
  sections: [
    {
      h: "What a handoff is",
      html: `
<ul>
<li>A <b>handoff</b> (handover) happens when a mobile moves into a different cell <b>while a call is in progress</b>.</li>
<li>The <b>MSC</b> transfers the call to a new channel belonging to the new base station.</li>
<li>The handoff starts at an <b>optimum signal level</b> set above the minimum usable signal for acceptable voice quality.</li>
</ul>
<h4>Why monitor first? Fading</h4>
<p>A drop in signal can be momentary <b>fading</b>. So the BS monitors signal strength for a certain period before starting a handoff, to be sure the drop is real.</p>
<h4>Dwell time</h4>
<p>The <b>dwell time</b> is how long a call can stay in a cell without a handoff. It depends on the user's speed, so it is a <b>random variable</b>. It is governed by propagation, interference, and the distance between the subscriber and the BS.</p>`
    },
    {
      h: "Two signal levels and the margin Δ",
      html: `
<figure class="diagram">
<svg viewBox="0 0 540 250" role="img" aria-label="Received signal falls over time, crossing the handoff threshold first and then the minimum acceptable signal; the gap between the two levels is the margin delta">
  <line x1="50" y1="20" x2="50" y2="210" class="d-stroke" stroke-width="1.5"/>
  <line x1="50" y1="210" x2="520" y2="210" class="d-stroke" stroke-width="1.5"/>
  <text x="56" y="18" class="d-text d-muted">received signal</text>
  <text x="515" y="230" class="d-text d-muted" text-anchor="end">time</text>
  <path d="M55 40 C 200 42, 260 80, 320 140 S 400 190, 440 200" class="d-ink" stroke-width="3" fill="none"/>
  <line x1="50" y1="100" x2="520" y2="100" class="d-orange" stroke-width="1.6" stroke-dasharray="6 5"/>
  <line x1="50" y1="152" x2="520" y2="152" class="d-accent" stroke-width="1.6" stroke-dasharray="6 5"/>
  <text x="515" y="94" class="d-text d-orange-text" text-anchor="end">Handoff threshold P(r,HO)</text>
  <text x="515" y="146" class="d-text d-accent-text" text-anchor="end">Minimum acceptable P(r,min)</text>
  <line x1="80" y1="104" x2="80" y2="148" class="d-ink" stroke-width="1.6" marker-start="url(#arS2)" marker-end="url(#arE2)"/>
  <text x="90" y="131" class="d-text d-bold">Δ</text>
  <circle cx="268" cy="100" r="5" class="d-orange-fill"/>
  <circle cx="330" cy="152" r="5" class="d-accent-fill"/>
  <line x1="268" y1="100" x2="268" y2="210" class="d-orange" stroke-width="1" stroke-dasharray="3 4"/>
  <line x1="330" y1="152" x2="330" y2="210" class="d-accent" stroke-width="1" stroke-dasharray="3 4"/>
  <text x="299" y="244" class="d-text" text-anchor="middle">Δt = time to complete handoff</text>
  <line x1="270" y1="226" x2="328" y2="226" class="d-ink" stroke-width="1.4" marker-start="url(#arS2)" marker-end="url(#arE2)"/>
  <defs>
    <marker id="arS2" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M10 0L0 5L10 10z" class="d-ink-fill"/></marker>
    <marker id="arE2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" class="d-ink-fill"/></marker>
  </defs>
</svg>
</figure>
<ul>
<li><b>Handoff threshold:</b> a signal level stronger than the minimum, at which the handoff is made.</li>
<li><b>Minimum acceptable signal:</b> the lowest level usable for acceptable voice quality at the BS receiver.</li>
</ul>
<div class="formula">Δ = P<sub>r,HO</sub> − P<sub>r,min</sub> &nbsp; (in dB)</div>
<div class="two-col">
<div class="mini-card bad"><h4>Δ too small</h4><p>Not enough time to finish the handoff before the signal becomes too weak. <b>Result: dropped calls.</b></p></div>
<div class="mini-card bad"><h4>Δ too large</h4><p>Handoffs start too early; many are unnecessary. <b>Result: extra load on the MSC.</b></p></div>
</div>
<div class="callout"><b>Design goal:</b> Δ large enough to complete the handoff, small enough to avoid unnecessary ones.</div>`
    },
    {
      h: "Calculating the minimum Δ (Sheet 2, Q5)",
      html: `
<p>A mobile moves at v = 20 m/s on a straight line from BS1 toward BS2 (2000 m apart). P<sub>0</sub> = 0 dBm at d<sub>0</sub> = 1 m, n = 2.9, P<sub>r,min</sub> = −88 dBm, and a handoff takes Δt = 4.5 s.</p>
<ol class="steps">
<li>Distance travelled during the handoff: d = v·Δt = 20 × 4.5 = <b>90 m</b>.</li>
<li>Where does the signal from BS1 hit the minimum? −88 = 0 − 29·log<sub>10</sub>(d<sub>min</sub>) → d<sub>min</sub> = 10<sup>88/29</sup> ≈ <b>1082.6 m</b>.</li>
<li>The handoff must start 90 m earlier: d<sub>HO</sub> = 1082.6 − 90 = 992.6 m, where P<sub>r,HO</sub> = −29·log<sub>10</sub>(992.6) ≈ <b>−86.9 dBm</b>.</li>
<li>Δ = −86.9 − (−88) ≈ <b>1.09 dB</b>.</li>
</ol>
<p>A shortcut that does not need d<sub>min</sub> first: Δ = 10·n·log<sub>10</sub>(d<sub>min</sub> / (d<sub>min</sub> − v·Δt)).</p>
<div class="callout warn"><b>About the model answer.</b> It starts the handoff at the midpoint (1000 m, −87 dBm) and checks 90 m later (1090 m, −88.09 dBm), giving Δ ≈ 1.09 dB, then rounds to 1. Both routes give about 1.1 dB. Note that Δ is a <b>difference of two dBm values</b>, so its unit is <b>dB</b>, not dBm.</div>`
    },
    {
      h: "Handoff by network level",
      html: `
<div class="table-wrap"><table>
<thead><tr><th>Type</th><th>Between</th><th>Level that changes</th><th>Coordinated by</th></tr></thead>
<tbody>
<tr><td><b>Inter-BTS / Intra-BSC</b></td><td>Different BTSs under the same BSC</td><td>BTS</td><td>The BSC</td></tr>
<tr><td><b>Inter-BSC / Intra-MSC</b></td><td>BTSs under different BSCs on the same MSC</td><td>BSC</td><td>The MSC</td></tr>
<tr><td><b>Inter-MSC</b></td><td>BTSs under BSCs on different MSCs</td><td>MSC</td><td>Both MSCs</td></tr>
</tbody></table></div>
<div class="tip"><b>Trick:</b> find the <b>lowest</b> element the two cells share. If they share a BSC, it's intra-BSC; if they only share an MSC, it's inter-BSC; if they share nothing, it's inter-MSC.</div>`
    },
    {
      h: "Hard vs soft handoff",
      html: `
<figure class="diagram">
<svg viewBox="0 0 560 160" role="img" aria-label="Hard handoff: mobile drops BS1 before linking to BS2. Soft handoff: mobile links to both BS1 and BS2 at the same time">
  <text x="140" y="18" class="d-text d-bold" text-anchor="middle">Hard: break before make</text>
  <text x="420" y="18" class="d-text d-bold" text-anchor="middle">Soft: make before break</text>
  <g class="d-stroke" stroke-width="2" fill="none">
    <path d="M40 90 L55 34 L70 90"/><path d="M210 90 L225 34 L240 90"/>
    <path d="M320 90 L335 34 L350 90"/><path d="M490 90 L505 34 L520 90"/>
  </g>
  <rect x="128" y="112" width="22" height="34" rx="5" class="d-box"/>
  <rect x="408" y="112" width="22" height="34" rx="5" class="d-box"/>
  <line x1="60" y1="60" x2="128" y2="118" class="d-red" stroke-width="2" stroke-dasharray="4 5"/>
  <text x="80" y="110" class="d-text d-red-text">✕</text>
  <line x1="220" y1="60" x2="150" y2="118" class="d-accent" stroke-width="2.4"/>
  <line x1="340" y1="60" x2="408" y2="118" class="d-accent" stroke-width="2.4"/>
  <line x1="500" y1="60" x2="430" y2="118" class="d-accent" stroke-width="2.4"/>
  <text x="55" y="106" class="d-text d-muted" text-anchor="middle">BS1</text>
  <text x="225" y="106" class="d-text d-muted" text-anchor="middle">BS2</text>
  <text x="335" y="106" class="d-text d-muted" text-anchor="middle">BS1</text>
  <text x="505" y="106" class="d-text d-muted" text-anchor="middle">BS2</text>
</svg>
</figure>
<div class="table-wrap"><table>
<thead><tr><th>Criterion</th><th>Hard handoff</th><th>Soft handoff</th></tr></thead>
<tbody>
<tr><td>Policy</td><td>Break before make</td><td>Make before break</td></tr>
<tr><td>Links</td><td>Old link released before the new one is set up</td><td>At least one link kept while links are added and removed</td></tr>
<tr><td>Base stations</td><td>A single BS at a time</td><td>Multiple BSs simultaneously</td></tr>
<tr><td>Continuity</td><td>An actual break occurs while switching</td><td>No break during the handoff</td></tr>
<tr><td>Typical use</td><td>Generally an inter-frequency handoff</td><td>Generally adopted in co-located sites</td></tr>
</tbody></table></div>`
    }
  ],
  keyPoints: [
    "Handoff: cell change during a call; the MSC moves the call to a new channel.",
    "Monitor before handing off, so momentary fading is not mistaken for a real drop.",
    "Dwell time is random (depends on speed, propagation, interference, distance).",
    "Δ = threshold − minimum (dB). Too small → dropped calls. Too large → MSC overload.",
    "Intra-BSC (BSC), inter-BSC (MSC), inter-MSC (both MSCs).",
    "Hard = break before make, one BS. Soft = make before break, several BSs."
  ]
},

/* ---------------------------------------------------------- */
{
  id: "sheet1",
  lec: "Sheets",
  title: "Sheet 1, fully solved",
  subtitle: "Cluster sizes, bandwidth, channels per cell and the two proofs",
  minutes: 15,
  sections: [
    {
      h: "Q1. Available values of N",
      html: `<p>N = i² + ij + j² with non-negative integers i, j. Building the table (see the Frequency reuse lesson):</p>
<p><b>N = 1, 3, 4, 7, 9, 12, 13, 16, 19, 21, 25, 27, 28, …</b></p>
<div class="callout warn">The handwritten model answer includes 14 (from i = 3, j = 2). That entry is a slip: 3² + 3·2 + 2² = 9 + 6 + 4 = 19. 14 is not a valid cluster size.</div>`
    },
    {
      h: "Q2. Total bandwidth (N = 4, 2 × 35 kHz, 100 channels per cell)",
      html: `<ol class="steps">
<li>Duplex channel bandwidth = 2 × 35 kHz = 70 kHz.</li>
<li>Channels per cluster S = k × N = 100 × 4 = 400.</li>
<li>Total bandwidth = 400 × 70 kHz = <b>28 MHz</b>.</li></ol>`
    },
    {
      h: "Q3. Cluster size (40 MHz, 2 × 30 kHz)",
      html: `<ol class="steps">
<li>Duplex channel = 60 kHz → S = 40 MHz / 60 kHz = 666.7 → <b>666 channels</b> (you cannot use part of a channel).</li>
<li><b>(a) k = 100:</b> N = S/k = 6.66. N must be a valid size. N = 4 gives 666/4 ≈ 166 per cell (≥ 100 ✓). N = 7 gives 666/7 ≈ 95 per cell (< 100 ✗). <b>Use N = 4.</b></li>
<li><b>(b) k = 125:</b> N = 666/125 = 5.33. N = 4 gives 166 per cell (≥ 125 ✓). N = 7 gives 95 (✗). <b>Use N = 4.</b></li></ol>
<div class="tip">Rule: take the <b>largest valid N that does not exceed S/k</b>, so each cell still gets at least the required channels.</div>`
    },
    {
      h: "Q4 (second Q3 on the sheet). 33 MHz, 2 × 25 kHz",
      html: `<ol class="steps">
<li>Duplex channel = 50 kHz → S = 33 MHz / 50 kHz = <b>660</b>.</li>
<li><b>(a) N = 4:</b> k = 660/4 = <b>165</b> channels per cell.</li>
<li><b>(b) N = 7:</b> k = 660/7 = 94.3 → about <b>94</b> per cell. To use all 660, a few cells get one or two extra (the model answer gives 6 cells × 94 and 1 cell × 96; 5 × 94 + 2 × 95 also works).</li>
<li><b>Control channels (1 MHz), N = 4:</b> control = 1 MHz / 50 kHz = 20; voice = 32 MHz / 50 kHz = 640. Per cell: 20/4 = <b>5 control</b> and 640/4 = <b>160 voice</b>.</li></ol>`
    },
    {
      h: "Q5 (sheet Q4). Prove Q = D/R = √(3N)",
      html: `<p>Adjacent centers are √3·R apart. The path to the co-channel cell has legs √3Ri and √3Rj with 120° between them. Cosine law:</p>
<div class="formula">D² = 3R²i² + 3R²j² − 2·3R²ij·cos 120° = 3R²(i² + ij + j²) = 3R²N</div>
<p>So D = √(3N)·R and Q = √(3N). ∎</p>`
    },
    {
      h: "Q6 (sheet Q5). Prove ring i holds 6i co-channel cells",
      html: `<p>Co-channel cells are found by the same i, j steps from every cell, so they form a hexagonal pattern of their own, spaced D apart. Around a center, ring i of a hexagonal pattern is a hexagon with 6 sides; each side holds i cells (counting one corner per side). So ring i holds 6 × i = <b>6i</b> cells. This depends only on the hexagonal geometry, not on N. Ring 1: 6, ring 2: 12, ring 3: 18.</p>`
    }
  ],
  keyPoints: [
    "Q1: 1, 3, 4, 7, 9, 12, 13, 16, 19, 21 … (14 is not valid).",
    "Q2: 28 MHz. Q3: S = 666, use N = 4 in both parts.",
    "33 MHz: 660 channels; N = 4 → 165 (5 control + 160 voice); N = 7 → ≈ 94."
  ]
},

/* ---------------------------------------------------------- */
{
  id: "sheet2",
  lec: "Sheets",
  title: "Sheet 2, fully solved",
  subtitle: "Cluster size from SIR, cell radius, C/I for several N, and the handoff margin",
  minutes: 18,
  sections: [
    {
      h: "Q1. 15 dB required, n = 4 and n = 3",
      html: `<p>15 dB = 31.62. N<sub>min</sub> = (6 × 31.62)<sup>2/n</sup> / 3.</p>
<div class="table-wrap"><table class="center"><thead><tr><th>n</th><th>N<sub>min</sub></th><th>Chosen N</th><th>Q</th><th>SIR</th></tr></thead>
<tbody><tr><td>4</td><td>4.59</td><td><b>7</b></td><td>4.58</td><td>73.5 = 18.66 dB ✓</td></tr>
<tr><td>3</td><td>11.0</td><td><b>12</b></td><td>6.00</td><td>36 = 15.56 dB ✓</td></tr></tbody></table></div>`
    },
    {
      h: "Q2. Cell radius for N = 7, n = 3",
      html: `<p>P<sub>0</sub> = 1 mW at d<sub>0</sub> = 1 m. The co-channel signal must be below −100 dBm = 10<sup>−10</sup> mW. The interferer is D = √(3N)·R = √21·R away.</p>
<ol class="steps">
<li>1 mW × (√21·R / 1 m)<sup>−3</sup> &lt; 10<sup>−10</sup> mW</li>
<li>(√21·R)<sup>3</sup> &gt; 10<sup>10</sup> → √21·R &gt; 10<sup>10/3</sup> = 2154.4 m</li>
<li>R &gt; 2154.4 / 4.583 → <b>R ≈ 470 m</b> (minimum radius)</li></ol>`
    },
    {
      h: "Q3. N = 7, propagation constant n = 3.2",
      html: `<ol class="steps">
<li><b>(a)</b> SIR = (√21)<sup>3.2</sup>/6 = 21.75 → <b>13.37 dB</b>.</li>
<li><b>(b)</b> Carrier 5 W: I = S / SIR = 5 / 21.75 = <b>0.23 W</b>.</li>
<li><b>(c)</b> Repeat for other N:</li></ol>
<div class="table-wrap"><table class="center"><thead><tr><th>N</th><th>SIR (linear)</th><th>SIR (dB)</th><th>I for S = 5 W</th></tr></thead>
<tbody>
<tr><td>3</td><td>5.61</td><td>7.49</td><td>0.89 W</td></tr>
<tr><td>4</td><td>8.88</td><td>9.49</td><td>0.56 W</td></tr>
<tr><td>7</td><td>21.75</td><td>13.37</td><td>0.23 W</td></tr>
<tr><td>9</td><td>32.51</td><td>15.12</td><td>0.15 W</td></tr>
<tr><td>12</td><td>51.51</td><td>17.12</td><td>0.097 W</td></tr></tbody></table></div>
<p>At the same n: larger N → larger reuse distance → higher SIR → lower interference.</p>
<p class="small">The model answer shows 7.45 and 9.48 dB for N = 3 and 4; computed exactly they are 7.49 and 9.49 dB. The difference is rounding.</p>`
    },
    {
      h: "Q4. C/I must exceed 18 dB",
      html: `<p>18 dB = 63.10. N<sub>min</sub> = (6 × 63.10)<sup>2/n</sup>/3.</p>
<div class="table-wrap"><table class="center"><thead><tr><th>n</th><th>N<sub>min</sub></th><th>Chosen N</th><th>SIR</th></tr></thead>
<tbody><tr><td>4</td><td>6.49</td><td><b>7</b></td><td>73.5 = 18.66 dB ✓</td></tr>
<tr><td>3</td><td>17.44</td><td><b>19</b></td><td>71.72 = 18.56 dB ✓</td></tr></tbody></table></div>
<p>16 is the next valid size after 13, but 16 &lt; 17.44, so for n = 3 we need 19.</p>`
    },
    {
      h: "Q5. Minimum handoff margin",
      html: `<p>Fully worked in the Handoff lesson. Summary: the mobile travels 20 × 4.5 = 90 m during the handoff; d<sub>min</sub> ≈ 1082.6 m; P<sub>r,HO</sub> ≈ −86.9 dBm; <b>Δ ≈ 1.09 dB</b> (model answer rounds to 1 dB).</p>
<p><b>Effects of Δ:</b> too small → not enough time, calls dropped; too large → unnecessary handoffs and extra MSC load.</p>`
    }
  ],
  keyPoints: [
    "Q1: N = 7 (n = 4) and N = 12 (n = 3).",
    "Q2: R ≈ 470 m. Q3: 13.37 dB and 0.23 W.",
    "Q4: N = 7 (n = 4) and N = 19 (n = 3). Q5: Δ ≈ 1.1 dB."
  ]
}
];

/* Formula sheet */
window.FORMULAS = [
  { group: "Frequency", items: [
    ["Wavelength", "λ = c / f, c = 3 × 10<sup>8</sup> m/s"]
  ]},
  { group: "Clusters and capacity", items: [
    ["Channels per cluster", "S = k × N"],
    ["Channels per cell", "k = S / N"],
    ["Total capacity", "C = M × S = M × k × N"],
    ["Valid cluster size", "N = i² + ij + j²"],
    ["Total channels from bandwidth", "S = total BW / (2 × simplex BW)"]
  ]},
  { group: "Reuse geometry", items: [
    ["Adjacent cell centers", "√3 · R"],
    ["Reuse distance", "D = √(3N) · R"],
    ["Reuse ratio", "Q = D / R = √(3N)"],
    ["Co-channel cells in ring i", "6i"]
  ]},
  { group: "Path loss and dB", items: [
    ["Path loss", "P<sub>r</sub> = P<sub>0</sub>(d/d<sub>0</sub>)<sup>−n</sup>"],
    ["Path loss in dBm", "P<sub>r</sub> = P<sub>0</sub>(dBm) − 10n·log<sub>10</sub>(d/d<sub>0</sub>)"],
    ["Ratio ↔ dB", "dB = 10·log<sub>10</sub>(x), x = 10<sup>dB/10</sup>"],
    ["Power ↔ dBm", "dBm = 10·log<sub>10</sub>(P / 1 mW)"]
  ]},
  { group: "SIR", items: [
    ["General", "SIR = R<sup>−n</sup> / ΣD<sub>i</sub><sup>−n</sup>"],
    ["Equal distances", "SIR = (D/R)<sup>n</sup> / i<sub>0</sub>"],
    ["First tier (i<sub>0</sub> = 6)", "SIR = (√(3N))<sup>n</sup> / 6 = (3N)<sup>n/2</sup> / 6"],
    ["Required cluster size", "N = (6 · SIR)<sup>2/n</sup> / 3 (SIR linear)"],
    ["Two tiers", "SIR = Q<sup>n</sup> / [6 + 6(√3)<sup>−n</sup> + 6·2<sup>−n</sup>]"],
    ["Worst case (edge)", "SIR = 1 / [2(Q−1)<sup>−n</sup> + 2Q<sup>−n</sup> + 2(Q+1)<sup>−n</sup>]"]
  ]},
  { group: "Handoff", items: [
    ["Margin", "Δ = P<sub>r,HO</sub> − P<sub>r,min</sub> (dB)"],
    ["Distance moved during handoff", "d = v · Δt"],
    ["Minimum margin", "Δ = 10n·log<sub>10</sub>(d<sub>min</sub> / (d<sub>min</sub> − vΔt))"]
  ]}
];
