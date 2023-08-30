import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    filesArray: [],
}

const filesSlice = createSlice({
    name: 'files-store',
    initialState,
    reducers: {
        loadSuccessFiles: (state, action) => {
            state.filesArray = action.payload
        }

        
    }
});

const { reducer, actions } = filesSlice

export const { loadSuccessFiles } = actions

export default reducer