<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const showFavorites = (): void => {
  router.push({
    name: 'overview',
    query: { ...route.query, favorites: 'true' },
  })
}
</script>

<template>
  <header class="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
    <RouterLink to="/" class="text-xl font-bold tracking-wide text-yellow-400">
      Star Wars Explorer
    </RouterLink>

    <nav class="flex items-center gap-2" aria-label="Main navigation">
      <RouterLink
        to="/"
        :class="route.name === 'overview'
          ? 'px-3 py-1.5 bg-yellow-500 text-black font-semibold rounded-lg text-sm transition'
          : 'px-3 py-1.5 text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg text-sm transition'"
      >
        People
      </RouterLink>
      <RouterLink
        to="/films"
        :class="route.name === 'films'
          ? 'px-3 py-1.5 bg-yellow-500 text-black font-semibold rounded-lg text-sm transition'
          : 'px-3 py-1.5 text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg text-sm transition'"
      >
        Films
      </RouterLink>
      <button
        type="button"
        class="ml-4 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-yellow-400 border border-yellow-500/30 rounded-lg text-sm font-medium flex items-center gap-1"
        @click="showFavorites"
      >
        ⭐ Favorites
      </button>
    </nav>
  </header>
</template>
