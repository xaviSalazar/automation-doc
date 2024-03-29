import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import QuickreplyTwoToneIcon from '@mui/icons-material/QuickreplyTwoTone';
import { setActiveDocument } from '../redux/chatpdfStore/chatpdfAction'

import { loadDocs, appendloadDocs, editThisDoc, delDoc, uploadMultipleDocs} from '../redux/documentStore/documentAction';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  CircularProgress 
} from '@mui/material';
// components
import Iconify from '../components/iconify';
// import Scrollbar from '../components/scrollbar';
// sections
// import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
import { useDispatch, useSelector } from 'react-redux';
import { UserListHead } from '../sections/@dashboard/user';
import { useNavigate} from 'react-router-dom';

// mock
// import USERLIST from '../_mock/user';

const TABLE_HEAD = [
    { id: 'title', label: 'Archivo', alignRight: false },
    { id: 'created_at', label: 'Fecha de Creacion', alignRight: false },
    { id: 'file_size', label: 'Talla Archivo kbyte', alignRight: true },
    // { id: 'isVerified', label: 'Verified', alignRight: false },
    // { id: 'status', label: 'Status', alignRight: false },
    { id: '' },
  ];
  
  // ----------------------------------------------------------------------
  
  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  const timestampToDate = ( created_at ) => {
    const dateObject = new Date(created_at);
    const options = { year: 'numeric', month: 'long', 
                      day: 'numeric', hour: 'numeric',
                      minute: 'numeric',};
    return dateObject.toLocaleDateString('en-US', options);
  };
  
  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }
  
  function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    if (query) {
      return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
  }
  
export default function UserPage() {
    const [open, setOpen] = useState(null);
  
    const [page, setPage] = useState(0);
  
    const [order, setOrder] = useState('asc');
  
    const [selected, setSelected] = useState([]);
  
    const [orderBy, setOrderBy] = useState('title');
  
    const [filterName, setFilterName] = useState('');
  
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [fileLimit, setFileLimit] = useState(false);

    // const [uploadedFiles, setUploadedFiles] = useState([])

    const [docIdPop, setDocIdPop] = useState(null);

    const {userCard} = useSelector(state => state.login)

    const {totalDocs, docsArray, isLoading, cachePage} = useSelector(state => state.documentState)
    console.log(cachePage)

    const dispatch = useDispatch();

    const navigate = useNavigate();

    useEffect(() => {
      console.log('useffect load first time')
        // if(cachePage.includes(page)) {console.log('inside useffect cache page'); return};
        dispatch(loadDocs(page, rowsPerPage, userCard['id']))
    }, [dispatch]);

    useEffect(() => {
      if(page > 0) 
      {
        console.log('useEffect appendLoadDocs')
        dispatch(appendloadDocs(page, rowsPerPage, userCard['id']))
      }
    }, [page, dispatch]);

    const handleUploadFiles = async files => {
      const formData = new FormData(); // Create a new FormData object
      formData.append('user_id', userCard['id']);
        // Append each selected file to the FormData object
        files.forEach((file) => {
          // You can also append additional data to the FormData object if needed
          formData.append('files', file); // 'files' should match the field name expected by the server
        });
        setPage(0);
        dispatch(uploadMultipleDocs(formData, rowsPerPage, userCard['id']));
  }

     const handleFileEvent =  async (e) => {
      const chosenFiles = Array.from(e.target.files);
      await handleUploadFiles(chosenFiles);
    }

  
    const handleOpenMenu = (event, name, id) => {
      setDocIdPop(id)
      setOpen(event.currentTarget);
    };

    const handleOpenIcon = async ( row ) => {
      console.log(row)
      dispatch(setActiveDocument(row))
      navigate({pathname: `/chatpdf`})
    };
  
    const handleCloseMenu = () => {
      setOpen(null);
    };
  
    const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };
  
    const handleSelectAllClick = (event) => {
      if (event.target.checked) {
        const newSelecteds = docsArray.map((n) => n.attachment_id);
        console.log(newSelecteds)
        setSelected(newSelecteds);
        return;
      }
      setSelected([]);
    };
  
    const handleClick = (event, id) => {
      const selectedIndex = selected.indexOf(id);
      let newSelected = [];
      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
      }
      setSelected(newSelected);
    };
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(event.target.value)
      setPage(0);
      dispatch(loadDocs(0, event.target.value, userCard['id']))
    };

    const onClickEliminar = () => {
      setOpen(null);
      dispatch(delDoc({docId: docIdPop}));
    }

    const onClickEditar = () => {
      setOpen(null)
      console.log(docIdPop)
      dispatch(editThisDoc(docIdPop))
      navigate("/templates")
    }

    // const handleFilterByName = (event) => {
    //   setPage(0);
    //   setFilterName(event.target.value);
    // };
  
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - docsArray.length) : 0;
  
    const filteredUsers = applySortFilter(docsArray, getComparator(order, orderBy), filterName);
  
    const isNotFound = !filteredUsers.length && !!filterName;
  
    return (
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>

            <Typography variant="h4" gutterBottom>
              Documentos
            </Typography>

            <Button variant="contained" component="label" startIcon={<Iconify icon="eva:plus-fill" />}>
              Agregar Documento
                <input
                            id     = "fileUpload"
                            type   = "file"
                            multiple
                            accept = ".doc, .docx, .pdf, .csv, .xlsx, .xls"
                            hidden
                            onChange={(e) => handleFileEvent(e)}
                            disabled={fileLimit}
                 />
            </Button>
          </Stack>
  
          <Card>
            {/* <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}
           
              <TableContainer sx={{height: 500, minWidth: 800 }}>
                {
                  isLoading ? <CircularProgress /> : (
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={docsArray.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {docsArray.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    //   const { id, name, role, status, company, avatarUrl, isVerified } = row;
                    const { attachment_id, file_name, created_at, file_size } = row;
                    
                    const selectedUser = selected.indexOf(attachment_id) !== -1;
  
                      return (
                        <TableRow hover key={attachment_id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                          <TableCell padding="checkbox">
                            <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, attachment_id)} />
                          </TableCell>
  
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <IconButton onClick={(e) => handleOpenIcon(row)}> <QuickreplyTwoToneIcon /></IconButton>
                              <Typography variant="subtitle2" noWrap>
                                {file_name}
                              </Typography>
                            </Stack>
                          </TableCell>
  
                          <TableCell align="left">{timestampToDate(created_at)}</TableCell>
  
                          <TableCell align="right">{file_size}</TableCell>
  
                          {/* <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell> */}
  
                          {/* <TableCell align="left">
                            <Label color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</Label>
                          </TableCell> */}
  
                          <TableCell align="right">
                            <IconButton size="large" color="inherit" onClick={(e) => handleOpenMenu(e, file_name, attachment_id)}>
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
  
                  {isNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <Paper
                            sx={{
                              textAlign: 'center',
                            }}
                          >
                            <Typography variant="h6" paragraph>
                              Not found
                            </Typography>
  
                            <Typography variant="body2">
                              No results found for &nbsp;
                              <strong>&quot;{filterName}&quot;</strong>.
                              <br /> Try checking for typos or using complete words.
                            </Typography>
                          </Paper>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
                )
              }
              </TableContainer>
            
  
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={parseInt(totalDocs, 10)}   // variable that makes the pages counting.
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        
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
          <MenuItem onClick={onClickEditar} >
            <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
            Editar
          </MenuItem>
  
          <MenuItem onClick={onClickEliminar} sx={{ color: 'error.main' }}>
            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
            Eliminar
          </MenuItem>
        </Popover>
        </Container>
    );
  }

