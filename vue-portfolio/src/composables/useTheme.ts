import { onMounted, ref } from 'vue'

export function useTheme() {
  const theme = ref<'dark' | 'light'>('dark')

  function applyTheme(t: 'dark' | 'light') {
    theme.value = t
    document.documentElement.setAttribute('data-theme', t)
    try { localStorage.setItem('theme', t) } catch { /* noop */ }
  }

  function toggleTheme() {
    applyTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  onMounted(() => {
    try {
      const saved = localStorage.getItem('theme') as 'dark' | 'light' | null
      applyTheme(saved === 'light' ? 'light' : 'dark')
    } catch {
      applyTheme('dark')
    }
  })

  return { theme, toggleTheme }
}
