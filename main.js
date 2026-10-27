// ======================================================================
// LOGIKA HALAMAN — Kantin Siswa
// HTML + Tailwind CSS + JavaScript murni, tanpa backend.
// ======================================================================

// ===== HELPER =====
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

const rupiah = (n) => "Rp " + Math.round(n).toLocaleString("id-ID");

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = String(str);
  return div.innerHTML;
}

function inisial(nama) {
  const kata = String(nama || "?").trim().split(/\s+/).slice(0, 2);
  return kata.map((k) => k.charAt(0)).join("").toUpperCase() || "?";
}

function toast(teks, opsi = {}) {
  const t = $("#toast");
  if (!t) return;
  const span = $("#toast-teks");
  if (span) span.textContent = teks;
  else t.textContent = teks;

  const aksi = $("#toast-aksi");
  toast._aksi = typeof opsi.aksi === "function" ? opsi.aksi : null;
  if (aksi) {
    aksi.classList.toggle("hidden", !toast._aksi);
    if (toast._aksi) aksi.textContent = opsi.label || "Lihat";
  }

  t.classList.add("tampil");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove("tampil"), opsi.durasi || 3000);
}

$("#toast-aksi")?.addEventListener("click", () => {
  const fn = toast._aksi;
  clearTimeout(toast.timer);
  $("#toast")?.classList.remove("tampil");
  if (fn) fn();
});

function linkWA(pesan) {
  return `https://wa.me/${USAHA.wa}?text=${encodeURIComponent(pesan)}`;
}

function simpan(k, v) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch (e) {
    /* penyimpanan browser bisa penuh / diblokir */
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
const PAGE_GALERI = { mobile: 4, tablet: 6, desktop: 6, lebar: 6 };
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
    "grid h-10 min-w-10 place-items-center rounded-xl border-2 border-garis px-3 text-sm font-extrabold transition focus-visible:ring-4 focus-visible:ring-aksen/40";
  const nonaktif = "bg-kartu text-teks hover:bg-kuning hover:text-[#17130f]";
  const tombol = [
    `<button type="button" class="${base} ${nonaktif} ${halaman === 1 ? "pointer-events-none opacity-35" : ""}" data-hal="${halaman - 1}" data-hal-target="${target}" aria-label="Halaman sebelumnya">‹</button>`,
  ];
  nomorHalaman(halaman, jumlah).forEach((n) => {
    if (n === "…") {
      tombol.push(`<span class="px-1 text-sm font-bold text-redup">…</span>`);
      return;
    }
    const aktif = n === halaman;
    tombol.push(
      `<button type="button" class="${base} ${aktif ? "bg-tombol text-tombol-teks shadow-brut-sm" : nonaktif}" data-hal="${n}" data-hal-target="${target}" aria-label="Halaman ${n}" ${aktif ? 'aria-current="page"' : ""}>${n}</button>`
    );
  });
  tombol.push(
    `<button type="button" class="${base} ${nonaktif} ${halaman === jumlah ? "pointer-events-none opacity-35" : ""}" data-hal="${halaman + 1}" data-hal-target="${target}" aria-label="Halaman berikutnya">›</button>`
  );
  wrap.innerHTML = `<div class="flex flex-wrap items-center justify-center gap-2">${tombol.join("")}</div>${
    info ? `<p class="mt-3 text-center text-[11px] font-semibold text-redup">${info}</p>` : ""
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

// ===== STATUS BUKA/TUTUP + JADWAL ISTIRAHAT =====
function keMenit(jam) {
  if (typeof jam !== "string" || !jam.includes(":")) return 0;
  const bagian = jam.split(":");
  return (parseInt(bagian[0], 10) || 0) * 60 + (parseInt(bagian[1], 10) || 0);
}
function formatJam(menit) {
  const h = String(Math.floor(menit / 60) % 24).padStart(2, "0");
  const m = String(Math.round(menit) % 60).padStart(2, "0");
  return `${h}.${m}`;
}
function sisaMenit(target, sekarang) {
  return Math.max(0, Math.round(target - sekarang));
}

function formatDurasi(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const j = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const d = total % 60;
  if (j > 0) return `${j}:${String(m).padStart(2, "0")}:${String(d).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(d).padStart(2, "0")}`;
}

let statusTargetMs = 0;
let statusStartMs = 0;
let statusLabel = "";

function waktuDiHari(now, menit, offsetHari = 0) {
  const d = new Date(now);
  d.setDate(d.getDate() + offsetHari);
  d.setHours(Math.floor(menit / 60), menit % 60, 0, 0);
  return d.getTime();
}

function bukaBerikutnya(now, bukaMenit) {
  const libur = Array.isArray(USAHA.libur) ? USAHA.libur : [];
  for (let i = 0; i <= 7; i++) {
    const calon = waktuDiHari(now, bukaMenit, i);
    if (!libur.includes(new Date(calon).getDay()) && calon > now.getTime()) return calon;
  }
  return now.getTime() + 86400000;
}

function tickCountdown() {
  const el = $("#status-countdown");
  if (el) el.textContent = statusTargetMs ? formatDurasi(statusTargetMs - Date.now()) : "--:--";
  if (statusTargetMs && Date.now() >= statusTargetMs) {
    cekStatus();
    return;
  }
  const bar = $("#status-progress");
  if (bar && statusTargetMs > statusStartMs) {
    const persen = Math.min(100, Math.max(0, ((Date.now() - statusStartMs) / (statusTargetMs - statusStartMs)) * 100));
    bar.style.width = persen.toFixed(1) + "%";
  }
}

function renderStatusIstirahat(aktif, menitSekarang) {
  const wrap = $("#status-istirahat");
  if (!wrap) return;
  const daftar = Array.isArray(USAHA.istirahat) ? USAHA.istirahat : [];
  if (!daftar.length) {
    wrap.innerHTML = `<p class="col-span-2 rounded-xl border-2 border-dashed border-lembut px-3 py-3 text-center text-[11px] font-semibold text-redup">Jadwal istirahat belum diatur.</p>`;
    return;
  }
  wrap.innerHTML = daftar
    .map((i) => {
      const mulai = keMenit(i.mulai);
      const selesai = keMenit(i.selesai);
      const sedang = !!aktif && aktif.nama === i.nama;
      const sudah = menitSekarang >= selesai;
      return `<div class="status-slot ${sedang ? "aktif" : ""} ${sudah && !sedang ? "opacity-55" : ""}">
        <p class="text-[9px] font-extrabold uppercase tracking-wider ${sedang ? "text-[#17130f]" : "text-redup"}">${sedang ? "● Buka sekarang" : sudah ? "✓ Selesai" : "Istirahat"}</p>
        <p class="mt-0.5 truncate text-[11px] font-extrabold leading-tight">${escapeHtml(i.nama)}</p>
        <p class="text-[10px] font-bold ${sedang ? "text-[#17130f]/70" : "text-redup"}">${escapeHtml(i.mulai)}–${escapeHtml(i.selesai)}</p>
      </div>`;
    })
    .join("");
}

function cekStatus() {
  const now = new Date();
  const hari = now.getDay();
  const menitSekarang = now.getHours() * 60 + now.getMinutes();
  const libur = Array.isArray(USAHA.libur) && USAHA.libur.includes(hari);
  const bukaMenit = (Number(USAHA.jamBuka) || 0) * 60;
  const tutupMenit = (Number(USAHA.jamTutup) || 24) * 60;
  const daftarIstirahat = Array.isArray(USAHA.istirahat) ? USAHA.istirahat : [];
  const aktif = daftarIstirahat.find((i) => menitSekarang >= keMenit(i.mulai) && menitSekarang < keMenit(i.selesai));
  const berikut = daftarIstirahat.find((i) => menitSekarang < keMenit(i.mulai));

  let teks = "";
  let info = "";
  let nada = "tutup";

  if (libur) {
    teks = "Libur • Hari ini tutup";
    info = `Buka lagi hari Senin pukul ${formatJam(bukaMenit)}`;
    nada = "libur";
  } else if (menitSekarang < bukaMenit) {
    teks = "Tutup • Belum buka";
    info = `Kantin buka pukul ${formatJam(bukaMenit)}`;
    nada = "tutup";
  } else if (menitSekarang >= tutupMenit) {
    teks = "Tutup • Sudah tutup";
    info = `Buka lagi besok pukul ${formatJam(bukaMenit)}`;
    nada = "tutup";
  } else if (aktif) {
    teks = `Buka • ${aktif.nama}`;
    const sisa = sisaMenit(keMenit(aktif.selesai), menitSekarang);
    info = `Lagi jam istirahat! Tutup lagi pukul ${aktif.selesai} • ${sisa} menit lagi`;
    nada = "buka";
  } else {
    teks = "Tutup • Jam Pelajaran";
    if (berikut) {
      const sisa = sisaMenit(keMenit(berikut.mulai), menitSekarang);
      info = `Istirahat berikutnya ${berikut.nama.toLowerCase()} pukul ${berikut.mulai} • ${sisa} menit lagi`;
    } else {
      info = `Istirahat hari ini selesai • buka lagi besok pukul ${formatJam(bukaMenit)}`;
    }
    nada = "tutup";
  }

  $$("#status-dot, #status-nav-dot, [data-dot]").forEach((dot) => {
    dot.classList.remove("bg-green-400", "bg-amber-400", "bg-red-400");
    dot.classList.add(nada === "buka" ? "bg-green-400" : nada === "libur" ? "bg-red-400" : "bg-amber-400");
  });

  $$("#status-teks, #status-nav-teks, [data-statusteks]").forEach((el) => {
    el.textContent = teks;
  });

  const infoEl = $("#status-info");
  if (infoEl) infoEl.textContent = info;

  const jamEl = $("#status-jam");
  if (jamEl) jamEl.textContent = formatJam(menitSekarang);

  const status = $("#status");
  if (status) status.setAttribute("title", `${teks} — ${info}`);

  const nowMs = now.getTime();
  statusTargetMs = 0;
  statusStartMs = 0;
  statusLabel = "";
  if (libur) {
    statusTargetMs = bukaBerikutnya(now, bukaMenit);
    statusStartMs = nowMs - 6 * 3600000;
    statusLabel = "menuju buka lagi";
  } else if (menitSekarang < bukaMenit) {
    statusTargetMs = waktuDiHari(now, bukaMenit);
    statusStartMs = waktuDiHari(now, 0);
    statusLabel = "menuju kantin buka";
  } else if (menitSekarang >= tutupMenit) {
    statusTargetMs = bukaBerikutnya(now, bukaMenit);
    statusStartMs = waktuDiHari(now, tutupMenit);
    statusLabel = "menuju buka besok";
  } else if (aktif) {
    statusTargetMs = waktuDiHari(now, keMenit(aktif.selesai));
    statusStartMs = waktuDiHari(now, keMenit(aktif.mulai));
    statusLabel = `sisa ${aktif.nama.toLowerCase()}`;
  } else if (berikut) {
    statusTargetMs = waktuDiHari(now, keMenit(berikut.mulai));
    const idx = daftarIstirahat.findIndex((i) => i.nama === berikut.nama);
    const sebelum = idx > 0 ? daftarIstirahat[idx - 1] : null;
    statusStartMs = sebelum ? waktuDiHari(now, keMenit(sebelum.selesai)) : waktuDiHari(now, bukaMenit);
    statusLabel = `menuju ${berikut.nama.toLowerCase()}`;
  } else {
    statusTargetMs = waktuDiHari(now, tutupMenit);
    const terakhir = daftarIstirahat[daftarIstirahat.length - 1];
    statusStartMs = terakhir ? waktuDiHari(now, keMenit(terakhir.selesai)) : waktuDiHari(now, bukaMenit);
    statusLabel = "menuju kantin tutup";
  }

  const labelEl = $("#status-next");
  if (labelEl) labelEl.textContent = statusLabel;

  const bar = $("#status-progress");
  if (bar) {
    const total = statusTargetMs - statusStartMs;
    const persen = total > 0 ? Math.min(100, Math.max(0, ((nowMs - statusStartMs) / total) * 100)) : 0;
    bar.style.width = persen.toFixed(1) + "%";
    bar.classList.remove("bg-hijau", "bg-aksen", "bg-merah");
    bar.classList.add(nada === "buka" ? "bg-hijau" : nada === "libur" ? "bg-merah" : "bg-aksen");
  }

  renderStatusIstirahat(aktif, menitSekarang);
  tickCountdown();
}
cekStatus();
setInterval(cekStatus, 30000);
setInterval(tickCountdown, 1000);

// ===== EFEK KETIK KATA SLOGAN =====
function mulaiSlogan() {
  const el = $("#slogan");
  if (!el) return;
  const kata = ["murah", "enak", "ngebut", "higienis", "kekinian"];
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.textContent = "murah • enak • ngebut";
    return;
  }
  let i = 0;
  let huruf = 0;
  let hapus = false;
  function tick() {
    const kini = kata[i];
    el.textContent = kini.slice(0, huruf);
    if (!hapus) {
      if (huruf < kini.length) {
        huruf++;
        setTimeout(tick, 85);
      } else {
        hapus = true;
        setTimeout(tick, 1600);
      }
    } else if (huruf > 0) {
      huruf--;
      setTimeout(tick, 45);
    } else {
      hapus = false;
      i = (i + 1) % kata.length;
      setTimeout(tick, 250);
    }
  }
  tick();
}

// ===== ANGKA NAIK + ANIMASI MUNCUL =====
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

if (typeof IntersectionObserver !== "undefined") {
  const io = new IntersectionObserver(
    (ents) => {
      ents.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("muncul");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  $$(".reveal").forEach((el) => io.observe(el));
}

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
    .map(
      (j) =>
        `<tr class="border-b-2 border-dashed border-lembut last:border-0"><td class="py-2 font-semibold">${escapeHtml(j.hari)}</td><td class="py-2 text-right font-extrabold">${escapeHtml(j.jam)}</td></tr>`
    )
    .join("");
}

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
  timerUlasan = setInterval(() => tampilUlasan(idxUlasan + 1), 5200);
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
        <div class="flex items-start gap-3">
          <span aria-hidden="true" class="hidden font-display text-6xl leading-none text-aksen sm:block">“</span>
          <div class="flex-1">
            <p class="font-display text-lg font-bold leading-snug sm:text-2xl">“${escapeHtml(t.teks)}”</p>
            <div class="mt-4 flex items-center justify-center gap-3 sm:justify-start">
              <span class="avatar ${i % 3 === 0 ? "!bg-ungu" : i % 3 === 1 ? "!bg-hijau" : "!bg-pink"}">${escapeHtml(inisial(t.nama))}</span>
              <div class="text-left">
                <p class="text-sm font-extrabold">${escapeHtml(t.nama)}</p>
                <p class="text-sm tracking-widest text-aksen">${barBintang(t.rating)}</p>
              </div>
              ${t.baru ? '<span class="badge badge-viral">Baru</span>' : ""}
            </div>
          </div>
        </div>
      </div>`
    )
    .join("");

  if (titik) {
    titik.innerHTML = list
      .map((_, i) => `<span class="h-2.5 w-2.5 cursor-pointer rounded-full border border-garis bg-kartu transition" data-titik="${i}"></span>`)
      .join("");
  }

  const totalRating = list.reduce((s, x) => s + x.rating, 0);
  const rata = list.length ? (totalRating / list.length).toFixed(1) : "0";
  const elRating = $("#ringkas-rating");
  const elJumlah = $("#ringkas-jumlah");
  const elBintang = $("#ringkas-bintang");
  if (elRating) elRating.textContent = rata;
  if (elJumlah) elJumlah.textContent = list.length;
  if (elBintang) elBintang.textContent = barBintang(parseFloat(rata));

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
          (t) => `<article class="rounded-2xl border-2 border-garis bg-latar2 p-4">
            <div class="flex items-center gap-2.5">
              <span class="avatar !h-9 !w-9 !text-xs !bg-hijau">${escapeHtml(inisial(t.nama))}</span>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-extrabold">${escapeHtml(t.nama)}</p>
                <p class="text-xs tracking-widest text-aksen">${barBintang(t.rating)}</p>
              </div>
              ${t.baru ? '<span class="badge badge-viral">Baru</span>' : ""}
            </div>
            <p class="mt-3 text-sm font-medium leading-relaxed">“${escapeHtml(t.teks)}”</p>
            ${t.tanggal ? `<p class="mt-2 text-[10px] font-bold text-redup">🗓️ ${escapeHtml(t.tanggal)}</p>` : ""}
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
  const s = e.target.closest("[data-titik]");
  if (!s) return;
  tampilUlasan(parseInt(s.dataset.titik, 10));
});
$("#ulasan")?.addEventListener("mouseenter", stopUlasan);
$("#ulasan")?.addEventListener("mouseleave", mulaiUlasan);
document.addEventListener("visibilitychange", () => (document.hidden ? stopUlasan() : mulaiUlasan()));

// ===== VOUCHER =====
function renderVoucher() {
  const wrap = $("#daftar-voucher");
  if (!wrap) return;
  wrap.innerHTML = VOUCHER.map((v) => {
    const nilai = v.tipe === "persen" ? `${v.nilai}%` : rupiah(v.nilai);
    return `<button type="button" class="tiket" data-copy="${escapeHtml(v.kode)}" title="Salin kode ${escapeHtml(v.kode)}">
      <span class="flex flex-col justify-center border-r-2 border-dashed border-garis bg-kuning px-3 py-3 text-left text-[#17130f]">
        <span class="font-display text-xl font-extrabold leading-none">${nilai}</span>
        <span class="mt-1 text-[9px] font-extrabold uppercase tracking-wider">diskon</span>
      </span>
      <span class="flex flex-col justify-center px-3 py-3 text-left">
        <span class="font-display text-sm font-extrabold tracking-wide">${escapeHtml(v.kode)}</span>
        <span class="mt-0.5 max-w-[13rem] text-[10px] font-semibold leading-tight text-redup">${escapeHtml(v.ket)}</span>
        <span class="mt-1 text-[9px] font-extrabold uppercase tracking-wider text-utama">Klik salin →</span>
      </span>
    </button>`;
  }).join("");
}
$("#daftar-voucher")?.addEventListener("click", (e) => {
  const b = e.target.closest("[data-copy]");
  if (!b) return;
  const kode = b.dataset.copy;
  const input = $("#input-voucher");
  if (input) input.value = kode;
  try {
    navigator.clipboard?.writeText(kode);
  } catch (err) {
    /* clipboard tidak tersedia */
  }
  toast(`Kode ${kode} disalin 🎟️`);
});

// ===== MENU =====
const FILTER_MENU = [
  { id: "semua", label: "Semua", emoji: "✨" },
  { id: "berat", label: "Makanan Berat", emoji: "🍛", kategori: ["Nasi", "Mi", "Ayam & Lauk"] },
  { id: "snack", label: "Jajanan/Snack", emoji: "🍿", kategori: ["Gorengan", "Camilan"] },
  { id: "minuman", label: "Minuman", emoji: "🥤", kategori: ["Minuman", "Minuman Hangat"] },
  { id: "hemat", label: "Ramah Kantong", emoji: "💰", maks: 7000 },
];
let filterAktif = "semua";
let pageMenu = 1;
let urutanMenu = "rekomendasi";

const URUTAN_MENU = {
  rekomendasi: null,
  laris: (a, b) => (b.terjual || 0) - (a.terjual || 0),
  murah: (a, b) => a.harga - b.harga,
  mahal: (a, b) => b.harga - a.harga,
  rating: (a, b) => (b.rating || 0) - (a.rating || 0),
};

function cocokFilter(p) {
  const f = FILTER_MENU.find((x) => x.id === filterAktif) || FILTER_MENU[0];
  if (f.kategori) return f.kategori.includes(p.kategori);
  if (f.maks) return p.harga <= f.maks;
  return true;
}

function jumlahFilter(f) {
  if (f.kategori) return PRODUK.filter((p) => f.kategori.includes(p.kategori)).length;
  if (f.maks) return PRODUK.filter((p) => p.harga <= f.maks).length;
  return PRODUK.length;
}

function badgeProduk(p) {
  const khusus = typeof BADGE_MENU !== "undefined" ? BADGE_MENU[p.id] : null;
  if (khusus) return khusus;
  if (p.kategori === "Minuman") return { teks: "🥤 Segar & Dingin", warna: "segar" };
  if (p.kategori === "Minuman Hangat") return { teks: "☕ Hangat", warna: "hangat" };
  if (p.kategori === "Gorengan" || p.kategori === "Camilan") return { teks: "🍿 Camilan Wajib", warna: "favorit" };
  if ((p.terjual || 0) >= 400) return { teks: "⭐ Favorit Kakak Kelas", warna: "favorit" };
  if ((p.rating || 0) >= 4.9) return { teks: "🔥 Lagi Viral", warna: "viral" };
  if (p.harga <= 6000) return { teks: "💰 Ramah Kantong", warna: "hemat" };
  return { teks: "🍽️ Porsi Mantap", warna: "favorit" };
}

function renderKat() {
  const wrap = $("#kategori");
  if (!wrap) return;
  wrap.innerHTML = FILTER_MENU.map(
    (f) =>
      `<button type="button" class="chip-filter" data-kat="${f.id}" aria-pressed="${f.id === filterAktif}"><span aria-hidden="true">${f.emoji}</span>${f.label}<span class="chip-count">${jumlahFilter(f)}</span></button>`
  ).join("");
}

function fotoProduk(p, lebar = 700, tinggi = 520) {
  if (p.foto && p.foto.trim() !== "") return p.foto;
  return `https://placehold.co/${lebar}x${tinggi}/ffefd8/17130f?text=${encodeURIComponent(`${p.emoji || "🍽️"} ${p.nama}`)}`;
}

function renderTrending() {
  const wrap = $("#trending-menu");
  if (!wrap) return;
  const list = [...PRODUK].sort((a, b) => (b.terjual || 0) - (a.terjual || 0)).slice(0, 6);
  wrap.innerHTML = list
    .map((p, i) => {
      const b = badgeProduk(p);
      const rating = (p.rating || 4.8).toFixed(1);
      return `<article class="rail-card kartu-masuk" style="--i:${i}">
        <div class="relative overflow-hidden rounded-[20px] border-2 border-garis bg-latar2">
          <div class="aspect-[16/10] overflow-hidden">
            <img src="${fotoProduk(p, 520, 340)}" alt="${escapeHtml(p.nama)}" class="foto-menu" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/520x340/ffefd8/17130f?text=Menu+Kantin'">
          </div>
          <span class="absolute left-2 top-2 grid h-7 w-7 place-items-center rounded-full border-2 border-garis bg-tombol font-display text-[11px] font-extrabold text-tombol-teks shadow-brut-sm">#${i + 1}</span>
          <span class="badge badge-${b.warna} absolute right-2 top-2 !px-2 !py-1 !text-[8px]">${b.teks}</span>
          <span class="rating-pill absolute bottom-2 left-2 !py-1">★ ${rating}</span>
        </div>
        <div class="mt-2.5 flex items-start justify-between gap-2">
          <div class="min-w-0 flex-1">
            <h3 class="truncate font-display text-sm font-extrabold leading-tight">${escapeHtml(p.nama)}</h3>
            <p class="mt-0.5 text-[10px] font-bold text-redup">🔥 ${p.terjual}+ terjual</p>
            <p class="mt-1 font-display text-lg font-extrabold leading-none">${rupiah(p.harga)}</p>
          </div>
          <button type="button" class="btn-tambah relative !h-10 !px-3 !text-xs" data-tambah="${p.id}" aria-label="Tambah ${escapeHtml(p.nama)} ke keranjang">
            <span data-icon class="text-sm leading-none">+</span>
            <span data-label>Tambah</span>
            <span data-qty class="absolute -right-2 -top-2 hidden h-5 min-w-5 place-items-center rounded-full border-2 border-garis bg-kuning px-1 text-[10px] font-extrabold leading-none text-[#17130f]">0</span>
          </button>
        </div>
      </article>`;
    })
    .join("");
  syncKartu();
}

$$("[data-rail]").forEach((b) => {
  b.addEventListener("click", () => {
    const rail = $("#trending-menu");
    if (!rail || typeof rail.scrollBy !== "function") return;
    const jarak = Math.max(260, rail.clientWidth * 0.75);
    rail.scrollBy({ left: (b.dataset.rail === "kanan" ? 1 : -1) * jarak, behavior: "smooth" });
  });
});

function renderMenu() {
  const cari = ($("#cari")?.value || "").trim().toLowerCase();
  const hasil = PRODUK.filter(
    (p) =>
      cocokFilter(p) &&
      (!cari || p.nama.toLowerCase().includes(cari) || p.deskripsi.toLowerCase().includes(cari) || p.kategori.toLowerCase().includes(cari))
  );
  if (URUTAN_MENU[urutanMenu]) hasil.sort(URUTAN_MENU[urutanMenu]);
  const wrap = $("#daftar-menu");
  const kosong = $("#kosong");
  const per = perHalaman(PAGE_MENU);
  const jumlahHal = Math.max(1, Math.ceil(hasil.length / per));
  if (pageMenu > jumlahHal) pageMenu = jumlahHal;
  const mulai = (pageMenu - 1) * per;
  const potong = hasil.slice(mulai, mulai + per);

  if (wrap) {
    wrap.innerHTML = potong
      .map((p, i) => {
        const b = badgeProduk(p);
        const rating = (p.rating || 4.8).toFixed(1);
        return `<article class="kartu-menu kartu-masuk" style="--i:${i}">
          <div class="relative m-2.5 overflow-hidden rounded-[20px] border-2 border-garis bg-latar2">
            <div class="aspect-[4/3] overflow-hidden">
              <img src="${fotoProduk(p)}" alt="${escapeHtml(p.nama)}" class="foto-menu" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/700x520/ffefd8/17130f?text=Menu+Kantin'">
            </div>
            <div class="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-2">
              <span class="badge badge-${b.warna}">${b.teks}</span>
              <span class="rating-pill">★ ${rating}</span>
            </div>
            <div class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/50 to-transparent p-2.5 pt-8">
              <span class="terjual-pill !bg-kartu/95">🔥 ${p.terjual}+ terjual</span>
              <span class="rounded-full border-2 border-garis bg-kuning px-2 py-1 text-[9px] font-extrabold leading-none text-[#17130f] shadow-brut-sm">${escapeHtml(p.kategori)}</span>
            </div>
          </div>
          <div class="flex flex-1 flex-col px-4 pb-4 pt-0.5">
            <h3 class="font-display text-lg font-extrabold leading-tight tracking-tight">${escapeHtml(p.nama)}</h3>
            <p class="mt-1 line-clamp-2 text-xs font-medium leading-relaxed text-redup sm:text-[13px]">${escapeHtml(p.deskripsi)}</p>
            <div class="mt-auto flex items-end justify-between gap-2 pt-4">
              <div class="min-w-0">
                <span class="block text-[9px] font-extrabold uppercase tracking-wider text-redup">Harga</span>
                <span class="font-display text-[22px] font-extrabold leading-none tracking-tight text-teks sm:text-2xl">${rupiah(p.harga)}</span>
              </div>
              <div class="flex shrink-0 items-center gap-1.5">
                <div class="stepper" data-stepper="${p.id}">
                  <button type="button" class="stepper-btn" data-kartu="kur" data-id="${p.id}" aria-label="Kurangi ${escapeHtml(p.nama)}">−</button>
                  <span class="stepper-qty" data-step-qty>0</span>
                  <button type="button" class="stepper-btn !bg-kuning" data-kartu="tbh" data-id="${p.id}" aria-label="Tambah ${escapeHtml(p.nama)}">+</button>
                </div>
                <button type="button" class="btn-tambah relative" data-tambah="${p.id}" aria-label="Tambah ${escapeHtml(p.nama)} ke keranjang">
                  <span data-icon class="text-base leading-none">+</span>
                  <span data-label>Tambah</span>
                </button>
              </div>
            </div>
          </div>
        </article>`;
      })
      .join("");
  }
  kosong?.classList.toggle("hidden", hasil.length > 0);

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
      : "Menu tidak ditemukan. Coba kata kunci lain 🙂";
  }
  syncKartu();
}

function toggleBersihCari() {
  const b = $("[data-bersih-cari]");
  if (!b) return;
  const ada = !!($("#cari")?.value || "").trim();
  b.classList.toggle("hidden", !ada);
  b.classList.toggle("grid", ada);
}

$("#kategori")?.addEventListener("click", (e) => {
  const b = e.target.closest("[data-kat]");
  if (!b) return;
  filterAktif = b.dataset.kat;
  pageMenu = 1;
  renderKat();
  renderMenu();
});
$("#cari")?.addEventListener("input", () => {
  pageMenu = 1;
  toggleBersihCari();
  renderMenu();
});
$("#urutkan")?.addEventListener("change", (e) => {
  urutanMenu = e.target.value;
  pageMenu = 1;
  renderMenu();
  toast(`Urutan: ${e.target.options[e.target.selectedIndex].text}`, { durasi: 1800 });
});
$("#daftar-menu")?.addEventListener("click", (e) => {
  const b = e.target.closest("[data-tambah]");
  if (!b) return;
  const p = PRODUK.find((x) => x.id === b.dataset.tambah);
  if (p) tambahKeranjang(p, b);
});
document.addEventListener("click", (e) => {
  if (e.target.closest("[data-bersih-cari]")) {
    const input = $("#cari");
    if (input) input.value = "";
    toggleBersihCari();
    pageMenu = 1;
    renderMenu();
    input?.focus();
  }
  if (e.target.closest("[data-reset-filter]")) {
    filterAktif = "semua";
    urutanMenu = "rekomendasi";
    const urut = $("#urutkan");
    if (urut) urut.value = "rekomendasi";
    const input = $("#cari");
    if (input) input.value = "";
    toggleBersihCari();
    pageMenu = 1;
    renderKat();
    renderMenu();
  }
});

// ===== KERANJANG =====
let keranjang = muat("kantin_keranjang", []);
if (!Array.isArray(keranjang)) keranjang = [];
keranjang = keranjang
  .filter((x) => x && typeof x.id === "string" && PRODUK.some((p) => p.id === x.id))
  .map((x) => ({ id: x.id, qty: Math.max(1, parseInt(x.qty, 10) || 1) }));

let voucherDipakai = null;
let jumlahTerakhir = 0;

function produkDari(id) {
  return PRODUK.find((p) => p.id === id);
}
function subtotalKeranjang() {
  return keranjang.reduce((s, x) => {
    const p = produkDari(x.id);
    return s + (p ? p.harga * x.qty : 0);
  }, 0);
}
function jumlahItem() {
  return keranjang.reduce((s, x) => s + x.qty, 0);
}

function renderBadge() {
  const jum = jumlahItem();
  $$("[data-badge], #badge").forEach((b) => {
    b.textContent = jum;
    b.classList.toggle("hidden", jum === 0);
    b.classList.toggle("grid", jum > 0);
    if (jum !== jumlahTerakhir) {
      b.classList.remove("badge-pop");
      void b.offsetWidth;
      b.classList.add("badge-pop");
    }
  });
  jumlahTerakhir = jum;

  const bar = $("#bar-keranjang");
  if (bar) bar.style.display = jum > 0 ? "flex" : "none";
  const barJumlah = $("#bar-jumlah");
  if (barJumlah) barJumlah.textContent = jum;
}

function syncKartu() {
  $$("[data-stepper]").forEach((s) => {
    const item = keranjang.find((x) => x.id === s.dataset.stepper);
    s.classList.toggle("tampil", !!item);
    const q = s.querySelector("[data-step-qty]");
    if (q) q.textContent = item ? item.qty : "0";
    const add = s.parentElement ? s.parentElement.querySelector("[data-tambah]") : null;
    if (add) add.classList.toggle("tersembunyi", !!item);
  });
  $$("[data-tambah]").forEach((b) => {
    const item = keranjang.find((x) => x.id === b.dataset.tambah);
    const qty = b.querySelector("[data-qty]");
    if (!qty) return;
    qty.textContent = item ? item.qty : "0";
    qty.classList.toggle("hidden", !item);
    qty.classList.toggle("grid", !!item);
  });
}

document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-kartu]");
  if (!b) return;
  const id = b.dataset.id;
  const p = produkDari(id);
  if (!p) return;
  const idx = keranjang.findIndex((x) => x.id === id);
  if (b.dataset.kartu === "tbh") {
    if (idx >= 0) keranjang[idx].qty++;
    else keranjang.push({ id, qty: 1 });
  } else if (b.dataset.kartu === "kur") {
    if (idx < 0) return;
    keranjang[idx].qty--;
    if (keranjang[idx].qty <= 0) keranjang.splice(idx, 1);
  } else {
    return;
  }
  simpan("kantin_keranjang", keranjang);
  renderKeranjang();
  if (b.dataset.kartu === "tbh") {
    const q = b.parentElement ? b.parentElement.querySelector("[data-step-qty]") : null;
    if (q) {
      q.classList.remove("badge-pop");
      void q.offsetWidth;
      q.classList.add("badge-pop");
    }
    try {
      navigator.vibrate?.(8);
    } catch (err) {
      /* perangkat tidak mendukung getar */
    }
  }
});

function animasiTombol(b) {
  if (!b) return;
  const icon = b.querySelector("[data-icon]");
  const label = b.querySelector("[data-label]");
  b.classList.add("ditambah");
  if (icon) icon.textContent = "✓";
  if (label) label.textContent = "Mantap!";
  clearTimeout(b._timer);
  b._timer = setTimeout(() => {
    b.classList.remove("ditambah");
    if (icon) icon.textContent = "+";
    if (label) label.textContent = "Tambah";
  }, 1100);
}

function popQty(id) {
  const s = $$("[data-stepper]").find((x) => x.dataset.stepper === id);
  const q = s ? s.querySelector("[data-step-qty]") : null;
  if (!q) return;
  q.classList.remove("badge-pop");
  void q.offsetWidth;
  q.classList.add("badge-pop");
}

function targetKeranjang() {
  const kandidat =
    window.innerWidth < 640
      ? $$("[data-buka-keranjang]").filter((el) => el.getBoundingClientRect().width > 0)
      : [$("#btn-keranjang")];
  return kandidat.find((el) => el && el.getBoundingClientRect().width > 0) || null;
}

function terbangkanKeKeranjang(asal, p) {
  if (!asal || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const target = targetKeranjang();
  if (!target) return;
  const tujuan = target.getBoundingClientRect();
  if (!tujuan.width) return;

  const img = document.createElement("img");
  img.src = fotoProduk(p, 120, 120);
  img.alt = "";
  img.className = "fly-item";
  const startX = asal.left + asal.width / 2;
  const startY = asal.top + asal.height / 2;
  img.style.left = `${startX - 24}px`;
  img.style.top = `${startY - 24}px`;
  document.body.appendChild(img);

  const dx = tujuan.left + tujuan.width / 2 - startX;
  const dy = tujuan.top + tujuan.height / 2 - startY;
  const animasi = img.animate(
    [
      { transform: "translate(0, 0) scale(1)", opacity: 1 },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 36}px) scale(0.9)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.2)`, opacity: 0.15 },
    ],
    { duration: 650, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }
  );
  const bersih = () => img.remove();
  if (animasi) animasi.onfinish = bersih;
  setTimeout(bersih, 900);
}

function tambahKeranjang(p, tombol) {
  const asal = tombol ? tombol.getBoundingClientRect() : null;
  const ada = keranjang.find((x) => x.id === p.id);
  if (ada) ada.qty++;
  else keranjang.push({ id: p.id, qty: 1 });
  simpan("kantin_keranjang", keranjang);
  renderKeranjang();
  animasiTombol(tombol);
  popQty(p.id);
  terbangkanKeKeranjang(asal, p);
  try {
    navigator.vibrate?.(12);
  } catch (err) {
    /* perangkat tidak mendukung getar */
  }
  toast(`${p.nama} masuk keranjang 🛒`, { label: "Lihat", aksi: () => bukaDrawer(true) });
}

function renderKeranjang() {
  const wrap = $("#daftar-keranjang");
  if (wrap) {
    const saran = [...PRODUK].sort((a, b) => (b.terjual || 0) - (a.terjual || 0)).slice(0, 3);
    wrap.innerHTML = keranjang.length
      ? keranjang
          .map((x, i) => {
            const p = produkDari(x.id);
            if (!p) return "";
            return `<article class="flex gap-2.5 rounded-2xl border-2 border-garis bg-kartu p-2.5 shadow-brut-sm">
              <img src="${fotoProduk(p, 200, 200)}" alt="${escapeHtml(p.nama)}" class="h-16 w-16 shrink-0 rounded-xl border-2 border-garis object-cover" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/200x200/ffefd8/17130f?text=Menu'">
              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-2">
                  <p class="text-sm font-extrabold leading-tight">${escapeHtml(p.nama)}</p>
                  <button type="button" data-aksi="hapus" data-i="${i}" class="text-sm leading-none text-redup transition hover:text-red-500" aria-label="Hapus ${escapeHtml(p.nama)} dari keranjang">🗑️</button>
                </div>
                <p class="mt-0.5 text-[11px] font-semibold text-redup">${rupiah(p.harga)} / porsi</p>
                <div class="mt-2 flex items-center justify-between gap-2">
                  <div class="flex items-center gap-1 rounded-full border-2 border-garis bg-latar2 px-1 py-0.5">
                    <button type="button" class="qty-btn !h-6 !w-6 !border-0 !text-sm" data-aksi="kur" data-i="${i}" aria-label="Kurangi ${escapeHtml(p.nama)}">−</button>
                    <span class="min-w-5 text-center text-xs font-extrabold">${x.qty}</span>
                    <button type="button" class="qty-btn !h-6 !w-6 !border-0 !text-sm" data-aksi="tbh" data-i="${i}" aria-label="Tambah ${escapeHtml(p.nama)}">+</button>
                  </div>
                  <p class="font-display text-sm font-extrabold">${rupiah(p.harga * x.qty)}</p>
                </div>
              </div>
            </article>`;
          })
          .join("")
      : `<div class="rounded-2xl border-2 border-dashed border-garis bg-latar2 px-4 py-7 text-center">
          <div class="mx-auto grid h-16 w-16 place-items-center rounded-full border-2 border-garis bg-kuning text-3xl">🍱</div>
          <p class="mt-3 font-display text-lg font-extrabold">Keranjang masih kosong</p>
          <p class="mt-1 text-sm text-redup">Pilih menu dulu, nanti tinggal ambil di kantin.</p>
          <button type="button" data-cari-menu class="btn btn-utama mt-4 !py-2.5">Cari jajanan 🍟</button>
          <p class="mt-5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-redup">Atau langsung tap yang lagi rame</p>
          <div class="mt-2 flex flex-wrap justify-center gap-1.5">
            ${saran
              .map(
                (p) =>
                  `<button type="button" class="chip-filter !px-2.5 !py-1.5 !text-[10px]" data-tambah-cepat="${p.id}">+ ${escapeHtml(p.nama)}</button>`
              )
              .join("")}
          </div>
        </div>`;
  }
  $("#btn-kosongkan")?.classList.toggle("hidden", keranjang.length === 0);
  hitungTotal();
  renderBadge();
  syncKartu();
}

$("#daftar-keranjang")?.addEventListener("click", (e) => {
  const cepat = e.target.closest("[data-tambah-cepat]");
  if (cepat) {
    const p = produkDari(cepat.dataset.tambahCepat);
    if (p) tambahKeranjang(p, null);
    return;
  }
  const b = e.target.closest("[data-aksi]");
  if (!b) return;
  const idx = parseInt(b.dataset.i, 10);
  if (isNaN(idx) || !keranjang[idx]) return;
  if (b.dataset.aksi === "tbh") {
    keranjang[idx].qty++;
  } else if (b.dataset.aksi === "kur") {
    keranjang[idx].qty--;
    if (keranjang[idx].qty <= 0) keranjang.splice(idx, 1);
  } else if (b.dataset.aksi === "hapus") {
    keranjang.splice(idx, 1);
  } else {
    return;
  }
  simpan("kantin_keranjang", keranjang);
  renderKeranjang();
});

$("#btn-kosongkan")?.addEventListener("click", () => {
  keranjang = [];
  voucherDipakai = null;
  const input = $("#input-voucher");
  if (input) input.value = "";
  const info = $("#info-voucher");
  if (info) info.textContent = "";
  simpan("kantin_keranjang", keranjang);
  renderKeranjang();
  toast("Keranjang dikosongkan 🧹");
});

// ===== HITUNG TOTAL & VOUCHER =====
function hitungDiskon(subtotal) {
  if (!voucherDipakai) return 0;
  if (subtotal < (voucherDipakai.min || 0)) return 0;
  let diskon = 0;
  if (voucherDipakai.tipe === "persen") {
    diskon = Math.floor((subtotal * voucherDipakai.nilai) / 100);
    if (voucherDipakai.maks > 0) diskon = Math.min(diskon, voucherDipakai.maks);
  } else if (voucherDipakai.tipe === "nominal") {
    diskon = voucherDipakai.nilai;
  }
  return Math.min(diskon, subtotal);
}

function hitungTotal() {
  const subtotal = subtotalKeranjang();
  const elSubtotal = $("#subtotal");
  if (elSubtotal) elSubtotal.textContent = rupiah(subtotal);

  let diskon = 0;
  if (voucherDipakai && subtotal < (voucherDipakai.min || 0)) {
    voucherDipakai = null;
    const info = $("#info-voucher");
    if (info) info.textContent = "Min. belanja belum terpenuhi untuk voucher ini.";
  }
  if (voucherDipakai) diskon = hitungDiskon(subtotal);

  const baris = $("#baris-diskon");
  if (baris) {
    baris.classList.toggle("hidden", diskon <= 0);
    baris.classList.toggle("flex", diskon > 0);
  }
  if (diskon > 0 && voucherDipakai) {
    const kode = $("#kode-terpakai");
    const elDiskon = $("#diskon");
    if (kode) kode.textContent = voucherDipakai.kode;
    if (elDiskon) elDiskon.textContent = "−" + rupiah(diskon);
  }

  const total = Math.max(0, subtotal - diskon);
  const elTotal = $("#total");
  if (elTotal) elTotal.textContent = rupiah(total);
  const barTotal = $("#bar-total");
  if (barTotal) barTotal.textContent = rupiah(total);

  const est = $("#estimasi");
  if (est) {
    const jum = jumlahItem();
    if (!jum) est.textContent = "—";
    else est.textContent = `± ${3 + Math.ceil(jum / 2) * 2} menit`;
  }
}

$("#btn-voucher")?.addEventListener("click", () => {
  const input = $("#input-voucher");
  const info = $("#info-voucher");
  const kode = (input?.value || "").trim().toUpperCase();
  if (!kode) return toast("Masukkan kode voucher dulu");
  const v = VOUCHER.find((x) => x.kode === kode);
  if (!v) {
    voucherDipakai = null;
    if (info) info.textContent = "Kode voucher tidak ditemukan.";
    hitungTotal();
    return toast("Kode voucher tidak ditemukan 😅");
  }
  voucherDipakai = v;
  if (info) info.textContent = v.ket;
  hitungTotal();
  toast(`Voucher ${v.kode} dipasang 🎉`);
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
  document.body.style.overflow = on ? "hidden" : "";
  if (on) $("#tutup-drawer")?.focus();
}
$("#btn-keranjang")?.addEventListener("click", () => bukaDrawer(true));
$("#tutup-drawer")?.addEventListener("click", () => bukaDrawer(false));
$("#overlay")?.addEventListener("click", () => bukaDrawer(false));

function setTipePesan(nilai) {
  $$("#tipe-pesan [data-tipe]").forEach((b) => b.classList.toggle("aktif", b.dataset.tipe === nilai));
  const input = $('#form-pesan input[name="tipe"]');
  if (input) input.value = nilai;
  const kelas = $('#form-pesan input[name="kelas"]');
  if (kelas) {
    kelas.placeholder = nilai === "Antar ke kelas" ? "Kelas / ruang (contoh: XI IPA 2)" : "Kelas (opsional, biar gampang dicari)";
  }
}
$("#tipe-pesan")?.addEventListener("click", (e) => {
  const b = e.target.closest("[data-tipe]");
  if (!b) return;
  setTipePesan(b.dataset.tipe);
});

// semua tombol dengan data-buka-keranjang (navbar, hero, bar mobile)
document.addEventListener("click", (e) => {
  if (e.target.closest("[data-buka-keranjang]")) {
    e.preventDefault();
    bukaDrawer(true);
  }
  if (e.target.closest("[data-cari-menu]")) {
    bukaDrawer(false);
    $("#menu")?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => $("#cari")?.focus(), 350);
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    bukaDrawer(false);
    tutupLightbox();
    tutupModalUlasan();
    $("#panel-menu")?.classList.add("hidden");
    $("#btn-menu")?.setAttribute("aria-expanded", "false");
  }
});

// ===== CHECKOUT KE WHATSAPP =====
$("#form-pesan")?.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!keranjang.length) return toast("Keranjang masih kosong");
  const f = e.target;
  if (!f.reportValidity()) return;
  const subtotal = subtotalKeranjang();
  const diskon = hitungDiskon(subtotal);
  const total = Math.max(0, subtotal - diskon);
  const daftar = keranjang
    .map((x) => {
      const p = produkDari(x.id);
      if (!p) return "";
      return `- ${p.nama} x${x.qty} = ${rupiah(p.harga * x.qty)}`;
    })
    .filter(Boolean)
    .join("\n");
  let vline = "";
  if (voucherDipakai && diskon > 0) vline = `Voucher: ${voucherDipakai.kode} (−${rupiah(diskon)})\n`;
  const el = f.elements;
  const catatan = el.catatan.value.trim() ? `\nCatatan: ${el.catatan.value.trim()}` : "";
  const kelas = el.kelas ? el.kelas.value.trim() : "";

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

  const pesan = `Halo ${USAHA.nama}, saya mau pesan:\n${daftar}\n\nSubtotal: ${rupiah(subtotal)}\n${vline}Total: ${rupiah(total)}\nNama: ${el.nama.value.trim()}\nTipe: ${el.tipe.value}${kelas ? `\nKelas: ${kelas}` : ""}${bline}${catatan}`;
  window.open(linkWA(pesan), "_blank", "noopener");

  keranjang = [];
  voucherDipakai = null;
  const inputVoucher = $("#input-voucher");
  if (inputVoucher) inputVoucher.value = "";
  const infoVoucher = $("#info-voucher");
  if (infoVoucher) infoVoucher.textContent = "";
  simpan("kantin_keranjang", keranjang);
  renderKeranjang();
  f.reset();
  setTipePesan("Ambil di tempat");
  bukaDrawer(false);
  toast("Pesanan dibuka di WhatsApp 🚀");
});

// ===== KONTAK =====
$("#form-kontak")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.target;
  const el = f.elements;
  const err = $("#error-kontak");
  const nama = el.nama.value.trim();
  const hp = el.hp.value.trim();
  const pesan = el.pesan.value.trim();
  function setErr(m) {
    if (err) err.textContent = m || "";
    return !m;
  }
  if (nama.length < 3) return setErr("Nama minimal 3 huruf.");
  if (!/^0\d{8,12}$/.test(hp)) return setErr("Nomor HP harus diawali 0 dan 9–13 digit.");
  if (pesan.length < 5) return setErr("Pesan minimal 5 karakter.");
  if (!setErr("")) return;
  const waMsg = `Halo ${USAHA.nama}, saya ${nama} (${hp}).\n${pesan}`;
  window.open(linkWA(waMsg), "_blank", "noopener");
  f.reset();
  toast("Pesanmu diarahkan ke WhatsApp 💬");
});

// ===== GALERI =====
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
      const idx = mulai + i;
      const img = g.foto && g.foto.trim() !== "" ? g.foto : `https://placehold.co/700x700/ffefd8/17130f?text=${encodeURIComponent(g.emoji || "📷")}`;
      return `<button type="button" class="gallery-item group" data-lightbox data-i="${idx}" aria-label="Lihat foto ${idx + 1}: ${escapeHtml(g.alt || "Foto galeri")}">
        <div class="relative aspect-square overflow-hidden rounded-[15px] bg-latar2">
          <img src="${img}" alt="${escapeHtml(g.alt || "Foto galeri")}" class="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/700x700/ffefd8/17130f?text=Galeri'">
          <span aria-hidden="true" class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"></span>
          <span class="absolute inset-x-0 bottom-0 p-2.5 text-left text-[11px] font-extrabold leading-tight text-white">${escapeHtml(g.alt || "Foto galeri")}</span>
          <span aria-hidden="true" class="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full border-2 border-garis bg-kuning text-xs font-extrabold text-[#17130f] opacity-0 transition group-hover:opacity-100">⤢</span>
        </div>
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
  const img = g.foto && g.foto.trim() !== "" ? g.foto : "https://placehold.co/1200x900/ffefd8/17130f?text=Foto";
  const imgEl = $("#lightbox-img");
  if (imgEl) {
    imgEl.src = img;
    imgEl.alt = g.alt || "Foto galeri";
  }
  const cap = $("#lightbox-caption");
  if (cap) cap.textContent = g.alt || "";
  $("#lightbox")?.classList.remove("hidden");
  $("#lightbox")?.classList.add("flex");
}
function tutupLightbox() {
  $("#lightbox")?.classList.add("hidden");
  $("#lightbox")?.classList.remove("flex");
}
$("#grid-galeri")?.addEventListener("click", (e) => {
  const b = e.target.closest("[data-lightbox]");
  if (!b) return;
  bukaLightbox(parseInt(b.dataset.i, 10));
});
$("#lightbox-tutup")?.addEventListener("click", tutupLightbox);
$("#lightbox")?.addEventListener("click", (e) => {
  if (e.target.id === "lightbox") tutupLightbox();
});
$("#lightbox-prev")?.addEventListener("click", (e) => {
  e.stopPropagation();
  bukaLightbox((lbIdx - 1 + GALERI.length) % GALERI.length);
});
$("#lightbox-next")?.addEventListener("click", (e) => {
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
  const warna = ["bg-kuning", "bg-hijau", "bg-ungu", "bg-pink"];
  if (wrap) {
    wrap.innerHTML = list.length
      ? list
          .map(
            (p, i) => `<article class="kartu-brut kartu-brut-hover flex flex-col bg-kartu p-4 sm:p-5">
        <div class="flex items-center gap-3">
          <span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl border-2 border-garis ${warna[i % warna.length]} text-xl">${escapeHtml(p.emoji || "💳")}</span>
          <h3 class="font-display text-base font-extrabold leading-tight">${escapeHtml(p.nama)}</h3>
        </div>
        <p class="mt-3 flex-1 text-sm leading-relaxed text-redup">${escapeHtml(p.ket || "")}</p>
        ${p.catatan ? `<p class="mt-3 rounded-xl border-2 border-dashed border-lembut bg-latar2 px-3 py-2 text-[11px] font-semibold leading-snug">💡 ${escapeHtml(p.catatan)}</p>` : ""}
      </article>`
          )
          .join("")
      : `<p class="col-span-full rounded-2xl border-2 border-dashed border-garis p-6 text-center text-sm text-redup">Belum ada metode pembayaran yang terdaftar.</p>`;
  }

  // info rekening bank (kalau ada)
  const rek = USAHA.rekening || [];
  const info = $("#info-rekening");
  if (info) {
    if (rek.length) {
      info.classList.remove("hidden");
      info.innerHTML = `<p class="font-display text-sm font-extrabold">🏦 Nomor rekening untuk transfer bank</p>
        <div class="mt-3 grid gap-2 sm:grid-cols-2">
          ${rek
            .map(
              (r) => `<div class="rounded-xl border-2 border-garis bg-latar2 px-3 py-2 text-sm">
            <strong>${escapeHtml(r.bank)}</strong> · <span class="font-mono font-bold">${escapeHtml(r.no)}</span>
            <span class="block text-[11px] font-semibold text-redup">a.n. ${escapeHtml(r.atas)}</span>
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
    b.setAttribute("aria-checked", String(v === n));
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

// ===== NAV, TEMA, SCROLL SPY & TOMBOL ATAS =====
$("#btn-menu")?.addEventListener("click", () => {
  const panel = $("#panel-menu");
  panel?.classList.toggle("hidden");
  $("#btn-menu")?.setAttribute("aria-expanded", String(!panel?.classList.contains("hidden")));
});
$$("header a[href^='#']").forEach((a) => {
  a.addEventListener("click", () => {
    $("#panel-menu")?.classList.add("hidden");
    $("#btn-menu")?.setAttribute("aria-expanded", "false");
  });
});

const temaKey = "kantin_tema";
function pasangTema(t) {
  document.documentElement.dataset.tema = t;
  const btn = $("#btn-tema");
  if (btn) btn.textContent = t === "gelap" ? "☀️" : "🌙";
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", t === "gelap" ? "#15110e" : "#ff6b2c");
}
pasangTema(muat(temaKey, "terang"));
$("#btn-tema")?.addEventListener("click", () => {
  const baru = document.documentElement.dataset.tema === "gelap" ? "terang" : "gelap";
  simpan(temaKey, baru);
  pasangTema(baru);
  toast(baru === "gelap" ? "Mode gelap aktif 🌙" : "Mode terang aktif ☀️");
});

const btnAtas = $("#btn-atas");
function aturTombolAtas() {
  if (!btnAtas) return;
  const show = window.scrollY > 500;
  btnAtas.classList.toggle("opacity-0", !show);
  btnAtas.classList.toggle("pointer-events-none", !show);
  btnAtas.classList.toggle("pointer-events-auto", show);
}
window.addEventListener("scroll", aturTombolAtas, { passive: true });
btnAtas?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// scroll spy: tandai menu navigasi yang sedang dibaca
if (typeof IntersectionObserver !== "undefined") {
  const navLinks = $$("header a[href^='#']").filter((a) => a.getAttribute("href").length > 1);
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const id = "#" + en.target.id;
        navLinks.forEach((a) => a.classList.toggle("aktif", a.getAttribute("href") === id));
      });
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
  );
  ["menu", "galeri", "ulasan", "pembayaran", "faq", "lokasi"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) spy.observe(el);
  });
}

// ===== INISIALISASI =====
isiData();
renderJadwal();
renderVoucher();
renderKat();
renderTrending();
renderMenu();
renderGaleri();
renderUlasan();
mulaiUlasan();
renderPembayaran();
renderKeranjang();
mulaiSlogan();
toggleBersihCari();
aturTombolAtas();

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
