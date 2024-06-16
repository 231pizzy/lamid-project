import { getRequestHandler, postRequestHandler } from "@/Components/requestHandler";

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

export function addNewStaff({ dataObject, dataProcessor }) {
    console.log('dataObject', dataObject)
    // console.log('helperlevel photo', profilePicture)

    postRequestHandler({
        route: `/api/add-new-staff`,
        body: { data: JSON.stringify(dataObject) },
        // fileArray: profilePicture ? [{ filename: 'profilePicture', file: profilePicture }] : [],
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong', err)
        }
    })
}

export function isEmailTaken({ email, dataProcessor }) {
    getRequestHandler({
        route: `/api/check-email/?email=${email}`,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong', err)
        }
    })
}

export function deleteStaff({ email, dataProcessor }) {
    getRequestHandler({
        route: `/api/delete-staff/?email=${email}`,
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