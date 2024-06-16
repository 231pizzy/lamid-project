import { EmailAttachmentSvg, EmailSvg, FacebookAttachmentSvg, FacebookSvg, NoteAttachmentSvg, NoteSvg } from "@/public/icons/icons";
import { Box, Typography } from "@mui/material";

const AttachmentRenderer = (props) => {

    const iconStyle = { height: '16px', width: '16px', marginRight: '4px' };

    const mapping = [
        { id: 'email', double: true, icon: <EmailAttachmentSvg style={iconStyle} /> },
        { id: 'facebook', double: true, icon: <FacebookAttachmentSvg style={iconStyle} /> },
        { id: 'notes', icon: <NoteAttachmentSvg style={iconStyle} /> },
    ];

    return (
        (props?.value?.email || props?.value?.facebook || props?.value?.notes)
            ? <Box sx={{
                display: 'inline-flex', alignItems: 'center', width: '100%', justifyContent: 'space-between'
            }}>
                {mapping.map((item, index) => {
                    return <Box key={index} sx={{ display: 'flex', mr: 1, alignItems: 'center' }}>
                        {item.icon} {item.double
                            ? <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography sx={{ fontWeight: 600, fontSize: 9, color: '#19D3FC' }}>
                                    {props?.value[item.id]?.sent}
                                </Typography>
                                <Typography sx={{ fontSize: 11, color: 'black' }}>
                                    /
                                </Typography>
                                <Typography sx={{ fontWeight: 600, fontSize: 9, color: '#BF0606' }}>
                                    {props?.value[item.id]?.received}
                                </Typography>
                            </Box>
                            : <Typography sx={{ fontWeight: 600, fontSize: 9, color: 'black' }}>
                                {props?.value[item?.id]}
                            </Typography>}
                    </Box>
                })}
            </Box>
            : <Typography sx={{ textAlign: 'center', display: 'inline-flex', width: '100%', justifyContent: 'center' }}>
                ---
            </Typography>
    );
}

export default AttachmentRenderer