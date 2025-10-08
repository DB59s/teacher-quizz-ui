import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import ListItemText from '@mui/material/ListItemText'

export default function Members(data: any) {
  const { students } = data.data;
  
  return (
    <Box className='p-4'>
      <Typography variant='h6' className='mb-4'>
        Mọi người ({students.length})
      </Typography>
      <List>
        {students.map((student: any) => (
          <ListItem key={student.id} divider>
            <ListItemAvatar>
              <Avatar>
                {student.name
                  .split(' ')
                  .map((s: any) => s[0])
                  .slice(-2)
                  .join('')}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={student.name} secondary={`${student.email} • ${student.student_code}`} />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
