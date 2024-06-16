import { postRequestHandler } from "../requestHandler";

export const deleteAll = async ({ setStatus, selectItemsRows, deleteEndpoint, closeDeleteAllWarning, }) => {
    setStatus('submitting')
    await postRequestHandler({
        route: `${deleteEndpoint}`, body: { id: JSON.stringify(selectItemsRows) },
        successCallback: body => {
            const result = body?.result;

            if (result) {
                console.log('deleted ');
                closeDeleteAllWarning();
                window.location.reload()
            }
            else if (body?.error) {
                closeDeleteAllWarning();
                setError(body?.error)
            }
            else {
                console.log('error deleting ');
                closeDeleteAllWarning();
            }
        },
        errorCallback: () => {
            console.log('error deleting ');
            closeDeleteAllWarning();
        }
    })
}

export const publish = async ({ setStatus, selectItemsRows, closeDeleteAllWarning, publishEndpoint }) => {
    setStatus('submitting')
    await postRequestHandler({
        route: `${publishEndpoint}`, body: { id: JSON.stringify(selectItemsRows) },
        successCallback: body => {
            const result = body?.result;

            if (result) {
                console.log('deleted ');
                closeDeleteAllWarning();
                window.location.reload()
            }
            else {
                console.log('error deleting ');
                closeDeleteAllWarning();
            }
        },
        errorCallback: () => {
            console.log('error deleting ');
            closeDeleteAllWarning();
        }
    })
}

export const makeDefault = async ({ setStatus, selectItemsRows, closeDeleteAllWarning }) => {
    setStatus('submitting')
    try {
        const response = await fetch(`/api/set-default-contact-form-email?id=${selectItemsRows[0]}`,
            { method: 'GET', cache: 'no-store' });
        const { result, errorRedirect } = await response.json();
        if (errorRedirect) return window.location.replace('/login')

        if (result) {
            closeDeleteAllWarning();
            window.location.reload()
        }
    } catch (error) {
        console.log('error deleting ');
        closeDeleteAllWarning();
    }
}

export const unPublish = async ({ setStatus, selectItemsRows, closeDeleteAllWarning, unpublishEndpoint }) => {
    setStatus('submitting')
    await postRequestHandler({
        route: `${unpublishEndpoint}`, body: { id: JSON.stringify(selectItemsRows) },
        successCallback: body => {
            const result = body?.result;

            if (result) {
                console.log('deleted ');
                closeDeleteAllWarning();
                window.location.reload()
            }
            else {
                console.log('error deleting ');
                closeDeleteAllWarning();
            }
        },
        errorCallback: () => {
            console.log('error deleting ');
            closeDeleteAllWarning();
        }
    })
}

export const cancel = async ({ setStatus, cancelEndpoint, selectItemsRows, closeDeleteAllWarning }) => {
    setStatus('submitting')
    await postRequestHandler({
        route: `${cancelEndpoint}`, body: { id: JSON.stringify(selectItemsRows) },
        successCallback: body => {
            const result = body?.result;

            if (result) {
                console.log('deleted ');
                closeDeleteAllWarning();
                window.location.reload()
            }
            else {
                console.log('error deleting ');
                closeDeleteAllWarning();
            }
        },
        errorCallback: () => {
            console.log('error deleting ');
            closeDeleteAllWarning();
        }
    })
}

export const markAsRead = async ({ setStatus, selectItemsRows, markAsReadEndpoint, closeDeleteAllWarning }) => {
    setStatus('submitting')
    await postRequestHandler({
        route: `${markAsReadEndpoint}`, body: { id: JSON.stringify(selectItemsRows) },
        successCallback: body => {
            const result = body?.result;

            if (result) {
                console.log('deleted ');
                closeDeleteAllWarning();
                window.location.reload()
            }
            else {
                console.log('error deleting ');
                closeDeleteAllWarning();
            }
        },
        errorCallback: () => {
            console.log('error deleting ');
            closeDeleteAllWarning();
        }
    })
}

export const markAsUnead = async ({ setStatus, markAsUnreadEndpoint, selectItemsRows, closeDeleteAllWarning }) => {
    setStatus('submitting')
    await postRequestHandler({
        route: `${markAsUnreadEndpoint}`, body: { id: JSON.stringify(selectItemsRows) },
        successCallback: body => {
            const result = body?.result;

            if (result) {
                console.log('deleted ');
                closeDeleteAllWarning();
                window.location.reload()
            }
            else {
                console.log('error deleting ');
                closeDeleteAllWarning();
            }
        },
        errorCallback: () => {
            console.log('error deleting ');
            closeDeleteAllWarning();
        }
    })
}