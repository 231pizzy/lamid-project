import { getRequestHandler, postRequestHandler } from "@/Components/requestHandler";

// export function getDocument({ docType, dataProcessor }) {
//     getRequestHandler({
//         route: `/api/get-document/?docType=${docType}`,
//         successCallback: body => {
//             const result = body?.result;
//             dataProcessor(result)
//         },
//         errorCallback: err => {
//             console.log('Something went wrong')
//         }
//     })
// }
export function getDocument({ docType, folderId, dataProcessor }) {
    console.log('FolderId Helper Id:', folderId);
    getRequestHandler({
        route: `/api/get-document/?docType=${docType}&folderId=${folderId}`, // Pass folderId in the request
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result);
        },
        errorCallback: err => {
            console.log('Something went wrong');
        }
    });
}


export function deleteDocument({ fileName, dataProcessor }) {
    getRequestHandler({
        route: `/api/delete-document/?fileName=${fileName}`,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong')
        }
    })
}

export function saveDocument({fileArray, dataProcessor }) {
    console.log("File Array with folderId:", fileArray);
    const body = {}

    postRequestHandler({
        route: `/api/save-document`,
        body: body,
        fileArray: fileArray,
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong')
        }
    })
}

export function downloadDocument({ filename, dataProcessor }) {
    getRequestHandler({
        route: `/api/download-document/?filename=${filename}`,
        successCallback: body => {
            const result = body?.result;
            console.log('result', result)
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong', err)
        }
    })
}