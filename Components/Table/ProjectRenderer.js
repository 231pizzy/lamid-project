
import { Circle } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

const ProjectRenderer = (props) => {
    const progress = [
        { id: 'todo', color: '#257AFB', label: 'To do' },
        { id: 'inProgress', color: '#FF6C4B', label: 'In Progress' },
        { id: 'completed', color: '#4E944F', label: 'Completed' },
    ]

    return (
        props?.value
            ? <Box sx={{ display: 'inline-flex', flexDirection: 'column', maxWidth: '100%' }}>
                {props?.value?.map((item, index) => <Box key={index} sx={{
                    display: 'inline-flex', width: '100%', justifyContent: 'center', color: item.color,
                    alignItems: 'center'
                }}>
                    <Circle sx={{ fontSize: 11, color: item?.color }} />
                    <Typography sx={{ fontSize: 10, ml: .4, textTransform: 'uppercase', fontWeight: 600, }}>
                        {item?.name}
                    </Typography>
                </Box>)}
            </Box>
            : <Typography sx={{ textAlign: 'center', display: 'inline-flex', width: '100%', justifyContent: 'center' }}>
                ---
            </Typography>
    );
}

export default ProjectRenderer