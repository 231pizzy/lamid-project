import { Box, CircularProgress } from "@mui/material";

export default function Loader() {
    return <Box sx={{ display: 'flex', maxWidth: '100%', my: 2, justifyContent: 'center' }}>
        <CircularProgress size={20} />
    </Box>
}