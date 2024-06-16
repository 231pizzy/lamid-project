import { getRequestHandler, postRequestHandler } from "@/Components/requestHandler";

export function sendGroupChat({ teamId,linkArray, link, message, dataProcessor }) {

    postRequestHandler({
        route: `/api/send-team-chat`,
        body: {
            teamId: teamId,link: link, linkArray: JSON.stringify(linkArray), message: message,
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

export function getTeamChats({ teamId, dataProcessor }) {
    getRequestHandler({
        route: `/api/get-team-chats/?teamId=${teamId}`,
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

export function sendFileToChat({ teamId, fileArray, dataProcessor }) {
    const files = fileArray?.map((item, ind) => { return { file: item, filename: `file${ind}` } })
  console.log("phase 1", files)
    postRequestHandler({
        route: `/api/send-team-chat-files`,
        body: { teamId: teamId,},
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

export function getAllFilesForChat({ goal, dataProcessor }) {
    getRequestHandler({
        route: `/api/get-team-chat-files/?teamId=${goal.teamId}`,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong', err)
        }
    })
}

export function getAllLinksForChat({ goal, dataProcessor }) {
    getRequestHandler({
        route: `/api/get-team-chat-links/?teamId=${goal.teamId}`,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong', err)
        }
    })
}

export function addNewTask({ goalId, formData, dataProcessor }) {

    postRequestHandler({
        route: `/api/update-goal-task`,
        body: {
            goalId: goalId, formData: JSON.stringify(formData)
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