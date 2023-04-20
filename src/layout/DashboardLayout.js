
import React from 'react';
// import { useState } from 'react';
import DataGridView from '../pages/DataGridView';
// @mui
import { styled } from '@mui/material/styles';
//
// import Header from './header';
// import Nav from './nav';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
//   const [open, setOpen] = useState(false);
// const [columnLister, setColumnLister] = React.useState()
// const [content, setContent] = React.useState(null);

  return (
    <StyledRoot>
      {/* <Header onOpenNav={() => setOpen(true)} />
      <Nav openNav={open} onCloseNav={() => setOpen(false)} /> */}
      <Main>
        {/* <LoadFile setColumnLister={setColumnLister} setContent={setContent} /> */}
         <DataGridView />
        {/* <Outlet /> */}
      </Main>
    </StyledRoot>
  );
}
