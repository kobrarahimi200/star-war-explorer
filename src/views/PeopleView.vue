<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import PersonCard from '@/components/PersonCard.vue'
import PersonModal from '@/components/PersonModal.vue'
import {useSwapiStore} from '@/stores/useSwapiStore'
import type {PeopleQueryParam, Person} from '@/types/swapi'
import {readPeopleQuery, updatePeopleQuery} from './peopleQuery'

const store = useSwapiStore()
const route = useRoute()
const router = useRouter()
const searchQuery = computed<string>(() => readPeopleQuery(route.query, 'q', ''))
const genderFilter = computed<string>(() => readPeopleQuery(route.query, 'gender', 'all'))
const sortOption = computed<string>(() => readPeopleQuery(route.query, 'sort', 'name-asc'))
const showFavoritesOnly = computed<boolean>(() => route.query.favorites === 'true')
const isModalOpen = ref(false)
const personToEdit = ref<Person | null>(null)

const updateQuery = (param: PeopleQueryParam, value: string | boolean): void => {
  router.replace({query: updatePeopleQuery(route.query, param, value)})
}

const filteredPeople = computed<Person[]>(() => {
  const term = searchQuery.value.trim().toLowerCase()
  const source = showFavoritesOnly.value ? store.favoritePeople : store.allPeople
  const result = source.filter((person) =>
      (!term || person.name.toLowerCase().includes(term)) &&
      (genderFilter.value === 'all' || person.gender.toLowerCase() === genderFilter.value),
  )

  return [...result].sort((a, b) => {
    if (sortOption.value === 'name-desc') return b.name.localeCompare(a.name)
    if (sortOption.value === 'height-asc' || sortOption.value === 'height-desc') {
      const difference = Number.parseInt(a.height, 10) - Number.parseInt(b.height, 10)
      return sortOption.value === 'height-desc' ? -difference : difference
    }
    return a.name.localeCompare(b.name)
  })
})

const clearFilters = (): void => {
  router.replace({
    query: {...route.query, q: undefined, gender: undefined, sort: undefined, favorites: undefined},
  })
}
const openCreateModal = (): void => {
  personToEdit.value = null;
  isModalOpen.value = true
}
const openEditModal = (person: Person): void => {
  personToEdit.value = person;
  isModalOpen.value = true
}
const handleDelete = (id: string): void => {
  if (confirm('Delete this character?')) store.deletePerson(id)
}

onMounted(() => store.fetchPeople())
</script>

<template>
  <main>
    <div class="my-6 flex flex-wrap items-center justify-between gap-4">
      <div class="flex flex-1 flex-wrap items-center gap-3">
        <input
            :value="searchQuery"
            type="search"
            placeholder="Search people..."
            class="min-w-56 flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            @input="updateQuery('q', ($event.target as HTMLInputElement).value)"
        />
        <select
            :value="genderFilter"
            class="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            @change="updateQuery('gender', ($event.target as HTMLSelectElement).value)"
        >
          <option value="all">All genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="n/a">N/A</option>
        </select>
        <select
            :value="sortOption"
            class="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            @change="updateQuery('sort', ($event.target as HTMLSelectElement).value)"
        >
          <option value="name-asc">Name A → Z</option>
          <option value="name-desc">Name Z → A</option>
          <option value="height-asc">Height ↑</option>
          <option value="height-desc">Height ↓</option>
        </select>
        <button class="px-3 py-2 text-sm text-gray-600 hover:text-gray-900" @click="clearFilters">Clear</button>
      </div>
      <button
          class="rounded-lg bg-yellow-500 px-3 py-2 text-sm font-semibold text-black shadow-sm transition hover:bg-yellow-600"
          @click="openCreateModal"
      >
        Add Character
      </button>
    </div>

    <div class="mb-4 flex items-center justify-between">
      <h1 class="text-3xl font-extrabold text-gray-900">People</h1>
      <span class="text-sm text-gray-500">{{ filteredPeople.length }} results</span>
    </div>

    <p v-if="showFavoritesOnly" class="mb-4 text-sm font-medium text-yellow-700">Showing favorites only</p>
    <p v-if="store.isLoading" class="rounded-xl bg-white p-6 text-gray-500 shadow-sm">Loading people...</p>
    <p v-else-if="store.error" class="rounded-xl bg-white p-6 text-red-600 shadow-sm">{{ store.error }}</p>
    <section v-else-if="filteredPeople.length" class="my-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      <PersonCard
          v-for="person in filteredPeople"
          :key="person.id"
          :person="person"
          @edit="openEditModal"
          @delete="handleDelete"
      />
    </section>
    <p v-else class="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
      No people found.
    </p>

    <PersonModal :is-open="isModalOpen" :person-to-edit="personToEdit" @close="isModalOpen = false"/>

    <div
        v-if="store.lastDeleted"
        class="fixed bottom-6 right-6 z-50 flex items-center gap-4 rounded-lg bg-gray-900 px-4 py-3 text-white shadow-lg dark:bg-gray-100 dark:text-gray-900"
        role="status"
    >
      <span>{{ store.lastDeleted.name }} deleted.</span>
      <button
          type="button"
          class="font-semibold text-yellow-400 hover:text-yellow-300 dark:text-yellow-700 dark:hover:text-yellow-800"
          @click="store.undoDelete"
      >
        Undo
      </button>
    </div>
  </main>
</template>
