import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import logo from '../assets/Logo.jpg'; // Asegúrate de que el nombre de archivo y la extensión coincidan
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Importar el ícono de cerrar sesión

 

const CustomButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  fontWeight: 'bold',
  fontSize: '16px',
  textTransform: 'none',   // No uppercase for buttons
  color: '#fff',
  '&:hover': {
    backgroundColor: '#555', // Hover effect
  },
}));

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();


  const activeLinkStyle = {
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: '4px',
  };

   // Función para manejar el clic en "Cerrar Sesión"
   const handleLogout = () => {
    navigate('/login'); // Redirigir al login
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#003366' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ flexGrow: 1, color: '#fff' }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="logo"
            sx={{ marginRight: '16px' }}>
            <img src={logo} alt="Logo" style={{ width: '40px', height: '40px' }} />
          </IconButton>
          Gestión de Pruebas
        </Typography>

        <div>
          <CustomButton
            component={Link}
            to="/"
            sx={location.pathname === '/' ? activeLinkStyle : {}}
          >
            Inicio
          </CustomButton>
          <CustomButton
            component={Link}
            to="/projects"
            sx={location.pathname === '/projects' ? activeLinkStyle : {}}
          >
            Proyectos
          </CustomButton>
          <CustomButton
            component={Link}
            to="/test-plans"
            sx={location.pathname === '/test-plans' ? activeLinkStyle : {}}
          >
            Planes de Prueba
          </CustomButton>
          <CustomButton
            component={Link}
            to="/test-cases"
            sx={location.pathname === '/test-cases' ? activeLinkStyle : {}}
          >
            Casos de Prueba
          </CustomButton>
          <CustomButton
            component={Link}
            to="/defects"
            sx={location.pathname === '/defects' ? activeLinkStyle : {}}
          >
            Defectos
          </CustomButton>
          <CustomButton
            component={Link}
            to="/test_execution"
            sx={location.pathname === '/test_execution' ? activeLinkStyle : {}}
          >
            Ejecución de Pruebas
          </CustomButton>
          <CustomButton
            component={Link}
            to="/metrics"
            sx={location.pathname === '/metrics' ? activeLinkStyle : {}}
          >
            Métricas
          </CustomButton>

          <IconButton color="inherit" onClick={handleLogout}>
            <ExitToAppIcon />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
