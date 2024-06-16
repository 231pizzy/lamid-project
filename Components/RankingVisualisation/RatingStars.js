import { Star } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

export default function RatingStars({ rating, total }) {
    return <Box sx={{ display: 'flex', alignItems: 'center',/*  justifyContent: 'center' */ }}>
        {Number.isInteger(Number(rating)) ? Array.from({ length: Number(total) }).map((item, index) => {
            return <Star sx={{ fontSize: 12, color: index < Number(rating) ? '#F4CD1E' : '#1C1D221A', mr: .5 }} />
        }) : <Typography sx={{ fontSize: 10, display: 'flex', alignItems: 'center' }}>
            <Star sx={{ fontSize: 14, color: '#F4CD1E', mr: .5 }} />
            N/A
        </Typography>}
    </Box>
}