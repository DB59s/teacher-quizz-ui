// Next Imports
import { redirect } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'

// Components Imports
import TeacherKPICards from '@views/dashboards/teacher/TeacherKPICards'
import ScoreDistributionChart from '@views/dashboards/teacher/ScoreDistributionChart'

// Service Imports
import { getTeacherDashboardServer, AuthenticationError } from '@/services/dashboard.service'

const TeacherDashboard = async () => {
  try {
    // Fetch dashboard data
    const dashboardData = await getTeacherDashboardServer()

    return (
      <>
        <Typography variant='h4' className='mb-6'>
          Tổng quan
        </Typography>
        <Grid container spacing={6}>
          {/* KPI Cards */}
          <Grid size={{ xs: 12 }}>
            <TeacherKPICards kpi={dashboardData.kpi} />
          </Grid>

          {/* Score Distribution Chart */}
          <Grid size={{ xs: 12 }}>
            <ScoreDistributionChart data={dashboardData.score_distribution_chart} />
          </Grid>
        </Grid>
      </>
    )
  } catch (error) {
    // Handle authentication errors - redirect to login
    if (error instanceof AuthenticationError) {
      redirect('/login')
    }

    // Re-throw other errors
    throw error
  }
}

export default TeacherDashboard
