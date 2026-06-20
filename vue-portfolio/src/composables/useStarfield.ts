import { onMounted, onUnmounted, ref, type Ref } from 'vue'

interface Star3D {
  ox: number
  oy: number
  oz: number
  size: number
  bright: boolean
  twinkle: number
  twinkleSpeed: number
  baseAlpha: number
}

function rand(a: number, b: number) {
  return a + Math.random() * (b - a)
}

export function useStarfield(
  canvasRef: Ref<HTMLCanvasElement | null>,
  reducedMotion: Ref<boolean>,
  theme: Ref<'dark' | 'light'>,
  liteMode?: Ref<boolean>,
) {
  let W = 0
  let H = 0
  let ctx: CanvasRenderingContext2D | null = null
  const stars: Star3D[] = []
  let scrollRatio = 0
  let targetScrollRatio = 0
  let mouseNX = 0
  let mouseNY = 0
  let rafId = 0

  // Shooting star state
  let sx = 0
  let sy = 0
  let sang = 0
  let sprog = 1
  let slen = 0
  let shootTimer = 0

  function initStars() {
    stars.length = 0
    for (let i = 0; i < 1200; i++) {
      const theta = rand(0, Math.PI * 2)
      const phi = Math.acos(rand(-1, 1))
      stars.push({
        ox: Math.sin(phi) * Math.cos(theta) * 3.5,
        oy: Math.sin(phi) * Math.sin(theta) * 3.5,
        oz: Math.cos(phi) * 3.5,
        size: rand(0.4, 1.8),
        bright: Math.random() > 0.8,
        twinkle: rand(0, Math.PI * 2),
        twinkleSpeed: rand(0.01, 0.04),
        baseAlpha: rand(0.65, 1.0),
      })
    }
  }

  function resize() {
    const canvas = canvasRef.value
    if (!canvas) return
    W = canvas.width = window.innerWidth
    H = canvas.height = window.innerHeight
  }

  function projectStar(s: Star3D) {
    let x = s.ox
    let y = s.oy
    let z = s.oz

    const cosX = Math.cos(mouseNY * 0.12)
    const sinX = Math.sin(mouseNY * 0.12)
    const cosY = Math.cos(mouseNX * 0.08)
    const sinY = Math.sin(mouseNX * 0.08)
    let ny = y * cosX - z * sinX
    let nz = y * sinX + z * cosX
    let nx = x * cosY + nz * sinY
    nz = -x * sinY + nz * cosY
    x = nx
    y = ny
    z = nz

    const scrollTiltX = scrollRatio * 0.25
    const camOffsetZ = scrollRatio * 1.8
    const ct = Math.cos(scrollTiltX)
    const st = Math.sin(scrollTiltX)
    const ry = y * ct - z * st
    const rz = y * st + z * ct
    y = ry
    z = rz

    const camPos = -1 + camOffsetZ
    let dz = z - camPos
    if (dz <= 0.01) {
      s.oz = camPos + 3.5 + Math.random() * 2.5
      dz = s.oz - camPos
    }

    const fov = 480
    return {
      sx: (x / dz) * fov + W / 2,
      sy: (y / dz) * fov + H / 2,
      depth: 1 - Math.min(1, dz / 5),
    }
  }

  function drawShootingStar() {
    if (!ctx || sprog >= 1) return
    sprog = Math.min(1, sprog + 0.018)
    const t = sprog < 0.5 ? 2 * sprog * sprog : 1 - Math.pow(-2 * sprog + 2, 2) / 2
    const cx = sx + Math.cos(sang) * t * (slen + 80)
    const cy = sy + Math.sin(sang) * t * (slen + 80)
    const tx = cx - Math.cos(sang) * slen * Math.min(1, sprog * 3)
    const ty = cy - Math.sin(sang) * slen * Math.min(1, sprog * 3)
    const a = sprog < 0.7 ? 1 : 1 - (sprog - 0.7) / 0.3
    const g = ctx.createLinearGradient(tx, ty, cx, cy)
    g.addColorStop(0, 'rgba(255,255,255,0)')
    g.addColorStop(0.6, `rgba(200,220,255,${a * 0.55})`)
    g.addColorStop(1, `rgba(255,255,255,${a})`)
    ctx.beginPath()
    ctx.moveTo(tx, ty)
    ctx.lineTo(cx, cy)
    ctx.strokeStyle = g
    ctx.lineWidth = 1.5
    ctx.shadowBlur = 8
    ctx.shadowColor = `rgba(180,210,255,${a * 0.8})`
    ctx.stroke()
    ctx.shadowBlur = 0
    ctx.beginPath()
    ctx.arc(cx, cy, 2.2, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255,255,255,${a})`
    ctx.fill()
  }

  function launchShootingStar() {
    if (Math.random() < 0.6) {
      sx = Math.random() * W
      sy = 0
    } else {
      sx = 0
      sy = Math.random() * H * 0.5
    }
    sang = Math.PI / 5 + Math.random() * Math.PI / 8
    slen = 180 + Math.random() * 140
    sprog = 0
    shootTimer = window.setTimeout(launchShootingStar, 20000 + Math.random() * 25000)
  }

  function render() {
    if (!ctx) return
    const dimmed = liteMode?.value
    scrollRatio += (targetScrollRatio - scrollRatio) * 0.06
    const light = theme.value === 'light'
    ctx.clearRect(0, 0, W, H)

    for (const s of stars) {
      const proj = projectStar(s)
      if (proj.sx < -50 || proj.sx > W + 50 || proj.sy < -50 || proj.sy > H + 50) continue

      s.twinkle += s.twinkleSpeed
      const twinkFactor = 0.5 + 0.5 * Math.sin(s.twinkle)
      const alpha = s.baseAlpha * proj.depth * twinkFactor * (dimmed ? 0.75 : 1)
      const size = s.size * (0.4 + proj.depth * 1.2)

      if (light) {
        ctx.fillStyle = `rgba(20,40,120,${alpha * 0.7})`
      } else if (s.bright) {
        ctx.fillStyle = `rgba(220,230,255,${alpha})`
      } else {
        ctx.fillStyle = `rgba(180,200,255,${alpha * 0.7})`
      }

      if (s.bright && proj.depth > 0.6 && !light) {
        ctx.shadowBlur = size * 4
        ctx.shadowColor = `rgba(110,143,255,${alpha * 0.5})`
      }

      ctx.beginPath()
      ctx.arc(proj.sx, proj.sy, Math.max(0.3, size), 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
    }

    const speed = Math.abs(targetScrollRatio - scrollRatio + 0.001)
    if (speed > 0.003) {
      const streakAlpha = Math.min(speed * 30, 0.4)
      for (let i = 0; i < 8; i++) {
        const s = stars[i * 7]
        if (!s) continue
        const proj = projectStar(s)
        const len = speed * 800
        const grad = ctx.createLinearGradient(proj.sx, proj.sy, proj.sx, proj.sy - len)
        grad.addColorStop(0, `rgba(110,143,255,${streakAlpha})`)
        grad.addColorStop(1, 'rgba(110,143,255,0)')
        ctx.beginPath()
        ctx.moveTo(proj.sx, proj.sy)
        ctx.lineTo(proj.sx, proj.sy - len)
        ctx.strokeStyle = grad
        ctx.lineWidth = 0.7
        ctx.stroke()
      }
    }

    drawShootingStar()
  }

  function loop() {
    if (reducedMotion.value) return
    render()
    rafId = requestAnimationFrame(loop)
  }

  function onScroll() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    targetScrollRatio = maxScroll > 0 ? window.scrollY / maxScroll : 0
  }

  function onMouseMove(e: MouseEvent) {
    mouseNX = (e.clientX / window.innerWidth - 0.5) * 2
    mouseNY = (e.clientY / window.innerHeight - 0.5) * 2
  }

  onMounted(() => {
    const canvas = canvasRef.value
    if (!canvas) return
    ctx = canvas.getContext('2d')
    initStars()
    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    onScroll()
    if (!reducedMotion.value) {
      rafId = requestAnimationFrame(loop)
      shootTimer = window.setTimeout(launchShootingStar, 8000 + Math.random() * 12000)
    }
  })

  onUnmounted(() => {
    cancelAnimationFrame(rafId)
    clearTimeout(shootTimer)
    window.removeEventListener('resize', resize)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('mousemove', onMouseMove)
  })

  return { scrollProgress: ref(0) }
}

export function useScrollProgress() {
  const progress = ref(0)

  function update() {
    const maxS = document.documentElement.scrollHeight - window.innerHeight
    progress.value = maxS > 0 ? (window.scrollY / maxS) * 100 : 0
  }

  onMounted(() => {
    update()
    window.addEventListener('scroll', update, { passive: true })
  })

  onUnmounted(() => window.removeEventListener('scroll', update))

  return { progress }
}
