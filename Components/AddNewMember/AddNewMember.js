'use client'
import { Box, Button, Modal, Typography, Slide, IconButton, InputBase, CircularProgress, Checkbox } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useState, useEffect } from "react";
import { MemberDetails } from "../CreateGoal/MemberDetails";
import { AddRoleModal } from "./AddRoleModal";
import { addNewMember } from "./helper";
import { openSnackbar } from "@/Components/redux/routeSlice";
import { useDispatch, } from "react-redux";

export default function AddNewMember({ open, handleCancel, teamId, fetchTeamData }) {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isMemberModalOpen, setMemberModalOpen] = useState(false);
    const [addRoleModal, setAddRoleModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState([]);
    console.log("roles", selectedRoles)
    const dispatch = useDispatch();




    const handleSearchInputChange = (e) => {
        setSearchText(e.target.value);
    };

    const handleSearchClick = () => {
        setIsSearching(true);
    };

    const handleCloseClick = () => {
        setSearchText('');
        setIsSearching(false);
    };

    const handleUserSelection = (userId, profilePicture, fullName) => {
        // Check if the user is already selected
        if (selectedUsers.find(user => user.userId === userId)) {
            // If selected, remove from the selectedUsers state
            setSelectedUsers(selectedUsers.filter(user => user.userId !== userId));
            setSelectedUserIds(selectedUserIds.filter(id => id !== userId));
            // Remove the user from the selectedRoles array
            setSelectedRoles(selectedRoles.filter(role => role.userId !== userId));
        } else {
            // If not selected, add to the selectedUsers state
            setSelectedUsers([...selectedUsers, { userId, profilePicture, fullName }]);
            setSelectedUserIds([...selectedUserIds, userId]);
        }
    };
    
    // Calculate total pages
    const totalPages = Math.ceil(users.length / 12);

    const nextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
    };

    // Function to handle previous page click
    const prevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
    };

    // Calculate range of displayed users
    const startIndex = currentPage * 12 + 1;
    const endIndex = Math.min((currentPage + 1) * 12, users.length);


    useEffect(() => {
        // Fetch all users from the API when the component mounts
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users');
                if (response.ok) {
                    const data = await response.json();
                    // Store the received users data in state
                    setUsers(data);
                } else {
                    console.error('Failed to fetch users:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const saveData = async () => {
        setLoading(true); 
        addNewMember({
            teamId: teamId,
            formData: selectedRoles,
            dataProcessor: (response) => {
                console.log('response', response);
                setLoading(false); 
                if (response.success) {
                    handleCancel();
                    dispatch(openSnackbar({ message: 'New member added to the team', severity: 'success' }));
                    fetchTeamData();
                } else {
                    console.error(response.message);
                    handleCancel();
                    dispatch(openSnackbar({ message: 'Member already exists in the team', severity: 'error' }));
                }
            }
        });
    };
    

    const handleAddNewMember = async () => {
        if (selectedRoles.length === 0) {
            alert('Please select at least one new member.');
        } else {
            saveData();
        }
    };

    const openMemberModal = (user) => {
        setSelectedMember(user);
        setMemberModalOpen(true);
    };

    const closeMemberModal = () => {
        setMemberModalOpen(false);
    };

    const openAddRoleModal = (user) => {
        setSelectedMember(user);
        setAddRoleModal(true);
    };

    const closeAddRoleModal = () => {
        setAddRoleModal(false)
    }

    const handleRoleSelection = (role) => {
        if (selectedMember) {
            const existingRoleIndex = selectedRoles.findIndex(entry => entry.userId === selectedMember.userId);
            if (existingRoleIndex !== -1) {
                // If a role is already selected, update it
                const updatedRoles = [...selectedRoles];
                updatedRoles[existingRoleIndex].role = role;
                setSelectedRoles(updatedRoles);
            } else {
                // If no role is selected for the user, add a new entry
                setSelectedRoles(prevRoles => [...prevRoles, { userId: selectedMember.userId, role }]);
            }
        }
        closeAddRoleModal();
    };

    return (
        <Modal open={open}>
            <Slide direction="left" in={open} mountOnEnter unmountOnExit>
                <Box sx={{
                    height: '100%', bgcolor: 'white', overflowY: 'hidden', pb: 4,
                    position: 'absolute', top: '0%', right: '0%', width: '846px',

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
                            ADD NEW MEMBER
                        </Typography>

                        <Box sx={{ flexGrow: 1 }} />
                        <Button variant="contained" sx={{ py: .5, px: 2 }} style={{ backgroundColor: '#BF0606', color: 'white' }} onClick={handleAddNewMember}>
                            {loading ? <CircularProgress size={24} style={{ color: "white" }} /> : 'Next'}
                        </Button>
                    </Box>

                    {/* Body */}
                    <div>

                        {/* STAFF CATEGORY */}
                        <div style={{ height: "500px", width: "846px", gap: "2px", }}>
                            <div style={{ width: "846px", height: "78px" }}>
                                <div style={{ height: "62px", width: "846px", gap: "10px", padding: "8px 24px 8px 24px" }} className="bg-gray-200 items-center flex justify-between">

                                    {/* staff and pagination */}
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <h2 style={{ fontWeight: "700", fontSize: "20px", lineHeight: "27.24px", color: "rgba(51, 51, 51, 1)" }}>Staff<span className="ml-2">({users.length})</span></h2>
                                        <div style={{ display: 'flex', alignItems: 'center' }} className="ml-6">
                                            <div style={{ width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }} className={`bg-gray-100 cursor-pointer mr-4 ${currentPage === 0 ? 'pointer-events-none' : ''}`} onClick={prevPage}>
                                                <ArrowBackIosIcon style={{ width: "7px", height: "12px", color: "#8D8D8D" }} />
                                            </div>
                                            <p style={{ fontWeight: "600", fontSize: "18px", lineHeight: "24.51px", color: "rgba(51, 51, 51, 1)" }}>
                                                {startIndex} - {endIndex} of {users.length}
                                            </p>
                                            <div style={{ width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }} className={`bg-gray-100 cursor-pointer ml-4 ${currentPage === totalPages - 1 ? 'pointer-events-none' : ''}`} onClick={nextPage} >
                                                <ArrowForwardIosIcon style={{ width: "7px", height: "12px", color: "#8D8D8D" }} />
                                            </div>
                                        </div>
                                    </div>


                                    {/* Search bar */}
                                    <div>
                                        {isSearching ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', borderRadius: '8px', border: '1px solid #BF0606', padding: '4px 6px 7px 6px', backgroundColor: '#FBFBFB', marginRight: "20px" }}>
                                                <IconButton onClick={handleSearchClick} sx={{ mr: { xs: 1, md: 2 } }}>
                                                    <SearchIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
                                                </IconButton>
                                                <InputBase
                                                    value={searchText}
                                                    onChange={handleSearchInputChange}
                                                    placeholder="Search"
                                                    autoFocus
                                                />
                                                <IconButton onClick={handleCloseClick} sx={{ ml: { xs: 1, md: 2 } }}>
                                                    <CloseIcon />
                                                </IconButton>
                                            </Box>
                                        ) : (
                                            <div style={{ backgroundColor: '#FBFBFB', width: "40px", height: "40px", padding: '17px 16px 17px 16px', borderRadius: '8px', marginRight: "30px", display: 'flex', justifyContent: 'center' }}>

                                                <IconButton onClick={handleSearchClick} sx={{ mr: { xs: 1, md: 2 } }}>
                                                    <SearchIcon sx={{ fontSize: { xs: 20, md: 28 } }} className="ml-4" />
                                                </IconButton>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* staff Array */}
                            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "20px", marginRight: "10px" }}>
                                {users.slice(currentPage * 12, currentPage * 12 + 12).map(user => (
                                    // .map(user => (
                                    <div key={user._id} className="" style={{ height: "82px", width: "250px", borderRadius: "12px", border: "1px solid ", padding: "8px 12px", display: "flex", alignItems: "center", gap: "16px", marginLeft: "12px", }}>
                        
                                        <Checkbox size="medium"
                                            style={{ color: selectedUsers.some(selectedUser => selectedUser.userId === user._id)? 'rgba(191, 6, 6, 1)' : 'rgba(141, 141, 141, 1)', }}
                                            onChange={() => handleUserSelection(user._id, user.profilePicture, user.fullName)} checked={selectedUsers.some(selectedUser => selectedUser.userId === user._id)}
                                        />
                                        <img src={user.profilePicture} alt="avatar" style={{ width: "40px", height: "40px", gap: "0px", borderRadius: "50%", marginRight: "5px" }} />
                                        <div>
                                            <p style={{
                                                fontFamily: "Open Sans", fontSize: "14px", fontWeight: "600", lineHeight: "20px",
                                                textAlign: "center", color: "#333333"
                                            }}>{user.fullName}</p>
                                            <p style={{
                                                fontFamily: "Open Sans", fontSize: "13px", fontWeight: "600", lineHeight: "17.7px",
                                                textAlign: "center", color: "#8D8D8D"
                                            }}>{user.role}</p>
                                            <p className="cursor pointer" style={{ fontFamily: "Open Sans", fontSize: "12px", fontWeight: "600", lineHeight: "16px", textAlign: "center", marginTop: "10px", cursor: "pointer", marginLeft: "6px", color: "red" }} onClick={() => openMemberModal(user)}>see more...</p>
                                        </div>
                                        {isMemberModalOpen && <MemberDetails open={isMemberModalOpen} onClose={closeMemberModal} member={selectedMember} />}
                                    </div>
                                ))}

                            </div>
                            {/* Assign role to staff */}
                            <div style={{ height: "62px", width: "846px", gap: "10px", padding: "8px 24px 8px 24px", marginTop: "20px", marginBottom: "20px" }} className="bg-gray-200 items-center flex justify-between">
                                <h2>Assign a role to this member</h2>
                            </div>
                            <div style={{ display: "flex" }}>
                                {selectedUsers.map(user => (
                                    <div key={user.userId} style={{ height: "78px", Width: "180px", borderRadius: "12px", alignItems: "center", padding: "8px 16px", backgroundColor: "rgba(251, 251, 251, 1)", marginLeft: "10px", border: "1px solid rgba(28, 29, 34, 0.1)" }}>
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <img src={user.profilePicture} alt="avatar" style={{ width: "35px", height: "35px", gap: "0px", borderRadius: "50%" }} />
                                            <p style={{ fontFamily: "Open Sans", fontSize: "14px", fontWeight: "600", lineHeight: "19.07px", textAlign: "center", color: "rgba(51, 51, 51, 1)", marginLeft: "10px" }}>{user.fullName}</p>
                                            {/* <CloseIcon onClick={() => handleRemoveUser(user.userId)} sx={{ cursor: 'pointer', color: '#8D8D8D', fontSize: 20, ml: 1 }} /> */}
                                        </div>
                                        <div style={{ display: "flex", color: selectedRoles.find(roleEntry => roleEntry.userId === user.userId) ? "rgba(191, 6, 6, 1)" : "rgba(141, 141, 141, 1)", marginTop: "5px", marginLeft: "10px", cursor: "pointer" }} onClick={() => openAddRoleModal(user)}>
                                            <p style={{ fontSize: "13px", fontWeight: "600", marginTop: "5px", lineHeight: "17.7px" }}>
                                                {selectedRoles.find(roleEntry => roleEntry.userId === user.userId)?.role || "Select a role"}</p>
                                            <ArrowDropDownIcon />
                                        </div>
                                        {addRoleModal && <AddRoleModal open={openAddRoleModal} onClose={closeAddRoleModal} onSelectRole={handleRoleSelection}/>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Box>
            </Slide>
        </Modal>
    );
}
