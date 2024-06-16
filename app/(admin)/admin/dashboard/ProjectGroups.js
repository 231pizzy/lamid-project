// import { Avatar, Box, Button, Card, Grid, Typography, lighten } from "@mui/material";

// import NextArrow from "@mui/icons-material/KeyboardArrowRight";
// import CircleIcon from "@mui/icons-material/Circle";
// import TodoIcon from "@mui/icons-material/ThumbUpOutlined";
// import InProgressIcon from "@mui/icons-material/NearMeOutlined";
// import ReviewIcon from "@mui/icons-material/StarOutline";
// import CompletedIcon from "@mui/icons-material/CheckOutlined";

// export default function ProjectGroups({ goalStatusData, gotoProjectGroup, gotoPage }) {

//     return <Grid item xs={12} sx={{ mt: 4 }}>

//         <Box sx={{
//             borderRadius: '16px', boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)',
//             width: '100%', maxWidth: '100%', bgcolor: '#FFFFFF',
//             border: '1px solid rgba(28, 29, 34, 0.1)', pb: 1,
//         }}>
//             <Box sx={{ display: 'flex', justifyContent: 'center', py: 1.5, px: 2, alignItems: 'center' }}>
//                 <Typography noWrap sx={{ fontWeight: 700 }}>
//                     PROJECT GROUP
//                 </Typography>
//                 <Box sx={{ flexGrow: 1 }} />

//                 <Button id='/admin/project-group' sx={{ fontSize: { xs: 12, sm: 14 } }}
//                     onClick={gotoPage}>
//                     Go to Group
//                     <NextArrow fontSize="small" sx={{ ml: -.5 }} />
//                 </Button>
//             </Box>

//             <Box sx={{
//                 borderTop: '1px solid rgba(28, 29, 34, 0.1)',
//                 'borderRadius': '0px 0px 16px 16px', pb: 2, '&::-webkit-scrollbar': { width: 0 },
//                 maxHeight: '270px', overflowY: 'scroll'
//             }}>
//                 {/* Project groups */}
//                 {Boolean(Object.keys(goalStatusData).length) && <Grid container sx={{ px: 1, }}>
//                     {Object.entries(goalStatusData).map(([groupName, groupObj], index) => {

//                         return <Grid key={index} item xs={12} md={6} lg={4} xl={3} sx={{ mt: 2, }} spacing={1}>
//                             <Card sx={{
//                                 width: { xs: '100%', md: '300px', lg: '300px' },
//                                 borderBottom: '1px solid rgba(28, 29, 34, 0.1)',
//                                 borderRadius: '16px',
//                             }}>
//                                 {/* Heading */}
//                                 <Typography noWrap sx={{
//                                     px: 1, py: 1, display: 'flex', alignItems: 'center',
//                                     fontSize: { xs: 12, md: 13 }, background: 'rgba(243, 70, 16, 0.1)',
//                                     fontWeight: 500, textTransform: 'uppercase', bgcolor: lighten(groupObj.color, 0.9)
//                                 }}>
//                                     <CircleIcon fontSize="small"
//                                         sx={{ mr: .5, height: 16, color: groupObj.color }} />

//                                     {groupName}

//                                     <Box sx={{ flexGrow: 1 }} />

//                                     <Button sx={{ p: 0 }} id={groupObj.projectId}
//                                         onClick={() => {
//                                             gotoProjectGroup({
//                                                 id: groupObj?.projectId,
//                                                 name: groupName, color: groupObj?.color
//                                             })
//                                         }}>
//                                         <Typography noWrap
//                                             sx={{ fontWeight: 600, fontSize: { xs: 11, sm: 11 } }}>
//                                             Go to project group
//                                         </Typography>
//                                         <NextArrow fontSize="small" sx={{ ml: -.5 }} />
//                                     </Button>
//                                 </Typography>


//                                 {/* Body */}
//                                 <Grid container  >
//                                     <Grid item xs={6} >
//                                         <Typography noWrap sx={{
//                                             pl: 3, py: 1,
//                                             color: '#333333', fontSize: { xs: 12, sm: 13 },
//                                             display: 'flex', alignItems: 'center'
//                                         }}>
//                                             <Avatar sx={{
//                                                 mr: 1.5,
//                                                 height: '24px', width: '24px',
//                                                 background: 'rgba(25, 211, 252, 0.2)', border: '0.675px solid #19D3FC'
//                                             }}>
//                                                 <TodoIcon fontSize="small" sx={{ height: 16, width: 16, color: '#19D3FC' }} />
//                                             </Avatar>
//                                             To do ({groupObj.toDo})
//                                         </Typography>
//                                     </Grid>

//                                     <Grid item xs={6}>
//                                         <Typography noWrap sx={{
//                                             pr: 2, py: 1, fontSize: { xs: 12, sm: 13 },
//                                             display: 'flex', alignItems: 'center'
//                                         }}>
//                                             <Avatar sx={{
//                                                 mr: 1.5,
//                                                 height: '24px', width: '24px', background: 'rgba(242, 147, 35, 0.2)',
//                                                 border: '0.675px solid #F29323'
//                                             }}>
//                                                 <InProgressIcon fontSize="small"
//                                                     sx={{ height: 16, width: 16, color: '#F29323' }} />
//                                             </Avatar>
//                                             In progress ({groupObj.inProgress})
//                                         </Typography>
//                                     </Grid>

//                                     <Grid item xs={6}>
//                                         <Typography noWrap sx={{
//                                             pl: 3, py: 1, color: '#333333',
//                                             fontSize: { xs: 12, sm: 13 },
//                                             display: 'flex', alignItems: 'center'
//                                         }}>
//                                             <Avatar sx={{
//                                                 mr: 1.5,
//                                                 height: '24px', width: '24px', background: 'rgba(200, 9, 200, 0.2)',
//                                                 border: '0.675px solid #C809C8'
//                                             }}>
//                                                 <ReviewIcon fontSize="small"
//                                                     sx={{ height: 16, width: 16, color: '#C809C8' }} />
//                                             </Avatar>
//                                             Review ({groupObj.review})
//                                         </Typography>
//                                     </Grid>

//                                     <Grid item xs={6}>
//                                         <Typography noWrap sx={{
//                                             pr: 2, py: 1, fontSize: { xs: 12, sm: 13 },
//                                             display: 'flex', alignItems: 'center'
//                                         }}>
//                                             <Avatar sx={{
//                                                 mr: 1.5,
//                                                 height: '24px', width: '24px', background: 'rgba(3, 178, 3, 0.2)',
//                                                 border: '0.675px solid #03B203'
//                                             }}>
//                                                 <CompletedIcon fontSize="small"
//                                                     sx={{ height: 16, width: 16, color: '#03B203' }} />
//                                             </Avatar>
//                                             Completed ({groupObj.completed})
//                                         </Typography>
//                                     </Grid>
//                                 </Grid>

//                             </Card>

//                         </Grid>
//                     }
//                     )}
//                 </Grid>}
//             </Box>
//         </Box>
//     </Grid>
// }

'use client'
import { Avatar, Box, Button, Card, Grid, Typography, lighten } from "@mui/material";
import NextArrow from "@mui/icons-material/KeyboardArrowRight";
import CircleIcon from "@mui/icons-material/Circle";
import TodoIcon from "@mui/icons-material/ThumbUpOutlined";
import InProgressIcon from "@mui/icons-material/NearMeOutlined";
import ReviewIcon from "@mui/icons-material/StarOutline";
import CompletedIcon from "@mui/icons-material/CheckOutlined";
import { useRouter } from "next/navigation.js";
import { useEffect, useState } from "react";

export default function ProjectGroups({ goalStatusData, gotoPage }) {
    const [projectGroups, setProjectGroups] = useState([])
    const [loading, setLoading] = useState(false)
    const router = useRouter();

    useEffect(() => {
        const fetchProjectGroups = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/get-all-project-group`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.result && Array.isArray(data.data)) {
                        setProjectGroups(data.data); // Correctly set the project groups array
                    } else {
                        console.error('Data is not an array or result is false:', data);
                        setProjectGroups([]); // Set to empty array in case of incorrect data
                    }
                } else {
                    console.error('Failed to fetch project groups');
                }
            } catch (error) {
                console.error('Error fetching project groups:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectGroups();
    }, []);

    const countTasksByStatus = (project, status) => {
        return project.workPhases.reduce((count, phase) => {
            return count + phase.goals.reduce((goalCount, goal) => {
                return goalCount + goal.tasks.filter(task => task.taskStatus === status).length;
            }, 0);
        }, 0);
    };

    const gotoProjectGroup = (data) => {
        if (data?.id) {
            router.push(`/admin/project-group-detail/?projectId=${data?.id}&&projectName=${data?.name}&&projectColor=${encodeURIComponent(data?.color)}`)
        }
    }

    return <Grid item xs={12} sx={{ mt: 4 }}>
        <Box sx={{
            borderRadius: '16px', boxShadow: '0px 6px 12px rgba(79, 79, 79, 0.08)',
            width: '100%', maxWidth: '100%', bgcolor: '#FFFFFF',
            border: '1px solid rgba(28, 29, 34, 0.1)', pb: 1,
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 1.5, px: 2, alignItems: 'center' }}>
                <Typography noWrap sx={{ fontWeight: 700 }}>
                    PROJECT GROUP
                </Typography>
                <Box sx={{ flexGrow: 1 }} />

                <Button id='/admin/project-group' sx={{ fontSize: { xs: 12, sm: 14 } }}
                    onClick={gotoPage}>
                    Go to Group
                    <NextArrow fontSize="small" sx={{ ml: -.5 }} />
                </Button>
            </Box>

            <Box sx={{
                 borderTop: '1px solid rgba(28, 29, 34, 0.1)',
                 'borderRadius': '0px 0px 16px 16px', pb: 2, '&::-webkit-scrollbar': { width: 0 },
                 maxHeight: '270px', overflowY: 'scroll'
           }}>

            <div style={{ maxHeight: '200px', paddingBottom: "10px", overflowY: 'auto', display: "flex", gap: '10px' }} >
                {!loading && projectGroups.map((project, index) => (
                    <Grid key={index} item xs={12} md={6} lg={4} xl={3} sx={{ mt: 2 }}>
                        <Card sx={{
                            width: { xs: '100%', md: '300px', xl: '300px' },
                            borderBottom: '1px solid rgba(28, 29, 34, 0.1)',
                            borderRadius: '16px',
                        }}>
                            {/* Heading */}
                            <Typography noWrap sx={{
                                px: 1, py: 1, display: 'flex', alignItems: 'center',
                                fontSize: { xs: 12, md: 13 }, background: lighten(project?.color, 0.9),
                                fontWeight: 500, textTransform: 'uppercase'
                            }}>
                                <CircleIcon fontSize="small"
                                    sx={{ mr: .5, fontSize: 16, color: project?.color }} />
                                {project?.projectName}
                                <Box sx={{ flexGrow: 1 }} />
                                <Button id={project?._id} sx={{ p: 0 }}
                                    onClick={() => { gotoProjectGroup({ id: project?._id, name: project?.projectName, color: project?.color }) }}>
                                    <Typography noWrap id={project?._id}
                                        sx={{ fontWeight: 600, fontSize: { xs: 11, sm: 11 } }}>
                                        View Group
                                    </Typography>
                                    <NextArrow id={project?._id} fontSize="small" sx={{ ml: -.5 }} />
                                </Button>
                            </Typography>

                            {/* Body */}
                            <Grid container>
                                <Grid item xs={6}>
                                    <Typography noWrap sx={{
                                        pl: 3, py: 1,
                                        color: '#333333', fontSize: { xs: 12, sm: 13 },
                                        display: 'flex', alignItems: 'center'
                                    }}>
                                        <Avatar sx={{
                                            mr: 1.5,
                                            height: '24px', width: '24px',
                                            background: 'rgba(25, 211, 252, 0.2)', border: '0.675px solid #19D3FC'
                                        }}>
                                            <TodoIcon fontSize="small" sx={{ height: 16, width: 16, color: '#19D3FC' }} />
                                        </Avatar>
                                        To do ({countTasksByStatus(project, 'To do')})
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography noWrap sx={{ pr: 2, py: 1, fontSize: 13, display: 'flex', alignItems: 'center' }}>
                                        <Avatar sx={{
                                            mr: 1.5,
                                            height: '24px', width: '24px', background: 'rgba(242, 147, 35, 0.2)',
                                            border: '0.675px solid #F29323'
                                        }}>
                                            <InProgressIcon fontSize="small"
                                                sx={{ height: 16, width: 16, color: '#F29323' }} />
                                        </Avatar>
                                        In progress ({countTasksByStatus(project, 'In progress')})
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography noWrap sx={{ pl: 3, py: 1, color: '#333333', fontSize: 13, display: 'flex', alignItems: 'center' }}>
                                        <Avatar sx={{
                                            mr: 1.5,
                                            height: '24px', width: '24px', background: 'rgba(200, 9, 200, 0.2)',
                                            border: '0.675px solid #C809C8'
                                        }}>
                                            <ReviewIcon fontSize="small"
                                                sx={{ height: 16, width: 16, color: '#C809C8' }} />
                                        </Avatar>
                                        Review ({countTasksByStatus(project, 'Review')})
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography noWrap sx={{ pr: 2, py: 1, fontSize: 13, display: 'flex', alignItems: 'center' }}>
                                        <Avatar sx={{
                                            mr: 1.5,
                                            height: '24px', width: '24px', background: 'rgba(3, 178, 3, 0.2)',
                                            border: '0.675px solid #03B203'
                                        }}>
                                            <CompletedIcon fontSize="small"
                                                sx={{ height: 16, width: 16, color: '#03B203' }} />
                                        </Avatar>
                                        Completed ({countTasksByStatus(project, 'Completed')})
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                ))}
            </div>
            </Box>
        </Box>

    </Grid>
}

