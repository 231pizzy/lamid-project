
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import {
    NumberOfFollowupComments, addNewGoalOrTask, addNewMember, addNewStaff, addNewTask, changeGoalStatus, changePassword, changeTaskStatus, checkEmail, checkPassword,
    createContact, createContactGoal, createContactNote, createFolder, createFollowUp,
    createFollowupComment,
    createFollowupReport,
    createForms, createNewProjectGroup, createPrivileges, createProjectGroup, createSchedule, createSupervisorEvaluationReport, deleteContact, deleteContactGoal, deleteDocument, deleteEvaluationReport, deleteFollowupReport, deletePrivilege,
    deleteSchedule, deleteStaff, downloadDocument, editContact, editForms, editPrivileges, emailClient,
    facebookWebhook,
    facebookWebhookVerification,
    getAdminFrontPage, getAllProjectGroups, getAllTeamGoals, getAppSecretProof, getContactFollowupData, getContactGoals, getContactNotes, getContacts, getDocument, getEmails, getFileByName, getFollowupComments, getFollowupData, getFollowupHistory, getForms, getGoalChatFiles,
    getGoalData, getLinkArray, getLocation, getNotificationList, getNotifications, getPrivileges, getProfilePictureByName,
    getProfilePictureFromArrayOfEmails, getProjectChatFiles, getProjectChats, getProjectGroup, getProjectGroupDashboard, getProjectGroupData, getProjectLinkArray, getSchedule, getStaff,
    getStaffFromFilter, getStaffPrivileges, getStaffTaskScheduleForDate, getTeamChatFiles, getTeamChats, getTeamLinkArray, getWorkPhases, handleCheckLoginStatus, handleLogOut, handleLogin, handleOtpRequest,
    handleVerifyOtp, resendOtp, saveDocument, saveScheduleEdit, searchForStaff, sendContactEmail, sendPojectChatFile, sendProjectChat, sendProjectGroupChat, sendProjectGroupChatFile,
    sendTeamChat,
    sendTeamChatFile,
    startContactGoal,
    updateContactStatus,
    updateHandler,
    updateStaff, updateStage, validateNameInProjectGroup
} from "./routeHandlers";
// import { createFolder} from '../folders/route';

export const dynamic = "force-dynamic"

export async function isLoggedIn() {
    const loggedIn = await handleCheckLoginStatus();
    return loggedIn?.result
}

const loginAuth = { authErr: 'login', authUrl: '/login', type: 'login' }

export async function GET(req, { params }) {
    try {
        if (mongoose.connection.readyState === 1) {
            // console.log('connected')
        }
        else {
            console.log('connecting to db')
            const dbName = process.env.DB_NAME //(process.env.NODE_ENV === 'production') ? 'lamid' : 'lamidtest';

            const URI = (process.env.NODE_ENV === 'production') ? process.env.MONGO_URI : process.env.MONGO_LOCAL_URI

            await mongoose.connect(URI, { dbName: dbName })
        }

        const route = params.rootPath;

        //  console.log('route', route)
        const { searchParams } = new URL(req.url);

        // console.log('generic request handler', searchParams,);

        let response;

        switch (route) {
            case 'check-status':
                response = await handleCheckLoginStatus(searchParams);
                return NextResponse.json(response)
            case 'log-out':
                response = await handleLogOut(searchParams);
                return NextResponse.json(response)
            case 'otp-request':
                response = await handleOtpRequest(searchParams);
                return NextResponse.json(response)
            case 'resend-otp':
                response = await resendOtp(searchParams);
                return NextResponse.json(response)
            case 'get-frontpage-dashboard':
                response = await isLoggedIn() ? await getAdminFrontPage(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'get-contact':
                response = await isLoggedIn() ? await getContacts(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'get-location':
                response = await isLoggedIn() ? await getLocation(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'get-followup-history':
                response = await isLoggedIn() ? await getFollowupHistory(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'delete-contact':
                response = await isLoggedIn() ? await deleteContact(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'get-followup-comments':
                response = await isLoggedIn() ? await getFollowupComments(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'followup-comments-count':
                response = await isLoggedIn() ? await NumberOfFollowupComments(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'get-form':
                response = await isLoggedIn() ? await getForms(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'get-document':
                response = await isLoggedIn() ? await getDocument(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'delete-document':
                response = await isLoggedIn() ? await deleteDocument(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'download-document':
                response = await isLoggedIn() ? await downloadDocument(searchParams) : loginAuth;
                return new NextResponse(response.result, {
                    headers: {
                        "content-disposition": `attachment; filename="${searchParams.get('filename')}"`
                    }
                })
            case 'get-project-group-dashboard':
                response = await isLoggedIn() ? await getProjectGroupDashboard(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'get-all-project-group':
                    response = await isLoggedIn() ? await getAllProjectGroups(searchParams): loginAuth;
                    return NextResponse.json(response)
            case 'get-all-team-goals':
                        response = await isLoggedIn() ? await getAllTeamGoals(searchParams): loginAuth;
                        return NextResponse.json(response)
            case 'validate-name-project-group':
                response = await isLoggedIn() ? await validateNameInProjectGroup(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'get-staff-from-filter':
                response = await isLoggedIn() ? await getStaffFromFilter(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'get-profile-pictures':
                response = await isLoggedIn() ? await getProfilePictureFromArrayOfEmails(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'get-project-group-data':
                response = await isLoggedIn() ? await getProjectGroupData(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'get-workphases':
                response = await isLoggedIn() ? await getWorkPhases(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'get-schedule':
                response = await isLoggedIn() ? await getSchedule(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'get-project-groups':
                response = await isLoggedIn() ? await getProjectGroup(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'get-staff':
                response = await isLoggedIn() ? await getStaff(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'get-staff-privileges':
                response = await isLoggedIn() ? await getStaffPrivileges(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'check-email':
                response = await isLoggedIn() ? await checkEmail(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'get-profile-picture-by-name':
                response = await isLoggedIn() ? await getProfilePictureByName(searchParams) : loginAuth;
                // return NextResponse.json(response)
                return new NextResponse(response.result, {
                    headers: {
                        "content-Type": 'image/png'
                    }
                })
            case 'delete-staff':
                response = await isLoggedIn() ? await deleteStaff(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'find-staff':
                response = await isLoggedIn() ? await searchForStaff(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'get-privileges':
                response = await isLoggedIn() ? await getPrivileges(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'delete-privilege':
                response = await isLoggedIn() ? await deletePrivilege(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'delete-schedule':
                response = await isLoggedIn() ? await deleteSchedule(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'sse':
                response = await isLoggedIn() ? await getNotifications(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'notifications-list':
                response = await isLoggedIn() ? await getNotificationList(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'get-goal-data':
                response = await isLoggedIn() ? await getGoalData(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'get-team-chats':
                    response = await isLoggedIn() ? await getTeamChats(searchParams) : loginAuth;
                    return NextResponse.json(response)
                    case 'get-project-chats':
                        response = await isLoggedIn() ? await getProjectChats(searchParams) : loginAuth;
                        return NextResponse.json(response)
            case 'get-goal-chat-files':
                response = await isLoggedIn() ? await getGoalChatFiles(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'get-team-chat-files':
                    response = await isLoggedIn() ? await getTeamChatFiles(searchParams) : loginAuth;
                    return NextResponse.json(response)
                    case 'get-project-chat-files':
                        response = await isLoggedIn() ? await getProjectChatFiles(searchParams) : loginAuth;
                        return NextResponse.json(response)
            case 'get-file-by-name':
                response = await isLoggedIn() ? await getFileByName(searchParams) : loginAuth;
                return new NextResponse(response.result, {
                    headers: {
                        "content-Type": 'image/*'
                    }
                })
            case 'get-goal-chat-links':
                response = await isLoggedIn() ? await getLinkArray(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'get-team-chat-links':
                    response = await isLoggedIn() ? await getTeamLinkArray(searchParams) : loginAuth;
                    return NextResponse.json(response)
            case 'get-project-chat-links':
                        response = await isLoggedIn() ? await getProjectLinkArray(searchParams) : loginAuth;
                        return NextResponse.json(response)
            case 'get-staff-task-schedule':
                response = await isLoggedIn() ? await getStaffTaskScheduleForDate(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'get-contact-goals':
                response = await isLoggedIn() ? await getContactGoals(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'get-followup-data':
                response = await isLoggedIn() ? await getFollowupData(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'delete-contact-goal':
                response = await isLoggedIn() ? await deleteContactGoal(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'delete-followup-report':
                response = await isLoggedIn() ? await deleteFollowupReport(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'delete-evaluation-report':
                response = await isLoggedIn() ? await deleteEvaluationReport(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'get-contact-followup-data':
                response = await isLoggedIn() ? await getContactFollowupData(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'get-emails':
                response = await isLoggedIn() ? await getEmails(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'fb-webhook':
                response = await facebookWebhookVerification(searchParams);
                return new Response(response, { status: 200 })
            case 'get-contact-notes':
                response = await isLoggedIn() ? await getContactNotes(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'get-app-proof':
                response = await isLoggedIn() ? await getAppSecretProof(searchParams) : loginAuth;
                return NextResponse.json(response)
            case 'set-stage':
                response = await isLoggedIn() ? await updateStage(searchParams) : loginAuth;
                return NextResponse.json(response)
            default:
                return NextResponse.json({ error: 'not found' })
        }

    } catch (error) {
        console.log('something went wrong', error)
        return NextResponse.json({ errMsg: 'Something went wrong' })
    }

}

export async function POST(req, { params }) {
    try {
        if (mongoose.connection.readyState === 1) {
            console.log('connected')
        }
        else {
            console.log('connecting to db')
            const dbName = process.env.DB_NAME
            //  const dbName = (process.env.NODE_ENV === 'production') ? 'lamid' : 'lamidtest';

            const URI = (process.env.NODE_ENV === 'production') ? process.env.MONGO_URI : process.env.MONGO_LOCAL_URI

            await mongoose.connect(URI, { dbName: dbName })
        }

        const route = params.rootPath;

        let response;

        if (route === 'fb-webhook') {
            response = await facebookWebhook(await req.json());
            return new Response('EVENT_RECEIVED', { status: 200 })
        }
        else {
            // Handle other routes
            if (route === 'create-folder') {
                // For create-folder route, parse JSON payload
                const payload = await req.json();
                response = await isLoggedIn() ? await createFolder(payload) : loginAuth;
            } else {
                // For other routes, parse FormData payload
                const payload = await req.formData();

            switch (route) {
                case 'login':
                    response = await handleLogin(payload);
                    return NextResponse.json(response);
                case 'verify-otp':
                    response = await handleVerifyOtp(payload);
                    return NextResponse.json(response);
                case 'change-password':
                    response = await changePassword(payload);
                    return NextResponse.json(response);
                case 'create-folder':
                        response = await isLoggedIn() ? await createFolder(payload) : loginAuth;
                        return NextResponse.json(response);
                case 'create-contact':
                    response = await isLoggedIn() ? await createContact(payload) : loginAuth;
                    return NextResponse.json(response);
                case 'edit-contact':
                    response = await isLoggedIn() ? await editContact(payload) : loginAuth;
                    return NextResponse.json(response);
                case 'email-contact':
                    response = await isLoggedIn() ? await emailClient(payload) : loginAuth;
                    return NextResponse.json(response);
                case 'create-followup':
                    response = await isLoggedIn() ? await createFollowUp(payload) : loginAuth;
                    return NextResponse.json(response);       
                case 'create-followup-comment':
                    response = await isLoggedIn() ? await createFollowupComment(payload) : loginAuth;
                    return NextResponse.json(response);
                case 'create-form':
                    response = await isLoggedIn() ? await createForms(payload) : loginAuth;
                    return NextResponse.json(response);
                case 'edit-form':
                    response = await isLoggedIn() ? await editForms(payload) : loginAuth;
                    return NextResponse.json(response);
                case 'save-document':
                    response = await isLoggedIn() ? await saveDocument(payload) : loginAuth;
                    return NextResponse.json(response);
                case 'create-project-group':
                    response = await isLoggedIn() ? await createProjectGroup(payload) : loginAuth;
                    return NextResponse.json(response);
                    case 'create-new-project-group':
                        response = await isLoggedIn() ? await createNewProjectGroup(payload) : loginAuth;
                        return NextResponse.json(response);
                case 'add-new-staff':
                    response = await isLoggedIn() ? await addNewStaff(payload) : loginAuth;
                    return NextResponse.json(response);
                case 'update-staff':
                    response = await isLoggedIn() ? await updateStaff(payload) : loginAuth;
                    return NextResponse.json(response);
                case 'check-password':
                    response = await isLoggedIn() ? await checkPassword(payload) : loginAuth;
                    return NextResponse.json(response);
                case 'edit-privilege':
                    response = await isLoggedIn() ? await editPrivileges(payload) : loginAuth;
                    return NextResponse.json(response);
                case 'create-privilege':
                    response = await isLoggedIn() ? await createPrivileges(payload) : loginAuth;
                    return NextResponse.json(response);
                case 'create-schedule':
                    response = await isLoggedIn() ? await createSchedule(payload) : loginAuth;
                    return NextResponse.json(response);
                case 'save-edit-schedule':
                    response = await isLoggedIn() ? await saveScheduleEdit(payload) : loginAuth;
                    return NextResponse.json(response);
                case 'send-goal-chat':
                    response = await isLoggedIn() ? await sendProjectGroupChat(payload) : loginAuth;
                    return NextResponse.json(response)
                     case 'send-goal-chat':
                    response = await isLoggedIn() ? await sendProjectGroupChat(payload) : loginAuth;
                    return NextResponse.json(response)
                case 'send-team-chat':
                        response = await isLoggedIn() ? await sendTeamChat(payload) : loginAuth;
                        return NextResponse.json(response)
                case 'send-project-chat':
                            response = await isLoggedIn() ? await sendProjectChat(payload) : loginAuth;
                            return NextResponse.json(response)
                case 'send-goal-chat-files':
                    response = await isLoggedIn() ? await sendProjectGroupChatFile(payload) : loginAuth;
                    return NextResponse.json(response)
                case 'send-team-chat-files':
                        response = await isLoggedIn() ? await sendTeamChatFile(payload) : loginAuth;
                        return NextResponse.json(response)
                case 'send-project-chat-files':
                            response = await isLoggedIn() ? await sendPojectChatFile(payload) : loginAuth;
                            return NextResponse.json(response)
                case 'update-workphase':
                    response = await isLoggedIn() ? await addNewGoalOrTask(payload) : loginAuth;
                    return NextResponse.json(response)
                case 'update-goal-task':
                        response = await isLoggedIn() ? await addNewTask(payload) : loginAuth;
                        return NextResponse.json(response)
                case 'add-new-member':
                        response = await isLoggedIn() ? await addNewMember(payload) : loginAuth;
                            return NextResponse.json(response)
                case 'change-goal-status':
                    response = await isLoggedIn() ? await changeGoalStatus(payload) : loginAuth;
                    return NextResponse.json(response)
                case 'update-handler':
                    response = await isLoggedIn() ? await updateHandler(payload) : loginAuth;
                    return NextResponse.json(response)
                case 'update-contact-status':
                    response = await isLoggedIn() ? await updateContactStatus(payload) : loginAuth;
                    return NextResponse.json(response)
                case 'create-contact-goal':
                    response = await isLoggedIn() ? await createContactGoal(payload) : loginAuth;
                    return NextResponse.json(response)
                case 'change-task-status':
                    response = await isLoggedIn() ? await changeTaskStatus(payload) : loginAuth;
                    return NextResponse.json(response)
                case 'start-contact-goal':
                    response = await isLoggedIn() ? await startContactGoal(payload) : loginAuth;
                    return NextResponse.json(response)
                case 'create-followup-report':
                    response = await isLoggedIn() ? await createFollowupReport(payload) : loginAuth;
                    return NextResponse.json(response)
                case 'create-supervisor-evaluation-report':
                    response = await isLoggedIn() ? await createSupervisorEvaluationReport(payload) : loginAuth;
                    return NextResponse.json(response)
                case 'send-email':
                    response = await isLoggedIn() ? await sendContactEmail(payload) : loginAuth;
                    return NextResponse.json(response)
                case 'create-contact-note':
                    response = await isLoggedIn() ? await createContactNote(payload) : loginAuth;
                    return NextResponse.json(response)
                /* case 'test-auth':
                    response =    await isLoggedIn() ? await  testAuth(payload) : loginAuth;
                    return NextResponse.json(response)
                case 'start-test-auth':
                    response = await startTestAuth(payload);
                    return NextResponse.json(response) */
                default:
                    return NextResponse.json({ error: 'not found' })
            }
        }
    }
    } catch (error) {
        console.log('something went wrong', error)
        return NextResponse.json({ errMsg: 'Something went wrong' })
    }
}

// export const POST = createFolder;
// export const GET = getHandler;