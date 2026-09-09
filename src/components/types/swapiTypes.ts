export interface Person {
    id: string
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
    director: string
    producer: string
    release_date: string
    characters: string[]
}
