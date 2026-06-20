<script setup lang="ts">
import { ref } from 'vue'
import SectionPanel from './SectionPanel.vue'

const email = 'jeremy@jeremyxiang.com'
const val = ref(email)
const arr = ref('→')
const copied = ref(false)

async function copyEmail(e: Event) {
  e.preventDefault()
  try {
    await navigator.clipboard.writeText(email)
    val.value = 'copied ✓'
    arr.value = ''
    copied.value = true
    setTimeout(() => {
      val.value = email
      arr.value = '→'
      copied.value = false
    }, 1800)
  } catch {
    window.location.href = `mailto:${email}`
  }
}
</script>

<template>
  <SectionPanel id="contact">
    <h2 class="section-label">contact</h2>
    <p class="contact-intro">
      <span class="status-dot" />
      open to internships and conversations with anyone working on interesting problems. fastest way to reach me is email.
    </p>
    <div class="contact-list">
      <a href="#" class="contact-item" @click="copyEmail">
        <span class="c-lbl">email</span>
        <span class="c-val" :style="copied ? { color: '#22c55e' } : {}">{{ val }}</span>
        <span class="c-arr">{{ arr }}</span>
      </a>
      <a href="https://www.linkedin.com/in/jeremy-xiang/" target="_blank" rel="noopener" class="contact-item">
        <span class="c-lbl">linkedin</span>
        <span class="c-val">jeremy-xiang</span>
        <span class="c-arr">→</span>
      </a>
      <a href="/Jeremy_Xiang_Resume.pdf" target="_blank" rel="noopener" class="contact-item">
        <span class="c-lbl">resume</span>
        <span class="c-val">download pdf</span>
        <span class="c-arr">→</span>
      </a>
    </div>
  </SectionPanel>
</template>
