import { getRequestHandler, postRequestHandler } from "@/Components/requestHandler";

export function getPrivileges({ name, dataProcessor }) {
    getRequestHandler({
        route: name ? `/api/get-privileges/?name=${name}` : `/api/get-privileges`,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong', err)
        }
    })
}

export function editPrivilege({ name, privilegeObject, dataProcessor }) {
    postRequestHandler({
        route: `/api/edit-privilege`,
        body: { name: name, privilegeObject: JSON.stringify(privilegeObject) },
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong', err)
        }
    })
}

export function createPrivilege({ name, privilegeObject, dataProcessor }) {
    postRequestHandler({
        route: `/api/create-privilege`,
        body: { name: name, privilegeObject: JSON.stringify(privilegeObject) },
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong', err)
        }
    })
}

export function deletePrivilege({ name, dataProcessor }) {
    getRequestHandler({
        route: `/api/delete-privilege/?name=${name}`,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong', err)
        }
    })
}
