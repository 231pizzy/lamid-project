import { getRequestHandler, postRequestHandler } from "@/Components/requestHandler";

export function getSchedule({ dataProcessor }) {
    getRequestHandler({
        route: `/api/get-schedule`,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong', err)
        }
    })
}

export function createSchedule({ dataObject, dataProcessor }) {
    postRequestHandler({
        route: `/api/create-schedule`,
        body: { dataObject: JSON.stringify(dataObject) },
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong', err)
        }
    })
}

export function saveSheduleEdit({ dataObject, id, dataProcessor }) {
    postRequestHandler({
        route: `/api/save-edit-schedule`,
        body: { dataObject: JSON.stringify(dataObject), id: id },
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong', err)
        }
    })
}

export function deleteSchedule({ id, dataProcessor }) {
    getRequestHandler({
        route: `/api/delete-schedule/?id=${id}`,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong', err)
        }
    })
}