import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { Box, Button } from '@mui/material'
import { useEffect, useState } from 'react'
import AppetiteRanking from './AppetiteRanking';
import Performance from './Performance';
import { getRequestHandler } from '../requestHandler';
import AverageRating from './AverageRating';

export default function RankingVisualisation({ clientId }) {
    const [currentTab, setCurrentTab] = useState('appetite');
    const [data, setData] = useState(null);
    const [open, setOpen] = useState(true);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        getRequestHandler({
            route: `/api/get-contact-followup-data/?id=${clientId}`,
            successCallback: body => {
                setFetching(false)
                setData(body?.result)
            },
            errorCallback: err => {
                console.log('Something went wrong', err)
                setFetching(false)
            }
        })
    }, [])


    const switchRankingTab = (id) => {
        setCurrentTab(id)
    }

    const toggleRanking = () => {
        setOpen(!open)
    }


    return <Box sx={{
        border: '1px solid #1C1D221A', boxShadow: '0px 6px 12px 0px #4F4F4F14', bgcolor: '#FBFBFB', mb: 2,
        borderRadius: '16px', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden'
    }}>
        {/* Tabs */}
        <Box sx={{
            display: 'flex', borderRadius: '16px 16px 0 0', overflow: 'hidden', bgcolor: 'white',
            borderBottom: `1px solid #1C1D221A`,
        }}>
            {open ? <Box sx={{ display: 'flex', width: '100%' }}>
                {/*Appetite ranking*/}
                <Button variant="text"
                    sx={{
                        fontSize: 11, textTransform: 'uppercase', py: 1, color: 'primary.main',
                        bgcolor: currentTab === 'appetite' ? '#BF06061A' : 'white',
                        fontWeight: currentTab === 'appetite' ? 700 : 600, color: 'primary.main', width: '100%',
                        borderBottom: currentTab === 'appetite' ? '4px solid #BF0606' : `none`
                    }} onClick={() => { switchRankingTab('appetite') }}>
                    appetite ranking
                </Button>

                {/*Performance ranking*/}
                <Button variant="text"
                    sx={{
                        fontSize: 11, textTransform: 'uppercase', py: 1, color: '#257AFB',
                        bgcolor: currentTab === 'performance' ? '#257AFB1A' : 'white',
                        fontWeight: currentTab === 'performance' ? 700 : 600, width: '100%', ":hover": { background: '#257AFB10' },
                        borderBottom: currentTab === 'performance' ? '4px solid #257AFB' : `none`
                    }} onClick={() => { switchRankingTab('performance') }}>
                    handler performance
                </Button>
            </Box>
                : <Box sx={{ display: 'flex', width: '100%', py: .5 }}>
                    <Box sx={{
                        px: .5, py: .5, display: 'flex', mx: .2, width: '100%'
                    }}>
                        <AverageRating title={'Average Appetite Ranking'} fullWidth={true} bgcolor='#F6F6F6'
                            color={'#BF0606'} items={data?.followupData} total={4} />
                    </Box>
                    <Box sx={{
                        px: .5, py: .5, display: 'flex', width: '100%'
                    }}>
                        <AverageRating title={'Average Performance'} fullWidth={true} bgcolor='#F6F6F6'
                            color={'#5BB5F6'} items={data?.performanceData} total={4} />
                    </Box>
                </Box>}

            <Button variant='text' sx={{
                alignSelf: 'center', mx: 1, color: 'black', fontSize: 12, py: .5, px: 1,
            }}
                onClick={toggleRanking}>
                {open ? 'Close' : 'Open'} {open ? <ArrowDropDown /> : <ArrowDropUp />}
            </Button>
        </Box>

        {/* Tab body */}
        {/*  <AppetiteRanking data={sampleAppetiteData} /> */}
        {currentTab === 'appetite' && open && data && <AppetiteRanking data={data?.followupData} />}
        {currentTab === 'performance' && open && data && <Performance data={data?.performanceData} />}

    </Box >
}