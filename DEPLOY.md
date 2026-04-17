# Deployment & Domain Guide

Everything you need to go from these files to a live URL.

---

## Part 1 — Deploy to GitHub Pages (free, ~5 minutes)

### 1. Create the repo

Option A — **on github.com:**
1. Go to <https://github.com/new>
2. Repository name: **`jeremy-xiang.github.io`** (use your actual GitHub username)
   - Note: naming the repo exactly `YOUR-USERNAME.github.io` gives you a cleaner URL — the site will live at `https://YOUR-USERNAME.github.io` instead of `https://YOUR-USERNAME.github.io/repo-name`
   - Alternatively, you can name it anything (e.g. `portfolio`) and the URL becomes `https://YOUR-USERNAME.github.io/portfolio` — both work.
3. Public. Don't initialize with README (we already have one).
4. Create repository.

Option B — **from your terminal, if you prefer:**
```bash
cd portfolio_repo
git init
git add .
git commit -m "initial commit"
gh repo create jeremy-xiang.github.io --public --source=. --push
```
(requires the [GitHub CLI](https://cli.github.com/))

### 2. Push the files

If you created the repo on github.com:

```bash
cd portfolio_repo
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/jeremy-xiang.github.io.git
git push -u origin main
```

### 3. Enable GitHub Pages

1. In the repo → **Settings** → **Pages** (left sidebar)
2. **Source**: "Deploy from a branch"
3. **Branch**: `main`, folder `/ (root)`
4. **Save**

Wait 1–2 minutes. Your site is now live at:
- `https://YOUR-USERNAME.github.io` (if you named the repo `USERNAME.github.io`)
- `https://YOUR-USERNAME.github.io/REPO-NAME` (otherwise)

---

## Part 2 — Getting a real domain (optional, ~5 minutes + $10–15/yr)

You can stop at Part 1 and be done — a `.github.io` URL is a perfectly fine personal site address. But if you want something like `jeremyxiang.com`, here's how.

### Where to buy domains

| Registrar | Pros | Typical .com price |
|-----------|------|---|
| **Cloudflare Registrar** | Cheapest (at-cost, no markup), no upsell ads, great DNS panel | ~$10/yr |
| **Namecheap** | Cheap, decent UI, free WHOIS privacy | ~$10–13/yr |
| **Porkbun** | Clean UI, transparent pricing, free WHOIS | ~$11/yr |
| Google Domains | RIP (shut down 2023, transferred to Squarespace Domains) | — |
| GoDaddy | Recognizable but aggressive upsells, higher renewal prices | ~$12–20/yr |

**My pick: Cloudflare Registrar or Porkbun.** Both are honest, fast, and don't try to sell you $200 of add-ons at checkout.

### Good domain name ideas for you

- `jeremyxiang.com` — the obvious one
- `jeremyxiang.me` — `.me` is slightly cheaper (~$4 first year, $20 renewal — read the fine print)
- `jeremyxiang.dev` — developer-flavored TLD
- `jrmy.xyz` / `jrmyxiang.com` — matching your email handle
- `jeremy.xiang.dev` — if `xiang.dev` is available (unlikely)

Check availability on whatever registrar you pick.

### Point it at GitHub Pages

Once you've bought the domain:

1. **In your domain registrar's DNS panel**, add these records for the apex domain (e.g. `jeremyxiang.com`):

   | Type | Name | Value |
   |------|------|-------|
   | A    | @    | `185.199.108.153` |
   | A    | @    | `185.199.109.153` |
   | A    | @    | `185.199.110.153` |
   | A    | @    | `185.199.111.153` |
   | CNAME | www | `YOUR-USERNAME.github.io` |

   (These four IPs are GitHub Pages' servers — hardcoded and documented [here](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).)

2. **In the GitHub repo** → Settings → Pages → Custom domain: type `jeremyxiang.com` and Save.
   - GitHub will create a `CNAME` file in the repo automatically.
   - After DNS propagates (5 min – 24 hours), check **"Enforce HTTPS"** in the same panel. This gives you free SSL via Let's Encrypt.

3. Test: `https://jeremyxiang.com` should load your site.

### How long does DNS take?

Usually **5–30 minutes.** Sometimes up to 24 hours. If it's not working after a couple hours, double-check that the A records point to the exact IPs above and that there are no conflicting old records.

---

## Part 3 — Alternatives to GitHub Pages

If GitHub Pages feels fiddly, these are also free and arguably simpler:

- **[Vercel](https://vercel.com)** — connect your GitHub repo, it deploys automatically. Free tier is generous. Custom domains are built in.
- **[Netlify](https://netlify.com)** — similar to Vercel. Drag-and-drop deploy also works if you don't want to use Git.
- **[Cloudflare Pages](https://pages.cloudflare.com)** — same idea, backed by Cloudflare's CDN.

All three will serve this site exactly the same. GitHub Pages is free-forever and tightly integrated with your repo; Vercel has the smoothest DX if you ever add a build step later.

---

## Updating the site after deploy

Edit `index.html` locally, then:

```bash
git add .
git commit -m "update /now section"
git push
```

GitHub Pages rebuilds automatically within ~1 minute. Same for Vercel and Netlify — they redeploy on every push.

---

## Troubleshooting

- **"DNS_PROBE_FINISHED_NXDOMAIN"** → DNS hasn't propagated yet. Wait 15 minutes and try again, or test with `dig jeremyxiang.com` from your terminal.
- **Site loads but resume link is 404** → make sure `Jeremy_Xiang_Resume.pdf` is at the repo root and the filename in `index.html` matches exactly (case-sensitive on Linux servers).
- **HTTPS not working** → DNS has to be fully propagated first, then GitHub's "Enforce HTTPS" checkbox becomes clickable. Can take up to a few hours.
- **Custom domain keeps getting un-set** → make sure the `CNAME` file in the repo root contains exactly your domain (one line, e.g. `jeremyxiang.com`). If GitHub keeps wiping it, that usually means a DNS misconfig.
