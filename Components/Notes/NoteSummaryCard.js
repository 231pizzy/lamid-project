import { DocumentSvg, ImageSvg } from "@/public/icons/icons";
import { Box, Button, Typography } from "@mui/material";
import moment from "moment";
import ClampedText from "../ClampedText/ClampedText";
import NoteDetails from "./NoteDetails";
import { useState } from "react";
import downloadFile from '@/utils/downloadFile'
import { getFileSize } from '@/utils/getFileSize'

export default function NoteSummaryCard({ note }) {
    const [open, setOpen] = useState(false);
    const iconStyle = { height: '24px', width: '24px' };

    const iconMapping = {
        image: <ImageSvg style={iconStyle} />,
        document: <DocumentSvg style={iconStyle} />,
        video: <ImageSvg style={iconStyle} />,
        audio: <ImageSvg style={iconStyle} />,
        unknown: <ImageSvg style={iconStyle} />,
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleOpen = () => {
        setOpen(true);
    }

    const handleReply = (e) => {
        e.stopPropagation()
        setOpen(true);
    }

    const downloadAttachment = (e) => {
        e.stopPropagation();
        const data = note.attachments[0]
        downloadFile({
            bufferArray: data?.file, filename: data?.filename,
            contentType: data?.contentType
        })
    }

    return <Box sx={{ maxWidth: '100%' }}>
        <Box sx={{
            display: 'flex', flexDirection: 'column', bgcolor: 'white', ":hover": { background: '#FBFBFB' },
            borderBottom: '1px solid #1C1D221A', px: 2, py: 1.5, cursor: 'pointer', maxWidth: '100%'
        }} onClick={handleOpen}>
            {/* Title and date */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', }}>
                {/* Title */}
                <Typography sx={{ fontSize: 11, fontWeight: 700, }}>
                    {note?.title}
                </Typography>

                {/* Date */}
                <Typography sx={{ fontSize: 11, fontWeight: 600, }}>
                    {moment(note?.date, 'yyyy/MM/DD').format('DD/MM/yyyy')}
                </Typography>
            </Box>

            {/* Brief summary of message body */}
            <ClampedText value={note?.details} sx={{ fontSize: 12, py: 1 }} />

            {/* attachment and reply button */}
            <Box sx={{ display: 'flex', alignItems: 'center', maxWidth: '100%', mt: 1.5 }}>
                {/* One attachment */}
                {Boolean(note?.attachments?.length) && <Box sx={{ display: 'flex', alignItems: 'center' }}
                    onClick={downloadAttachment}>
                    {/* Icon */}
                    {iconMapping[note.attachments[0]?.fileType]}

                    {/* Filename */}
                    <Typography sx={{ fontSize: 11, fontWeight: 700, mx: 1 }}>
                        {note.attachments[0]?.filename}
                    </Typography>

                    {/* Filesize */}
                    <Typography sx={{ fontSize: 10, fontWeight: 600, color: '#8D8D8D' }}>
                        {getFileSize(note.attachments[0]?.filesize)}
                    </Typography>
                </Box>}
            </Box>

        </Box>

        <NoteDetails note={note} open={open} handleClose={handleClose}
            title={`Note`}
        />
    </Box>

}