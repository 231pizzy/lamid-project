'use client'
import { Box, Modal, Typography, Slide } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

export default function StepOne({ open, handleCancel, goalName, setGoalName, handleNext }) {


    return (
        <Modal open={open}>
            <Slide direction="left" in={open} mountOnEnter unmountOnExit>
                <Box sx={{
                    height: '100%', bgcolor: 'white', overflowY: 'hidden', pb: 4,
                    position: 'absolute', top: '0%', right: '0%', width: '900px',

                }}>
                    {/* Heading */}
                    <Box sx={{
                        display: 'flex', boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)', alignItems: 'center',
                        py: 2, px: { xs: 1.5, sm: 4 }, mb: 3,
                        borderBottom: '1px solid rgba(28, 29, 34, 0.1)', bgcolor: 'white',
                    }}>
                        {/* Close form */}
                        <CloseIcon onClick={handleCancel} sx={{ cursor: 'pointer', color: '#8D8D8D', fontSize: 32, mr: 4 }} />

                        {/* Heading label */}
                        <Typography sx={{ fontWeight: 700, fontSize: { xs: 13, sm: 17, md: 18 } }}>
                            ADD GOAL
                        </Typography>

                        <Box sx={{ flexGrow: 1 }} />
                        {/* <Button variant="contained" sx={{ py: .5, px: 2 }} style={{ backgroundColor: '#BF0606', color: 'white' }} onClick={handleCreateTeam}>
                            DONE
                        </Button> */}
                    </Box>

                    {/* Body */}
                    <div style={{ width: '900px', overflowY: 'auto', maxHeight: '150vh', }}>
                        <div style={{ width: '900px', gap: '32px', top: "60px", padding: "0px 0px 64px 0px", backgroundColor: "FFFFFF" }}>
                            <div style={{ height: "64px", width: '900px', backgroundColor: "rgba(25, 211, 252, 0.1)", borderBottom: "1px solid #CCCCCC", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h2 style={{marginLeft: "50px", color: "rgba(51, 51, 51, 1)"}}>Goal</h2>
                            </div>

                            <div className="" style={{ height: '155px', width: '830px', gap: "10px" }}>
                                <div style={{ width: "735px", height: '143px', gap: "16px" }}>
                                    <p style={{marginTop: "20px", marginBottom: "6px", marginLeft: "50px", color: "rgba(51, 51, 51, 1)"}}>Goal Name</p>
                                    <input
                                        type="text"
                                        placeholder="Write goal here"
                                        value={goalName}
                                        onChange={(e) => setGoalName(e.target.value)}
                                        className="rounded-lg ml-2"
                                        style={{ height: '64px', width: '800px', borderRadius: "8px", border: "1px solid #CCCCCC",outline: "none", marginLeft: "40px", padding: "10px" }}
                                        required
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end',}}>
                                <button style={{ height: "54px", width: "140px", borderRadius: "8px", backgroundColor: "rgba(191, 6, 6, 0.1)", padding: "16px", gap: "10px", color: "rgba(191, 6, 6, 1)", marginRight: '40px' }} onClick={handleNext}>Next</button>
                            </div>

                        </div>
                    </div>
                </Box>
            </Slide>
        </Modal>
    );
}
