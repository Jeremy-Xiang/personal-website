import { onMounted, onUnmounted, type Ref } from 'vue'

export function useScroll3D(
  sceneRef: Ref<HTMLElement | null>,
  panelSelector: string,
  reducedMotion: Ref<boolean>,
  liteMode?: Ref<boolean>,
) {
  let sceneMX = 0
  let sceneMY = 0
  let curSX = 0
  let curSY = 0

  function update3D() {
    if (reducedMotion.value || liteMode?.value) return
    const panels = document.querySelectorAll<HTMLElement>(panelSelector)
    const vh = window.innerHeight
    const scene = sceneRef.value

    curSX += (sceneMY * 1.8 - curSX) * 0.04
    curSY += (sceneMX * 2.2 - curSY) * 0.04
    if (scene) scene.style.transform = `rotateX(${curSX}deg) rotateY(${curSY}deg)`

    panels.forEach((panel) => {
      if (!panel.classList.contains('visible')) return
      const r = panel.getBoundingClientRect()
      const center = r.top + r.height * 0.5
      const norm = (center - vh * 0.5) / vh
      const focus = Math.max(0, 1 - Math.abs(norm) * 1.35)
      const hx = parseFloat(panel.dataset.hx || '0')
      const hy = parseFloat(panel.dataset.hy || '0')

      panel.style.setProperty('--rx', `${(norm * 14 + hy).toFixed(2)}deg`)
      panel.style.setProperty('--ry', `${(sceneMX * focus * 3 + hx).toFixed(2)}deg`)
      panel.style.setProperty('--tz', `${(focus * 55 - 12).toFixed(1)}px`)
      panel.style.setProperty('--sc', (0.92 + focus * 0.08).toFixed(3))
    })
  }

  function onMouseMove(e: MouseEvent) {
    sceneMX = (e.clientX / window.innerWidth - 0.5) * 2
    sceneMY = (e.clientY / window.innerHeight - 0.5) * 2
  }

  function bindPanelHover() {
    document.querySelectorAll<HTMLElement>(panelSelector).forEach((panel) => {
      panel.addEventListener('mousemove', (e) => {
        const r = panel.getBoundingClientRect()
        panel.dataset.hx = (((e.clientX - r.left) / r.width - 0.5) * 10).toFixed(2)
        panel.dataset.hy = (((e.clientY - r.top) / r.height - 0.5) * -8).toFixed(2)
      })
      panel.addEventListener('mouseleave', () => {
        panel.dataset.hx = '0'
        panel.dataset.hy = '0'
      })
    })
  }

  let rafId = 0
  function loop() {
    update3D()
    rafId = requestAnimationFrame(loop)
  }

  onMounted(() => {
    if (reducedMotion.value || liteMode?.value) return
    bindPanelHover()
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('scroll', update3D, { passive: true })
    rafId = requestAnimationFrame(loop)
  })

  onUnmounted(() => {
    cancelAnimationFrame(rafId)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('scroll', update3D)
  })
}

export function usePanelReveal(selector: string) {
  onMounted(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement
            el.classList.add('visible')
            el.style.setProperty('--tz', '-20px')
            el.style.setProperty('--sc', '0.94')
            obs.unobserve(el)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
    )
    document.querySelectorAll(selector).forEach((p) => obs.observe(p))
  })
}

export function useActiveNav(sectionIds: string[]) {
  onMounted(() => {
    const linkMap: Record<string, HTMLAnchorElement> = {}
    sectionIds.forEach((id) => {
      const a = document.querySelector<HTMLAnchorElement>(`.nav-links a[href="#${id}"]`)
      if (a) linkMap[id] = a
    })
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const a = linkMap[e.target.id]
          if (a) a.classList.toggle('nav-active', e.isIntersecting)
        })
      },
      { threshold: 0.25 },
    )
    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
  })
}

export function useKeyboardNav(map: Record<string, string>) {
  onMounted(() => {
    document.addEventListener('keydown', (e) => {
      const t = e.target as HTMLElement
      if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || e.metaKey || e.ctrlKey) return
      const id = map[e.key]
      if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  })
}

export function useTilt(selector: string, strength: number) {
  onMounted(() => {
    document.querySelectorAll<HTMLElement>(selector).forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width - 0.5
        const y = (e.clientY - r.top) / r.height - 0.5
        card.style.transform = `perspective(500px) rotateX(${-y * strength}deg) rotateY(${x * strength}deg) translateZ(8px)`
      })
      card.addEventListener('mouseleave', () => { card.style.transform = '' })
    })
  })
}
