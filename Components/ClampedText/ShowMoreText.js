import { Box, Button, Typography } from "@mui/material";
import style from './style.module.css'
import { useState } from "react";

export default function ShowMoreText({ value, sx = {} }) {
    const [open, setOpen] = useState(false);
    const toggleOpen = () => {
        setOpen(!open)
    }

    const style = {
        WebkitBoxOrient: 'vertical',
        display: '-webkit-box',
        WebkitLineClamp: 4,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'normal',
        maxHeight: '60px'
    }

    return <Box sx={{ position: 'relative' }}>
        <Typography component={'h2'} dangerouslySetInnerHTML={{ __html: value }}
            sx={{ ...sx, ...(open ? { mb: 0, pb: 0 } : style), }} >
        </Typography>
        <Button variant="text" sx={{
            position: open ? 'relative' : 'absolute', bottom: 0, right: 0, p: 0,
            lineHeight: '10px', ":hover": { background: 'white' }, m: 0,
            fontSize: 11, minHeight: 0, bgcolor: 'white',
        }} onClick={toggleOpen}>
            {open ? 'See Less...' : 'See More...'}
        </Button>
    </Box>
}