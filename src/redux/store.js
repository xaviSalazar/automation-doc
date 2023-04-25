import { configureStore } from "@reduxjs/toolkit";
import workspaceReducer from "./workspace/workspaceSlice"
// import abogadosReducer from './mainlayout/mainlayoutSlice'
// import loginReducer from './login/loginSlice'
// import userReducer  from './authenticate/userSlice'
// import ticketsReducer from './tickets/ticketSlice'
// import notificationReducer from './notifications/notificationSlice'

const store = configureStore({
    
    reducer: {
        workspace: workspaceReducer,
        // list of reducers
        // abogados: abogadosReducer,
        // login: loginReducer,
        // user: userReducer,
        // tickets: ticketsReducer,
        // notifications: notificationReducer
    }
});

export default store;