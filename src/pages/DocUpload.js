import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
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
} from '@mui/material';
// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
// import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
import { useDispatch, useSelector } from 'react-redux';
import { saveFiles, loadFiles } from '../redux/filesStore/filesAction';
import { UserListHead } from '../sections/@dashboard/user';
import { useNavigate} from 'react-router-dom';

// mock
// import USERLIST from '../_mock/user';

const MAX_COUNT = 5;


const TABLE_HEAD = [
    { id: 'name', label: 'Archivo', alignRight: false },
    { id: 'timestamp', label: 'Fecha de Creacion', alignRight: false },
    { id: 'size', label: 'Talla Archivo', alignRight: false },
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
  
    const [orderBy, setOrderBy] = useState('name');
  
    const [filterName, setFilterName] = useState('');
  
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [fileLimit, setFileLimit] = useState(false);

    const [uploadedFiles, setUploadedFiles] = useState([])

    const reducerFiles = useSelector(state => state.filesSaved)

    const dispatch = useDispatch();

    const navigate = useNavigate();

    useEffect(() => {

      dispatch(loadFiles())

    }, [dispatch])

    useEffect(() => {
      
      if(reducerFiles.filesArray === null)
        return

        // console.log(reducerFiles.filesArray)
  
        setUploadedFiles(reducerFiles.filesArray)
    }, [reducerFiles])

    const handleUploadFiles = async files => {

      const uploaded = [...uploadedFiles];
      let limitExceeded = false;
      files.some((file) => {
          if (uploaded.findIndex((f) => f.name === file.name) === -1) {
             
              // uploaded.push(file);
              if (uploaded.length === MAX_COUNT) setFileLimit(true);
              if (uploaded.length > MAX_COUNT) {
                  alert(`You can only add a maximum of ${MAX_COUNT} files`);
                  setFileLimit(false);
                  limitExceeded = true;
                  return true;
              }
          }

      })

       // Convert the FileList into an array and iterate
       let filesAsync = Array.from(files).map(file => {    
        // Define a new file reader
        let reader = new FileReader();
        // Create a new promise
        return new Promise(resolve => {
            
            // Resolve the promise after reading file
            reader.onload = () => resolve({
                                            name: file.name, 
                                            content: reader.result,
                                            timestamp: file.lastModified,
                                            size: file.size
                                          });
            
            // Reade the file as a text
            reader.readAsBinaryString(file);
         });
      });

      let res = await Promise.all(filesAsync)

      res.some((file) => {
      uploaded.push(file)
      })

      if (!limitExceeded) 
      {
        setUploadedFiles(uploaded)
        dispatch(saveFiles(uploaded));
      }

  }

    const handleFileEvent =  (e) => {
        const chosenFiles = Array.prototype.slice.call(e.target.files)
        handleUploadFiles(chosenFiles);
    }

  
    const handleOpenMenu = (event, name) => {
      console.log(name)
      setOpen(event.currentTarget);
    };

    const handleOpenIcon = (event, name) => {
      console.log(name)
      console.log(`/templates/${name}`)

      // redirect("/login");

      

      navigate({pathname: `/automation-doc/templates/${name}`})
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
        const newSelecteds = uploadedFiles.map((n) => n.name);
        setSelected(newSelecteds);
        return;
      }
      setSelected([]);
    };
  
    const handleClick = (event, name) => {
      const selectedIndex = selected.indexOf(name);
      let newSelected = [];
      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, name);
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
      setPage(0);
      setRowsPerPage(parseInt(event.target.value, 10));
    };
  
    // const handleFilterByName = (event) => {
    //   setPage(0);
    //   setFilterName(event.target.value);
    // };
  
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - uploadedFiles.length) : 0;
  
    const filteredUsers = applySortFilter(uploadedFiles, getComparator(order, orderBy), filterName);
  
    const isNotFound = !filteredUsers.length && !!filterName;
  
    return (
      <>
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
                            accept = ".doc, .docx"
                            hidden
                            onChange={(e) => handleFileEvent(e)}
                            disabled={fileLimit}
                 />
            </Button>
          </Stack>
  
          <Card>
            {/* <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}
  
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={uploadedFiles.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    //   const { id, name, role, status, company, avatarUrl, isVerified } = row;
                    const { name, timestamp, size } = row;
                    
                    const selectedUser = selected.indexOf(name) !== -1;
  
                      return (
                        <TableRow hover key={name} tabIndex={-1} role="checkbox" selected={selectedUser}>
                          <TableCell padding="checkbox">
                            <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                          </TableCell>
  
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <IconButton onClick={(e) => handleOpenIcon(e,name)}> <TextSnippetIcon /></IconButton>
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>
  
                          <TableCell align="left">{timestamp}</TableCell>
  
                          <TableCell align="left">{size}</TableCell>
  
                          {/* <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell> */}
  
                          {/* <TableCell align="left">
                            <Label color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</Label>
                          </TableCell> */}
  
                          <TableCell align="right">
                            <IconButton size="large" color="inherit" onClick={(e) => handleOpenMenu(e,name)}>
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
              </TableContainer>
            </Scrollbar>
  
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={uploadedFiles.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Container>
  
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
          <MenuItem>
            <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
            Edit
          </MenuItem>
  
          <MenuItem sx={{ color: 'error.main' }}>
            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
            Delete
          </MenuItem>
        </Popover>
      </>
    );
  }

