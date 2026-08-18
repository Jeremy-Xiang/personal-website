#!/usr/bin/env node
/**
 * Screenshot + console-error harness for the FABLE 25 iteration/critique loop.
 * No Higgsfield/credits involved — pure local headless Chrome via puppeteer-core.
 *
 * Usage:
 *   node tools/screenshot.js <url> <outBase> [--thumb]
 *
 * Writes <outBase>-desktop.png and <outBase>-mobile.png (full-page).
 * With --thumb, writes a single <outBase>.png at 1280x800 viewport, NOT full-page
 * (for gallery card thumbnails — above-the-fold hero shot only).
 * Prints a JSON report to stdout: { url, desktopHeight, mobileHeight, consoleErrors[] }.
 */
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATHS = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];

function findChrome() {
  for (const p of CHROME_PATHS) if (fs.existsSync(p)) return p;
  throw new Error('Chrome not found at expected path: ' + CHROME_PATHS.join(', '));
}

async function shootViewport(page, url, width, height, fullPage, outPath, errors) {
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 20000 }).catch(() => {});
  // let CSS/JS-driven reveal animations settle
  await new Promise(r => setTimeout(r, 900));
  if (fullPage) {
    // IntersectionObserver-based scroll reveals (opacity:0 until '.in') won't have
    // fired for below-the-fold content yet — walk the page top to bottom first so
    // everything is actually visible before the full-page capture.
    const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const steps = Math.max(1, Math.ceil(docHeight / height));
    for (let i = 0; i <= steps; i++) {
      await page.evaluate((y) => window.scrollTo(0, y), Math.round((docHeight / steps) * i));
      await new Promise(r => setTimeout(r, 220));
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(r => setTimeout(r, 400));
  }
  await page.screenshot({ path: outPath, fullPage });
  const height_ = await page.evaluate(() => document.documentElement.scrollHeight);
  return height_;
}

(async () => {
  const [, , url, outBase, mode] = process.argv;
  if (!url || !outBase) {
    console.error('Usage: node screenshot.js <url> <outBase> [--thumb]');
    process.exit(1);
  }
  fs.mkdirSync(path.dirname(outBase), { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: 'new',
    args: ['--force-color-profile=srgb', '--hide-scrollbars'],
  });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', msg => { if (msg.type() === 'error') errors.push('console.error: ' + msg.text()); });
  page.on('requestfailed', req => errors.push('requestfailed: ' + req.url() + ' — ' + (req.failure()?.errorText || '')));

  let report = { url, consoleErrors: errors };

  if (mode === '--thumb') {
    await shootViewport(page, url, 1280, 800, false, outBase + '.png', errors);
    report.thumb = outBase + '.png';
  } else {
    const desktopHeight = await shootViewport(page, url, 1440, 900, true, outBase + '-desktop.png', errors);
    const mobileHeight = await shootViewport(page, url, 390, 844, true, outBase + '-mobile.png', errors);
    report.desktopHeight = desktopHeight;
    report.mobileHeight = mobileHeight;
    report.desktop = outBase + '-desktop.png';
    report.mobile = outBase + '-mobile.png';
  }

  await browser.close();
  console.log(JSON.stringify(report, null, 2));
})().catch(e => { console.error('FATAL: ' + e.message); process.exit(1); });
