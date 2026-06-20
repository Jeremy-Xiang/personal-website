import { onMounted, ref } from 'vue'

export function useDeviceProfile() {
  const coarsePointer = ref(false)
  const lowPower = ref(false)

  onMounted(() => {
    coarsePointer.value = window.matchMedia('(pointer: coarse)').matches
      || window.matchMedia('(hover: none)').matches

    const nav = navigator as Navigator & { deviceMemory?: number }
    const lowMem = nav.deviceMemory !== undefined && nav.deviceMemory <= 4
    const lowCores = nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 4
    lowPower.value = lowMem || lowCores
  })

  return { coarsePointer, lowPower }
}

export function starCountForDevice(coarse: boolean, lowPower: boolean, reducedMotion: boolean): number {
  if (reducedMotion) return 0
  if (coarse) return 450
  if (lowPower) return 750
  return 1200
}
