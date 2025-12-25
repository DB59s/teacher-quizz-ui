'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'

// Type Imports
import type { ThemeColor } from '@core/types'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Service Imports
import type { DashboardKPI } from '@/services/dashboard.service'

type KPICardProps = {
  title: string
  value: number
  icon: string
  color: ThemeColor
}

const KPICard = ({ title, value, icon, color }: KPICardProps) => {
  return (
    <Card>
      <CardContent className='flex items-center gap-4'>
        <CustomAvatar color={color} variant='rounded' size={56} skin='light'>
          <i className={icon} style={{ fontSize: '28px' }}></i>
        </CustomAvatar>
        <div className='flex flex-col'>
          <Typography variant='h4' className='font-semibold'>
            {value.toLocaleString('vi-VN')}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {title}
          </Typography>
        </div>
      </CardContent>
    </Card>
  )
}

type TeacherKPICardsProps = {
  kpi: DashboardKPI
}

const TeacherKPICards = ({ kpi }: TeacherKPICardsProps) => {
  const kpiData: KPICardProps[] = [
    {
      title: 'Tổng số lớp học',
      value: kpi.total_classes,
      icon: 'tabler-school',
      color: 'primary'
    },
    {
      title: 'Tổng số học sinh',
      value: kpi.total_students,
      icon: 'tabler-users',
      color: 'info'
    },
    {
      title: 'Tổng số bài quiz',
      value: kpi.total_quizzes,
      icon: 'tabler-file-text',
      color: 'success'
    },
    {
      title: 'Tổng số câu hỏi',
      value: kpi.total_questions,
      icon: 'tabler-help-circle',
      color: 'warning'
    }
  ]

  return (
    <Grid container spacing={6}>
      {kpiData.map((item, index) => (
        <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
          <KPICard {...item} />
        </Grid>
      ))}
    </Grid>
  )
}

export default TeacherKPICards
