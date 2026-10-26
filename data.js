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
  { id: "nasi-goreng", nama: "Nasi Goreng Spesial", kategori: "Nasi", harga: 12000, deskripsi: "Nasi goreng dengan telur, ayam suwir, sayur & acar.", emoji: "🍛", foto: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80&auto=format&fit=crop", rating: 4.9, terjual: 420 },
  { id: "ayam-geprek", nama: "Nasi Ayam Geprek", kategori: "Nasi", harga: 13000, deskripsi: "Ayam geprek renyah, pedas, lalapan, sambal khas kantin.", emoji: "🍗", foto: "https://images.unsplash.com/photo-1562967914-608f82629710?w=800&q=80&auto=format&fit=crop", rating: 4.9, terjual: 380 },
  { id: "nasi-kuning", nama: "Nasi Kuning Komplit", kategori: "Nasi", harga: 12000, deskripsi: "Nasi kuning, mie goreng, telur, ayam suwir & sambal.", emoji: "🍚", foto: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80&auto=format&fit=crop", rating: 4.8, terjual: 290 },
  { id: "soto-ayam", nama: "Soto Ayam Lamongan", kategori: "Nasi", harga: 12000, deskripsi: "Soto ayam bening, koya, soun, telur & sambal.", emoji: "🍜", foto: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80&auto=format&fit=crop", rating: 4.9, terjual: 310 },
  { id: "nasi-ayam-bakar", nama: "Nasi Ayam Bakar", kategori: "Nasi", harga: 15000, deskripsi: "Ayam bakar madu, nasi hangat, lalapan & sambal terasi.", emoji: "🍖", foto: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&q=80&auto=format&fit=crop", rating: 4.9, terjual: 265 },
  { id: "nasi-ayam-crispy", nama: "Nasi Ayam Crispy", kategori: "Nasi", harga: 14000, deskripsi: "Ayam crispy gurih renyah, nasi, saus sambal & lalapan.", emoji: "🍗", foto: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80&auto=format&fit=crop", rating: 4.9, terjual: 275 },
  { id: "nasi-campur", nama: "Nasi Campur Spesial", kategori: "Nasi", harga: 15000, deskripsi: "Nasi campur lengkap dengan lauk pilihan, sayur & sambal.", emoji: "🍱", foto: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80&auto=format&fit=crop", rating: 4.8, terjual: 245 },
  { id: "nasi-rames", nama: "Nasi Rames Pelajar", kategori: "Nasi", harga: 10000, deskripsi: "Paket hemat nasi + 2 lauk + sayur. Pas buat kantong pelajar.", emoji: "🍚", foto: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format&fit=crop", rating: 4.7, terjual: 340 },

  // --- Mi ---
  { id: "mie-jawa", nama: "Mie Goreng Jawa", kategori: "Mi", harga: 11000, deskripsi: "Mie goreng khas Jawa dengan sawi, kol, telur & kecap manis.", emoji: "🍝", foto: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80&auto=format&fit=crop", rating: 4.8, terjual: 295 },
  { id: "mie-ayam", nama: "Mie Ayam", kategori: "Mi", harga: 12000, deskripsi: "Mie kuah dengan ayam suwir, pangsit, sawi & kuah gurih.", emoji: "🍜", foto: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80&auto=format&fit=crop", rating: 4.9, terjual: 325 },
  { id: "bakmi-godog", nama: "Bakmi Godog Hangat", kategori: "Mi", harga: 12000, deskripsi: "Bakmi rebus kuah gurih hangat dengan suwiran ayam & telur.", emoji: "🍲", foto: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=800&q=80&auto=format&fit=crop", rating: 4.8, terjual: 215 },
  { id: "mie-telur", nama: "Mie Goreng Telur", kategori: "Mi", harga: 10000, deskripsi: "Mie goreng sederhana dengan telur orak-arik & sayur.", emoji: "🍜", foto: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=800&q=80&auto=format&fit=crop", rating: 4.7, terjual: 245 },
  { id: "kwetiau-goreng", nama: "Kwetiau Goreng Spesial", kategori: "Mi", harga: 13000, deskripsi: "Kwetiau goreng dengan ayam, telur, sawi & kecap gurih.", emoji: "🍝", foto: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=800&q=80&auto=format&fit=crop", rating: 4.9, terjual: 185 },
  { id: "mie-setan", nama: "Mie Pedas Setan", kategori: "Mi", harga: 13000, deskripsi: "Mie goreng super pedas dengan ayam, cabai & telur.", emoji: "🌶️", foto: "https://images.unsplash.com/photo-1617191519105-d07b85c79c4b?w=800&q=80&auto=format&fit=crop", rating: 4.9, terjual: 175 },

  // --- Ayam & Lauk ---
  { id: "ayam-goreng", nama: "Ayam Goreng (1 Pcs)", kategori: "Ayam & Lauk", harga: 9000, deskripsi: "Ayam goreng krispi gurih, bisa campur nasi.", emoji: "🍗", foto: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&q=80&auto=format&fit=crop", rating: 4.9, terjual: 365 },
  { id: "lele-goreng", nama: "Lele Goreng", kategori: "Ayam & Lauk", harga: 10000, deskripsi: "Lele goreng renyah, lalapan & sambal.", emoji: "🐟", foto: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80&auto=format&fit=crop", rating: 4.8, terjual: 245 },
  { id: "tempe-goreng", nama: "Tempe Goreng", kategori: "Ayam & Lauk", harga: 2000, deskripsi: "Tempe goreng renyah hangat.", emoji: "🫘", foto: "https://images.unsplash.com/photo-1546554137-f86b9593a222?w=800&q=80&auto=format&fit=crop", rating: 4.7, terjual: 420 },
  { id: "tahu-goreng", nama: "Tahu Goreng", kategori: "Ayam & Lauk", harga: 2000, deskripsi: "Tahu goreng gurih, cocok buat pelengkap.", emoji: "🧆", foto: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format&fit=crop", rating: 4.7, terjual: 395 },
  { id: "telur-dadar", nama: "Telur Dadar", kategori: "Ayam & Lauk", harga: 4000, deskripsi: "Telur dadar tebal lembut.", emoji: "🍳", foto: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&q=80&auto=format&fit=crop", rating: 4.8, terjual: 325 },
  { id: "perkedel", nama: "Perkedel Kentang", kategori: "Ayam & Lauk", harga: 3000, deskripsi: "Perkedel kentang hangat renyah di pinggir.", emoji: "🥔", foto: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=800&q=80&auto=format&fit=crop", rating: 4.8, terjual: 280 },

  // --- Gorengan & Camilan ---
  { id: "pisang-goreng", nama: "Pisang Goreng (3 pcs)", kategori: "Gorengan", harga: 5000, deskripsi: "Pisang goreng renyah di luar, lembut di dalam.", emoji: "🍌", foto: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80&auto=format&fit=crop", rating: 4.9, terjual: 460 },
  { id: "tahu-crispy", nama: "Tahu Crispy (5 pcs)", kategori: "Gorengan", harga: 6000, deskripsi: "Tahu renyah dengan taburan bumbu balado.", emoji: "🧆", foto: "https://images.unsplash.com/photo-1625938144755-652e08e359b7?w=800&q=80&auto=format&fit=crop", rating: 4.8, terjual: 295 },
  { id: "tempe-mendoan", nama: "Tempe Mendoan (4 pcs)", kategori: "Gorengan", harga: 5000, deskripsi: "Tempe tipis goreng tepung khas Banyumas.", emoji: "🫓", foto: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80&auto=format&fit=crop", rating: 4.9, terjual: 335 },
  { id: "bakwan", nama: "Bakwan Sayur (3 pcs)", kategori: "Gorengan", harga: 4000, deskripsi: "Bakwan gurih renyah berisi sayur segar.", emoji: "🥟", foto: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=800&q=80&auto=format&fit=crop", rating: 4.8, terjual: 315 },
  { id: "cireng", nama: "Cireng Isi (4 pcs)", kategori: "Gorengan", harga: 6000, deskripsi: "Cireng kenyal dengan isi ayam pedas gurih.", emoji: "🫓", foto: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80&auto=format&fit=crop", rating: 4.9, terjual: 275 },
  { id: "lumpia-goreng", nama: "Lumpia Goreng (3 pcs)", kategori: "Gorengan", harga: 6000, deskripsi: "Lumpia renyah isi rebung & ayam.", emoji: "🥢", foto: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&q=80&auto=format&fit=crop", rating: 4.8, terjual: 245 },
  { id: "batagor", nama: "Batagor (4 pcs)", kategori: "Gorengan", harga: 9000, deskripsi: "Batagor kenyal dengan bumbu kacang kental.", emoji: "🥟", foto: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80&auto=format&fit=crop", rating: 4.9, terjual: 285 },
  { id: "siomay", nama: "Siomay Komplit (4 pcs)", kategori: "Gorengan", harga: 10000, deskripsi: "Siomay, tahu, kol, kentang dengan bumbu kacang & kecap.", emoji: "🍢", foto: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&q=80&auto=format&fit=crop", rating: 4.9, terjual: 265 },
  { id: "roti-bakar", nama: "Roti Bakar Cokelat Keju", kategori: "Camilan", harga: 10000, deskripsi: "Roti bakar tebal dengan cokelat, keju & susu kental.", emoji: "🍞", foto: "https://images.unsplash.com/photo-1508737804141-4c3b688e2546?w=800&q=80&auto=format&fit=crop", rating: 4.9, terjual: 235 },
  { id: "martabak-mini", nama: "Martabak Mini (5 pcs)", kategori: "Camilan", harga: 10000, deskripsi: "Martabak mini isi cokelat/keju favorit pelajar.", emoji: "🥞", foto: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&q=80&auto=format&fit=crop", rating: 4.9, terjual: 215 },

  // --- Minuman Dingin ---
  { id: "es-teh", nama: "Es Teh Manis", kategori: "Minuman", harga: 3000, deskripsi: "Teh manis dingin segar, wajib pelajar.", emoji: "🧋", foto: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80&auto=format&fit=crop", rating: 4.9, terjual: 620 },
  { id: "es-jeruk", nama: "Es Jeruk Peras", kategori: "Minuman", harga: 5000, deskripsi: "Jeruk peras asli + es batu, segar maksimal.", emoji: "🍊", foto: "https://images.unsplash.com/photo-1546554137-f86b9593a222?w=800&q=80&auto=format&fit=crop", rating: 4.9, terjual: 385 },
  { id: "kopi-susu", nama: "Kopi Susu Gula Aren", kategori: "Minuman", harga: 6000, deskripsi: "Kopi robusta + susu + gula aren asli, kekinian.", emoji: "☕", foto: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80&auto=format&fit=crop", rating: 4.9, terjual: 425 },
  { id: "es-coklat", nama: "Es Coklat Premium", kategori: "Minuman", harga: 6000, deskripsi: "Coklat premium dingin, creamy & manis pas.", emoji: "🍫", foto: "https://images.unsplash.com/photo-1546554137-f86b9593a222?w=800&q=80&auto=format&fit=crop", rating: 4.9, terjual: 355 },
  { id: "es-teler", nama: "Es Teler", kategori: "Minuman", harga: 8000, deskripsi: "Alpukat, kelapa muda, nangka, susu kental & es serut.", emoji: "🥭", foto: "https://images.unsplash.com/photo-1546554137-f86b9593a222?w=800&q=80&auto=format&fit=crop", rating: 4.9, terjual: 295 },
  { id: "es-dawet", nama: "Es Dawet Ayu", kategori: "Minuman", harga: 7000, deskripsi: "Dawet hijau, cendol, santan segar & gula merah cair.", emoji: "🥥", foto: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80&auto=format&fit=crop", rating: 4.9, terjual: 335 },
  { id: "es-campur", nama: "Es Campur Spesial", kategori: "Minuman", harga: 8000, deskripsi: "Campuran buah, agar-agar, cincau, sirup & susu.", emoji: "🍧", foto: "https://images.unsplash.com/photo-1546554137-f86b9593a222?w=800&q=80&auto=format&fit=crop", rating: 4.9, terjual: 275 },
  { id: "thai-tea", nama: "Thai Tea", kategori: "Minuman", harga: 7000, deskripsi: "Thai tea creamy dingin, manis pas disukai pelajar.", emoji: "🧋", foto: "https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=800&q=80&auto=format&fit=crop", rating: 4.9, terjual: 345 },
  { id: "milo-dingin", nama: "Milo Dingin", kategori: "Minuman", harga: 6000, deskripsi: "Milo dingin dengan buih susu, cocok buat nongkrong.", emoji: "🥤", foto: "https://images.unsplash.com/photo-1546554137-f86b9593a222?w=800&q=80&auto=format&fit=crop", rating: 4.9, terjual: 315 },
  { id: "es-susu-strawberry", nama: "Es Susu Strawberry", kategori: "Minuman", harga: 7000, deskripsi: "Susu segar dengan sirup strawberry, manis segar.", emoji: "🍓", foto: "https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=800&q=80&auto=format&fit=crop", rating: 4.8, terjual: 245 },

  // --- Minuman Hangat ---
  { id: "teh-hangat", nama: "Teh Hangat", kategori: "Minuman Hangat", harga: 2000, deskripsi: "Teh hangat manis/polos, penghangat pagi.", emoji: "☕", foto: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80&auto=format&fit=crop", rating: 4.8, terjual: 265 },
  { id: "kopi-hitam", nama: "Kopi Hitam Hangat", kategori: "Minuman Hangat", harga: 3000, deskripsi: "Kopi tubruk hangat, kuat & nikmat.", emoji: "☕", foto: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80&auto=format&fit=crop", rating: 4.8, terjual: 215 },
  { id: "kopi-susu-hangat", nama: "Kopi Susu Hangat", kategori: "Minuman Hangat", harga: 5000, deskripsi: "Kopi susu hangat pas buat yang lagi ngantuk.", emoji: "☕", foto: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80&auto=format&fit=crop", rating: 4.9, terjual: 195 },
  { id: "susu-hangat", nama: "Susu Hangat", kategori: "Minuman Hangat", harga: 4000, deskripsi: "Susu hangat lembut, favorit anak & pelajar.", emoji: "🥛", foto: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&q=80&auto=format&fit=crop", rating: 4.8, terjual: 175 },
  { id: "jahe-hangat", nama: "Wedang Jahe Hangat", kategori: "Minuman Hangat", harga: 4000, deskripsi: "Wedang jahe hangat, menghangatkan tubuh.", emoji: "🫚", foto: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80&auto=format&fit=crop", rating: 4.9, terjual: 165 },
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
  { foto: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80&auto=format&fit=crop", alt: "Hidangan hangat setiap hari", emoji: "🍛" },
  { foto: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format&fit=crop", alt: "Menu segar pilihan siswa", emoji: "🥗" },
  { foto: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80&auto=format&fit=crop", alt: "Suasana kantin yang nyaman", emoji: "🏫" },
  { foto: "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800&q=80&auto=format&fit=crop", alt: "Aneka camilan sore", emoji: "🍟" },
  { foto: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80&auto=format&fit=crop", alt: "Tempat duduk yang lapang", emoji: "🍽️" },
  { foto: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&auto=format&fit=crop", alt: "Salad bowl segar", emoji: "🥗" },
  { foto: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80&auto=format&fit=crop", alt: "Nasi goreng spesial", emoji: "🍛" },
  { foto: "https://images.unsplash.com/photo-1562967914-608f82629710?w=800&q=80&auto=format&fit=crop", alt: "Ayam crispy hangat", emoji: "🍗" },
  { foto: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80&auto=format&fit=crop", alt: "Nasi goreng lezat", emoji: "🍛" },
  { foto: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80&auto=format&fit=crop", alt: "Soto ayam segar hangat", emoji: "🍜" },
  { foto: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80&auto=format&fit=crop", alt: "Mie goreng Jawa", emoji: "🍝" },
  { foto: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80&auto=format&fit=crop", alt: "Es dawet segar", emoji: "🥥" },
  { foto: "https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=800&q=80&auto=format&fit=crop", alt: "Thai tea dingin", emoji: "🧋" },
  { foto: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80&auto=format&fit=crop", alt: "Kopi susu gula aren", emoji: "☕" },
  { foto: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80&auto=format&fit=crop", alt: "Pisang goreng renyah", emoji: "🍌" },
];
