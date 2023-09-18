import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    docsArray: [],
    totalDocs: 1,
    cachePage: [],
    selectDoc: null,
    isLoading: true, 
    reloadData: false, 
}

const docsSlice = createSlice({
    name: 'document-store',
    initialState,
    reducers: {
        loadingPending:(state) => {
            state.isLoading = true
        },
        loadSuccessDocs: (state, action) => {    
            state.totalDocs = action.payload.total_docs
            state.isLoading = false
            state.reloadData = false
            // Check if the page is not already in cachePage before adding it
            if (!state.cachePage.includes(action.payload.page)) {
                state.cachePage.push(action.payload.page); // Add the page to the array
                state.docsArray = [...state.docsArray, ...action.payload.docs];
            }
        },
        selectDoc:(state, action) => {
            state.selectDoc = action.payload
        },
        deletedSuccess: (state) => {
            state.reloadData = true
        }

    }
});

const { reducer, actions } = docsSlice

export const { loadSuccessDocs, selectDoc, loadingPending,deletedSuccess  } = actions

export default reducer