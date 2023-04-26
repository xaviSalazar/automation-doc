import { loadSuccessFiles } from "./filesSlice";

export const saveFiles = (data) => async (dispatch) => {

    try 
    {
        localStorage.setItem('files', JSON.stringify(data));
    } 
    catch ( error )
    {
        console.log(error.message);
    }

}

export const loadFiles = () => async(dispatch) => {

    try 
    {
        const loadData = JSON.parse(localStorage.getItem("files"))
        // console.log(loadData)
        dispatch(loadSuccessFiles(loadData))
    } 
    catch(error)
    {
        console.log(error.message);
    }

}

