import { Box, IconButton, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { ProfileAvatar } from '../ProfileAvatar';
import moment from 'moment';
import RatingStars from './RatingStars';
import Dropdown from "@/Components/DropdownField/Dropdown2"
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import AverageRating from './AverageRating';


export default function AppetiteRanking({ data }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [user, setUser] = useState('all');

    const [allUsers, setAllusers] = useState(null)

    const datax = [

        {
            name: '',
            rating: 2,
            color: 'yellow',
            isHandler: false,
            fullName: 'Daniel Paul',
            email: 'ikenna.isineyi@brilloconnetz.com',
            date: '2023/12/21',
        },
        {
            name: 'Follow up - 1',
            rating: 4,
            fullName: 'Sam Don',
            color: 'red',
            isHandler: true,
            email: 'ikenna.isineyi@brilloconnetz.com',
            date: '2023/12/21',
        },
        {
            name: null,
            rating: 4,
            fullName: '',
            color: 'transparent',
            blank: true,
            email: '',
            date: '',
        },
        {
            name: '',
            rating: 1,
            color: 'yellow',
            isHandler: false,
            fullName: 'Daniel Paul',
            email: 'ikenna.isineyi@brilloconnetz.com',
            date: '2023/12/21',
        },
        {
            name: 'Follow up - 2',
            rating: 4,
            fullName: 'Den Don',
            color: 'blue',
            isHandler: true,
            email: 'ikenna.isineyi@brilloconnetz.com',
            date: '2023/12/21',
        },
        {
            name: null,
            rating: 4,
            fullName: '',
            color: 'transparent',
            blank: true,
            email: '',
            date: '',
        },
        {
            name: '',
            rating: 3,
            color: 'yellow',
            isHandler: false,
            fullName: 'Daniel Paul',
            email: 'ikenna.isineyi@brilloconnetz.com',
            date: '2023/12/21',
        },
        {
            name: 'Follow up - 3',
            rating: 3,
            fullName: 'Den Don',
            color: 'pink',
            isHandler: true,
            email: 'ikenna.isineyi@brilloconnetz.com',
            date: '2023/12/21',
        },
        {
            name: null,
            rating: 4,
            fullName: '',
            color: 'transparent',
            blank: true,
            email: '',
            date: '',
        },
    ]

    const [dataSet, setDataSet] = useState(data.slice(currentIndex, 6))

    useEffect(() => {
        setDataSet(data?.filter(i => user === 'all' ? true : ((i?.email === user) || i?.blank)).slice(currentIndex * 6, (currentIndex + 1) * 6))
    }, [currentIndex, user])

    useEffect(() => {
        const taken = [];
        const items = []

        data?.forEach(i => {
            if (!taken.includes(`${i?.email}-${i?.isHandler}`) && !i?.blank) {
                items.push({
                    value: i?.email, label: i?.fullName, color: i?.color
                })
                taken.push(`${i?.email}-${i?.isHandler}`)
            }
        })

        setAllusers([{ value: 'all', label: 'All' }, ...items])
    }, [])

    console.log('all users', allUsers)
    const gotoPrev = () => {
        currentIndex && setCurrentIndex(currentIndex - 1)
    }

    const gotoNext = () => {
        (((currentIndex + 1) * 6) < data?.length) && setCurrentIndex(currentIndex + 1)
    }

    const selectUser = (value) => {
        setUser(value)
    }


    const CustomToolTip = ({ active, payload, label }) => {
        console.log({ active, payload, label })
        if (!active || !payload.length) return null;

        const item = payload[0].payload;

        if (item?.blank) return null;

        return <Box sx={{
            display: 'flex', flexDirection: 'column', px: 1, py: 1, bgcolor: 'white',
            borderRadius: '8px', border: '1px solid #1C1D221A', boxShadow: '0px 8px 12px 0px #0000000A'
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ProfileAvatar src={item?.email} diameter={22} byEmail={true} />
                <Box sx={{ display: 'flex', flexDirection: 'column', ml: 1 }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: item?.color, }}>
                        {item?.fullName}
                    </Typography>
                    <Typography sx={{ fontSize: 10, fontWeight: 700, }}>
                        ({item?.isHandler ? 'Handler/Rep' : 'Supervisor'})
                    </Typography>
                </Box>
            </Box>

            <Typography sx={{ fontSize: 11, fontWeight: 700, py: .4 }}>
                {moment(item?.date, 'yyyy/MM/DD').format('MMM Do, yyyy')}
            </Typography>

            <RatingStars total={4} rating={item?.rating} />
        </Box>
    }

    return <Box sx={{ width: '100%', height: '100%', }}>
        {data?.length ? <Box sx={{ width: '100%', height: '100%', }}>
            {/* Menu and summary */}
            <Box sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '100%',
                px: 2, py: 1
            }}>
                {/* Menu */}
                {allUsers && <Dropdown items={allUsers} value={user} label="All" handleItemClick={selectUser} />}

                {dataSet && <AverageRating title={`Average ${user === 'all' ? '' : `${dataSet?.find(i => i?.email === user)?.fullName}'s`} Appetite Ranking`}
                    items={dataSet} color={dataSet?.find(i => i?.email === user)?.color || '#BF0606'}
                    total={4} />}
            </Box>

            {/* Chart */}
            <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                <BarChart
                    width={350}
                    height={250}
                    data={dataSet}
                    barGap={1}
                    barCategoryGap={1}
                    margin={{
                        top: 20,
                        right: 10,
                        left: 0,
                        bottom: 20,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis allowDataOverflow={true} minTickGap={0} dataKey="name"
                        axisLine={false} tickLine={false} tickMargin={12} padding={{ right: 10, left: 10 }}
                        style={{ fontSize: '12px', textAlign: 'left', fontFamily: 'Open Sans' }}
                    />
                    <YAxis axisLine={false} tickLine={false} style={{ fontSize: '12px', fontFamily: 'Open Sans' }} />
                    <Tooltip content={<CustomToolTip />} cursor={false} />

                    <Bar dataKey='rating' >
                        {dataSet.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>

                </BarChart>

                {/* NextButton */}
                <IconButton sx={{
                    position: 'absolute', border: '1px solid #1C1D221A', bgcolor: 'white',
                    bottom: 15, left: 10, boxShadow: '0px 8px 12px 0px #0000000A', p: .5,
                }} onClick={gotoPrev}>
                    <KeyboardArrowLeft sx={{ fontSize: 16 }} />
                </IconButton>

                <IconButton sx={{
                    position: 'absolute', border: '1px solid #1C1D221A', bgcolor: 'white', p: .5,
                    bottom: 15, right: 10, boxShadow: '0px 8px 12px 0px #0000000A'
                }} onClick={gotoNext}>
                    <KeyboardArrowRight sx={{ fontSize: 16 }} />
                </IconButton>
            </Box>
        </Box>
            : <Typography sx={{ fontSize: 13, fontWeight: 600, textAlign: 'center', py: 2, px: 2 }}>
                No Appetite Ranking
            </Typography>}
    </Box>
}