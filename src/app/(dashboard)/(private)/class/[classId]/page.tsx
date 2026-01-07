'use client'

// React Imports
import React, { useCallback, useState } from 'react'
import type { SyntheticEvent } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

import { useClassDetail } from '@/hooks/queries/useClasses'

// Component Imports
import CustomTabList from '@core/components/mui/TabList'
import Newsfeed from '@views/class/Tab/Newsfeed'
import Members from '@views/class/Tab/Members'
import Exercises from '@views/class/Tab/Exercises'
import ApprovalMember from '@views/class/Tab/ApprovalMember'
import PageLoading from '@/theme/PageLoading'

export default function ClassPage({ params }: { params: Promise<{ classId: string }> }) {
  const [activeTab, setActiveTab] = useState('newsfeed')
  const router = useRouter()
  const searchParams = useSearchParams()

  // Unwrap params using React.use()
  const unwrappedParams = React.use(params)
  const classId = unwrappedParams.classId

  // Use TanStack Query hook to fetch class data
  const { data, isLoading, error, refetch } = useClassDetail(classId)

  const handleChange = useCallback(
    (event: SyntheticEvent, value: string) => {
      setActiveTab(value)
      const paramsUrl = new URLSearchParams(searchParams.toString())

      paramsUrl.set('tab', value)
      router.replace(`?${paramsUrl.toString()}`)
    },
    [router, searchParams]
  )

  if (isLoading) return <PageLoading show={isLoading} />
  if (error) return <Typography color='error'>{(error as any)?.message || 'Lỗi không xác định'}</Typography>
  if (!data) return <Typography color='error'>Không có dữ liệu lớp học</Typography>

  return (
    <>
      <PageLoading show={isLoading} />
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <Typography variant='h4' className='font-semibold'>
            Lớp học {data.name}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12 }} className='flex flex-col gap-6'>
          <TabContext value={activeTab}>
            <CustomTabList onChange={handleChange} variant='scrollable' pill='true'>
              <Tab label={<div className='flex items-center gap-1.5'>Bảng tin</div>} value='newsfeed' />
              <Tab label={<div className='flex items-center gap-1.5'>Bài tập trên lớp</div>} value='exercises' />
              <Tab label={<div className='flex items-center gap-1.5'>Mọi người</div>} value='members' />
              <Tab label={<div className='flex items-center gap-1.5'>Phê duyệt</div>} value='approval' />
            </CustomTabList>
            <TabPanel value={'newsfeed'} className='p-0'>
              <Newsfeed data={data} onRefresh={() => refetch()} />
            </TabPanel>
            <TabPanel value={'exercises'} className='p-0'>
              <Exercises data={data} />
            </TabPanel>
            <TabPanel value={'members'} className='p-0'>
              <Members data={data} />
            </TabPanel>
            <TabPanel value={'approval'} className='p-0'>
              <ApprovalMember data={data} />
            </TabPanel>
          </TabContext>
        </Grid>
      </Grid>
    </>
  )
}
