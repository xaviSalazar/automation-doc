// component
// import SvgColor from '../../../components/svg-color';
import HomeIcon from '@mui/icons-material/Home';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import AutorenewIcon from '@mui/icons-material/Autorenew';

// ----------------------------------------------------------------------

const Icons = {
  home: <HomeIcon />,
  document: <NoteAddIcon />,
  autoTemplate: <AutorenewIcon/>
}
// const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const icon = (name) => Icons[`${name}`]

const navConfig = [
  {
    title: 'Home',
    path: '/automation-doc/home',
    icon: icon("home"),
  },
  {
    title: 'Agregar Documento',
    path: '/automation-doc/edit',
    icon: icon('document'),
  },
  {
    title: 'Templates Automatico',
    path: '/automation-doc/templates',
    icon: icon('autoTemplate'),
  },
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
