'use client'

import { Box, Typography, } from "@mui/material";

import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";

import moment from "moment";

import { ProfileAvatarGroup } from "./ProfileAvatarGroup";
import IconElement from "./IconElement";

const DurationSvg = '/icons/DurationSvg.svg';
const GoalSvg = '/icons/GoalSvg.svg';
const MembersSvg = '/icons/MembersSvg.svg';
const MoneyCase = '/icons/MoneyCase.svg';
const TaskSvg = '/icons/TaskSvg.svg';
const TimebankSvg = '/icons/TimebankSvg.svg';
const WorkPhaseSvg = '/icons/WorkPhaseSvg.svg';


const iconStyle1 = { marginRight: '10px', height: '18px', width: '18px' };

function WorkPhaseSummary({ headingBgcolor, contentBgcolor }) {
    const savedFormData = useSelector(state => state.newProjectGroup.projectData);
    //const savedFilters = useSelector(state => state.newProjectGroup.projectGroupFilters);

    const workPhaseData = useMemo(() => {
        return savedFormData.workPhases
    }, [savedFormData.workPhases])

    useEffect(() => {
        /* Send subheading to the redux state for subheading*/
        /*   const subHeading = {
              currentStep: 4, info: 'Summary', label: 'All the workphases that have been crreated',
              requiredData: {}
          };
          dispatch(setSubHeading({ ...subHeading })) */
        //   prop.setSubHeading(subHeading)
    }, [])


    const [state, setState] = useState({
        currentStep: null, workPhases: workPhaseData
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    const formatTime = (timeInMinutes) => {
        const hours = Math.trunc(timeInMinutes / 60);
        const hourStr = hours ? hours > 1 ? `${hours}hrs` : `${hours}hrs` : '';
        const mins = timeInMinutes % 60;
        const minStr = mins ? mins > 1 ? `${mins}mins` : `${mins}min` : '';

        const time = `${hourStr} ${minStr}`
        return time;
    }

    const dataCard = ({ icon, heading, content }) => {
        return <Box sx={{
            boxShadow: ' 0px 6px 12px 0px rgba(79, 79, 79, 0.08)', bgcolor: 'white',
            border: ' 1px solid  rgba(28, 29, 34, 0.10)', borderRadius: '8px', mr: 2, mb: 2
        }}>
            {/* Heading */}
            <Typography sx={{
                display: 'flex', borderRadius: '8px 8px 0 0', fontSize: { xs: 13, md: 14 },
                alignItems: 'center', p: .75, pr: 2, bgcolor: '#257AFB12', color: '#257AFB'
            }}>
                {/* Icon */}
                {icon}
                {/* Heading */}
                {heading}
            </Typography>

            {/* Content */}
            <Box sx={{ px: 1, py: 1, borderRadius: '0 0 8px 8px', }}>
                {content}
            </Box>
        </Box>
    }

    const contentType1 = ({ data, style }) => {
        return <Typography align='center' sx={{
            width: 'max-content',
            mx: 'auto', fontWeight: 600, borderRadius: '0 0 8px 8px', fontSize: 14, ...style
        }}>
            {data}
        </Typography>
    }

    const computeTimeBank = ({ workPhase }) => {
        let minutes = 0;
        Object.entries(workPhase.goals ?? {}).map(([goalKey, goalObject]) => goalObject.tasks.map(task => {
            minutes += Number(task.hours) * 60 + Number(task.minutes)
        }))

        return formatTime(minutes)
    }

    const computeDuration = ({ workPhase }) => {
        let firstDate = moment().toDate();
        let lastDate = moment().toDate();

        Object.entries(workPhase.goals).map(([goalKey, goalObject]) => goalObject.tasks.map(task => {
            const date1 = moment(task.startDate, 'yyyy-MM-DD');
            const date2 = moment(task.endDate, 'yyyy-MM-DD');

            firstDate = date1.isBefore(firstDate, 'day') ? date1 : firstDate;
            lastDate = date2.isAfter(lastDate, 'day') ? date2 : lastDate;
        }))

        return `${moment(firstDate).format('MMM Do')} - ${moment(lastDate).format('MMM Do')}`
    }

    const computeBudget = ({ workPhase }) => {
        let budget = 0;
        Object.entries(workPhase.goals ?? {}).map(([goalKey, goalObject]) => goalObject.tasks.map(task => {
            budget += Number(task.taskBudget)
        }))

        return (Number(budget || 0).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }).slice(0, -3) || "-")
    }

    // const computeMembers = ({ workPhase }) => {
    //     let members = [];
    //     Object.entries(workPhase.goals ?? {}).map(([goalKey, goalObject]) => goalObject.tasks.map(task => {
    //         members.push(...Object.keys(task.taskAssignmentMapping))
    //     }));

    //     return <ProfileAvatarGroup {...{ emailArray: members, diameter: 30, color: '#257AFB', bgcolor: 'white', max: 2 }} />

    // }
    const computeMembers = ({ workPhase }) => {
        let members = [];
        Object.entries(workPhase.goals ?? {}).map(([goalKey, goalObject]) => {
            goalObject.tasks?.forEach(task => {
                members.push(...Object.keys(task.taskAssignmentMapping ?? {}));
            });
        });
    
        return <ProfileAvatarGroup {...{ emailArray: members, diameter: 30, color: '#257AFB', bgcolor: 'white', max: 2 }} />;
    };
    

    const computeTaskCount = ({ workPhase }) => {
        let numberOfTasks = 0;
        Object.entries(workPhase.goals ?? {}).map(([goalKey, goalObject]) => {
            numberOfTasks += goalObject.tasks.length
            return false
        });

        return numberOfTasks
    }


    return (
        <Box sx={{}}>
            {/* Work phases */}
            {Object.entries(state.workPhases ?? {}).map(([phaseKey, phaseObject]) => {
                return <Box sx={{
                    borderBottom: '1px solid var(--line-color, rgba(28, 29, 34, 0.10))', borderRadius: ' 0px 0px 12px 12px'
                }}>
                    {/* Heading */}
                    <Typography sx={{ bgcolor: headingBgcolor, fontWeight: 700, fontSize: 17, color: '#5D5D5D', px: 4, py: 2 }}>
                        Work Phase {phaseKey} summary
                    </Typography>

                    {/* Content */}
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-evenly', px: { xs: 1, lg: 1.5, xl: 2 }, py: 3, bgcolor: contentBgcolor }}>
                        {/* WorkPhase name */}
                        {dataCard({
                            icon: <IconElement {...{ src: WorkPhaseSvg, style: iconStyle1 }} />, heading: 'Work-Phase',
                            content: contentType1({
                                data: phaseObject.phaseName, style: { px: 1, py: .75, fontSize: 17, textTransform: 'uppercase' },
                            })
                        })}

                        {/* Number of goals */}
                        {dataCard({
                            icon: <IconElement {...{ src: GoalSvg, style: iconStyle1 }} />, heading: 'Goals',
                            content: contentType1({ data: Object.keys(phaseObject.goals).length, style: { px: 1, py: .75 } })
                        })}

                        {/* Number of tasks */}
                        {dataCard({
                            icon: <IconElement {...{ src: TaskSvg, style: iconStyle1 }} />, heading: 'Tasks',
                            content: contentType1({ data: computeTaskCount({ workPhase: phaseObject }), style: { px: 1, py: .75 } })
                        })}

                        {/* TImebank */}
                        {dataCard({
                            icon: <IconElement {...{ src: TimebankSvg, style: iconStyle1 }} />, heading: 'Time-Bank',
                            content: contentType1({
                                data: computeTimeBank({ workPhase: phaseObject }),
                                style: { px: 1, py: .5, bgcolor: '#1C1D220A', borderRadius: '10px' }
                            })
                        })}

                        {/* Duration */}
                        {dataCard({
                            icon: <IconElement {...{ src: DurationSvg, style: iconStyle1 }} />, heading: 'Duration',
                            content: contentType1({
                                data: computeDuration({ workPhase: phaseObject }),
                                style: { px: 1, py: .5, bgcolor: '#1C1D220A', borderRadius: '10px' }
                            })
                        })}

                        {/* Budget */}
                        {dataCard({
                            icon: <IconElement {...{ src: MoneyCase, style: iconStyle1 }} />, heading: 'Budget',
                            content: contentType1({
                                data: computeBudget({ workPhase: phaseObject }),
                                style: { px: 1, py: 1 }
                            })
                        })}

                        {/* Members */}
                        {dataCard({
                            icon: <IconElement {...{ src: MembersSvg, style: iconStyle1 }} />, heading: 'Members',
                            content: contentType1({
                                data: computeMembers({ workPhase: phaseObject }),
                                style: { px: 1, }
                            })
                        })}

                    </Box>
                </Box>
            })}

        </Box>)
}

export default WorkPhaseSummary;