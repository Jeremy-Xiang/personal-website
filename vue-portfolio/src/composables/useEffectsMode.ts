import { inject, onMounted, ref, type InjectionKey, type Ref } from 'vue'

export const effectsModeKey: InjectionKey<Ref<boolean>> = Symbol('effectsMode')

export function useEffectsModeProvider() {
  const liteMode = ref(false)

  onMounted(() => {
    try {
      liteMode.value = localStorage.getItem('liteMode') === '1'
    } catch { /* noop */ }
    document.documentElement.classList.toggle('lite-mode', liteMode.value)
  })

  function toggleLiteMode() {
    liteMode.value = !liteMode.value
    document.documentElement.classList.toggle('lite-mode', liteMode.value)
    try {
      localStorage.setItem('liteMode', liteMode.value ? '1' : '0')
    } catch { /* noop */ }
  }

  return { liteMode, toggleLiteMode }
}

export function useEffectsMode() {
  const liteMode = inject(effectsModeKey, ref(false))
  return { liteMode }
}
