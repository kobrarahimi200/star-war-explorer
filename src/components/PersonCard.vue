<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useSwapiStore } from '@/stores/useSwapiStore'
import type { Person } from '@/components/types/swapiTypes'

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

    <div class="card-actions">
      <button
        type="button"
        class="favorite-button"
        :class="{ active: isFavorite }"
        :aria-label="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
        @click="store.toggleFavorite(person.id)"
      >
        {{ isFavorite ? '⭐' : '☆' }}
      </button>
      <RouterLink
        :to="{ name: 'person-detail', params: { id: person.id }, query: route.query }"
        class="details-link"
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

<style scoped>
.person-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem 1.25rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.9rem;
}

.person-card h3 {
  margin: 0 0 0.35rem;
}

.person-card p {
  margin: 0.2rem 0;
  color: #4b5563;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.card-actions button {
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.4rem 0.7rem;
  cursor: pointer;
}

.details-link {
  padding: 0.4rem 0.7rem;
  color: #1d4ed8;
  text-decoration: none;
}

.favorite-button {
  border: 0 !important;
  color: #f59e0b;
  font-size: 1.35rem;
  padding: 0.25rem !important;
}

.delete-button {
  color: #b91c1c;
}
</style>
