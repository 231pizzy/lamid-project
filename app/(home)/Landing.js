'use client'

import HomeHeader from "@/Components/HomeHeader";
import HomeSideImage from "@/Components/HomeSideImage";
import { Box, } from "@mui/material";

export default function Landing({ children }) {
    return <Box sx={{
        display: 'flex', alignItems: 'flex-start', flexDirection: { xs: 'column', md: 'row' },
        overflowY: 'hidden', maxHeight: '100vh'
    }}>
        <HomeSideImage />
        <HomeHeader {...{ children }} />
    </Box>
}