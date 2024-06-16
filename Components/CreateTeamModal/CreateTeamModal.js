'use client'
import { Box, Button, Modal, Typography, Slide, IconButton, InputBase, CircularProgress,Checkbox } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { useState, useEffect, useRef } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable, } from "firebase/storage";
import app from '../../firebase/clientApp'
import { MemberDetails } from "../CreateGoal/MemberDetails";

const teamColors = [
    { name: 'Red', hex: '#F34610' },
    { name: 'Green', hex: '#257AFB' },
    { name: 'Blue', hex: '#F900BF' },
    { name: 'Yellow', hex: '#F900BF' },
    { name: 'Purple', hex: '#008000' },
    { name: 'Cyan', hex: '#008000' },
    { name: 'Orange', hex: '#A52A2A' },
    { name: 'Brown', hex: '#A52A2A' },
    { name: 'Indigo', hex: '#EA8FEA' },
    { name: 'Lime', hex: '#EA8FEA' },
    { name: 'Maroon', hex: '#FFA500' },
    { name: 'Navy', hex: '#FFA500' }
];

export default function CreateTeamModal({ open, handleCancel }) {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [selectedColor, setSelectedColor] = useState('');
    const [teamName, setTeamName] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [file, setFile] = useState(undefined);
    const [avatarUrl, setAvatarUrl] = useState("");
    const [fileUploadError, setFileUploadError] = useState(false);
    const [filePerc, setFilePerc] = useState(0);
    const fileRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [isMemberModalOpen, setMemberModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);

    useEffect(() => {
        if (fileRef.current) {
            // Initialize the ref after component mount
            fileRef.current.addEventListener("change", handleFileChange);
        }
        return () => {
            // Clean up event listener on unmount
            if (fileRef.current) {
                fileRef.current.removeEventListener("change", handleFileChange);
            }
        };
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };


    const handleFileUpload = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFilePerc(Math.round(progress));
            },
            (error) => {
                setFileUploadError(true);
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
                    setAvatarUrl(downloadURL)
                );
            }
        );
    };

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

    const handleColorChange = (color) => {
        setSelectedColor(color);

    };

    const handleUserSelection = (userId, avatar, fullName) => {
        // Check if the user is already selected
        if (selectedUsers.find(user => user.userId === userId)) {
            // If selected, remove from the selectedUsers state
            setSelectedUsers(selectedUsers.filter(user => user.userId !== userId));
            setSelectedUserIds(selectedUserIds.filter(id => id !== userId));
        } else {
            // If not selected, add to the selectedUsers state
            setSelectedUsers([...selectedUsers, { userId, avatar, fullName }]);
            setSelectedUserIds([...selectedUserIds, userId]);
        }
    };

    const handleRemoveUser = (userId) => {
        // Filter out the selected user from the selectedUsers state
        setSelectedUsers(selectedUsers.filter(user => user.userId !== userId));
        // Also remove the userId from selectedUserIds
        setSelectedUserIds(selectedUserIds.filter(id => id !== userId));
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

    const handleCreateTeam = async () => {
        setLoading(true)
        if (!teamName || !selectedColor || selectedUsers.length === 0) {
            alert('Please fill in all fields.');
            setLoading(false);
            return;
        }

        if (avatarUrl === "") {
            alert('Please upload a team profile photo.');
            setLoading(false);
            return;
        }

        const teamData = {
            teamAvatar: avatarUrl, // Set the team avatar if available
            name: teamName,
            color: selectedColor,
            members: selectedUserIds,
        };

        try {
            const response = await fetch('/api/teams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(teamData),
            });

            if (response.ok) {
                alert('Team created successfully!');
                window.location.href = "/admin/team";
            } else {
                alert('Failed to create team. Please try again later.');
            }
        } catch (error) {
            console.error('Error creating team:', error);
            alert('An error occurred while creating the team. Please try again later.');
            setLoading(false);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const openMemberModal = (user) => {
        setSelectedMember(user);
        setMemberModalOpen(true);
    };

    const closeMemberModal = () => {
        setMemberModalOpen(false);
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
                            CREATE NEW TEAM
                        </Typography>

                        <Box sx={{ flexGrow: 1 }} />
                        <Button variant="contained" sx={{ py: .5, px: 2 }} style={{ backgroundColor: '#BF0606', color: 'white' }} onClick={handleCreateTeam}>
                            {loading ? <CircularProgress size={24} style={{ color: "white" }} /> : 'CREATE'}
                        </Button>
                    </Box>

                    {/* Body */}
                    <div>
                        <input type="file" ref={fileRef} style={{ display: 'none' }} onChange={(e) => setFile(e.target.files[0])} />
                        <div style={{ width: '846px', gap: '24px', padding: "10px 20px 16px 40px", backgroundColor: "FFFFFF" }}>
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                <img
                                    // onClick={() => fileRef.current.click()}
                                    src={avatarUrl ? avatarUrl : "https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg"}
                                    alt="profile"
                                    className="rounded-full object-cover mt-2"
                                    style={{ height: '100px', width: '100px' }}
                                />
                                <AddAPhotoIcon onClick={() => fileRef.current.click()} className="h-8 w-8" style={{ position: 'absolute', bottom: '0', right: '0', cusor: "pointer", color: "red" }} />
                            </div>
                            <p className="text-sm self-center">
                                {fileUploadError ? (
                                    <span className="text-red-700">
                                        Error Image upload (image must be less than 3 mb)
                                    </span>
                                ) : filePerc > 0 && filePerc < 100 ? (
                                    <span className="text-green-700">{`Uploading ${filePerc}%`}</span>
                                ) : filePerc === 100 ? (
                                    <span className="text-green-700">Image successfully uploaded!</span>
                                ) : (
                                    ""
                                )}
                            </p>


                            <div className="" style={{ height: '94px', width: '766px', gap: "40px" }}>
                                <p className="mt-6 mb-2 ml-2">Team Name</p>
                                <input
                                    type="text"
                                    placeholder="  Name"
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    id="Name"
                                    className="border p-3 rounded-lg ml-2"
                                    style={{ height: '40px', width: '680px', top: "38px", borderRadius: "8px", border: "1px solid #CCCCCC" }}
                                />
                            </div>

                            {/* Team color */}
                            <div>
                                <p className="mb-2 ml-6">Select Color for the Team:</p>
                                <div className="flex gap-5 ml-6">
                                    {teamColors.map((color, index) => (
                                        <div key={index} onClick={() => handleColorChange(color.hex)} style={{ position: 'relative' }}>
                                            <div style={{ width: '30px', height: '30px', backgroundColor: color.hex, borderRadius: '50%', marginRight: '10px', position: 'relative' }}>
                                                {selectedColor === color.hex && (
                                                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '15px', height: '15px', backgroundColor: '#FFFFFF', borderRadius: '50%' }}></div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Display selected color */}
                            {/* {selectedColor && (
                                <div className="flex justify-center items-center mb-2">
                                    <p className="mt-2 mb-3 ml-6">Selected Color:</p>
                                    <div className="ml-6 mt-6 mb-2">
                                        <div style={{ width: '30px', height: '30px', backgroundColor: selectedColor, borderRadius: '50%', marginRight: '10px' }}></div>
                                    </div>
                                </div>
                            )} */}
                        </div>

                        {/* STAFF CATEGORY */}
                        <div style={{ height: "500px", width: "846px", gap: "2px", }}>
                            <div style={{ width: "846px", height: "140px" }}>
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

                                {/* Selected staff div */}
                                <div style={{ height: "55px", display: "flex", overflowX: "auto", alignItems: "center", backgroundColor: "#FFF6F6" }}>
                                    {selectedUsers.map(user => (
                                        <div key={user._id} style={{ height: "47px", minWidth: "200px", flexShrink: 0, display: "flex", alignItems: "center", borderRadius: "8px", padding: "0 10px", backgroundColor: "#FBFBFB", marginLeft: "10px" }}>
                                            <img src={user.profilePicture} alt="avatar" style={{
                                                width: "35px",
                                                height: "35px",
                                                gap: "0px",
                                                borderRadius: "50%", // To make it a circular avatar
                                            }} />
                                            <p style={{
                                                fontFamily: "Open Sans",
                                                fontSize: "12px",
                                                fontWeight: "600",
                                                lineHeight: "20px",
                                                textAlign: "center",
                                                color: "#333333",
                                                marginLeft: "5px"
                                            }}>{user.fullName}</p>
                                            <CloseIcon onClick={() => handleRemoveUser(user.userId)} sx={{ cursor: 'pointer', color: '#8D8D8D', fontSize: 20, ml: 1 }} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* staff Array */}
                            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "20px", marginRight: "10px" }}>
                                {users.slice(currentPage * 12, currentPage * 12 + 12).map(user => (
                                    <div key={user._id} className="" style={{ height: "82px", width: "250px", borderRadius: "12px", border: "1px solid ", padding: "8px 12px", display: "flex", alignItems: "center", gap: "10px", marginLeft: "12px", }}>
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



                        </div>
                    </div>
                </Box>
            </Slide>
        </Modal>
    );
}
