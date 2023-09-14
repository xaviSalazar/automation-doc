// material
import { Stack, Divider, Typography } from '@mui/material';
// component

import FacebookLogin from 'react-facebook-login';

import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';
import { useEffect } from 'react';
import { doFacebookLogin, doGoogleLogin } from '../../../redux/loginStore/loginAction';
import { useDispatch } from 'react-redux';


// ----------------------------------------------------------------------

export default function AuthSocial() {
  const dispatch = useDispatch();

  // GOOGLE LOGIN
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  const clientId = '739497935634-lqeff7f2654mbakdlrhv5inrhg4taons.apps.googleusercontent.com';

  useEffect(() => {
    const initClient = () => {
          gapi.client.init({
          clientId: clientId,
          scope: ''
        });
      };
      gapi.load('client:auth2', initClient);
  });

  const onSuccess = async (res) => {

    console.log('success:', res);
    dispatch(doGoogleLogin({name: res['profileObj']['name'], email: res['profileObj']['email']}))
    
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
  const responseFacebook = async (response) => {
    console.log(response);

    dispatch(doFacebookLogin({accessToken: response.accessToken,
      userID: response.userID}))
  }
 

  
  
  return (
    <>
       <Stack direction="row" spacing={2}>
        <FacebookLogin
          textButton="INGRESA CON FACEBOOK"
          appId="1713658689034375" //APP ID NOT CREATED YET
          fields="name,email,picture"
          callback={responseFacebook}
        />

       <GoogleLogin
          clientId={clientId}
          buttonText="INGRESA CON GOOGLE"
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy={'single_host_origin'}
          isSignedIn={false}
      />

        {/* <Button fullWidth size="large" color="inherit" variant="outlined">
          <Iconify icon="eva:google-fill" color="#DF3E30" width={22} height={22} />
        </Button>

        <Button fullWidth size="large" color="inherit" variant="outlined">
          <Iconify icon="eva:facebook-fill" color="#1877F2" width={22} height={22} />
        </Button> */}

        {/* <Button fullWidth size="large" color="inherit" variant="outlined">
          <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={22} height={22} />
        </Button> */}
      </Stack>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          OR
        </Typography>
      </Divider>
    </>
  );
}
