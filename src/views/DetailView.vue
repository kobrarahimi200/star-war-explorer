<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useSwapiStore } from '@/stores/useSwapiStore'
import type { Film, Person } from '@/components/types/swapiTypes'

const route = useRoute()
const store = useSwapiStore()

const character = computed<Person | undefined>(() =>
  store.allPeople.find((person) => person.id === String(route.params.id)),
)

const relatedFilms = computed<Film[]>(() => {
  const filmUrls = new Set(character.value?.films ?? [])
  return store.apiFilms.filter((film) => filmUrls.has(film.id))
})

onMounted(() => {
  store.fetchInitialData()
})
</script>

<template>
  <main class="detail-view">
    <RouterLink :to="{ name: 'overview', query: route.query }" class="back-link">
      ← Back to Overview
    </RouterLink>

    <section v-if="store.isLoading" class="detail-card">
      <p>Loading character...</p>
    </section>

    <section v-else-if="!character" class="detail-card">
      <h2>Character not found</h2>
      <RouterLink :to="{ name: 'overview', query: route.query }" class="button-link">
        Back to Overview
      </RouterLink>
    </section>

    <template v-else>
      <section class="detail-card">
        <h1>{{ character.name }}</h1>
        <dl class="details-grid">
          <div><dt>Height</dt><dd>{{ character.height }}</dd></div>
          <div><dt>Mass</dt><dd>{{ character.mass }}</dd></div>
          <div><dt>Gender</dt><dd>{{ character.gender }}</dd></div>
          <div><dt>Birth Year</dt><dd>{{ character.birth_year }}</dd></div>
        </dl>
      </section>

      <section class="films-section">
        <h2>Films</h2>
        <div v-if="relatedFilms.length" class="films-grid">
          <article v-for="film in relatedFilms" :key="film.id" class="film-card">
            <h3>{{ film.title }}</h3>
            <p>Episode {{ film.episode_id }}</p>
            <p>Release date: {{ film.release_date }}</p>
            <p>Director: {{ film.director }}</p>
          </article>
        </div>
        <p v-else class="muted">No related films found.</p>
      </section>
    </template>
  </main>
</template>

<style scoped>
.detail-view { display: grid; gap: 1.25rem; }
.back-link, .button-link { color: #1d4ed8; text-decoration: none; font-weight: 600; }
.detail-card, .film-card {
  padding: 1.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.04);
}
.detail-card h1, .detail-card h2, .film-card h3 { margin-top: 0; }
.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
}
dt { color: #6b7280; font-size: 0.875rem; }
dd { margin: 0.25rem 0 0; font-weight: 600; }
.films-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}
.film-card p, .muted { color: #4b5563; }
</style>
