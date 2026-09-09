import {describe, expect, it} from 'vitest'
import type {LocationQuery} from 'vue-router'
import {readPeopleQuery, updatePeopleQuery} from './peopleQuery'

describe('People route query state', () => {
    it('restores filter values from URL query parameters', () => {
        const query: LocationQuery = {
            q: 'luke',
            gender: 'male',
            sort: 'height-desc',
            favorites: 'true',
        }

        expect(readPeopleQuery(query, 'q', '')).toBe('luke')
        expect(readPeopleQuery(query, 'gender', 'all')).toBe('male')
        expect(readPeopleQuery(query, 'sort', 'name-asc')).toBe('height-desc')
        expect(readPeopleQuery(query, 'favorites', 'false')).toBe('true')
    })

    it('uses defaults when a query parameter is missing', () => {
        expect(readPeopleQuery({}, 'q', '')).toBe('')
        expect(readPeopleQuery({}, 'gender', 'all')).toBe('all')
        expect(readPeopleQuery({}, 'sort', 'name-asc')).toBe('name-asc')
        expect(readPeopleQuery({}, 'favorites', 'false')).toBe('false')
    })

    it('updates one parameter while preserving the rest', () => {
        expect(
            updatePeopleQuery(
                {q: 'luke', gender: 'male'},
                'sort',
                'height-desc',
            ),
        ).toEqual({
            q: 'luke',
            gender: 'male',
            sort: 'height-desc',
        })
    })

    it('omits empty and default values from the URL', () => {
        expect(updatePeopleQuery({q: 'luke'}, 'q', '')).toEqual({})
        expect(updatePeopleQuery({gender: 'male'}, 'gender', 'all')).toEqual({})
        expect(updatePeopleQuery({sort: 'height-desc'}, 'sort', 'name-asc')).toEqual({})
        expect(updatePeopleQuery({favorites: 'true'}, 'favorites', false)).toEqual({})
    })
})
