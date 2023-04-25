

export const saveAll = (data) => async (dispatch) => {

    try {
        localStorage.setItem('workspace', JSON.stringify(data));
    } catch ( error ) {
        console.log(error.message);
    }

}