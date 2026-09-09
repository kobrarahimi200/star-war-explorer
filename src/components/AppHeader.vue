<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const showFavorites = () => {
  router.push({
    name: 'overview',
    query: { ...route.query, favorites: 'true' },
  })
}
</script>

<template>
  <header class="flex items-center justify-between gap-4 bg-gray-900 px-6 py-4 text-white">
    <RouterLink to="/" class="text-xl font-bold">Star Wars Explorer</RouterLink>

    <nav class="flex flex-wrap items-center gap-2" aria-label="Main navigation">
      <RouterLink
        to="/"
        class="rounded-lg px-4 py-2 transition hover:bg-yellow-500 hover:text-black"
      >
        People
      </RouterLink>
      <button
        type="button"
        class="rounded-lg px-4 py-2 transition hover:bg-yellow-500 hover:text-black"
        @click="showFavorites"
      >
        ⭐ Favorites
      </button>
    </nav>
  </header>
</template>
