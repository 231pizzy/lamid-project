import { Box, Button, IconButton, Typography } from "@mui/material";
import BackIcon from '@mui/icons-material/West'

export default function CreatePrivilege({ exitCreateMode, submit, privilegeObject, privilegeName }) {
    console.log('privilegeObject, privilegeName ', privilegeObject, privilegeName);

    return <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: { xs: 1, md: 1.5 }, px: { xs: 2, md: 2 },
        bgcolor: '#F5F5F5', borderBottom: '1px solid #1C1D221A',
    }}>
        <Typography sx={{
            fontSize: { xs: 14, md: 16 }, fontWeight: 700, display: 'flex', alignItems: 'center'
        }}>
            <IconButton sx={{ color: 'black', bgcolor: 'white', mr: 2, height: 28, width: 28, }}
                onClick={exitCreateMode} >
                <BackIcon sx={{ fontSize: 22 }} />
            </IconButton>
            Create new privilege
        </Typography>

        <Button variant="contained" sx={{ fontSize: { xs: 12, md: 13 } }}
            onClick={() => { submit(privilegeName, privilegeObject) }} >
            Save Privilege
        </Button>
    </Box>
}