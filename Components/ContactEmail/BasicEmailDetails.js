import { Box, Typography } from "@mui/material";
import SideModal from "../SideModal";
import { DocumentSvg, ImageSvg } from "@/public/icons/icons";
import FieldSectionHeader from "../FieldSectionHeader";
import { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from 'yup';
import { postRequestHandler } from "../requestHandler";
import FormTextArea from "../TextArea/TextArea";
import { SubmitButton } from "../SubmitButton";
import ClampedText from "../ClampedText/ClampedText";
import ShowMoreText from "../ClampedText/ShowMoreText";
import downloadFile from "@/utils/downloadFile";
import { getFileSize } from "@/utils/getFileSize";

import { generateFileUpload } from "@/utils/generateFileUpload";
import { Close } from "@mui/icons-material";

export default function BasicEmailDetails({ email, }) {

    const [files, setFiles] = useState([]);

    const iconStyle = { height: '24px', width: '24px' };

    const iconMapping = {
        image: <ImageSvg style={iconStyle} />,
        document: <DocumentSvg style={iconStyle} />,
        video: <ImageSvg style={iconStyle} />,
        audio: <ImageSvg style={iconStyle} />,
        unknown: <ImageSvg style={iconStyle} />,
    }

    const handleImages = (value) => {
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

    const removeFile = (indx) => {
        setFiles(files?.filter((i, index) => indx !== index))
    }

    const downloadAttachment = (data) => {
        downloadFile({
            bufferArray: data?.file, filename: data?.filename,
            contentType: data?.contentType
        })
    }

    return <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {/* Title */}
        <Typography sx={{
            fontSize: 14, fontWeight: 700, textTransform: 'uppercase', py: 2, px: 3, maxWidth: '100%',
            borderBottom: '1px solid #1C1D221A', display: 'flex'
        }}>
            {email?.title}
        </Typography>

        {/* Sent to */}
        <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #1C1D221A' }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, py: 2, px: 3, borderRight: '1px solid #1C1D221A' }}>
                Sent To:
            </Typography>

            <Typography sx={{
                fontSize: 12, fontWeight: 600, py: .5, px: 2, bgcolor: '#BF06061A', color: 'primary.main',
                borderRadius: '16px', ml: 2
            }}>
                {email?.fullName && `{${email?.fullName}}`} {email?.email}
            </Typography>
        </Box>

        {/* Message */}
        <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '100%' }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, pl: 3, mb: 1, mt: 2 }}>
                Message
            </Typography>

            <Typography sx={{ fontSize: 13, px: 3, }}
                dangerouslySetInnerHTML={{ __html: email?.message }} >
            </Typography>
        </Box>

        {/* Attachments */}
        {Boolean(email?.attachments?.length) && <Box sx={{ display: 'flex', my: 2, flexDirection: 'column', maxWidth: '100%' }}>
            {email?.attachments?.map((item, index) => {
                return <Box key={index} sx={{
                    display: 'flex', py: 1, cursor: 'pointer',
                    px: 3, alignItems: 'center'
                }}
                    onClick={() => { downloadAttachment(item) }}>
                    {/* Icon */}
                    {iconMapping[item?.fileType]}

                    {/* Filename */}
                    <Typography sx={{ fontSize: 11, fontWeight: 700, mx: 1 }}>
                        {item?.filename}
                    </Typography>

                    {/* Filesize */}
                    <Typography sx={{ fontSize: 10, fontWeight: 600, color: '#8D8D8D' }}>
                        {getFileSize(item?.filesize)}
                    </Typography>
                </Box>
            })}
        </Box>}
    </Box>
}