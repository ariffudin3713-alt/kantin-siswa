# Kantin Siswa — Landing Page UMKM

Landing page UMKM **Kantin Siswa** (kantin di Yogyakarta) untuk tugas Akhir Semester.
Dibangun dengan **HTML + Tailwind CSS (hasil build) + JavaScript murni** — tanpa backend, tanpa database.

## Cara membuka

Buka `index.html` langsung di browser. Semua file sudah termasuk (CSS sudah di-build), jadi tidak perlu internet kecuali untuk foto galeri & peta.

## Struktur file

| File | Fungsi |
|---|---|
| `index.html` | Halaman utama (struktur & teks) |
| `data.js` | **Semua data usaha** — nama, WA, alamat, menu, voucher, ulasan, galeri |
| `main.js` | Logika (keranjang, voucher, pencarian, lightbox, dsb.) |
| `src/input.css` | Sumber Tailwind + variabel warna tema |
| `css/style.css` | Hasil build Tailwind (jangan diedit manual) |
| `scripts/security-check.cjs` | Pemeriksaan keamanan (`npm run security`) |
| `scripts/smoke-test.cjs` | Uji cepat konsistensi id/data (`node scripts/smoke-test.cjs`) |

## Cara mengubah data (hanya edit `data.js`)

- **Nomor WhatsApp**: ubah `wa` (format `628xxx`) dan `waTampil`. ⚠️ Sekarang masih nomor contoh — ganti sebelum dikumpulkan/dipublikasikan.
- **Alamat & peta**: ubah `alamat`, `maps`, `mapsLink`.
- **Jam buka**: `jamBuka`, `jamTutup`, `libur` (array hari, `0` = Minggu), `jadwal`.
- **Menu**: tambah/kurangi baris di array `PRODUK`. Isi `foto` dengan `"foto/nama-file.jpg"` (taruh file di folder `foto/`) atau biarkan `""` untuk memakai emoji.
- **Voucher**: array `VOUCHER` (`tipe: "persen"` atau `"nominal"`).
- **Ulasan & galeri**: array `TESTIMONI` dan `GALERI`.

Setelah mengubah `data.js` tidak perlu build ulang. Setelah mengubah kelas Tailwind di HTML/JS, jalankan `npm run build`.

## Perintah

```
npm install        # sekali saja (pasang Tailwind CLI)
npm run build      # build css/style.css
npm run dev        # build sambil watch
npm run check      # cek sintaks semua JS
npm run security   # pemeriksaan keamanan dasar
```

## Keamanan

- Semua teks dari data & input pengguna di-escape sebelum dimasukkan ke HTML (anti-XSS).
- Harga & total dihitung dari `data.js`, bukan dari penyimpanan browser.
- `localStorage` hanya menyimpan keranjang & tema (tanpa data sensitif).
- Tidak ada API key/secret di kode. Lihat `SECURITY.md`.

## Menerbitkan online (nilai +)

1. Buat repo baru di GitHub, lalu `git init`, `git add .`, `git commit -m "landing page"`, `git remote add origin <URL>`, `git push -u origin main`.
2. Aktifkan GitHub Pages (Settings → Pages → branch `main`).
3. Link Pages itulah yang dikumpulkan ke guru.