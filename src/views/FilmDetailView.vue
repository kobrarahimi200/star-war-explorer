<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useSwapiStore } from '@/stores/useSwapiStore'
import type { Film, FilmRouteParams, Person } from '@/types/swapi'

const route = useRoute()
const router = useRouter()
const store = useSwapiStore()

const film = computed<Film | undefined>(() => {
  const id = decodeURIComponent(String((route.params as FilmRouteParams).id ?? '').trim())
  return store.apiFilms.find((item) => item.id === id)
})

const characters = computed<Person[]>(() => {
  const urls = new Set(film.value?.characters ?? [])
  return store.allPeople.filter((person) => person.url && urls.has(person.url))
})

onMounted(() => {
  store.fetchInitialData()
})
</script>

<template>
  <main class="grid gap-5">
    <button
      type="button"
      class="w-fit font-semibold text-blue-700 hover:underline"
      @click="router.back()"
    >
      ← Back
    </button>

    <section v-if="store.isLoading" class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      Loading film...
    </section>

    <section v-else-if="!film" class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h1 class="mb-4 text-2xl font-bold">Film not found</h1>
      <RouterLink to="/films" class="font-semibold text-blue-700 hover:underline">
        Back to Films
      </RouterLink>
    </section>

    <template v-else>
      <section class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h1 class="mb-5 text-3xl font-extrabold">{{ film.title }}</h1>
        <dl class="grid grid-cols-2 gap-4 sm:grid-cols-5">
          <div><dt class="text-sm text-gray-500">Episode</dt><dd class="font-semibold">{{ film.episode_id }}</dd></div>
          <div><dt class="text-sm text-gray-500">Director</dt><dd class="font-semibold">{{ film.director }}</dd></div>
          <div><dt class="text-sm text-gray-500">Producer</dt><dd class="font-semibold">{{ film.producer }}</dd></div>
          <div><dt class="text-sm text-gray-500">Release Date</dt><dd class="font-semibold">{{ film.release_date }}</dd></div>
        </dl>
        <p class="mt-6 whitespace-pre-line text-gray-700">{{ film.opening_crawl }}</p>
      </section>

      <section>
        <h2 class="mb-4 text-2xl font-bold">Appearing Characters</h2>
        <div v-if="characters.length" class="flex flex-wrap gap-2">
          <RouterLink
            v-for="person in characters"
            :key="person.id"
            :to="{ name: 'person-detail', params: { id: person.id } }"
            class="rounded-full bg-yellow-100 px-3 py-1.5 text-sm font-medium text-yellow-800 hover:bg-yellow-200"
          >
            {{ person.name }}
          </RouterLink>
        </div>
        <p v-else class="text-gray-500">No character relations found.</p>
      </section>
    </template>
  </main>
</template>
