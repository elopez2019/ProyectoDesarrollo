// para registrar nuevos usuarios
// src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      await axios.post('https://backend-gestor-247s.onrender.com/register', { username, password });
      alert('Usuario creado exitosamente');
      navigate('/login'); // Redirigir al login después del registro
    } catch (err) {
      setError('Error creando el usuario. Por favor, intenta nuevamente.');
    }
  };

  return (
    <Container maxWidth="sm" sx={styles.container}>
      <Box sx={styles.box}>
        <Typography variant="h4" sx={styles.title}>Registro de Usuario</Typography>

        <form onSubmit={handleRegister}>
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
          <TextField
            label="Confirmar Contraseña"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <Typography color="error" sx={styles.error}>{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={styles.button}>
            Registrarse
          </Button>
        </form>
      </Box>
    </Container>
  );
};

// Estilos en CSS en JS para el Register
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
};

export default Register;
