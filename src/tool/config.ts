import type { RouteLocationNormalizedLoadedGeneric, LocationQueryValue } from 'vue-router'
import { isArray } from './general.ts'
import { GUARD_THEME } from './contanst.ts'

export function getConfig(route: RouteLocationNormalizedLoadedGeneric) {
  return {
    theme: getTheme(route.query.theme),
    isTest: isTest(route.query.test),
    code: getCode(route.query.code),
  }
}

export function getTheme(queryValue: LocationQueryValue | LocationQueryValue[]) {
  queryValue = isArray(queryValue) ? queryValue[0] : queryValue
  const value = Number(queryValue)
  switch (value) {
    case GUARD_THEME.DEFAULT:
      return value
  }
  return GUARD_THEME.DEFAULT
}

export function isTest(queryValue: LocationQueryValue | LocationQueryValue[]) {
  queryValue = isArray(queryValue) ? queryValue[0] : queryValue
  return Boolean(Number(queryValue))
}

export function getCode(queryValue: LocationQueryValue | LocationQueryValue[]) {
  queryValue = isArray(queryValue) ? queryValue[0] : queryValue
  return queryValue
}
