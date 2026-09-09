<script setup lang="ts">
import {useRoute} from 'vue-router'
import {computed} from 'vue'
import {useSwapiStore} from '@/stores/useSwapiStore'
import type {Person} from '@/types/swapi'

const props = defineProps<{
  person: Person
}>()

defineEmits<{
  edit: [person: Person]
  delete: [id: string]
}>()

const route = useRoute()
const store = useSwapiStore()
const isFavorite = computed<boolean>(() => store.favorites.includes(props.person.id))
const homeworld = computed<string>(() => {
  const value = props.person.homeworld
  if (!value.startsWith('http')) return value
  return value.split('/').filter(Boolean).at(-1) ?? 'Unknown'
})
</script>

<template>
  <article
      class="flex h-full flex-col justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
    <div>
      <h3 class="mb-1 text-lg font-bold text-gray-900 dark:text-white">{{ person.name }}</h3>
      <div class="mb-4 space-y-1 text-xs text-gray-500 dark:text-gray-400">
        <p>{{ person.gender }} · {{ person.height }}</p>
        <p>Birth year: {{ person.birth_year }}</p>
        <p>Homeworld: {{ homeworld }}</p>
      </div>
    </div>

    <div class="mt-auto flex items-center justify-between border-t border-gray-100/50 pt-3 dark:border-gray-700/50">
      <div class="flex items-center gap-3">
        <button
            type="button"
            class="rounded-lg p-1.5 text-gray-400 transition hover:text-yellow-500"
            :class="{ active: isFavorite }"
            :aria-label="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
            @click="store.toggleFavorite(person.id)"
        >
          {{ isFavorite ? '⭐' : '☆' }}
        </button>
        <RouterLink
            :to="{ name: 'person-detail', params: { id: person.id }, query: route.query }"
            class="text-xs font-semibold text-yellow-600 hover:underline dark:text-yellow-400"
        >
          View Details
        </RouterLink>
      </div>
      <div class="flex items-center gap-2">
        <button
            type="button"
            class="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
            @click="$emit('edit', person)"
        >
          Edit
        </button>
        <button
            type="button"
            class="rounded-md bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 transition hover:bg-red-100 dark:bg-red-950/40"
            @click="$emit('delete', person.id)"
        >
          Delete
        </button>
      </div>
    </div>
  </article>
</template>
