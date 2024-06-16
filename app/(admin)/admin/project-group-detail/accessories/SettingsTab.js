import { useEffect, useState } from "react";
import { getProjectGroupData } from "../helper";
import Loader from "@/Components/Loader";
import Prompt from "@/Components/Prompt";
import AddIcon from "@mui/icons-material/AddOutlined";
import DeleteIcon from '@mui/icons-material/Delete';

export function SettingsTab({ projectId }) {
    const [projectData, setProjectData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [teamMembers, setTeamMembers] = useState([]);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [openPrompt, setOpenPrompt] = useState(false)

    useEffect(() => {
        setLoading(true);
        getProjectGroupData({
            projectId: projectId,
            dataProcessor: (result) => {
                console.log('Fetched result:', result);
                setProjectData([result]);
                setLoading(false);

                // Extract team members from the result
                const members = [];
                result.workPhases.forEach(workPhase => {
                    workPhase.goals.forEach(goal => {
                        goal.tasks.forEach(task => {
                            task.taskMembers.forEach(member => {
                                if (!members.some(existingMember => existingMember.memberId === member.memberId)) {
                                    members.push(member);
                                }
                            });
                        });
                    });
                });

                setTeamMembers(members);
            }
        });
    }, [projectId]);

    const confirmDeleteMember = (memberId, fullName) => {
        // setOpenPrompt(true)
        // setMemberToDelete(memberId)
        // setMemberFullName(fullName);
    }

    const closeDeletePrompt = () => {
        // setOpenPrompt(false)
        // setMemberToDelete(null)
        // setMemberFullName(null);
    }

    const handleDeleteMember = async () => {
        // try {
        //     const response = await fetch(`/api/goals`, {
        //         method: 'DELETE',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             teamId,
        //             memberIdToDelete: memberToDelete,
        //         }),
        //     });

        //     if (response.ok) {
        //         fetchTeamData();
        //     } else {
        //         console.error('Failed to delete member:', response.statusText);
        //     }
        // } catch (error) {
        //     console.error('Error deleting member:', error);
        // } finally {
        //     closeDeletePrompt();
        // }
    };
    return (
        <div style={{ display: "flex", height: "792px" }}>
        {/* Side bar */}
        <div style={{ width: "198px", height: "792px", border: "1px solid rgba(28, 29, 34, 0.1)" }}>
            <div style={{ width: "198px", height: "73px", borderBottom: "1px solid rgba(28, 29, 34, 0.1)", borderRight: "1px solid rgba(28, 29, 34, 0.1)", backgroundColor: "#E5E4E2", alignContent: "center" }}>
                <p style={{ textAlign: "center", text: "#1C1D22" }}>SETTINGS</p>
            </div>
            <div style={{ width: "198px", height: "73px", borderBottom: "1px solid rgba(28, 29, 34, 0.1)", alignContent: "center" }}>
                <p style={{ textAlign: "center" }}>Profile</p>
            </div>
            <div style={{ width: "198px", height: "73px", borderBottom: "1px solid rgba(28, 29, 34, 0.1)", alignContent: "center" }}>
                <p style={{ textAlign: "center" }}>Member & privilege</p>
            </div>
        </div>

        {/* Body */}
        <div style={{ flex: "1", maxHeight: "700px", alignContent: "flex-start", alignItems: "center", overflowY: "auto", justifyContent: "center", marginTop: "30px" }}>
            {loading ? (
                <Loader /> // Display Loader when loading is true
            ) : (
                <div style={{ height: "auto", width: "1476px", display: "flex", flexWrap: "wrap", alignContent: "flex-start", marginTop: "30px"}}>
                    {/* Add member card */}
                    <div style={{ width: "192px", height: "228px", borderRadius: "16px", border: "2px dotted #BF0606", alignContent: "center", padding: "20px", backgroundColor: "#FEE3E3", marginLeft: "20px", marginBottom: "20px" }}>
                        <div style={{ width: "157px", height: "81px", top: "73px", left: "18px", gap: "16px", alignContent: "center", cursor: "pointer" }} 
                        // onClick={openModal}
                        >
                            <AddIcon sx={{ fontSize: 50, color: "#BF0606", marginLeft: "50px" }} />
                            <h3 style={{ color: "#BF0606", textAlign: "center", fontStyle: "open sars", fontWeight: "600", fontSize: "18px" }}>Add New Member</h3>
                        </div>
                        {/* <AddNewMember open={isModalOpen} handleCancel={closeModal} teamId={teamId} fetchTeamData={fetchTeamData}/> */}
                    </div>

                    {/* Team members */}
                    {teamMembers.map(member => (
                        <div key={member.memberId} style={{position: "relative", width: "261px", height: "252px", borderRadius: "16px 0px 0px 0px",  border: `1px solid ${ hoveredIndex === member.memberId? "#BF0606" : "rgba(28, 29, 34, 0.1)"}`, marginLeft: "20px", marginBottom: "20px"}}   onMouseEnter={() => setHoveredIndex(member.memberId)} onMouseLeave={() => setHoveredIndex(null)}>
                            <div style={{ width: "123px", height: "26px", top: "40px", left: "272px", borderRadius: "16px 4px 4px 0px", padding: "4px 9px", gap: "10px", backgroundColor: "rgba(3, 178, 3, 0.1)", alignContent: "center"}}>
                                <p style={{ textAlign: "center", color: "rgba(3, 178, 3, 1)" }}>{member.role}</p>
                            </div>

                            <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10px" }}>
                                <img src={member.profilePicture} alt="staff" style={{ height: "100px", width: "100px", borderRadius: "100%" }} />
                            </div>

                            <div style={{ position: "absolute", top: "20px", right: "20px" }}>
                                <DeleteIcon style={{cursor: "pointer"}} onMouseEnter={(e) => e.target.style.color = "red"} onMouseLeave={(e) => e.target.style.color = "#000"} onClick={() => confirmDeleteMember(member._id, member.fullName)}/>
                            </div>
                           <div style={{marginTop: "10px", marginBottom: "20px"}}>
                            <h2 style={{textAlign: "center", color: "#333333"}}>{member.fullName}</h2>
                           </div>
                            
                            <div style={{marginTop: "10px", marginBottom: "10px"}}>
                            <h3 style={{fontSize: "13px", fontWeight: "500", lineHeight: "19px", textAlign: "center",color: "#8D8D8D"}}>Project Group:</h3>
                            <p style={{fontSize: "14px", fontWeight: "500", lineHeight: "19px", textAlign: "center", color: "#333333"}}>{projectData[0].projectName}</p>
                            </div>
{/* 
                        <div style={{}}>
                            <h3 style={{fontSize: "13px", fontWeight: "500", lineHeight: "19px", textAlign: "center", color: "#8D8D8D"}}>Email:<span style={{fontSize: "12px", fontWeight: "500", lineHeight: "19px", color: "#333333"}}> {member.email}</span></h3>
                        </div> */}

                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* <Prompt
        open = {openPrompt}
        message = {(<span>You are about to remove this member, Remove <span style={{color: "#BF0606"}}>{memberFullName}</span> from your team</span> )}
        proceedTooltip='Alright, remove this member'
        cancelTooltip='No, do not remove this member'
        onCancel={closeDeletePrompt}
        onProceed={handleDeleteMember}
        onClose={closeDeletePrompt}
        /> */}

    </div>
    );
}





{/* <div>
<h1>Project Team Members</h1>
{loading ? <p>Loading...</p> : (
    <ul>
        {teamMembers.map(member => (
            <li key={member.memberId}>
                <img src={member.profilePicture} alt={member.fullName} width={50} height={50} />
                <span>{member.fullName} - {member.role}</span>
            </li>
        ))}
    </ul>
)}
</div> */}