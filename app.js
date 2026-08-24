const SOURCES = [
  { kat: "mall", label: "Mall", color: "#E76F51", file: "data/mall.json" },
  { kat: "pasar", label: "Pasar", color: "#2A9D8F", file: "data/pasar.json" },
  { kat: "swalayan", label: "Swalayan", color: "#E9C46A", file: "data/swalayan.json" },
  { kat: "pusat-perbelanjaan", label: "Pusat Perbelanjaan", color: "#264653", file: "data/pusat-perbelanjaan.json" }
];

const map = L.map('map', { zoomControl: true }).setView([-2.5, 118], 5);

// ============================================================
// UBAH KE PETA SATELIT ESRI
// ============================================================
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: '&copy; <a href="https://www.esri.com/">Esri</a> | Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community',
  maxZoom: 19
}).addTo(map);

const clusterGroups = {};
const allItems = [];
let provinsiSet = new Set();

function makeIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="background:${color};width:16px;height:16px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.35);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 16],
    popupAnchor: [0, -14]
  });
}

async function loadSource(src) {
  try {
    const res = await fetch(src.file);
    const json = await res.json();
    const items = json.data || [];

    const cluster = L.markerClusterGroup({ maxClusterRadius: 50 });
    clusterGroups[src.kat] = cluster;

    items.forEach(item => {
      item._kat = src.kat;
      item._label = src.label;
      item._color = src.color;
      provinsiSet.add(item.provinsi);
      allItems.push(item);

      const marker = L.marker([item.lat, item.lng], { icon: makeIcon(src.color) });
      marker.bindPopup(buildPopup(item));
      marker._itemRef = item;
      cluster.addLayer(marker);
    });

    map.addLayer(cluster);
    document.getElementById('count-' + src.kat).textContent = items.length;
  } catch (e) {
    console.error('Gagal memuat', src.file, e);
    document.getElementById('count-' + src.kat).textContent = '!';
  }
}

function buildPopup(item) {
  return `
    <div class="popup-tag" style="background:${item._color}">${item._label}</div>
    <div class="popup-title">${item.nama}</div>
    <div class="popup-row">📍 ${item.alamat}</div>
    <div class="popup-row">🏙️ ${item.kota}, ${item.provinsi}</div>
    <div class="popup-row">🕒 ${item.jam_operasional || '-'}</div>
    <div class="popup-row">☎️ ${item.kontak || '-'}</div>
    ${item.keterangan ? `<div class="popup-row">${item.keterangan}</div>` : ''}
  `;
}

function populateProvinsiFilter() {
  const select = document.getElementById('provinsiFilter');
  [...provinsiSet].sort().forEach(p => {
    const opt = document.createElement('option');
    opt.value = p;
    opt.textContent = p;
    select.appendChild(opt);
  });
}

function renderResultList(items) {
  const list = document.getElementById('resultList');
  document.getElementById('resultCount').textContent = items.length;
  list.innerHTML = '';

  items.slice(0, 200).forEach(item => {
    const card = document.createElement('div');
    card.className = 'result-card';
    card.innerHTML = `
      <div class="rc-name">${item.nama}</div>
      <div class="rc-loc">${item.kota}, ${item.provinsi}</div>
      <span class="rc-kat" style="background:${item._color}">${item._label}</span>
    `;
    card.addEventListener('click', () => {
      map.setView([item.lat, item.lng], 15);
      const marker = findMarker(item);
      if (marker) marker.openPopup();
      if (window.innerWidth <= 780) document.getElementById('sidebar').classList.remove('open');
    });
    list.appendChild(card);
  });
}

function findMarker(item) {
  let found = null;
  const cluster = clusterGroups[item._kat];
  if (!cluster) return null;
  cluster.eachLayer(m => {
    if (m._itemRef === item) found = m;
  });
  return found;
}

function applyFilters() {
  const query = document.getElementById('searchInput').value.trim().toLowerCase();
  const provinsi = document.getElementById('provinsiFilter').value;
  const activeKats = [...document.querySelectorAll('.filter-item input')]
    .filter(cb => cb.checked)
    .map(cb => cb.closest('.filter-item').dataset.kat);

  SOURCES.forEach(src => {
    const cluster = clusterGroups[src.kat];
    if (!cluster) return;
    if (activeKats.includes(src.kat)) {
      if (!map.hasLayer(cluster)) map.addLayer(cluster);
    } else {
      if (map.hasLayer(cluster)) map.removeLayer(cluster);
    }
  });

  const filtered = allItems.filter(item => {
    if (!activeKats.includes(item._kat)) return false;
    if (provinsi && item.provinsi !== provinsi) return false;
    if (query) {
      const hay = (item.nama + ' ' + item.kota + ' ' + item.provinsi).toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });

  renderResultList(filtered);
}

document.getElementById('searchInput').addEventListener('input', applyFilters);
document.getElementById('provinsiFilter').addEventListener('change', applyFilters);
document.querySelectorAll('.filter-item input').forEach(cb => cb.addEventListener('change', applyFilters));

document.getElementById('menuToggle').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
});

(async function init() {
  await Promise.all(SOURCES.map(loadSource));
  populateProvinsiFilter();
  applyFilters();
})();
