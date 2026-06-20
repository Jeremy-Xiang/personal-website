# Vue Portfolio — jeremyxiang.com

Vue 3 + Vite + TypeScript rebuild. Lives in **`vue-portfolio/`** inside your `personal-website` repo.

**Nothing is committed automatically** — upload this folder to GitHub when you're happy with it.

---

## Where is this folder?

On your Mac, after you pull or copy from the repo:

```
personal-website/
├── index.html          ← current live site (unchanged)
├── thesis.html
├── vue-portfolio/      ← NEW Vue app (this folder)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
└── ...
```

If you don't see `vue-portfolio/` yet, make sure you've pulled the latest branch that includes it, or copy the folder from wherever the agent placed it.

---

## Mac setup (first time)

### 1. Check if Node/npm is installed

Open **Terminal** and run:

```bash
node -v
npm -v
```

- If you see version numbers (e.g. `v22.x` and `10.x`), you're good.
- If you get `command not found`, install Node:

**Easiest option — download the installer:**
1. Go to [https://nodejs.org](https://nodejs.org)
2. Download the **LTS** version for macOS
3. Run the installer, then quit and reopen Terminal
4. Run `node -v` again to confirm

**Alternative — Homebrew:**
```bash
brew install node
```

### 2. Run the site locally

```bash
cd path/to/personal-website/vue-portfolio
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

### 3. Production build (optional test)

```bash
npm run build
npm run preview
```

Open **http://localhost:4173** to preview the built site.

---

## What's included

| Feature | Status |
|---------|--------|
| 3D starfield + constellations | ✅ |
| Scroll-depth glass panels | ✅ |
| Featured project cards (THESIS + LAB) | ✅ |
| Click-to-expand experience | ✅ |
| Project detail modals | ✅ |
| `/thesis` Vue route | ✅ |
| Lite FX toggle (nav) | ✅ |
| Light mode polish | ✅ |
| Panel enter transitions | ✅ |

---

## Deploy when ready

1. `npm run build` inside `vue-portfolio/`
2. Deploy contents of `vue-portfolio/dist/` to GitHub Pages / Vercel
3. Or push the whole `vue-portfolio/` folder and set Vercel root to `vue-portfolio`

Keep `CNAME` with `jeremyxiang.com` in your deploy root.

---

## Edit content

All copy lives in:
- `src/data/content.ts` — home page
- `src/data/thesis.ts` — thesis page

Resume PDF: `public/Jeremy_Xiang_Resume.pdf`
