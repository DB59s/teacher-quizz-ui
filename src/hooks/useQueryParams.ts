import { useEffect, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

type QueryParam = {
  [key: string]: string[] | string | boolean | number | undefined
}

interface QueryParams {
  [key: string]: string | string[] | number | any
}

export const useQueryParams = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [queryParams, setQueryParams] = useState<QueryParam | QueryParams>(
    Object.fromEntries(searchParams.entries()) || {},
  )

  const convertQueryParam = (queryParam: {
    [x: string]: string | number | boolean
  }): string => {
    if (!queryParam) {
      return ''
    }

    let str = ''

    Object.keys(queryParam).forEach((key: string) => {
      if (str !== '') {
        str += '&'
      }

      if (key === 'brands') {
        str += `${key}=${queryParam[key]}`
      } else {
        const value = queryParam[key].toString().replace(/,/g, ',')

        str += `${key}=${encodeURIComponent(value)}`
      }
    })

    return str
  }

  useEffect(() => {
    const params: QueryParams = {}

    searchParams?.forEach((value, key) => {
      if (params[key]) {
        if (Array.isArray(params[key])) {
          ;(params[key] as string[]).push(value)
        } else {
          params[key] = [params[key] as string, value]
        }
      } else {
        params[key] = value
      }
    })
    setQueryParams(params)
  }, [searchParams])

  const updateQueryParams = (newParams: QueryParams) => {
    const updatedParams = new URLSearchParams(searchParams?.toString())

    Object.keys(newParams).forEach((key) => {
      const paramValue = newParams[key]

      if (
        paramValue !== undefined &&
        paramValue !== null &&
        paramValue !== ''
      ) {
        if (Array.isArray(paramValue)) {
          paramValue.forEach((value: string) => {
            updatedParams.append(key, value)
          })
        } else if (typeof paramValue === 'string') {
          updatedParams.set(key, paramValue?.replace(/,/g, ','))
        } else if (typeof paramValue === 'number') {
          updatedParams.set(key, paramValue.toString().replace(/,/g, ','))
        }
      } else {
        updatedParams.delete(key)
      }
    })
    router.push(`?${updatedParams.toString()}`)
  }

  const formatQueryString = (filters: Record<string, any>): string => {
    return Object.entries(filters)
      .map(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            return `${key}=${value.join(',')}`
          } else {
            const encodedValue = encodeURIComponent(value.toString()).replace(
              /%2C/g,
              ',',
            )

            return `${key}=${encodedValue}`
          }
        }

        return ''
      })
      .filter(Boolean)
      .join('&')
  }

  const applyFilters = (newParams: QueryParams, page: number | string = 1) => {
    const updatedParams = new URLSearchParams()

    Object.keys(newParams).forEach((key) => {
      const paramValue = newParams[key]

      if (
        paramValue !== undefined &&
        paramValue !== null &&
        paramValue !== ''
      ) {
        if (Array.isArray(paramValue)) {
          paramValue.forEach((value: string) => {
            updatedParams.append(key, value)
          })
        } else if (typeof paramValue === 'string') {
          updatedParams.set(key, paramValue?.replace(/,/g, ','))
        }
      }
    })

    updatedParams.set('page', page.toString())

    const currentPath =
      typeof window !== 'undefined' ? window.location.pathname : ''

    router.push(`${currentPath}?${updatedParams.toString()}`)
  }

  const resetQueryParams = () => {
    const currentPath =
      typeof window !== 'undefined' ? window.location.pathname : ''

    router.push(currentPath)
  }

  return {
    queryParams,
    applyFilters,
    formatQueryString,
    resetQueryParams,
    convertQueryParam,
    updateQueryParams,
  }
}
