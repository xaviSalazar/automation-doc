import * as React from 'react';
import { useRef, useMemo } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import Example from './Example';
import * as docx from "docx-preview";

/*========================================================================*/
/** Initial column Values for first render */
const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
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
  // {
  //   field: 'firstName',
  //   headerName: 'Nombres',
  //   width: 150,
  //   editable: true,
  // },
  // {
  //   field: 'lastName',
  //   headerName: 'Apellidos',
  //   width: 150,
  //   editable: true,
  // },
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

/** Initial row Values for first render */
const rows = [
  { id: 1, fullName: null, email: null, date: null, time: null, providencia: null, dictamen: null },

  // { id: 1, lastName: null, firstName: null, fullName: null, email: null, date: null, time: null, providencia: null, dictamen: null },
  // { id: 3, lastName: 'Lannister', firstName: 'Jaime', email: 'example3@gmail.com' },
  // { id: 4, lastName: 'Stark', firstName: 'Arya', email: 'example4@gmail.com' },
  // { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', email: null },
  // { id: 6, lastName: 'Melisandre', firstName: null, email: null },
  // { id: 7, lastName: 'Clifford', firstName: 'Ferrara', email: null },
  // { id: 8, lastName: 'Frances', firstName: 'Rossini', email: null },
  // { id: 9, lastName: 'Roxie', firstName: 'Harvey', email: null },
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

  const [blob, setBlob] = React.useState();
  const { apiRef, columns } = useApiRef();

  React.useEffect(() => {

    console.log('useEffect for blob')

    docx.renderAsync(blob, document.getElementById("container"))
          .then((x) => console.log("docx: finished"))

  }, [blob])

  const handleClickButton = () => {
    const obj = apiRef.current.getRowModels();
    console.log(apiRef.current.getRowModels());
    
    console.log(obj.get(1))

    Example(obj.get(1), setBlob);
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
        Show me grid data
      </Button>
      <div id="container" style={{ height: "600px", overflowY: "auto" }} />
    </Box>
  );
}
