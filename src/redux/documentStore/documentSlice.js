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
            state.docsArray = action.payload.docs
            console.log(state.docsArray)
            state.cachePage = [0]
        },
        appendDocs: (state, action) => {
            state.totalDocs = action.payload.total_docs
            state.isLoading = false
            state.reloadData = false
            // Check if the page is not already in cachePage before adding it
            if (!state.cachePage.includes(action.payload.page)) {
                console.log(`inside append docs`)
                state.cachePage.push(action.payload.page); // Add the page to the array
                // console.log(action.payload.docs)
                // state.docsArray = [...state.docsArray, ...action.payload.docs];
                // console.log(state.docsArray)

                const newStateArray = [...state.docsArray];

                // Loop through the objects in action.payload.docs
                action.payload.docs.forEach(newDoc => {
                // Check if the attachment_id of newDoc is not present in newStateArray
                if (!newStateArray.some(existingDoc => existingDoc.attachment_id === newDoc.attachment_id)) {
                    // If not present, add the newDoc to newStateArray
                    newStateArray.push(newDoc);
                }
                });

                // Now newStateArray contains unique objects based on attachment_id
                state.docsArray = newStateArray;
            }
        },
        selectDoc:(state, action) => {
            state.selectDoc = action.payload
        },
        deletedSuccess: (state, action) => {
            state.totalDocs -= 1
            state.reloadData = true
            state.cachePage = []
            console.log(action.payload.docId)
            const filteredArray = state.docsArray.filter(obj => obj.attachment_id !== action.payload.docId);
            console.log(filteredArray)
            state.docsArray = filteredArray
        }

    }
});

const { reducer, actions } = docsSlice

export const { loadSuccessDocs, appendDocs, selectDoc, loadingPending, deletedSuccess } = actions

export default reducer