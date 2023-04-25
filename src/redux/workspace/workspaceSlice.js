import { createSlice, current } from "@reduxjs/toolkit"

const initialState = {
    rows: [],
    columns: [],
    content: null
}

const loadInit = createSlice({
    name: 'init-loading',
    initialState,
    reducers: {

    }
})