import {afterEach, describe, expect, it, vi} from 'vitest'
import {getPeople, getStarships} from './swapi'

describe('swapi service', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('fetches people from the SWAPI endpoint', async () => {
        const payload = {results: [{name: 'Luke Skywalker'}]}
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => payload,
        })
        vi.stubGlobal('fetch', fetchMock)

        await expect(getPeople()).resolves.toEqual(payload)
        expect(fetchMock).toHaveBeenCalledWith('https://swapi.info/api/people')
    })

    it('throws when loading people fails', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ok: false}))

        await expect(getPeople()).rejects.toThrow('Failed to load people')
    })

    it('fetches starships from the SWAPI endpoint', async () => {
        const payload = {results: [{name: 'X-wing'}]}
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => payload,
        })
        vi.stubGlobal('fetch', fetchMock)

        await expect(getStarships()).resolves.toEqual(payload)
        expect(fetchMock).toHaveBeenCalledWith('https://swapi.info/api/starships')
    })

    it('throws when loading starships fails', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ok: false}))

        await expect(getStarships()).rejects.toThrow('Failed to load starships')
    })
})
