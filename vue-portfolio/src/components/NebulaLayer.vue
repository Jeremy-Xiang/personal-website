<script setup lang="ts">
// Milky-way band + nebula patches — pure CSS, sits between the ambient blobs
// and the starfield canvas. Fades out in light theme and lite mode.
</script>

<template>
  <div class="nebula" aria-hidden="true">
    <div class="mw-band" />
    <div class="neb-patch np1" />
    <div class="neb-patch np2" />
    <div class="neb-patch np3" />
  </div>
</template>

<style scoped>
.nebula { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }

.mw-band {
  position: absolute; left: -20%; top: 30%; width: 140%; height: 34%;
  transform: rotate(-24deg);
  background:
    linear-gradient(180deg, transparent,
      rgba(150, 170, 230, 0.030) 30%, rgba(190, 200, 245, 0.048) 50%,
      rgba(150, 170, 230, 0.030) 70%, transparent),
    linear-gradient(90deg, transparent 4%, rgba(120, 140, 210, 0.02) 30%,
      rgba(120, 140, 210, 0.02) 70%, transparent 96%);
  filter: blur(26px);
  animation: mwBreathe 26s ease-in-out infinite alternate;
}
@keyframes mwBreathe {
  from { opacity: 0.75; transform: rotate(-24deg) scaleY(1); }
  to   { opacity: 1.1;  transform: rotate(-24deg) scaleY(1.12); }
}

.neb-patch { position: absolute; border-radius: 50%; filter: blur(70px); }
.np1 {
  width: 46vw; height: 30vh; left: 6%; top: 12%;
  background: radial-gradient(closest-side, rgba(64, 82, 190, 0.075), transparent 72%);
  animation: npDrift1 38s ease-in-out infinite alternate;
}
.np2 {
  width: 38vw; height: 34vh; right: 2%; top: 42%;
  background: radial-gradient(closest-side, rgba(110, 58, 168, 0.06), transparent 70%);
  animation: npDrift2 46s ease-in-out infinite alternate;
}
.np3 {
  width: 30vw; height: 26vh; left: 34%; bottom: 4%;
  background: radial-gradient(closest-side, rgba(24, 110, 150, 0.055), transparent 72%);
  animation: npDrift3 32s ease-in-out infinite alternate;
}
@keyframes npDrift1 { to { transform: translate(5vw, 3vh) scale(1.08); } }
@keyframes npDrift2 { to { transform: translate(-4vw, -3vh) scale(1.1); } }
@keyframes npDrift3 { to { transform: translate(3vw, -2vh) scale(1.05); } }

@media (prefers-reduced-motion: reduce) {
  .mw-band, .neb-patch { animation: none; }
}
</style>
