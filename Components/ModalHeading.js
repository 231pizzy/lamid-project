import { Close } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";

export default function ModalHeading({ handleClose, title, actionArray = [] }) {
    return <Box sx={{ display: 'flex', alignItems: 'center', px: 3, py: 1.5, borderBottom: '1px solid #1C1D221A' }}>
        <IconButton sx={{ p: .2, mr: 2 }}>
            <Close sx={{ fontSize: 25, }} onClick={handleClose} />
        </IconButton>

        <Typography sx={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase' }}>
            {title}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Box>
            {actionArray.map(item => item)}
        </Box>
    </Box>
}