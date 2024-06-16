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
import SideModal from "../SideModal";

export default function CreateNote({ open, handleClose, }) {
    const params = useSearchParams()

    const clientId = params.get('id')
    const email = params.get('email')
    const fullName = params.get('fullName')

    const [initialValues, setInitialValues] = useState({
        details: '', title: '', clientId
    })

    const [validationSchema] = useState({
        details: Yup.string().required('Note details is required'),
        title: Yup.string().required('Note title is required'),
    })

    const [files, setFiles] = useState([]);

    const router = useRouter();

    const goBack = () => {
        router.back()
    }

    const handleFormSubmit = async (value) => {
        await postRequestHandler({
            route: '/api/create-contact-note',
            body: { ...value, ...generateFileUpload(files) },
            successCallback: body => {
                window.location.reload()
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

    return <Formik
        initialValues={initialValues}
        validationSchema={() => Yup.object(validationSchema)}
        onSubmit={handleFormSubmit}>
        {(formProps) => {
            return (<Form style={{ width: '100%', marginBottom: '36px' }}>
                <SideModal open={open} handleClose={handleClose} title={'Add note'}
                    actionArray={[<SubmitButton handleSubmit={formProps.handleSubmit} isSubmitting={formProps.isSubmitting}
                        label={'Save'} variant={'contained'}
                    />]}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '100%' }}>

                        {/* Message Title */}
                        <Box sx={{ display: 'flex', maxWidth: '100%', alignItems: 'center', borderBottom: '1px solid #1C1D221A', }}>
                            <Typography sx={{
                                fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                                px: 2, minWidth: 'max-content'
                            }}>
                                Note title
                            </Typography>

                            <Box sx={{ width: '93%' }}>
                                <FormTextField placeholder={'Write title...'} name='title' />
                            </Box>
                        </Box>

                        {/* Details */}
                        <Box sx={{ py: 2, width: '100%', }}>
                            <FormTextArea handleFileUpload={handleImages}
                                includeImage={true}
                                placeholder={'Write details...'}
                                name='details'
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
                    </Box>
                </SideModal>
            </Form>)
        }}
    </Formik>
}