import { loadMsgSuccessful, sendMessage, cleanRcvBuffer, setDocument } from "./chatpdfSlice";
import { httpManager } from "../../managers/httpManagers";


export const sendMsg = (object, senderId) => async (dispatch) => {
    try{
        dispatch(sendMessage())
        console.log(object)
        const response = await httpManager.sendchatpdfMessage(object)

        if (response.status === 200) {
            dispatch(loadMsgSuccessful(response.data))
        } 
    } catch(e) {
        console.log(e.message)
    }
}

export const cleanReceivedMsg = () => async (dispatch) => {
    try {
        dispatch(cleanRcvBuffer())
    } catch (e) {
        console.log(e.message)
    }
}

export const setActiveDocument = (uniqueId) => async (dispatch) => {
    dispatch(setDocument(uniqueId))
}

