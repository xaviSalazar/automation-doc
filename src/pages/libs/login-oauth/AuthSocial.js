// material
import { Stack, Divider, Typography } from '@mui/material';
// component

// import FacebookLogin from 'react-facebook-login';
import { doGoogleLogin } from '../../../redux/loginStore/loginAction';
import { useDispatch } from 'react-redux';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';



// ----------------------------------------------------------------------

export default function AuthSocial() {
  const dispatch = useDispatch();

  // GOOGLE LOGIN
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------

  const onSuccess = async (res) => {
    dispatch(doGoogleLogin({ clientId: res['clientId'], credential: res['credential'] }))
  };


  const onFailure = (err) => {
    console.log('failed:', err);
  };

  // const responseGoogle = (response) => {
  //   console.log(response);
  // }
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // const responseFacebook = async (response) => {
  //   console.log(response);

  //   dispatch(doFacebookLogin({accessToken: response.accessToken,
  //     userID: response.userID}))
  // }




  return (
    <>
      <Stack direction="row" spacing={2}>
        {/* <FacebookLogin
          textButton="INGRESA CON FACEBOOK"
          appId="1713658689034375" //APP ID NOT CREATED YET
          fields="name,email,picture"
          callback={responseFacebook}
        /> */}


        <GoogleOAuthProvider clientId="888743510322-ovaintflo66ck52h76307kcqbse71fm0.apps.googleusercontent.com">

          <GoogleLogin
            onSuccess={onSuccess}
            onError={onFailure}
          />

        </GoogleOAuthProvider>
      </Stack>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          OR
        </Typography>
      </Divider>
    </>
  );
}
