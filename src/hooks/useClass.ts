import { useEffect, useState } from 'react'

import { fetchApi } from '@/libs/fetchApi'

export default function useClass() {
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    let isMounted = true

    setLoading(true)
    fetchApi(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/classes/teachers`)
      .then((res: Response) => {
        if (!res.ok) throw new Error('Failed to fetch classes')

        return res.json()
      })
      .then((data: any) => {
        if (isMounted) {
            setClasses(data?.data?.classes || [])
        }
      })
      .catch((err: any) => {
        if (isMounted) setError(err)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return { classes, loading, error }
}
