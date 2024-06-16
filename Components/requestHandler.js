'use client'

import authStarter from "./authStarter";
import { startAuthSession } from "./redux/authSlice";
import store from "./redux/store";

export function authInitialisation({ route, method, data, authUrl, handler }) {
    console.log('called authInit')
    const currentRequestPayload = { url: route, method: method, data: data, authUrl: authUrl };

    store.dispatch(startAuthSession(currentRequestPayload));

    authStarter({ successCallback: handler })
}

export function getRequestHandler({ route, successCallback, errorCallback }) {
    fetch(route, { method: 'GET' }).then((response) => {
        response.json().then(body => {
            if (body?.authErr === 'login') {
                //The user is currently not logged in and is required to login to perform the request.
                //Save their current request data. Then send them to the login page. 
                authInitialisation({
                    route: route, method: 'GET', data: null,
                    authUrl: body?.authUrl, type: body?.type, handler: () => {
                        getRequestHandler({ route: route, successCallback: successCallback, errorCallback: errorCallback })
                    }
                });
            }
            else {
                successCallback(body)
            }

        }).catch(err => {
            errorCallback(err)
        })
    }).catch(err => {
        errorCallback(err)
    })
}


export async function postRequestHandler({ route, body, fileArray, successCallback, errorCallback }) {
    const formData = new FormData();

    if (body) {
        Object.keys(body).forEach(key => formData.append(key, body[key]))
    }

    const filenames = [];

    // if (fileArray?.length) {
    //     fileArray.map((file, index) => {
    //         formData.append(file.filename, file.file);
    //         filenames.push(file.filename);
    //     })
    //     formData.append('filenames', JSON.stringify(filenames))
    // }
    if (fileArray?.length) {
        fileArray.map((file, index) => {
            formData.append(file.filename, file.file);
            filenames.push({ filename: file.filename, folderId: file.folderId }); // Push as an object
        })
        formData.append('filenames', JSON.stringify(filenames))
    }
    

    fetch(route, { method: 'POST', body: formData, }).then((response) => {
        console.log('response', response)
        response.json().then(value => {
            if (value?.authErr === 'login') {
                //The user is currently not logged in and is required to login to perform the request.
                //Save their current request data. Then send them to the login page.
                //The authUrl is the url where the authentication should be done
                console.log('user needs to log in for this operation');
                authInitialisation({
                    route: route, method: 'GET', handler: () => {
                        console.log('body', body)
                        postRequestHandler({
                            route: route, body: body, fileArray: fileArray,
                            successCallback: successCallback, errorCallback: errorCallback
                        })
                    },
                    data: body, authUrl: value?.authUrl, type: value?.type
                });
            }
            else {
                successCallback(value)
            }
        }).catch(err => {
            console.log('json error', err)
            errorCallback(err)
        })
    }).catch(err => {
        console.log('gen error')
        errorCallback(err)
    })
}