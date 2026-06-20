import { onMounted, type Ref } from 'vue'

/** Panel tilt / scene rotation removed — kept as no-op for stable scroll. */
export function useScroll3D(
  _sceneRef: Ref<HTMLElement | null>,
  _panelSelector: string,
  _reducedMotion: Ref<boolean>,
  _liteMode?: Ref<boolean>,
) {
  /* intentionally empty */
}

export function usePanelReveal(selector: string) {
  onMounted(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement
            el.classList.add('visible')
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
