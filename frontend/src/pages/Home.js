import { Container, Typography, Divider, Box } from '@mui/material';

function Home() {
  return (
    <Container sx={{ padding: 2 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Bienvenido a la Gestión de Pruebas
      </Typography>
      <Typography variant="body1">
        Utilice el menú de navegación para acceder a las distintas secciones del sistema.
      </Typography>

      {/* Separador visual */}
      <Box sx={{ mt: 4, mb: 50 }}>
        <Divider />
      </Box>

      {/* Sección de créditos */}
      <Box sx={{ textAlign: 'center', mt: 8, p: 2, backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Creado por:
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          Elsy Emilie Jissel Hernández López
        </Typography>
        <Typography variant="body2">
          Carnet: 1890-17-11891
        </Typography>
      </Box>
    </Container>
  );
}

export default Home;
