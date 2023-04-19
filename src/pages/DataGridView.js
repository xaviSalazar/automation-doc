import * as React from 'react';
import { useRef, useMemo } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, gridColumnGroupsLookupSelector } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import Example from './Example';
import * as docx from "docx-preview";

/*========================================================================*/
/** Initial column Values for first render */
const columns = [
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

/*========================================================================*/
/**Function to by pass usage of ApiRef */
function useApiRef() {

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

  return { apiRef, columns: _columns };
}
//

export default function DataGridView() {

  const [blob, setBlob] = 
                        React.useState();

                        
  const { apiRef, columns } = useApiRef();

  const [rows, setRows] = 
                        React.useState(
                             [{ id: 1, fullName: null, email: null, date: null, time: null, providencia: null, dictamen: null }]
                             )

  React.useEffect(() => {

    }, [rows])

  React.useEffect(() => {
    docx.
        renderAsync(blob, document.getElementById("container"))
        .then((x) => console.log("docx: finished"))
  }, [blob])

  const handleClickButton = () => {
    const obj = apiRef.current.getRowModels();
    console.log(apiRef.current.getRowModels());
    console.log(obj.get(1))
    Example(obj.get(1), setBlob);
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
        columns={columns}
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

      <Button variant="contained" color="primary" onClick={handleAddRowClickButton}>
        Agregar una fila
      </Button>

      <div id="container" style={{ height: "600px", overflowY: "auto" }} />
    </Box>
  );
}
