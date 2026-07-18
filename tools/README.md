# screenshot.js — design-critique harness

Captures desktop + mobile full-page screenshots and console errors for any URL,
using local headless Chrome. Same tool used to iterate all 72 FABLE 25 sites.

```bash
cd tools && npm install          # once (puppeteer-core only)
python3 -m http.server 4180 -d ..            # serve the built site
node screenshot.js http://localhost:4180 /tmp/site
open /tmp/site-desktop.png /tmp/site-mobile.png
```

Run it before pushing design changes; look at the screenshots like a reviewer
would — dead space, contrast, overflow, anything broken at 390px.
