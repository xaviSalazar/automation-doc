import * as React from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { httpManager } from '../managers/httpManagers.js';
import { useLocation } from 'react-router-dom';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

function ImgGenerator(props) {

  const { userCard } = useSelector(state => state.login);
  const [results, setResults] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = React.useState(false);
  const [openErrorDialog, setOpenErrorDialog] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const location = useLocation();

  // dialog 
  const handleRunModelClick = () => {
    setOpenDialog(true);
  };
  
  const handleConfirm = () => {
    setOpenDialog(false);
    uploadFiles(); // Proceed with your existing uploadFiles function
  };
  
  const handleCancel = () => {
    setOpenDialog(false);
  };

  // input user selected files
  const [selectedFiles, setSelectedFiles] = React.useState({
    modelo: null,
    prenda: null,
  });

  // when images come from database
  const [imageURLs, setImageURLs] = React.useState({
    model_image: null,
    garment_image: null,
  });

  // one image retrieve method
  React.useEffect(() => {

    const fetchData = async () => {
      try {
        // Only attempt to fetch data if 'location.search' is not empty
        if (location.search) {
          const params = new URLSearchParams(location.search);
          const resultsValue = params.get('results');
          console.log(resultsValue);
          const { data } = await httpManager.getImgResults(resultsValue);
          console.log(data)
          displayResults(JSON.parse(data.attachment))
        }
      } catch (error) {
        console.error('Failed to fetch image results:', error);
        // Handle error (e.g., display a notification)
      }
    };

    fetchData();
    // It's important to listen to changes in location.search,
    // so you can add it as a dependency for the effect.
    // This ensures that the effect runs again if the search part of the URL changes.
  }, [location.search]); // Make sure to adjust this dependency if necessary

  const handleFileEvent = (e, key) => {
    const file = e.target.files[0];
    setSelectedFiles(prevFiles => ({
      ...prevFiles,
      [key]: file,
    }));
  };

  const uploadFiles = async () => {

    try {

      if (!selectedFiles.modelo || !selectedFiles.prenda) {
        throw new Error('FOTOS NO HAN SIDO SUBIDAS A PRENDA O MODELO.');
      }
      const attachmentArray = [];
      const uploadPromises = Object.entries(selectedFiles).map(([key, file]) => {
        
        if (file) {
          const obj = {
            lastModified: file.lastModified,
            key: key,
            name: file.name,
            size: file.size,
            type: file.type,
          };

          attachmentArray.push(obj);

          return httpManager.requestUrl(obj)
            .then(url => httpManager.uploadFileToS3(url['data']['url'], file));
        }
        return null; // Return null for files that are not selected
      });
      // push credential id 
      attachmentArray.push({
        key: 'credentials',
        user_id: userCard['id'],
        user_email: userCard['email'],
        user_name: userCard['username'],
        title: "TESTING",
      });

      console.log(attachmentArray)
      await Promise.all(uploadPromises);
      const response = await httpManager.callOotDiffusion(attachmentArray);
      console.log(response)
       // If no error occurs, show the success dialog
      setOpenSuccessDialog(true);

      // Reset selected files and imageURLs states to their initial values
      setSelectedFiles({
        modelo: null,
        prenda: null,
      });
      setImageURLs({
        model_image: null,
        garment_image: null,
      });

    } catch (e) {
      console.log(e.message);
      // Set the error message and show the error dialog
      setErrorMessage(e.message);
      setOpenErrorDialog(true);
    }

  };

  // Function to display the results based on the JSON data
  const displayResults = (data) => {
    if (data && data.outputs) {
      setResults(data.outputs);
      setImageURLs({
        model_image: data.model_image,
        garment_image: data.garment_image,
      });
    }
  };

  const openFileInput = (key) => {
    const fileUpload = document.getElementById(`fileUpload${key}`);
    if (fileUpload) {
      fileUpload.click();
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>

      {!results && (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleRunModelClick}
          sx={{ position: 'flex' }}
        >
          RUN MODEL
        </Button>
      )}

      <Grid container spacing={4} alignItems="flex-start">
           <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ marginTop: 4 }}>
            See Results
          </Typography>
          {results && (
            <Grid container spacing={2} justifyContent="center">
              {results.map((url, index) => (
                <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                  <img src={url} alt={`Result ${index}`} style={{ maxWidth: '100%', height: 'auto' }} />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>

        {/* Modelo and Prenda/Ropa upload sections in their own row */}
        <Grid item xs={12} sm={6}>
          {/* Modelo upload section */}
          <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              MODELO
            </Typography>
          </Box>
          <Box
            sx={{
              width: '100%',
              minHeight: '100px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#f0f0f0',
              cursor: 'pointer',
              marginBottom: 2
            }}
            onClick={() => openFileInput('modelo')}
          >
            <input
              id="fileUploadmodelo"
              type="file"
              multiple
              accept=".jpg, .jpeg, .png, .gif"
              hidden
              onChange={(e) => handleFileEvent(e, 'modelo')}
            />
            {!selectedFiles.modelo && !imageURLs.model_image ? null : (
              <img
              src={selectedFiles.modelo ? URL.createObjectURL(selectedFiles.modelo) : imageURLs.model_image}
              alt="Model"
              style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                }}
              />
            )}
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          {/* Prenda/Ropa upload section */}
          <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              PRENDA / ROPA
            </Typography>
          </Box>
          <Box
            sx={{
              width: '100%',
              minHeight: '100px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#f0f0f0',
              cursor: 'pointer',
            }}
            onClick={() => openFileInput('prenda')}
          >
            <input
              id="fileUploadprenda"
              type="file"
              hidden
              onChange={(e) => handleFileEvent(e, 'prenda')}
              multiple
              accept=".jpg, .jpeg, .png, .gif"
            />
            {!selectedFiles.prenda && !imageURLs.garment_image ? null : (
              <img
              src={selectedFiles.prenda ? URL.createObjectURL(selectedFiles.prenda) : imageURLs.garment_image}
              alt="Garment"
              style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                }}
              />
            )}
          </Box>
        </Grid>



      </Grid>

      <Dialog
  open={openDialog}
  onClose={handleCancel}
  aria-labelledby="alert-dialog-title"
  aria-describedby="alert-dialog-description"
>
  <DialogTitle id="alert-dialog-title">{"Confirmación"}</DialogTitle>
  <DialogContent>
    <DialogContentText id="alert-dialog-description">
      ¿ESTÁS SEGURO DE CORRER EL MODELO CON ESTAS IMÁGENES?
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCancel}>CANCELAR</Button>
    <Button onClick={handleConfirm} autoFocus>
      ACEPTO
    </Button>
  </DialogActions>
</Dialog>

<Dialog
  open={openSuccessDialog}
  onClose={() => setOpenSuccessDialog(false)}
  aria-labelledby="success-dialog-title"
  aria-describedby="success-dialog-description"
>
  <DialogTitle id="success-dialog-title">{"¡Éxito!"}</DialogTitle>
  <DialogContent>
    <DialogContentText id="success-dialog-description">
      PERFECTO! REVISAR TUS RESULTADOS EN 5 MIN EN TU BUZÓN DE EMAIL: {userCard.email}
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenSuccessDialog(false)}>CERRAR</Button>
  </DialogActions>
</Dialog>

<Dialog
  open={openErrorDialog}
  onClose={() => setOpenErrorDialog(false)}
  aria-labelledby="error-dialog-title"
  aria-describedby="error-dialog-description"
>
  <DialogTitle id="error-dialog-title">{"Error"}</DialogTitle>
  <DialogContent>
    <DialogContentText id="error-dialog-description">
      Se ha producido un error al procesar tu solicitud: {errorMessage}
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenErrorDialog(false)}>Cerrar</Button>
  </DialogActions>
</Dialog>

    </Box>
  );
}

export default ImgGenerator;