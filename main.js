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

// ===== ULASAN =====
function renderUlasan() {
  const track = $("#track");
  const titik = $("#titik");
  if (!track) return;
  track.innerHTML = TESTIMONI.map(
    (t, i) => `<div class="slide hidden" data-i="${i}"><p class="text-lg italic">“${escapeHtml(t.teks)}”</p><p class="mt-3 font-bold">– ${escapeHtml(t.nama)} · ${"★".repeat(t.rating || 5)}${"☆".repeat(5 - (t.rating || 5))}</p></div>`
  ).join("");
  titik.innerHTML = TESTIMONI.map(() => `<span class="h-2 w-2 rounded-full bg-garis"></span>`).join("");
  const rata = (TESTIMONI.reduce((s, x) => s + (x.rating || 5), 0) / TESTIMONI.length).toFixed(1);
  $("#ringkas-rating").textContent = rata;
  $("#ringkas-jumlah").textContent = TESTIMONI.length;
  let idx = 0;
  function show(n) {
    idx = (n + TESTIMONI.length) % TESTIMONI.length;
    $$(".slide").forEach((s, i) => s.classList.toggle("hidden", i !== idx));
    $$("#titik span").forEach((s, i) => s.classList.toggle("!bg-aksen", i === idx));
  }
  $("#prev")?.addEventListener("click", () => show(idx - 1));
  $("#next")?.addEventListener("click", () => show(idx + 1));
  titik?.addEventListener("click", (e) => {
    const spans = Array.from($$("#titik span"));
    const i = spans.indexOf(e.target);
    if (i >= 0) show(i);
  });
  show(0);
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let timer = setInterval(() => show(idx + 1), 5000);
    $("#ulasan")?.addEventListener("mouseenter", () => clearInterval(timer));
    $("#ulasan")?.addEventListener("mouseleave", () => (timer = setInterval(() => show(idx + 1), 5000)));
  }
}
renderUlasan();

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
  renderKat();
  renderMenu();
});
renderKat();
function renderMenu() {
  const cari = ($("#cari").value || "").toLowerCase();
  const hasil = PRODUK.filter(
    (p) =>
      (katAktif === "Semua" || p.kategori === katAktif) &&
      (p.nama.toLowerCase().includes(cari) || p.deskripsi.toLowerCase().includes(cari))
  );
  const wrap = $("#daftar-menu");
  const kosong = $("#kosong");
  wrap.innerHTML = hasil
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
}
$("#cari").addEventListener("input", renderMenu);
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
  const catatan = f.catatan.value.trim() ? `\nCatatan: ${f.catatan.value.trim()}` : "";
  const pesan = `Halo ${USAHA.nama}, saya mau pesan:\n${daftar}\n\nSubtotal: ${rupiah(subtotal)}\n${vline}Total: ${rupiah(total)}\nNama: ${f.nama.value.trim()}\nTipe: ${f.tipe.value}${catatan}`;
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
  const err = $("#error-kontak");
  const nama = f.nama.value.trim();
  const hp = f.hp.value.trim();
  const pesan = f.pesan.value.trim();
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

// ===== GALERI =====
function renderGaleri() {
  const wrap = $("#grid-galeri");
  if (!wrap) return;
  wrap.innerHTML = GALERI.map((g, i) => {
    const img = g.foto && g.foto.trim() !== "" ? g.foto : `https://placehold.co/600x600/F5F0E8/5A3921?text=${encodeURIComponent(g.emoji||"📷")}`;
    return `<button class="group overflow-hidden rounded-2xl" data-lightbox data-i="${i}" aria-label="Lihat foto ${i+1}">
      <img src="${img}" alt="${escapeHtml(g.alt||"Foto galeri")}" class="h-44 w-full object-cover transition group-hover:scale-105" loading="lazy" onerror="this.src='https://placehold.co/600x600/F5F0E8/5A3921?text=Galeri'">
    </button>`;
  }).join("");
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
renderKeranjang();
renderJadwal();
