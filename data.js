// ======================================================================
// DATA WEBSITE — satu-satunya file yang perlu diedit untuk ubah data
// Kantin Siswa (contoh: kantin di Yogyakarta)
// ======================================================================

const USAHA = {
  nama: "Kantin Siswa",
  jenis: "Kantin",
  kota: "Yogyakarta",

  // ⚠️ GANTI dengan nomor WhatsApp asli. Format: 628xxx (tanpa + dan tanpa 0 di depan)
  wa: "6281229265630",
  waTampil: "0812-2926-5630", // nomor yang ditampilkan ke pengunjung

  // ⚠️ GANTI dengan alamat asli
  alamat: "Jl. Contoh No. 12, Yogyakarta",

  maps: "https://www.google.com/maps?q=Yogyakarta&output=embed",
  mapsLink: "https://www.google.com/maps/search/?api=1&query=Yogyakarta",

  instagram: "", // contoh: "kantinsiswa.id" (kosongkan bila belum ada)

  berdiri: 2019, // tahun berdiri (untuk statistik "Tahun Melayani")
  pelanggan: 3500, // perkiraan jumlah pelanggan
  rating: 4.8, // rating rata-rata yang ditampilkan

  jamBuka: 7, // jam buka (0-23)
  jamTutup: 16, // jam tutup (0-23)
  libur: [0], // hari libur (0 = Sabtu || Minggu, 1 = Senin, ...)
  jamText: "Senin–Jumat, 07.00–16.00",
  jadwal: [
    { hari: "Senin – Jumat", jam: "07.00 – 16.00" },
    { hari: "Sabtu - Minggu", jam: "Tutup" },
  ],

  // ⚠️ GANTI dengan rekening asli (dipakai saat metode transfer bank dipilih)
  rekening: [
    { bank: "BCA", no: "1234567890", atas: "Kantin Siswa" },
    { bank: "BRI", no: "9876543210", atas: "Kantin Siswa" },
  ],
};

// ===== DAFTAR MENU — harga dalam rupiah, foto bisa "" (pakai emoji) atau "foto/nama.jpg" / URL =====
const PRODUK = [
  // --- Nasi ---
  { id: "nasi-goreng", nama: "Nasi Goreng Spesial", kategori: "Nasi", harga: 10000, deskripsi: "Nasi goreng dengan telur, ayam suwir, dan acar.", emoji: "🍛", foto: "", rating: 4.8, terjual: 210 },
  { id: "ayam-geprek", nama: "Nasi Ayam Geprek", kategori: "Nasi", harga: 10000, deskripsi: "Ayam geprek pedas dengan lalapan dan sambal.", emoji: "🍗", foto: "", rating: 4.9, terjual: 180 },
  { id: "nasi-kuning", nama: "Nasi Kuning Komplit", kategori: "Nasi", harga: 10000, deskripsi: "Nasi kuning dengan mie, telur, dan sambal goreng.", emoji: "🍚", foto: "", rating: 4.7, terjual: 140 },
  { id: "soto-ayam", nama: "Soto Ayam", kategori: "Nasi", harga: 10000, deskripsi: "Soto ayam bening dengan koya dan sambal.", emoji: "🍜", foto: "", rating: 4.8, terjual: 160 },

  // --- Mi ---
  { id: "mie-jawa", nama: "Mie Goreng Jawa", kategori: "Mi", harga: 10000, deskripsi: "Mie goreng khas Jawa dengan sawi dan telur.", emoji: "🍝", foto: "", rating: 4.7, terjual: 190 },
  { id: "bakmi-godog", nama: "Bakmi Godog", kategori: "Mi", harga: 11000, deskripsi: "Bakmi rebus hangat dengan suwiran ayam.", emoji: "🍲", foto: "", rating: 4.6, terjual: 120 },
  { id: "mie-telur", nama: "Mie Goreng Telur", kategori: "Mi", harga: 9000, deskripsi: "Mie goreng sederhana dengan telur orak-arik.", emoji: "🍜", foto: "", rating: 4.5, terjual: 150 },

  // --- Camilan ---
  { id: "batagor", nama: "Batagor (3 pcs)", kategori: "Camilan", harga: 2000, deskripsi: "Batagor kenyal dengan bumbu kacang.", emoji: "🥟", foto: "", rating: 4.8, terjual: 170 },
  { id: "siomay", nama: "Siomay (3 pcs)", kategori: "Camilan", harga: 8000, deskripsi: "Siomay ikan dengan bumbu kacang dan kecap.", emoji: "🍢", foto: "", rating: 4.7, terjual: 150 },
  { id: "pisang-goreng", nama: "Pisang Goreng", kategori: "Camilan", harga: 5000, deskripsi: "Pisang goreng renyah di luar, lembut di dalam.", emoji: "🍌", foto: "", rating: 4.6, terjual: 220 },
  { id: "tahu-crispy", nama: "Tahu Crispy", kategori: "Camilan", harga: 6000, deskripsi: "Tahu renyah dengan bumbu balado.", emoji: "🧆", foto: "", rating: 4.5, terjual: 130 },
  { id: "roti-bakar", nama: "Roti Bakar Cokelat", kategori: "Camilan", harga: 8000, deskripsi: "Roti bakar dengan selai cokelat dan keju.", emoji: "🍞", foto: "", rating: 4.7, terjual: 140 },

  // --- Minuman ---
  { id: "es-teh", nama: "Es Teh Manis", kategori: "Minuman", harga: 3000, deskripsi: "Teh manis dingin yang menyegarkan.", emoji: "🧋", foto: "", rating: 4.8, terjual: 300 },
  { id: "es-jeruk", nama: "Es Jeruk", kategori: "Minuman", harga: 4000, deskripsi: "Jeruk peras asli dengan es batu.", emoji: "🍊", foto: "", rating: 4.7, terjual: 180 },
  { id: "kopi-susu", nama: "Kopi Susu Gula Aren", kategori: "Minuman", harga: 5000, deskripsi: "Kopi susu dengan gula aren asli.", emoji: "☕", foto: "", rating: 4.9, terjual: 200 },
  { id: "es-dawet", nama: "Es Dawet", kategori: "Minuman", harga: 6000, deskripsi: "Dawet hijau dengan santan dan gula merah.", emoji: "🥥", foto: "", rating: 4.7, terjual: 160 },
];

// ===== VOUCHER PROMO =====
const VOUCHER = [
  { kode: "SISWA10", tipe: "persen", nilai: 10, maks: 5000, min: 15000, ket: "Diskon 10% (maks Rp 5.000), min. belanja Rp 15.000" },
  { kode: "HEMAT5", tipe: "nominal", nilai: 5000, maks: 0, min: 25000, ket: "Potongan Rp 5.000, min. belanja Rp 25.000" },
  { kode: "NGEMIL2", tipe: "nominal", nilai: 2000, maks: 0, min: 10000, ket: "Potongan Rp 2.000, min. belanja Rp 10.000" },
];

// ===== METODE PEMBAYARAN =====
// Tambah/hapus baris sesuai kantinmu. "aktif: false" menyembunyikan metode dari daftar.
// Field: id, nama, emoji, ket (penjelasan singkat), catatan (petunjuk tambahan)
const PEMBAYARAN = [
  {
    id: "tunai",
    nama: "Tunai",
    emoji: "💵",
    ket: "Bayar langsung di kasir saat mengambil pesanan.",
    catatan: "Siapkan uang tunai secukupnya, kembalian diberikan bila perlu.",
    aktif: true,
  },
  {
    id: "qris",
    nama: "QRIS",
    emoji: "📱",
    ket: "Scan QRIS dengan aplikasi apa pun: GoPay, OVO, DANA, ShopeePay, LinkAja, atau m-banking.",
    catatan: "Pindai QR code yang tertera di meja kasir.",
    aktif: true,
  },
  {
    id: "gopay",
    nama: "GoPay",
    emoji: "🟢",
    ket: "Bayar saldo GoPay lewat aplikasi Gojek atau GoPay.",
    catatan: "Tersedia juga GoPayLater / PayLater untuk pesan di atas Rp 50.000.",
    aktif: true,
  },
  {
    id: "ovo",
    nama: "OVO",
    emoji: "🟣",
    ket: "Bayar saldo OVO, termasuk OVO Points.",
    catatan: "Scan QR OVO kasir, saldo dipotong otomatis.",
    aktif: true,
  },
  {
    id: "dana",
    nama: "DANA",
    emoji: "🔵",
    ket: "Bayar saldo DANA atau kartu debit terhubung.",
    catatan: "Pastikan nama akun DANA sesuai saat verifikasi kasir.",
    aktif: true,
  },
  {
    id: "shopeepay",
    nama: "ShopeePay",
    emoji: "🟠",
    ket: "Bayar saldo ShopeePay dari aplikasi Shopee.",
    catatan: "Tunjukkan kode QR pembayaran ke kasir.",
    aktif: true,
  },
  {
    id: "bank",
    nama: "Transfer Bank",
    emoji: "🏦",
    ket: "Transfer ke virtual account BCA, BRI, Mandiri, atau BNI.",
    catatan: "Kirim bukti transfer ke kasir agar pesanan langsung diproses.",
    aktif: true,
  },
  {
    id: "kartu",
    nama: "Kartu Debit / Kredit",
    emoji: "💳",
    ket: "Terima Visa dan Mastercard (BCA, Mandiri, BNI).",
    catatan: "Tersedia mesin EDC di kasir.",
    aktif: true,
  },
];

// ===== ULASAN PELANGGAN (ganti dengan ulasan asli, minta izin dulu) =====
// Ulasan yang dikirim pengunjung lewat tombol "Tambah Ulasan" disimpan di browser
// masing-masing (localStorage) dan bisa disalin ke sini agar tampil untuk semua.
const TESTIMONI = [
  { teks: "Nasi gorengnya mantap dan harganya ramah kantong pelajar.", nama: "Rina, kelas XI", rating: 5 },
  { teks: "Es dawetnya paling enak di sekitar sekolah, tiap istirahat selalu ke sini.", nama: "Bagus, kelas XII", rating: 5 },
  { teks: "Pesan banyak buat kelas lewat WhatsApp, gampang dan cepat.", nama: "Bu Sari, wali kelas", rating: 5 },
  { teks: "Batagornya juara, bumbu kacangnya nendang.", nama: "Dimas, alumni", rating: 4 },
];

// ===== GALERI FOTO (taruh foto asli di folder foto/ lalu isi "foto/nama.jpg") =====
const GALERI = [
  { foto: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=70", alt: "Hidangan hangat setiap hari", emoji: "🍛" },
  { foto: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=70", alt: "Menu segar pilihan siswa", emoji: "🥗" },
  { foto: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=70", alt: "Suasana kantin yang nyaman", emoji: "🏫" },
  { foto: "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800&q=70", alt: "Aneka camilan sore", emoji: "🍟" },
  { foto: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=70", alt: "Tempat duduk yang lapang", emoji: "🍽️" },
  { foto: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=70", alt: "Salad bowl segar", emoji: "🥗" },
];
