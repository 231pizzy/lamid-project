'use client'
import { Box, Modal, Typography, Slide, OutlinedInput, Avatar, } from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
import CloseIcon from '@mui/icons-material/Close';
import { updateProjectGroupData } from "@/Components/redux/newProjectGroup";
import { useDispatch, useSelector } from "react-redux";
import { openSnackbar} from "@/Components/redux/routeSlice";
import { handleValidateName } from "./nameValidator";

const colors = [
    '#FF0000', '#00FFFF', '#0000FF', '#0000BB', '#800080', '#FFFF00', '#00FF00', '#FF00FF',
    '#808080', '#FFA500', '#A52A2A', '#800000', '#008000', '#808000', '#7FFFD4'
]

export default function StepOne({ open, handleCancel, basicData, setBasicData, handleNext }) {
    const dispatch = useDispatch();

    const ValidateName = () => {
        console.log('state at next click', basicData)
        if (basicData.name && basicData.purpose && basicData.color) {

            handleValidateName({
                value: basicData.name, category: 'projectName', dispatch: dispatch,
                errMsg: `A project already has the name ${basicData.name}. Kindly choose a different project name`,
                successCallback: () => {
                    dispatch(updateProjectGroupData({
                        update:
                            { color: basicData.color, purpose: basicData.purpose, projectName: basicData.name }
                    }))

                    handleNext();
                }
            })
        }
        else {
            dispatch(openSnackbar({ message: 'All the fields are Required', severity: 'error' }))
        }
    }


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
                        <div style={{ marginLeft: "40px" }}>
                            <h2 style={{ color: "rgba(191, 6, 6, 1)", fontWeight: "500", fontSize: "18px", lineHeight: "24.51px", marginBottom: "10px" }}>STEP - 1</h2>
                            <p style={{ color: "rgba(141, 141, 141, 1)", fontWeight: "500", fontSize: "18px", lineHeight: "24.51px" }}>Add project name, purpose, assign colour. </p>
                        </div>
                        <div>
                            <button style={{ height: "54px", width: "103px", borderRadius: "8px", backgroundColor: "rgba(191, 6, 6, 1)", padding: "16px 32px", gap: "10px", color: "rgba(255, 255, 255, 1)", marginRight: '220px' }} onClick={ValidateName}>Next</button>

                        </div>

                    </div>
                    {/* Form */}
                    <Box sx={{ mx: 'auto', width: { xs: '100%', sm: '80%', md: '50%' } }}>
                        {/* {formData.map(data => */}
                        <Box sx={{}}>
                            <Typography sx={{
                                px: 2, py: .5, fontWeight: 600, color: '#8D8D8D',
                                fontSize: { xs: 12, md: 14 }, bgcolor: '#F5F5F5', width: "640px"
                            }}>
                                NAME
                            </Typography>
                            <Box sx={{ height: 'max-content', px: { xs: 2, sm: 4 }, py: 2 }}>
                                <Typography sx={{
                                    pb: 2,
                                    fontSize: { xs: 12, md: 14 },
                                }}>
                                    Project Group Name
                                </Typography>
                                <input
                                    type="text"
                                    value={basicData.name}
                                    onChange={(e) => setBasicData('name', e.target.value)}
                                    className="rounded-lg"
                                    style={{ height: '64px', width: '574px', borderRadius: "8px", border: "2px solid rgba(28, 29, 34, 0.1)", outline: "none", padding: "10px" }}
                                    required
                                />
                            </Box>
                            {/* purpose */}
                            <Typography sx={{
                                px: 2, py: .5, fontWeight: 600, color: '#8D8D8D',
                                fontSize: { xs: 12, md: 14 }, bgcolor: '#F5F5F5', width: "640px"
                            }}>
                                PURPOSE
                            </Typography>
                            <Box sx={{ height: 'max-content', px: { xs: 2, sm: 4 }, py: 2 }}>
                                <Typography sx={{
                                    pb: 2,
                                    fontSize: { xs: 12, md: 14 },
                                }}>
                                    Project Group Purpose
                                </Typography>
                                <textarea
                                    type="text"
                                    value={basicData.purpose}
                                    onChange={(e) => setBasicData('purpose', e.target.value)}
                                    className="rounded-lg"
                                    style={{ height: '123px', width: '574px', borderRadius: "8px", border: "2px solid rgba(28, 29, 34, 0.1)", outline: "none", padding: "10px", }}
                                    required
                                />
                            </Box>

                            {/* COLOR */}
                            <Typography sx={{
                                px: 2, py: .5, fontWeight: 600, color: '#8D8D8D',
                                fontSize: { xs: 12, md: 14 }, bgcolor: '#F5F5F5', width: "640px"
                            }}>
                                PROJECT GROUP COLOR
                            </Typography>
                            <Box sx={{ height: 'max-content', px: { xs: 2, sm: 4 }, py: 2 }}>
                                <Typography sx={{
                                    pb: 2,
                                    fontSize: { xs: 12, md: 14 },
                                }}>
                                    Select color for the project group
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {/* Color grid */}
                                    {colors.map(color =>
                                        <Avatar key={color} onClick={() => setBasicData('color', color)} sx={{
                                            mr: 2, mb: 2, p: 1, width: '20px',
                                            height: '20px', bgcolor: color, border: `1px solid ${color}`
                                        }}>
                                            <CircleIcon sx={{
                                                fontSize: '20px',
                                                color: color,
                                                border: (basicData.color === color) ? "4px solid white" : `4px solid ${color}`,
                                                borderRadius: '26.66667px'
                                            }} />
                                        </Avatar>)}
                                </Box>
                            </Box>


                            {/* } */}

                            {/* </Box> */}
                        </Box>
                        {/* )} */}


                    </Box>


                </Box>
            </Slide>
        </Modal>
    );
}

// sx={{ maxWidth: '100%', maxHeight: { xs: 'calc(100vh - 5vh)', md: 'calc(100vh - 78px)' }, overflowY: 'hidden' }}