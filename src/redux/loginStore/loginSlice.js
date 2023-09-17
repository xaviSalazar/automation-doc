import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    isAuth: false,
    userType: '',
    userCard: '',
    error: ''
}

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        loginPending:(state) => {
            state.isLoading = true
        },
        loginSuccess:(state, action) => {
            state.isLoading = false
            state.isAuth = true
            state.userType = action.payload
            state.userCard = action.payload.user
            state.error = ''
        },
        loginFail:(state, action) => {
            state.isLoading = false
            state.error = action.payload
            state.userType = ''
            state.userCard = ''
            state.isAuth = false
        },
        logoutErase: (state) => {
            state.isLoading = false
            state.isAuth = false
            state.userType = ''
            state.error = ''
        }
    }
});

const { reducer, actions } = loginSlice

export const{loginPending, loginSuccess, loginFail, logoutErase} = actions

export default reducer