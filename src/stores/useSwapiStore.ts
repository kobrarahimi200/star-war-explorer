import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getPeople } from '@/services/swapi'
import type { Person } from '@/components/types/swapiTypes'

interface SwapiPerson {
  name: string
  height: string
  mass: string
  gender: string
  homeworld: string
  starships: string[]
}

export const useSwapiStore = defineStore('swapi', () => {
  const people = ref<Person[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const allPeople = computed(() => people.value)

  const fetchPeople = async () => {
    if (people.value.length > 0 || isLoading.value) return

    isLoading.value = true
    error.value = null

    try {
      const response = await getPeople() as { results?: SwapiPerson[] } | SwapiPerson[]
      const results = Array.isArray(response) ? response : response.results ?? []

      people.value = results.map((person, index): Person => ({
        id: index + 1,
        name: person.name,
        height: person.height,
        mass: person.mass,
        gender: person.gender,
        homeworld: person.homeworld,
        starships: person.starships,
      }))
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to load people'
    } finally {
      isLoading.value = false
    }
  }

  return {
    allPeople,
    isLoading,
    error,
    fetchPeople,
  }
})
