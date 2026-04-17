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

// ----- manual motion toggle -----
(function() {
  const toggle = document.getElementById('motionToggle');
  if (!toggle) return;

  function syncLabel() {
    const on = document.documentElement.classList.contains('low-perf');
    toggle.textContent = on ? 'enable motion' : 'reduce motion';
  }
  syncLabel();

  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    const root = document.documentElement;
    const nowReduced = !root.classList.contains('low-perf');
    root.classList.toggle('low-perf', nowReduced);
    try {
      localStorage.setItem('motion', nowReduced ? 'reduced' : 'normal');
    } catch(e) {}
    syncLabel();
  });
})();

// build ambient background: constellations + scattered stars
(function() {
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
  // edge layer: denser, pushed away from central content
  const edgeCount = 80;
  for (let i = 0; i < edgeCount; i++) {
    const s = document.createElement('div');
    const size = Math.random();
    s.className = 'star' + (size > 0.9 ? ' lg' : '');
    let x = Math.random() * 100;
    let y = Math.random() * 100;
    if (x > 28 && x < 72) {
      x = x < 50 ? x * 0.5 : 100 - (100 - x) * 0.5;
    }
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
    ambient.appendChild(s);
  }

  // center layer: very faint, smaller, peppers the reading column softly
  const centerCount = 35;
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
    ambient.appendChild(s);
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

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// section label line-draw
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('section').forEach(el => sectionObserver.observe(el));

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

// infinity easter egg — click briefly speeds up constellation drift
(function() {
  const inf = document.querySelector('.infinity');
  if (!inf) return;
  inf.style.cursor = 'pointer';
  inf.addEventListener('click', (e) => {
    e.stopPropagation();  // don't trigger logo scroll
    document.querySelectorAll('.constellation').forEach(c => {
      const prev = c.style.animationDuration;
      c.style.animationDuration = '2s, 8s';
      setTimeout(() => {
        c.style.animationDuration = '';
      }, 4000);
    });
    // also spin infinity a full 360 as feedback
    inf.style.transition = 'transform 1s cubic-bezier(0.77, 0, 0.175, 1)';
    inf.style.transform = 'rotate(720deg)';
    setTimeout(() => {
      inf.style.transform = '';
    }, 1100);
  });
})();