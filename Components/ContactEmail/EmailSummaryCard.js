import { DocumentSvg, ImageSvg } from "@/public/icons/icons";
import { Box, Button, Typography } from "@mui/material";
import moment from "moment";
import ClampedText from "../ClampedText/ClampedText";
import EmailDetails from "./EmailDetails";
import { useState } from "react";
import downloadFile from '@/utils/downloadFile'
import { getFileSize } from '@/utils/getFileSize'

export default function EmailSummaryCard({ email, index, category, noReply, selected, hoverBgcolor, showSender, handleClick }) {
    const [open, setOpen] = useState(false);
    const [replying, setReplying] = useState(false);
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
        setReplying(false)
    }

    const handleOpen = () => {
        setOpen(true);
    }

    const handleReply = (e) => {
        e.stopPropagation()
        setReplying(true)
        setOpen(true);
    }

    const downloadAttachment = (e) => {
        e.stopPropagation();
        const data = email.attachments[0]
        downloadFile({
            bufferArray: data?.file, filename: data?.filename,
            contentType: data?.contentType
        })
    }

    return <Box sx={{ maxWidth: '100%' }}>
        <Box sx={{
            display: 'flex', flexDirection: 'column', bgcolor: selected ? '#BF06060A' : 'white',
            ":hover": { background: hoverBgcolor || '#FBFBFB' },
            borderBottom: '1px solid #1C1D221A', px: 2, py: 1.5, cursor: 'pointer', maxWidth: '100%'
        }} onClick={() => { handleClick ? handleClick(email, index) : handleOpen() }}>
            {/* Title and date */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', }}>
                {/* Title */}
                <Typography sx={{ fontSize: 11, fontWeight: 700, }}>
                    {email?.title}
                </Typography>

                {/* Date */}
                <Typography sx={{ fontSize: 11, fontWeight: 600, }}>
                    {moment(email?.date, 'yyyy/MM/DD').format('DD/MM/yyyy')}
                </Typography>
            </Box>

            {/* Brief summary of message body */}
            <ClampedText value={email?.text} sx={{ fontSize: 12, py: 1 }} />

            {/* attachment and reply button */}
            <Box sx={{ display: 'flex', alignItems: 'center', maxWidth: '100%', mt: 1.5, mb: .5 }}>
                {/* One attachment */}
                {Boolean(email?.attachments?.length) && <Box sx={{ display: 'flex', alignItems: 'center' }}
                    onClick={downloadAttachment}>
                    {/* Icon */}
                    {iconMapping[email.attachments[0]?.fileType]}

                    {/* Filename */}
                    <Typography sx={{ fontSize: 11, fontWeight: 700, mx: 1 }}>
                        {email.attachments[0]?.filename}
                    </Typography>

                    {/* Filesize */}
                    <Typography sx={{ fontSize: 10, fontWeight: 600, color: '#8D8D8D' }}>
                        {getFileSize(email.attachments[0]?.filesize)}
                    </Typography>
                </Box>}

                <Box sx={{ flexGrow: 1 }} />

                {/* Reply button */}
                {!noReply && email?.status === 'received' && <Button variant="text" sx={{ p: .5, fontSize: 12, fontWeight: 700 }}
                    onClick={handleReply}>
                    Reply
                </Button>}
            </Box>

            {/* Sender */}
            {showSender && <Box sx={{
                display: 'flex', alignItems: 'center', maxWidth: 'max-content', border: '1px solid #1C1D221A',
                bgcolor: '#F5F5F5', borderRadius: '8px', px: 1, py: .5, flexWrap: 'wrap'
            }}>
                <Typography sx={{ color: 'black', fontSize: 11, fontWeight: 500, mr: 1 }}>
                    {category === 'sent' ? 'Sent to:' : 'Sent By'}
                </Typography>
                <Typography sx={{ color: 'primary.main', wordBreak: 'break-all', fontSize: 11, fontWeight: 600 }}>
                    {email?.email}
                </Typography>
            </Box>}
        </Box>

        <EmailDetails isReply={replying} email={email} open={open} handleClose={handleClose}
            title={replying ? 'Reply' : `Email ${email?.status}`}
        />
    </Box>

}