'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

import { apiClient } from '@/libs/axios-client'

interface ClassItem {
  _id: string
  name: string
  description: string
  max_students: number
  status: string
}

interface ClassContextType {
  classes: ClassItem[]
  loading: boolean
  error: any
  refreshClasses: () => Promise<void>
}

const ClassContext = createContext<ClassContextType | undefined>(undefined)

export function ClassProvider({ children }: { children: React.ReactNode }) {
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await apiClient.get('/api/v1/classes/teachers')

      setClasses(data?.data?.classes || [])
      setError(null)
    } catch (err: any) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchClasses()
  }, [fetchClasses])

  const refreshClasses = useCallback(async () => {
    await fetchClasses()
  }, [fetchClasses])

  return <ClassContext.Provider value={{ classes, loading, error, refreshClasses }}>{children}</ClassContext.Provider>
}

export function useClassContext() {
  const context = useContext(ClassContext)

  if (context === undefined) {
    throw new Error('useClassContext must be used within a ClassProvider')
  }

  return context
}
