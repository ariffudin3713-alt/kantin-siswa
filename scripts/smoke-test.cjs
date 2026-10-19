#!/usr/bin/env node
// uji cepat: pastikan semua data-isi di HTML punya padanan di USAHA, dan id yang dipakai main.js ada di HTML
const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");
const data = fs.readFileSync("data.js", "utf8");
const main = fs.readFileSync("main.js", "utf8");

let gagal = false;

// 1) data-isi di HTML harus ada di objek USAHA
const usahaKeys = [...data.matchAll(/^\s{2}(\w+):/gm)].map((m) => m[1]);
const dipakai = [...html.matchAll(/data-isi="(\w+)"/g)].map((m) => m[1]);
for (const k of dipakai) {
  if (!usaHAHasKey(k)) {
    console.log("✗ data-isi", k, "tidak ada di USAHA");
    gagal = true;
  } else {
    console.log("✓ data-isi", k);
  }
}
function usaHAHasKey(k) {
  const blok = data.slice(data.indexOf("const USAHA"), data.indexOf("};", data.indexOf("const USAHA")));
  return new RegExp("\\b" + k + ":").test(blok);
}

// 2) setiap $("#id") di main.js harus ada di HTML (kecuali elemen yang dibuat dinamis)
const idDipakai = [...main.matchAll(/\$\("#([\w-]+)"\)/g)].map((m) => m[1]);
const idUnik = [...new Set(idDipakai)];
for (const id of idUnik) {
  if (!html.includes('id="' + id + '"')) {
    console.log("✗ id", id, "dipakai main.js tapi tidak ada di HTML");
    gagal = true;
  } else {
    console.log("✓ id", id);
  }
}

// 3) tidak ada console.log di main.js
if (/console\.log/.test(main)) {
  console.log("✗ ada console.log di main.js");
  gagal = true;
}

if (gagal) {
  process.exit(1);
}
process.exit(0);