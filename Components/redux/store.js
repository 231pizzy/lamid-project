import { configureStore } from '@reduxjs/toolkit';
import routeSlice from './routeSlice';
import userDataReducer from './userDataSlice';
import projectGroupSlice from './newProjectGroup';
import authSlice from './authSlice';

//Redux global store
export default configureStore({
    reducer: {
        userData: userDataReducer,
        route: routeSlice,
        newProjectGroup: projectGroupSlice,
        authData: authSlice
    }
});