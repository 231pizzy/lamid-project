import { Star } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { ProfileAvatar } from "../ProfileAvatar";

const HandlerPerformanceRenderer = (props) => {
    return (
        props?.value
            ? <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '100%' }}>
                {props?.value?.map((item, index) => <Box key={index} sx={{
                    display: 'inline-flex', width: '100%',
                    justifyContent: 'center', alignItems: 'flex-start'
                }}>
                    <ProfileAvatar src={item?.email} byEmail={true} diameter={15} fullName={item?.name} />
                    <Typography sx={{ fontSize: 10, ml: 1, fontWeight: 700, color: 'black' }}>
                        {item?.name}
                    </Typography>
                    <Star sx={{ fontSize: 15, color: '#F4CD1E', mx: .5 }} />
                    <Typography sx={{ fontSize: 10, fontWeight: 700, color: 'black' }}>
                        {item?.rating}/4
                    </Typography>
                </Box>)}
            </Box>
            : <Typography sx={{ textAlign: 'center', display: 'inline-flex', width: '100%', justifyContent: 'center' }}>
                ---
            </Typography>
    );
}

export default HandlerPerformanceRenderer