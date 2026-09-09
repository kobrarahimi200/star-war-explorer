<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useSwapiStore } from '@/stores/useSwapiStore'
import type { Film, Person } from '@/types/swapi'

const route = useRoute()
const store = useSwapiStore()

const character = computed<Person | undefined>(() =>
  store.allPeople.find((person) => person.id === String(route.params.id)),
)

const relatedFilms = computed<Film[]>(() => {
  return store.getFilmsForPerson(character.value?.films ?? [])
})

const isFavorite = computed(() =>
  character.value ? store.favorites.includes(character.value.id) : false,
)

onMounted(() => {
  store.fetchInitialData()
})
</script>

<template>
  <main class="grid gap-5">
    <RouterLink
      :to="{ name: 'overview', query: route.query }"
      class="font-semibold text-blue-700 hover:underline"
    >
      ← Back to Overview
    </RouterLink>

    <section v-if="store.isLoading" class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <p>Loading character...</p>
    </section>

    <section v-else-if="!character" class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 class="mb-4 text-2xl font-bold">Character not found</h2>
      <RouterLink
        :to="{ name: 'overview', query: route.query }"
        class="font-semibold text-blue-700 hover:underline"
      >
        Back to Overview
      </RouterLink>
    </section>

    <template v-else>
      <section class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div class="mb-5 flex items-start justify-between gap-4">
          <h1 class="text-3xl font-extrabold">{{ character.name }}</h1>
        <button
          type="button"
          class="text-2xl text-yellow-500 transition hover:scale-110"
          :class="{ active: isFavorite }"
          :aria-label="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
          @click="store.toggleFavorite(character.id)"
        >
          {{ isFavorite ? '⭐' : '☆' }}
        </button>
        </div>
        <dl class="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div><dt class="text-sm text-gray-500">Height</dt><dd class="font-semibold">{{ character.height }}</dd></div>
          <div><dt class="text-sm text-gray-500">Mass</dt><dd class="font-semibold">{{ character.mass }}</dd></div>
          <div><dt class="text-sm text-gray-500">Gender</dt><dd class="font-semibold">{{ character.gender }}</dd></div>
          <div><dt class="text-sm text-gray-500">Birth Year</dt><dd class="font-semibold">{{ character.birth_year }}</dd></div>
        </dl>
      </section>

      <section>
        <h2 class="mb-4 text-2xl font-bold">Films</h2>
        <div v-if="relatedFilms.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="film in relatedFilms"
            :key="film.id"
            class="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <h3 class="mb-2 text-xl font-bold">{{ film.title }}</h3>
            <p class="text-sm text-gray-500">Episode {{ film.episode_id }}</p>
            <p class="text-sm text-gray-500">Release date: {{ film.release_date }}</p>
            <p class="text-sm text-gray-500">Director: {{ film.director }}</p>
          </article>
        </div>
        <p v-else class="text-gray-500">No related films found.</p>
      </section>
    </template>
  </main>
</template>
