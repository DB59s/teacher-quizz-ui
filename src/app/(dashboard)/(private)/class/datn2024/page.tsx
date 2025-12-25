'use client'

// React Imports
import type { SyntheticEvent } from 'react'
import { useCallback, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

// Component Imports
import CustomTabList from '@core/components/mui/TabList'

import Newsfeed from '@views/class/Tab/Newsfeed'
import Members from '@views/class/Tab/Members'
import Exercises from '@views/class/Tab/Exercises'
import ApprovalMember from '@views/class/Tab/ApprovalMember'

const data = {
  name: 'DATN 2024',
  description: 'Đồ án tốt nghiệp 2024',
  banner: 'https://www.gstatic.com/classroom/themes/img_backtoschool.jpg',
  teacher: 'Nguyễn Văn A',
  class_code: 'epb2g6rj',
  students: [
    {
      id: 1,
      name: 'Trần Văn B',
      email: 'tranvan.b@example.com',
      student_code: 'sv2024001'
    },
    {
      id: 2,
      name: 'Lê Văn C',
      email: 'levanc@example.com',
      student_code: 'sv2024002'
    },
    {
      id: 3,
      name: 'Phạm Văn D',
      email: 'phamvan.d@example.com',
      student_code: 'sv2024003'
    }
  ]
}

export default function ClassPage() {
  const [activeTab, setActiveTab] = useState('newsfeed')
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = useCallback(
    (event: SyntheticEvent, value: string) => {
      setActiveTab(value)

      const params = new URLSearchParams(searchParams.toString())

      params.set('tab', value)
      router.replace(`?${params.toString()}`)
    },
    [router, searchParams]
  )

  return (
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
            <Newsfeed data={data} />
          </TabPanel>
          <TabPanel value={'exercises'} className='p-0'>
            <Exercises />
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
  )
}
