import { getRequestHandler, postRequestHandler } from "../requestHandler";

export function getStaff({ email, list, dataProcessor }) {
    getRequestHandler({
        route: list ? `/api/get-staff/?list=${true}` : email ? `/api/get-staff/?email=${email}` : `/api/get-staff`,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong', err)
        }
    })
}

export function searchForStaff({ name, dataProcessor }) {
    getRequestHandler({
        route: `/api/find-staff/?name=${name}`,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong', err)
        }
    })
}

export function updateHandler({ handler, id, key, dataProcessor, submitEndPoint }) {
    postRequestHandler({
        route: submitEndPoint,
        body: { handler, id, key },
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong', err)
        }
    })
}