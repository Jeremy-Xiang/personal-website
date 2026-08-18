import type { Directive } from 'vue'

/* Lifted from FABLE 25 — 66 MAGNETIC (spring pull) and 67 TILT (pointer tilt).
   Both no-op on coarse pointers and under prefers-reduced-motion. */

const finePointer = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches
const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ── v-mag: magnetic pull with elastic release ─────────────────────────── */

interface MagItem {
  el: HTMLElement
  dx: number
  dy: number
  vx: number
  vy: number
}

const RADIUS = 110
const STRENGTH = 0.32
const STIFF = 320
const DAMP_RATIO = 0.5

const magItems: MagItem[] = []
let pointer = { x: -9999, y: -9999, active: false }
let magRaf = 0
let magLast = 0

function springStep(cur: number, vel: number, target: number, k: number, dt: number): [number, number] {
  const damp = 2 * Math.sqrt(k) * DAMP_RATIO
  const acc = k * (target - cur) - damp * vel
  vel += acc * dt
  cur += vel * dt
  return [cur, vel]
}

function magLoop(now: number) {
  const dt = Math.min(0.032, (now - magLast) / 1000)
  magLast = now
  let anyAlive = false
  for (const it of magItems) {
    const r = it.el.getBoundingClientRect()
    const cx = r.left + r.width / 2 - it.dx
    const cy = r.top + r.height / 2 - it.dy
    const ddx = pointer.x - cx
    const ddy = pointer.y - cy
    const dist = Math.hypot(ddx, ddy)

    let tx = 0
    let ty = 0
    if (pointer.active && dist < RADIUS) {
      const fall = 1 - dist / RADIUS
      tx = ddx * STRENGTH * fall
      ty = ddy * STRENGTH * fall
    }
    ;[it.dx, it.vx] = springStep(it.dx, it.vx, tx, STIFF, dt)
    ;[it.dy, it.vy] = springStep(it.dy, it.vy, ty, STIFF, dt)
    if (Math.abs(it.dx) > 0.05 || Math.abs(it.dy) > 0.05 || Math.abs(it.vx) > 0.5) anyAlive = true
    it.el.style.transform =
      Math.abs(it.dx) < 0.05 && Math.abs(it.dy) < 0.05
        ? ''
        : `translate(${it.dx.toFixed(2)}px, ${it.dy.toFixed(2)}px)`
  }
  // keep looping while pointer is on-page or springs are still settling
  if (pointer.active || anyAlive) {
    magRaf = requestAnimationFrame(magLoop)
  } else {
    magRaf = 0
  }
}

function wakeMagLoop() {
  if (!magRaf && magItems.length) {
    magLast = performance.now()
    magRaf = requestAnimationFrame(magLoop)
  }
}

let magListenersOn = false
function onMagMove(e: PointerEvent) {
  pointer.x = e.clientX
  pointer.y = e.clientY
  pointer.active = true
  wakeMagLoop()
}
function onMagLeave() {
  pointer.active = false
}

export const vMag: Directive<HTMLElement> = {
  mounted(el) {
    if (!finePointer() || reducedMotion()) return
    magItems.push({ el, dx: 0, dy: 0, vx: 0, vy: 0 })
    el.dataset.mag = ''
    if (!magListenersOn) {
      magListenersOn = true
      window.addEventListener('pointermove', onMagMove, { passive: true })
      document.documentElement.addEventListener('mouseleave', onMagLeave)
    }
    wakeMagLoop()
  },
  unmounted(el) {
    const i = magItems.findIndex((it) => it.el === el)
    if (i !== -1) magItems.splice(i, 1)
  },
}

/* ── v-tilt: pointer-tracking card tilt, ≤ ~4° ─────────────────────────── */

const MAX_DEG = 4

export const vTilt: Directive<HTMLElement> = {
  mounted(el) {
    if (!finePointer() || reducedMotion()) return
    let raf = 0
    let tx = 0
    let ty = 0

    const apply = () => {
      raf = 0
      el.style.transform = `perspective(700px) rotateX(${ty.toFixed(2)}deg) rotateY(${tx.toFixed(2)}deg)`
    }
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const nx = (e.clientX - r.left) / r.width - 0.5
      const ny = (e.clientY - r.top) / r.height - 0.5
      tx = nx * MAX_DEG * 2
      ty = -ny * MAX_DEG * 2
      if (!raf) raf = requestAnimationFrame(apply)
    }
    const onLeave = () => {
      cancelAnimationFrame(raf)
      raf = 0
      el.style.transition = 'transform .45s cubic-bezier(.22,1,.36,1)'
      el.style.transform = ''
      window.setTimeout(() => { el.style.transition = '' }, 480)
    }
    const onEnter = () => { el.style.transition = '' }

    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    ;(el as HTMLElement & { _tiltOff?: () => void })._tiltOff = () => {
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  },
  unmounted(el) {
    ;(el as HTMLElement & { _tiltOff?: () => void })._tiltOff?.()
  },
}
