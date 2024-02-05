import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ChatLayout from './libs/ChatLayout'
import CreateIcon from '@mui/icons-material/Create';
import { calculateNewValue } from '@testing-library/user-event/dist/utils';


const drawerWidth = 190;

function AiGenerator(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const [selectedIndex, setSelectedIndex] = React.useState(null);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  // HERE LOAD CHAT SUBJECTS FOR THIS USER:

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding
            selected={selectedIndex === index}
            onClick={(event) => handleListItemClick(event, index)}>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      {/* <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => {
          const adjustedIndex = index + 4; // Adjust index for the second list
          return (
            <ListItem key={text} disablePadding
              selected={selectedIndex === adjustedIndex}
              onClick={(event) => handleListItemClick(event, adjustedIndex)}>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List> */}
    </div>
  );

  // Remove this const when copying and pasting into your project.
  const container = window !== undefined ? () => window().document.body : undefined;

  return (    
    <Box
    sx={{
    display: 'flex',
    flexDirection: 'column',
    height: '100%', // This should fill the height of Main now
    flexGrow: 1, // This will make the Box grow to fill the container
    alignItems: 'stretch', // This ensures the children stretch to fill
    }}
  >
        <AppBar
        sx={{
          position: "relative"
         }}>
         <Toolbar >
          <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
           <Typography variant="h6" noWrap component="div">
             NEW CHAT
          </Typography>
          <IconButton
              color="inherit"
              aria-label="start chat"
              edge="end"
              sx={{ mr: 2, display: { sm: 'flex' } }}
             //  onClick={handleDrawerToggle}
              // sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <CreateIcon />
            </IconButton>
         </Toolbar>
       </AppBar>

      <Box
        sx={{
          display: 'flex',
          height: '100vh', // Set the height to be 100% of the viewport height
          flexDirection: 'row', // Set flexDirection to 'row'
          alignItems: 'stretch', 
        }}
      >

       <Box
         component="nav"
         backgroundColor = 'white'
         sx={{ flexGrow: 1, height: '80%', width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
         aria-label="mailbox folders"
       >

         {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
         <Drawer
           container={container}
           variant="temporary"
           open={mobileOpen}
           onTransitionEnd={handleDrawerTransitionEnd}
           onClose={handleDrawerClose}
           ModalProps={{
             keepMounted: true, // Better open performance on mobile.
           }}
           sx={{
            ml: { sm: `${drawerWidth}px` },
             display: { xs: 'block', sm: 'none' },
             '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
           }}
         >
           {drawer}
         </Drawer>

         <Drawer
           variant="permanent"
           sx={{
            display: { xs: 'none', sm: 'block' },
             '& .MuiDrawer-paper': { position: 'relative' },
           }}
           open
         >
           {drawer}
         </Drawer>

        </Box>

        <Box
          component="main"     
          sx={{ 
                  display: 'flex',
                  flexGrow: 1, 
                  p: 2, 
                  flexDirection: 'column', // Children will be laid out in a column
                  height: '80%',
                  overflow: 'hidden'
              }}
        >
          <ChatLayout />
        </Box>

        
      </Box>
    </Box>
  );
}

AiGenerator.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default AiGenerator;