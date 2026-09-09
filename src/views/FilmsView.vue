<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {RouterLink} from 'vue-router'
import {useSwapiStore} from '@/stores/useSwapiStore'
import type {Film} from '@/types/swapi'
import {getFilmCharacterPreview} from './filmRelations'

const store = useSwapiStore()
const search = ref('')

const films = computed<Film[]>(() => {
  const query = search.value.trim().toLowerCase()
  return store.apiFilms.filter((film) => film.title.toLowerCase().includes(query))
})

onMounted(() => {
  store.fetchInitialData()
})
</script>

<template>
  <main>
    <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-6">
      Films
    </h1>

    <div class="max-w-md mx-auto mb-8">
      <input
          v-model="search"
          type="search"
          placeholder="Search films..."
          class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
      />
    </div>

    <p v-if="store.isLoading">Loading films...</p>
    <p v-else-if="store.error">{{ store.error }}</p>

    <section v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <article
          v-for="film in films"
          :key="film.id"
          class="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition flex flex-col justify-between"
      >
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ film.title }}</h2>
        <p class="text-sm font-semibold text-yellow-600 dark:text-yellow-400 mb-1">
          Episode {{ film.episode_id }} · {{ film.release_date }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">Director: {{ film.director }}</p>
        <template v-for="preview in [getFilmCharacterPreview(film, store.allPeople)]" :key="film.id">
          <div class="mt-4 flex flex-wrap gap-2">
            <RouterLink
                v-for="person in preview.people"
                :key="person.id"
                :to="{ name: 'person-detail', params: { id: person.id } }"
                class="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-800 transition hover:bg-yellow-200"
            >
              {{ person.name }}
            </RouterLink>
            <span
                v-if="preview.remaining > 0"
                class="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600"
            >
            +{{ preview.remaining }} more
          </span>
          </div>
        </template>
      </article>
    </section>
  </main>
</template>
