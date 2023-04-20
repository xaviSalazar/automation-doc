import * as React from 'react';
import { useRef, useMemo } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Button, IconButton, MenuItem, Popover, Container, Typography, Stack} from '@mui/material';
import * as docx from "docx-preview";
import ReplaceWords from './ReplaceWords';
import LoadFile from './LoadFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { FlashOnRounded } from '@mui/icons-material';

  /**Function to by pass usage of ApiRef */
  function useApiRef(columns) {
    console.log("useApiRef")
    const apiRef = useRef(null);
    const _columns = useMemo(
      () =>
        columns.concat({
          field: "__HIDDEN__",
          width: 0,
          renderCell: (params) => {
            apiRef.current = params.api;
            return null;
          }
        }),
      [columns]
    );
    // console.log(_columns)
  
    return { apiRef, _columns: _columns };
  }


// ===========================================================================
export default function DataGridView() {

  function RenderButtonPick(props) {

    const { hasFocus, value } = props;
    const buttonElement = React.useRef(null);
    const rippleRef = React.useRef(null);
  
    React.useLayoutEffect(() => {
      if (hasFocus) {
        const input = buttonElement.current?.querySelector('input');
        input?.focus();
      } else if (rippleRef.current) {
        // Only available in @mui/material v5.4.1 or later
        rippleRef.current.stop({});
      }
    }, [hasFocus]);
  
    return (
      <strong>
        {/* {value?.getFullYear() ?? ''}  */}
        {value}
        <IconButton
          size="small"
          color = "inherit"
          onClick={(e) => handleOpenMenu(e, value)}
        >
          <MoreVertIcon />
        </IconButton>
      </strong>
    );

  }
  /*========================================================================*/
  
  /** Initial column Values for first render */
  const InitColumns = [
    { field: 'id', headerName: 'ID', width: 50, renderCell: RenderButtonPick,},
    {
      field: 'fullName',
      headerName: 'Nombre Completo',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      editable: true,
      // valueGetter: (params) =>
      //   `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
    {
      field: 'email',
      headerName: 'Correo',
      sortable: false,
      // type: 'number',
      width: 200,
      editable: true,
    },
    {
      field: 'date',
      headerName: 'Fecha',
      width: 200,
      editable: true,
    },
    {
      field: 'time',
      headerName: 'Hora',
      width: 70,
      editable: true,
    },
    {
      field: 'providencia',
      headerName: 'Providencia',
      width: 350,
      editable: true,
    },
    {
      field: 'dictamen',
      headerName: 'Dictamen',
      width: 350,
      editable: true,
    },
  ];
  
  /** Initial row values for first render */
  const initRows = 
        [{ id: 1, 
           fullName: null, 
           email: null, 
           date: null, 
           time: null, 
           providencia: null, 
           dictamen: null
          }
        ]
  
  function columnsParser(columnList) {
  
    const initColumns = [{ field: 'id', headerName: 'ID', width: 50, renderCell: RenderButtonPick, }]
   
    // creates array of objects with the keys found from uploaded document
    const colum = columnList.map( col => {
      return {field: col, headerName: col, width: 350, editable: true}
   } );
  
    return initColumns.concat(colum)
  }
  
  function rowsParser(columnList) {
  
    const headRows = { id: 1}
  
    // array dictionary creation with the keys needed to replace (rows)
    let dictionary = Object.assign({}, ...columnList.map((x) => ({[x]: null})));
    const rowss = Object.assign(headRows, dictionary)
  
    return [rowss]
  }
  

  
  const [columnLister, setColumnLister] = React.useState()
  const [content, setContent] = React.useState(null);

  const [open, setOpen] = React.useState(false);

  const [singleElement, setSingleElement] = React.useState(null);

  // holds ids of selected rows
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  // blob that contains binary word file
  const [blob, setBlob] = 
                        React.useState();
  // columns initialization
  const [columns, setColumns] = 
                              React.useState(InitColumns)
  // call apiRef bypass method
  const { apiRef, _columns } = useApiRef(columns);
  // rows initialization
  const [rows, setRows] = 
                        React.useState(initRows)

  /* UseEffect to process columns and rows from parsed document */
  React.useEffect(() => {

    console.log("useEffect -> columnLister")
    // check undefined when webapp starts
    if(typeof columnLister === 'undefined')
      console.log("useEffect return -> columnLister")
      return

    const newColumns = columnsParser(columnLister)
    const newRows = rowsParser(columnLister)
    // sets columns and rows parsed from uploaded file
    setColumns(newColumns)
    setRows(newRows)
  }, [columnLister])


  /* UseEffect for blob visualization content after word replacement*/
  React.useEffect(() => {
    if(typeof blob === "undefined")
      return 
    docx.renderAsync(blob, document.getElementById("viewer_docx"))
        .then((x) => console.log("docx: finished"))
  }, [blob])

  /* useMemo to update the content of the cells */
  // const _columns = useMemo(() => columns.concat({ 
  //                                                 field: "__HIDDEN__",
  //                                                 width: 0,
  //                                                 renderCell: (params) => {                         
  //                                                   apiRef.current = params.api;
  //                                                   return null;
  //                                                 }
  //                                               }),
  //                                               [columns]);
  
  const handleClickButton = () => {
    const obj = apiRef.current.getRowModels();
    console.log(apiRef.current.getRowModels());
    // gets correctly created
    console.log(obj.get(1))
    ReplaceWords(content, obj.get(1), "nombre_apellido", setBlob);
    // Example(obj.get(1), setBlob);
  }

  const handleAddRowClickButton = () => {
    // actual len of rows
    const arrSize = Object.keys(rows).length;
    // new element to add
    const newElement =  { id: arrSize + 1, fullName: null, email: null, date: null, time: null, providencia: null, dictamen: null } 
    // useState to add element
    setRows( prevState => [...prevState, newElement] )
  }

  const handleOpenMenu = (event, value) => {
    console.log(value)
    setSingleElement(value)
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(false);
  };

  const handleSeeDoc = () => {
    console.log("ver doc")
    const obj = apiRef.current.getRowModels();
    console.log(obj.get(singleElement))
    ReplaceWords(content, obj.get(singleElement), "nombre_apellido", setBlob, false);
    setOpen(false);
  }

  const handleDownload = () => {
    console.log("download doc")
    setOpen(false);
  }


// ====== RETURN ()
  return (
    <Container>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>

         {content ? <Typography variant="h4" gutterBottom>
                    Datos 
                    </Typography> 
                  : <Typography variant="h4" gutterBottom> 
                    Primero subir un documento
                    </Typography>
          }

          {/* <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}> */}

          <Button 
            variant="contained" 
            component="label"
          > 
             Subir Archivo
              <input
                type="file"
                hidden
                onChange={(e) => LoadFile(e, setColumnLister, setContent)}
              />
          </Button>
          <Button 
            variant="contained" 
            // onClick={handleAddRowClickButton}
          > 
            Crear nueva fila
          </Button>
        </Stack>
  
      <Box sx={{ height: 400, width: '100%' }}>

      <DataGrid
        rows={rows}
        columns={_columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
      { content && 
              <Button variant="contained" color="primary" onClick={handleClickButton}>
               Generar Documento
              </Button> 
      }

      </Box>

      <Box id='viewer_docx'/>
      {/* <div id="container" style={{ height: "600px", overflowY: "auto" }} /> */}

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={handleSeeDoc}>
          {/* <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} /> */}
          Ver
        </MenuItem>

        <MenuItem onClick = {handleDownload}sx={{ color: 'success' }}>
          {/* <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} /> */}
          Descargar
        </MenuItem>
      </Popover>

      </Container>
  );
}
