'use client'

import { Box, Typography } from "@mui/material";
import IconElement from "./IconElement";

const backgroundImage = '/images/image-1.png'

export default function HomeSideImage() {
    return <Box sx={{ position: 'relative', width: { xs: '100vw', md: '50vw' }, height: { xs: 'max-content', md: '100vh' } }}>
        {/* Background Image */}

        <IconElement {...{
            src: backgroundImage, style: {
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, height: '100%', width: '100%', zIndex: 1
            }
        }} />

        {/* Overlay */}
        <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, objectFit: 'cover',
            bottom: 0, background: 'black', zIndex: 2, opacity: '80%'
        }}></div>

        {/* Write up */}
        <Box sx={{
            display: 'flex', flexDirection: 'column', height: '100%', maxWidth: { xs: '90%', md: '80%', lg: '70%' },
            justifyContent: { xs: 'space-evenly', md: 'center' }, alignItems: 'center', zIndex: 3, position: 'relative', mx: 'auto', py: { xs: 2, md: 0 }
        }}>
            {/* Company name */}
            <Typography sx={{
                fontWeight: 700, fontSize: { xs: 30, md: 40, lg: 45, xl: 50 }, color: 'white', textAlign: 'center'
            }}>
                LAMID Consulting
            </Typography>

            {/* Who we are */}
            <Typography sx={{
                fontWeight: 700, fontSize: { xs: 20, md: 20, lg: 24 }, color: '#BF0606', py: { xs: 1, md: 2 }, textAlign: 'center'
            }}>
                Who we are
            </Typography>

            {/* Content */}
            <Typography sx={{
                fontWeight: 400, textAlign: 'center', fontSize: { xs: 14, md: 16, lg: 20 }, color: 'white'
            }}>
                LAMID Consulting is the Leading business and management firm set up in 1989 to provide a suite of customized products and boutique services for growing organizations, using cutting-edge management strategies and technology            </Typography>
        </Box>
    </Box>
}