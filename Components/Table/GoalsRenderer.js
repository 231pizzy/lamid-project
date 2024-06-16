
import { Box, Typography } from "@mui/material";

const GoalsRenderer = (props) => {
    const progress = [
        { id: 'todo', color: '#257AFB', label: 'To do' },
        { id: 'inProgress', color: '#FF6C4B', label: 'In Progress' },
        { id: 'completed', color: '#4E944F', label: 'Completed' },
    ]

    return (
        props?.value
            ? <Box sx={{
                display: 'flex', flexDirection: 'column', width: '100%'
            }}>
                {progress?.map((item, index) => <Box key={index} sx={{
                    display: 'flex', width: '100%', color: item.color, justifyContent: 'center'
                }}>
                    <Typography sx={{ fontSize: 10, mr: .5, fontWeight: 600, lineHeight: '12px' }}>
                        {item?.label}
                    </Typography>
                    <Typography sx={{ fontSize: 10, fontWeight: 600, lineHeight: '12px'/* lineHeight: 20 */ }}>
                        ({((props?.value || {})[item.id]) || 0})
                    </Typography>
                </Box>)}
            </Box>
            : <Typography sx={{ textAlign: 'center', display: 'inline-flex', width: '100%', justifyContent: 'center' }}>
                ---
            </Typography>
    );
}

export default GoalsRenderer