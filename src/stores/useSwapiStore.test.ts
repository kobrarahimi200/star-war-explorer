import {beforeEach, describe, expect, it, vi} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useSwapiStore} from './useSwapiStore'

class LocalStorageMock {
    private data = new Map<string, string>()

    getItem(key: string) {
        return this.data.get(key) ?? null
    }

    setItem(key: string, value: string) {
        this.data.set(key, value)
    }

    removeItem(key: string) {
        this.data.delete(key)
    }

    clear() {
        this.data.clear()
    }
}

describe('useSwapiStore', () => {
    beforeEach(() => {
        vi.stubGlobal('localStorage', new LocalStorageMock())
        setActivePinia(createPinia())
        vi.restoreAllMocks()
    })

    it('loads API people as typed people', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    results: [
                        {
                            name: 'Luke Skywalker',
                            height: '172',
                            mass: '77',
                            gender: 'male',
                            birth_year: '19BBY',
                            homeworld: 'Tatooine',
                            starships: [],
                            films: [],
                        },
                    ],
                }),
            }),
        )

        const store = useSwapiStore()
        await store.fetchPeople()

        expect(store.allPeople).toHaveLength(1)
        expect(store.allPeople[0]).toMatchObject({
            id: '1',
            name: 'Luke Skywalker',
            birth_year: '19BBY',
        })
    })

    it('creates a custom person and persists it', () => {
        const store = useSwapiStore()

        store.savePerson({
            name: 'Ahsoka Tano',
            height: '166',
            mass: '55',
            gender: 'female',
            birth_year: '36BBY',
        })

        expect(store.localPeople).toHaveLength(1)
        expect(store.localPeople[0]).toMatchObject({
            name: 'Ahsoka Tano',
            isCustom: true,
        })
        expect(store.localPeople[0].id).toMatch(/^custom_\d+$/)
        expect(JSON.parse(localStorage.getItem('swapi_local_people') ?? '[]')).toHaveLength(1)
    })

    it('lets local edits override an API person with the same id', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    results: [
                        {
                            name: 'Luke Skywalker',
                            height: '172',
                            mass: '77',
                            gender: 'male',
                            birth_year: '19BBY',
                            homeworld: 'Tatooine',
                            starships: [],
                            films: [],
                        },
                    ],
                }),
            }),
        )

        const store = useSwapiStore()
        await store.fetchPeople()
        store.savePerson({id: '1', name: 'Luke Updated'})

        expect(store.allPeople).toHaveLength(1)
        expect(store.allPeople[0].name).toBe('Luke Updated')
    })

    it('deletes a person from the merged list and persists the deleted id', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    results: [
                        {
                            name: 'Leia Organa',
                            height: '150',
                            mass: '49',
                            gender: 'female',
                            birth_year: '19BBY',
                            homeworld: 'Alderaan',
                            starships: [],
                            films: [],
                        },
                    ],
                }),
            }),
        )

        const store = useSwapiStore()
        await store.fetchPeople()
        store.deletePerson('1')

        expect(store.allPeople).toHaveLength(0)
        expect(store.deletedIds).toContain('1')
        expect(JSON.parse(localStorage.getItem('swapi_deleted_ids') ?? '[]')).toContain('1')
    })

    it('toggles favorites and persists the favorite ids', () => {
        const store = useSwapiStore()

        store.toggleFavorite('custom_1')
        expect(store.favorites).toContain('custom_1')
        expect(JSON.parse(localStorage.getItem('swapi_favorites') ?? '[]')).toContain('custom_1')

        store.toggleFavorite('custom_1')
        expect(store.favorites).not.toContain('custom_1')
    })

    it('loads films and resolves a person film URL to a Film entity', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockImplementation((url: string) => Promise.resolve({
                ok: true,
                json: async () => url.endsWith('/films')
                    ? {
                        results: [{
                            url: 'https://swapi.info/api/films/1',
                            title: 'A New Hope',
                            episode_id: 4,
                            opening_crawl: 'A long time ago...',
                            release_date: '1977-05-25',
                            director: 'George Lucas',
                            producer: 'Gary Kurtz',
                            characters: ['https://swapi.info/api/people/1'],
                        }],
                    }
                    : {
                        results: [{
                            url: 'https://swapi.info/api/people/1',
                            name: 'Luke Skywalker',
                            height: '172',
                            mass: '77',
                            gender: 'male',
                            birth_year: '19BBY',
                            homeworld: 'https://swapi.info/api/planets/1',
                            starships: [],
                            films: ['https://swapi.info/api/films/1'],
                        }],
                    },
            })),
        )

        const store = useSwapiStore()
        await store.fetchInitialData()

        expect(store.apiFilms).toHaveLength(1)
        expect(store.getFilmsForPerson(['https://swapi.info/api/films/1'])).toMatchObject([
            {title: 'A New Hope', id: 'https://swapi.info/api/films/1'},
        ])
    })

    it('undoes a local deletion and restores its favorite state', () => {
        const store = useSwapiStore()
        store.savePerson({name: 'Ahsoka Tano'})
        const personId = store.localPeople[0].id
        store.toggleFavorite(personId)

        store.deletePerson(personId)
        expect(store.allPeople).toHaveLength(0)
        expect(store.lastDeleted?.id).toBe(personId)

        store.undoDelete()

        expect(store.allPeople).toHaveLength(1)
        expect(store.allPeople[0].name).toBe('Ahsoka Tano')
        expect(store.favorites).toContain(personId)
        expect(store.lastDeleted).toBeNull()
    })

    it('keeps a deletion after the undo window expires', () => {
        vi.useFakeTimers()
        const store = useSwapiStore()
        store.savePerson({name: 'Mace Windu'})
        const personId = store.localPeople[0].id

        store.deletePerson(personId)
        vi.advanceTimersByTime(5000)

        expect(store.lastDeleted).toBeNull()
        expect(store.allPeople).toHaveLength(0)
        vi.useRealTimers()
    })
})
