// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'

// Components Imports
import TeacherKPICards from '@views/dashboards/teacher/TeacherKPICards'
import ScoreDistributionChart from '@views/dashboards/teacher/ScoreDistributionChart'

// Service Imports
import { getTeacherDashboardServer } from '@/services/dashboard.service'

const TeacherDashboard = async () => {
  // Fetch dashboard data
  const dashboardData = await getTeacherDashboardServer()

  return (
    <>
      <Typography variant='h1' className='mb-6'>
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
}

export default TeacherDashboard
