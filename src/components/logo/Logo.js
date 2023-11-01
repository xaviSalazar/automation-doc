import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Link } from '@mui/material';

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const theme = useTheme();

  // const PRIMARY_LIGHT = theme.palette.primary.light;

  // const PRIMARY_MAIN = theme.palette.primary.main;

  // const PRIMARY_DARK = theme.palette.primary.dark;


  // OR using local (public folder)
  // -------------------------------------------------------
  const logo = (
    <Box
      component="img"
      src="https://d1d5i0xjsb5dtw.cloudfront.net/SaasIcon.png"
      sx={{ width: 220, height: 150, cursor: 'pointer', ...sx }}
    />
  );

  // const logo = (
  //   <Box
  //     ref={ref}
  //     component="div"
  //     sx={{
  //       width: 40,
  //       height: 40,
  //       display: 'inline-flex',
  //       ...sx,
  //     }}
  //     {...other}
  //   >
  //      <img
  //       src="https://d1d5i0xjsb5dtw.cloudfront.net/SaasIcon.png" // Replace with the path to your PNG image
  //       alt="My PNG Image"
  //       style={imgStyle}
  //     />
  //     <svg
  //       xmlns="http://www.w3.org/2000/svg"
  //       width="100%"
  //       height="100%"
  //       viewBox="0 0 512 512"
  //     >
  //       <defs>
  //         {/* Gradient definitions */}
  //       </defs>
  //       <g fill={PRIMARY_MAIN} fillRule="evenodd" stroke="none" strokeWidth="1">
  //         {/* SVG path elements */}
  //       </g>
  //     </svg>
  //   </Box>
  // );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return (
    <Link to="/" component={RouterLink} sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  sx: PropTypes.object,
  disabledLink: PropTypes.bool,
};

export default Logo;
