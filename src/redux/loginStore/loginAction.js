import {loginPending, loginSuccess, loginFail, logoutErase} from './loginSlice'
import { httpManager } from '../../managers/httpManagers'


export const doLogin = (data) => async (dispatch) => {

    // first dispatch the loading
    dispatch(loginPending()) 
    try {
        // fetch data from api 
        const result = await httpManager.loginUser(data)
        if(result.status === 200) {
        // succesfully registered go to login page 
        const token = result['data']['token']
        localStorage.setItem('customerToken', token)
        dispatch(loginSuccess("test"))
        } else if(result.status === 401){
            dispatch(loginFail(result['data']['message']))
        }
    } catch (error) {
        dispatch(loginFail(error.message));
    }

}

export const autoLogin = () => async(dispatch) => {
    try {
        dispatch(loginPending())
        // call the api 
        const token = localStorage.getItem('customerToken')
        const config = {
              headers: {Authorization: `Bearer ${token}`}
        } 
          const result = await httpManager.userAuth(config)
          // console.log(result)
          if(result.status === 200) {
            dispatch(loginSuccess("test"))
          } else {
            dispatch(loginFail(result['data']['message']))
          }
    } catch(error) {
        dispatch(loginFail(error.message))
    }
}

export const doLogout = () => async(dispatch) => {
    try {
        const token = localStorage.getItem('customerToken');
        const config = {
            headers: {Authorization: `Bearer ${token}`}
        }
        localStorage.removeItem('customerToken')
        const result = await httpManager.logoutUser(config)
        if(result.status === 200) {
            dispatch(logoutErase())
        }

    } catch(error) {
        dispatch(loginFail(error.message))
    }
}