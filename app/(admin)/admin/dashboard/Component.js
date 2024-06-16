'use client'

import {
    Box, Stack, Button, Card, Grid, TableCell, Typography,
    CardContent, IconButton, ButtonGroup, Paper, Avatar, LinearProgress,
} from "@mui/material";
import { useDispatch } from "react-redux";

//import { InPersonSvg, MailSvg, LetterSvg, OnlineSvg } from "../icons/icons";

import { useState, useEffect, } from "react";
import { setPageTitle } from "@/Components/redux/routeSlice";

import moment from "moment";

import { useRouter } from "next/navigation";
import { getFrontPageDashboardData } from "./helper";
import Tools from "./Tools";
import ProjectGroups from "./ProjectGroups";
import Tasks from "./Tasks";
import Team from "./Team";
import Staff from "./Staff";
import Calendar from "./Calendar";

export default function AdminDashboard() {
    const router = useRouter();
    const dispatch = useDispatch();

    const [state, setState] = useState({
        selected: [], orderBy: '', order: '', tableContent: [], dataAdded: 0, dashboardData: {}, goalStatusData: {},
        staffArray: [], schedule: [], currentTool: 'crm'
    });

    const processDashboardData = (dashboardData) => {
        console.log('received', dashboardData);

        //Process Contacts
        const contactData = dashboardData?.contacts ?? []
        //Proess project group goals
        const getGoalStatusData = () => {
            const projectGroupStatusData = {};

            dashboardData.projectGroups.forEach(groupObject => {
                projectGroupStatusData[groupObject.projectName] = {
                    toDo: 0, inProgress: 0, review: 0,
                    completed: 0, color: groupObject.color, projectId: groupObject._id
                }
                Object.values(groupObject.workPhases).forEach(phaseObject => {
                    Object.values(phaseObject.goals).forEach(goalObject => {
                        projectGroupStatusData[groupObject.projectName][goalObject?.status] += 1;
                    })
                })
            })

            return projectGroupStatusData;
        }

        //Process tasks
        //Process teams
        //Process staff
        //Process calendar
        const schedule = dashboardData.schedule.filter(schedule =>
            moment(schedule.date).format('yyyy-MM-DD') === moment().format('yyyy-MM-DD'))

        const finalData = { goalStatus: getGoalStatusData() };

        console.log('final data', finalData);

        updateState({
            tableContent: contactData, dashboardData: dashboardData, goalStatusData: getGoalStatusData(),
            staffArray: dashboardData.staffArray, schedule: schedule ?? []
        })
    }

    useEffect(() => {
        dispatch(setPageTitle({ pageTitle: 'Dashboard' }))

        //fetch the dashboard data
        getFrontPageDashboardData({ dataProcessor: processDashboardData })
    }, [])

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    useEffect(() => {

    }, [state.dashboardData]);


    const getAllTaskByStatus = (status) => {
        const taskArray = []

        if (status && state.dashboardData?.projectGroups) {
            state.dashboardData?.projectGroups?.forEach(groupObject => {
                Object.values(groupObject.workPhases).forEach(phaseObject => {
                    Object.values(phaseObject.goals).forEach(goalObject => {
                        taskArray.push(...goalObject.tasks.filter(task => task.status === status).map(match => {
                            return { ...match, goalObject: goalObject }
                        }))
                    })
                })
            })
            return taskArray
        }
        else {
            return []
        }
    }


    const handleViewProfile = (email) => {
        console.log('email', email)
        router.push(`/admin/staff-profile/?email=${email}`, { state: { email: email } });
    }

    const handleGoto = (event) => {
        console.log(event.currentTarget.id);
        router.push(event.currentTarget.id);
    };

    const gotoProjectGroup = (data) => {
        //  const projectId = event.target.id;
        if (data?.id) {
            router.push(`/admin/project-group-detail/?projectId=${data?.id}&&projectName=${data?.name}&&projectColor=${encodeURIComponent(data?.color)}`,
              /*   { state: { projectId: data?.id, projectName: data?.name, projectColor: data?.color } } */)
        }
    }

    const changeToolSection = (event) => {
        updateState({ currentTool: event.target.id })
    }

    console.log('home page state', state);

    return (
        <Box sx={{ py: 2, }}>
            <Grid container sx={{ px: 1 }}  >
                {/* CRM section */}
                <Tools {...{ currentTool: state.currentTool, changeToolSection: changeToolSection, handleGoto: handleGoto }} />

                {/* Project Group section */}
                <ProjectGroups {...{ goalStatusData: state.goalStatusData, gotoProjectGroup: gotoProjectGroup, gotoPage: handleGoto }} />

                {/* My tasks */}
                <Tasks {...{ getAllTaskByStatus: getAllTaskByStatus, gotoPage: handleGoto }} />

                {/* Others */}
                {/* Teams */}
                <Team {...{ handleGoto: handleGoto, goalStatusData: state.goalStatusData,  projectGroups: state.dashboardData?.projectGroups ?? [] }} />

                {/* Staff */}
                <Staff {...{ handleGoto: handleGoto, staffArray: state.staffArray, handleViewProfile: handleViewProfile }} />


                {/* Calendar */}
                <Calendar {...{ handleGoto: handleGoto, schedule: state.schedule }} />

            </Grid >
        </Box >
    );
} 