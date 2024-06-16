'use client'

import { Box, Button, IconButton, Typography } from "@mui/material";
import { DocumentSvg, ImageSvg } from "@/public/icons/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { Form, Formik } from "formik";
import * as Yup from 'yup';
import NextArrow from "@mui/icons-material/WestOutlined";
import { SubmitButton } from '@/Components/SubmitButton'
import { postRequestHandler } from '@/Components/requestHandler'
import FormTextArea from "@/Components/TextArea/TextArea";
import FormTextField from "@/Components/TextField/TextField";
import { useState } from "react";
import { getFileSize } from "../../utils/getFileSize";
import { Close } from "@mui/icons-material";
import { generateFileUpload } from "../../utils/generateFileUpload";

export default function SendEmail({ }) {
    const params = useSearchParams()

    const clientId = params.get('id')
    const email = params.get('email')
    const fullName = params.get('fullName')

    const [initialValues, setInitialValues] = useState({
        message: '', title: '', email: email || ''
    })

    const [validationSchema] = useState({
        message: Yup.string().required('Message is required'),
        title: Yup.string().required('Message title is required'),
        email: Yup.string().email('Please type a valid email address').required('Email address is required'),
    })

    const [files, setFiles] = useState([]);

    const router = useRouter();


    const goBack = () => {
        router.back()
    }


    const handleFormSubmit = async (value) => {
        await postRequestHandler({
            route: '/api/send-email',
            body: { ...value, ...generateFileUpload(files) },
            successCallback: body => {
                goBack()
            },
            errorCallback: err => {
                console.log('something went wrong', err)
            }
        })
    }

    const handleImages = (value) => {
        console.log('file upload', value);

        const fileArr = Array.from(value).map(file => {
            return {
                filename: file.name, filesize: getFileSize(file.size), file,
                extension: file.name.split('.').pop().toLowerCase()
            }
        });

        setFiles(fileArr)
    }

    const formatMapping = {
        image: ['png', 'jpg', 'jpeg', 'gif'],
        audio: ['mp3'],
        video: ['mp4'],
        document: ['pdf', 'docx', 'doc', 'txt', 'ppt', 'pptx'],
    }

    const iconStyle = { height: '24px', width: '24px' };

    const iconMapping = {
        image: <ImageSvg style={iconStyle} />,
        document: <DocumentSvg style={iconStyle} />,
        video: <ImageSvg style={iconStyle} />,
        audio: <ImageSvg style={iconStyle} />,
        unknown: <ImageSvg style={iconStyle} />,
    }

    const removeFile = (indx) => {
        setFiles(files?.filter((i, index) => indx !== index))
    }


    return <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '100%' }}>
        <Formik
            initialValues={initialValues}
            validationSchema={() => Yup.object(validationSchema)}
            onSubmit={handleFormSubmit}>
            {(formProps) => {
                return (<Form style={{ width: '100%', marginBottom: '36px' }}>
                    {/* Tool bar */}
                    < Box sx={{ bgcolor: '#F5F5F5', py: 1, px: 2, display: 'flex', alignItems: 'center', maxWidth: '100%' }}>
                        {/* Back button */}
                        < IconButton sx={{
                            mr: 2, bgcolor: 'white', border: '1.5px solid rgba(28, 29, 34, 0.1)', p: .5
                        }}
                            onClick={goBack}>
                            <NextArrow sx={{ color: '#5D5D5D', fontSize: 15 }} />
                        </IconButton >

                        {/* title */}
                        < Typography sx={{ fontSize: { xs: 13, md: 14 }, fontWeight: 700, textTransform: 'uppercase' }}>
                            New mail
                        </Typography >

                        <Box sx={{ flexGrow: 1 }} />

                        {/* Add follow up button */}
                        <SubmitButton handleSubmit={formProps.handleSubmit} isSubmitting={formProps.isSubmitting}
                            label={'Send'} variant={'contained'}
                        />
                    </Box >

                    {/* Email address */}
                    <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #1C1D221A' }}>
                        <Typography sx={{
                            fontSize: 13, fontWeight: 700, py: 2, px: 3, minWidth: 'max-content',
                            borderRight: '1px solid #1C1D221A'
                        }}>
                            Sent To:
                        </Typography>

                        {clientId
                            ? <Typography sx={{
                                fontSize: 12, fontWeight: 600, py: .5, px: 2, bgcolor: '#BF06061A', color: 'primary.main',
                                borderRadius: '16px', ml: 2
                            }}>
                                ({fullName}) {email}
                            </Typography>
                            : <Box sx={{ width: '93%' }}>
                                <FormTextField placeholder={'Email address...'} type={'email'} name='email' />
                            </Box>}
                    </Box>


                    {/* Message Title */}
                    <Box sx={{ display: 'flex', maxWidth: '100%', alignItems: 'center', borderBottom: '1px solid #1C1D221A', }}>
                        <Typography sx={{
                            fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                            px: 2, minWidth: 'max-content'
                        }}>
                            message title
                        </Typography>

                        <Box sx={{ width: '93%' }}>
                            <FormTextField placeholder={'Write title...'} name='title' />
                        </Box>
                    </Box>

                    {/* Message */}
                    <Box sx={{ py: 2, width: '100%', }}>
                        <FormTextArea handleFileUpload={handleImages}
                            includeImage={true}
                            placeholder={'Write message...'}
                            name='message'
                        />
                    </Box>

                    {/* Attachments */}
                    {files && <Box sx={{ display: 'flex', maxWidth: '100%', flexWrap: 'wrap' }}>
                        {files.map((item, index) => {
                            return <Box key={index} sx={{
                                display: 'flex', py: 1, cursor: 'pointer',
                                px: 3, alignItems: 'center'
                            }} >
                                {/* Icon */}
                                {iconMapping[Object.keys(formatMapping).find(it => formatMapping[it]?.includes(item?.extension)) || 'unknown']}

                                {/* Filename */}
                                <Typography sx={{ fontSize: 11, fontWeight: 700, mx: 1 }}>
                                    {item?.filename}
                                </Typography>

                                {/* Filesize */}
                                <Typography sx={{ fontSize: 10, mr: 2, fontWeight: 600, color: '#8D8D8D' }}>
                                    {item?.filesize}
                                </Typography>

                                <Close sx={{ fontSize: 15, cursor: 'pointer' }}
                                    onClick={() => { removeFile(index) }}
                                />
                            </Box>
                        })}
                    </Box>}
                </Form>)
            }}
        </Formik>

    </Box>
}