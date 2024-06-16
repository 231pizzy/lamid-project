import { getRequestHandler, postRequestHandler } from "@/Components/requestHandler";

export function getDashboardData({ dataProcessor }) {
    getRequestHandler({
        route: `/api/get-project-group`,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong')
        }
    })
}

export function validateName({ value, category, dataProcessor }) {
    getRequestHandler({
        route: `/api/validate-name-project-group/?value=${value}&&category=${category}`,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong', err)
        }
    })
}


export function getStaff({ dataProcessor }) {
    getRequestHandler({
        route: `/api/get-staff-from-filter`,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong')
        }
    })
}

export function getTaskScheduleForTheDate({ date, staffEmail, dataProcessor }) {
    getRequestHandler({
        route: `/api/get-staff-task-schedule/?date=${date}&&staffEmail=${staffEmail}`,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong')
        }
    })
}

export function createProjectGroup({ dataObject,basicData, dataProcessor }) {
    postRequestHandler({
        route: `/api/create-new-project-group`,
        body: { data: JSON.stringify(dataObject), basicData: JSON.stringify(basicData) },
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong')
        }
    })
}