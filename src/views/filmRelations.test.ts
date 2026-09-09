import {describe, expect, it} from 'vitest'
import type {Film, Person} from '@/types/swapi'
import {getFilmCharacterPreview, getFilmCharacters} from './filmRelations'

const film: Film = {
    id: 'film-1',
    url: 'https://swapi.info/api/films/1',
    title: 'A New Hope',
    episode_id: 4,
    opening_crawl: 'A long time ago...',
    release_date: '1977-05-25',
    director: 'George Lucas',
    producer: 'Gary Kurtz',
    characters: [
        'https://swapi.info/api/people/1',
        'https://swapi.info/api/people/2',
        'https://swapi.info/api/people/3',
        'https://swapi.info/api/people/4',
        'https://swapi.info/api/people/5',
        'https://swapi.info/api/people/6',
    ],
}

const people: Person[] = film.characters.map((url, index) => ({
    id: String(index + 1),
    url,
    name: `Character ${index + 1}`,
    height: 'unknown',
    mass: 'unknown',
    gender: 'unknown',
    birth_year: 'unknown',
    homeworld: 'unknown',
    starships: [],
    films: [film.url],
}))

describe('film character relations', () => {
    it('resolves characters by their SWAPI URLs', () => {
        expect(getFilmCharacters(film, people)).toHaveLength(6)
        expect(getFilmCharacters(film, people)[0].name).toBe('Character 1')
    })

    it('limits previews to five characters and reports the remainder', () => {
        expect(getFilmCharacterPreview(film, people)).toEqual({
            people: people.slice(0, 5),
            remaining: 1,
        })
    })

    it('ignores people without a matching URL', () => {
        const unrelated: Person = {...people[0], url: undefined}

        expect(getFilmCharacters(film, [unrelated])).toEqual([])
    })
})
