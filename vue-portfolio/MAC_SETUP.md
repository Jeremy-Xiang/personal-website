# Mac quick start

You asked about npm on Mac — here's the shortest path:

## Do I have npm?

```bash
node -v
npm -v
```

Both should print version numbers. If not, install Node from **https://nodejs.org** (LTS button).

## Run the Vue site

```bash
cd vue-portfolio
npm install
npm run dev
```

Then open: **http://localhost:5173**

## Folder location

```
personal-website/vue-portfolio/
```

That's the only folder you need to upload/test. The old `index.html` at the repo root stays as-is until you switch hosting to the Vue build.
