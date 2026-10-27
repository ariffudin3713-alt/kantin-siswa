# Kantin Siswa — Landing Page UMKM

Landing page UMKM **Kantin Siswa** (kantin di Yogyakarta) untuk tugas Akhir Semester.
Dibangun dengan **HTML + Tailwind CSS (hasil build) + JavaScript murni** — tanpa backend, tanpa database.

## Cara membuka

Buka `index.html` langsung di browser. Semua file sudah termasuk (CSS sudah di-build), jadi tidak perlu internet kecuali untuk foto galeri & peta.

## Struktur file

| File | Fungsi |
|---|---|
| `index.html` | Halaman utama (struktur & teks) |
| `data.js` | **Semua data usaha** — nama, WA, alamat, menu, voucher, ulasan, galeri, metode pembayaran |
| `main.js` | Logika (keranjang, voucher, pencarian, paginasi, ulasan, lightbox, dsb.) |
| `src/input.css` | Sumber Tailwind + variabel warna tema |
| `css/style.css` | Hasil build Tailwind (jangan diedit manual) |
| `scripts/security-check.cjs` | Pemeriksaan keamanan (`npm run security`) |
| `scripts/smoke-test.cjs` | Uji cepat konsistensi id/data (`npm run smoke`) |
| `scripts/runtime-test.cjs` | Uji fungsi di browser simulasi jsdom (`npm run test:runtime`) |

## Fitur utama

### 0. Pengalaman jajan ala aplikasi food delivery
- **Rail "Lagi rame di kantin"** berisi 6 menu terlaris dengan peringkat #1–#6, badge, rating, dan tombol tambah langsung. Bisa digeser dengan tombol ‹ › atau swipe di HP.
- **Stepper qty di kartu menu**: setelah menu ditambahkan, tombol "Tambah" berubah menjadi kontrol − / qty / + supaya siswa bisa atur jumlah tanpa membuka keranjang.
- **Filter + urutkan**: chip kategori menampilkan jumlah menu; tersedia urutan Rekomendasi, Paling laris, Termurah, Termahal, dan Rating tertinggi.
- **Animasi mikro**: foto produk terbang ke ikon keranjang, badge berdenyut, toast dengan tombol **Lihat** untuk langsung membuka keranjang.
- **Status kantin hidup**: indikator buka/tutup, hitung mundur ke istirahat berikutnya, dan progress bar yang diperbarui tiap detik.
- **Keranjang pintar**: pilih **Ambil di kantin / Antar ke kelas**, isi kelas, lihat estimasi waktu siap, dan dapatkan saran menu viral saat keranjang masih kosong.
- Semua tetap **mobile-first**: target sentuh besar, teks harga menonjol, dan panel keranjang bawah yang nyaman di HP.

### 1. Tambah Ulasan
- Tombol **✍️ Tambah Ulasan** di bagian Ulasan membuka formulir (nama, rating bintang, isi ulasan).
- Ulasan tersimpan di `localStorage` browser (*maksimal 50*), langsung tampil dengan label **"Ulasan Baru"**, dan ikut menambah rata-rata rating.
- Centang **"Kirim juga ke WhatsApp"** agar pemilik kantin menerima ulasan lewat WA, lalu bisa disalin ke array `TESTIMONI` di `data.js` supaya tampil untuk semua pengunjung.

### 2. Tampilan mobile ≠ desktop (per halaman berbeda)
Jumlah item per halaman menyesuaikan ukuran layar, otomatis saat jendela di-resize:

| Bagian | Mobile (<640px) | Tablet (640–1023px) | Desktop (≥1024px) |
|---|---|---|---|
| Menu | 4 per halaman | 6 per halaman | 9–12 per halaman |
| Galeri | 4 per halaman | 6 per halaman | 6–12 per halaman |
| Ulasan | 3 per halaman (daftar) | 4 per halaman (daftar) | carousel (‹ › + titik) |

- Mobile memakai **daftar kartu** untuk ulasan, desktop memakai **carousel**.
- Pengaturan ada di `main.js`: `PAGE_MENU`, `PAGE_GALERI`, `PAGE_ULASAN`.

### 3. Metode pembayaran
- Array `PEMBAYARAN` di `data.js`: Tunai, QRIS, GoPay, OVO, DANA, ShopeePay, Transfer Bank, Kartu Debit/Kredit. Set `aktif: false` untuk menyembunyikan.
- Section **Metode Pembayaran** menampilkan semua metode + nomor rekening (`USAHA.rekening`).
- Pelanggan memilih metode di keranjang; pilihan ikut terkirim ke WhatsApp (beserta nomor rekening bila memilih transfer bank).
- Jawaban FAQ pembayaran dibuat otomatis dari `PEMBAYARAN`.

## Cara mengubah data (hanya edit `data.js`)

- **Nomor WhatsApp**: ubah `wa` (format `628xxx`) dan `waTampil`. ⚠️ Sekarang masih nomor contoh — ganti sebelum dikumpulkan/dipublikasikan.
- **Alamat & peta**: ubah `alamat`, `maps`, `mapsLink`.
- **Jam buka**: `jamBuka`, `jamTutup`, `libur` (array hari, `0` = Minggu), `jadwal`.
- **Menu**: tambah/kurangi baris di array `PRODUK`. Isi `foto` dengan `"foto/nama-file.jpg"` (taruh file di folder `foto/`) atau biarkan `""` untuk memakai emoji.
- **Voucher**: array `VOUCHER` (`tipe: "persen"` atau `"nominal"`).
- **Metode pembayaran**: array `PEMBAYARAN` + `rekening` di dalam `USAHA`.
- **Ulasan & galeri**: array `TESTIMONI` dan `GALERI`.

Setelah mengubah `data.js` tidak perlu build ulang. Setelah mengubah kelas Tailwind di HTML/JS, jalankan `npm run build`.

## Perintah

```
npm install        # sekali saja (pasang Tailwind CLI)
npm run build      # build css/style.css
npm run dev        # build sambil watch
npm run check      # cek sintaks semua JS
npm run security   # pemeriksaan keamanan dasar
npm run smoke      # cek konsistensi id/data
npm run test:runtime  # uji fungsi (butuh: npm install --no-save jsdom)
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