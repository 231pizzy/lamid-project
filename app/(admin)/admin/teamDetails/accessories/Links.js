'use client'

import { Box, IconButton, Slide, Tab, Tabs, Typography } from "@mui/material";

import moment from "moment";

import { useEffect, useMemo, useState } from "react";

import {getAllLinksForChat } from "../helper";


export function Links({ goal }) {

   
    //const savedFormData = useSelector(state => state.newProjectGroup.projectData);


    const [state, setState] = useState({
        openModal: false, currentTab: 0, links: []
    });


    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    useEffect(() => {
        getAllLinksForChat({goal: goal,
            dataProcessor: (result) => {
                console.log('goal chat links', result);
                if (result) {

                    const linkArr = []

                    result.forEach(resultData =>
                        resultData.linkArray.forEach(link => {
                            link = link.startsWith('www.') ? `https://${link}` : link
                            linkArr.push({
                                _id: resultData._id, dateTime: resultData.dateTime,
                                link: link,
                            })
                        }))

                    updateState({
                        links: linkArr
                    });
                }
            }
        })
    }, [])



    const groupByDate = useMemo(() => {
        const formattedObject = {}

        state.links.forEach(itemObject => {
            const date = moment(itemObject.dateTime, 'yyyy-MM-DD h:mma').format('DD/MM/yyyy').toString()
            formattedObject[date] = [...formattedObject[date] ?? [], itemObject]
        })

        return formattedObject;
    }, [state.links])

    console.log('link state', state);

    return <Box sx={{}}>
        {Object.entries(groupByDate).map(([date, dataArray], index) => {
            return <Box key={index}>
                {/* Date*/}
                <Typography sx={{ width: '100%', bgcolor: '#1C1D220F', fontWeight: 600, fontSize: 14, px: 3, py: 1 }}>
                    {date}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', px: 2, py: 1 }}>
                    {dataArray.map((dataObject, index) => {
                        return <Box align='center' key={index} sx={{ mb: 2, px: 2 }}>
                            {/* download button */}
                            <a href={dataObject?.link} target="_blank">
                                <Typography>
                                    {dataObject?.link}
                                </Typography>
                            </a>
                        </Box>
                    })}
                </Box>
            </Box>
        })}
    </Box>
}