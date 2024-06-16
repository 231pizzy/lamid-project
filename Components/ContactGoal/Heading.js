import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material"
import { Box, Button, Typography } from "@mui/material"

export const Heading = ({ handleOpen, open, id, label, color, bgcolor }) => {
    return <Box sx={{
        display: 'flex', alignItems: 'center', bgcolor, px: 1.5, maxWidth: '100%',
        justifyContent: 'space-between', borderTop: '1px solid #1C1D221A'
    }} >
        <Typography sx={{ fontSize: 11, fontWeight: 600, color, textTransform: 'capitalize' }}>
            {label}
        </Typography>

        <Button variant="text" sx={{ fontSize: 10, fontWeight: 600, py: .2, color }}
            onClick={() => { handleOpen(id) }}>
            {open === id ? 'Close' : 'Open'}  {open === id ? <ArrowDropUp /> : <ArrowDropDown />}
        </Button>
    </Box>
}