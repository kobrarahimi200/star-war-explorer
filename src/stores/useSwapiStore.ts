import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Film, Person } from '@/components/types/swapiTypes'

interface SwapiPerson {
  name: string
  height: string
  mass: string
  gender: string
  birth_year: string
  homeworld: string
  starships: string[]
  films: string[]
}

interface SwapiFilm extends Omit<Film, 'id'> {
  url: string
}

const LOCAL_PEOPLE_KEY = 'swapi_local_people'
const DELETED_IDS_KEY = 'swapi_deleted_ids'
const FAVORITES_KEY = 'swapi_favorites'

export const useSwapiStore = defineStore('swapi', () => {
  const apiPeople = ref<Person[]>([])
  const apiFilms = ref<Film[]>([])
  const localPeople = ref<Person[]>(readStorage<Person[]>(LOCAL_PEOPLE_KEY, []))
  const deletedIds = ref<string[]>(readStorage<string[]>(DELETED_IDS_KEY, []))
  const favorites = ref<string[]>(readStorage<string[]>(FAVORITES_KEY, []))
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const allPeople = computed<Person[]>(() => {
    const merged = new Map<string, Person>()

    apiPeople.value.forEach((person) => merged.set(person.id, person))
    localPeople.value.forEach((person) => merged.set(person.id, person))

    return [...merged.values()].filter((person) => !deletedIds.value.includes(person.id))
  })

  const favoritePeople = computed<Person[]>(() =>
    allPeople.value.filter((person) => favorites.value.includes(person.id)),
  )

  const persistLocalState = () => {
    localStorage.setItem(LOCAL_PEOPLE_KEY, JSON.stringify(localPeople.value))
    localStorage.setItem(DELETED_IDS_KEY, JSON.stringify(deletedIds.value))
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites.value))
  }

  const fetchInitialData = async () => {
    if (
      (apiPeople.value.length > 0 && apiFilms.value.length > 0) ||
      isLoading.value
    ) return

    isLoading.value = true
    error.value = null

    try {
      const [peopleResponse, filmsResponse] = await Promise.all([
        fetch('https://swapi.info/api/people'),
        fetch('https://swapi.info/api/films'),
      ])

      if (!peopleResponse.ok || !filmsResponse.ok) {
        throw new Error('Failed to load people and films')
      }

      const peopleData = await peopleResponse.json() as
        { results?: SwapiPerson[] } | SwapiPerson[]
      const filmsData = await filmsResponse.json() as
        { results?: SwapiFilm[] } | SwapiFilm[]
      const results = Array.isArray(peopleData) ? peopleData : peopleData.results ?? []
      const films = Array.isArray(filmsData) ? filmsData : filmsData.results ?? []

      apiPeople.value = results.map((person, index): Person => ({
        id: String(index + 1),
        name: person.name,
        height: person.height,
        mass: person.mass,
        gender: person.gender,
        birth_year: person.birth_year,
        homeworld: person.homeworld,
        starships: person.starships,
        films: person.films,
      }))
      apiFilms.value = films.map((film): Film => ({
        ...film,
        id: film.url,
      }))
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to load people'
    } finally {
      isLoading.value = false
    }

  }

  const fetchPeople = fetchInitialData

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
      films: data.films || [],
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
    favorites.value = favorites.value.filter((favoriteId) => favoriteId !== id)
    persistLocalState()
  }

  const toggleFavorite = (id: string) => {
    if (favorites.value.includes(id)) {
      favorites.value = favorites.value.filter((favoriteId) => favoriteId !== id)
    } else {
      favorites.value.push(id)
    }

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites.value))
  }

  return {
    allPeople,
    favoritePeople,
    favorites,
    apiFilms,
    localPeople,
    deletedIds,
    isLoading,
    error,
    fetchPeople,
    fetchInitialData,
    savePerson,
    deletePerson,
    toggleFavorite,
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
