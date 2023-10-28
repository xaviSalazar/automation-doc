import { loadSuccessDocs, appendDocs, selectDoc, loadingPending, deletedSuccess } from "./documentSlice";
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

export const uploadMultipleDocs = (formData, rowsPerPage, userId) => async (dispatch) => {

      const response = await httpManager.multipleUploadFiles(formData);
      if (response.status === 200) {
        console.log('Files uploaded successfully');
        dispatch(loadDocs(0, rowsPerPage, userId))
        // Handle the response from the server if necessary
      } else {
        console.error('File upload failed');
        // Handle the error
      }

}

export const appendloadDocs = (paging, rowsPerPage, userId) => async (dispatch) => {

  dispatch(loadingPending())

  try {
      const response = await httpManager.getDocuments(paging, rowsPerPage, userId);
      
      if (response.status === 200) {
          response.data['page'] = paging
          dispatch(appendDocs(response.data))
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
      console.log(response.data)
      dispatch(selectDoc(response.data))
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
      dispatch(deletedSuccess(docId))
      console.log('delete')
   } 
  } catch (error){
    console.log(error.message)
  }
}

