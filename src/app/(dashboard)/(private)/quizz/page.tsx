import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";

import QuizzTable from "@/views/quizz/QuizzTable";

export default function QuizzPage() {
    return (
        <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <Typography variant='h4' className='font-semibold'>
            Danh sách quizz
          </Typography>
        </Grid>
        <Grid size={{ xs: 12 }}>
            <QuizzTable />
          </Grid>
      </Grid>
    )
}
