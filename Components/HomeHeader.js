'use client'

import { Box, Typography } from "@mui/material";
import IconElement from "./IconElement";
import { usePathname, useRouter } from "next/navigation";

import BackIcon from '@mui/icons-material/West';

const lamidLogo = '/images/lamidLargeLogo.png';

export default function HomeHeader({ children }) {
    const pathname = usePathname();
    const router = useRouter();

    const goback = () => {
        router.back();
    }

    const getPageName = () => {
        let pageName = '';
        switch (pathname) {
            case '/login':
                pageName = 'Sign In';
                break;
            case '/receive-otp':
                pageName = 'Forgot Password';
                break;
            case '/input-otp':
                pageName = 'Email Verification';
                break;
            case '/new-password':
                pageName = 'Create Password';
                break;
        }

        return pageName;
    }


    return <Box sx={{
        display: 'flex', flexDirection: 'column', mx: 'auto', height: { xs: '65vh', md: '100vh' }, position: 'relative',
        justifyContent: 'center', alignItems: 'center', p: 4, width: { xs: '80vw', sm: '80vw', md: '30vw' }
    }}>
        {(pathname === '/input-otp' || pathname === '/new-password') &&
            <BackIcon onClick={goback} sx={{ position: 'absolute', left: '0', top: '100px', fontSize: 40, cursor: 'pointer' }} />}
        {/* Logo */}
        <Box sx={{
            height: { xs: '36vw', sm: '27vw', md: '170px', lg: '200px' },
            width: { xs: '40vw', sm: '30vw', md: '200px', lg: '250px' }
        }}>
            <IconElement {...{ src: lamidLogo, style: { height: '100%', width: '100%' } }} />
        </Box>


        {/* Page name */}
        <Typography sx={{
            textTransform: 'capitalize', mt: 2, fontSize: { xs: 16, md: 18, lg: 20 }, fontWeight: 700, color: '#BF0606'
        }}>
            {getPageName()}
        </Typography>

        {/* Children */}
        <Box sx={{ mt: 2, width: { xs: '100%', sm: '80%', md: '70%' }, }}>
            {children}
        </Box>

    </Box>
}