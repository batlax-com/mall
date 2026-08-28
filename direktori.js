// Sama seperti app.js: daftar kategori dan warnanya
const KATEGORI = [
  { kat: "mall", label: "Mall", color: "#E76F51" },
  { kat: "pasar", label: "Pasar", color: "#2A9D8F" },
  { kat: "swalayan", label: "Swalayan", color: "#E9C46A" },
  { kat: "pusat-perbelanjaan", label: "Pusat Perbelanjaan", color: "#264653" }
];

// data lengkap per kategori: { mall: [ {..item, provinsi}, ... ], pasar: [...] }
const dataPerKategori = {};

async function loadKategori(src) {
  let items = [];
  try {
    const idxRes = await fetch(`data/${src.kat}/_index.json`);
    const idx = await idxRes.json();
    const files = idx.files || [];

    await Promise.all(files.map(async (entry) => {
      try {
        const res = await fetch(`data/${src.kat}/${entry.file}`);
        const json = await res.json();
        (json.data || []).forEach(item => items.push(item));
      } catch (e) {
        console.error(`Gagal memuat data/${src.kat}/${entry.file}`, e);
      }
    }));
  } catch (e) {
    console.error(`Gagal memuat data/${src.kat}/_index.json`, e);
  }
  dataPerKategori[src.kat] = items;
}

function groupByProvinsi(items) {
  const grouped = {};
  items.forEach(item => {
    const prov = item.provinsi || "Lainnya";
    if (!grouped[prov]) grouped[prov] = [];
    grouped[prov].push(item);
  });
  return grouped;
}

function renderDirektori() {
  const content = document.getElementById('direktoriContent');
  const jumpNav = document.getElementById('jumpNav');
  content.innerHTML = '';
  jumpNav.innerHTML = '';

  KATEGORI.forEach(src => {
    const items = (dataPerKategori[src.kat] || []).slice().sort((a, b) => a.nama.localeCompare(b.nama));
    const grouped = groupByProvinsi(items);
    const provinsiNames = Object.keys(grouped).sort();

    // Tombol navigasi cepat
    const jumpBtn = document.createElement('a');
    jumpBtn.href = `#kat-${src.kat}`;
    jumpBtn.className = 'jumpnav-btn';
    jumpBtn.style.background = src.color;
    jumpBtn.textContent = `${src.label} (${items.length})`;
    jumpNav.appendChild(jumpBtn);

    // Section kategori
    const section = document.createElement('section');
    section.className = 'kategori-section';
    section.id = `kat-${src.kat}`;
    section.dataset.kat = src.kat;

    const heading = document.createElement('div');
    heading.className = 'kategori-heading';
    heading.innerHTML = `
      <span class="dot" style="background:${src.color}"></span>
      ${src.label}
      <span class="kategori-count">${items.length} lokasi di ${provinsiNames.length} provinsi</span>
    `;
    section.appendChild(heading);

    if (items.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'direktori-empty';
      empty.textContent = 'Belum ada data untuk kategori ini.';
      section.appendChild(empty);
    }

    provinsiNames.forEach(prov => {
      const provItems = grouped[prov];
      const block = document.createElement('div');
      block.className = 'provinsi-block';
      block.id = `kat-${src.kat}-${slugify(prov)}`;
      block.dataset.provinsi = prov.toLowerCase();

      const provHeading = document.createElement('div');
      provHeading.className = 'provinsi-heading';
      provHeading.innerHTML = `${prov} <span class="provinsi-count">(${provItems.length})</span>`;
      block.appendChild(provHeading);

      const grid = document.createElement('div');
      grid.className = 'lokasi-grid';

      provItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'lokasi-card';
        card.dataset.search = (item.nama + ' ' + item.kota + ' ' + prov).toLowerCase();
        card.innerHTML = `
          <div class="lc-nama">${item.nama}</div>
          <div class="lc-kota">${item.kota}</div>
          ${item.jam_operasional ? `<div class="lc-jam">🕒 ${item.jam_operasional}</div>` : ''}
        `;
        grid.appendChild(card);
      });

      block.appendChild(grid);
      section.appendChild(block);
    });

    content.appendChild(section);
  });
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function applySearch() {
  const query = document.getElementById('direktoriSearch').value.trim().toLowerCase();

  document.querySelectorAll('.provinsi-block').forEach(block => {
    let anyVisible = false;
    block.querySelectorAll('.lokasi-card').forEach(card => {
      const match = !query || card.dataset.search.includes(query);
      card.classList.toggle('hidden', !match);
      if (match) anyVisible = true;
    });
    block.classList.toggle('hidden', !anyVisible);
  });

  document.querySelectorAll('.kategori-section').forEach(section => {
    const visibleBlocks = section.querySelectorAll('.provinsi-block:not(.hidden)');
    section.classList.toggle('hidden', query && visibleBlocks.length === 0);
  });
}

document.getElementById('direktoriSearch').addEventListener('input', applySearch);

(async function init() {
  await Promise.all(KATEGORI.map(loadKategori));
  renderDirektori();
})();
