import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import { vMag, vTilt } from './directives/interactions'
import './assets/main.css'
import './assets/enhancements.css'
import './assets/light-mode.css'
import './assets/thesis.css'

createApp(App).use(router).directive('mag', vMag).directive('tilt', vTilt).mount('#app')
