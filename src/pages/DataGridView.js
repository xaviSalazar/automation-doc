import * as React from 'react';
import { useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Button, IconButton, MenuItem, Popover, Container, Typography, Stack} from '@mui/material';
import * as docx from "docx-preview";
import ReplaceWords from './components/ReplaceWords';
import LoadFile from './components/LoadFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {saveAll, loadWorkspace} from '../redux/workspace/workspaceAction';
import MergeDocuments from './components/MergeDocuments';
// import { FlashOnRounded } from '@mui/icons-material';

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

    /** Initial column Values for first render */
    const InitColumns = [
      { field: 'id', headerName: 'ID', width: 50, renderCell: RenderButtonPick,},
      // { field: 'id', headerName: 'ID', width: 50},
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
    
  // holds values to be modified when I file is uploaded
  const [columnLister, setColumnLister] = React.useState()

  // set docx content 
  const [content, setContent] = React.useState(null);

  // popup menu boolean condition to open
  const [open, setOpen] = React.useState(false);
  // popup menu sets id row number
  const [singleElement, setSingleElement] = React.useState(null);

  const dispatch = useDispatch();

  // reducers load variables workspace
  const reducerVar = useSelector(state => state.workspace)
  
  // rows initialization
  const [rows, setRows] = 
                        React.useState(initRows)
                        // React.useState([])

  // holds ids of selected rows
  const [checkedRowData, SetCheckedRowData] = React.useState([])

  // blob that contains binary word file
  const [blob, setBlob] = 
                        React.useState();
  // columns initialization
  const [columns, setColumns] = 
                              React.useState(InitColumns)
                              //React.useState([])
  // call apiRef bypass method
  const { apiRef, _columns } = useApiRef(columns);

    /* UseEffect to process columns and rows from parsed document */
    React.useEffect(() => {

      console.log("useEffect -> columnLister")
      // check undefined when webapp starts
      if(typeof columnLister === "undefined")
        return
      const newColumns = columnsParser(columnLister)
      const newRows = rowsParser(columnLister)
      // sets columns and rows parsed from uploaded file
      setColumns(newColumns)
      setRows(newRows)

    }, [columnLister])

    React.useEffect(() => {
      console.log("useEffect for reducer load workspace")
      // console.log(reducerVar)
      if(typeof reducerVar === "undefined")
        return
      setColumns(reducerVar.columns)
      setRows(reducerVar.rows)
      setContent(reducerVar.content)
    }, [reducerVar])

      /* UseEffect for blob visualization content after word replacement*/
   React.useEffect(() => {
     if(typeof blob === "undefined")
       return 
     docx.renderAsync(blob, document.getElementById("viewer_docx"))
         .then((x) => console.log("docx: finished"))
   }, [blob])

   React.useEffect(() => {
      dispatch(loadWorkspace())
   }, [dispatch])

  function RenderButtonPick(props) {
    const { value } = props;
    // const buttonElement = React.useRef(null);
    // const rippleRef = React.useRef(null);
  
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
  function columnsParser(columnList) {

    if (typeof columnList === "undefined") return []
  
    const initColumns = [{ field: 'id', headerName: 'ID', width: 50, renderCell: RenderButtonPick, }]
    // const initColumns = [{ field: 'id', headerName: 'ID', width: 50 }]
   
    // creates array of objects with the keys found from uploaded document
    const colum = columnList.map( col => {
      return {field: col, headerName: col, width: 350, editable: true}
   } );
  
    return initColumns.concat(colum)
  }
  
  function rowsParser(columnList) {

    if (typeof columnList === "undefined") return []

    const headRows = { id: 1}
  
    // array dictionary creation with the keys needed to replace (rows)
    let dictionary = Object.assign({}, ...columnList.map((x) => ({[x]: null})));
    const rowss = Object.assign(headRows, dictionary)
    
    // const debug = Object.assign({id:2}, dictionary)
  
    // return [rowss, debug]
     return [rowss]
  }
  
  const handleAddRowClickButton = () => {

    const obj_it = apiRef.current.getRowModels()
    // array of rows 
    const valuesArray = Array.from(obj_it.values())

    valuesArray.push(JSON.parse(JSON.stringify(valuesArray.slice(-1)[0])))

    // gets last value from array
    const lastItem = valuesArray.slice(-1)
    lastItem.forEach(item => {
                              for (const [key, value] of Object.entries(item))
                              {
                                if (key === "id")
                                  item[key] = value + 1
                                else 
                                  item[key] = null
                              }
                            })

    // console.log(valuesArray)
    setRows(valuesArray)

  }

  // Method to save all current changes made with the project.
  window.onbeforeunload = function() {
    console.log('fire window close ')
    dispatch(saveAll({column: columns, row: rows, contenu: content}));
  }

  const handleOpenMenu = (event, value) => {
    // console.log(value)
    setSingleElement(value)
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(false);
  };

  const handleSeeDoc = () => {
    const obj = apiRef.current.getRowModels();
    ReplaceWords(content, obj.get(singleElement), `id_${singleElement}`, setBlob, false);
    setOpen(false);
  }

  const handleDownload = () => {
    const obj = apiRef.current.getRowModels();
    ReplaceWords(content, obj.get(singleElement), `id_${singleElement}`, setBlob, true);
    setOpen(false);
  }

  const handleCheckBox = (ids) => {
    const selectedIDs = new Set(ids);

    // call apiRef
    const obj_it = apiRef.current.getRowModels()
    // array of rows 
    const valuesArray = Array.from(obj_it.values())
    // filter only selected ids
    const selectedRowData = valuesArray.filter((row) => 
    selectedIDs.has(row.id));
    console.log(selectedRowData)
    SetCheckedRowData(selectedRowData)
  }

  const handleGenerateDoc = () => {
    // console.log(checkedRowData)
    MergeDocuments(content, checkedRowData);
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

          { (checkedRowData.length !== 0 ) &&
                  <Button 
                  variant="contained" 
                  component="label"
                  onClick = {handleGenerateDoc}
                  > 
                  Generar DOC
                  </Button>
          }

          <Button 
            variant="contained" 
            component="label"
          > 
             Subir Archivo
              <input
                type="file"
                accept = ".doc, .docx"
                hidden
                onChange={(e) => LoadFile(e, setColumnLister, setContent)}
              />
          </Button>
      
        { content &&
          <Button 
            variant="contained" 
            onClick={handleAddRowClickButton}
          > 
            Crear nueva fila
          </Button>
        }
          
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
          onRowSelectionModelChange = { (ids) => handleCheckBox(ids) }
        />

      </Box>

      {/** ASYNC VIEWER FOR BLOB DOCX */}
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
