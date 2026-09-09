export interface Person {
    id: string
    url?: string
    name: string
    height: string
    mass: string
    gender: string
    birth_year: string
    homeworld: string
    starships: string[]
    films: string[]
    isCustom?: boolean
}

export interface Film {
    id: string
    title: string
    episode_id: number
    opening_crawl: string
    release_date: string
    director: string
    producer: string
    url: string
    characters: string[]
}

export interface SwapiPersonResponse {
    url?: string
    name: string
    height: string
    mass: string
    gender: string
    birth_year: string
    homeworld: string
    starships: string[]
    films: string[]
}

export interface PersonRouteParams {
    id?: string | string[]
}

export interface FilmRouteParams {
    id?: string | string[]
}

export interface SwapiFilmResponse extends Omit<Film, 'id'> {
    url: string
}

export type PeopleQueryParam = 'q' | 'gender' | 'sort' | 'favorites'


export type FormField = 'name' | 'height' | 'mass' | 'gender' | 'birth_year'