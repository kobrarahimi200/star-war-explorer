<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PersonCard from '@/components/PersonCard.vue'
import PersonModal from '@/components/PersonModal.vue'
import { useSwapiStore } from '@/stores/useSwapiStore'
import type { Person } from '@/components/types/swapiTypes'

const store = useSwapiStore()
const route = useRoute()
const router = useRouter()

const search = ref('')
const gender = ref('all')
const sort = ref('name-asc')
const showFavoritesOnly = ref(false)
const isModalOpen = ref(false)
const personToEdit = ref<Person | null>(null)

const filteredPeople = computed<Person[]>(() => {
  const searchTerm = search.value.trim().toLowerCase()
  const basePeople = showFavoritesOnly.value
    ? store.favoritePeople
    : store.allPeople

  const filtered = basePeople.filter((person) => {
    const matchesSearch =
        !searchTerm ||
        person.name.toLowerCase().includes(searchTerm)

    const matchesGender =
        gender.value === 'all' ||
        person.gender.toLowerCase() === gender.value

    return matchesSearch && matchesGender
  })

  return [...filtered].sort((first, second) => {
    if (sort.value === 'name-desc') {
      return second.name.localeCompare(first.name)
    }
    return first.name.localeCompare(second.name)
  })
})

const clearFilters = () => {
  search.value = ''
  gender.value = 'all'
  sort.value = 'name-asc'
  router.replace({ query: { ...route.query, favorites: undefined } })
}

const openCreateModal = () => {
  personToEdit.value = null
  isModalOpen.value = true
}

const openEditModal = (person: Person) => {
  personToEdit.value = person
  isModalOpen.value = true
}

const handleDelete = (id: string) => {
  if (confirm('Delete this character?')) {
    store.deletePerson(id)
  }
}

onMounted(() => {
  showFavoritesOnly.value = route.query.favorites === 'true'
  store.fetchPeople()
})

watch(
  () => route.query.favorites,
  (value) => {
    showFavoritesOnly.value = value === 'true'
  },
)
</script>
<template>
  <main class="people-view">
      <section class="my-6 flex flex-wrap items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-3">
        <input
            v-model="search"
            type="text"
            placeholder="Search people..."
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none dark:bg-gray-800 dark:border-gray-700"
        />

        <select
          v-model="gender"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="all">All genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="n/a">N/A</option>
        </select>

        <select
          v-model="sort"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="name-asc">Name A → Z</option>
          <option value="name-desc">Name Z → A</option>
        </select>

        <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            @click="clearFilters"
        >
          Clear
        </button>
        </div>

      <button
          type="button"
            class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg shadow-sm transition"
            @click="openCreateModal"
        >
          Add Character
        </button>
      </section>

      <section class="mb-4 flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">People</h2>
        <span class="text-sm text-gray-500">{{ filteredPeople.length }} results</span>
      </section>

      <!-- The header Favorites action controls this state through ?favorites=true. -->
      <section v-if="showFavoritesOnly" class="mb-4 text-sm font-medium text-yellow-700">
        Showing favorites only
      </section>

    <section
        v-if="store.isLoading"
        class="empty-state"
    >
      <p>Loading people...</p>
    </section>

    <section
        v-else-if="store.error"
        class="empty-state"
    >
      <h3>Unable to load people</h3>
      <p>{{ store.error }}</p>
    </section>

    <section
        v-else-if="filteredPeople.length > 0"
        class="people-list"
    >
      <PersonCard
          v-for="person in filteredPeople"
          :key="person.id"
          :person="person"
          @edit="openEditModal"
          @delete="handleDelete"
      />
    </section>

    <section
        v-else
        class="empty-state"
    >
      <h3>No people found</h3>
      <p>Try changing your search or filter.</p>
    </section>

    <PersonModal
        :is-open="isModalOpen"
        :person-to-edit="personToEdit"
        @close="isModalOpen = false"
    />
  </main>
</template>
<style scoped>
.panel {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.04);
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.search-box {
  display: flex;
  gap: 0.75rem;
  flex: 1;
  min-width: 220px;
}

input {
  flex: 1;
  padding: 0.8rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  font-size: 1rem;
}

button {
  cursor: pointer;
}

.primary-button,
.ghost-button {
  border: none;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  font-weight: 600;
}

.primary-button {
  background: #111827;
  color: white;
}

.ghost-button {
  background: #f3f4f6;
  color: #111827;
}

.favorites-toggle {
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  background: white;
  color: #111827;
}

.favorites-toggle.active {
  border-color: #f59e0b;
  background: #fef3c7;
  color: #92400e;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.results-header h2 {
  margin: 0;
}

.results-header span {
  color: #6b7280;
}

.people-list {
  display: grid;
  gap: 0.9rem;
}

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
  font-size: 1.15rem;
}

.person-card p {
  margin: 0.2rem 0;
  color: #4b5563;
}

.favorite-button {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  color: #f59e0b;
}

.empty-state {
  padding: 1.5rem;
  background: #f9fafb;
  border: 1px dashed #d1d5db;
  border-radius: 0.75rem;
  color: #4b5563;
}
</style>
