import { loadMsgSuccessful, loadSuccessHistory, sendMessage } from "./conversationSlice";
import { httpManager } from "../../managers/httpManagers";

export const loadHistory = (senderId, receiverId, page, messagesPerPage) => async (dispatch) => {

    try {
        const response = await httpManager.getChatHistory(senderId, receiverId, page, messagesPerPage)
        
        if (response.status === 200) {
            dispatch(loadSuccessHistory(response.data.conversation))
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
        dispatch(sendMessage(object))
        const response = await httpManager.sendAiMessage({msgArray:object, isNewConversation: isNewConversation, senderId: senderId})

        if (response.status === 200) {
            dispatch(loadMsgSuccessful(response.data))
        } 
    } catch(e) {
        console.log(e.message)
    }
}

// export const editThisDoc = (docId) => async (dispatch) => {

//   try {
//     console.log(docId)
//     dispatch(selectDoc(docId))
//   } catch (error){
//     console.log(error.message)
//   }

// }

// export const delDoc = (docId) => async (dispatch) => {
//   try {
//     const response = await httpManager.deleteDocuments(docId)
//     if (response.status === 200) {
//       dispatch(deletedSuccess())
//       console.log('delete')
//    } 
//   } catch (error){
//     console.log(error.message)
//   }
// }