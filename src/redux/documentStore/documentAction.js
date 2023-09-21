import { loadSuccessDocs, selectDoc, loadingPending, deletedSuccess } from "./documentSlice";
import { httpManager } from "../../managers/httpManagers";

export const loadDocs = (paging, rowsPerPage, userId) => async (dispatch) => {

    dispatch(loadingPending())

    try {
        const response = await httpManager.getDocuments(paging, rowsPerPage, userId);
        
        if (response.status === 200) {
            response.data['page'] = paging
            dispatch(loadSuccessDocs(response.data))
         } 
        else {
          console.error('Error fetching documents:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      }

}

export const editThisDoc = (docId) => async (dispatch) => {

  try {
    console.log(`editing doc: ${docId}`)

    const response = await httpManager.downloadFileBinary(docId)
    if (response.status === 200) {
      console.log(response.data['attachment_binary'])
      dispatch(selectDoc(response.data['attachment_binary']))
   } 
  else {
    console.error('Error fetching documents:', response.statusText);
  }
  } catch (error){
    console.log(error.message)
  }

}

export const delDoc = (docId) => async (dispatch) => {
  try {
    const response = await httpManager.deleteDocuments(docId)
    if (response.status === 200) {
      dispatch(deletedSuccess())
      console.log('delete')
   } 
  } catch (error){
    console.log(error.message)
  }
}

