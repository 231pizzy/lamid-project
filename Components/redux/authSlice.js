//This slice is used by both Login component and 
//Register Component. Hence the need to define
//it in a more central location (ie, app folder) 
//to avoid unnecessary duplicity of codes

import { createSlice } from "@reduxjs/toolkit";

const handleRequest = ({ method, route, body, }) => {
    /*  if(body){
         const formData=new FormData();
         Object.keys(body).forEach(key=>{formData.append(key,body[key])});
         body=formData
     }
 
     fetch(route,{method:method,body:body}).then(response=>{
         response.json(body=>{
 
         })
     }) */
    /*   postRequestHandler({
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
      }) */
}

export const authSlice = createSlice({
    name: 'authData',
    initialState: {
        pendingRequestObject: {},
        authStarted: false,
        authUrl: '',
        type: ''
    },
    reducers: {
        startAuthSession: (state, action) => {
            //start a new auth session
            const { url, data, authUrl, method, type } = action.payload

            console.log('starting auth session', url, data, authUrl, method)

            return {
                ...state,
                pendingRequestObject: { url: url, data: data, method: method },
                authStarted: true,
                authUrl: authUrl,
                type: type
            }
        },
        endAuthSession: (state,) => {
            //If the auth operation succeeded, repeat the request that led to the auth.

            //End an auth session by clearing all stored data 
            return {
                ...state,
                pendingRequestObject: {},
                authStarted: false,
                authUrl: '',
                type: '',
            }
        },
    }
});

export const { startAuthSession, endAuthSession } = authSlice.actions;
export default authSlice.reducer;