import * as React from 'react';
import { useRef, useMemo } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import Example from './Example';
import * as docx from "docx-preview";
import ReplaceWords from './ReplaceWords';
/*========================================================================*/
/** Initial column Values for first render */
const InitColumns = [
  { field: 'id', headerName: 'ID', width: 50 },
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

function columnsParser(columnList) {

  const initColumns = [{ field: 'id', headerName: 'ID', width: 50 }]
 
  // creates array of objects with the keys found from uploaded document
  const colum = columnList.map( col => {
    return {field: col, headerName: col, width: 350, editable: true}
 } );

  return initColumns.concat(colum)
}

function rowsParser(columnList) {

  const initRows = { id: 1}

  // array dictionary creation with the keys needed to replace (rows)
  let dictionary = Object.assign({}, ...columnList.map((x) => ({[x]: null})));
  const rowss = Object.assign(initRows, dictionary)

  return [rowss]
}

/*========================================================================*/
/**Function to by pass usage of ApiRef */
function useApiRef(columns) {

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
  console.log(_columns)

  return { apiRef, columns: _columns };
}
/*========================================================================*/

export default function DataGridView({columnLister, content}) {

  // blob that contains binary word file
  const [blob, setBlob] = 
                        React.useState();
  // columns initialization
  const [columns, setColumns] = 
                              React.useState(InitColumns)
  // call apiRef bypass method
  const { apiRef } = useApiRef(columns);
  // rows initialization
  const [rows, setRows] = 
                        React.useState(
                             [{ id: 1, fullName: null, email: null, date: null, time: null, providencia: null, dictamen: null }]
                             )

  /* UseEffect to process columns and rows from parsed document */
  React.useEffect(() => {
    // check undefined when webapp starts
    if(typeof columnLister === 'undefined')
      return

    const newColumns = columnsParser(columnLister)
    const newRows = rowsParser(columnLister)
    // sets columns and rows parsed from uploaded file
    setColumns(newColumns)
    setRows(newRows)
  }, [columnLister])

    /* UseEffect for blob visualization content after word replacement*/
    React.useEffect(() => {
      docx.
          renderAsync(blob, document.getElementById("container"))
          .then((x) => console.log("docx: finished"))
    }, [blob])

/* useMemo to update the content of the cells */
const _columns = useMemo(() => columns.concat({ 
                                                field: "__HIDDEN__",
                                                width: 0,
                                                renderCell: (params) => {                         
                                                  apiRef.current = params.api;
                                                  return null;
                                                }
                                              }),
                                              [columns]);
  
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

  return (
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

        <Button variant="contained" color="primary" onClick={handleClickButton}>
        Generar Documento
        </Button>

      {/* <Button variant="contained" color="primary" onClick={handleAddRowClickButton}>
        Agregar una fila
      </Button> */}

      <div id="container" style={{ height: "600px", overflowY: "auto" }} />
    </Box>
  );
}