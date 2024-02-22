import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import ChatLayout from './libs/ChatLayout'
import { useDispatch, useSelector } from 'react-redux';
import { httpManager } from '../managers/httpManagers';
import { v4 as uuidv4 } from 'uuid';
import { MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import AddCircleSharpIcon from '@mui/icons-material/AddCircleSharp';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';


import { selectChatId } from '../redux/conversationStore/conversationAction';

const options = [
  'gpt-3.5-turbo-0125',
  'gpt-4-0125-preview',
  'gpt-4-vision-preview',
];

const PROMPTS = [
  { key: 'documentos', text: 'Eres un experto redactor de documentos de todo tipo. Y los escribes con las siguientes condiciones. Mandatorio responder con un documento en formateado asi  ```<!DOCTYPE html> pon el contenido aqui </html>```, todos los campos que sean a llenar que esten dentro de llaves en camel case. Por ejemplo: \{detalleDelMotivo\}'},
  { key: 'no prompt', text: '' },
  { key: 'excel ESP', text: 'Eres un experto asistente de Excel en espanol para generar formulas y dar pasos en conseguir el objetivo de la pregunta. Y escribes bajo las siguientes condiciones, si se te pregunta formulas exactas envia la explicacion mas corta y sencilla con la formula dentro de ``` '},
  { key: 'excel ENG', text: 'Eres un experto asistente de Excel en ingles para generar formulas y dar pasos en conseguir el objetivo de la pregunta. Y escribes bajo las siguientes condiciones, si se te pregunta formulas exactas envia la explicacion mas corta y sencilla con la formula dentro de ``` '}
];

const drawerWidth = 190;

function AiGenerator(props) {

  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const { userCard } = useSelector(state => state.login)
  const [chatList, setChatList] = React.useState([])
  const [isFirstChat, setIsFirstChat] = React.useState(false);
  const dispatch = useDispatch();

  const [anchorMenuModel, setAnchorMenuModel] = React.useState(null);
    // New state for the PROMPTS menu
  const [anchorPromptsMenu, setAnchorPromptsMenu] = React.useState(null);
  const [selectedIndexModel, setSelectedIndexModel] = React.useState(0);
  const [selectedPrompt, setSelectedPrompt] = React.useState('no prompt');

  const open = Boolean(anchorMenuModel);
  const openPromptsMenu = Boolean(anchorPromptsMenu);

    // Function to handle clicking the new menu button
    const handlePromptsMenuClick = (event) => {
      setAnchorPromptsMenu(event.currentTarget);
    };
  
    // Function to handle closing the new menu
    const handleClosePromptsMenu = () => {
      setAnchorPromptsMenu(null);
    };

  const handleClickListItem = (event) => {
    setAnchorMenuModel(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndexModel(index);
    setAnchorMenuModel(null);
  };

  const handleMenuPromptClick = (event, key) => {
    setSelectedPrompt(key)
    setAnchorPromptsMenu(null);
  }

  const handleCloseMenuModel = () => {
    setAnchorMenuModel(null);
  };

  const [selectedIndex, setSelectedIndex] = React.useState(null);

  const { selectedChatId } = useSelector(state => state.conversationHistory)

  const handleListItemClick = (event, index) => {
    // console.log(index)
    dispatch(selectChatId(index))
    setIsFirstChat(false)
    setSelectedPrompt('no prompt')
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

  const createNewConversation = () => {
    const generatedUuid = uuidv4();
    dispatch(selectChatId(generatedUuid))
    setIsFirstChat(true)
    console.log(generatedUuid)
  }

  async function fetchChatList(setChatList) {
    let response = await httpManager.getChatList(userCard['id'])
    setChatList(response.data)
  }

  React.useEffect(() => {
    dispatch(selectChatId(''))
    setIsFirstChat(false)
    setSelectedPrompt('no prompt')
    fetchChatList(setChatList)
  }, []);


  const [menuState, setMenuState] = React.useState({ anchorEl: null, selectedId: null });

  const handleClickPopOver = (event, id) => {
    setMenuState({ anchorEl: event.currentTarget, selectedId: id });
  };

  const handleClose = async (event, id) => {
    // Aquí puedes manejar la lógica para acciones como eliminar o archivar basado en el `id`
    setMenuState({ anchorEl: null, selectedId: null });
  };

  const handleCloseAndDelete = async (event, id) => {
    // Aquí puedes manejar la lógica para acciones como eliminar o archivar basado en el `id`
    // console.log("Action on item with id:", id);
    setMenuState({ anchorEl: null, selectedId: null });
    await httpManager.deleteOneConversation({ conversationId: id, senderId: userCard['id'] })
  };

  // HERE LOAD CHAT SUBJECTS FOR THIS USER:


  const drawer = (
    <Box>
      {/* <Toolbar /> */}
      <ListItem
        secondaryAction={
          <IconButton edge="end" aria-label="delete" onClick={createNewConversation}>
            <AddCircleSharpIcon />
          </IconButton>
        }
      >
        <ListItemAvatar>
          <Avatar>
            <AssignmentIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary="Nueva conversation"
          secondary={'Habla con chatgpt ahora'}
        />
      </ListItem>
      <Divider />
      <List component="nav" aria-label="main mailbox folders">
        {chatList.map((doc) => (

          <Box key={doc.id}>

            <ListItemButton
              key={doc.id}
              selected={selectedIndex === doc.id}
              onClick={(event) => handleListItemClick(event, doc.id)}
            >
              <ListItemText primary={doc.title} />

              <IconButton onClick={(e) => handleClickPopOver(e, doc.id)}>
                <MoreVertIcon />
              </IconButton>

              <Menu
                id={`menu-${doc.id}`}
                anchorEl={menuState.anchorEl}
                open={menuState.anchorEl != null && menuState.selectedId === doc.id}
                onClose={(e) => handleClose(e, doc.id)}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem
                  onClick={(e) => handleCloseAndDelete(e, doc.id)}
                >
                  <DeleteForeverIcon fontSize="small" />
                  <Typography variant="inherit">Eliminar</Typography>
                </MenuItem>
                {/* <MenuItem onClick={(e) => handleClose(e, doc.id)}>Archive</MenuItem> */}
              </Menu>
            </ListItemButton>

          </Box>

        ))}
      </List>
    </Box>
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
          position: "relative",
          bgcolor: "rgba(35, 35, 35, 0.85)", // A darker shade for the AppBar          // height: "10%"
        }}>

        <Toolbar
          sx={{
            display: 'flex', // Set display to flex
            justifyContent: 'flex-start', // Space out items
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <List
            component="nav"
            aria-label="Device settings"
            sx={{ display: 'flex', bgcolor: 'rgba(55, 55, 55, 50)' }}
          >
            <ListItemButton
              id="lock-button"
              aria-haspopup="listbox"
              aria-controls="lock-menu"
              aria-label="ELIGE MODELO"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClickListItem}
              sx={{
                display: 'flex', // Make this a flex container
                justifyContent: 'flex-end', // Space between items
                width: '100%', // Ensure it spans the full width
              }}
            >
              
                <ListItemText
                  primary="MODELO ACTUAL: "
                  secondary={options[selectedIndexModel]}
                  sx={{
                    '& .MuiListItemText-primary': { // Target the primary text
                      fontWeight: 'bold', // Make the text bold
                    },
                    '& .MuiListItemText-secondary': { // Target the secondary text
                      display: 'flex',
                      color: 'white', // Set the color to white
                      // bgcolor: 'grey',
                      justifyContent: 'flex-end',
                    }
                  }}
                />

              <ListItemIcon sx={{display: 'flex', justifyContent: 'flex-end', color:'white'}}>
                  <TuneOutlinedIcon />
              </ListItemIcon>

            </ListItemButton>
          </List>

          <Menu
            id="lock-menu"
            anchorEl={anchorMenuModel}
            open={open}
            onClose={handleCloseMenuModel}
            MenuListProps={{
              'aria-labelledby': 'lock-button',
              role: 'listbox',
            }}
          >
            {options.map((option, index) => (
              <MenuItem
                key={option}
                selected={index === selectedIndexModel}
                onClick={(event) => handleMenuItemClick(event, index)}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>


         {/* New PROMPTS Menu */}
         <List
          component="nav"
          aria-label="Document settings"
          sx={{ display: 'flex', bgcolor: 'rgba(55, 55, 55, 50)' }}
        >
          <ListItemButton
            id="prompts-button"
            aria-haspopup="listbox"
            aria-controls="prompts-menu"
            aria-label="ELIGE PROMPT"
            aria-expanded={openPromptsMenu ? 'true' : undefined}
            onClick={handlePromptsMenuClick}
            sx={{
              display: 'flex', // Make this a flex container
              justifyContent: 'flex-end', // Space between items
              width: '100%', // Ensure it spans the full width
            }}
          >
            <ListItemText
              primary="PROMPT ACTUAL: "
              secondary={selectedPrompt}
              sx={{
                '& .MuiListItemText-primary': { // Target the primary text
                  fontWeight: 'bold', // Make the text bold
                },
                '& .MuiListItemText-secondary': { // Target the secondary text
                  display: 'flex',
                  color: 'white', // Set the color to white
                  // bgcolor: 'grey',
                  justifyContent: 'flex-end',
                }
              }}
            />

            <ListItemIcon sx={{display: 'flex', justifyContent: 'flex-end', color:'white'}}>
                  <TuneOutlinedIcon />
            </ListItemIcon>

          </ListItemButton>
        </List>

        <Menu
          id="prompts-menu"
          anchorEl={anchorPromptsMenu}
          open={openPromptsMenu}
          onClose={handleClosePromptsMenu}
          MenuListProps={{
            'aria-labelledby': 'prompts-button',
            role: 'listbox',
          }}
        >
          {PROMPTS.map((prompt, index) => (
            <MenuItem
              key={prompt.key}
              onClick={(event) => handleMenuPromptClick(event, prompt.key)}
            >
              {prompt.key}
            </MenuItem>
          ))}
        </Menu>


        </Toolbar>
      </AppBar>

      <Box
        sx={{
          display: 'flex',
          height: '100vh', // Set the height to be 100% of the viewport height
          flexDirection: 'row', // Set flexDirection to 'row'
          alignItems: 'stretch',
          overflowY: 'hidden',
        }}
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

        <Box
          component="main"
          sx={{
            display: 'flex',
            flexGrow: 1,
            p: 2,
            flexDirection: 'column', // Children will be laid out in a column
            height: '80%',
            overflow: 'hidden',
            bgcolor: '#f1f1f1'
          }}
        >
          {selectedChatId && <ChatLayout 
                              modelo={options[selectedIndexModel]} 
                              isFirstChat={isFirstChat} 
                              setIsFirstChat={setIsFirstChat}
                              systemPrompt={PROMPTS.find(prompt => prompt.key === selectedPrompt)?.text || ''}
                            />}
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