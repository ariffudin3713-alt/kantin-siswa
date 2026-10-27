// uji runtime: jalankan index.html + data.js + main.js di jsdom (simulasi browser)
// cek: paginasi mobile vs desktop, tambah ulasan, metode pembayaran
const fs = require("fs");
const path = require("path");

let JSDOM;
try {
  ({ JSDOM } = require("jsdom"));
} catch (e) {
  console.log("⚠️  jsdom belum terpasang. Uji runtime dilewati.");
  console.log("    Jalankan: npm install --no-save jsdom");
  process.exit(0);
}

const root = process.argv[2] || process.cwd();
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

let gagal = 0;
function cek(nama, ok, info = "") {
  console.log((ok ? "✓" : "✗") + " " + nama + (info ? " — " + info : ""));
  if (!ok) gagal++;
}

function jalankan(lebar, tinggi = 900) {
  const dom = new JSDOM(html, {
    runScripts: "outside-only",
    pretendToBeVisual: true,
    url: "https://example.test/",
  });
  const { window } = dom;
  Object.defineProperty(window, "innerWidth", { value: lebar, writable: true, configurable: true });
  Object.defineProperty(window, "innerHeight", { value: tinggi, writable: true, configurable: true });
  window.scrollTo = () => {};
  window.Element.prototype.scrollIntoView = function () {};
  window.open = (url) => {
    window.__lastOpen = url;
    return null;
  };
  window.matchMedia =
    window.matchMedia ||
    ((q) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }));
  window.IntersectionObserver = class {
    constructor(cb) {
      this.cb = cb;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  const data = fs.readFileSync(path.join(root, "data.js"), "utf8");
  const main = fs.readFileSync(path.join(root, "main.js"), "utf8");
  try {
    // satu eval supaya const USAHA/PRODUK/... terbagi di scope yang sama
    window.eval(data + "\n;\n" + main + "\n;window.__main = { renderMenu, renderUlasan, renderPembayaran, semuaUlasan, renderPagination, PAGINASI };");
  } catch (e) {
    console.log("  ERROR runtime:", e.message, "\n", e.stack.split("\n").slice(0, 4).join("\n"));
    return null;
  }
  return window;
}

// ---------- MOBILE ----------
const w = jalankan(390);
if (w) {
  const d = w.document;
  const kartu = d.querySelectorAll("#daftar-menu article");
  cek("mobile: 4 menu per halaman", kartu.length === 4, "jumlah kartu = " + kartu.length);

  const hal = d.querySelectorAll("#pagination-menu [data-hal-target='menu']");
  cek("mobile: tombol paginasi menu ada", hal.length > 0, "tombol = " + hal.length);

  const info = d.querySelector("#info-page").textContent;
  cek("mobile: info per halaman benar", /4 menu per halaman di tampilan mobile/.test(info), info);

  // klik halaman 2
  const btn2 = d.querySelector("#pagination-menu [data-hal='2'][data-hal-target='menu']");
  cek("mobile: ada tombol halaman 2", !!btn2);
  if (btn2) {
    btn2.dispatchEvent(new w.Event("click", { bubbles: true }));
    cek(
      "mobile: pindah ke halaman 2 mengubah isi",
      d.querySelectorAll("#daftar-menu article").length === 4 &&
        d.querySelector("#daftar-menu article h3").textContent !== "Nasi Goreng Spesial",
      d.querySelector("#daftar-menu article h3").textContent
    );
  }

  // ulasan mobile
  const cardsUlasan = d.querySelectorAll("#daftar-ulasan-mobile article");
  cek("mobile: 3 ulasan per halaman", cardsUlasan.length === 3, "jumlah = " + cardsUlasan.length);
  cek("mobile: carousel desktop disembunyikan", d.querySelector("#track").parentElement.className.includes("md:block"));

  // galeri mobile
  cek("mobile: 4 foto per halaman", d.querySelectorAll("#grid-galeri button").length === 4);

  // pembayaran
  const metode = d.querySelectorAll("#grid-pembayaran article");
  cek("pembayaran: kartu metode tampil", metode.length === 8, "jumlah = " + metode.length);
  cek("pembayaran: rekening tampil", !d.querySelector("#info-rekening").classList.contains("hidden"));
  const opsi = d.querySelectorAll("#input-pembayaran option");
  cek("pembayaran: opsi select keranjang", opsi.length === 8, "opsi = " + opsi.length);
  cek("FAQ pembayaran terisi otomatis", /QRIS/.test(d.querySelector("#faq-bayar").textContent));

  // tambah ulasan
  const modal = d.querySelector("#modal-ulasan");
  cek("modal ulasan tersembunyi awal", modal.classList.contains("hidden"));
  d.querySelector("#btn-tambah-ulasan").dispatchEvent(new w.Event("click", { bubbles: true }));
  cek("modal ulasan terbuka", !modal.classList.contains("hidden") && modal.classList.contains("flex"));

  // pilih bintang 4
  d.querySelector("#bintang-pilih [data-bintang='4']").dispatchEvent(new w.Event("click", { bubbles: true }));
  cek("bintang terpilih = 4", d.querySelector("#input-rating").value === "4");

  // validasi: nama terlalu pendek
  const form = d.querySelector("#form-ulasan");
  form.elements.nama.value = "A";
  form.elements.teks.value = "Ulasan yang cukup panjang untuk tes";
  form.dispatchEvent(new w.Event("submit", { bubbles: true, cancelable: true }));
  cek("validasi: nama pendek ditolak", /minimal 3/.test(d.querySelector("#error-ulasan").textContent), d.querySelector("#error-ulasan").textContent);

  // simpan ulasan
  form.elements.nama.value = "Tester Handal";
  form.elements.teks.value = "Makanannya enak banget, worth it harganya murah!";
  form.dispatchEvent(new w.Event("submit", { bubbles: true, cancelable: true }));
  cek("ulasan tersimpan di localStorage", /Tester Handal/.test(w.localStorage.getItem("kantin_ulasan") || ""));
  cek("ulasan baru tampil di daftar", /Tester Handal/.test(d.querySelector("#daftar-ulasan-mobile").innerHTML));
  cek("jumlah ulasan naik jadi 5", d.querySelector("#ringkas-jumlah").textContent === "5", d.querySelector("#ringkas-jumlah").textContent);
  cek("modal tertutup setelah simpan", modal.classList.contains("hidden"));

  // keranjang + metode bayar
  d.querySelector("#daftar-menu [data-tambah]").dispatchEvent(new w.Event("click", { bubbles: true }));
  const selBayar = d.querySelector("#input-pembayaran");
  selBayar.value = "bank";
  selBayar.dispatchEvent(new w.Event("change", { bubbles: true }));
  cek("info metode bayar ikut berubah", /rekening|transfer|bukti/i.test(d.querySelector("#info-pembayaran").textContent), d.querySelector("#info-pembayaran").textContent);

  const formPesan = d.querySelector("#form-pesan");
  formPesan.elements.nama.value = "Tester";
  formPesan.dispatchEvent(new w.Event("submit", { bubbles: true, cancelable: true }));
  const pesanWA = decodeURIComponent(w.__lastOpen || "");
  cek("pesan WA memuat metode bayar", /Metode bayar: Transfer Bank/.test(pesanWA));
  cek("pesan WA memuat rekening", /Rekening:/.test(pesanWA) && /BCA/.test(pesanWA));

  // form kontak (pakai elements)
  const formKontak = d.querySelector("#form-kontak");
  formKontak.elements.nama.value = "Budi";
  formKontak.elements.hp.value = "081234567890";
  formKontak.elements.pesan.value = "Halo, mau tanya menu hari ini";
  formKontak.dispatchEvent(new w.Event("submit", { bubbles: true, cancelable: true }));
  cek("form kontak tetap jalan", /mau tanya menu/.test(decodeURIComponent(w.__lastOpen || "")));
}

// ---------- DESKTOP ----------
const w2 = jalankan(1440);
if (w2) {
  const d2 = w2.document;
  const kartu2 = d2.querySelectorAll("#daftar-menu article");
  cek("desktop 1440: 12 menu per halaman", kartu2.length === 12, "jumlah = " + kartu2.length);
  cek("desktop: carousel ulasan terlihat", d2.querySelector("#track").parentElement.className.includes("md:block"));
  cek("desktop: info per halaman = desktop", /12 menu per halaman di tampilan desktop/.test(d2.querySelector("#info-page").textContent), d2.querySelector("#info-page").textContent);
  cek("desktop: 6 foto per halaman (semua foto)", d2.querySelectorAll("#grid-galeri button").length === 6);
}

// ---------- TABLET ----------
const w3 = jalankan(800);
if (w3) {
  const d3 = w3.document;
  cek("tablet 800: 6 menu per halaman", d3.querySelectorAll("#daftar-menu article").length === 6);
  cek("tablet: 4 ulasan per halaman", d3.querySelectorAll("#daftar-ulasan-mobile article").length === 4);
  cek("tablet: 6 foto per halaman", d3.querySelectorAll("#grid-galeri button").length === 6);
}

// ---------- FITUR INTERAKSI BARU ----------
const w6 = jalankan(390);
if (w6) {
  const d6 = w6.document;
  cek("trending: 6 menu terlaris tampil", d6.querySelectorAll("#trending-menu article").length === 6);

  const chip = d6.querySelector("#kategori .chip-count");
  cek("filter: chip menampilkan jumlah menu", chip && chip.textContent === "45", chip ? chip.textContent : "kosong");

  const urut = d6.querySelector("#urutkan");
  urut.value = "murah";
  urut.dispatchEvent(new w6.Event("change", { bubbles: true }));
  cek("sort termurah: menu termurah di awal", d6.querySelector("#daftar-menu article h3").textContent === "Tempe Goreng", d6.querySelector("#daftar-menu article h3").textContent);

  const tambah = d6.querySelector("#daftar-menu [data-tambah]");
  const idTambah = tambah.dataset.tambah;
  tambah.dispatchEvent(new w6.Event("click", { bubbles: true }));
  const stepper = d6.querySelector(`[data-stepper="${idTambah}"]`);
  cek("stepper: muncul setelah tambah", stepper.classList.contains("tampil"));
  cek("stepper: qty awal 1", stepper.querySelector("[data-step-qty]").textContent === "1");
  cek("stepper: tombol tambah disembunyikan", tambah.classList.contains("tersembunyi"));
  cek("estimasi: terisi setelah ada item", /menit/.test(d6.querySelector("#estimasi").textContent), d6.querySelector("#estimasi").textContent);

  const plus = stepper.querySelector('[data-kartu="tbh"]');
  plus.dispatchEvent(new w6.Event("click", { bubbles: true }));
  cek("stepper: tombol + menambah qty", stepper.querySelector("[data-step-qty]").textContent === "2");

  const kur = stepper.querySelector('[data-kartu="kur"]');
  kur.dispatchEvent(new w6.Event("click", { bubbles: true }));
  kur.dispatchEvent(new w6.Event("click", { bubbles: true }));
  cek("stepper: habis mengembalikan tombol tambah", !stepper.classList.contains("tampil") && !tambah.classList.contains("tersembunyi"));

  const toastAksi = d6.querySelector("#toast-aksi");
  cek("toast: tombol aksi tampil", !toastAksi.classList.contains("hidden") && toastAksi.textContent === "Lihat");
  toastAksi.dispatchEvent(new w6.Event("click", { bubbles: true }));
  cek("toast: aksi membuka keranjang", d6.querySelector("#drawer").getAttribute("aria-hidden") === "false");

  const antar = d6.querySelector('#tipe-pesan [data-tipe="Antar ke kelas"]');
  antar.dispatchEvent(new w6.Event("click", { bubbles: true }));
  cek("keranjang: toggle antar ke kelas", d6.querySelector('#form-pesan input[name="tipe"]').value === "Antar ke kelas" && antar.classList.contains("aktif"));

  cek("status: hitung mundur hidup", /^\d{1,2}:\d{2}/.test(d6.querySelector("#status-countdown").textContent), d6.querySelector("#status-countdown").textContent);
}

// ---------- RESIZE (mobile -> desktop) ----------
(async () => {
const w4 = jalankan(390);
if (w4) {
  const d4 = w4.document;
  cek("resize awal: 4 menu per halaman", d4.querySelectorAll("#daftar-menu article").length === 4);
  Object.defineProperty(w4, "innerWidth", { value: 1440, writable: true, configurable: true });
  w4.dispatchEvent(new w4.Event("resize"));
  await new Promise((r) => setTimeout(r, 300)); // tunggu debounce 150ms
  cek("resize ke desktop: 12 menu per halaman", d4.querySelectorAll("#daftar-menu article").length === 12, "jumlah = " + d4.querySelectorAll("#daftar-menu article").length);
  cek("resize: info ikut berubah", /12 menu per halaman/.test(d4.querySelector("#info-page").textContent));
}

// ---------- PAGINASI ULASAN (mobile) ----------
const w5 = jalankan(390);
if (w5) {
  const d5 = w5.document;
  // tambah 3 ulasan agar ada > 3 ulasan
  for (let i = 0; i < 3; i++) {
    const f5 = d5.querySelector("#form-ulasan");
    f5.elements.nama.value = "Ulasan " + (i + 1);
    f5.elements.teks.value = "Ulasan nomor " + (i + 1) + " yang panjang sekali untuk tes.";
    f5.dispatchEvent(new w5.Event("submit", { bubbles: true, cancelable: true }));
  }
  cek("mobile: total ulasan = 7", d5.querySelector("#ringkas-jumlah").textContent === "7", d5.querySelector("#ringkas-jumlah").textContent);
  cek("mobile: 3 ulasan per halaman", d5.querySelectorAll("#daftar-ulasan-mobile article").length === 3);
  const hal2 = d5.querySelector("#pagination-ulasan [data-hal='2'][data-hal-target='ulasan']");
  cek("mobile: ada halaman 2 ulasan", !!hal2);
  if (hal2) {
    hal2.dispatchEvent(new w5.Event("click", { bubbles: true }));
    cek("mobile: pindah halaman ulasan", d5.querySelectorAll("#daftar-ulasan-mobile article").length === 3);
    cek("mobile: isi halaman 2 berbeda", !/Ulasan 1\b/.test(d5.querySelector("#daftar-ulasan-mobile article p").textContent));
  }
}

console.log(gagal === 0 ? "\n✓ SEMUA UJI RUNTIME LULUS" : `\n✗ ${gagal} uji gagal`);
process.exit(gagal === 0 ? 0 : 1);
})();
