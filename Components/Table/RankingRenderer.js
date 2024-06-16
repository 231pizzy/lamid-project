import { Star } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

const RankingRenderer = (props) => {
    return (
        props?.value
            ? <Box sx={{ display: 'inline-flex', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Star sx={{ fontSize: 15, color: '#F4CD1E', mr: .5 }} />
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'black' }}>
                    {props?.value}/4
                </Typography>
            </Box>
            : <Typography sx={{ textAlign: 'center', display: 'inline-flex', width: '100%', justifyContent: 'center' }}>
                ---
            </Typography>
    );
}

export default RankingRenderer