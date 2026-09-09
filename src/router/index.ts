
import { createRouter, createWebHistory } from 'vue-router'
import DetailView from '@/views/DetailView.vue'
import PeopleView from '@/views/PeopleView.vue'
import FilmsView from '@/views/FilmsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'overview', component: PeopleView },
    { path: '/films', name: 'films', component: FilmsView },
    { path: '/people/:id', name: 'person-detail', component: DetailView },
  ],
})

export default router
