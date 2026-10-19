#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const checks = [];
let fail = false;

function check(name, ok, msg) {
  checks.push({ name, ok, msg });
  if (!ok) fail = true;
}

const sensitive = [/sk-[\w]+/, /ghp_[\w]+/, /AKIA[\w]+/, /-----BEGIN (RSA|EC) PRIVATE KEY-----/];
const exts = [".js", ".cjs", ".json", ".html", ".css", ".txt"];
function walk(dir) {
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of list) {
    if (e.name.startsWith(".") && e.name !== ".gitignore") continue;
    if (e.name === "node_modules" || e.name === "css") continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      walk(p);
      continue;
    }
    const ext = path.extname(e.name).toLowerCase();
    if (!exts.includes(ext)) continue;
    try {
      const buf = fs.readFileSync(p, "utf8");
      for (const re of sensitive) {
        if (re.test(buf)) {
          check("secret_pattern", false, "Terindikasi pola sensitif di " + p);
        }
      }
    } catch (err) {}
  }
}
walk(root);

const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
check("html_tailwind_css", html.includes("css/style.css"), "index.html wajib mengacu css/style.css hasil build");
check("html_data", html.includes("data.js"), "index.html wajib memuat data.js");
check("html_main", html.includes("main.js"), "index.html wajib memuat main.js");

const mj = fs.readFileSync(path.join(root, "main.js"), "utf8");
check("no_console_log", !/(^|[^.])console\.(log|debug|table|trace)\(/m.test(mj), "main.js tidak boleh ada console.log/debug/table/trace");

const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
check("pkg_security", typeof pkg.scripts?.security === "string", "package.json wajib punya scripts.security");

checks.forEach(function (c) {
  console.log((c.ok ? "✓" : "✗"), c.name, c.ok ? "" : "— " + c.msg);
});
if (fail) {
  process.exit(1);
}
console.log("✓ security-check: all ok");
process.exit(0);