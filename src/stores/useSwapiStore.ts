import {defineStore} from 'pinia'
import {computed, ref} from 'vue'
import type {Film, Person, SwapiFilmResponse, SwapiPersonResponse} from '@/types/swapi'

const LOCAL_PEOPLE_KEY = 'swapi_local_people'
const DELETED_IDS_KEY = 'swapi_deleted_ids'
const FAVORITES_KEY = 'swapi_favorites'

export const useSwapiStore = defineStore('swapi', () => {
    const apiPeople = ref<Person[]>([])
    const apiFilms = ref<Film[]>([])
    const localPeople = ref<Person[]>(readStorage<Person[]>(LOCAL_PEOPLE_KEY, []))
    const deletedIds = ref<string[]>(readStorage<string[]>(DELETED_IDS_KEY, []))
    const favorites = ref<string[]>(readStorage<string[]>(FAVORITES_KEY, []))
    const lastDeleted = ref<Person | null>(null)
    const lastDeletedWasLocal = ref(false)
    const lastDeletedWasFavorite = ref(false)
    let deleteTimeout: ReturnType<typeof setTimeout> | null = null
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

    const persistLocalState = (): void => {
        localStorage.setItem(LOCAL_PEOPLE_KEY, JSON.stringify(localPeople.value))
        localStorage.setItem(DELETED_IDS_KEY, JSON.stringify(deletedIds.value))
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites.value))
    }

    const fetchInitialData = async (): Promise<void> => {
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
                { results?: SwapiPersonResponse[] } | SwapiPersonResponse[]
            const filmsData = await filmsResponse.json() as
                { results?: SwapiFilmResponse[] } | SwapiFilmResponse[]
            const results = Array.isArray(peopleData) ? peopleData : peopleData.results ?? []
            const films = Array.isArray(filmsData) ? filmsData : filmsData.results ?? []

            apiPeople.value = results.map((person, index): Person => ({
                id: String(index + 1),
                url: person.url,
                name: person.name,
                height: person.height,
                mass: person.mass,
                gender: person.gender,
                birth_year: person.birth_year,
                homeworld: person.homeworld,
                starships: person.starships,
                films: person.films,
            }))
            apiFilms.value = films.map((film, index): Film => ({
                ...film,
                id: film.url || `film_${index}`,
            }))
        } catch (err: unknown) {
            error.value = err instanceof Error ? err.message : 'Failed to load people'
        } finally {
            isLoading.value = false
        }

    }

    const fetchPeople: () => Promise<void> = fetchInitialData

    const getFilmsForPerson = (filmUrls: string[]): Film[] =>
        apiFilms.value.filter((film) => filmUrls.includes(film.url))

    const savePerson = (data: Partial<Person> & { id?: string }): void => {
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

    const deletePerson = (id: string): void => {
        const person = allPeople.value.find((item) => item.id === id)
        if (!person) return

        lastDeleted.value = person
        lastDeletedWasLocal.value = localPeople.value.some((item) => item.id === id)
        lastDeletedWasFavorite.value = favorites.value.includes(id)

        if (deleteTimeout) clearTimeout(deleteTimeout)
        if (!deletedIds.value.includes(id)) {
            deletedIds.value.push(id)
        }

        localPeople.value = localPeople.value.filter((person) => person.id !== id)
        favorites.value = favorites.value.filter((favoriteId) => favoriteId !== id)
        persistLocalState()

        deleteTimeout = setTimeout(() => {
            lastDeleted.value = null
            lastDeletedWasLocal.value = false
            lastDeletedWasFavorite.value = false
        }, 5000)
    }

    const undoDelete = (): void => {
        const person = lastDeleted.value
        if (!person) return

        deletedIds.value = deletedIds.value.filter((deletedId) => deletedId !== person.id)
        if (lastDeletedWasLocal.value && !localPeople.value.some((item) => item.id === person.id)) {
            localPeople.value.push(person)
        }
        if (lastDeletedWasFavorite.value && !favorites.value.includes(person.id)) {
            favorites.value.push(person.id)
        }

        persistLocalState()
        if (deleteTimeout) clearTimeout(deleteTimeout)
        lastDeleted.value = null
        lastDeletedWasLocal.value = false
        lastDeletedWasFavorite.value = false
    }

    const toggleFavorite = (id: string): void => {
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
        lastDeleted,
        apiFilms,
        getFilmsForPerson,
        localPeople,
        deletedIds,
        isLoading,
        error,
        fetchPeople,
        fetchInitialData,
        savePerson,
        deletePerson,
        undoDelete,
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
