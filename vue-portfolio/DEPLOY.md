# Deploy jeremyxiang.com

Your site is built from `vue-portfolio/` and deployed to the **repo root** (what GitHub Pages serves).

---

## Option A — Manual deploy (your Mac)

### One-time setup

1. Install Node from [https://nodejs.org](https://nodejs.org) (LTS).
2. Clone the repo (if you haven't):
   ```bash
   git clone https://github.com/Jeremy-Xiang/personal-website.git
   cd personal-website
   ```

### Every time you update the site

```bash
cd personal-website/vue-portfolio
npm install
npm run build
```

Then copy the build output to the repo root:

```bash
cd ..
rm -rf assets
rm -f index.html thesis.html favicon.svg icons.svg og-image.svg robots.txt sitemap.xml 404.html
rm -f Jeremy_Xiang_Resume.pdf Xiang_WordReadingTime_Paper.pdf
cp -r vue-portfolio/dist/* .
```

Commit and push:

```bash
git add index.html assets/ thesis.html favicon.svg icons.svg og-image.svg robots.txt sitemap.xml 404.html *.pdf
git commit -m "Deploy portfolio rebuild"
git push origin main
```

Wait 1–2 minutes, then open **https://jeremyxiang.com** (hard refresh: **Cmd+Shift+R**).

### What gets deployed (10 items at root)

```
index.html
404.html              ← lets /thesis work on GitHub Pages
thesis.html           ← redirects old links to /thesis
robots.txt
sitemap.xml
favicon.svg
icons.svg
og-image.svg
Jeremy_Xiang_Resume.pdf
Xiang_WordReadingTime_Paper.pdf
assets/
  index-XXXXX.js
  index-XXXXX.css
```

**Keep at root (do not delete):** `CNAME`, `vue-portfolio/` (source code), `.github/`

---

## Option B — Automatic deploy (GitHub Actions)

After you merge to `main`, pushing changes inside `vue-portfolio/` auto-builds and deploys.

You can also trigger manually:
1. GitHub → **Actions** → **Deploy site** → **Run workflow**

---

## Edit content

| What | File |
|------|------|
| Home page copy | `vue-portfolio/src/data/content.ts` |
| Thesis page | `vue-portfolio/src/data/thesis.ts` |
| Resume PDF | `vue-portfolio/public/Jeremy_Xiang_Resume.pdf` |

Then run the manual deploy steps above (or push to `main` if using Actions).

---

## Local preview

```bash
cd vue-portfolio
npm install
npm run dev
```

Open **http://localhost:5173**

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Blank page | Make sure `assets/` folder is at root, not inside another folder |
| `/thesis` 404 | Include `404.html` from the build in your deploy |
| Old site showing | Hard refresh (Cmd+Shift+R) or try incognito |
| No stars | Click **calm** in nav to turn off reduced effects; clear site data if needed |
