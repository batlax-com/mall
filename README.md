# Peta Pusat Perbelanjaan Indonesia

Website peta interaktif untuk menampilkan lokasi Mall, Pasar, Swalayan, dan Pusat Perbelanjaan di seluruh Indonesia. Dibangun dengan Leaflet.js (OpenStreetMap), tanpa perlu backend/server — cocok untuk hosting statis di GitHub Pages.

## Struktur Folder

```
peta-mall/
├── index.html              # Halaman utama (struktur & filter)
├── style.css                # Styling
├── app.js                    # Logika peta, filter, pencarian
├── data/
│   ├── mall.json              # Database Mall
│   ├── pasar.json             # Database Pasar
│   ├── swalayan.json          # Database Swalayan
│   └── pusat-perbelanjaan.json # Database Pusat Perbelanjaan
└── README.md
```

Index (tampilan) dan database (data lokasi) dipisah sepenuhnya. Untuk menambah/mengubah data, cukup edit file JSON di folder `data/` — tidak perlu menyentuh `index.html` atau `app.js`.

## Format Data (contoh 1 entri)

```json
{
  "id": "mall-004",
  "nama": "Nama Mall/Pasar/dsb",
  "kota": "Nama Kota",
  "provinsi": "Nama Provinsi",
  "alamat": "Alamat lengkap",
  "lat": -6.1953,
  "lng": 106.8203,
  "jam_operasional": "10:00 - 22:00",
  "kontak": "021-xxxxxxx",
  "keterangan": "Deskripsi singkat (opsional)"
}
```

Cara mendapatkan `lat` dan `lng`: buka Google Maps → klik kanan di lokasi → koordinat akan muncul di bagian atas, tinggal klik untuk menyalin.

## Menambah Kategori Baru

1. Buat file baru di `data/`, misalnya `data/minimarket.json`, dengan struktur yang sama (kunci `kategori`, `warna`, `data`).
2. Di `index.html`, tambahkan satu blok `<label class="filter-item">` baru di dalam `#filterList`, dengan `data-kat` dan `data-source` sesuai file baru.
3. Di `app.js`, tambahkan entri baru pada array `SOURCES` di baris paling atas (kat, label, color, file).
4. Tambahkan warna dot baru di `style.css` (contoh: `.dot-minimarket{background:#XXXXXX;}`).

## Cara Deploy ke GitHub Pages

1. Buat repository baru di GitHub, misalnya `peta-mall`.
2. Upload seluruh isi folder ini (index.html, style.css, app.js, folder data/) ke root repository tersebut.
3. Buka **Settings** → **Pages** pada repository.
4. Pada bagian **Source**, pilih branch `main` dan folder `/root`, lalu klik **Save**.
5. Tunggu 1–2 menit, GitHub akan memberikan URL seperti:
   `https://namauser.github.io/peta-mall/`
6. Website sudah bisa diakses publik.

### Update data setelahnya
Cukup edit file JSON di folder `data/` langsung dari GitHub (klik file → ikon pensil → edit → Commit changes). Perubahan akan otomatis live di website dalam waktu singkat, tanpa perlu deploy ulang.

## Fitur

- Peta interaktif dengan marker berwarna berbeda per kategori
- Marker clustering otomatis (mencegah tumpukan pin saat zoom out)
- Filter kategori (checkbox) dan filter provinsi (dropdown)
- Pencarian nama/kota/provinsi secara real-time
- Panel daftar hasil pencarian yang bisa diklik untuk fokus ke lokasi di peta
- Tampilan responsif (mobile-friendly, sidebar dapat disembunyikan)
- Basis data JSON terpisah untuk tiap kategori — mudah dikelola tanpa coding

## Catatan

Data contoh (3 lokasi per kategori) hanya untuk demo awal. Silakan tambahkan lokasi sesuai kebutuhan dengan mengikuti format di atas.
