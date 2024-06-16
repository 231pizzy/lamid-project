import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";

export default function FieldSectionHeader({ label, collapsable, children }) {
    const [open, setOpen] = useState(true);

    const toggleShowAll = () => {
        setOpen(!open)
    }

    return <Box sx={{ width: '100%' }}>
        <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            bgcolor: '#F0F0F0', py: .5, width: '100%', borderBottom: '1px solid #1C1D221A',
        }}>
            <Typography sx={{
                fontSize: 13, fontWeight: 600, ml: 3,
            }}>
                {label}
            </Typography>
            {collapsable && <Button variant='text' sx={{ color: 'black', fontSize: 12, py: .5, px: 1 }}
                onClick={toggleShowAll}>
                {open ? 'Close' : 'Open'} {open ? <ArrowDropDown /> : <ArrowDropUp />}
            </Button>}
        </Box>
        <Box sx={{ width: '100%', }}>
            {open && children}
        </Box>

    </Box>
}