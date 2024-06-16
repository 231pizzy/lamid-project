import { Box, Modal, Slide, Typography } from "@mui/material";
import Close from '@mui/icons-material/Close';

export default function NotificationPanel({ open, onclose, notificationList }) {
    /*   notificationList = Array.from({ length: 100 }).map((v, index) => {
          return { title: 'title', time: 'time', date: 'date', details: 'details' }
      }); */

    return <Modal open={open} onClose={onclose}>
        <Slide direction="left" in={true} mountOnEnter unmountOnExit>
            <Box sx={{
                height: '100%', bgcolor: 'white', overflowY: 'hidden', pb: 4, maxWidth: '100%',
                position: 'absolute', top: '0%', right: '0%', width: { xs: '90%', sm: '70%', md: '60%', lg: '45%', xl: '42%' },
            }} >
                {/* Heading */}
                <Box sx={{
                    display: 'flex', boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)', alignItems: 'center',
                    py: 2, px: { xs: 1.5, sm: 4 }
                }}>
                    {/* Close form */}
                    <Close onClick={onclose}
                        sx={{ cursor: 'pointer', color: '#8D8D8D', fontSize: 26, mr: 4 }} />

                    {/* Heading label */}
                    <Typography sx={{ fontWeight: 700, fontSize: { xs: 13, sm: 17, md: 18 } }}>
                        NOTIFICATIONS
                    </Typography>
                </Box>

                {/* Content */}
                {/* Notification panel: if no notification inform   the user that there is no notification */}
                <Box sx={{ pt: 2, maxHeight: `calc(100% - 80px)`, overflowY: 'auto' }}>
                    {notificationList.length ?
                        notificationList.map(item =>
                            <Box sx={{
                                maxWidth: { xs: '100%' }, bgcolor: '#D9D9D9', display: 'block',
                                color: 'black', p: 0, py: 1, px: 1, mb: 1.5, mx: 1, ':hover': { background: '#FAF0F0' }
                            }}>
                                {/* Row 1 */}
                                <Box sx={{ p: 1, py: .2, display: 'flex', justifyContent: 'space-between' }}>
                                    {/* Title */}
                                    <Typography sx={{ fontWeight: 600, fontSize: { xs: 12, md: 15 }, textTransform: 'capitalize' }}>
                                        {item.title}
                                    </Typography>
                                    {/* Date/Time */}
                                    <Typography sx={{ fontWeight: 400, fontSize: { xs: 10, md: 11 } }}>
                                        {item?.time}  {item?.date}
                                    </Typography>
                                </Box>

                                {/* Row 2 */}
                                <Typography sx={{ p: 1, py: .2, fontWeight: 500, textAlign: 'justify', fontSize: { xs: 11, md: 14 } }}>
                                    {/* Details */}
                                    {item.details}
                                </Typography>
                            </Box>)
                        :
                        <Box sx={{ maxWidth: { xs: '100%' }, }}>
                            <Typography sx={{
                                px: 1, py: 4, display: 'flex', justifyContent: 'center',
                                fontWeight: 500, fontSize: { xs: 13, md: 16 }, bgcolor: '#D9D9D9', maxWidth: '100%'
                            }}>
                                {/* Details */}
                                No notifications
                            </Typography>
                        </Box>
                    }
                </Box>

            </Box>
        </Slide>
    </Modal>

}