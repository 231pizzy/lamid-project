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

export function createForm({ formTitle, formData, dataProcessor }) {

    const body = { formTitle: formTitle, formData: JSON.stringify(formData) }

    postRequestHandler({
        route: `/api/create-form`,
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

export function editForm({ formId, formData, dataProcessor }) {

    const body = { formId: formId, formData: JSON.stringify(formData) }

    postRequestHandler({
        route: `/api/edit-form`,
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

