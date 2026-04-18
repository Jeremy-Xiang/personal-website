// ----- platform detection -----
// Windows + heavy blur/mix-blend-mode combos cause rendering glitches
// on some GPU drivers. Detect Windows and flag for CSS-level mitigations.
(function() {
  const ua = navigator.userAgent || '';
  if (/Windows|Win64|Win32/.test(ua)) {
    document.documentElement.classList.add('is-windows');
  }
})();

// ----- performance detection -----
// Measures frames-per-second for ~1.5 seconds after load. If FPS is
// consistently low, adds `low-perf` class to html, which disables the
// most expensive visual effects via CSS.
(function() {
  // respect saved user preference first (from motion toggle)
  try {
    if (localStorage.getItem('motion') === 'reduced') {
      document.documentElement.classList.add('low-perf');
      return;
    }
  } catch(e) {}

  // also check for "save data" preference and low-memory devices up front
  const saveData = navigator.connection && navigator.connection.saveData;
  const lowMemory = navigator.deviceMemory && navigator.deviceMemory <= 2;
  if (saveData || lowMemory) {
    document.documentElement.classList.add('low-perf');
    return;
  }

  let frames = 0;
  let start = null;
  const DURATION_MS = 1500;
  const FPS_THRESHOLD = 40; // below this = degrade

  function tick(now) {
    if (!start) start = now;
    frames++;
    const elapsed = now - start;
    if (elapsed < DURATION_MS) {
      requestAnimationFrame(tick);
    } else {
      const fps = (frames / elapsed) * 1000;
      if (fps < FPS_THRESHOLD) {
        document.documentElement.classList.add('low-perf');
      }
    }
  }
  // delay by one frame so the initial page-load stutter isn't counted
  requestAnimationFrame(() => requestAnimationFrame(tick));
})();

// ----- manual motion toggle (ARIA switch) -----
(function() {
  const toggle = document.getElementById('motionToggle');
  if (!toggle) return;

  function sync() {
    // ARIA switch: aria-checked="true" means motion is ON
    const motionOn = !document.documentElement.classList.contains('low-perf');
    toggle.setAttribute('aria-checked', motionOn ? 'true' : 'false');
  }
  sync();

  toggle.addEventListener('click', () => {
    const root = document.documentElement;
    const nowReduced = !root.classList.contains('low-perf');
    root.classList.toggle('low-perf', nowReduced);
    try {
      localStorage.setItem('motion', nowReduced ? 'reduced' : 'normal');
    } catch(e) {}
    // Mark intro as "done" the moment the user touches the toggle, so
    // toggling motion back ON does NOT re-reveal an in-progress intro.
    root.classList.add('intro-done');
    try { sessionStorage.setItem('introPlayed', '1'); } catch(e) {}
    sync();
  });
})();

// ----- mark intro animation as played (once per session) -----
// Inline script in <head> handles adding the class to skip the intro
// on repeat visits. Here we just mark sessionStorage after intro plays.
(function() {
  try {
    const played = sessionStorage.getItem('introPlayed') === '1';
    if (!played) {
      setTimeout(() => {
        sessionStorage.setItem('introPlayed', '1');
      }, 1900); // intro is ~1.8s long
    }
  } catch(e) {}
})();

// build ambient background: constellations + scattered stars
// Deferred via requestIdleCallback so the hero/content render first.
// Falls back to setTimeout for older browsers.
(function() {
  function buildAmbient() {
  const ambient = document.querySelector('.ambient');

  // --- real constellations, coords normalized 0-100 within each region ---
  const constellations = [
    {
      name: 'orion',
      // upper-left
      x: 3, y: 6, w: 13, h: 16,
      drift: [18, -10, -12, 14, 10, -6, 35],
      stars: [
        { x: 20, y: 15, bright: true },
        { x: 80, y: 20, bright: true },
        { x: 35, y: 50 }, { x: 50, y: 52 }, { x: 65, y: 54 },
        { x: 25, y: 90, bright: true },
        { x: 78, y: 88, bright: true },
        { x: 48, y: 68, faint: true },
      ],
      lines: [[0,1],[0,2],[1,4],[2,3],[3,4],[2,5],[4,6],[5,6]]
    },
    {
      name: 'scorpius',
      // upper-right, balances orion
      x: 83, y: 4, w: 14, h: 13,
      drift: [-10, -12, 14, 10, -8, 14, 40],
      stars: [
        { x: 10, y: 20 },
        { x: 25, y: 10, bright: true },
        { x: 42, y: 22 },
        { x: 55, y: 45, bright: true },
        { x: 68, y: 65 },
        { x: 78, y: 82 },
        { x: 90, y: 72, bright: true },
        { x: 86, y: 58, faint: true },
      ],
      lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
    },
    {
      name: 'cygnus',
      // upper-center, between orion and scorpius — shifts the "ring" inward
      x: 35, y: 2, w: 14, h: 9,
      drift: [12, 8, -10, -10, 6, -6, 48],
      stars: [
        { x: 50, y: 10, bright: true },   // Deneb (tail)
        { x: 50, y: 40 },
        { x: 50, y: 70, bright: true },   // Sadr (center)
        { x: 50, y: 95 },                 // Albireo (beak)
        { x: 15, y: 62, bright: true },   // left wing
        { x: 85, y: 62, bright: true },   // right wing
      ],
      lines: [[0,1],[1,2],[2,3],[4,2],[2,5]]  // swan/cross shape
    },
    {
      name: 'lyra',
      // upper-left of mid, small and compact
      x: 18, y: 32, w: 8, h: 7,
      drift: [14, -6, -10, 8, 8, -10, 44],
      stars: [
        { x: 50, y: 15, bright: true },
        { x: 30, y: 45 },
        { x: 70, y: 45 },
        { x: 30, y: 80 },
        { x: 70, y: 80 },
      ],
      lines: [[0,1],[0,2],[1,3],[2,4],[3,4]]
    },
    {
      name: 'aquila',
      // right of mid, sits across from lyra
      x: 78, y: 38, w: 12, h: 10,
      drift: [-12, 10, 14, -8, -10, 6, 42],
      stars: [
        { x: 50, y: 20, bright: true },   // Altair (head/bright)
        { x: 35, y: 10, faint: true },    // Tarazed
        { x: 62, y: 32, faint: true },    // Alshain
        { x: 20, y: 55 },                 // left wing
        { x: 80, y: 60 },                 // right wing
        { x: 50, y: 90 },                 // tail
      ],
      lines: [[1,0],[0,2],[3,0],[0,4],[0,5]]  // arrow/bird
    },
    {
      name: 'big-dipper',
      // lower-center, breaks up side clustering
      x: 42, y: 60, w: 16, h: 9,
      drift: [-14, 12, 16, -8, -10, 10, 46],
      stars: [
        { x: 10, y: 50, bright: true },
        { x: 30, y: 70, bright: true },
        { x: 45, y: 30, bright: true },
        { x: 25, y: 15, bright: true },
        { x: 55, y: 50 },
        { x: 75, y: 55 },
        { x: 92, y: 40, bright: true },
      ],
      lines: [[0,1],[1,2],[2,3],[3,0],[3,4],[4,5],[5,6]]
    },
    {
      name: 'cassiopeia',
      // lower-left
      x: 3, y: 72, w: 14, h: 7,
      drift: [10, -8, -14, 10, 6, -12, 38],
      stars: [
        { x: 5, y: 70, bright: true },
        { x: 25, y: 30, bright: true },
        { x: 50, y: 65 },
        { x: 75, y: 25, bright: true },
        { x: 95, y: 60, bright: true },
      ],
      lines: [[0,1],[1,2],[2,3],[3,4]]
    },
    {
      name: 'southern-cross',
      // lower-right
      x: 82, y: 80, w: 10, h: 10,
      drift: [-8, 10, 12, -14, -6, 8, 50],
      stars: [
        { x: 50, y: 10, bright: true },
        { x: 50, y: 90, bright: true },
        { x: 12, y: 55, bright: true },
        { x: 88, y: 50, bright: true },
        { x: 72, y: 72, faint: true },
      ],
      lines: [[0,1],[2,3]]
    }
  ];

  constellations.forEach((c, ci) => {
    const wrap = document.createElement('div');
    wrap.className = 'constellation';
    wrap.style.left = c.x + '%';
    wrap.style.top = c.y + '%';
    wrap.style.width = c.w + '%';
    wrap.style.height = c.h + 'vh';
    wrap.style.animationDelay = (0.3 + ci * 0.3) + 's, ' + (ci * 2) + 's';
    // drift custom props
    wrap.style.setProperty('--dx1', c.drift[0] + 'px');
    wrap.style.setProperty('--dy1', c.drift[1] + 'px');
    wrap.style.setProperty('--dx2', c.drift[2] + 'px');
    wrap.style.setProperty('--dy2', c.drift[3] + 'px');
    wrap.style.setProperty('--dx3', c.drift[4] + 'px');
    wrap.style.setProperty('--dy3', c.drift[5] + 'px');
    wrap.style.setProperty('--drift-dur', c.drift[6] + 's');

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'const-svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    c.lines.forEach((pair, li) => {
      const [a, b] = pair;
      const line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', c.stars[a].x);
      line.setAttribute('y1', c.stars[a].y);
      line.setAttribute('x2', c.stars[b].x);
      line.setAttribute('y2', c.stars[b].y);
      line.setAttribute('class', 'const-line');
      line.style.animationDelay = (1 + ci * 0.3 + li * 0.08) + 's, ' + (3.5 + ci * 0.3 + li * 0.08) + 's';
      svg.appendChild(line);
    });
    wrap.appendChild(svg);

    c.stars.forEach((s) => {
      const el = document.createElement('div');
      el.className = 'const-star' + (s.bright ? ' bright' : s.faint ? ' faint' : '');
      el.style.left = s.x + '%';
      el.style.top = s.y + '%';
      el.style.transform = 'translate(-50%, -50%)';
      el.style.setProperty('--tw', s.bright ? '0.8' : s.faint ? '0.35' : '0.55');
      el.style.animationDelay = (Math.random() * 3) + 's';
      wrap.appendChild(el);
    });
    ambient.appendChild(wrap);
  });

  // --- scattered background stars ---
  // When motion is reduced, constellations are hidden — boost star count
  // slightly so the sky doesn't feel too empty.
  const lowPerf = document.documentElement.classList.contains('low-perf');
  const edgeCount = lowPerf ? 160 : 100;
  const edgeFrag = document.createDocumentFragment();
  for (let i = 0; i < edgeCount; i++) {
    const s = document.createElement('div');
    const size = Math.random();
    s.className = 'star' + (size > 0.9 ? ' lg' : '');
    // scatter uniformly across the whole viewport — no center avoidance
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    s.style.left = x + '%';
    s.style.top = y + '%';
    const dur = 14 + Math.random() * 20;
    const delay = -Math.random() * dur;
    const dx = (Math.random() - 0.5) * 30 + 'px';
    const dy = (Math.random() - 0.5) * 30 + 'px';
    const op = 0.1 + Math.random() * 0.18;
    s.style.setProperty('--dx', dx);
    s.style.setProperty('--dy', dy);
    s.style.setProperty('--star-opacity', op);
    s.style.animation = `starDrift ${dur}s ease-in-out ${delay}s infinite`;
    edgeFrag.appendChild(s);
  }
  ambient.appendChild(edgeFrag);

  // center layer: slightly fainter, peppers the reading column softly
  const centerCount = lowPerf ? 120 : 70;
  const centerFrag = document.createDocumentFragment();
  for (let i = 0; i < centerCount; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    // span the full width so some land in the center (30-70%)
    s.style.left = (Math.random() * 100) + '%';
    s.style.top = (Math.random() * 100) + '%';
    const dur = 18 + Math.random() * 22;
    const delay = -Math.random() * dur;
    const dx = (Math.random() - 0.5) * 22 + 'px';
    const dy = (Math.random() - 0.5) * 22 + 'px';
    // very faint so they never fight the text
    const op = 0.05 + Math.random() * 0.1;
    s.style.setProperty('--dx', dx);
    s.style.setProperty('--dy', dy);
    s.style.setProperty('--star-opacity', op);
    s.style.animation = `starDrift ${dur}s ease-in-out ${delay}s infinite`;
    centerFrag.appendChild(s);
  }
  ambient.appendChild(centerFrag);
  } // end buildAmbient

  // Schedule after initial paint so hero and content render immediately
  if ('requestIdleCallback' in window) {
    requestIdleCallback(buildAmbient, { timeout: 200 });
  } else {
    setTimeout(buildAmbient, 30);
  }
})();

// theme toggle
const root = document.documentElement;
const themeBtn = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') root.classList.add('light');
themeBtn.addEventListener('click', () => {
  root.classList.toggle('light');
  localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
});

// ----- rotating word with dynamic width -----
// Updates the hidden sizer text to match each word so the container
// width reflows naturally — no explicit pixel measurement needed.
(function() {
  const rotator = document.querySelector('.rotator');
  if (!rotator) return;
  const sizer = rotator.querySelector('.sizer');
  const words = Array.from(rotator.querySelectorAll('.word'));
  if (!words.length) return;

  const SHOW_MS = 3000;
  const FADE_MS = 400;
  let idx = 0;

  function activate(i, instant) {
    if (!instant) {
      words.forEach(w => {
        w.style.opacity = '0';
        w.style.transform = 'translateY(6px) translateZ(0)';
      });
    }
    sizer.textContent = words[i].textContent;
    setTimeout(() => {
      words[i].style.opacity = '1';
      words[i].style.transform = 'translateY(0) translateZ(0)';
    }, instant ? 0 : 100);
    idx = i;
  }

  const wait = Math.max(0, 2700 - performance.now());
  setTimeout(() => {
    activate(0, true);
    setInterval(() => activate((idx + 1) % words.length, false), SHOW_MS + FADE_MS);
  }, wait);
})();

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

// Show above-the-fold reveal elements immediately — no waiting for scroll.
// Elements below the fold still get the fade-in as you scroll to them.
const viewportH = window.innerHeight;
document.querySelectorAll('.reveal').forEach(el => {
  const rect = el.getBoundingClientRect();
  if (rect.top < viewportH) {
    el.classList.add('visible');
  } else {
    observer.observe(el);
  }
});

// section label line-draw
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('section').forEach(el => {
  const rect = el.getBoundingClientRect();
  if (rect.top < viewportH * 0.8) {
    el.classList.add('visible');
  } else {
    sectionObserver.observe(el);
  }
});

document.querySelectorAll('.tool-card').forEach((card, i) => {
  card.style.transitionDelay = (i * 0.05) + 's';
});

// logo click scrolls to top
document.querySelector('.logo').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// custom cursor
(function() {
  const dot = document.getElementById('cursorDot');
  if (!dot || window.matchMedia('(hover: none)').matches) return;
  let tx = 0, ty = 0, cx = 0, cy = 0;
  let active = false;
  document.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
    if (!active) {
      active = true;
      dot.classList.add('active');
    }
  });
  document.addEventListener('mouseleave', () => {
    active = false;
    dot.classList.remove('active');
  });
  // grow on interactive elements
  const hoverables = 'a, button, .logo, .trait, .tool-card, .entry, .contact-item, input, textarea';
  document.querySelectorAll(hoverables).forEach(el => {
    el.addEventListener('mouseenter', () => dot.classList.add('hover'));
    el.addEventListener('mouseleave', () => dot.classList.remove('hover'));
  });
  // smooth follow with requestAnimationFrame
  function tick() {
    cx += (tx - cx) * 0.22;
    cy += (ty - cy) * 0.22;
    dot.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  }
  tick();
})();

// infinity easter egg — click speeds up constellation drift
// Uses CSS class toggle; speed transitions are handled via CSS
// so there are no JS-driven interpolation steps to look janky.
(function() {
  const inf = document.querySelector('.infinity');
  if (!inf) return;
  inf.style.cursor = 'pointer';

  let timer = null;
  inf.addEventListener('click', (e) => {
    e.stopPropagation();  // don't trigger logo scroll

    // add fast class — CSS handles the actual speed change
    document.documentElement.classList.add('fast-drift');

    // clear any pending remove so rapid clicks just extend the fast phase
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      document.documentElement.classList.remove('fast-drift');
      timer = null;
    }, 4500);

    // spin infinity as visual feedback
    inf.style.transition = 'transform 1s cubic-bezier(0.77, 0, 0.175, 1)';
    inf.style.transform = 'rotate(720deg)';
    setTimeout(() => {
      inf.style.transform = '';
    }, 1100);
  });
})();
// ----- nav scroll detection -----
// Adds .scrolled class to nav when user has scrolled past the top.
// Needed so nav stays transparent at top-of-page (no black box on mobile).
(function() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  let ticking = false;
  function update() {
    const scrolled = window.scrollY > 10;
    nav.classList.toggle('scrolled', scrolled);
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
  update(); // initial state
})();

// ----- nav proximity fade -----
// Fades content elements as they scroll up into the nav zone,
// and restores opacity as they scroll back down away from it.
(function() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  const FADE_PX = 80; // px below nav bottom over which to fade
  const MIN_OP = 0.05;

  const targets = Array.from(document.querySelectorAll(
    'h1, h2, p, .entry-title, .entry-meta, .section-label, ' +
    '.trait-name, .trait-desc, .now-text, .now-label, ' +
    '.contact-item, .tool-card h3, .tool-card p, footer'
  ));

  let ticking = false;

  function update() {
    const navBottom = nav.getBoundingClientRect().bottom;
    targets.forEach(el => {
      const dist = el.getBoundingClientRect().top - navBottom;
      if (dist >= FADE_PX) {
        el.style.opacity = '';
      } else if (dist <= 0) {
        el.style.opacity = MIN_OP;
      } else {
        el.style.opacity = (MIN_OP + (1 - MIN_OP) * (dist / FADE_PX)).toFixed(3);
      }
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
})();
