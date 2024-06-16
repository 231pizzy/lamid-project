import { getRequestHandler, postRequestHandler } from "@/Components/requestHandler";

export function getProjectGroupData({ projectId, dataProcessor }) {
    getRequestHandler({
        route: `/api/get-project-group-data/?projectId=${projectId}`,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong', err)
        }
    })
}

export function getWorkPhases({ index, projectId, dataProcessor }) {
    getRequestHandler({
        route: `/api/get-workphases/?index=${index}&&projectId=${projectId}`,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong', err)
        }
    })
}

export function getGoalData({ projectId, goalName, phaseName, dataProcessor }) {
    getRequestHandler({
        route: `/api/get-goal-data/?goalName=${goalName}&&projectId=${projectId}&&phaseName=${phaseName}`,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong', err)
        }
    })
}

export function sendGroupChat({ projectId, linkArray, link, message, dataProcessor }) {

    postRequestHandler({
        route: `/api/send-project-chat`,
        body: {
            projectId: projectId,link: link, linkArray: JSON.stringify(linkArray), message: message,
        },
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong', err)
        }
    })
}

export function sendFileToChat({ projectId, fileArray, dataProcessor }) {
    const files = fileArray?.map((item, ind) => { return { file: item, filename: `file${ind}` } })
  console.log("phase 1", files)
    postRequestHandler({
        route: `/api/send-project-chat-files`,
        body: { projectId: projectId,},
        fileArray: [...files],
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong', err)
        }
    })
}

export function getAllLinksForChat({ projectId, dataProcessor }) {
    getRequestHandler({
        route: `/api/get-project-chat-links/?projectId=${projectId}`,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong', err)
        }
    })
}

export function addNewGoalOrTask({ projectId, goal, phaseIndex, dataProcessor }) {

    postRequestHandler({
        route: `/api/update-workphase`,
        body: {
            goal: JSON.stringify(goal), projectId: projectId, phaseIndex: phaseIndex
        },
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong', err)
        }
    })
}

export function changeGoalStatus({ projectId, goalName, phaseIndex, newStatus, dataProcessor }) {
    console.log("data passed from ui")
    console.log("projectId:", projectId)
    console.log("goal name:", goalName)
    console.log("phase index:", phaseIndex)
    console.log("status:", newStatus)

    postRequestHandler({
        route: `/api/change-goal-status`,
        body: {
            goalName: goalName, projectId: projectId, phaseIndex: phaseIndex, newStatus: newStatus
        },
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong', err)
        }
    })
}


export function changeTaskStatus({ projectId, goalName, phaseIndex, taskIndex, newStatus, dataProcessor }) {
    
    postRequestHandler({
        route: `/api/change-task-status`,
        body: {
            goalName: goalName, projectId: projectId, phaseIndex: phaseIndex, taskIndex: taskIndex, newStatus: newStatus
        },
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong', err)
        }
    })
}


export function getProfilePictures({ emailArray, dataProcessor }) {
    getRequestHandler({
        route: `/api/get-profile-pictures/?emailArray=${JSON.stringify(emailArray ?? [])}`,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong')
        }
    })
}

export function getProjectChats({ projectId, dataProcessor }) {
    getRequestHandler({
        route: `/api/get-project-chats/?projectId=${projectId}`,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong', err)
        }
    })
}

export function getAllFilesForChat({ projectId, dataProcessor }) {
    getRequestHandler({
        route: `/api/get-project-chat-files/?projectId=${projectId}`,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong', err)
        }
    })
}

export function getEmailAbbreviation({ email }) {
    const [username, domain] = email.split('@');

    // Check if username contains a dot
    if (username.includes('.')) {
        const [firstName, lastName] = username.split('.');
        const initials = firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
        return initials;
    } else {
        // If no dot, use the first character of the username
        return username.charAt(0).toUpperCase();
    }
}

