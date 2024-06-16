import { Box, Typography } from "@mui/material";
import ReviewIcon from "@mui/icons-material/StarOutline";
import FlagIcon from "@mui/icons-material/Flag";
import CalendarIcon from "@mui/icons-material/CalendarMonth";
import { TimerSvg } from "@/public/icons/icons.js";
import ListIcon from "@mui/icons-material/ListOutlined";

export default function InReview({ teamGoals, setShowGoalDetails, setSelectedGoal }) {
    const handleTaskClick = (goal) => {
        setShowGoalDetails(true);
        setSelectedGoal(goal);
    };

    const reviewGoals = teamGoals.filter(goal => goal.goalStatus === "In review");

    return (
        <div>
            <Box sx={{ maxWidth: { xs: '100%', md: '400px' }, minWidth: { xs: '100%', md: '400px' }, borderRadius: '16px', mt: 3, border: '2px dashed #1C1D221A' }}>
                {/* Heading */}
                <Box sx={{
                    px: 3, py: 2, bgcolor: '#C809C81A', borderRadius: '16px 16px 0 0',
                    display: 'flex', alignItems: 'center'
                }}>
                    {/* status Icon */}
                    <div style={{ backgroundColor: '#C809C81A', border: `1px solid #C809C8`, borderRadius: '50%' }}>
                        <ReviewIcon style={{ color: '#C809C8', fontSize: 34 }} />
                    </div>
                    {/* Status label and number of goals */}
                    <Typography sx={{ fontWeight: 700, fontSize: 16, ml: 4, textTransform: 'uppercase' }}>
                        Review ({reviewGoals.length})
                    </Typography>
                </Box>
                {/* Content */}
                <Box sx={{ maxHeight: '40vh', overflowY: 'auto', bgcolor: 'rgba(28, 29, 34, 0.08)', p: 2 }}>
                    {reviewGoals.map((goal, index) => {
                        const uniqueTaskMembers = new Set();

                        // Iterate over tasks of the current goal
                        goal.tasks.forEach(task => {
                            task.taskMembers.forEach(member => {
                                // Add each task member to the Set
                                uniqueTaskMembers.add(JSON.stringify(member)); // Convert to string to ensure uniqueness
                            });
                        });

                        // Convert the Set back to an array of objects
                        const uniqueTaskMembersArray = Array.from(uniqueTaskMembers).map(member => JSON.parse(member));

                        const completedTasks = goal.tasks.filter(task => task.taskStatus === 'Completed');

                        // Calculate total time bank (total hours and minutes)
                        let totalTimeBankHours = 0;
                        let totalTimeBankMinutes = 0;
                        goal.tasks.forEach(task => {
                            totalTimeBankHours += parseInt(task.hours) || 0;
                            totalTimeBankMinutes += parseInt(task.minutes) || 0;
                        });
                        totalTimeBankHours += Math.floor(totalTimeBankMinutes / 60);
                        totalTimeBankMinutes %= 60;

                        // Calculate total time spent
                        let totalHours = 0;
                        let totalMinutes = 0;
                        goal.tasks.forEach(task => {
                            totalHours += parseInt(task.hours) || 0;
                            totalMinutes += parseInt(task.minutes) || 0;
                        });
                        totalHours += Math.floor(totalMinutes / 60);
                        totalMinutes %= 60;

                        // Calculate total completed time spent
                        let totalCompletedHours = 0;
                        let totalCompletedMinutes = 0;
                        completedTasks.forEach(task => { // Use filtered completed tasks here
                            totalCompletedHours += parseInt(task.hours) || 0;
                            totalCompletedMinutes += parseInt(task.minutes) || 0;
                        });
                        totalCompletedHours += Math.floor(totalCompletedMinutes / 60);
                        totalCompletedMinutes %= 60;

                        // Calculate duration
                        let earliestStartDate = new Date('9999-12-31');
                        let latestEndDate = new Date('1970-01-01');
                        goal.tasks.forEach(task => {
                            const startDate = new Date(task.startDate);
                            const endDate = new Date(task.endDate);
                            if (startDate < earliestStartDate) {
                                earliestStartDate = startDate;
                            }
                            if (endDate > latestEndDate) {
                                latestEndDate = endDate;
                            }
                        });
                        const formattedStartDate = `${earliestStartDate.toLocaleString('default', { month: 'short' })} ${earliestStartDate.getDate()}`;
                        const formattedEndDate = `${latestEndDate.toLocaleString('default', { month: 'short' })} ${latestEndDate.getDate()}`;
                        const duration = `${formattedStartDate} - ${formattedEndDate}`;

                        return (
                            <Box key={index} style={{ backgroundColor: 'white' }} className="mb-6 rounded-lg cursor-pointer" onClick={() => handleTaskClick(goal)}>
                                {/* Goal name */}
                                <Box>
                                    <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 1, ml: 2, mt: 1 }}>
                                        {goal.goalName}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, mb: 1 }}>
                                        {/* Render avatars of team members */}
                                        {uniqueTaskMembersArray.slice(0, 7).map((member, index) => (
                                            <img
                                                key={index}
                                                src={member.profilePicture}
                                                className="rounded-full object-cover mt-2"
                                                style={{
                                                    height: '35px',
                                                    width: '35px',
                                                    border: `1px solid #0BC5EE1A`,
                                                    marginLeft: index > 0 ? '-10px' : '0'
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Box>

                                {/* Goal duration */}
                                <Typography sx={{ display: "flex", alignItems: "center", fontSize: 13, fontWeight: 600, px: 1.5, py: .5, bgcolor: '#F2F2F2E5', color: '#1C1D2280' }}>
                                    <ListIcon style={{ marginRight: "4px" }} />
                                    Goal duration
                                </Typography>
                                <Typography noWrap sx={{ bgcolor: '#FF00000D', color: '#FF0000', fontWeight: 600, fontSize: 13, maxWidth: 'max-content', display: 'flex', ml: 2, my: 1.5, px: 2, py: 1, alignItems: 'center', borderRadius: '8px' }}>
                                    <CalendarIcon sx={{ mr: 1 }} />
                                    Duration: {duration}
                                    <FlagIcon sx={{ ml: 1, color: '#FF0000' }} />
                                </Typography>

                                {/* Time bank */}
                                <Typography sx={{ display: "flex", fontSize: 13, fontWeight: 600, px: 1.5, py: .5, bgcolor: '#F2F2F2E5', color: '#1C1D2280', alignItems: "center" }}>
                                    <TimerSvg style={{ marginRight: "4px" }} />
                                    Time Bank: {totalTimeBankHours}hr {totalTimeBankMinutes}min
                                </Typography>

                                {/* Time spent */}
                                <Box sx={{ mx: 2, my: 1.5 }}>
                                    <Box sx={{ alignItems: 'center', justifyContent: 'space-between', color: "rgba(200, 9, 200, 1)", mb: 2 }}>
                                        <p sx={{ fontWeight: 600, fontSize: 14, mb: 1.5 }}>
                                            Time Spent:<span> {Math.floor(totalHours * 0.6)}hrs {Math.floor(totalMinutes * 0.6)}mins out of {totalHours}hrs {totalMinutes}mins.</span>
                                        </p>
                                    </Box>
                                    {/* Progress bar */}
                                    <div style={{ width: '100%', height: '4px', backgroundColor: '#D9D9D9', borderRadius: '2px', marginBottom: '10px', position: 'relative' }}>
                                        <div style={{ width: '60%', height: '100%', backgroundColor: 'rgba(200, 9, 200, 1)', borderRadius: '2px', transition: 'width 0.3s ease-in-out' }}></div>
                                    </div>
                                </Box>

                                {/* Progress */}
                                <Box>
                                    <Typography sx={{ display: "flex", alignItems: "center", fontSize: 13, fontWeight: 600, px: 1.5, py: .5, bgcolor: '#F2F2F2E5', color: '#1C1D2280' }}>
                                        <ListIcon style={{ marginRight: "4px" }} />
                                        Progress
                                    </Typography>

                                    <Box sx={{ mx: 2, my: 1.5, padding: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 1.5, color: 'rgba(191, 6, 6, 1)' }}>
                                                Progress
                                            </Typography>
                                            <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 1.5, color: 'black' }}>
                                                3/5
                                            </Typography>
                                        </Box>
                                        {/* Progress bar */}
                                        <div style={{ width: '100%', height: '4px', backgroundColor: '#D9D9D9', borderRadius: '2px', marginBottom: '10px', position: 'relative' }}>
                                            <div style={{ width: '70%', height: '100%', backgroundColor: 'rgba(191, 6, 6, 1)', borderRadius: '2px', transition: 'width 0.3s ease-in-out' }}></div>
                                        </div>
                                    </Box>
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        </div>
    );
}

