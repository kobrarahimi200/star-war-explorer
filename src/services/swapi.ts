const API_URL = 'https://swapi.info/api'

export async function getPeople() {
    const response = await fetch(`${API_URL}/people`)

    if (!response.ok) {
        throw new Error('Failed to load people')
    }

    return response.json()
}

export async function getStarships() {
    const response = await fetch(`${API_URL}/starships`)

    if (!response.ok) {
        throw new Error('Failed to load starships')
    }

    return response.json()
}