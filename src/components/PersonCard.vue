<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useSwapiStore } from '@/stores/useSwapiStore'
import type { Person } from '@/types/swapi'

const props = defineProps<{
  person: Person
}>()

defineEmits<{
  edit: [person: Person]
  delete: [id: string]
}>()

const route = useRoute()
const store = useSwapiStore()
const isFavorite = computed(() => store.favorites.includes(props.person.id))
</script>

<template>
  <article class="person-card p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
    <div class="person-info">
      <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ person.name }}</h3>
      <div class="space-y-1 text-sm text-gray-500">
        <p>{{ person.gender }} · {{ person.height }}</p>
        <p>Birth year: {{ person.birth_year }}</p>
        <p>Homeworld: {{ person.homeworld }}</p>
      </div>
    </div>

    <div class="flex flex-wrap items-center justify-end gap-3">
      <button
        type="button"
        class="text-lg text-yellow-500 transition hover:scale-110"
        :class="{ active: isFavorite }"
        :aria-label="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
        @click="store.toggleFavorite(person.id)"
      >
        {{ isFavorite ? '⭐' : '☆' }}
      </button>
      <RouterLink
        :to="{ name: 'person-detail', params: { id: person.id }, query: route.query }"
        class="text-sm font-medium text-blue-600 hover:text-blue-800"
      >
        View Details
      </RouterLink>
      <button
        type="button"
        class="text-sm font-medium text-gray-600 hover:text-gray-900"
        @click="$emit('edit', person)"
      >
        Edit
      </button>
      <button
        type="button"
        class="text-sm font-medium text-red-500 hover:text-red-700"
        @click="$emit('delete', person.id)"
      >
        Delete
      </button>
    </div>
  </article>
</template>
