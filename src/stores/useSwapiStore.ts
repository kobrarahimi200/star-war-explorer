import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getPeople } from '@/services/swapi'
import type { Person } from '@/components/types/swapiTypes'

interface SwapiPerson {
  name: string
  height: string
  mass: string
  gender: string
  birth_year: string
  homeworld: string
  starships: string[]
}

const LOCAL_PEOPLE_KEY = 'swapi_local_people'
const DELETED_IDS_KEY = 'swapi_deleted_ids'

export const useSwapiStore = defineStore('swapi', () => {
  const apiPeople = ref<Person[]>([])
  const localPeople = ref<Person[]>(readStorage<Person[]>(LOCAL_PEOPLE_KEY, []))
  const deletedIds = ref<string[]>(readStorage<string[]>(DELETED_IDS_KEY, []))
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const allPeople = computed<Person[]>(() => {
    const merged = new Map<string, Person>()

    apiPeople.value.forEach((person) => merged.set(person.id, person))
    localPeople.value.forEach((person) => merged.set(person.id, person))

    return [...merged.values()].filter((person) => !deletedIds.value.includes(person.id))
  })

  const persistLocalState = () => {
    localStorage.setItem(LOCAL_PEOPLE_KEY, JSON.stringify(localPeople.value))
    localStorage.setItem(DELETED_IDS_KEY, JSON.stringify(deletedIds.value))
  }

  const fetchPeople = async () => {
    if (apiPeople.value.length > 0 || isLoading.value) return

    isLoading.value = true
    error.value = null

    try {
      const response = await getPeople() as { results?: SwapiPerson[] } | SwapiPerson[]
      const results = Array.isArray(response) ? response : response.results ?? []

      apiPeople.value = results.map((person, index): Person => ({
        id: String(index + 1),
        name: person.name,
        height: person.height,
        mass: person.mass,
        gender: person.gender,
        birth_year: person.birth_year,
        homeworld: person.homeworld,
        starships: person.starships,
      }))
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to load people'
    } finally {
      isLoading.value = false
    }
  }

  const savePerson = (data: Partial<Person> & { id?: string }) => {
    const id = data.id ?? `custom_${Date.now()}`
    const person: Person = {
      id,
      name: data.name?.trim() || 'Unknown',
      height: data.height?.trim() || 'unknown',
      mass: data.mass?.trim() || 'unknown',
      gender: data.gender?.trim() || 'unknown',
      birth_year: data.birth_year?.trim() || 'unknown',
      homeworld: data.homeworld || 'unknown',
      starships: data.starships || [],
      isCustom: true,
    }

    const index = localPeople.value.findIndex((item) => item.id === id)
    if (index === -1) {
      localPeople.value.push(person)
    } else {
      localPeople.value[index] = person
    }

    deletedIds.value = deletedIds.value.filter((deletedId) => deletedId !== id)
    persistLocalState()
  }

  const deletePerson = (id: string) => {
    if (!deletedIds.value.includes(id)) {
      deletedIds.value.push(id)
    }

    localPeople.value = localPeople.value.filter((person) => person.id !== id)
    persistLocalState()
  }

  return {
    allPeople,
    localPeople,
    deletedIds,
    isLoading,
    error,
    fetchPeople,
    savePerson,
    deletePerson,
  }
})

function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) as T : fallback
  } catch {
    return fallback
  }
}
