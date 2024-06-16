'use client'
import { Box, Modal, Typography, Slide } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import LeftArrowIcon from '@mui/icons-material/KeyboardArrowLeft';

export default function StepTwo({ open, handleCancel, handleNext, handlePrev }) {


    return (
        <Modal open={open}>
            <Slide direction="left" in={open} mountOnEnter unmountOnExit>
                <Box sx={{ height: '100%', mt: 8, bgcolor: 'white', overflowY: 'hidden', pb: 4, position: 'absolute', top: '0%', right: '0%', width: "100%", left: 200 }}>
                    {/* Heading */}
                    <Box sx={{
                        display: 'flex', boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)', alignItems: 'center',
                        py: 2, px: { xs: 1.5, sm: 4 },
                        borderBottom: '1px solid rgba(28, 29, 34, 0.1)', bgcolor: 'rgba(246, 246, 246, 1)',
                    }}>
                        {/* Close form */}
                        <CloseIcon onClick={handleCancel} sx={{ cursor: 'pointer', color: '#8D8D8D', fontSize: 32, mr: 4 }} />

                        {/* Heading label */}
                        <Typography sx={{ fontWeight: 700, fontSize: { xs: 13, sm: 17, md: 18 } }}>
                            CREATE NEW PROJECT GROUP
                        </Typography>

                        <Box sx={{ flexGrow: 1 }} />
                    </Box>
                    <div style={{ height: "92px", backgroundColor: "rgba(191, 6, 6, 0.08)", alignItems: "center", display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                        <div style={{ display: "flex", marginLeft: "40px", alignItems: "center" }}>
                            <div>
                             <LeftArrowIcon onClick={handlePrev} sx={{ color: 'black', fontSize: 24, mr: 4, borderRadius: '26.6667px', bgcolor: 'white', cursor: "pointer" }} />
                            </div>
                            <div>
                            <h2 style={{ color: "rgba(191, 6, 6, 1)", fontWeight: "500", fontSize: "18px", lineHeight: "24.51px", marginBottom: "10px" }}>STEP-2 ( Skill set Required )</h2>
                            <p style={{ color: "rgba(141, 141, 141, 1)", fontWeight: "500", fontSize: "18px", lineHeight: "24.51px" }}>Add Skill set, educational background, field of expert and years of expience for this project group</p>
                            </div>
                        </div>
                        <div>
                            <button style={{ height: "54px", width: "98px", borderRadius: "8px", padding: "16px 32px", gap: "10px", color: "rgba(191, 6, 6, 1)", marginRight: '220px', border: "1px solid rgba(191, 6, 6, 1)" }} onClick={handleNext}>Skip</button>

                        </div>

                    </div>


                </Box>
            </Slide>
        </Modal>
    );
}