# Peta Pusat Perbelanjaan Indonesia (Struktur Per Provinsi)

## Struktur Folder

```
data/
├── mall/
│   ├── _index.json          ← daftar file provinsi yang SUDAH ADA ISINYA
│   ├── _template.json         ← contoh format 1 lokasi (untuk disalin)
│   ├── aceh.json
│   ├── sumut.json
│   ├── dki-jakarta.json
│   ├── jabar.json
│   ├── ... (38 file, satu per provinsi)
├── pasar/          (struktur sama persis)
├── swalayan/       (struktur sama persis)
└── pusat-perbelanjaan/   (struktur sama persis)
```

Setiap kategori (mall, pasar, swalayan, pusat perbelanjaan) punya **38 file**, satu untuk setiap provinsi di Indonesia. Saat ini sebagian besar masih kosong (`"data": []`) — itu wajar, tinggal diisi bertahap.

## 🔑 Konsep Penting: `_index.json`

Supaya website tidak perlu membuka 38 file sekaligus untuk tiap kategori (boros dan lambat), ada satu file kecil bernama `_index.json` di tiap folder kategori yang isinya **daftar file provinsi mana saja yang sudah punya data**. Website hanya akan membuka file yang terdaftar di sini.

Contoh isi `data/mall/_index.json` saat ini:
```json
{
  "files": [
    { "file": "dki-jakarta.json", "provinsi": "DKI Jakarta" },
    { "file": "jabar.json", "provinsi": "Jawa Barat" },
    { "file": "jatim.json", "provinsi": "Jawa Timur" }
  ]
}
```

## ✏️ Cara Menambah Data di Provinsi yang SUDAH terdaftar di _index.json

Contoh: menambah mall baru di Jawa Barat.

1. Buka `data/mall/jabar.json` di GitHub (klik file → ikon pensil ✏️ untuk edit).
2. Di dalam array `"data": [ ... ]`, tambahkan blok baru seperti ini (jangan lupa koma pemisah antar blok):

```json
{
  "id": "mall-jabar-002",
  "nama": "Paris Van Java",
  "kota": "Bandung",
  "provinsi": "Jawa Barat",
  "alamat": "Jl. Sukajadi No.137-139, Bandung",
  "lat": -6.8891,
  "lng": 107.5885,
  "jam_operasional": "10:00 - 22:00",
  "kontak": "022-82063200",
  "keterangan": "Mall dengan konsep outdoor"
}
```
3. Klik **Commit changes**. Selesai — tidak perlu menyentuh file lain.

## ➕ Cara Menambah Data di Provinsi yang BELUM terdaftar (misalnya Aceh)

Karena `aceh.json` untuk kategori mall masih kosong dan belum masuk daftar `_index.json`, ada **2 langkah**:

**Langkah 1 — Isi file provinsinya**
Buka `data/mall/aceh.json`, ganti isinya (yang tadinya `"data": []`) menjadi:
```json
{
  "kategori": "Mall",
  "provinsi": "Aceh",
  "data": [
    {
      "id": "mall-aceh-001",
      "nama": "Suzuya Mall Banda Aceh",
      "kota": "Banda Aceh",
      "provinsi": "Aceh",
      "alamat": "Jl. Diponegoro, Banda Aceh",
      "lat": 5.5483,
      "lng": 95.3238,
      "jam_operasional": "10:00 - 22:00",
      "kontak": "-",
      "keterangan": ""
    }
  ]
}
```

**Langkah 2 — Daftarkan filenya ke _index.json**
Buka `data/mall/_index.json`, tambahkan satu baris untuk Aceh:
```json
{
  "files": [
    { "file": "aceh.json", "provinsi": "Aceh" },
    { "file": "dki-jakarta.json", "provinsi": "DKI Jakarta" },
    { "file": "jabar.json", "provinsi": "Jawa Barat" },
    { "file": "jatim.json", "provinsi": "Jawa Timur" }
  ]
}
```
Commit kedua file itu (boleh sekaligus dalam satu commit). Selesai — Aceh akan otomatis muncul di peta dan di filter provinsi.

> Kalau lupa Langkah 2, datanya tidak akan error, hanya saja tidak muncul di peta karena website tidak tahu harus membuka file itu.

## 📋 Daftar Lengkap 38 Provinsi (nama file)

| Provinsi | Nama File |
|---|---|
| Aceh | aceh.json |
| Sumatera Utara | sumut.json |
| Sumatera Barat | sumbar.json |
| Riau | riau.json |
| Kepulauan Riau | kepri.json |
| Jambi | jambi.json |
| Sumatera Selatan | sumsel.json |
| Bengkulu | bengkulu.json |
| Lampung | lampung.json |
| Kepulauan Bangka Belitung | babel.json |
| DKI Jakarta | dki-jakarta.json |
| Jawa Barat | jabar.json |
| Jawa Tengah | jateng.json |
| DI Yogyakarta | diy.json |
| Jawa Timur | jatim.json |
| Banten | banten.json |
| Bali | bali.json |
| Nusa Tenggara Barat | ntb.json |
| Nusa Tenggara Timur | ntt.json |
| Kalimantan Barat | kalbar.json |
| Kalimantan Tengah | kalteng.json |
| Kalimantan Selatan | kalsel.json |
| Kalimantan Timur | kaltim.json |
| Kalimantan Utara | kaltara.json |
| Sulawesi Utara | sulut.json |
| Sulawesi Tengah | sulteng.json |
| Sulawesi Selatan | sulsel.json |
| Sulawesi Tenggara | sultra.json |
| Gorontalo | gorontalo.json |
| Sulawesi Barat | sulbar.json |
| Maluku | maluku.json |
| Maluku Utara | malut.json |
| Papua Barat | papua-barat.json |
| Papua Barat Daya | papua-barat-daya.json |
| Papua | papua.json |
| Papua Tengah | papua-tengah.json |
| Papua Pegunungan | papua-pegunungan.json |
| Papua Selatan | papua-selatan.json |

Nama file sama persis untuk keempat kategori (mall, pasar, swalayan, pusat-perbelanjaan) — cuma folder induknya beda.

## Cara Mendapatkan Koordinat (lat/lng)

Buka Google Maps → cari lokasinya → klik kanan pada titik lokasi → koordinat akan muncul paling atas → klik untuk menyalin (format: `-6.1953, 106.8203` → yang pertama itu `lat`, kedua `lng`).

## Deploy / Update ke GitHub Pages

Sama seperti sebelumnya:
1. Upload seluruh isi folder ini (index.html, style.css, app.js, dan folder `data/`) ke root repository.
2. Pastikan **struktur folder ikut terupload** — bukan cuma file-nya lepas di root. Cara paling aman: drag folder `data` secara utuh ke kotak upload GitHub, jangan file satu-satu.
3. Aktifkan GitHub Pages di Settings → Pages jika belum aktif.
4. Setiap kali mengedit file JSON dan commit, tunggu 1-2 menit lalu hard refresh (Ctrl+Shift+R) di browser.
