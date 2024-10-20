// Login    
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
        const response = await axios.post('https://proyectodesarrollo-w7fa.onrender.com/login', { username, password });
        if (response.data.success) {
        setIsAuthenticated(true);
        navigate('/'); // Redirigir al Home después del login
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Por favor, intenta nuevamente.');
    }
  };

  return (
    <Container maxWidth="sm" sx={styles.container}>
      <Box sx={styles.box}>
        <Typography variant="h4" sx={styles.title}>Iniciar Sesión <br></br>
            Gestor de Pruebas
        </Typography>

        <form onSubmit={handleLogin}>
          <TextField
            label="Nombre de Usuario"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Contraseña"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Typography color="error" sx={styles.error}>{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={styles.button}>
            Iniciar Sesión
          </Button>
        </form>

        <Typography sx={styles.registerText}>
          ¿No tienes una cuenta? <Link to="/register" style={styles.link}>Regístrate aquí</Link>
        </Typography>
      </Box>
    </Container>
  );
};

// Estilos en CSS en JS para el Login
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  box: {
    padding: '40px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    marginTop: '20px',
  },
  error: {
    marginTop: '10px',
  },
  registerText: {
    marginTop: '15px',
    textAlign: 'center',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default Login;
