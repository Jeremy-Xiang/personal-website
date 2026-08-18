/*
 * ascii.ts — ES-module port of ascii-animator (repos/ascii-animator) for the
 * night-sky portfolio. Differences from the standalone lib:
 *   - `background: 'transparent'` clears instead of filling, so the starfield
 *     shows through between glyphs
 *   - the dissolve animation settles into a gentle idle wave instead of a
 *     hard-static frame
 *   - setInk() lets the theme watcher recolor without rebuilding
 */

interface Cell { lum: number; delay: number; seed: number }
export interface AsciiOpts {
  cols?: number
  charset?: string
  ink?: string
  background?: string        // css color or 'transparent'
  fontSize?: number
  aspect?: number
}

const DEFAULTS: Required<AsciiOpts> = {
  cols: 84,
  charset: ' .:-=+*#%@',
  ink: '#6e8fff',
  background: 'transparent',
  fontSize: 7,
  aspect: 0.52,
}

export class AsciiArt {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private opts: Required<AsciiOpts>
  private sample = document.createElement('canvas')
  private sctx = this.sample.getContext('2d', { willReadFrequently: true })!
  private cells: Cell[] | null = null
  private rows = 0
  private cellW = 0
  private cellH = 0
  private raf = 0
  private t0 = performance.now()
  private reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

  constructor(canvas: HTMLCanvasElement, opts: AsciiOpts = {}) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.opts = { ...DEFAULTS, ...opts }
  }

  async fromImage(src: string | HTMLImageElement): Promise<this> {
    let img: HTMLImageElement
    if (typeof src === 'string') {
      img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = src
      if (!img.complete) await new Promise((res, rej) => { img.onload = res; img.onerror = rej })
    } else {
      img = src
    }
    this.grid(img.naturalWidth || img.width, img.naturalHeight || img.height)
    this.sampleFrom(img)
    this.restart()
    return this
  }

  fromText(glyph: string, size = 300): this {
    const c = document.createElement('canvas')
    c.width = c.height = size
    const x = c.getContext('2d')!
    x.textAlign = 'center'
    x.textBaseline = 'middle'
    x.fillStyle = '#fff'
    x.font = `${size * 0.82}px system-ui, sans-serif`
    x.fillText(glyph, size / 2, size / 2 + size * 0.04)
    this.grid(size, size)
    this.sampleFrom(c)
    this.restart()
    return this
  }

  setInk(ink: string) { this.opts.ink = ink }

  destroy() {
    cancelAnimationFrame(this.raf)
    this.cells = null
  }

  private grid(w: number, h: number) {
    const { cols, fontSize, aspect } = this.opts
    this.rows = Math.max(1, Math.round((h / w) * cols * aspect))
    this.sample.width = cols
    this.sample.height = this.rows
    const dpr = Math.min(globalThis.devicePixelRatio || 1, 2)
    this.cellW = fontSize * 0.6
    this.cellH = fontSize
    this.canvas.width = cols * this.cellW * dpr
    this.canvas.height = this.rows * this.cellH * dpr
    this.canvas.style.width = `${cols * this.cellW}px`
    this.canvas.style.height = `${this.rows * this.cellH}px`
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    this.ctx.font = `${fontSize}px ui-monospace, Menlo, monospace`
    this.ctx.textBaseline = 'top'
  }

  private sampleFrom(source: CanvasImageSource) {
    const { cols } = this.opts
    this.sctx.clearRect(0, 0, cols, this.rows)
    this.sctx.drawImage(source, 0, 0, cols, this.rows)
    const data = this.sctx.getImageData(0, 0, cols, this.rows).data
    const n = cols * this.rows
    this.cells = new Array(n)
    for (let i = 0; i < n; i++) {
      const r = data[i * 4]!, g = data[i * 4 + 1]!, b = data[i * 4 + 2]!, a = data[i * 4 + 3]!
      this.cells[i] = {
        lum: ((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255) * (a / 255),
        delay: Math.random() * 1400,
        seed: (Math.random() * 94) | 0,
      }
    }
  }

  private restart() {
    cancelAnimationFrame(this.raf)
    this.t0 = performance.now()
    const loop = (now: number) => {
      this.draw(now)
      if (!this.reduced) this.raf = requestAnimationFrame(loop)
    }
    this.raf = requestAnimationFrame(loop)
  }

  private draw(now: number) {
    if (!this.cells) return
    const { cols, charset, ink, background } = this.opts
    const t = now - this.t0
    const ctx = this.ctx
    const ramp = charset.length - 1
    const W = cols * this.cellW
    const H = this.rows * this.cellH

    if (background === 'transparent') ctx.clearRect(0, 0, W, H)
    else { ctx.fillStyle = background; ctx.fillRect(0, 0, W, H) }

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cell = this.cells[y * cols + x]!
        let lum = cell.lum
        let ch: string | null = null
        let alpha = 1

        if (!this.reduced && t < cell.delay + 350) {
          // dissolve phase
          if (t < cell.delay) {
            if (cell.lum < 0.05) continue
            ch = charset[1 + ((cell.seed + ((t / 55) | 0)) % ramp)]!
            alpha = 0.3
          } else {
            alpha = 0.3 + 0.7 * ((t - cell.delay) / 350)
          }
        } else if (!this.reduced) {
          // idle shimmer
          lum = lum * (0.84 + 0.16 * Math.sin(x * 0.3 + y * 0.12 + t / 380))
        }

        if (lum < 0.04 && !ch) continue
        if (!ch) ch = charset[Math.min(ramp, Math.round(lum * ramp))]!
        if (ch === ' ') continue

        ctx.fillStyle = alpha === 1 ? ink : this.inkAlpha(ink, alpha)
        ctx.fillText(ch, x * this.cellW, y * this.cellH)
      }
    }
  }

  private inkAlpha(hex: string, a: number) {
    const n = parseInt(hex.slice(1), 16)
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
  }
}
