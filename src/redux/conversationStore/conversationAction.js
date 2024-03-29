import { loadingFailed, loadHistoryConversation, selectedChatId, loadMsgSuccessful, loadSuccessHistory, sendMessage, cleanRcvBuffer, appendHistory } from "./conversationSlice";
import { httpManager } from "../../managers/httpManagers";

export const loadHistory = (senderId, chatId, page, messagesPerPage) => async (dispatch) => {

    try {
        dispatch(loadHistoryConversation())
        const response = await httpManager.getChatHistory(senderId, chatId, page, messagesPerPage)
        
        if (response.status === 200) {
            dispatch(loadSuccessHistory(response.data))
         } 
        else {
            dispatch(loadingFailed())
          console.error('Error fetching documents:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      }

}

export const selectChatId = (chatId) => async (dispatch) => {
    try 
    {
        dispatch(selectedChatId(chatId))
    } catch (error) {
        console.error('chatId error:', error)
    }
}

export const appendArrayHistory = (senderId, receiverId, page, messagesPerPage) => async (dispatch) => {

    try {
         dispatch(loadHistoryConversation())
        const response = await httpManager.getChatHistory(senderId, receiverId, page, messagesPerPage)
        
        if (response.status === 200) {
            dispatch(appendHistory(response.data))
         } 
        else {
            // dispatch(loadingFailed())
          console.error('Error fetching documents:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      }

}

export const sendMsg = (object, isNewConversation, senderId) => async (dispatch) => {
    try{
        dispatch(sendMessage())
        const response = await httpManager.sendAiMessage({msgArray:object, isNewConversation: isNewConversation, senderId: senderId})

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

