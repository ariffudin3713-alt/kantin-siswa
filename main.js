// ======================================================================
// LOGIKA HALAMAN — Kantin Siswa (HTML + Tailwind + JS)
// ======================================================================

// ===== HELPER =====
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const rupiah = (n) => "Rp " + Math.round(n).toLocaleString("id-ID");

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = String(str);
  return div.innerHTML;
}

function toast(teks) {
  const t = $("#toast");
  if (!t) return;
  t.textContent = teks;
  t.classList.remove("translate-y-24");
  t.classList.add("translate-y-0");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => {
    t.classList.remove("translate-y-0");
    t.classList.add("translate-y-24");
  }, 2200);
}

function linkWA(pesan) {
  return `https://wa.me/${USAHA.wa}?text=${encodeURIComponent(pesan)}`;
}

function simpan(k, v) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch (e) {
    /* ignore */
  }
}
function muat(k, cadangan) {
  try {
    const isi = localStorage.getItem(k);
    return isi ? JSON.parse(isi) : cadangan;
  } catch (e) {
    return cadangan;
  }
}

// ===== PAGINASI =====
// Jumlah item per halaman menyesuaikan ukuran layar (mobile ≠ desktop).
const UKURAN = { mobile: "mobile", tablet: "tablet", desktop: "desktop", lebar: "lebar" };
const PAGE_MENU = { mobile: 4, tablet: 6, desktop: 9, lebar: 12 };
const PAGE_GALERI = { mobile: 4, tablet: 6, desktop: 9, lebar: 12 };
const PAGE_ULASAN = { mobile: 3, tablet: 4, desktop: 4, lebar: 4 };

function breakpoint() {
  const w = window.innerWidth;
  if (w < 640) return UKURAN.mobile;
  if (w < 1024) return UKURAN.tablet;
  if (w < 1280) return UKURAN.desktop;
  return UKURAN.lebar;
}
function perHalaman(peta) {
  return peta[breakpoint()] ?? peta.mobile;
}
function namaLayar() {
  const b = breakpoint();
  if (b === UKURAN.mobile) return "mobile";
  if (b === UKURAN.tablet) return "tablet";
  return "desktop";
}

// daftar nomor halaman (dengan elipsis bila halaman banyak)
function nomorHalaman(halaman, jumlah) {
  const arr = [];
  if (jumlah <= 7) {
    for (let i = 1; i <= jumlah; i++) arr.push(i);
    return arr;
  }
  arr.push(1);
  if (halaman > 3) arr.push("…");
  for (let i = Math.max(2, halaman - 1); i <= Math.min(jumlah - 1, halaman + 1); i++) arr.push(i);
  if (halaman < jumlah - 2) arr.push("…");
  arr.push(jumlah);
  return arr;
}

// tiap pagination punya target agar satu listener global cukup
const PAGINASI = {};
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-hal]");
  if (!b) return;
  const fn = PAGINASI[b.dataset.halTarget];
  if (!fn) return;
  const n = parseInt(b.dataset.hal, 10);
  if (!isNaN(n)) fn(n);
});

function renderPagination(wrap, opsi) {
  if (!wrap) return;
  const { halaman, jumlah, target, info = "" } = opsi;
  if (jumlah <= 1) {
    wrap.innerHTML = "";
    return;
  }
  const base =
    "grid h-10 min-w-10 place-items-center rounded-xl border px-3 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aksen";
  const tombol = [
    `<button type="button" class="${base} border-garis bg-kartu text-teks hover:border-aksen hover:text-aksen ${halaman === 1 ? "pointer-events-none opacity-40" : ""}" data-hal="${halaman - 1}" data-hal-target="${target}" aria-label="Halaman sebelumnya">‹</button>`,
  ];
  nomorHalaman(halaman, jumlah).forEach((n) => {
    if (n === "…") {
      tombol.push(`<span class="px-1 text-sm text-redup">…</span>`);
      return;
    }
    const aktif = n === halaman;
    tombol.push(
      `<button type="button" class="${base} ${aktif ? "!border-aksen !bg-tombol !text-tombol-teks" : "border-garis bg-kartu text-teks hover:border-aksen hover:text-aksen"}" data-hal="${n}" data-hal-target="${target}" aria-label="Halaman ${n}" ${aktif ? 'aria-current="page"' : ""}>${n}</button>`
    );
  });
  tombol.push(
    `<button type="button" class="${base} border-garis bg-kartu text-teks hover:border-aksen hover:text-aksen ${halaman === jumlah ? "pointer-events-none opacity-40" : ""}" data-hal="${halaman + 1}" data-hal-target="${target}" aria-label="Halaman berikutnya">›</button>`
  );
  wrap.innerHTML = `<div class="flex flex-wrap items-center justify-center gap-2">${tombol.join("")}</div>${
    info ? `<p class="mt-3 text-center text-xs text-redup">${info}</p>` : ""
  }`;
}

// ===== ISI DATA KE HTML =====
function isiData() {
  $$("[data-isi]").forEach((el) => {
    const k = el.dataset.isi;
    if (USAHA[k] !== undefined && USAHA[k] !== "") {
      el.textContent = USAHA[k];
    }
  });
  $$("[data-wa]").forEach((a) => {
    a.href = linkWA(`Halo ${USAHA.nama}, saya mau pesan.\n`);
    a.setAttribute("rel", "noopener noreferrer");
  });
  const ig = $("#link-ig");
  if (USAHA.instagram && USAHA.instagram.trim() !== "") {
    ig?.classList.remove("hidden");
    ig.href = `https://www.instagram.com/${USAHA.instagram.replace(/^@/, "")}`;
  }
  $("#baris-ig")?.classList.toggle("hidden", !(USAHA.instagram && USAHA.instagram.trim() !== ""));
  $("#peta").src = USAHA.maps;
  $("#link-maps").href = USAHA.mapsLink;
}

// ===== STATUS BUKA/TUTUP & HITUNG MUNDUR =====
function cekStatus() {
  const now = new Date();
  const hari = now.getDay(); // 0=minggu
  const jam = now.getHours() + now.getMinutes() / 60;
  const tutup = USAHA.libur?.includes(hari);
  let buka = false;
  if (!tutup) {
    buka = jam >= USAHA.jamBuka && jam < USAHA.jamTutup;
  }
  const dot = $("#status-dot");
  const teks = $("#status-teks");
  if (!teks) return;
  if (tutup) {
    teks.textContent = "Hari ini libur";
    dot?.classList.remove("bg-green-400");
    dot?.classList.add("bg-red-400");
  } else {
    teks.textContent = buka ? "Buka sekarang" : "Tutup sekarang";
    dot?.classList.remove("bg-red-400");
    dot?.classList.add("bg-green-400");
  }

  // status lokasi bawah
  const dot2 = $("[data-dot]");
  const st2 = $("[data-statusteks]");
  if (dot2 && st2) {
    if (tutup) {
      st2.textContent = "Hari ini libur";
      dot2.classList.remove("bg-green-400");
      dot2.classList.add("bg-red-400");
    } else {
      st2.textContent = buka ? "Saat ini Buka" : "Saat ini Tutup";
      dot2.classList.remove("bg-red-400");
      dot2.classList.add("bg-green-400");
    }
  }
}
cekStatus();
setInterval(cekStatus, 60000);

// ===== EFEK KETIK SLOGAN =====
function ketikSlogan() {
  const el = $("#slogan");
  if (!el) return;
  const teks = `Kantin ${USAHA.kota} — menu lengkap, harganya ramah pelajar.`;
  let i = 0;
  el.textContent = "";
  function tick() {
    if (i < teks.length) {
      el.textContent += teks[i++];
      setTimeout(tick, 30);
    }
  }
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.textContent = teks;
    return;
  }
  tick();
}
ketikSlogan();

// ===== ANIMASI MUNCUL + ANGKA NAIK =====
const angka = {
  "#angka-tahun": new Date().getFullYear() - USAHA.berdiri,
  "#angka-pelanggan": USAHA.pelanggan,
  "#angka-menu": PRODUK.length,
};
function hitungAngka() {
  Object.entries(angka).forEach(([sel, target]) => {
    const el = $(sel);
    if (!el) return;
    let n = 0;
    const max = Math.max(1, Math.ceil(target / 60));
    const t = setInterval(() => {
      n = Math.min(n + max, target);
      el.textContent = n.toLocaleString("id-ID");
      if (n >= target) clearInterval(t);
    }, 30);
  });
}
const io = new IntersectionObserver(
  (ents) => {
    ents.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("muncul");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.16 }
);
$$(".reveal").forEach((el) => io.observe(el));

// statistik hero: jalankan begitu halaman siap (hero langsung terlihat)
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", hitungAngka);
} else {
  hitungAngka();
}

// ===== JADWAL =====
function renderJadwal() {
  const tbody = $("#jadwal");
  if (!tbody) return;
  tbody.innerHTML = (USAHA.jadwal || [])
    .map((j) => `<tr class="border-b border-garis/70 last:border-0"><td class="py-1.5">${escapeHtml(j.hari)}</td><td class="py-1.5 text-right font-semibold">${escapeHtml(j.jam)}</td></tr>`)
    .join("");
}
renderJadwal();

// ===== ULASAN (desktop: carousel · mobile: daftar per halaman) =====
const KEY_ULASAN = "kantin_ulasan";

function ambilUlasanPengguna() {
  const list = muat(KEY_ULASAN, []);
  if (!Array.isArray(list)) return [];
  return list
    .filter((u) => u && typeof u.nama === "string" && typeof u.teks === "string")
    .map((u) => ({
      nama: u.nama.slice(0, 60),
      teks: u.teks.slice(0, 500),
      rating: Math.min(5, Math.max(1, parseInt(u.rating, 10) || 5)),
      tanggal: u.tanggal || "",
      baru: true,
    }));
}
function semuaUlasan() {
  const pengguna = ambilUlasanPengguna();
  const tetap = TESTIMONI.map((t) => ({
    nama: t.nama,
    teks: t.teks,
    rating: Math.min(5, Math.max(1, parseInt(t.rating, 10) || 5)),
    tanggal: "",
    baru: false,
  }));
  return [...pengguna, ...tetap];
}
function barBintang(n) {
  const r = Math.min(5, Math.max(0, Math.round(n || 0)));
  return "★".repeat(r) + "☆".repeat(5 - r);
}

let pageUlasan = 1;
let idxUlasan = 0;
let daftarUlasanSekarang = [];
let timerUlasan = null;

function tampilUlasan(n) {
  const list = daftarUlasanSekarang;
  if (!list.length) return;
  idxUlasan = (n + list.length) % list.length;
  $$(".slide").forEach((s, i) => s.classList.toggle("hidden", i !== idxUlasan));
  $$("#titik span").forEach((s, i) => s.classList.toggle("!bg-aksen", i === idxUlasan));
}
function stopUlasan() {
  clearInterval(timerUlasan);
  timerUlasan = null;
}
function mulaiUlasan() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  stopUlasan();
  timerUlasan = setInterval(() => tampilUlasan(idxUlasan + 1), 5000);
}

function renderUlasan() {
  const track = $("#track");
  const titik = $("#titik");
  if (!track) return;
  const list = semuaUlasan();
  daftarUlasanSekarang = list;

  // --- carousel (desktop) ---
  track.innerHTML = list
    .map(
      (t, i) => `<div class="slide hidden" data-i="${i}">
        <p class="text-lg italic">“${escapeHtml(t.teks)}”</p>
        <p class="mt-3 font-bold">– ${escapeHtml(t.nama)} · ${barBintang(t.rating)}</p>
        ${t.baru ? '<span class="mt-2 inline-block rounded-full bg-aksen px-2.5 py-0.5 text-xs font-bold text-white">Ulasan Baru</span>' : ""}
      </div>`
    )
    .join("");
  titik.innerHTML = list.map(() => `<span class="h-2 w-2 rounded-full bg-garis"></span>`).join("");

  const totalRating = list.reduce((s, x) => s + x.rating, 0);
  const rata = list.length ? (totalRating / list.length).toFixed(1) : "0";
  $("#ringkas-rating").textContent = rata;
  $("#ringkas-jumlah").textContent = list.length;
  $("#ringkas-bintang").textContent = barBintang(parseFloat(rata));

  idxUlasan = 0;
  tampilUlasan(0);
  renderUlasanMobile();
}

// daftar ulasan khusus mobile (paginasi 3–4 item per halaman)
function renderUlasanMobile() {
  const wrap = $("#daftar-ulasan-mobile");
  if (!wrap) return;
  const list = semuaUlasan();
  const per = perHalaman(PAGE_ULASAN);
  const jumlahHal = Math.max(1, Math.ceil(list.length / per));
  if (pageUlasan > jumlahHal) pageUlasan = jumlahHal;
  const mulai = (pageUlasan - 1) * per;
  const potong = list.slice(mulai, mulai + per);

  wrap.innerHTML = potong.length
    ? potong
        .map(
          (t) => `<article class="rounded-2xl border border-garis bg-latar2 p-4">
            <div class="flex items-start justify-between gap-3">
              <p class="text-sm italic">“${escapeHtml(t.teks)}”</p>
              <span class="shrink-0 text-sm text-aksen">${barBintang(t.rating)}</span>
            </div>
            <p class="mt-2 text-sm font-bold">– ${escapeHtml(t.nama)}</p>
            <div class="mt-1 flex flex-wrap items-center gap-2 text-xs text-redup">
              ${t.baru ? '<span class="rounded-full bg-aksen px-2 py-0.5 font-bold text-white">Ulasan Baru</span>' : ""}
              ${t.tanggal ? `<span>🗓️ ${escapeHtml(t.tanggal)}</span>` : ""}
            </div>
          </article>`
        )
        .join("")
    : `<p class="py-6 text-center text-sm text-redup">Belum ada ulasan. Jadilah yang pertama!</p>`;

  PAGINASI.ulasan = (n) => {
    pageUlasan = n;
    renderUlasanMobile();
    $("#daftar-ulasan-mobile")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  renderPagination($("#pagination-ulasan"), {
    halaman: pageUlasan,
    jumlah: jumlahHal,
    target: "ulasan",
    info: list.length
      ? `Ulasan ${mulai + 1}–${mulai + potong.length} dari ${list.length} · ${per} per halaman (${namaLayar()})`
      : "",
  });
}

// listener carousel dipasang SEKALI (tidak ikut terduplikasi saat render ulang)
$("#prev")?.addEventListener("click", () => tampilUlasan(idxUlasan - 1));
$("#next")?.addEventListener("click", () => tampilUlasan(idxUlasan + 1));
$("#titik")?.addEventListener("click", (e) => {
  const spans = Array.from($$("#titik span"));
  const i = spans.indexOf(e.target);
  if (i >= 0) tampilUlasan(i);
});
$("#ulasan")?.addEventListener("mouseenter", stopUlasan);
$("#ulasan")?.addEventListener("mouseleave", mulaiUlasan);
document.addEventListener("visibilitychange", () => (document.hidden ? stopUlasan() : mulaiUlasan()));


// ===== VOUCHER =====
function renderVoucher() {
  const wrap = $("#daftar-voucher");
  if (!wrap) return;
  wrap.innerHTML = VOUCHER.map((v) => {
    let teks = v.tipe === "persen" ? `${v.nilai}%` : `Rp ${v.nilai.toLocaleString("id-ID")}`;
    return `<button class="flex items-center gap-2 rounded-full border border-garis bg-kartu px-3 py-1.5 text-sm font-semibold hover:border-aksen" data-copy="${v.kode}" title="Salin kode ${v.kode}">
      <span class="rounded-full bg-latar2 px-2 py-0.5 text-xs font-extrabold">${v.kode}</span>
      <span>${teks}</span>
      <span class="text-xs text-redup">${v.ket}</span>
    </button>`;
  }).join("");
  wrap.addEventListener("click", (e) => {
    const b = e.target.closest("[data-copy]");
    if (!b) return;
    const kode = b.dataset.copy;
    navigator.clipboard?.writeText(kode).then(() => toast(`Kode ${kode} disalin`));
  });
}
renderVoucher();

// ===== MENU =====
const kategoris = ["Semua", ...new Set(PRODUK.map((p) => p.kategori))];
let katAktif = "Semua";
function renderKat() {
  const wrap = $("#kategori");
  if (!wrap) return;
  wrap.innerHTML = kategoris
    .map((k) => `<button class="whitespace-nowrap rounded-full border border-garis bg-kartu px-4 py-1.5 text-sm font-semibold ${k===katAktif?"!border-aksen !bg-latar2":"hover:border-aksen"}" data-kat="${k}">${k}</button>`)
    .join("");
}
$("#kategori").addEventListener("click", (e) => {
  const b = e.target.closest("[data-kat]");
  if (!b) return;
  katAktif = b.dataset.kat;
  pageMenu = 1;
  renderKat();
  renderMenu();
});
renderKat();
let pageMenu = 1;
function renderMenu() {
  const cari = ($("#cari").value || "").toLowerCase();
  const hasil = PRODUK.filter(
    (p) =>
      (katAktif === "Semua" || p.kategori === katAktif) &&
      (p.nama.toLowerCase().includes(cari) || p.deskripsi.toLowerCase().includes(cari))
  );
  const wrap = $("#daftar-menu");
  const kosong = $("#kosong");
  const per = perHalaman(PAGE_MENU);
  const jumlahHal = Math.max(1, Math.ceil(hasil.length / per));
  if (pageMenu > jumlahHal) pageMenu = jumlahHal;
  const mulai = (pageMenu - 1) * per;
  const potong = hasil.slice(mulai, mulai + per);

  wrap.innerHTML = potong
    .map((p) => {
      const img = p.foto && p.foto.trim() !== "" ? p.foto : `https://placehold.co/600x400/F5F0E8/5A3921?text=${encodeURIComponent(p.emoji+" "+p.nama)}`;
      const bintang = "★".repeat(Math.round(p.rating||4)) + "☆".repeat(5 - Math.round(p.rating||4));
      return `<article class="flex flex-col overflow-hidden rounded-2xl border border-garis bg-kartu shadow-sm transition hover:-translate-y-1 hover:shadow-md">
        <div class="relative aspect-[4/3] w-full bg-latar2">
          <img src="${img}" alt="${escapeHtml(p.nama)}" class="h-full w-full object-cover" loading="lazy" onerror="this.src='https://placehold.co/600x400/F5F0E8/5A3921?text=Menu+Kantin'">
          ${p.rating?`<span class="absolute left-2 top-2 rounded-full bg-kartu/90 px-2 py-0.5 text-xs font-bold">${bintang} ${p.rating.toFixed(1)}</span>`:""}
          ${p.terjual?`<span class="absolute right-2 top-2 rounded-full bg-kartu/90 px-2 py-0.5 text-xs font-semibold text-redup">${p.terjual}+ terjual</span>`:""}
        </div>
        <div class="flex flex-1 flex-col p-4">
          <div class="flex items-start justify-between gap-2">
            <h3 class="text-base font-extrabold">${escapeHtml(p.nama)}</h3>
            <p class="whitespace-nowrap text-lg font-extrabold text-utama">${rupiah(p.harga)}</p>
          </div>
          <p class="mt-1 text-sm text-redup">${escapeHtml(p.deskripsi)}</p>
          <button class="btn btn-utama mt-auto w-full" data-tambah="${p.id}">➕ Masukkan Keranjang</button>
        </div>
      </article>`;
    })
    .join("");
  kosong.classList.toggle("hidden", hasil.length > 0);

  PAGINASI.menu = (n) => {
    pageMenu = n;
    renderMenu();
    $("#daftar-menu")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  renderPagination($("#pagination-menu"), {
    halaman: pageMenu,
    jumlah: jumlahHal,
    target: "menu",
    info: hasil.length
      ? `Menampilkan ${mulai + 1}–${mulai + potong.length} dari ${hasil.length} menu · ${per} per halaman (${namaLayar()})`
      : "",
  });

  const infoPage = $("#info-page");
  if (infoPage) {
    infoPage.textContent = hasil.length
      ? `${hasil.length} menu ditemukan · ${per} menu per halaman di tampilan ${namaLayar()}`
      : "";
  }
}
$("#cari").addEventListener("input", () => {
  pageMenu = 1;
  renderMenu();
});
$("#daftar-menu").addEventListener("click", (e) => {
  const b = e.target.closest("[data-tambah]");
  if (!b) return;
  const id = b.dataset.tambah;
  const p = PRODUK.find((x) => x.id === id);
  if (p) tambahKeranjang(p);
});

// ===== KERANJANG =====
let keranjang = muat("kantin_keranjang", []);
let voucherDipakai = null;
function renderBadge() {
  const b = $("#badge");
  const jum = keranjang.reduce((s, x) => s + x.qty, 0);
  if (!b) return;
  b.textContent = jum;
  b.classList.toggle("hidden", jum === 0);
  b.classList.toggle("grid", jum > 0);
}
function tambahKeranjang(p) {
  const ada = keranjang.find((x) => x.id === p.id);
  if (ada) ada.qty++;
  else keranjang.push({ id: p.id, nama: p.nama, harga: p.harga, qty: 1 });
  simpan("kantin_keranjang", keranjang);
  renderKeranjang();
  bukaDrawer(true);
  toast(`${p.nama} ditambahkan`);
}
function renderKeranjang() {
  const wrap = $("#daftar-keranjang");
  if (!wrap) return;
  wrap.innerHTML = keranjang.length
    ? keranjang
        .map((x, i) => {
          const item = PRODUK.find((p) => p.id === x.id) || x;
          return `<div class="mb-3 flex gap-3 rounded-2xl border border-garis bg-kartu p-3">
            <div class="flex-1">
              <p class="font-bold">${escapeHtml(x.nama)}</p>
              <p class="text-sm text-utama">${rupiah(x.harga)}</p>
              <p class="mt-1 text-xs text-redup">${rupiah(x.harga * x.qty)} subtotal</p>
            </div>
            <div class="flex h-9 items-center gap-2 rounded-full border border-garis px-2">
              <button class="px-1" data-aksi="kur" data-i="${i}" aria-label="Kurangi">−</button>
              <span class="min-w-6 text-center text-sm font-bold">${x.qty}</span>
              <button class="px-1" data-aksi="tbh" data-i="${i}" aria-label="Tambah">+</button>
            </div>
          </div>`;
        })
        .join("")
    : `<div class="py-10 text-center text-redup">Keranjang masih kosong.<br>Pilih menu dari daftar di atas 😊</div>`;
  $("#btn-kosongkan").classList.toggle("hidden", keranjang.length === 0);
  hitungTotal();
  renderBadge();
}
$("#daftar-keranjang").addEventListener("click", (e) => {
  const { aksi, i } = e.target.dataset;
  if (!aksi) return;
  const idx = parseInt(i);
  if (aksi === "tbh") keranjang[idx].qty++;
  if (aksi === "kur") {
    keranjang[idx].qty--;
    if (keranjang[idx].qty <= 0) keranjang.splice(idx, 1);
  }
  simpan("kantin_keranjang", keranjang);
  renderKeranjang();
});
$("#btn-kosongkan").addEventListener("click", () => {
  keranjang = [];
  voucherDipakai = null;
  $("#input-voucher").value = "";
  $("#info-voucher").textContent = "";
  $("#baris-diskon").classList.add("hidden");
  simpan("kantin_keranjang", keranjang);
  renderKeranjang();
});

// ===== HITUNG TOTAL & VOUCHER =====
function hitungTotal() {
  const subtotal = keranjang.reduce((s, x) => s + x.harga * x.qty, 0);
  $("#subtotal").textContent = rupiah(subtotal);
  let diskon = 0;
  if (voucherDipakai) {
    if (subtotal >= (voucherDipakai.min || 0)) {
      if (voucherDipakai.tipe === "persen") {
        diskon = Math.floor((subtotal * voucherDipakai.nilai) / 100);
        if (voucherDipakai.maks > 0) diskon = Math.min(diskon, voucherDipakai.maks);
      } else if (voucherDipakai.tipe === "nominal") {
        diskon = voucherDipakai.nilai;
      }
      if (diskon > subtotal) diskon = subtotal;
      $("#kode-terpakai").textContent = voucherDipakai.kode;
      $("#diskon").textContent = "−" + rupiah(diskon);
      $("#baris-diskon").classList.remove("hidden");
      $("#baris-diskon").classList.add("flex");
    } else {
      voucherDipakai = null;
      $("#info-voucher").textContent = "Min. belanja belum terpenuhi untuk voucher ini.";
      $("#baris-diskon").classList.add("hidden");
    }
  } else {
    $("#baris-diskon").classList.add("hidden");
  }
  const total = Math.max(0, subtotal - diskon);
  $("#total").textContent = rupiah(total);
}
$("#btn-voucher").addEventListener("click", () => {
  const kode = ($("#input-voucher").value || "").trim().toUpperCase();
  if (!kode) return (toast("Masukkan kode voucher"));
  const v = VOUCHER.find((x) => x.kode === kode);
  if (!v) {
    voucherDipakai = null;
    $("#info-voucher").textContent = "Kode voucher tidak ditemukan.";
    $("#baris-diskon").classList.add("hidden");
    hitungTotal();
    return;
  }
  voucherDipakai = v;
  $("#info-voucher").textContent = v.ket;
  hitungTotal();
  toast(`Voucher ${v.kode} diterapkan`);
});

// ===== DRAWER =====
function bukaDrawer(on) {
  const d = $("#drawer");
  const o = $("#overlay");
  if (!d || !o) return;
  d.classList.toggle("translate-x-full", !on);
  d.classList.toggle("translate-x-0", on);
  o.classList.toggle("opacity-0", !on);
  o.classList.toggle("pointer-events-none", !on);
  o.classList.toggle("pointer-events-auto", on);
  d.setAttribute("aria-hidden", String(!on));
}
$("#btn-keranjang").addEventListener("click", () => bukaDrawer(true));
$("#tutup-drawer").addEventListener("click", () => bukaDrawer(false));
$("#overlay").addEventListener("click", () => bukaDrawer(false));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    bukaDrawer(false);
    tutupLightbox();
    tutupModalUlasan();
    $("#panel-menu")?.classList.add("hidden");
  }
});

// ===== CHECKOUT KE WHATSAPP =====
$("#form-pesan").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!keranjang.length) return toast("Keranjang masih kosong");
  const f = e.target;
  if (!f.reportValidity()) return;
  const subtotal = keranjang.reduce((s, x) => s + x.harga * x.qty, 0);
  let diskon = 0;
  if (voucherDipakai) {
    if (subtotal >= (voucherDipakai.min || 0)) {
      if (voucherDipakai.tipe === "persen") {
        diskon = Math.floor((subtotal * voucherDipakai.nilai) / 100);
        if (voucherDipakai.maks > 0) diskon = Math.min(diskon, voucherDipakai.maks);
      } else diskon = voucherDipakai.nilai;
      if (diskon > subtotal) diskon = subtotal;
    }
  }
  const total = Math.max(0, subtotal - diskon);
  const daftar = keranjang.map((x) => `- ${x.nama} x${x.qty} = ${rupiah(x.harga * x.qty)}`).join("\n");
  let vline = "";
  if (voucherDipakai && diskon > 0) vline = `Voucher: ${voucherDipakai.kode} (−${rupiah(diskon)})\n`;
  const el = f.elements;
  const catatan = el.catatan.value.trim() ? `\nCatatan: ${el.catatan.value.trim()}` : "";

  // metode pembayaran (+ rekening bila transfer bank)
  const daftarMetode = metodeAktif();
  const metode = daftarMetode.find((m) => m.id === el.bayar.value) || daftarMetode[0];
  let bline = "";
  if (metode) {
    bline = `\nMetode bayar: ${metode.nama}`;
    const rek = USAHA.rekening || [];
    if (rek.length && /bank|transfer|rekening/i.test(`${metode.id} ${metode.nama}`)) {
      bline += "\nRekening:\n" + rek.map((r) => `- ${r.bank} ${r.no} a.n. ${r.atas}`).join("\n");
    }
  }

  const pesan = `Halo ${USAHA.nama}, saya mau pesan:\n${daftar}\n\nSubtotal: ${rupiah(subtotal)}\n${vline}Total: ${rupiah(total)}\nNama: ${el.nama.value.trim()}\nTipe: ${el.tipe.value}${bline}${catatan}`;
  window.open(linkWA(pesan), "_blank", "noopener");
  keranjang = [];
  voucherDipakai = null;
  $("#input-voucher").value = "";
  $("#info-voucher").textContent = "";
  simpan("kantin_keranjang", keranjang);
  renderKeranjang();
  f.reset();
  bukaDrawer(false);
  toast("Pesanan terbuka di WhatsApp ✅");
});

// ===== KONTAK CEK VALIDASI =====
$("#form-kontak").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.target;
  const el = f.elements;
  const err = $("#error-kontak");
  const nama = el.nama.value.trim();
  const hp = el.hp.value.trim();
  const pesan = el.pesan.value.trim();
  function setErr(m) { if (err) err.textContent = m || ""; return !m; }
  if (nama.length < 3) return setErr("Nama minimal 3 huruf.");
  if (!/^0\d{8,12}$/.test(hp)) return setErr("Nomor HP harus diawali 0 dan 9–13 digit.");
  if (pesan.length < 5) return setErr("Pesan minimal 5 karakter.");
  if (!setErr("")) return;
  const waMsg = `Halo ${USAHA.nama}, saya ${nama} (${hp}).\n${pesan}`;
  window.open(linkWA(waMsg), "_blank", "noopener");
  f.reset();
  toast("Pesanmu diarahkan ke WhatsApp ✅");
});

// ===== GALERI (paginasi: mobile 4 foto per halaman, desktop 9) =====
let pageGaleri = 1;
function renderGaleri() {
  const wrap = $("#grid-galeri");
  if (!wrap) return;
  const per = perHalaman(PAGE_GALERI);
  const jumlahHal = Math.max(1, Math.ceil(GALERI.length / per));
  if (pageGaleri > jumlahHal) pageGaleri = jumlahHal;
  const mulai = (pageGaleri - 1) * per;
  const potong = GALERI.slice(mulai, mulai + per);

  wrap.innerHTML = potong
    .map((g, i) => {
      const img = g.foto && g.foto.trim() !== "" ? g.foto : `https://placehold.co/600x600/F5F0E8/5A3921?text=${encodeURIComponent(g.emoji||"📷")}`;
      const idx = mulai + i;
      return `<button class="group overflow-hidden rounded-2xl" data-lightbox data-i="${idx}" aria-label="Lihat foto ${idx+1}">
      <img src="${img}" alt="${escapeHtml(g.alt||"Foto galeri")}" class="h-44 w-full object-cover transition group-hover:scale-105" loading="lazy" onerror="this.src='https://placehold.co/600x600/F5F0E8/5A3921?text=Galeri'">
    </button>`;
    })
    .join("");

  PAGINASI.galeri = (n) => {
    pageGaleri = n;
    renderGaleri();
    $("#grid-galeri")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  renderPagination($("#pagination-galeri"), {
    halaman: pageGaleri,
    jumlah: jumlahHal,
    target: "galeri",
    info: `Foto ${mulai + 1}–${mulai + potong.length} dari ${GALERI.length} · ${per} per halaman (${namaLayar()})`,
  });
}
let lbIdx = 0;
function bukaLightbox(i) {
  const g = GALERI[i];
  if (!g) return;
  lbIdx = i;
  const img = g.foto && g.foto.trim() !== "" ? g.foto : `https://placehold.co/1200x900/F5F0E8/5A3921?text=Foto`;
  $("#lightbox-img").src = img;
  $("#lightbox-img").alt = g.alt || "Foto galeri";
  $("#lightbox-caption").textContent = g.alt || "";
  $("#lightbox").classList.remove("hidden");
  $("#lightbox").classList.add("flex");
}
function tutupLightbox() {
  $("#lightbox").classList.add("hidden");
  $("#lightbox").classList.remove("flex");
}
$("#grid-galeri").addEventListener("click", (e) => {
  const b = e.target.closest("[data-lightbox]");
  if (!b) return;
  bukaLightbox(parseInt(b.dataset.i));
});
$("#lightbox-tutup").addEventListener("click", tutupLightbox);
$("#lightbox").addEventListener("click", (e) => {
  if (e.target.id === "lightbox") tutupLightbox();
});
$("#lightbox-prev").addEventListener("click", (e) => {
  e.stopPropagation();
  bukaLightbox((lbIdx - 1 + GALERI.length) % GALERI.length);
});
$("#lightbox-next").addEventListener("click", (e) => {
  e.stopPropagation();
  bukaLightbox((lbIdx + 1) % GALERI.length);
});

// ===== METODE PEMBAYARAN =====
function metodeAktif() {
  const list = typeof PEMBAYARAN !== "undefined" ? PEMBAYARAN : [];
  return Array.isArray(list) ? list.filter((p) => p && p.aktif !== false) : [];
}
function renderPembayaran() {
  const list = metodeAktif();
  const wrap = $("#grid-pembayaran");
  if (wrap) {
    wrap.innerHTML = list.length
      ? list
          .map(
            (p) => `<article class="flex flex-col rounded-2xl border border-garis bg-kartu p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
        <div class="flex items-center gap-3">
          <span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-latar2 text-2xl">${escapeHtml(p.emoji || "💳")}</span>
          <h3 class="text-base font-extrabold">${escapeHtml(p.nama)}</h3>
        </div>
        <p class="mt-3 flex-1 text-sm text-redup">${escapeHtml(p.ket || "")}</p>
        ${p.catatan ? `<p class="mt-3 rounded-xl bg-latar2 px-3 py-2 text-xs font-semibold">💡 ${escapeHtml(p.catatan)}</p>` : ""}
      </article>`
          )
          .join("")
      : `<p class="col-span-full rounded-2xl border border-dashed border-garis p-6 text-center text-sm text-redup">Belum ada metode pembayaran yang terdaftar.</p>`;
  }

  // info rekening bank (kalau ada)
  const rek = USAHA.rekening || [];
  const info = $("#info-rekening");
  if (info) {
    if (rek.length) {
      info.classList.remove("hidden");
      info.innerHTML = `<p class="text-sm font-extrabold">🏦 No. rekening untuk transfer bank</p>
        <div class="mt-3 grid gap-2 sm:grid-cols-2">
          ${rek
            .map(
              (r) => `<div class="rounded-xl border border-garis bg-latar2 px-3 py-2 text-sm">
            <strong>${escapeHtml(r.bank)}</strong> · <span class="font-mono">${escapeHtml(r.no)}</span>
            <span class="block text-xs text-redup">a.n. ${escapeHtml(r.atas)}</span>
          </div>`
            )
            .join("")}
        </div>`;
    } else {
      info.classList.add("hidden");
      info.innerHTML = "";
    }
  }

  // jawaban FAQ dibuat otomatis dari daftar metode
  const faq = $("#faq-bayar");
  if (faq) {
    faq.textContent = list.length
      ? `${list.map((p) => p.nama).join(", ")} tersedia di kantin kami. Pembayaran dilakukan di kasir saat mengambil pesanan.`
      : "Silakan tanyakan metode pembayaran yang tersedia lewat WhatsApp.";
  }

  // pilihan metode di keranjang
  const sel = $("#input-pembayaran");
  if (sel) {
    const sebelumnya = sel.value;
    sel.innerHTML = list.length
      ? list.map((p) => `<option value="${escapeHtml(p.id)}">${escapeHtml(p.emoji || "💳")} ${escapeHtml(p.nama)}</option>`).join("")
      : `<option value="">Belum ada metode</option>`;
    if (list.some((p) => p.id === sebelumnya)) sel.value = sebelumnya;
    updateInfoBayar();
  }
}
function updateInfoBayar() {
  const sel = $("#input-pembayaran");
  const info = $("#info-pembayaran");
  if (!sel || !info) return;
  const p = metodeAktif().find((x) => x.id === sel.value);
  info.textContent = p ? p.catatan || p.ket || "" : "";
}
$("#input-pembayaran")?.addEventListener("change", updateInfoBayar);

// ===== TAMBAH ULASAN =====
function setRating(n) {
  const input = $("#input-rating");
  if (input) input.value = String(n);
  $$("#bintang-pilih .bintang").forEach((b) => {
    const v = parseInt(b.dataset.bintang, 10);
    b.classList.toggle("text-aksen", v <= n);
    b.classList.toggle("opacity-30", v > n);
  });
}
function bukaModalUlasan() {
  const m = $("#modal-ulasan");
  if (!m) return;
  m.classList.remove("hidden");
  m.classList.add("flex");
  setRating(5);
  $("#input-nama-ulasan")?.focus();
}
function tutupModalUlasan() {
  const m = $("#modal-ulasan");
  if (!m) return;
  m.classList.add("hidden");
  m.classList.remove("flex");
}
document.addEventListener("click", (e) => {
  if (e.target.closest("[data-tambah-ulasan]")) {
    bukaModalUlasan();
    return;
  }
  if (e.target.id === "modal-ulasan") tutupModalUlasan();
});
$("#tutup-ulasan")?.addEventListener("click", tutupModalUlasan);
$("#bintang-pilih")?.addEventListener("click", (e) => {
  const b = e.target.closest("[data-bintang]");
  if (!b) return;
  setRating(parseInt(b.dataset.bintang, 10));
});
$("#form-ulasan")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.target;
  const el = f.elements;
  const err = $("#error-ulasan");
  const nama = el.nama.value.trim();
  const teks = el.teks.value.trim();
  const rating = Math.min(5, Math.max(1, parseInt($("#input-rating").value, 10) || 5));
  function setErr(m) {
    if (err) err.textContent = m || "";
    return !m;
  }
  if (nama.length < 3) return setErr("Nama minimal 3 huruf.");
  if (teks.length < 10) return setErr("Ulasan minimal 10 karakter.");
  if (!setErr("")) return;

  const list = ambilUlasanPengguna();
  list.unshift({
    nama,
    teks,
    rating,
    tanggal: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
  });
  simpan(KEY_ULASAN, list.slice(0, 50)); // batasi 50 ulasan tersimpan

  const mauWA = el.kirimWA.checked;
  f.reset();
  setRating(5);
  tutupModalUlasan();
  pageUlasan = 1;
  renderUlasan();
  toast("Terima kasih! Ulasanmu tersimpan ✅");
  if (mauWA) {
    const pesan = `Halo ${USAHA.nama}, saya mau mengirim ulasan:\n\n⭐ Rating: ${rating}/5\n"${teks}"\n— ${nama}`;
    window.open(linkWA(pesan), "_blank", "noopener");
  }
});

// ===== NAV & TEMA & ATAS =====
$("#btn-menu").addEventListener("click", () => {
  $("#panel-menu").classList.toggle("hidden");
  $("#btn-menu").setAttribute("aria-expanded", String(!$("#panel-menu").classList.contains("hidden")));
});
$$("header a[href^='#']").forEach((a) => {
  a.addEventListener("click", () => {
    $("#panel-menu").classList.add("hidden");
    $("#btn-menu").setAttribute("aria-expanded", "false");
  });
});

const temaKey = "kantin_tema";
function pasangTema(t) {
  document.documentElement.dataset.tema = t;
  $("#btn-tema").textContent = t === "gelap" ? "☀️" : "🌙";
}
pasangTema(muat(temaKey, "terang"));
$("#btn-tema").addEventListener("click", () => {
  const baru = document.documentElement.dataset.tema === "gelap" ? "terang" : "gelap";
  simpan(temaKey, baru);
  pasangTema(baru);
});

const btnAtas = $("#btn-atas");
window.addEventListener("scroll", () => {
  const show = window.scrollY > 400;
  btnAtas.classList.toggle("opacity-0", !show);
  btnAtas.classList.toggle("pointer-events-none", !show);
  btnAtas.classList.toggle("pointer-events-auto", show);
});
btnAtas.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ===== INISIALISASI =====
isiData();
renderKat();
renderMenu();
renderGaleri();
renderUlasan();
mulaiUlasan();
renderPembayaran();
renderKeranjang();
renderJadwal();

// ===== PERUBAHAN UKURAN LAYAR =====
// jumlah item per halaman menyesuaikan breakpoint (mobile ≠ desktop)
let bpTerakhir = breakpoint();
let timerResize;
window.addEventListener("resize", () => {
  clearTimeout(timerResize);
  timerResize = setTimeout(() => {
    if (breakpoint() === bpTerakhir) return;
    bpTerakhir = breakpoint();
    pageMenu = 1;
    pageGaleri = 1;
    pageUlasan = 1;
    renderMenu();
    renderGaleri();
    renderUlasan();
  }, 150);
});
