import { loadSuccess } from "./workspaceSlice";

export const saveAll = (data) => async (dispatch) => {

    try 
    {
        localStorage.setItem('workspace', JSON.stringify(data));
    } 
    catch ( error )
    {
        console.log(error.message);
    }

}

export const loadWorkspace = () => async(dispatch) => {

    try 
    {
        const loadData = JSON.parse(localStorage.getItem("workspace"))
        console.log(loadData)
        dispatch(loadSuccess(loadData))
    } 
    catch(error)
    {
    }
    
}