import { configureStore } from "@reduxjs/toolkit";
import groupReducer from './groupSlice'

export default configureStore({
    reducer: {
        group: groupReducer,
    }
})