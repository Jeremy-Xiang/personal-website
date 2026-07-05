import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './pages/HomePage.vue'
import ThesisPage from './pages/ThesisPage.vue'
import PortfolioPage from './pages/PortfolioPage.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/thesis', name: 'thesis', component: ThesisPage },
    { path: '/thesis.html', redirect: '/thesis' },
    { path: '/portfolio', name: 'portfolio', component: PortfolioPage },
    { path: '/portfolio.html', redirect: '/portfolio' },
  ],
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})
