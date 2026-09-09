import type { LocationQuery, LocationQueryRaw } from 'vue-router'

export type PeopleQueryParam = 'q' | 'gender' | 'sort' | 'favorites'

export const readPeopleQuery = (
  query: LocationQuery,
  param: PeopleQueryParam,
  fallback: string,
): string => {
  const value = query[param]

  if (typeof value === 'string') {
    return value
  }

  if (Array.isArray(value)) {
    return value[0] ?? fallback
  }

  return fallback
}

export const updatePeopleQuery = (
  query: LocationQuery,
  param: PeopleQueryParam,
  value: string | boolean,
): LocationQueryRaw => {
  const nextQuery: LocationQueryRaw = { ...query }

  if (
    value === '' ||
    value === false ||
    (param === 'gender' && value === 'all') ||
    (param === 'sort' && value === 'name-asc')
  ) {
    delete nextQuery[param]
  } else {
    nextQuery[param] = String(value)
  }

  return nextQuery
}
