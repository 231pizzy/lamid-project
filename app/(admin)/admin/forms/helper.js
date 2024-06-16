import { getRequestHandler, postRequestHandler } from "@/Components/requestHandler";

export function getForm({ formId, dataProcessor }) {
    getRequestHandler({
        route: `/api/get-form/?formId=${formId}`,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong')
        }
    })
}

export function createFollowUp({ date, time, clientId, contactMode, topic, details, rating, dataProcessor }) {

    const body = {
        date: date, time: time, clientId: clientId, contactMode: contactMode, topic: topic,
        details: details, rating: rating,
    }

    postRequestHandler({
        route: `/api/create-followup`,
        body: body,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong')
        }
    })
}


export function getFormData({ formId, dataProcessor }) {
    getRequestHandler({
        route: `/api/get-form-data/?formId=${formId}`,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong')
        }
    })
}