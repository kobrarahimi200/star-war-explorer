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

export interface SwapiStoreState {
  apiPeople: Person[]
  apiFilms: Film[]
  localPeople: Person[]
  deletedIds: string[]
  favorites: string[]
  isLoading: boolean
  error: string | null
}

export interface PersonRouteParams {
  id?: string | string[]
}

export interface FilmRouteParams {
  id?: string | string[]
}
