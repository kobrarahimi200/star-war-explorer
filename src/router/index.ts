
import { createRouter, createWebHistory } from 'vue-router'
import DetailView from '@/views/DetailView.vue'
import FilmDetailView from '@/views/FilmDetailView.vue'
import PeopleView from '@/views/PeopleView.vue'
import FilmsView from '@/views/FilmsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'overview', component: PeopleView },
    { path: '/films', name: 'films', component: FilmsView },
    { path: '/people/:id', name: 'person-detail', component: DetailView },
    { path: '/films/:id', name: 'film-detail', component: FilmDetailView },
  ],
})

export default router
