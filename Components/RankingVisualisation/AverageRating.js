import { Circle, Star } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

export default function AverageRating({ title, color, bgcolor, items, total, fullWidth, grouped, full, }) {
    const getAverageRating = () => {
        const x1 = items?.filter(i => !i?.blank)
        const x = x1.reduce((acc, value) => acc + (Number.isInteger(Number(value?.rating)) ? Number(value?.rating) : 0), 0);
        console.log('values in avg rating', { x, x1 })
        return Math.floor(x / x1?.length)
    }

    const getGroupedAvgRating = (x1) => {
        //   const x1 = items?.filter(i => i?.email === email)
        const x = x1.reduce((acc, value) => acc + (Number.isInteger(Number(value?.rating)) ? Number(value?.rating) : 0), 0);
        console.log('values in avg grouped rating', { x, x1 })
        return Math.floor(x / x1?.length)
    }

    const groupedData = {};

    items.forEach(i => {
        if (i?.blank) return false;
        const email = i?.email

        groupedData[`${email}-${i?.isHandler}`] = [...(groupedData[`${email}-${i?.isHandler}`] || []), i]
    })


    return <Box sx={{
        display: 'flex', alignItems: 'center', border: '1px solid #1C1D221A', borderRadius: '8px',
        px: 1, py: .5, boxShadow: '0px 8px 12px 0px #0000000A', maxWidth: fullWidth ? '100%' : '50%',
        bgcolor: bgcolor || 'white'
    }}>
        <Typography sx={{ fontSize: 10, fontWeight: 700, mr: 1, color, textTransform: 'uppercase' }}>
            {title}
        </Typography>

        {(grouped && full) ? Object.values(groupedData)?.map((item, index) => {
            return <Typography key={index} sx={{
                fontSize: 10, display: 'flex', alignItems: 'center', bgcolor: '#F6F6F6', px: .5, py: .2,
                border: '0.5px solid #1C1D221A', borderRadius: '4px', fontWeight: 600
            }}>
                <Circle sx={{ color: item[0]?.color, fontSize: 8, mr: .2 }} />
                <Star sx={{ fontSize: 14, color: '#F4CD1E', mr: .2 }} />
                {getGroupedAvgRating(item)}/{total}
            </Typography>
        }) : <Typography sx={{ fontSize: 10, display: 'flex', alignItems: 'center', fontWeight: 600 }}>
            <Star sx={{ fontSize: 14, color: '#F4CD1E', mr: .5 }} />
            {getAverageRating()}/{total}
        </Typography>}
    </Box>
}