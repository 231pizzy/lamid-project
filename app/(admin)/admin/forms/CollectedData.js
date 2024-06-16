'use client'

import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { getFormData } from "./helper";


export default function CollectedData() {
    /*  const router = useRouter();
 
     const dispatch = useDispatch(); */

    const searchParams = useSearchParams();
    const formTitle = searchParams.get('formTitle');
    const formHeading = searchParams.get('formHeading');
    const formData = searchParams.get('formData');
    const formId = searchParams.get('formId');

    const [state, setState] = useState({
        formTitle: formTitle, formHeading: formHeading,
        formData: formData,
        formId: formId /* ?? window.location.pathname.split('/').slice(-1)[0] */
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    const fileSrc = (filename) => (process.env.NODE_ENV === 'production') ?
        `/form-files/${filename}` :
        `http://localhost:3422/form-files/${filename}`

    useEffect(() => {
        /* Set Page title */
        //  dispatch(setPageTitle({ pageTitle: 'Fill Form' }));
        getFormData({
            formId: state.formId, dataProcessor: (result) => {
                updateState({
                    formTitle: result?.formTitle,
                    formHeading: result?.formHeading, formData: result?.formData
                });
            }
        })
    }, [])

    console.log('fill form state', state);

    return <Box>
        {/* Body */}
        <Box sx={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {state.formHeading?.map((heading, index) =>
                                Boolean(heading?.heading) && <TableCell key={index}
                                    sx={{
                                        bgcolor: '#F5F5F5', borderTop: '1px solid black',
                                        borderBottom: '1px solid black'
                                    }}>
                                    {heading?.heading}
                                </TableCell>)}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {state.formData?.map((dataArray, index) =>
                            <TableRow key={index}>
                                {dataArray?.map((data, indx) => {
                                    return state.formHeading[indx]?.options ? <TableCell key={index}>
                                        {Array.isArray(data?.value) ? data?.value?.map((key, index) =>
                                            <Typography key={index}>
                                                {state.formHeading[indx]?.options.find(item => item?.key === key)?.text}
                                            </Typography>
                                        )
                                            : <Typography key={index}>
                                                {state.formHeading[indx]?.options.find(item => item?.value === data?.value)?.text}
                                            </Typography>}
                                    </TableCell>
                                        : <TableCell key={index}>
                                            {data?.file ? <a href={fileSrc(data?.value)}> File</a> : data?.value}
                                        </TableCell>
                                })}
                            </TableRow>)}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    </Box>
}