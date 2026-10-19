# Keamanan — Kantin Siswa (landing page statis)

## Cakupan

Proyek ini adalah landing page statis (HTML + Tailwind + JS tanpa backend).
Tidak ada autentikasi, tidak ada basis data, tidak ada secret/credential di kode.

## Kontrol yang diterapkan

- **Anti-XSS**: semua teks dinamis (nama produk, ulasan, input pengguna) di-escape
  lewat `escapeHtml()` / `textContent` sebelum masuk ke DOM.
- **Integritas harga**: subtotal, diskon voucher, dan total dihitung ulang dari
  `data.js` di sisi klien; nilai dari `localStorage` tidak pernah dipercaya untuk harga.
- **Input validasi**: form kontak memvalidasi nama (≥3), nomor HP (regex `0\d{8,12}`),
  dan pesan (≥5) sebelum membuka tautan WhatsApp.
- **Tautan eksternal**: semua `target="_blank"` memakai `rel="noopener noreferrer"`.
- **Tanpa secret**: tidak ada API key/token/private key; `npm run security`
  memindai pola secret umum (sk-, ghp_, AKIA, private key PEM).
- **Tanpa `console.log`** di kode produksi (dicek otomatis).
- **Dependency**: hanya Tailwind CLI (devDependency, tidak ikut di-publish ke halaman);
  `npm audit` dilaporkan 0 kerentanan.

## Data contoh yang WAJIB diganti sebelum publik

- `USAHA.wa` = `6281234567890` (nomor contoh) → ganti dengan nomor WhatsApp asli.
- `USAHA.waTampil`, `USAHA.alamat`, `USAHA.maps`, `USAHA.mapsLink` masih contoh.
- Foto galeri masih foto contoh (Unsplash) → ganti dengan foto asli kantin.

## Pelaporan

Temuan kerentanan laporkan ke pemilik proyek (jangan publikasikan detail di grup kelas).