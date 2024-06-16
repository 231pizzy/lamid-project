import { Box, Typography } from "@mui/material";

const FollowupRenderer = (props) => {
    return (
        props?.value?.used
            ? <Box sx={{
                display: 'inline-flex', alignItems: 'center',
                justifyContent: 'center', width: '100%', maxHeight: '100%', mx: 'auto'
            }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#19D3FC' }}>
                    {props?.value?.used}
                </Typography>
                <Typography sx={{ fontSize: 12, mx: .3, fontWeight: 600, color: 'black' }}>
                    /
                </Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#BF0606' }}>
                    {props?.value?.max}
                </Typography>
            </Box>
            : <Typography sx={{ textAlign: 'center', display: 'inline-flex', width: '100%', justifyContent: 'center' }}>
                ---
            </Typography>
    );
}

export default FollowupRenderer