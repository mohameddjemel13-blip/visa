/* ═══════════════════════════════════════════════════
   GLOBE DU VOYAGEUR — script.js
   Passeport Tunisien + Blue Card Allemande
   Source : Wikipedia "Visa requirements for Tunisian citizens" — avril 2026
   ═══════════════════════════════════════════════════ */
'use strict';

const C = {
  home:        '#ffd700',
  passport:    '#ff6040',
  vf:          '#00e676',
  voa:         '#ffaa00',
  eta:         '#00d4ff',
  evisa:       '#00c4aa',
  bc_schengen: '#4488ff',
  bc_extra:    '#9966ff',
  none:        '#0c1528',
  ocean:       '#060e1e',
  graticule:   'rgba(38,70,140,0.28)',
  border:      'rgba(16,38,90,0.85)',
  atmosphere:  'rgba(60,130,255,0.32)',
};

const LABELS = {
  home:        '🏠 Résidence Blue Card',
  passport:    '🛂 Pays de nationalité',
  vf:          '✅ Sans visa · passeport TN',
  voa:         '🛬 Visa à l\'arrivée',
  eta:         '📱 eTA — autorisation en ligne',
  evisa:       '💻 eVisa — visa en ligne obligatoire',
  bc_schengen: '🔵 Blue Card · Zone Schengen',
  bc_extra:    '🟣 Blue Card · Hors Schengen',
  none:        '❌ Visa ambassade requis',
};

/* ─── ACCESS DATA ────────────────────────────────────
   Clés = ISO 3166-1 numérique (entier)
   Source exhaustive : Wikipedia + visatraveler.com
─────────────────────────────────────────────────── */
const ACCESS = {

  /* ── Nationalité & Résidence ── */
  788: { name:'Tunisie',              status:'passport',    detail:'Passeport tunisien · votre nationalité' },
  276: { name:'Allemagne',            status:'home',        detail:'Blue Card émise ici · résidence principale' },

  /* ══════════════════════════════════════════════
     ✅  SANS VISA — passeport tunisien seul
  ══════════════════════════════════════════════ */
  12:  { name:'Algérie',              status:'vf', detail:'Sans visa · 90 jours' },
  204: { name:'Bénin',                status:'vf', detail:'Sans visa · 90 jours' },
  76:  { name:'Brésil',               status:'vf', detail:'Sans visa · 90 jours' },
  84:  { name:'Belize',               status:'vf', detail:'Sans visa' },
  52:  { name:'Barbade',              status:'vf', detail:'Sans visa · 6 mois' },
  384: { name:'Côte d\'Ivoire',       status:'vf', detail:'Sans visa · 90 jours' },
  212: { name:'Dominique',            status:'vf', detail:'Sans visa · 21 jours' },
  218: { name:'Équateur',             status:'vf', detail:'Sans visa · 90 jours' },
  242: { name:'Fidji',                status:'vf', detail:'Sans visa · 4 mois' },
  270: { name:'Gambie',               status:'vf', detail:'Sans visa · entry clearance Gambian Immigration requis avant départ' },
  324: { name:'Guinée',               status:'vf', detail:'Sans visa · 90 jours' },
  226: { name:'Guinée Équatoriale',   status:'vf', detail:'Sans visa · 30 jours' },
  332: { name:'Haïti',                status:'vf', detail:'Sans visa · 3 mois' },
  344: { name:'Hong Kong',            status:'vf', detail:'Sans visa · 30 jours' },
  364: { name:'Iran',                 status:'vf', detail:'Sans visa · 15 jours (tourisme uniquement, dans les 180j)' },
  392: { name:'Japon',                status:'vf', detail:'Sans visa · 90 jours' },
  400: { name:'Jordanie',             status:'vf', detail:'Sans visa · 3 mois' },
  404: { name:'Kenya',                status:'vf', detail:'Sans visa · 60 jours' },
  434: { name:'Libye',                status:'vf', detail:'Sans visa' },
  458: { name:'Malaisie',             status:'vf', detail:'Sans visa · 90 jours' },
  466: { name:'Mali',                 status:'vf', detail:'Sans visa' },
  478: { name:'Mauritanie',           status:'vf', detail:'Sans visa' },
  480: { name:'Maurice',              status:'vf', detail:'Sans visa · 90 jours' },
  583: { name:'Micronésie',           status:'vf', detail:'Sans visa · 30 jours' },
  562: { name:'Niger',                status:'vf', detail:'Sans visa · 3 mois' },
  608: { name:'Philippines',          status:'vf', detail:'Sans visa · 30 jours' },
  882: { name:'Samoa',                status:'vf', detail:'Sans visa · 90 jours' },
  686: { name:'Sénégal',              status:'vf', detail:'Sans visa · 90 jours' },
  670: { name:'Saint-Vincent',        status:'vf', detail:'Sans visa · 3 mois' },
  740: { name:'Suriname',             status:'vf', detail:'Sans visa · 90 jours' },
  710: { name:'Afrique du Sud',       status:'vf', detail:'Sans visa · 90 jours' },
  548: { name:'Vanuatu',              status:'vf', detail:'Sans visa · 30 jours' },
  792: { name:'Turquie',              status:'vf', detail:'Sans visa · 90 jours sur 180' },

  /* ══════════════════════════════════════════════
     🛬  VISA À L'ARRIVÉE
  ══════════════════════════════════════════════ */
  50:  { name:'Bangladesh',           status:'voa', detail:'Visa à l\'arrivée · 30 jours' },
  68:  { name:'Bolivie',              status:'voa', detail:'Visa en ligne ou à l\'arrivée · 30 jours' },
  854: { name:'Burkina Faso',         status:'voa', detail:'eVisa ou VOA' },
  108: { name:'Burundi',              status:'voa', detail:'Visa à l\'arrivée · 1 mois' },
  116: { name:'Cambodge',             status:'voa', detail:'eVisa ou VOA · 30 jours' },
  132: { name:'Cap-Vert',             status:'voa', detail:'Visa à l\'arrivée' },
  174: { name:'Comores',              status:'voa', detail:'Visa à l\'arrivée · 45 jours' },
  231: { name:'Éthiopie',             status:'voa', detail:'eVisa ou VOA à Addis-Abeba · jusqu\'à 90 jours' },
  288: { name:'Ghana',                status:'voa', detail:'Visa à l\'arrivée · 30 jours' },
  624: { name:'Guinée-Bissau',        status:'voa', detail:'Visa à l\'arrivée · 90 jours' },
  360: { name:'Indonésie',            status:'voa', detail:'e-VOA ou VOA · 30 jours' },
  418: { name:'Laos',                 status:'voa', detail:'eVisa ou VOA · 30 jours (18/33 postes frontière seulement)' },
  422: { name:'Liban',                status:'voa', detail:'VOA conditionnel · 30 jours · uniquement aéroport Beyrouth' },
  450: { name:'Madagascar',           status:'voa', detail:'eVisa ou VOA · 60 jours' },
  462: { name:'Maldives',             status:'voa', detail:'VOA gratuit · 30 jours' },
  508: { name:'Mozambique',           status:'voa', detail:'eVisa ou VOA · 30 jours' },
  524: { name:'Népal',                status:'voa', detail:'Visa en ligne ou à l\'arrivée · jusqu\'à 90 jours' },
  558: { name:'Nicaragua',            status:'voa', detail:'Visa à l\'arrivée · 90 jours' },
  516: { name:'Namibie',              status:'voa', detail:'Visa à l\'arrivée · 90 jours' },
  585: { name:'Palaos',               status:'voa', detail:'VOA gratuit · 30 jours' },
  646: { name:'Rwanda',               status:'voa', detail:'eVisa ou VOA · 3 mois' },
  694: { name:'Sierra Leone',         status:'voa', detail:'eVisa ou VOA' },
  834: { name:'Tanzanie',             status:'voa', detail:'eVisa ou VOA · 90 jours' },
  764: { name:'Thaïlande',            status:'voa', detail:'Visa à l\'arrivée · 15 jours' },
  626: { name:'Timor-Leste',          status:'voa', detail:'Visa à l\'arrivée · 30 jours' },
  798: { name:'Tuvalu',               status:'voa', detail:'Visa à l\'arrivée · 1 mois' },
  48:  { name:'Bahreïn',              status:'voa', detail:'eVisa ou VOA · 14 jours' },

  /* ══════════════════════════════════════════════
     📱  eTA — autorisation en ligne légère
  ══════════════════════════════════════════════ */
  504: { name:'Maroc',                status:'eta', detail:'Electronic Travel Authorization · gratuit' },
  410: { name:'Corée du Sud',         status:'eta', detail:'K-ETA en ligne · 30 jours · valable 3 ans' },
  690: { name:'Seychelles',           status:'eta', detail:'Electronic Border System · gratuit · 3 mois' },
  586: { name:'Pakistan',             status:'eta', detail:'ETA gratuit ou visa en ligne · 30 jours / 3 mois' },

  /* ══════════════════════════════════════════════
     💻  eVISA — visa en ligne obligatoire
  ══════════════════════════════════════════════ */
  28:  { name:'Antigua-et-Barbuda',   status:'evisa', detail:'eVisa en ligne' },
  51:  { name:'Arménie',              status:'evisa', detail:'eVisa · 120 jours (ou VOA pour titres Schengen valides)' },
  44:  { name:'Bahamas',              status:'evisa', detail:'eVisa en ligne' },
  64:  { name:'Bhoutan',              status:'evisa', detail:'eVisa (ou VOA avec demande approuvée)' },
  72:  { name:'Botswana',             status:'evisa', detail:'eVisa · 3 mois' },
  120: { name:'Cameroun',             status:'evisa', detail:'eVisa · pré-autorisation "Délégué Général de la Sûreté"' },
  180: { name:'Rép. Dém. du Congo',   status:'evisa', detail:'eVisa · 7 jours' },
  170: { name:'Colombie',             status:'evisa', detail:'Visa en ligne obligatoire (gratuit)' },
  192: { name:'Cuba',                 status:'evisa', detail:'Tourist card · 90 jours · accessible avec titre de séjour UE' },
  262: { name:'Djibouti',             status:'evisa', detail:'eVisa · 90 jours' },
  266: { name:'Gabon',                status:'evisa', detail:'eVisa · 90 jours · arrivée via Libreville uniquement' },
  368: { name:'Irak',                 status:'evisa', detail:'eVisa en ligne' },
  398: { name:'Kazakhstan',           status:'evisa', detail:'eVisa en ligne' },
  417: { name:'Kirghizistan',         status:'evisa', detail:'eVisa en ligne' },
  426: { name:'Lesotho',              status:'evisa', detail:'eVisa en ligne' },
  566: { name:'Nigeria',              status:'evisa', detail:'eVisa · 90 jours' },
  860: { name:'Ouzbékistan',          status:'evisa', detail:'eVisa · 30 jours' },
  598: { name:'Papouasie-Nvl-Guinée', status:'evisa', detail:'eVisa · 60 jours' },
  634: { name:'Qatar',                status:'evisa', detail:'eVisa via plateforme Hayya' },
  678: { name:'São Tomé-et-Príncipe', status:'evisa', detail:'eVisa en ligne' },
  706: { name:'Somalie',              status:'evisa', detail:'eVisa · 30 jours (Mogadiscio, Bosaso, Galcaio)' },
  728: { name:'Soudan du Sud',        status:'evisa', detail:'eVisa · imprimé requis à l\'entrée' },
  144: { name:'Sri Lanka',            status:'evisa', detail:'eVisa ou VOA · 60 jours (max 6 mois/an)' },
  762: { name:'Tadjikistan',          status:'evisa', detail:'eVisa · 60 jours' },
  768: { name:'Togo',                 status:'evisa', detail:'eVisa · 15 jours' },
  800: { name:'Ouganda',              status:'evisa', detail:'eVisa · 3 mois' },
  704: { name:'Vietnam',              status:'evisa', detail:'eVisa · 90 jours · multi-entrées' },
  894: { name:'Zambie',               status:'evisa', detail:'eVisa en ligne' },
  716: { name:'Zimbabwe',             status:'evisa', detail:'eVisa en ligne' },

  /* ══════════════════════════════════════════════
     🔵  BLUE CARD — ZONE SCHENGEN (28 pays)
  ══════════════════════════════════════════════ */
  40:  { name:'Autriche',             status:'bc_schengen', detail:'Zone Schengen · titre de séjour allemand · 90j/180j' },
  56:  { name:'Belgique',             status:'bc_schengen', detail:'Zone Schengen · titre de séjour allemand · 90j/180j' },
  100: { name:'Bulgarie',             status:'bc_schengen', detail:'Zone Schengen · titre de séjour allemand · 90j/180j' },
  191: { name:'Croatie',              status:'bc_schengen', detail:'Zone Schengen · titre de séjour allemand · 90j/180j' },
  203: { name:'Rép. Tchèque',         status:'bc_schengen', detail:'Zone Schengen · titre de séjour allemand · 90j/180j' },
  208: { name:'Danemark',             status:'bc_schengen', detail:'Zone Schengen · titre de séjour allemand · 90j/180j' },
  233: { name:'Estonie',              status:'bc_schengen', detail:'Zone Schengen · titre de séjour allemand · 90j/180j' },
  246: { name:'Finlande',             status:'bc_schengen', detail:'Zone Schengen · titre de séjour allemand · 90j/180j' },
  250: { name:'France',               status:'bc_schengen', detail:'Zone Schengen · titre de séjour allemand · 90j/180j' },
  300: { name:'Grèce',                status:'bc_schengen', detail:'Zone Schengen · titre de séjour allemand · 90j/180j' },
  348: { name:'Hongrie',              status:'bc_schengen', detail:'Zone Schengen · titre de séjour allemand · 90j/180j' },
  352: { name:'Islande',              status:'bc_schengen', detail:'Zone Schengen · titre de séjour allemand · 90j/180j' },
  380: { name:'Italie',               status:'bc_schengen', detail:'Zone Schengen · titre de séjour allemand · 90j/180j' },
  428: { name:'Lettonie',             status:'bc_schengen', detail:'Zone Schengen · titre de séjour allemand · 90j/180j' },
  438: { name:'Liechtenstein',        status:'bc_schengen', detail:'Zone Schengen · titre de séjour allemand · 90j/180j' },
  440: { name:'Lituanie',             status:'bc_schengen', detail:'Zone Schengen · titre de séjour allemand · 90j/180j' },
  442: { name:'Luxembourg',           status:'bc_schengen', detail:'Zone Schengen · titre de séjour allemand · 90j/180j' },
  470: { name:'Malte',                status:'bc_schengen', detail:'Zone Schengen · titre de séjour allemand · 90j/180j' },
  528: { name:'Pays-Bas',             status:'bc_schengen', detail:'Zone Schengen · titre de séjour allemand · 90j/180j' },
  578: { name:'Norvège',              status:'bc_schengen', detail:'Zone Schengen · titre de séjour allemand · 90j/180j' },
  616: { name:'Pologne',              status:'bc_schengen', detail:'Zone Schengen · titre de séjour allemand · 90j/180j' },
  620: { name:'Portugal',             status:'bc_schengen', detail:'Zone Schengen · titre de séjour allemand · 90j/180j' },
  642: { name:'Roumanie',             status:'bc_schengen', detail:'Zone Schengen · titre de séjour allemand · 90j/180j' },
  703: { name:'Slovaquie',            status:'bc_schengen', detail:'Zone Schengen · titre de séjour allemand · 90j/180j' },
  705: { name:'Slovénie',             status:'bc_schengen', detail:'Zone Schengen · titre de séjour allemand · 90j/180j' },
  724: { name:'Espagne',              status:'bc_schengen', detail:'Zone Schengen · titre de séjour allemand · 90j/180j' },
  752: { name:'Suède',                status:'bc_schengen', detail:'Zone Schengen · titre de séjour allemand · 90j/180j' },
  756: { name:'Suisse',               status:'bc_schengen', detail:'Zone Schengen · titre de séjour allemand · 90j/180j' },

  /* ══════════════════════════════════════════════
     🟣  BLUE CARD — HORS SCHENGEN
  ══════════════════════════════════════════════ */
  8:   { name:'Albanie',              status:'bc_extra', detail:'Titre de séjour Schengen · 90 jours' },
  20:  { name:'Andorre',              status:'bc_extra', detail:'Accès via France ou Espagne · titre Schengen' },
  70:  { name:'Bosnie-Herzégovine',   status:'bc_extra', detail:'Visa Schengen multi-entrées accepté · 30 jours' },
  196: { name:'Chypre',               status:'bc_extra', detail:'Titre de séjour Schengen · 90 jours' },
  268: { name:'Géorgie',              status:'bc_extra', detail:'Visa EEE/Schengen accepté · 90 jours' },
  818: { name:'Égypte',               status:'bc_extra', detail:'VOA simplifié avec titre Schengen · 30 jours' },
  414: { name:'Koweït',               status:'bc_extra', detail:'Résidents Schengen · visa facilité (à confirmer)' },
  807: { name:'Macédoine du Nord',    status:'bc_extra', detail:'Visa Schengen multi-entrées · 90 jours' },
  498: { name:'Moldavie',             status:'bc_extra', detail:'eVisa facilité pour résidents Schengen' },
  492: { name:'Monaco',               status:'bc_extra', detail:'Accès via France · titre Schengen' },
  499: { name:'Monténégro',           status:'bc_extra', detail:'Visa Schengen accepté · 30 jours' },
  512: { name:'Oman',                 status:'bc_extra', detail:'14 jours gratuits pour résidents Schengen' },
  682: { name:'Arabie Saoudite',      status:'bc_extra', detail:'VOA avec visa Schengen valide · 90 jours' },
  688: { name:'Serbie',               status:'bc_extra', detail:'Visa Schengen multi-entrées · 90 jours' },
  674: { name:'Saint-Marin',          status:'bc_extra', detail:'Accès via Italie · titre Schengen' },
  702: { name:'Singapour',            status:'bc_extra', detail:'Titre de séjour Schengen · 30 jours' },
  158: { name:'Taïwan',               status:'bc_extra', detail:'TAC en ligne gratuit · 90 jours · avec titre Schengen' },
  784: { name:'Émirats Arabes Unis',  status:'bc_extra', detail:'Visa facilité · résidents Schengen · 30 jours' },
  214: { name:'Rép. Dominicaine',     status:'bc_extra', detail:'Visa Schengen accepté · 90 jours' },
  222: { name:'El Salvador',          status:'bc_extra', detail:'Visa Schengen accepté · 90 jours' },
  320: { name:'Guatemala',            status:'bc_extra', detail:'Visa Schengen accepté · 90 jours' },
  340: { name:'Honduras',             status:'bc_extra', detail:'Visa Schengen accepté · 90 jours' },
  591: { name:'Panama',               status:'bc_extra', detail:'Visa UE/Schengen accepté · 90 jours' },
  604: { name:'Pérou',                status:'bc_extra', detail:'Titre de séjour Schengen · 90 jours' },
};

/* ═══════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════ */

function getColor(id) {
  const d = ACCESS[id];
  return d ? (C[d.status] || C.none) : C.none;
}

function lighten(hex, amt) {
  const n = parseInt(hex.replace('#',''), 16);
  const r = Math.min(255, (n >> 16)         + amt);
  const g = Math.min(255, ((n >> 8) & 0xFF) + amt);
  const b = Math.min(255, (n & 0xFF)        + amt);
  return `rgb(${r},${g},${b})`;
}

function countDestinations() {
  return Object.values(ACCESS).filter(v => v.status !== 'passport').length;
}

/* ═══════════════════════════════════════════════════
   STARS
═══════════════════════════════════════════════════ */

function initStars() {
  const canvas = document.getElementById('stars-canvas');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');

  const bg = ctx.createRadialGradient(
    canvas.width*.3, canvas.height*.2, 0,
    canvas.width*.3, canvas.height*.2, canvas.width*.5
  );
  bg.addColorStop(0, 'rgba(20,40,100,0.12)');
  bg.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 320; i++) {
    ctx.beginPath();
    ctx.arc(Math.random()*canvas.width, Math.random()*canvas.height,
            Math.random()*.9+.15, 0, Math.PI*2);
    ctx.fillStyle = `rgba(190,215,255,${Math.random()*.6+.15})`;
    ctx.fill();
  }
  for (let i = 0; i < 25; i++) {
    const x = Math.random()*canvas.width, y = Math.random()*canvas.height;
    const r = 1.2 + Math.random()*.8;
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.fill();
    const halo = ctx.createRadialGradient(x,y,0,x,y,r*5);
    halo.addColorStop(0,'rgba(180,210,255,0.22)');
    halo.addColorStop(1,'rgba(180,210,255,0)');
    ctx.beginPath(); ctx.arc(x,y,r*5,0,Math.PI*2);
    ctx.fillStyle = halo; ctx.fill();
  }
}

/* ═══════════════════════════════════════════════════
   GLOBE
═══════════════════════════════════════════════════ */

const W = 560, H = 560, RADIUS = 254;
let autoRotate = true, isDragging = false, selectedId = null;

const projection = d3.geoOrthographic()
  .scale(RADIUS).translate([W/2,H/2]).rotate([10,-28]).clipAngle(90);
const pathGen = d3.geoPath().projection(projection);

const svg  = d3.select('#globe');
const defs = svg.append('defs');

const ag = defs.append('radialGradient').attr('id','atmos')
  .attr('cx','50%').attr('cy','50%').attr('r','50%');
ag.append('stop').attr('offset','85%').attr('stop-color','rgba(0,0,0,0)');
ag.append('stop').attr('offset','95%').attr('stop-color','rgba(60,130,255,0.18)');
ag.append('stop').attr('offset','100%').attr('stop-color','rgba(80,160,255,0.32)');

const sg = defs.append('radialGradient').attr('id','nightSide')
  .attr('cx','68%').attr('cy','50%').attr('r','60%').attr('fx','75%').attr('fy','50%');
sg.append('stop').attr('offset','0%').attr('stop-color','rgba(0,2,8,0)');
sg.append('stop').attr('offset','75%').attr('stop-color','rgba(0,2,8,0.18)');
sg.append('stop').attr('offset','100%').attr('stop-color','rgba(0,2,8,0.55)');

const lOcean = svg.append('g'), lGrat = svg.append('g'),
      lCntry = svg.append('g'), lBord = svg.append('g'), lAtmos = svg.append('g');

lOcean.append('circle').attr('cx',W/2).attr('cy',H/2).attr('r',RADIUS).attr('fill',C.ocean);

const gratPath = lGrat.append('path').datum(d3.geoGraticule()())
  .attr('fill','none').attr('stroke',C.graticule).attr('stroke-width',0.45).attr('d',pathGen);

[['url(#atmos)',null],['url(#nightSide)',null],['none',C.atmosphere]].forEach(([fill,stroke])=>{
  lAtmos.append('circle').attr('cx',W/2).attr('cy',H/2).attr('r',RADIUS)
    .attr('fill',fill).attr('stroke',stroke||'none').attr('stroke-width',stroke?1.5:0)
    .attr('pointer-events','none');
});

/* ─── Load world data ─── */
const loadingEl = document.getElementById('loading');

fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
  .then(r=>{ if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); })
  .then(world=>{
    loadingEl.style.display = 'none';
    const cf = topojson.feature(world, world.objects.countries);
    const bf = topojson.mesh(world, world.objects.countries, (a,b)=>a!==b);

    lCntry.selectAll('path.country').data(cf.features).join('path')
      .attr('class','country').attr('d',pathGen).attr('fill',d=>getColor(d.id))
      .on('mouseover',onMouseOver).on('mousemove',onMouseMove)
      .on('mouseout',onMouseOut).on('click',onCountryClick);

    lBord.append('path').datum(bf)
      .attr('fill','none').attr('stroke',C.border)
      .attr('stroke-width',0.35).attr('stroke-linejoin','round').attr('d',pathGen);

    animCount(document.getElementById('total-n'), countDestinations());
    initLegend();
    requestAnimationFrame(tick);
  })
  .catch(err=>{ loadingEl.innerHTML='⚠️ Erreur de chargement'; console.error(err); });

function updatePaths() {
  lCntry.selectAll('.country').attr('d',pathGen);
  lBord.selectAll('path').attr('d',pathGen);
  gratPath.attr('d',pathGen);
}

/* ─── Drag ─── */
let dragStart = null;
svg.call(d3.drag()
  .on('start',(e)=>{
    isDragging=true; autoRotate=false;
    dragStart={rotate:[...projection.rotate()], pos:d3.pointer(e,svg.node())};
    svg.style('cursor','grabbing');
  })
  .on('drag',(e)=>{
    if(!dragStart) return;
    const p=d3.pointer(e,svg.node()), k=90/projection.scale();
    projection.rotate([
      dragStart.rotate[0]+(p[0]-dragStart.pos[0])*k,
      Math.max(-90,Math.min(90,dragStart.rotate[1]-(p[1]-dragStart.pos[1])*k))
    ]);
    updatePaths();
  })
  .on('end',()=>{
    isDragging=false; dragStart=null;
    svg.style('cursor','grab');
    setTimeout(()=>{ autoRotate=true; },3500);
  })
);

/* ─── Animation loop ─── */
let lastTs=0;
function tick(ts){
  requestAnimationFrame(tick);
  if(!autoRotate||isDragging) return;
  const dt=ts-lastTs; lastTs=ts;
  if(dt>0&&dt<120){
    const r=projection.rotate();
    projection.rotate([r[0]+0.06,r[1]]);
    updatePaths();
  }
}

/* ─── Tooltip & Info panel ─── */
const tooltip     = document.getElementById('tooltip');
const infoDefault = document.getElementById('info-default');
const infoDetail  = document.getElementById('info-detail');
const infoName    = document.getElementById('info-name');
const infoBadge   = document.getElementById('info-badge');
const infoDesc    = document.getElementById('info-desc');

function onMouseOver(event,d){
  const data=ACCESS[d.id]; if(!data) return;
  if(String(d.id)!==selectedId) d3.select(this).attr('fill',lighten(getColor(d.id),38));
  tooltip.textContent=data.name; tooltip.style.display='block';
}
function onMouseMove(event){
  tooltip.style.left=(event.pageX+16)+'px';
  tooltip.style.top=(event.pageY-38)+'px';
}
function onMouseOut(event,d){
  if(String(d.id)!==selectedId) d3.select(this).attr('fill',getColor(d.id));
  tooltip.style.display='none';
}
function onCountryClick(event,d){
  const idStr=String(d.id), data=ACCESS[d.id];
  if(selectedId){
    const prev=parseInt(selectedId);
    lCntry.selectAll('.country').filter(fd=>fd.id===prev).attr('fill',fd=>getColor(fd.id));
  }
  if(data){
    selectedId=idStr;
    d3.select(this).attr('fill',lighten(getColor(d.id),55));
    infoDefault.classList.add('hidden'); infoDetail.classList.remove('hidden');
    infoName.textContent=data.name; infoBadge.textContent=LABELS[data.status]||'—';
    const col=C[data.status]||'#888';
    infoBadge.style.background=col+'22'; infoBadge.style.color=col; infoBadge.style.borderColor=col+'55';
    infoDesc.textContent=data.detail;
    autoRotate=false; setTimeout(()=>{ if(!isDragging) autoRotate=true; },4000);
  } else {
    selectedId=null; infoDefault.classList.remove('hidden'); infoDetail.classList.add('hidden');
  }
  event.stopPropagation();
}
svg.on('click',(event)=>{
  if(!event.target.classList.contains('country')){
    if(selectedId){
      const prev=parseInt(selectedId);
      lCntry.selectAll('.country').filter(fd=>fd.id===prev).attr('fill',fd=>getColor(fd.id));
    }
    selectedId=null; infoDefault.classList.remove('hidden'); infoDetail.classList.add('hidden');
  }
});

/* ─── Legend filter ─── */
function initLegend(){
  document.querySelectorAll('.leg').forEach(leg=>{
    leg.addEventListener('click',()=>{
      const status=leg.dataset.status, isActive=leg.classList.contains('active');
      document.querySelectorAll('.leg').forEach(l=>l.classList.remove('active','dimmed'));
      if(!isActive){
        document.querySelectorAll('.leg').forEach(l=>
          l.classList.add(l.dataset.status===status?'active':'dimmed')
        );
        lCntry.selectAll('.country').attr('fill',d=>{
          const data=ACCESS[d.id];
          if(!data) return status==='none'?lighten(C.none,25):'#050b18';
          return data.status===status?lighten(C[data.status],30):'#050b18';
        });
      } else {
        lCntry.selectAll('.country').attr('fill',d=>getColor(d.id));
        selectedId=null;
      }
    });
  });
}

/* ─── Counter animation ─── */
function animCount(el,target){
  let cur=0; const step=Math.ceil(target/50);
  const iv=setInterval(()=>{
    cur=Math.min(cur+step,target);
    el.textContent=cur>=target?target+'+':cur;
    if(cur>=target) clearInterval(iv);
  },22);
}

initStars();
