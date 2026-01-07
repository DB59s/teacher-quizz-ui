// Query keys factory for TanStack Query
// This centralizes all query keys to prevent key collision and enable easy invalidation

export const queryKeys = {
  // Dashboard keys
  dashboard: {
    all: ['dashboard'] as const,
    teacher: () => [...queryKeys.dashboard.all, 'teacher'] as const
  },

  // Quiz keys
  quizzes: {
    all: ['quizzes'] as const,
    lists: () => [...queryKeys.quizzes.all, 'list'] as const,
    list: (filters: { page?: number; limit?: number }) => [...queryKeys.quizzes.lists(), filters] as const,
    details: () => [...queryKeys.quizzes.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.quizzes.details(), id] as const
  },

  // Question keys
  questions: {
    all: ['questions'] as const,
    lists: () => [...queryKeys.questions.all, 'list'] as const,
    list: (filters: { page?: number; limit?: number; search?: string; level?: string; subject_id?: string }) =>
      [...queryKeys.questions.lists(), filters] as const,
    details: () => [...queryKeys.questions.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.questions.details(), id] as const
  },

  // Class keys
  classes: {
    all: ['classes'] as const,
    lists: () => [...queryKeys.classes.all, 'list'] as const,
    list: (filters?: { page?: number; limit?: number }) => [...queryKeys.classes.lists(), filters || {}] as const,
    details: () => [...queryKeys.classes.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.classes.details(), id] as const,
    students: (classId: string) => [...queryKeys.classes.detail(classId), 'students'] as const
  },

  // Subject keys
  subjects: {
    all: ['subjects'] as const,
    lists: () => [...queryKeys.subjects.all, 'list'] as const,
    list: (filters?: { page?: number; limit?: number }) => [...queryKeys.subjects.lists(), filters || {}] as const
  }
} as const
