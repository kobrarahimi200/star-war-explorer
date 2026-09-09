import type {Film, Person} from '@/types/swapi'

export interface FilmCharacterPreview {
    people: Person[]
    remaining: number
}

export const getFilmCharacters = (film: Film, people: Person[]): Person[] =>
    people.filter((person) => person.url !== undefined && film.characters.includes(person.url))

export const getFilmCharacterPreview = (
    film: Film,
    people: Person[],
): FilmCharacterPreview => {
    const characters = getFilmCharacters(film, people)

    return {
        people: characters.slice(0, 5),
        remaining: Math.max(characters.length - 5, 0),
    }
}
