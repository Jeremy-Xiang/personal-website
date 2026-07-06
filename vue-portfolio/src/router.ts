import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './pages/HomePage.vue'
import ThesisPage from './pages/ThesisPage.vue'
import InvestingPage from './pages/InvestingPage.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/thesis', name: 'thesis', component: ThesisPage },
    { path: '/thesis.html', redirect: '/thesis' },
    { path: '/investing', name: 'investing', component: InvestingPage },
    { path: '/portfolio', redirect: '/investing' },
    { path: '/investing.html', redirect: '/investing' },
    { path: '/portfolio.html', redirect: '/investing' },
    { path: '/projects', redirect: { path: '/', hash: '#projects' } },
  ],
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})
