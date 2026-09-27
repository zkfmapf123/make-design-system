#!/usr/bin/env node
// make-design-system CLI
//   capture <url>        --out <dir>                     reference analysis (styles, vars, fonts, sections, requests, public css/js)
//   shots   <url|file>   --out <dir> [--step 700] [--menu <selector>] [--wait 1500] [--keep-overlays]
//   verify  <url|file>   [--out <dir>]                   console errors + horizontal overflow, exit 1 on failure
//   grid    <dir>        [--cols 2] [--scale 0.5] [--prefix d] [--per 4]
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const [, , cmd, target, ...rest] = process.argv;
const opts = {};
for (let i = 0; i < rest.length; i++) if (rest[i].startsWith('--')) opts[rest[i].slice(2)] = rest[i + 1]?.startsWith('--') || rest[i + 1] === undefined ? true : rest[++i];

const wait = ms => new Promise(r => setTimeout(r, ms));
const toUrl = t => /^https?:|^file:/.test(t) ? t : pathToFileURL(path.resolve(t)).href;
const outDir = d => { fs.mkdirSync(d, { recursive: true }); return d; };
const MENU_GUESS = 'button[aria-label*="menu" i], [class*="hamburger" i], [class*="menuIco" i], [class*="menu-btn" i], [class*="menuBtn" i], [class*="menu-toggle" i], [aria-controls*="menu" i]';

// Puppeteer resolves .puppeteerrc.cjs from the CURRENT WORKING DIRECTORY, not from this
// script. Run from a user's project and it silently falls back to ~/.cache/puppeteer and then
// throws "Could not find chrome-headless-shell". Pin the cache to this folder before the import.
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
process.env.PUPPETEER_CACHE_DIR ||= path.join(SCRIPT_DIR, '.cache', 'puppeteer');

async function launch() {
  const puppeteer = await import('puppeteer');
  // headless: 'shell' — setup.sh downloads chrome-headless-shell only, not full Chrome.
  // Any custom script reusing these node_modules must pass the same flag.
  let browser;
  try {
    browser = await puppeteer.default.launch({ headless: 'shell' });
  } catch (e) {
    console.error(
      `\nCould not launch the bundled browser (cache: ${process.env.PUPPETEER_CACHE_DIR}).\n` +
      `Run:  bash ${path.join(SCRIPT_DIR, 'setup.sh')}\n`);
    throw e;
  }
  return { puppeteer, browser };
}

// Consent banners, cookie walls and regional-notice modals cover every screenshot, and the
// reference analysis is then worthless. Click the usual accept/continue control, then remove
// whatever fixed element still covers a large share of the viewport.
// Measured on a real run: a regulatory modal hid all 18 shots of the reference site.
const dismissOverlays = page => page.evaluate(() => {
  const RE = /^(continue|accept|accept all|agree|i agree|ok|okay|got it|i understand|allow all|close)$/i;
  const all = [];
  const walk = root => {
    for (const el of root.querySelectorAll('*')) { all.push(el); if (el.shadowRoot) walk(el.shadowRoot); }
  };
  walk(document);
  const hit = all.find(el => RE.test((el.textContent || '').trim()) && el.offsetParent !== null
    && ['BUTTON', 'A', 'DIV', 'SPAN'].includes(el.tagName));
  let clicked = null;
  if (hit) { hit.click(); clicked = (hit.textContent || '').trim(); }
  let stripped = 0;
  const vw = innerWidth, vh = innerHeight;
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (cs.position !== 'fixed') continue;
    const r = el.getBoundingClientRect();
    const covers = r.width * r.height > vw * vh * 0.35;
    const dims = cs.backgroundColor.includes('rgba') || Number(cs.zIndex) > 900;
    if (covers && dims) { el.remove(); stripped++; }
  }
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
  return { clicked, stripped };
});

async function open(browser, puppeteer, url, device) {
  const page = await browser.newPage();
  if (device === 'mobile') await page.emulate(puppeteer.KnownDevices['iPhone 13']);
  else await page.setViewport({ width: 1440, height: 900 });
  const log = { console: [], pageerror: [], failed: [] };
  page.on('console', m => m.type() === 'error' && log.console.push(m.text()));
  page.on('pageerror', e => log.pageerror.push(e.message));
  page.on('requestfailed', r => log.failed.push(`${r.failure()?.errorText} ${r.url()}`));
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  await wait(Number(opts.wait ?? 1500));
  // Late-injected modals appear after load, so dismiss AFTER the settle wait.
  let overlays = { clicked: null, stripped: 0 };
  if (!opts['keep-overlays']) { overlays = await dismissOverlays(page); await wait(600); }
  return { page, log, overlays };
}

// Scroll through once so lazy content and scroll-triggered animations settle.
const warmScroll = page => page.evaluate(async () => {
  const H = document.documentElement.scrollHeight;
  for (let y = 0; y < H; y += 400) { scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); }
  scrollTo(0, 0);
});

async function capture() {
  const out = outDir(opts.out ?? '.benchmark');
  const url = toUrl(target);
  const { puppeteer, browser } = await launch();
  const { page, log } = await open(browser, puppeteer, url, 'desktop');
  const requests = [];
  page.on('response', r => requests.push({ url: r.url(), type: r.request().resourceType(), status: r.status() }));
  await page.reload({ waitUntil: 'networkidle2' });
  await warmScroll(page);
  await wait(800);
  fs.writeFileSync(path.join(out, 'rendered.html'), await page.content());

  const data = await page.evaluate(() => {
    const count = (m, k) => (m[k] = (m[k] || 0) + 1);
    const top = (m, n = 15) => Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, n);
    const colors = {}, bgs = {}, fonts = {}, sizes = {}, radii = {}, shadows = {}, borders = {};
    for (const el of document.querySelectorAll('body *')) {
      const s = getComputedStyle(el);
      if (s.display === 'none' || s.visibility === 'hidden') continue;
      if (el.children.length === 0 && el.textContent.trim()) {
        count(colors, s.color); count(fonts, s.fontFamily);
        count(sizes, `${s.fontSize}/${s.fontWeight}/${s.lineHeight}/${s.letterSpacing}`);
      }
      if (s.backgroundColor !== 'rgba(0, 0, 0, 0)') count(bgs, s.backgroundColor);
      if (s.borderRadius !== '0px') count(radii, s.borderRadius);
      if (s.boxShadow !== 'none') count(shadows, s.boxShadow);
      if (s.borderTopWidth !== '0px') count(borders, `${s.borderTopWidth} ${s.borderTopStyle} ${s.borderTopColor}`);
    }
    const vars = {};
    for (const sh of document.styleSheets) {
      try { for (const r of sh.cssRules) if (r.selectorText === ':root') for (const p of r.style) if (p.startsWith('--')) vars[p] = r.style.getPropertyValue(p).trim(); } catch {}
    }
    const media = new Set();
    for (const sh of document.styleSheets) { try { for (const r of sh.cssRules) if (r.media) media.add(r.media.mediaText); } catch {} }
    const sections = [...document.querySelectorAll('header, nav, main > *, section, footer')]
      .filter(e => e.offsetHeight > 80).slice(0, 50).map(e => {
        const r = e.getBoundingClientRect(), s = getComputedStyle(e);
        return { tag: e.tagName, id: e.id, cls: String(e.className).slice(0, 80), top: Math.round(r.top + scrollY), h: Math.round(r.height),
          bg: s.backgroundColor, headings: [...e.querySelectorAll('h1,h2,h3')].slice(0, 4).map(h => h.innerText.trim().slice(0, 80)) };
      });
    return {
      title: document.title,
      meta: [...document.querySelectorAll('meta[name],meta[property]')].map(m => `${m.name || m.getAttribute('property')}: ${m.content}`),
      height: document.documentElement.scrollHeight,
      colors: top(colors), bgs: top(bgs), fonts: top(fonts, 8), sizes: top(sizes, 25), radii: top(radii, 10), shadows: top(shadows, 6), borders: top(borders, 8),
      vars, media: [...media],
      fontFaces: [...new Set([...document.fonts].map(f => `${f.family} ${f.weight} ${f.status}`))],
      sections,
      images: [...document.images].map(i => ({ src: i.currentSrc || i.src, w: i.naturalWidth, h: i.naturalHeight })).slice(0, 60),
      links: [...document.querySelectorAll('a')].map(a => `${a.innerText.trim().slice(0, 30)} -> ${a.getAttribute('href')}`).slice(0, 80),
      scripts: [...document.scripts].map(s => s.src).filter(Boolean),
      styles: [...document.querySelectorAll('link[rel=stylesheet]')].map(l => l.href),
    };
  });
  data.requests = requests.filter(r => ['stylesheet', 'script', 'font', 'fetch', 'xhr'].includes(r.type)).map(r => `${r.type} ${r.status} ${r.url}`);
  data.errors = log;
  fs.writeFileSync(path.join(out, 'analysis.json'), JSON.stringify(data, null, 2));

  // Public same-origin CSS/JS for reading only (never shipped).
  const src = outDir(path.join(out, 'src'));
  const origin = new URL(url).origin;
  for (const u of [...data.styles, ...data.scripts].filter(u => u.startsWith(origin))) {
    try {
      const res = await fetch(u);
      if (res.ok) fs.writeFileSync(path.join(src, new URL(u).pathname.replace(/^\//, '').replace(/\//g, '_') || 'index'), await res.text());
    } catch {}
  }
  await browser.close();
  console.log(JSON.stringify({ out, title: data.title, height: data.height, sections: data.sections.length, vars: Object.keys(data.vars).length, src: fs.readdirSync(src).length }));
}

async function shots() {
  const out = outDir(opts.out ?? 'shots');
  const url = toUrl(target);
  const step = Number(opts.step ?? 700);
  const { puppeteer, browser } = await launch();
  const result = {};
  for (const [prefix, device] of [['d', 'desktop'], ['m', 'mobile']]) {
    const { page, log, overlays } = await open(browser, puppeteer, url, device);
    const H = await page.evaluate(() => document.documentElement.scrollHeight);
    let i = 0;
    for (let y = 0; y < H; y += step) {
      await page.evaluate(y => scrollTo(0, y), y);
      await wait(Number(opts.settle ?? 1500));
      await page.screenshot({ path: path.join(out, `${prefix}${String(i++).padStart(2, '0')}.png`) });
    }
    await page.evaluate(() => scrollTo(0, 0)); await wait(800);
    const sel = typeof opts.menu === 'string' ? opts.menu : MENU_GUESS;
    const btn = await page.$(sel).catch(() => null);
    let menu = false;
    if (btn && await btn.isVisible().catch(() => false)) {
      await btn.click().catch(() => {}); await wait(1500);
      await page.screenshot({ path: path.join(out, `${prefix}_menu.png`) }); menu = true;
    }
    result[device] = { height: H, shots: i, menu, overlays, errors: log.console.length + log.pageerror.length };
    await page.close();
  }
  await browser.close();
  console.log(JSON.stringify({ out, ...result }));
}

async function verify() {
  const url = toUrl(target);
  const { puppeteer, browser } = await launch();
  const report = { url, ok: true };
  for (const device of ['desktop', 'mobile']) {
    const { page, log } = await open(browser, puppeteer, url, device);
    await warmScroll(page); await wait(600);
    const layout = await page.evaluate(() => {
      const de = document.documentElement;
      const wide = [...document.querySelectorAll('body *')].filter(e => {
        const r = e.getBoundingClientRect();
        return r.width > 0 && r.right > de.clientWidth + 1 && getComputedStyle(e).position !== 'fixed' && !e.closest('[style*="overflow"], pre, table');
      }).slice(0, 5).map(e => `${e.tagName.toLowerCase()}${e.id ? '#' + e.id : ''}.${String(e.className).split(' ')[0]}`);
      return { overflowX: de.scrollWidth - de.clientWidth, height: de.scrollHeight, widest: wide };
    });
    const r = { ...layout, consoleErrors: log.console, pageErrors: log.pageerror, failedRequests: log.failed };
    r.ok = r.overflowX <= 0 && !r.consoleErrors.length && !r.pageErrors.length;
    report[device] = r; report.ok &&= r.ok;
    await page.close();
  }
  await browser.close();
  if (opts.out) fs.writeFileSync(path.join(outDir(opts.out), 'verify.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  process.exit(report.ok ? 0 : 1);
}

async function grid() {
  const { default: sharp } = await import('sharp');
  const dir = target;
  const cols = Number(opts.cols ?? 2), scale = Number(opts.scale ?? 0.5), per = Number(opts.per ?? 4);
  const prefix = opts.prefix ?? 'd';
  const files = fs.readdirSync(dir).filter(f => new RegExp(`^${prefix}\\d+\\.png$`).test(f)).sort();
  if (!files.length) { console.error(`no ${prefix}NN.png in ${dir}`); process.exit(1); }
  const meta = await sharp(path.join(dir, files[0])).metadata();
  const w = Math.round(meta.width * scale), h = Math.round(meta.height * scale);
  const made = [];
  for (let k = 0; k < files.length; k += per) {
    const part = files.slice(k, k + per), rows = Math.ceil(part.length / cols);
    const tiles = await Promise.all(part.map(async (f, j) => ({
      input: await sharp(path.join(dir, f)).resize(w, h, { fit: 'cover', position: 'top' }).toBuffer(),
      left: (j % cols) * w, top: Math.floor(j / cols) * h,
    })));
    const name = path.join(dir, `${prefix}grid${k / per}.png`);
    await sharp({ create: { width: w * cols, height: h * rows, channels: 3, background: '#ffffff' } }).composite(tiles).png().toFile(name);
    made.push(name);
  }
  console.log(JSON.stringify({ grids: made }));
}

const commands = { capture, shots, verify, grid };
if (!commands[cmd] || !target) {
  console.error('usage: node bds.mjs <capture|shots|verify|grid> <url|file|dir> [--out dir] [...options]');
  process.exit(2);
}
await commands[cmd]();
