// component
// import SvgColor from '../../../components/svg-color';
import HomeIcon from '@mui/icons-material/Home';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import TextsmsIcon from '@mui/icons-material/Textsms';

// ----------------------------------------------------------------------

const Icons = {
  home: <HomeIcon />,
  document: <NoteAddIcon />,
  autoTemplate: <AutorenewIcon/>,
  generateAi: <DesignServicesIcon/>,
  chatwithDoc: <TextsmsIcon/>,
}
// const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const icon = (name) => Icons[`${name}`]

const navConfig = [
  {
    title: 'Home',
    path: '/home',
    icon: icon("home"),
  },
  {
    title: 'Agregar Documento',
    path: '/edit',
    icon: icon('document'),
  },
  {
    title: 'Templates Automatico',
    path: '/templates',
    icon: icon('autoTemplate'),
  },
  {
    title: 'Chatbot AI',
    path: '/generate',
    icon: icon('generateAi'),
  },
  {
    title: 'Documento Chat',
    path: '/chatpdf',
    icon: icon('chatwithDoc')
  },
  // {
  //   title: 'IMAGES',
  //   path: '/image-gen',
  //   icon: icon('chatwithDoc')
  // }
  // {
  //   title: 'product',
  //   path: '/dashboard/products',
  //   icon: icon('ic_cart'),
  // },
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: icon('ic_blog'),
  // },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: icon('ic_lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;
