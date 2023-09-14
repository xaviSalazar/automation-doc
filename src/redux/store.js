import { configureStore } from "@reduxjs/toolkit";
import workspaceReducer from "./workspace/workspaceSlice"
import filesReducer from "./filesStore/filesSlice"
import loginReducer from "./loginStore/loginSlice"
// import abogadosReducer from './mainlayout/mainlayoutSlice'
// import loginReducer from './login/loginSlice'
// import userReducer  from './authenticate/userSlice'
// import ticketsReducer from './tickets/ticketSlice'
// import notificationReducer from './notifications/notificationSlice'

const store = configureStore({
    
    reducer: {
        workspace: workspaceReducer,
        filesSaved: filesReducer,
        login: loginReducer
        // list of reducers
        // abogados: abogadosReducer,
        // login: loginReducer,
        // user: userReducer,
        // tickets: ticketsReducer,
        // notifications: notificationReducer
    }
});

export default store;