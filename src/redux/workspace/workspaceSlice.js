import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    rows: [],
    columns: [],
    content: null
}

const workspaceSlice = createSlice({
    name: 'init-workspace',
    initialState,
    reducers: {

        loadSuccess: (state, action) => {
            state.rows = action.payload.row
            state.columns = action.payload.column
            state.content = action.payload.contenu
        }

    }
});

const { reducer, actions } = workspaceSlice

export const {loadSuccess} = actions

export default reducer