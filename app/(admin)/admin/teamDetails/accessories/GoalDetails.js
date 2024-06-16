'use client'

import {
    Box, Button, IconButton, InputAdornment, Modal, OutlinedInput, Typography, CircularProgress,
} from "@mui/material";


import AddIcon from "@mui/icons-material/AddOutlined";
import NextArrow from "@mui/icons-material/KeyboardArrowRight";

import AttachmentIcon from "@mui/icons-material/Attachment";
import SendIcon from "@mui/icons-material/SendOutlined";

import PlayIcon from "@mui/icons-material/PlayArrow";

import FlagIcon from "@mui/icons-material/Flag";
import BackIcon from "@mui/icons-material/WestOutlined";


import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import { ProfileAvatar } from "@/Components/ProfileAvatar.js";

import { openSnackbar, setPageTitle } from "@/Components/redux/routeSlice.js";

import { TaskDetails } from "./TaskDetails";

import moment from "moment";
import { resetProjectGroupData, updateProjectGroupData } from "@/Components/redux/newProjectGroup";
import { getEmailAbbreviation, getTeamChats, sendFileToChat, sendGroupChat } from "../helper";
import Loader from "@/Components/Loader";
import IconElement from "@/Components/IconElement";
import { Gallery } from "./Gallery";
import { AddTask } from "./AddTask";

// import { AddGoal } from "./AddGoal";
// import { Gallery } from "./Gallery";
// import IconElement from "@/Components/IconElement";
// import { changeGoalStatus, getGoalData, sendFileToChat, sendGroupChat } from "../helper";


const CsvSvg = '/icons/CsvSvg.svg'
const ExcelSvg = '/icons/ExcelSvg.svg'
const PdfSvg = '/icons/pdfSvg.svg'
const TxtSvg = '/icons/TxtSvg.svg'

const NoMessageImg = '/images/no-message.png';

const extStyling = { width: '70px', height: '70px' }

const icon = (icon) => <IconElement {...{ src: icon, style: extStyling }} />

const messageStyles = {
    sameUser: {
        bgcolor: '#3D030314', borderRadius: '16px 0 16px 16px', border: '2px solid #1C1D221A'
    },
    differentUser: {
        bgcolor: '#F9F9F9', borderRadius: '0 16px 16px 16px', border: '2px solid #1C1D221A'
    }
}

const imageExtensions = ['png', 'jpg', 'jpeg'];
const fileExtIcons = {
    'pdf': icon(PdfSvg),
    'txt': icon(TxtSvg),
    'csv': icon(CsvSvg),
    'xlsx': icon(ExcelSvg)
}

export function GoalDetails({ goal, setShowGoalDetails }) {
    const [goalStatus, setGoalStatus] = useState(goal.goalStatus);
    const [showTaskDetails, setShowTaskDetails] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [updatedGoal, setUpdatedGoal] = useState(goal);
    const [loading, setLoading] = useState(false);
    const [chatLoading, setChatLoading] = useState(false);
    const [taskLoading, setTaskLoading] = useState(false)
    const [profileAbbreviation, setProfileAbbreviation] = useState(null);
    const [chatfiles, setFiles] = useState({})
    const [state, setState] = useState({
        message: '', chatArray: [], email: '', profilePicture: null, openGallery: false,
        files: null, chatfiles: {}
    });
    const [addnewTask, setAddNewTask]= useState(false)

        // Function to update the goal with a new task
        const updateGoalWithNewTask = (newTask) => {
            setUpdatedGoal(prevGoal => {
                const updatedTasks = [...prevGoal.tasks, newTask];
                return { ...prevGoal, tasks: updatedTasks };
            });
        };
    

    useEffect(() => {
        if (state.email) {
            const abbreviation = getEmailAbbreviation({ email: state.email });
            setProfileAbbreviation(abbreviation);
        }
        setChatLoading(true);
        handleGetTeamChats();
    }, []);

    useEffect(() => {
        if (state.files) {
            //send files to the server and remove it later
            sendFileToChat({
                teamId: goal.teamId, fileArray: state.files,
                dataProcessor: (result) => {
                    if (result) {
                        updateState({ files: null, chatArray: [...state.chatArray, result], });
                    }
                }
            })
        }
    }, [state.files])

    useEffect(() => {
        const dataSet = []
        state.chatArray.filter(item => item.file === true).map(stuff => dataSet.push(...stuff.fileDataArray))

        if (dataSet?.length) dataSet.forEach((item, index) => {
            console.log(`item ${index}`, item);
            /*  if (!chatfiles[item.fileName]) {
                 setFiles({ ...chatfiles, [item.fileName]: '/images/loading.png' }) */
            getFilePath(item.fileName)
            //  }
        })
    }, [state.chatArray])


    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    const handleGetTeamChats = () => {
        getTeamChats({
            teamId: goal.teamId,
            dataProcessor: (result) => {
                if (result) {
                    console.log("objectn results", result)
                    updateState({
                        chatArray: [...result?.chats],
                        email: result?.email,
                        profilePicture: result?.profilePicture
                    });
                    setChatLoading(false)
                }
            }
        })
    }

    const setLastDate = (chatDate) => {
        const date1 = moment(chatDate, 'yyyy-MM-DD h:mm a');
        const date2 = moment(lastDate, 'yyyy-MM-DD h:mm a')
        const theSame = date1.isSame(date2, 'date');

        lastDate = theSame ? date2 : date1

        return !theSame
    }

    const handleChangeGoalStatus = async () => {
        try {
            setLoading(true); // Start loading
            let updatedStatus;
            switch (goalStatus) {
                case 'To do':
                    updatedStatus = 'In progress';
                    break;
                case 'In progress':
                    updatedStatus = 'In review';
                    break;
                case 'In review':
                    updatedStatus = 'Completed';
                    break;
                default:
                    updatedStatus = goalStatus;
            }

            // Send a POST request to update the goal status
            const response = await fetch('/api/goals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    goalId: goal._id, // Assuming _id is the ID field of your goal object
                    newStatus: updatedStatus
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update goal status');
            }

            // Update the local state with the new status
            setGoalStatus(updatedStatus);
        } catch (error) {
            console.error('Error updating goal status:', error);
            setLoading(false);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    let lastDate = moment().format('yyyy-MM-DD h:mm a');
    const linkRegExp = /(?:https?:\/\/|www\.)[^\s/$.?#].[^\s]*/g;


    const findLink = (stringData) => {
        const matches = stringData.match(linkRegExp)

        console.log('matches', matches);
        return matches
    }
    // functions to send message
    const handleTextInput = (event) => {
        updateState({ message: event.currentTarget.value });
    }

    const handleSendChat = (event) => {
        if (state.message.length) {
            const linkArray = findLink(state.message);

            sendGroupChat({
                teamId: goal.teamId, linkArray: linkArray, link: Boolean(linkArray), message: state.message,
                dataProcessor: (result) => {
                    if (result) {
                        updateState({
                            chatArray: [...state.chatArray, result], message: ''
                        })
                    }
                }
            })
        }

    }

    const handleFileUpload = (event) => {
        const files = event.target.files;
        if (files) {
            const tmpFilesArr = Array.from({ length: files.length }).map((v, indx) => files.item(indx))
            updateState({ files: tmpFilesArr });
            setTimeout(() => {
                event.target.files = null;
            }, [100])
        }
    }

    const getFilePath = async (filename) => {
        console.log('getFilePath called', filename, chatfiles[filename]);

        !chatfiles[filename] && fetch(`/api/get-file-by-name/?folder=team-chat-files&&filename=${filename}`,
            { method: 'GET' }).then(resp => {
                resp.blob().then(blob => {
                    console.log('setting image', filename)
                    setFiles((prevFiles) => ({ ...prevFiles, [filename]: URL.createObjectURL(blob), }))
                })
            })
    }

    // render files
    const renderFiles = (fileDataArray, userIsSender) => {
        console.log('renderFiles called with:', fileDataArray);
        const styling = userIsSender ? messageStyles.sameUser : messageStyles?.differentUser;
    
        return (
            <Box sx={{
                display: 'flex', alignItems: 'center', flexWrap: 'wrap',
                px: 2, py: 1, mx: 2, maxWidth: '50%', ...styling
            }}>
                {fileDataArray.map((dataObject, index) => {
                    const src = chatfiles[dataObject.fileName] || '/images/loading.png';
                    console.log(`Rendering image with src: ${src}`);
                    return (
                        <Box key={index} sx={{ mr: 2, mb: 2 }}>
                            {imageExtensions.includes(dataObject.fileExtension) || dataObject.fileExtension === 'webp' ? (
                                <img
                                    src={src}
                                    alt="image"
                                    style={{ width: '70px', height: '70px' }}
                                />
                            ) : (
                                fileExtIcons[dataObject.fileExtension]
                            )}
                        </Box>
                    );
                })}
            </Box>
        );
    };

    // functions to send message ends here 
    const renderButton = () => {
        switch (goalStatus) {
            case 'To do':
                return (
                    <Button variant="outlined" sx={{ cursor: loading ? 'not-allowed' : 'pointer' }} disabled={loading} onClick={handleChangeGoalStatus}>
                        {loading ? <CircularProgress size={20} /> : 'Click to start the goal'}
                    </Button>
                );
            case 'In progress':
                return (
                    <Button variant="outlined" sx={{ cursor: loading ? 'not-allowed' : 'pointer' }} disabled={loading} onClick={handleChangeGoalStatus}>
                        {loading ? <CircularProgress size={20} /> : 'Move to review'}
                    </Button>
                );
            case 'In review':
                return (
                    <Button variant="outlined" sx={{ cursor: loading ? 'not-allowed' : 'pointer' }} disabled={loading} onClick={handleChangeGoalStatus}>
                        {loading ? <CircularProgress size={20} /> : 'Mark as completed'}
                    </Button>
                );
            default:
                return null; // Hide button if status is completed
        }
    };

    const getStyles = () => {
        let backgroundColor, color, border;
        switch (goalStatus) {
            case 'To do':
                backgroundColor = '#0BC5EE1A';
                color = '#0BC5EE';
                border = `1px solid #0BC5EE`;
                break;
            case 'In progress':
                backgroundColor = '#F293231A';
                color = '#F29323';
                border = `1px solid #F29323`;
                break;
            case 'In review':
                backgroundColor = '#C809C81A';
                color = '#C809C8';
                border = `1px solid #C809C8`;
                break;
            case 'Completed':
                backgroundColor = '#03B2031A';
                color = '#03B203';
                border = `1px solid #03B203`;
                break;
            default:
                backgroundColor = 'transparent';
                color = 'black';
        }
        return { backgroundColor, color, border };
    };

    const openTaskDetails = (task) => {
        setSelectedTask(task);
        setShowTaskDetails(true);
    };

    const closeTaskDetails = () => {
        setSelectedTask(null);
        setShowTaskDetails(false);
    };

    const handleChangeTaskStatus = async (task) => {
        try {
            setTaskLoading(true);
            let updatedStatus;
            switch (task.taskStatus) {
                case 'To do':
                    updatedStatus = 'In progress';
                    break;
                case 'In progress':
                    updatedStatus = 'In review';
                    break;
                case 'In review':
                    updatedStatus = 'Completed';
                    break;
                default:
                    updatedStatus = task.taskStatus;
            }

            // Send a POST request to update the task status
            const response = await fetch('/api/teamStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    goalId: goal._id, // Assuming _id is the ID field of your goal object
                    taskName: task.taskName,
                    newTaskStatus: updatedStatus
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update task status');
            }

            // Update the selected task with the new status
            setSelectedTask({ ...task, taskStatus: updatedStatus });

            // Update the task status in the updated goal
            const updatedTasks = updatedGoal.tasks.map((t) => {
                if (t.taskName === task.taskName) {
                    return { ...t, taskStatus: updatedStatus };
                }
                return t;
            });

            // Update the goal object with the updated task status
            setUpdatedGoal({ ...updatedGoal, tasks: updatedTasks });
        } catch (error) {
            console.error('Error updating task status:', error);
            setTaskLoading(false);
        } finally {
            setTaskLoading(false); // Stop loading
        }
    };


    const renderTaskButton = (task) => {
        switch (task.taskStatus) {
            case 'To do':
                return (
                    <Button variant="outlined" sx={{ cursor: loading ? 'not-allowed' : 'pointer' }} disabled={taskLoading} onClick={() => handleChangeTaskStatus(task)}>
                        {taskLoading ? <CircularProgress size={20} /> : 'Click to start the task'}
                    </Button>
                );
            case 'In progress':
                return (
                    <Button variant="outlined" sx={{ cursor: loading ? 'not-allowed' : 'pointer' }} disabled={taskLoading} onClick={() => handleChangeTaskStatus(task)}>
                        {taskLoading ? <CircularProgress size={20} /> : 'Move to review'}
                    </Button>
                );
            case 'In review':
                return (
                    <Button variant="outlined" sx={{ cursor: loading ? 'not-allowed' : 'pointer' }} disabled={taskLoading} onClick={() => handleChangeTaskStatus(task)}>
                        {taskLoading ? <CircularProgress size={20} /> : 'Mark as completed'}
                    </Button>
                );
            default:
                return null;
        }
    };

    const getTaskStyles = (task) => {
        let backgroundColor, color, border;
        switch (task.taskStatus) {
            case 'To do':
                backgroundColor = '#0BC5EE1A';
                color = '#0BC5EE';
                border = `1px solid #0BC5EE`;
                break;
            case 'In progress':
                backgroundColor = '#F293231A';
                color = '#F29323';
                border = `1px solid #F29323`;
                break;
            case 'In review':
                backgroundColor = '#C809C81A';
                color = '#C809C8';
                border = `1px solid #C809C8`;
                break;
            case 'Completed':
                backgroundColor = '#03B2031A';
                color = '#03B203';
                border = `1px solid #03B203`;
                break;
            default:
                backgroundColor = 'transparent';
                color = 'black';
        }
        return { backgroundColor, color, border };
    };

    const handleGoBack = () => {
        setShowGoalDetails(false)
    };

    const openGallery = () => {
        updateState({ openGallery: true })
    }

    const closeGallery = () => {
        updateState({ openGallery: false })
    }

    const openAddTask = () => {
        setAddNewTask(true)
    }

    const closeAddTask = () => {
        setAddNewTask(false)
    }


    return (
        <Box sx={{ maxHeight: '82vh', overflowY: 'hidden' }}>
            {/* Tool bar */}
            <Box sx={{ display: 'flex', alignItems: 'center', px: 3, py: 1.5 }}>
                {/* Back button */}
                <IconButton sx={{ bgcolor: 'white', height: 28, width: 28, mr: 3 }}
                    onClick={handleGoBack}
                >
                    <BackIcon sx={{ cursor: 'pointer', fontSize: 24, }} />
                </IconButton>

                {/* Goal  name */}
                <Typography noWrap sx={{ fontWeight: 700, fontSize: 18, mr: 4, maxWidth: 300, textTransform: 'capitalize' }}>
                    {goal.goalName}
                </Typography>

                {/* Goal status */}
                <Typography sx={{
                    fontWeight: 600, fontSize: 14,
                    maxWidth: 'max-content', px: 1, py: .2, borderRadius: '8px',
                    ...getStyles() // Apply dynamic styles based on goal status
                }}>
                    {goalStatus}
                </Typography>
                <Box sx={{ flexGrow: 1 }} />

                {/*  Due date close */}
                <Typography sx={{
                    fontWeight: 700, fontSize: 14, color: '#BF0606', bgcolor: '#BF060614',
                    display: 'flex', alignItems: 'baseline', px: 1, py: .5, borderRadius: '8px'
                }}>
                    {/* Label */}
                    Due date close
                    {/* Flag */}
                    <FlagIcon sx={{ color: '#FF0000', fontSize: 18, ml: 1 }} />
                </Typography>
            </Box>

            {/* Content */}
            {/* {
            Boolean(state.goalObject?.tasks) ? */}
            <Box sx={{
                maxHeight: '75vh', pb: 4, px: 2, pt: 2, borderTop: '2px solid #1C1D221A',
                overflowY: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between'
            }}>
                {/* Goal details */}
                <Box sx={{
                    maxWidth: { md: '30%' }, minWidth: { md: '30%' }, border: '2px solid #1C1D221A',
                    borderRadius: '16px', ml: 2
                }}>
                    {/* section 1:Heading, Goal name,goto next stage button, */}
                    <Box sx={{ borderRadius: '16px 16px 0 0' }}>
                        {/* Label and goto next stage button*/}
                        <Box sx={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1,
                            bgcolor: '#F5F5F5', borderRadius: '16px 16px 0 0'
                        }}>
                            {/* Label */}
                            <Typography sx={{ fontWeight: 700, fontSize: 15 }}>
                                GOAL DETAILS
                            </Typography>

                            {/* Goto next stage button */}
                            {renderButton()}
                        </Box>

                        {/* Goal name */}
                        <Box sx={{ px: 2, py: 2 }}>
                            {/* Label */}
                            <Typography sx={{ color: '#5D5D5D', fontSize: 15, fontWeight: 600, pb: 1 }}>
                                Name
                            </Typography>
                            {/* Value */}
                            <Typography sx={{
                                fontSize: 15, fontWeight: 500, border: '2px solid #1C1D221A', p: 1,
                                borderRadius: '8px'
                            }}>{goal.goalName}
                                {/* {state.goalObject?.goalName} */}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Section 2: Heading, add task, task list */}
                    <Box>
                        {/* Heading:Label: Tasks under goal (number of goals), add task button */}
                        <Box sx={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1,
                            bgcolor: '#F5F5F5'
                        }}>
                            {/* Label */}
                            <Typography sx={{ fontWeight: 700, fontSize: 15 }}>
                                TASKS UNDER GOAL
                                {/* {state.goalObject?.tasks?.Length} */}
                            </Typography>
                            {/* Add task button */}
                            <Button variant="text" sx={{ fontWeight: 600, fontSize: 14, p: 0 }}
                            onClick={openAddTask}
                            >
                                <AddIcon sx={{ fontSize: 15 }} />ADD TASK
                            </Button>
                        </Box>

                        {/* Task list  */}
                        <Box sx={{ p: 2, height: '40vh', overflowY: 'auto' }}>
                            {updatedGoal.tasks.map((task, index) => {
                                // const taskStatusObject = status1[task.status]
                                return <Box key={index} sx={{
                                    border: '1px solid #1C1D221A', mb: 2, borderRadius: '8px',
                                    boxShadow: '0px 6px 12px 0px #4F4F4F14'
                                }}>
                                    {/* Heading: Label: Task index  and see task progress button*/}
                                    <Box sx={{
                                        display: 'flex', alignItems: 'center',
                                        pl: 2, py: 1, bgcolor: '#F5F5F5'
                                    }}>
                                        {/* Label: Task index */}
                                        <Typography sx={{ fontSize: 15, fontWeight: 700, mr: 2 }}>
                                            Task {index + 1}
                                        </Typography>

                                        {/* Status tag */}
                                        <Typography sx={{
                                            fontWeight: 600, fontSize: 13,
                                            mr: 2, maxWidth: 'max-content', px: 1,
                                            py: .2, borderRadius: '8px', ...getTaskStyles(task)
                                        }}>
                                            {task.taskStatus}
                                        </Typography>

                                        <Box sx={{ flexGrow: 1 }} />

                                        {/* see task progress button */}
                                        <Button variant="text" sx={{
                                            p: 0, fontSize: 13, fontWeight: 600,
                                        }}
                                            onClick={() => openTaskDetails(task)}
                                        >
                                            see task progress<NextArrow sx={{ ml: -.5 }} />
                                        </Button>
                                    </Box>

                                    {/* Task name */}
                                    <Typography align="justify" sx={{ px: 2, py: 2, fontSize: 15 }}>
                                        {task.taskName}
                                    </Typography>
                                </Box>
                            })}
                        </Box>
                    </Box>
                </Box>

                {/* Chatbox */}
                <Box sx={{
                    borderRadius: '16px', width: '65%', height: '70vh', overflowY: 'hidden',
                    position: 'relative', border: '2px solid #1C1D221A', mb: 3
                }}>
                    {/* Heading */}
                    <Box sx={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#F5F5F5',
                        py: 2, px: 2, borderRadius: '16px 16px 0 0'
                    }}>
                        {/* Label: GOAL CONVERSATION */}
                        <Typography sx={{ fontWeight: 700, fontSize: 15 }}>
                            TEAM CONVERSATION
                        </Typography>

                        {/* Gallery label and icon */}
                        <Button variant="text" sx={{
                            display: 'flex', alignItems: 'center', color: 'black',
                            fontWeight: 700, fontSize: 15, py: 1,
                        }}
                            onClick={openGallery}
                        >
                            {/* Attachment icon */}
                            <AttachmentIcon sx={{ rotate: '120deg', height: 18, color: '#5D5D5D' }} />
                            {/* Label: Gallery */}
                            Gallery
                            {/* Play icon */}
                            <PlayIcon sx={{ height: 18, color: '#5D5D5D', }} />
                        </Button>
                    </Box>

                    {/* Chat zone */}
                    <Box sx={{ height: '50vh', }}>
                        <Box sx={{ height: '100%', overflowY: 'auto' }}>
                            {chatLoading ? (
                                <Loader />
                            ) : (
                                !Boolean(state.chatArray.length) ? (
                                    <Box align='center' sx={{}}>
                                        {/* No message */}
                                        <Typography sx={{ mx: 2, mb: 2, mt: 5, fontWeight: 700, fontSize: 20 }}>
                                            NO MESSAGE
                                        </Typography>

                                        {/* Image */}
                                        <img src={NoMessageImg} alt="no-message" style={{ width: '30%', height: '30%' }} />
                                    </Box>
                                ) : (
                                    <Box sx={{ p: 2 }}>

                                        {/* Render the array of chats here */}
                                        {state.chatArray.map((chatObject, index) => {
                                            const userIsSender = chatObject?.sender === state.email;
                                            const stying = userIsSender ? messageStyles.sameUser : messageStyles?.differentUser;
                                            const emailAbbreviation = getEmailAbbreviation({ email: chatObject.sender });

                                            return <Box key={index}>
                                                {/* Date */}
                                                {setLastDate(chatObject.dateTime) && <Typography noWrap sx={{
                                                    fontSize: 13, color: '#8D8D8D', py: 2, display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center', px: 2
                                                }}>
                                                    <div style={{
                                                        background: '#1C1D221A', height: '1px', width: '100%',
                                                        marginRight: '20px'
                                                    }}></div>
                                                    {moment(lastDate).format('ddd, Do MMM')}
                                                    <div style={{
                                                        background: '#1C1D221A', height: '1px', width: '100%',
                                                        marginLeft: '20px'
                                                    }}></div>
                                                </Typography>}

                                                <Box key={index} sx={{
                                                    display: 'flex', alignItems: 'center', py: 2,
                                                    flexDirection: userIsSender ? 'row-reverse' : 'row'
                                                }}>
                                                    {/* profile picture of sender */}
                                                    <Box sx={{ alignSelf: 'flex-start' }}>
                                                    <ProfileAvatar {...{
                                                            diameter: 40, fullName: emailAbbreviation, byEmail: true
                                                        }} />
                                                        
                                                    </Box>

                                                    {/*  message*/}
                                                    {chatObject?.file ? renderFiles(chatObject.fileDataArray, userIsSender) :
                                                        <Typography sx={{
                                                            px: 2, py: 1, mx: 2, maxWidth: '70%', ...stying
                                                        }}>
                                                            {chatObject.message}
                                                        </Typography>}

                                                    {/* Date */}
                                                    <Typography noWrap sx={{
                                                        fontSize: 13, color: '#8D8D8D',
                                                        alignSelf: 'flex-end', mb: 1
                                                    }}>
                                                        {moment(chatObject.dateTime, 'yyyy-MM-DD h:mm a').format('hh:mma')}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                        })}
                                    </Box>))}
                        </Box>


                        {/* Chat taxt box and send button */}
                        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 2, bgcolor: 'white', borderTop: '1px solid #1C1D221A', height: 'max-content' }}>
                            {/* Profile avatar */}
                            <img src={state.profilePicture} className="rounded-full object-cover mt-2" style={{ height: '30px', width: '30px', marginRight: "5px"}}/>

                            {/* Text box */}
                            <OutlinedInput value={state.message} placeholder="write message"
                                onChange={handleTextInput}
                                onKeyDown={(event) => { event.key === 'Enter' ? handleSendChat(event) : null }} sx={{
                                    bgcolor: '#F5F5F5',
                                    width: '100%', fontSize: 14, borderRadius: '12px'
                                }}
                                endAdornment={<InputAdornment position="end">
                                    <IconButton sx={{}} onClick={handleSendChat}>
                                        <SendIcon />
                                    </IconButton>
                                </InputAdornment>} />

                            {/* Send file */}
                            <IconButton component='label' sx={{ ml: 1 }}>
                                <AttachmentIcon sx={{ rotate: '120deg', height: 22, color: '#5D5D5D' }} />
                                <input type="file" style={{ display: 'none' }} multiple onChange={handleFileUpload} />
                            </IconButton>
                        </Box>
                    </Box>


                </Box>
            </Box >
            {/* // : <Typography align='center' sx={{ mt: 4, fontWeight: 700, fontSize: 18 }}> */}
            {/* //     Fetching data... */}
            {/* // </Typography> */}
            {/* } */}

            <Modal open={showTaskDetails} onClose={closeTaskDetails}>
                <div>
                    {selectedTask && (
                        <TaskDetails
                            task={selectedTask}
                            open={showTaskDetails}
                            onClose={closeTaskDetails}
                            goal={goal}
                            renderTaskButton={() => renderTaskButton(selectedTask)}
                        // getTaskStyles={getTaskStyles}
                        />
                    )}
                </div>
            </Modal>



   
            <Modal open={addnewTask} onClose={closeAddTask}>
                <div>
                <AddTask {...{
                    viewTitle: 'ADD NEW TASK UNDER GOAL', closeView: closeAddTask, goal: goal, updateGoal:updateGoalWithNewTask
                }} />
                </div>
            </Modal> 

            <Modal open={state.openGallery} onClose={closeGallery}>
                <div>
                    <Gallery closeView={closeGallery} goal={goal} />
                </div>
            </Modal>
        </Box>
    )
}
