'use client'

import { Box, Typography } from "@mui/material";
import moment from "moment";
import { useEffect, useRef, useState } from "react";

export default function ResourceUsageSheet({ startDate, endDate, firstTime, lastTime, timeInterval, excludeWeekends,
    maxHeight, lightColor, darkColor, gradient, type, totalAmount, }) {

    const ref = useRef(null);
    const isTime = type === 'time';

    const numberOfRows = 20;
    const entriesPerRow = 4;
    const totalAmountPerRow = totalAmount / numberOfRows;

    const [state, setState] = useState({
        selectedDate: '2023-07-28', ref: null
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    };

    useEffect(() => {
        updateState({ ref: ref })
    }, [])


    const dataList = [
        {
            date: '2023-07-28', entries: [
                { startTime: '8:00am', stopTime: '10:12am' },
                { startTime: '10:30am', stopTime: '12:42pm' },
                { startTime: '1:30pm', stopTime: '3:42pm' },
            ]
        }
    ]

    const dataList2 = [
        {
            date: '2023-07-28', entries: [
                { startTime: '8:00am', stopTime: '10:12am' },
                { startTime: '10:30am', stopTime: '12:42pm' },
                { startTime: '1:30pm', stopTime: '3:42pm' },
            ]
        }
    ]

    const generateHoursArray = ({ startTime, stopTime }) => {
        const data = {};
        const dataArray = []

        const diffInMinutes = moment(stopTime, 'h:mma').diff(moment(startTime, 'h:mma'), 'minutes');
        let remainingMinutes = diffInMinutes;

        const diffInHours = moment(stopTime, 'h:mma').diff(moment(startTime, 'h:mma'), 'hours') + 1;

        Array.from({ length: diffInHours }).forEach((v, index) => {
            /* IF hour is complete, divide the hour by 4. Else, divide by 4 find the raminder and subtract it from 60 minutes */

            /* Get minutes available in this hour.
            If remaining minutes is >= 15, subtract 15 from it.
            Else take the remaining minutes */

            const hour = moment(startTime, 'h:mma').add(index, 'hours');

            //  let availabelMinutes = moment(startTime, 'h:mma').add(index, 'hours').isSameOrBefore()

            let currentMinute = 0;
            let nextSlot = 15;


            const formattedHour = hour.format('hh:00a');
            data[formattedHour] = [];



            Array.from({ length: 4 }).forEach((value, index) => {
                const time = remainingMinutes >= 15 ? 15 : remainingMinutes;

                if (time > 0) {
                    data[formattedHour].push({ id: `${formattedHour}${nextSlot}`, time: time })
                    /*  dataArray.push({ id: `${formattedHour}${nextSlot}`, time: time }) */

                    remainingMinutes -= 15
                    nextSlot += 15


                }


                /*     const time = moment(startTime, 'h:mma').add(hour, 'hours')
    
                    const minutest = moment(stopTime, 'h:mma').isSameOrBefore(time, 'minutes') ? currentMinute -= 15
                        : moment(stopTime, 'h:mma').diff() */
            })
            currentMinute = 0;
            nextSlot = 15;
        })

        return data
    }

    const buildData = () => {
        const dataObj = {}
        dataList.forEach(data => {
            data.entries.map(item => {
                dataObj[data.date] = {
                    ...generateHoursArray({ startTime: item.startTime, stopTime: item.stopTime })
                }
            })
            return 'd'
        })

        return dataObj
    }

    const dataSet = buildData()
    console.log('buildData', dataSet)

    const selectDate = (event) => {
        updateState({ selectedDate: event.target.id })
    }

    const dates = ['2023-07-24', '2023-07-25', '2023-07-26', '2023-07-27', '2023-07-28', '2023-07-29',]
    const intervals = ['15mins', '30mins', '45mins', '1hour']
    //  const moneyIntervl =

    const timeArray = ['12:00am', ...Array.from({ length: 11 }).map((data, index) => `${index < 9 ? '0' : ''}${index + 1}:00am`),
        '12:00pm', ...Array.from({ length: 11 }).map((data, index) => `${index < 9 ? '0' : ''}${index + 1}:00pm`)]


    return <Box sx={{ px: 2, width: '100%', }}>
        {/* Toolbar */}
        <Box>
            {/* Bar 1 */}
            <Box sx={{
                display: 'flex', alignItems: 'center', height: '60px', border: '2px solid #1C1D221A',
            }}>
                {/* Date label */}
                <Typography align='center' sx={{
                    fontSize: { xs: 13, md: 14 }, fontWeight: 600, width: '120px', borderRight: '2px solid #1C1D221A',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'
                }}>
                    DATE
                </Typography>

                {/* Dates listed */}
                <Box sx={{ px: 2, display: 'flex', alignItems: 'center', py: 2, }}>
                    {dates.map((date, index) => {
                        const isSelected = moment(date, 'yyyy-MM-DD').isSame(moment(state.selectedDate, 'yyyy-MM-DD'), 'D')
                        return <Typography id={date.toString()} key={index} sx={{
                            fontSize: { xs: 13, md: 14 }, fontWeight: 500, color: isSelected ? darkColor : '#8D8D8D',
                            bgcolor: isSelected ? lightColor : '#1C1D220D', px: 1.5, py: .5, mr: 4, borderRadius: '12px',
                            border: isSelected ? `1px solid ${darkColor}` : 'none', cursor: 'pointer',
                            boxShadow: isSelected ? '0px 8px 10px 0px #0000000F' : 'none'
                        }} onClick={selectDate}>
                            {moment(date, 'yyyy-MM-DD').format('MMM Do')}
                        </Typography>
                    })}
                </Box>
            </Box>


            {/* Bar 2 */}
            <Box sx={{
                width: 'calc(100% - 12px)',
                display: 'flex', alignItems: 'center', height: '60px', border: '2px solid #1C1D221A', bgcolor: '#F3F3F3',
            }}>
                {/* Date label */}
                <Typography align='center' sx={{
                    fontSize: { xs: 13, md: 14 }, fontWeight: 600, minWidth: '120px', borderRight: '2px solid #1C1D221A',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'
                }}>
                    TIME
                </Typography>

                {/* intervals */}
                {intervals.map((interval, index) => {
                    return <Typography key={index} sx={{
                        fontSize: { xs: 13, md: 14 }, fontWeight: 600, width: '100%',
                        borderRight: '2px solid #1C1D221A', height: '100%', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                    }} >
                        {interval}
                    </Typography>
                })}
                {/*   </Box> */}
            </Box>
        </Box>

        {/* Resource usage sheet */}
        <Box sx={{ maxHeight: '500px', overflowY: 'auto', borderBottom: '2px solid #1C1D221A' }}>
            {timeArray.map((time, index) => {
                let width = 0;
                //  const resources = 

                if (dataSet[state.selectedDate]) {
                    dataSet[state.selectedDate][time]?.map(data => width += Number(data?.time))
                }

                const percent = (width / 60) * 100

                return <Box key={index} sx={{
                    display: 'flex', alignItems: 'center', height: '60px', borderLeft: '2px solid #1C1D221A', position: 'relative'
                }}>
                    {/* Time slot label */}
                    <Typography align='center' sx={{
                        fontSize: { xs: 13, md: 14 }, fontWeight: 500, minWidth: '120px', borderRight: '2px solid #1C1D221A',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'
                    }}>
                        {time}
                    </Typography>

                    {/* Resource used in this time slot on this date */}
                    <Box sx={{
                        position: 'relative', height: '100%', width: '100%', display: 'flex', alignItems: 'center'
                    }}>
                        {Array.from({ length: 4 }).map((data, index) => {
                            const theWidth = (index + 1) * 25
                            return <Box key={index} sx={{
                                width: `${theWidth}%`, height: '100%', position: 'absolute',
                                top: 0, borderRight: '2px solid #1C1D221A',
                            }}></Box>
                        })}

                        <Box sx={{
                            width: width === 0 ? '100%' : `${percent}%`,
                            background: width > 0 ? gradient /* 'linear-gradient(90deg, #257AFB 0%, #234374 100%)' */
                                : lightColor,
                            height: '40px', borderRadius: width > 0 ? '0 10px 10px 0' : 'none', position: 'relative',
                        }}>


                            {width > 0 && <Typography sx={{
                                color: 'white', position: 'absolute', right: '20px', top: '10px', fontWeight: 700, fontSize: 13
                            }}>
                                {`${width === 60 ? '1hr' : width + 'mins'}`}
                            </Typography>}
                        </Box>

                        {percent < 100 && <Box sx={{
                            width: '100%', background: lightColor, height: '40px', position: 'relative',
                        }}>

                        </Box>}
                    </Box>


                </Box>

            })}
        </Box>



    </Box>
}