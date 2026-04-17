# jeremy xiang — personal site

Minimalist personal site. CS student at UW–Madison, class of 2028.

Built with plain HTML, CSS, and vanilla JavaScript — no frameworks, no build step.

## Structure

```
.
├── index.html              → markup
├── styles.css              → all styling
├── script.js               → all interactivity (cursor, constellations, theme toggle, etc.)
├── Jeremy_Xiang_Resume.pdf → resume, linked from the site
├── README.md               → this file
├── LICENSE                 → MIT
└── .gitignore              → standard ignores
```

## Features

- Dark mode default with light-mode toggle (persisted via `localStorage`)
- Domain-expansion intro animation and drifting constellations in the background
- Custom cursor that grows over interactive elements
- Mobile-responsive, respects `prefers-reduced-motion`
- Zero build step — just static files

## Local preview

No build step needed. Either:
- Open `index.html` directly in your browser, **or**
- Run a tiny local server so things like `localStorage` behave normally:
  ```bash
  python3 -m http.server 8000
  ```
  Then visit <http://localhost:8000>.

## Deploying

The site is deployed at <https://jeremyxiang.com>.

To deploy your own fork:
1. Push to a GitHub repo.
2. In repo **Settings → Pages**, set Source to the `main` branch, folder `/ (root)`.
3. GitHub gives you a `https://<username>.github.io/<repo>` URL within a minute or two.

See [DEPLOY.md](./DEPLOY.md) for the full guide, including custom domain setup.

## License

MIT — see [LICENSE](./LICENSE).
