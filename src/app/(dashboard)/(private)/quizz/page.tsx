import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";

import { Button } from "@mui/material";

import QuizzTable from "@/views/quizz/QuizzTable";

export default function QuizzPage() {
    return (
        <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <div className="flex justify-between">
            <Typography variant='h4' className='font-semibold'>
              Danh sách quizz
            </Typography>
            <Button variant="contained" href="/quizz/create">Tạo quizz mới</Button>
          </div>
        </Grid>
        <Grid size={{ xs: 12 }}>
            <QuizzTable />
          </Grid>
      </Grid>
    )
}
