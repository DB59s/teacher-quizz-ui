import axios from 'axios'
import { getSession } from 'next-auth/react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function getClassStudents(classId: string) {
  try {
    const session = await getSession()
    const token = session?.accessToken

    const response = await axios.get(`${API_BASE_URL}/api/v1/classes/teacher/${classId}/students`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    })

    return response.data?.data?.students || []
  } catch (error: any) {
    console.error('Error fetching class students:', error)

    if (error.response) {
      console.error('Response status:', error.response.status)
      console.error('Response data:', error.response.data)
      throw new Error(error.response.data?.message || 'Failed to fetch class details')
    }

    throw error
  }
}

export async function removeStudentFromClass(registrationId: string) {
  try {
    const session = await getSession()
    const token = session?.accessToken

    const url = `${API_BASE_URL}/api/v1/student-classes/${registrationId}/remove`

    await axios.delete(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    })

    return true
  } catch (error: any) {
    console.error('Error removing student from class:', error)

    if (error.response) {
      console.error('Response status:', error.response.status)
      console.error('Response data:', error.response.data)
      throw new Error(error.response.data?.message || 'Failed to remove student from class')
    }

    throw error
  }
}

export async function approveStudent(registrationId: string) {
  try {
    const session = await getSession()
    const token = session?.accessToken

    const url = `${API_BASE_URL}/api/v1/student-classes/${registrationId}/approve`

    await axios.patch(
      url,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      }
    )

    return true
  } catch (error: any) {
    console.error('Error approving student:', error)

    if (error.response) {
      console.error('Response status:', error.response.status)
      console.error('Response data:', error.response.data)
      throw new Error(error.response.data?.message || 'Failed to approve student')
    }

    throw error
  }
}

export async function rejectStudent(registrationId: string) {
  try {
    const session = await getSession()
    const token = session?.accessToken

    const url = `${API_BASE_URL}/api/v1/student-classes/${registrationId}/reject`

    await axios.patch(
      url,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      }
    )

    return true
  } catch (error: any) {
    console.error('Error rejecting student:', error)

    if (error.response) {
      console.error('Response status:', error.response.status)
      console.error('Response data:', error.response.data)
      throw new Error(error.response.data?.message || 'Failed to reject student')
    }

    throw error
  }
}

export interface UpdateClassPayload {
  name: string
  description: string
  status: 'active' | 'inactive'
}

export async function updateClass(classId: string, payload: UpdateClassPayload) {
  try {
    const session = await getSession()
    const token = session?.accessToken

    const url = `${API_BASE_URL}/api/v1/classes/${classId}`

    const response = await axios.patch(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    })

    return response.data
  } catch (error: any) {
    console.error('Error updating class:', error)

    if (error.response) {
      console.error('Response status:', error.response.status)
      console.error('Response data:', error.response.data)
      throw new Error(error.response.data?.message || 'Failed to update class')
    }

    throw error
  }
}

export async function deleteClass(classId: string) {
  try {
    const session = await getSession()
    const token = session?.accessToken

    const url = `${API_BASE_URL}/api/v1/classes/${classId}`

    await axios.delete(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    })

    return true
  } catch (error: any) {
    console.error('Error deleting class:', error)

    if (error.response) {
      console.error('Response status:', error.response.status)
      console.error('Response data:', error.response.data)
      throw new Error(error.response.data?.message || 'Failed to delete class')
    }

    throw error
  }
}
