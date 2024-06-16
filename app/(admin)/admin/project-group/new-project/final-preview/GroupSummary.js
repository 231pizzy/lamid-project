'use client'

import { Box, Typography, } from "@mui/material";

import { useState, } from "react";


import moment from "moment";

import { DurationSvg, GoalSvg, MembersSvg, MoneyCase, TaskSvg, TimebankSvg, WorkPhaseSvg } from "@/public/icons/icons";

/* const DurationSvg = '/icons/DurationSvg.svg';
const GoalSvg = '/icons/GoalSvg.svg';
const MembersSvg = '/icons/MembersSvg.svg';
const MoneyCase = '/icons/MoneyCase.svg';
const TaskSvg = '/icons/TaskSvg.svg';
const TimebankSvg = '/icons/TimebankSvg.svg';
const WorkPhaseSvg = '/icons/WorkPhaseSvg.svg'; */


const iconStyle1 = { marginRight: '10px', height: '20px', width: '20px' }

export default function GroupSummary({ workPhaseData, bgcolor, color }) {
    const [state, setState] = useState({
        showCongratulations: false,
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }


    const dataCard = ({ icon, heading, content, iconPosition, index }) => {
        return <Box key={index} sx={{
            boxShadow: '8px 8px 20px 0px rgba(79, 79, 79, 0.08), -8px -8px 20px 0px rgba(79, 79, 79, 0.08)',
            background: 'linear-gradient(90deg, #257AFB 0%, #234374 100%)',
            borderRadius: '12px', mr: 2, py: 1
        }}>
            {/* Heading */}
            <Typography sx={{
                display: 'flex', textTransform: 'uppercase', fontSize: { xs: 13, md: 13 }, fontWeight: 600,
                alignItems: 'center', px: 1, color: 'white', flexDirection: iconPosition === 'right' ? 'row-reverse' : 'inherit'
            }}>
                {/* Icon */}
                {icon}
                {/* Heading */}
                {heading}
            </Typography>

            {/* Content */}
            <Typography align="left" sx={{
                px: 1, pt: .5, color: 'white',
                fontSize: { xs: 14, md: 15 }, fontWeight: 700
            }}>
                {content}
            </Typography>
        </Box>
    }

    const formatTime = (timeInMinutes) => {
        const hours = Math.trunc(timeInMinutes / 60);
        const hourStr = hours ? hours > 1 ? `${hours}hrs` : `${hours}hrs` : '';
        const mins = timeInMinutes % 60;
        const minStr = mins ? mins > 1 ? `${mins}mins` : `${mins}min` : '';

        const time = `${hourStr} ${minStr}`
        //  console.log('used time is', timeInMinutes, time)

        return time;
    }

    const computeTimeBank = ({ workPhases }) => {

        let totalMinutes = 0;
        Object.values(workPhases).forEach(phase => {
            return Object.values(phase.goals ?? {}).map(goal => {
                return goal.tasks.map(task => [
                    totalMinutes += (Number(task.hours || 0) * 60) + Number(task.minutes || 0)
                ])
            })
        })


        return formatTime(totalMinutes);
    }

    const computeDuration = ({ workPhases }) => {
        console.log('workspss', workPhases);

        let startDate = moment().format('yyyy-MM-DD')
        let endDate = moment().format('yyyy-MM-DD');

        Object.values(workPhases).forEach(phase => {
            return Object.values(phase.goals ?? {}).map(goal => {
                return goal.tasks.map(task => {
                    startDate = moment(task.startDate, 'yyyy-MM-DD').isBefore(moment(startDate, 'yyyy-MM-DD'), 'day') ?
                        moment(task.startDate).format('yyyy-MM-DD') : moment(startDate).format('yyyy-MM-DD');
                    endDate = moment(task.endDate, 'yyyy-MM-DD').isAfter(moment(endDate, 'yyyy-MM-DD'), 'day') ?
                        moment(task.endDate).format('yyyy-MM-DD') : moment(endDate).format('yyyy-MM-DD');
                    // durationInDays += moment(task.endDate).diff(moment(task.startDate), 'days') + 1
                })
            })
        })


        const durationInDays = moment(endDate, 'yyyy-MM-DD').diff(moment(startDate, 'yyyy-MM-DD'), 'days') + 1

        console.log('computeDuration', startDate, endDate, durationInDays);

        return durationInDays <= 7 ? `${durationInDays}days` :
            Math.ceil(durationInDays / 4) <= 7 ? `${Math.ceil(durationInDays / 7)}weeks` :
                `${Math.ceil(durationInDays / 30)}months`
    }

    const computeBudget = ({ workPhases }) => {
        let totalBudget = 0

        Object.values(workPhases).forEach(phase => {
            return Object.values(phase.goals ?? {}).map(goal => {
                return goal.tasks.map(task => [
                    totalBudget += Number(task.taskBudget)
                ])
            })
        })

        return (Number(totalBudget).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }).slice(0, -3) || "-")
    }

    const computeMembers = ({ workPhases }) => {
        const emailArray = []
        Object.values(workPhases).forEach(phaseObject => {
            Object.values(phaseObject.goals).forEach(goal => {
                goal.tasks.forEach(task => {
                    emailArray.push(...Object.keys(task.taskAssignmentMapping ?? {}))
                })
            })
        });

        return [...new Set(emailArray)].length
    }

    const computeNumberOfGoals = ({ workPhases }) => {
        const goals = Object.values(workPhases ?? {}).map((phaseObject) =>
            Object.keys(phaseObject.goals ?? {}).length).reduce((sum, number) => sum + number,)
        return goals;
    }

    const computeNumberOfTasks = ({ workPhases }) => {
        let tasks = 0;

        Object.values(workPhases).forEach(phase => {
            return Object.values(phase.goals ?? {}).map(goal => {
                return tasks += goal.tasks.length
            })
        })

        /* const tasks = Object.values(workPhases).map((phaseObject) => Object.values(phaseObject.goals).map((goalObject) =>
            goalObject.tasks.length)).reduce((sum, number) => sum + number,)
 */
        return tasks;
    }



    const projectGroupSummaryData = (workPhases) => {
        return [
            {/* Number of workphases */
                label: 'Work phase', icon: <WorkPhaseSvg style={{ ...iconStyle1 }} />,
                iconPosition: 'left', data: ({ workPhases }) => Object.keys(workPhases ?? {}).length
            },
            {/* Number of goals */
                label: 'Goal', icon: <GoalSvg style={{ ...iconStyle1 }} />,
                iconPosition: 'left', valueKey: 'goalName',
                data: ({ workPhases }) => computeNumberOfGoals({ workPhases: workPhases })
            },
            {/* Number of tasks */
                label: 'Tasks', icon: <TaskSvg style={{ ...iconStyle1 }} />,
                iconPosition: 'left', data: ({ workPhases }) => computeNumberOfTasks({ workPhases: workPhases })
            },
            {/* Number of staff on the project */
                label: 'People', icon: <MembersSvg style={{ ...iconStyle1 }} />,
                iconPosition: 'left', valueKey: 'tasks', data: ({ workPhases }) => computeMembers({ workPhases: workPhases })
            },
            {
                label: 'Duration', icon: <DurationSvg style={{ ...iconStyle1 }} />,
                iconPosition: 'left', valueKey: 'tasks', data: ({ workPhases }) => computeDuration({ workPhases: workPhases })
            },
            {
                label: 'Time bank', icon: <TimebankSvg style={{ ...iconStyle1 }} />,
                iconPosition: 'right', valueKey: 'tasks', data: ({ workPhases }) => computeTimeBank({ workPhases: workPhases })
            },
            {
                label: "Goal's budget", icon: <MoneyCase style={{ ...iconStyle1 }} />,
                iconPosition: 'right', valueKey: 'tasks', data: ({ workPhases }) => computeBudget({ workPhases: workPhases })
            },
        ]
    }



    return (
        <Box sx={{}}>
            {/* Heading */}
            <Typography sx={{
                bgcolor: bgcolor ?? '#1C1D220D', py: 1.5, px: 4, fontSize: { xs: 14, md: 15 }, fontWeight: 700,
                color: color
            }}>
                Project Group Summary
            </Typography>

            {/* Content */}
            {Boolean(workPhaseData && Object.keys(workPhaseData)?.length) && <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-evenly', px: { xs: 1, lg: 1.5, xl: 2 }, py: 3, my: 1, bgcolor: 'white' }}>
                {projectGroupSummaryData(Object.entries(workPhaseData ?? {})).map((data, index) => {
                    return dataCard({
                        index: index, icon: data.icon, heading: data.label,
                        content: data.data({ workPhases: workPhaseData }), iconPosition: data.iconPosition
                    })
                })}
            </Box>}
        </Box>

    )
}
