'use client'
import { Box, Checkbox, IconButton, Modal, Button, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import { BorderBottom } from "@mui/icons-material";

// Define roles
const roles = ['Team lead', 'Accountant', 'Member', 'Supervisor'];

export function AddRoleModal({ open, onClose, onSelectRole }) {
    const [selectedRole, setSelectedRole] = useState('');

    // Function to handle role selection
    const handleRoleSelection = (role) => {
        setSelectedRole(role);
    };

    // Function to handle role selection confirmation
    const handleConfirm = () => {
        if (selectedRole !== '') {
            onSelectRole(selectedRole);
            onClose();
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                height: '340px', width: "430px", transform: 'translate(-50%,-50%)', bgcolor: 'white', borderRadius: '16px',
                position: 'absolute', top: '50%', left: '50%',
            }}>
                <div style={{ display: "flex", height: "56px", width: "430px", justifyContent: 'space-between', padding: "20px", BorderBottom: "1px solid rgba(28, 29, 34, 0.1)", backgroundColor: "rgba(249, 249, 249, 1)", alignContent: "center",position: 'relative', borderRadius: '16px 16px 0px 0px', }}>
                    {/* Modal header */}
                    <div>
                    <h2 style={{color: "rgba(51, 51, 51, 1)", fontWeight: "700",fontSize: "18px", lineHeight: "24.51px"}}>SELECT A ROLE</h2>

                    </div>
                    <div>
                    <IconButton onClick={onClose} sx={{ position: 'absolute', right: 10, top: 10, color: 'rgba(141, 141, 141, 1)' }}>
                        <CloseIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                    </div>
                </div>
                {/* Role selection buttons */}
                <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: "136px", height: '172px', gap: "10px", marginLeft: "20px", marginTop: "10px" }}>
                    {roles.map(role => (
                        <Box key={role} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Checkbox
                                size="small"
                                style={{ color: selectedRole === role ? 'rgba(191, 6, 6, 1)' : 'rgba(141, 141, 141, 1)', }}
                                checked={selectedRole === role}
                                onChange={() => handleRoleSelection(role)}
                            />
                            <Typography style={{fontWeight: "500", lineHeight: "24.51px", fontSize: "18px", color: "rgba(51, 51, 51, 1)"}}>{role}</Typography>
                        </Box>
                    ))}
                </Box>
                {/* Confirm button */}
                <Box style={{ display: 'flex', justifyContent: 'center', alignItems: "center", marginTop: "50px", backgroundColor: 'rgba(191, 6, 6, 0.08)', height: "44px", width: "391px", borderRadius: "30px", marginLeft: "19px" }}>
                    <h3 onClick={handleConfirm} style={{color: "rgba(191, 6, 6, 1)", cursor: "pointer", fontWeight: "400", fontSize: "20px", lineHeight: "27.24px"}}>Done</h3>
                </Box>
            </Box>
        </Modal>
    );
}
