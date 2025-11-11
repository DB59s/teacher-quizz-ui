// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Type Imports
import type { Data, ProfileHeaderType, ProfileTabType } from '@/types/pages/profileTypes'

// Component Imports
import UserProfile from '@views/pages/user-profile'

// Service Imports
import { getUserProfileServer } from '@/services/user.service'

const ProfileTab = dynamic(() => import('@views/pages/user-profile/profile'))
const TeamsTab = dynamic(() => import('@views/pages/user-profile/teams'))
const ProjectsTab = dynamic(() => import('@views/pages/user-profile/projects'))
const ConnectionsTab = dynamic(() => import('@views/pages/user-profile/connections'))

// Helper function to map API response to ProfileHeaderType
const mapToProfileHeader = (userData: any): ProfileHeaderType => {
  return {
    fullName: userData.full_name || '',
    coverImg: '/images/pages/profile-header-cover.png', // Default cover image
    location: userData.department || '',
    profileImg: '/images/avatars/1.png', // Default profile image
    joiningDate: userData.created_at ? new Date(userData.created_at).toLocaleDateString('vi-VN') : '',
    designation: userData.department || 'Giáo viên',
    designationIcon: 'tabler-school'
  }
}

// Helper function to map API response to ProfileTabType
const mapToProfileTab = (userData: any): ProfileTabType => {
  return {
    about: [
      {
        icon: 'tabler-user',
        property: 'Họ và tên',
        value: userData.full_name || ''
      },
      {
        icon: 'tabler-school',
        property: 'Khoa/Phòng ban',
        value: userData.department || ''
      },
      {
        icon: 'tabler-building',
        property: 'Trường đại học',
        value: userData.university || 'Chưa cập nhật'
      }
    ],
    contacts: [
      {
        icon: 'tabler-mail',
        property: 'Email',
        value: userData.email || ''
      },
      {
        icon: 'tabler-phone',
        property: 'Số điện thoại',
        value: userData.phone_number || 'Chưa cập nhật'
      }
    ],
    overview: [
      {
        icon: 'tabler-calendar',
        property: 'Ngày tạo',
        value: userData.created_at ? new Date(userData.created_at).toLocaleDateString('vi-VN') : ''
      },
      {
        icon: 'tabler-check',
        property: 'Trạng thái',
        value: userData.profile_completed ? 'Đã hoàn thành' : 'Chưa hoàn thành'
      }
    ],
    teams: [
      {
        property: 'Khoa',
        value: userData.department || ''
      }
    ],
    teamsTech: [],
    connections: [],
    projectTable: []
  }
}

// Vars
const tabContentList = (data?: Data): { [key: string]: ReactElement } => ({
  profile: <ProfileTab data={data?.users.profile} />,
  teams: <TeamsTab data={data?.users.teams} />,
  projects: <ProjectsTab data={data?.users.projects} />,
  connections: <ConnectionsTab data={data?.users.connections} />
})

const ProfilePage = async () => {
  try {
    // Fetch user profile from API
    const userData = await getUserProfileServer()

    // Map API response to component data format
    const profileData: Data = {
      profileHeader: mapToProfileHeader(userData),
      users: {
        profile: mapToProfileTab(userData),
        teams: [],
        projects: [],
        connections: []
      }
    }

    return <UserProfile data={profileData} tabContentList={tabContentList(profileData)} />
  } catch (error) {
    console.error('Error fetching user profile:', error)

    // Return empty data on error
    const emptyData: Data = {
      profileHeader: {
        fullName: '',
        coverImg: '/images/pages/profile-header-cover.png',
        location: '',
        profileImg: '/images/avatars/1.png',
        joiningDate: '',
        designation: '',
        designationIcon: 'tabler-user'
      },
      users: {
        profile: {
          about: [],
          contacts: [],
          overview: [],
          teams: [],
          teamsTech: [],
          connections: [],
          projectTable: []
        },
        teams: [],
        projects: [],
        connections: []
      }
    }

    return <UserProfile data={emptyData} tabContentList={tabContentList(emptyData)} />
  }
}

export default ProfilePage
