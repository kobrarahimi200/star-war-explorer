
import { createRouter, createWebHistory } from 'vue-router'
import DetailView from '@/views/DetailView.vue'
import PeopleView from '@/views/PeopleView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'overview', component: PeopleView },
    { path: '/people/:id', name: 'person-detail', component: DetailView },
  ],
})

export default router
