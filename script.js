/* ═══════════════════════════════════════════════════
   GLOBE DU VOYAGEUR — script.js
   Passeport Tunisien + Blue Card Allemande
   ═══════════════════════════════════════════════════ */

'use strict';

// ─── COLORS ──────────────────────────────────────────

const C = {
  home:        '#ffd700',
  passport:    '#ff6040',
  vf:          '#00e676',
  voa:         '#ffaa00',
  eta:         '#00d4ff',
  bc_schengen: '#4488ff',
  bc_extra:    '#9966ff',
  none:        '#0c1528',
  ocean:       '#060e1e',
  graticule:   'rgba(38, 70, 140, 0.28)',
  border:      'rgba(16, 38, 90, 0.85)',
  atmosphere:  'rgba(60, 130, 255, 0.32)',
};

// ─── STATUS LABELS ────────────────────────────────────

const LABELS = {
  home:        '🏠 Résidence Blue Card',
  passport:    '🛂 Pays de nationalité',
  vf:          '✅ Sans visa · passeport TN',
  voa:         '🛬 Visa à l\'arrivée',
  eta:         '📱 eTA — autorisation en ligne',
  bc_schengen: '🔵 Blue Card · Zone Schengen',
  bc_extra:    '🟣 Blue Card · Hors Schengen',
  none:        '❌ Visa ambassade requis',
};

// ─── ACCESS DATA (ISO 3166-1 numeric → status) ────────
// Keys are plain integers (no leading zeros) as returned by world-atlas d.id

const ACCESS = {

  /* ── NATIONALITÉ ── */
  788:  { name: 'Tunisie',             status: 'passport',    detail: 'Passeport tunisien · votre nationalité' },

  /* ── RÉSIDENCE ── */
  276:  { name: 'Allemagne',           status: 'home',        detail: 'Blue Card émise ici · résidence principale · libre circulation Schengen' },

  /* ══ SANS VISA · passeport tunisien seul ══ */

  // Afrique
  12:   { name: 'Algérie',             status: 'vf',  detail: 'Sans visa · jusqu\'à 3 mois' },
  204:  { name: 'Bénin',               status: 'vf',  detail: 'Sans visa' },
  384:  { name: 'Côte d\'Ivoire',      status: 'vf',  detail: 'Sans visa' },
  266:  { name: 'Gabon',               status: 'vf',  detail: 'Sans visa' },
  270:  { name: 'Gambie',              status: 'vf',  detail: 'Sans visa' },
  324:  { name: 'Guinée',              status: 'vf',  detail: 'Sans visa' },
  226:  { name: 'Guinée Équatoriale',  status: 'vf',  detail: 'Sans visa' },
  404:  { name: 'Kenya',               status: 'vf',  detail: 'Sans visa · 30 jours' },
  434:  { name: 'Libye',               status: 'vf',  detail: 'Sans visa' },
  466:  { name: 'Mali',                status: 'vf',  detail: 'Sans visa' },
  504:  { name: 'Maroc',               status: 'vf',  detail: 'Sans visa · accord bilatéral' },
  478:  { name: 'Mauritanie',          status: 'vf',  detail: 'Sans visa' },
  480:  { name: 'Maurice',             status: 'vf',  detail: 'Sans visa · 1 mois' },
  562:  { name: 'Niger',               status: 'vf',  detail: 'Sans visa' },
  646:  { name: 'Rwanda',              status: 'vf',  detail: 'Sans visa · 30 jours' },
  686:  { name: 'Sénégal',             status: 'vf',  detail: 'Sans visa · 90 jours' },
  710:  { name: 'Afrique du Sud',      status: 'vf',  detail: 'Sans visa · 30 jours' },

  // Asie / Pacifique
  392:  { name: 'Japon',               status: 'vf',  detail: 'Sans visa · 90 jours' },
  458:  { name: 'Malaisie',            status: 'vf',  detail: 'Sans visa · 30 jours' },
  608:  { name: 'Philippines',         status: 'vf',  detail: 'Sans visa · 30 jours' },
  344:  { name: 'Hong Kong',           status: 'vf',  detail: 'Sans visa · 30 jours' },
  242:  { name: 'Fidji',               status: 'vf',  detail: 'Sans visa · 4 mois' },
  583:  { name: 'Micronésie',          status: 'vf',  detail: 'Sans visa' },
  548:  { name: 'Vanuatu',             status: 'vf',  detail: 'Sans visa · 30 jours' },

  // Moyen-Orient
  364:  { name: 'Iran',                status: 'vf',  detail: 'Sans visa · 15 jours' },
  275:  { name: 'Palestine',           status: 'vf',  detail: 'Sans visa' },
  760:  { name: 'Syrie',               status: 'vf',  detail: 'Sans visa · vérifier la situation sécuritaire' },

  // Amériques & Caraïbes
  52:   { name: 'Barbade',             status: 'vf',  detail: 'Sans visa · 6 mois' },
  84:   { name: 'Belize',              status: 'vf',  detail: 'Sans visa · 1 mois' },
  76:   { name: 'Brésil',              status: 'vf',  detail: 'Sans visa · 90 jours' },
  212:  { name: 'Dominique',           status: 'vf',  detail: 'Sans visa · 6 mois' },
  218:  { name: 'Équateur',            status: 'vf',  detail: 'Sans visa · 90 jours' },
  332:  { name: 'Haïti',               status: 'vf',  detail: 'Sans visa · 3 mois' },
  670:  { name: 'Saint-Vincent',       status: 'vf',  detail: 'Sans visa · 1 mois' },

  // Europe
  792:  { name: 'Turquie',             status: 'vf',  detail: 'Sans visa · 90 jours sur 180' },

  /* ══ VISA À L'ARRIVÉE ══ */

  // Afrique
  108:  { name: 'Burundi',             status: 'voa', detail: 'Visa à l\'arrivée · 30 jours' },
  174:  { name: 'Comores',             status: 'voa', detail: 'Visa à l\'arrivée · 45 jours' },
  262:  { name: 'Djibouti',            status: 'voa', detail: 'Visa à l\'arrivée · 1 mois' },
  231:  { name: 'Éthiopie',            status: 'voa', detail: 'Visa à l\'arrivée · 30 jours' },
  288:  { name: 'Ghana',               status: 'voa', detail: 'Visa à l\'arrivée · 30 jours' },
  624:  { name: 'Guinée-Bissau',       status: 'voa', detail: 'Visa à l\'arrivée' },
  450:  { name: 'Madagascar',          status: 'voa', detail: 'Visa à l\'arrivée · 30 jours' },
  508:  { name: 'Mozambique',          status: 'voa', detail: 'Visa à l\'arrivée · 30 jours' },
  516:  { name: 'Namibie',             status: 'voa', detail: 'Visa à l\'arrivée' },
  694:  { name: 'Sierra Leone',        status: 'voa', detail: 'Visa à l\'arrivée' },
  706:  { name: 'Somalie',             status: 'voa', detail: 'Visa à l\'arrivée' },
  834:  { name: 'Tanzanie',            status: 'voa', detail: 'Visa à l\'arrivée · 90 jours' },

  // Asie
  116:  { name: 'Cambodge',            status: 'voa', detail: 'Visa à l\'arrivée · 30 jours' },
  360:  { name: 'Indonésie',           status: 'voa', detail: 'Visa à l\'arrivée · 30 jours' },
  400:  { name: 'Jordanie',            status: 'voa', detail: 'Visa à l\'arrivée · 30 jours' },
  418:  { name: 'Laos',                status: 'voa', detail: 'Visa à l\'arrivée · 30 jours' },
  422:  { name: 'Liban',               status: 'voa', detail: 'Visa à l\'arrivée · 1 mois' },
  462:  { name: 'Maldives',            status: 'voa', detail: 'Visa à l\'arrivée · 30 jours (gratuit)' },
  524:  { name: 'Népal',               status: 'voa', detail: 'Visa à l\'arrivée · 15/30/90 jours' },
  586:  { name: 'Pakistan',            status: 'voa', detail: 'Visa à l\'arrivée' },
  585:  { name: 'Palaos',              status: 'voa', detail: 'Visa à l\'arrivée · 30 jours' },
  882:  { name: 'Samoa',               status: 'voa', detail: 'Visa à l\'arrivée · 60 jours' },
  762:  { name: 'Tadjikistan',         status: 'voa', detail: 'Visa à l\'arrivée · 45 jours' },
  764:  { name: 'Thaïlande',           status: 'voa', detail: 'Visa à l\'arrivée · 15 jours' },
  626:  { name: 'Timor-Leste',         status: 'voa', detail: 'Visa à l\'arrivée · 30 jours' },
  798:  { name: 'Tuvalu',              status: 'voa', detail: 'Visa à l\'arrivée · 1 mois' },

  /* ══ eTA ══ */
  410:  { name: 'Corée du Sud',        status: 'eta', detail: 'K-ETA en ligne · gratuit · 2 ans' },
  690:  { name: 'Seychelles',          status: 'eta', detail: 'Travel Authorization · en ligne · gratuit' },
  144:  { name: 'Sri Lanka',           status: 'eta', detail: 'ETA en ligne · ~35 USD' },

  /* ══ BLUE CARD — ZONE SCHENGEN ══ */
  40:   { name: 'Autriche',            status: 'bc_schengen', detail: 'Zone Schengen · titre de séjour allemand · 90j/180j' },
  56:   { name: 'Belgique',            status: 'bc_schengen', detail: 'Zone Schengen · titre de séjour allemand · 90j/180j' },
  100:  { name: 'Bulgarie',            status: 'bc_schengen', detail: 'Zone Schengen · titre de séjour allemand · 90j/180j' },
  191:  { name: 'Croatie',             status: 'bc_schengen', detail: 'Zone Schengen · titre de séjour allemand · 90j/180j' },
  203:  { name: 'Rép. Tchèque',        status: 'bc_schengen', detail: 'Zone Schengen · titre de séjour allemand · 90j/180j' },
  208:  { name: 'Danemark',            status: 'bc_schengen', detail: 'Zone Schengen · titre de séjour allemand · 90j/180j' },
  233:  { name: 'Estonie',             status: 'bc_schengen', detail: 'Zone Schengen · titre de séjour allemand · 90j/180j' },
  246:  { name: 'Finlande',            status: 'bc_schengen', detail: 'Zone Schengen · titre de séjour allemand · 90j/180j' },
  250:  { name: 'France',              status: 'bc_schengen', detail: 'Zone Schengen · titre de séjour allemand · 90j/180j' },
  300:  { name: 'Grèce',               status: 'bc_schengen', detail: 'Zone Schengen · titre de séjour allemand · 90j/180j' },
  348:  { name: 'Hongrie',             status: 'bc_schengen', detail: 'Zone Schengen · titre de séjour allemand · 90j/180j' },
  352:  { name: 'Islande',             status: 'bc_schengen', detail: 'Zone Schengen · titre de séjour allemand · 90j/180j' },
  380:  { name: 'Italie',              status: 'bc_schengen', detail: 'Zone Schengen · titre de séjour allemand · 90j/180j' },
  428:  { name: 'Lettonie',            status: 'bc_schengen', detail: 'Zone Schengen · titre de séjour allemand · 90j/180j' },
  438:  { name: 'Liechtenstein',       status: 'bc_schengen', detail: 'Zone Schengen · titre de séjour allemand · 90j/180j' },
  440:  { name: 'Lituanie',            status: 'bc_schengen', detail: 'Zone Schengen · titre de séjour allemand · 90j/180j' },
  442:  { name: 'Luxembourg',          status: 'bc_schengen', detail: 'Zone Schengen · titre de séjour allemand · 90j/180j' },
  470:  { name: 'Malte',               status: 'bc_schengen', detail: 'Zone Schengen · titre de séjour allemand · 90j/180j' },
  528:  { name: 'Pays-Bas',            status: 'bc_schengen', detail: 'Zone Schengen · titre de séjour allemand · 90j/180j' },
  578:  { name: 'Norvège',             status: 'bc_schengen', detail: 'Zone Schengen · titre de séjour allemand · 90j/180j' },
  616:  { name: 'Pologne',             status: 'bc_schengen', detail: 'Zone Schengen · titre de séjour allemand · 90j/180j' },
  620:  { name: 'Portugal',            status: 'bc_schengen', detail: 'Zone Schengen · titre de séjour allemand · 90j/180j' },
  642:  { name: 'Roumanie',            status: 'bc_schengen', detail: 'Zone Schengen · titre de séjour allemand · 90j/180j' },
  703:  { name: 'Slovaquie',           status: 'bc_schengen', detail: 'Zone Schengen · titre de séjour allemand · 90j/180j' },
  705:  { name: 'Slovénie',            status: 'bc_schengen', detail: 'Zone Schengen · titre de séjour allemand · 90j/180j' },
  724:  { name: 'Espagne',             status: 'bc_schengen', detail: 'Zone Schengen · titre de séjour allemand · 90j/180j' },
  752:  { name: 'Suède',               status: 'bc_schengen', detail: 'Zone Schengen · titre de séjour allemand · 90j/180j' },
  756:  { name: 'Suisse',              status: 'bc_schengen', detail: 'Zone Schengen · titre de séjour allemand · 90j/180j' },

  /* ══ BLUE CARD — HORS SCHENGEN ══ */

  // Europe non-Schengen
  8:    { name: 'Albanie',             status: 'bc_extra', detail: 'Titre de séjour Schengen accepté · 90 jours' },
  20:   { name: 'Andorre',             status: 'bc_extra', detail: 'Accès via Espagne ou France · 90 jours' },
  51:   { name: 'Arménie',             status: 'bc_extra', detail: 'Visa-free temp. avec titre Schengen (vérifier validité)' },
  70:   { name: 'Bosnie-Herzégovine',  status: 'bc_extra', detail: 'Titre de séjour Schengen · 30 jours / 90j sur 6 mois' },
  196:  { name: 'Chypre',              status: 'bc_extra', detail: 'Titre de séjour Schengen · 90 jours' },
  268:  { name: 'Géorgie',             status: 'bc_extra', detail: 'Titre de séjour Schengen · 90 jours' },
  807:  { name: 'Macédoine du Nord',   status: 'bc_extra', detail: 'Titre de séjour Schengen · 90 jours' },
  498:  { name: 'Moldavie',            status: 'bc_extra', detail: 'Titre de séjour Schengen · 90 jours' },
  492:  { name: 'Monaco',              status: 'bc_extra', detail: 'Accès via France · titre de séjour Schengen' },
  499:  { name: 'Monténégro',          status: 'bc_extra', detail: 'Titre de séjour Schengen · 90 jours' },
  688:  { name: 'Serbie',              status: 'bc_extra', detail: 'Titre de séjour Schengen · 90 jours' },
  674:  { name: 'Saint-Marin',         status: 'bc_extra', detail: 'Accès via Italie · titre de séjour Schengen' },
  826:  { name: 'Royaume-Uni',         status: 'bc_extra', detail: 'Titre de séjour Schengen accepté · jusqu\'à 6 mois' },

  // Moyen-Orient
  818:  { name: 'Égypte',              status: 'bc_extra', detail: 'Visa à l\'arrivée ou simplifié avec titre Schengen · 30j' },
  414:  { name: 'Koweït',              status: 'bc_extra', detail: 'Visa simplifié avec titre Schengen · 14 jours' },
  512:  { name: 'Oman',                status: 'bc_extra', detail: 'eVisa ou visa facilité avec titre Schengen' },
  634:  { name: 'Qatar',               status: 'bc_extra', detail: 'Visa facilité avec titre Schengen' },
  682:  { name: 'Arabie Saoudite',     status: 'bc_extra', detail: 'eVisa disponible avec titre de séjour Schengen' },
  784:  { name: 'Émirats Arabes Unis', status: 'bc_extra', detail: 'Visa facilité · 30 jours avec titre Schengen' },

  // Asie
  702:  { name: 'Singapour',           status: 'bc_extra', detail: 'Titre de séjour Schengen accepté · 30 jours' },
  158:  { name: 'Taïwan',              status: 'bc_extra', detail: 'TAC en ligne gratuit · 90 jours · avec titre Schengen' },

  // Amériques
  28:   { name: 'Antigua-et-Barbuda',  status: 'bc_extra', detail: 'Titre de séjour Schengen · 30 jours' },
  44:   { name: 'Bahamas',             status: 'bc_extra', detail: 'Titre de séjour Schengen · 3 mois' },
  170:  { name: 'Colombie',            status: 'bc_extra', detail: 'Titre de séjour Schengen · 90 jours' },
  188:  { name: 'Costa Rica',          status: 'bc_extra', detail: 'Titre de séjour Schengen · 90 jours' },
  214:  { name: 'Rép. Dominicaine',    status: 'bc_extra', detail: 'Titre de séjour Schengen · 90 jours' },
  222:  { name: 'El Salvador',         status: 'bc_extra', detail: 'Titre de séjour Schengen · 90 jours' },
  320:  { name: 'Guatemala',           status: 'bc_extra', detail: 'Titre de séjour Schengen · 90 jours' },
  340:  { name: 'Honduras',            status: 'bc_extra', detail: 'Titre de séjour Schengen · 90 jours' },
  484:  { name: 'Mexique',             status: 'bc_extra', detail: 'Titre de séjour Schengen permanent · 180 jours' },
  591:  { name: 'Panama',              status: 'bc_extra', detail: 'Titre de séjour Schengen · 90 jours' },
  604:  { name: 'Pérou',               status: 'bc_extra', detail: 'Titre de séjour Schengen · 90 jours' },
};

// ─── HELPERS ─────────────────────────────────────────

function getColor(id) {
  const d = ACCESS[id];
  return d ? (C[d.status] || C.none) : C.none;
}

function lighten(hex, amt) {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (n >> 16)         + amt);
  const g = Math.min(255, ((n >> 8) & 0xFF) + amt);
  const b = Math.min(255, (n & 0xFF)        + amt);
  return `rgb(${r},${g},${b})`;
}

function countDestinations() {
  return Object.values(ACCESS).filter(v => v.status !== 'passport').length;
}

// ─── STARS ───────────────────────────────────────────

function initStars() {
  const canvas = document.getElementById('stars-canvas');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');

  // Background nebula glow
  const bg = ctx.createRadialGradient(
    canvas.width * 0.3, canvas.height * 0.2, 0,
    canvas.width * 0.3, canvas.height * 0.2, canvas.width * 0.5
  );
  bg.addColorStop(0, 'rgba(20, 40, 100, 0.12)');
  bg.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Faint stars
  for (let i = 0; i < 320; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = Math.random() * 0.9 + 0.15;
    const a = Math.random() * 0.6 + 0.15;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(190, 215, 255, ${a})`;
    ctx.fill();
  }

  // Brighter stars with halos
  for (let i = 0; i < 25; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = 1.2 + Math.random() * 0.8;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.fill();
    const halo = ctx.createRadialGradient(x, y, 0, x, y, r * 5);
    halo.addColorStop(0, 'rgba(180, 210, 255, 0.22)');
    halo.addColorStop(1, 'rgba(180, 210, 255, 0)');
    ctx.beginPath();
    ctx.arc(x, y, r * 5, 0, Math.PI * 2);
    ctx.fillStyle = halo;
    ctx.fill();
  }
}

// ─── GLOBE STATE ─────────────────────────────────────

const W = 560, H = 560, RADIUS = 254;

let autoRotate  = true;
let isDragging  = false;
let selectedId  = null;

// D3 projection
const projection = d3.geoOrthographic()
  .scale(RADIUS)
  .translate([W / 2, H / 2])
  .rotate([10, -28])
  .clipAngle(90);

const pathGen = d3.geoPath().projection(projection);

// ─── SVG SETUP ───────────────────────────────────────

const svg = d3.select('#globe');

// SVG defs
const defs = svg.append('defs');

// Atmosphere gradient
const atmosGrd = defs.append('radialGradient')
  .attr('id', 'atmos')
  .attr('cx', '50%').attr('cy', '50%').attr('r', '50%');
atmosGrd.append('stop').attr('offset', '85%').attr('stop-color', 'rgba(0,0,0,0)');
atmosGrd.append('stop').attr('offset', '95%').attr('stop-color', 'rgba(60,130,255,0.18)');
atmosGrd.append('stop').attr('offset', '100%').attr('stop-color', 'rgba(80,160,255,0.32)');

// Night-side shadow gradient
const shadowGrd = defs.append('radialGradient')
  .attr('id', 'nightSide')
  .attr('cx', '68%').attr('cy', '50%').attr('r', '60%')
  .attr('fx', '75%').attr('fy', '50%');
shadowGrd.append('stop').attr('offset', '0%').attr('stop-color', 'rgba(0,2,8,0)');
shadowGrd.append('stop').attr('offset', '75%').attr('stop-color', 'rgba(0,2,8,0.18)');
shadowGrd.append('stop').attr('offset', '100%').attr('stop-color', 'rgba(0,2,8,0.55)');

// Layer groups (order matters for z-index)
const layerOcean     = svg.append('g').attr('class', 'l-ocean');
const layerGraticule = svg.append('g').attr('class', 'l-graticule');
const layerCountries = svg.append('g').attr('class', 'l-countries');
const layerBorders   = svg.append('g').attr('class', 'l-borders');
const layerAtmos     = svg.append('g').attr('class', 'l-atmos');

// Ocean circle
layerOcean.append('circle')
  .attr('cx', W / 2).attr('cy', H / 2).attr('r', RADIUS)
  .attr('fill', C.ocean);

// Graticule path
const graticule = d3.geoGraticule()();
const gratPath = layerGraticule.append('path')
  .datum(graticule)
  .attr('fill', 'none')
  .attr('stroke', C.graticule)
  .attr('stroke-width', 0.45)
  .attr('d', pathGen);

// Atmosphere ring (stays fixed — beautiful limb glow)
layerAtmos.append('circle')
  .attr('cx', W / 2).attr('cy', H / 2).attr('r', RADIUS)
  .attr('fill', 'url(#atmos)')
  .attr('pointer-events', 'none');

// Night-side shadow overlay (also fixed for directional lighting)
layerAtmos.append('circle')
  .attr('cx', W / 2).attr('cy', H / 2).attr('r', RADIUS)
  .attr('fill', 'url(#nightSide)')
  .attr('pointer-events', 'none');

// Globe edge ring
layerAtmos.append('circle')
  .attr('cx', W / 2).attr('cy', H / 2).attr('r', RADIUS)
  .attr('fill', 'none')
  .attr('stroke', C.atmosphere)
  .attr('stroke-width', 1.5)
  .attr('pointer-events', 'none');

// ─── LOAD WORLD DATA ─────────────────────────────────

const loadingEl = document.getElementById('loading');

fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
  .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
  .then(world => {
    loadingEl.style.display = 'none';

    const countriesFeature = topojson.feature(world, world.objects.countries);
    const bordersFeature   = topojson.mesh(world, world.objects.countries, (a, b) => a !== b);

    // Render country fills
    layerCountries.selectAll('path.country')
      .data(countriesFeature.features)
      .join('path')
      .attr('class', 'country')
      .attr('d', pathGen)
      .attr('fill', d => getColor(d.id))
      .on('mouseover', onMouseOver)
      .on('mousemove', onMouseMove)
      .on('mouseout',  onMouseOut)
      .on('click',     onCountryClick);

    // Render country borders
    layerBorders.append('path')
      .datum(bordersFeature)
      .attr('fill', 'none')
      .attr('stroke', C.border)
      .attr('stroke-width', 0.35)
      .attr('stroke-linejoin', 'round')
      .attr('d', pathGen);

    // Update stat counter
    const total = countDestinations();
    animCount(document.getElementById('total-n'), total);

    // Init legend interaction
    initLegend();

    // Start animation loop
    requestAnimationFrame(tick);
  })
  .catch(err => {
    loadingEl.innerHTML = '⚠️ Erreur de chargement — vérifiez votre connexion';
    console.error('Globe fetch error:', err);
  });

// ─── UPDATE ALL PATHS ────────────────────────────────

function updatePaths() {
  layerCountries.selectAll('.country').attr('d', pathGen);
  layerBorders.selectAll('path').attr('d', pathGen);
  gratPath.attr('d', pathGen);
}

// ─── DRAG INTERACTION ────────────────────────────────

let dragStart = null;

const dragHandler = d3.drag()
  .on('start', (event) => {
    isDragging  = true;
    autoRotate  = false;
    dragStart   = {
      rotate: [...projection.rotate()],
      pos: d3.pointer(event, svg.node()),
    };
    svg.style('cursor', 'grabbing');
  })
  .on('drag', (event) => {
    if (!dragStart) return;
    const pos = d3.pointer(event, svg.node());
    const dx  = pos[0] - dragStart.pos[0];
    const dy  = pos[1] - dragStart.pos[1];
    const k   = 90 / projection.scale();
    projection.rotate([
      dragStart.rotate[0] + dx * k,
      Math.max(-90, Math.min(90, dragStart.rotate[1] - dy * k)),
    ]);
    updatePaths();
  })
  .on('end', () => {
    isDragging = false;
    dragStart  = null;
    svg.style('cursor', 'grab');
    setTimeout(() => { autoRotate = true; }, 3500);
  });

svg.call(dragHandler);

// ─── ANIMATION LOOP ──────────────────────────────────

let lastTs = 0;

function tick(ts) {
  requestAnimationFrame(tick);
  if (!autoRotate || isDragging) return;
  const dt = ts - lastTs;
  lastTs = ts;
  if (dt > 0 && dt < 120) {
    const r = projection.rotate();
    projection.rotate([r[0] + 0.06, r[1]]);
    updatePaths();
  }
}

// ─── TOOLTIP & INFO PANEL ────────────────────────────

const tooltip   = document.getElementById('tooltip');
const infoCard  = document.getElementById('info-card');
const infoDefault = document.getElementById('info-default');
const infoDetail  = document.getElementById('info-detail');
const infoName    = document.getElementById('info-name');
const infoBadge   = document.getElementById('info-badge');
const infoDesc    = document.getElementById('info-desc');

function onMouseOver(event, d) {
  const data = ACCESS[d.id];
  if (!data) return;

  // Don't re-highlight selected
  if (String(d.id) !== selectedId) {
    d3.select(this).attr('fill', lighten(getColor(d.id), 38));
  }

  tooltip.textContent = data.name;
  tooltip.style.display = 'block';
}

function onMouseMove(event) {
  tooltip.style.left = (event.pageX + 16) + 'px';
  tooltip.style.top  = (event.pageY - 38) + 'px';
}

function onMouseOut(event, d) {
  if (String(d.id) !== selectedId) {
    d3.select(this).attr('fill', getColor(d.id));
  }
  tooltip.style.display = 'none';
}

function onCountryClick(event, d) {
  const idStr = String(d.id);
  const data  = ACCESS[d.id];

  // Deselect previous
  if (selectedId) {
    const prevId = parseInt(selectedId);
    layerCountries.selectAll('.country')
      .filter(fd => fd.id === prevId)
      .attr('fill', fd => getColor(fd.id));
  }

  if (data) {
    selectedId = idStr;
    d3.select(this).attr('fill', lighten(getColor(d.id), 55));

    // Show info panel
    infoDefault.classList.add('hidden');
    infoDetail.classList.remove('hidden');
    infoName.textContent  = data.name;
    infoBadge.textContent = LABELS[data.status] || '—';

    const col = C[data.status] || '#888';
    infoBadge.style.background   = col + '22';
    infoBadge.style.color        = col;
    infoBadge.style.borderColor  = col + '55';
    infoDesc.textContent = data.detail;

    // Pause rotation briefly
    autoRotate = false;
    setTimeout(() => { if (!isDragging) autoRotate = true; }, 4000);
  } else {
    // Clicked ocean or unknown territory
    selectedId = null;
    infoDefault.classList.remove('hidden');
    infoDetail.classList.add('hidden');
  }

  event.stopPropagation();
}

// Click on ocean → deselect
svg.on('click', (event) => {
  if (!event.target.classList.contains('country')) {
    if (selectedId) {
      const prevId = parseInt(selectedId);
      layerCountries.selectAll('.country')
        .filter(fd => fd.id === prevId)
        .attr('fill', fd => getColor(fd.id));
    }
    selectedId = null;
    infoDefault.classList.remove('hidden');
    infoDetail.classList.add('hidden');
  }
});

// ─── LEGEND FILTER ───────────────────────────────────

function initLegend() {
  const legs = document.querySelectorAll('.leg');

  legs.forEach(leg => {
    leg.addEventListener('click', () => {
      const status = leg.dataset.status;
      const isActive = leg.classList.contains('active');

      // Toggle
      legs.forEach(l => { l.classList.remove('active', 'dimmed'); });

      if (!isActive) {
        legs.forEach(l => {
          if (l.dataset.status === status) {
            l.classList.add('active');
          } else {
            l.classList.add('dimmed');
          }
        });

        // Dim non-matching countries
        layerCountries.selectAll('.country').attr('fill', d => {
          const data = ACCESS[d.id];
          if (!data) return status === 'none' ? lighten(C.none, 25) : '#050b18';
          return data.status === status ? lighten(C[data.status], 30) : '#050b18';
        });
      } else {
        // Reset
        layerCountries.selectAll('.country').attr('fill', d => getColor(d.id));
        selectedId = null;
      }
    });
  });
}

// ─── COUNT ANIMATION ─────────────────────────────────

function animCount(el, target) {
  let cur = 0;
  const step = Math.ceil(target / 50);
  const interval = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = cur >= target ? target + '+' : cur;
    if (cur >= target) clearInterval(interval);
  }, 22);
}

// ─── INIT ────────────────────────────────────────────

initStars();
