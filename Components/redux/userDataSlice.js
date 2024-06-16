//This slice is used by both Login component and 
//Register Component. Hence the need to define
//it in a more central location (ie, app folder) 
//to avoid unnecessary duplicity of codes

import { createSlice } from "@reduxjs/toolkit";

export const userDataSlice = createSlice({
    name: 'userData',
    initialState: {
        email: '',
        notificationCount: 0
    },
    reducers: {
        loadUserData: (state, action) => {
            return {
                ...state,
                email: action.payload.email,
            }
        },
        logOutUser: (state) => {
            return {
                ...state,
                email: ''
            }
        },
        alterNotification: (state, action) => {
            return {
                ...state,
                notificationCount: action.payload.count
            }
        }

    }
});

export const { loadUserData, logOutUser, alterNotification } = userDataSlice.actions;
export default userDataSlice.reducer;