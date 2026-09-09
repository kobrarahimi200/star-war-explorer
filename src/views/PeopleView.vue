<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import PersonCard from '@/components/PersonCard.vue'
import { useSwapiStore } from '@/stores/useSwapiStore'

const store = useSwapiStore()

const people = computed(() => store.allPeople)

const search = ref('')
const gender = ref('all')

const filteredPeople = computed(() => {
  const searchTerm = search.value.trim().toLowerCase()

  return people.value.filter((person) => {
    const matchesSearch =
        !searchTerm ||
        person.name.toLowerCase().includes(searchTerm)

    const matchesGender =
        gender.value === 'all' ||
        person.gender.toLowerCase() === gender.value

    return matchesSearch && matchesGender
  })
})

const clearFilters = () => {
  search.value = ''
  gender.value = 'all'
}

onMounted(() => {
  store.fetchPeople()
})
</script>
<template>
  <main class="people-view">
    <section class="filters">
      <input
          v-model="search"
          type="text"
          placeholder="Search people..."
      />

      <button type="button" @click="search = search.trim()">
        Search
      </button>

      <button
          type="button"
          @click="clearFilters"
      >
        Clear
      </button>

      <select v-model="gender">
        <option value="all">All genders</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="n/a">N/A</option>
      </select>
    </section>

    <section class="people-header">
      <h2>People</h2>

      <span>
        {{ filteredPeople.length }} results
      </span>
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
      />
    </section>

    <section
        v-else
        class="empty-state"
    >
      <h3>No people found</h3>
      <p>Try changing your search or filter.</p>
    </section>
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
