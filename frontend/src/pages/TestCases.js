import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid, // Para organizar el diseño en forma de tarjetas
  Card,
  CardContent,
  CardActions,
  Tooltip,
  Slide
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { TransitionGroup } from 'react-transition-group'; // Para animación


// Componente principal para gestionar los casos de prueba
function TestCases() {
  const [testCases, setTestCases] = useState([]); // Estado para almacenar los casos de prueba
  const [testPlans, setTestPlans] = useState([]); // Estado para almacenar los planes de prueba en el dropdown
  const [open, setOpen] = useState(false); // Controla la apertura del diálogo de creación/edición
  const [currentTestCase, setCurrentTestCase] = useState(null); // Controla el caso de prueba seleccionado para editar
  const [newTestCase, setNewTestCase] = useState({
    test_plan_id: '',
    name: '',
    description: '',
    status: 'pending', // Estado predeterminado
  });

  // Crear una instancia de axios para la comunicación con el backend
  const axiosInstance = axios.create({
    baseURL: 'https://backend-gestor-247s.onrender.com',
  });

  // Obtener casos de prueba y planes de prueba al cargar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener casos de prueba
        const testCasesResponse = await axiosInstance.get('/test-cases');
        setTestCases(testCasesResponse.data);

        // Obtener planes de prueba
        const testPlansResponse = await axiosInstance.get('/test-plans');
        setTestPlans(testPlansResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [axiosInstance]);

  // Manejar la apertura y cierre del diálogo
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  // Reiniciar el formulario al cerrar o crear uno nuevo
  const resetForm = () => {
    setNewTestCase({
      test_plan_id: '',
      name: '',
      description: '',
      status: 'pending', // Estado predeterminado
    });
    setCurrentTestCase(null);
  };

  // Manejar los cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTestCase(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Guardar o actualizar un caso de prueba
  const handleSave = () => {
    // Validación básica de campos
    if (newTestCase.name.trim() === '' || newTestCase.test_plan_id === '') {
      alert("El nombre y el plan de prueba son campos obligatorios.");
      return;
    }

    if (currentTestCase) {
      // Editar un caso de prueba existente
      axiosInstance.put(`/test-cases/${currentTestCase.id}`, newTestCase)
        .then(() => {
          setTestCases(testCases.map(tc => (tc.id === currentTestCase.id ? newTestCase : tc)));
          handleClose();
        })
        .catch(error => console.error('Error updating test case:', error));
    } else {
      // Crear un nuevo caso de prueba
      axiosInstance.post('/test-cases', newTestCase)
        .then(response => {
          setTestCases([...testCases, response.data]);
          handleClose();
        })
        .catch(error => console.error('Error creating test case:', error));
    }
  };

  // Manejar la edición de un caso de prueba
  const handleEdit = (testCase) => {
    setCurrentTestCase(testCase);
    setNewTestCase(testCase);
    handleClickOpen();
  };

  // Manejar la eliminación de un caso de prueba
  const handleDelete = (id) => {
    axiosInstance.delete(`/test-cases/${id}`)
      .then(() => setTestCases(testCases.filter(tc => tc.id !== id)))
      .catch(error => console.error('Error deleting test case:', error));
  };

  // Renderizamos el componente de manera visualmente atractiva
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Casos de Prueba
      </Typography>

      {/* Botón para crear un nuevo caso de prueba */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddCircleIcon />}
        onClick={() => { resetForm(); handleClickOpen(); }}
        style={{ marginTop: '20px' }}
      >
        Crear Caso de Prueba
      </Button>

      {/* Mapa de los casos de prueba existentes, mostrándolos en tarjetas */}
      <Grid container spacing={3} style={{ marginTop: '20px' }}>
      <TransitionGroup component={null}>
          {testCases.map(tc => (
        <Slide direction="up" in mountOnEnter unmountOnExit key={tc.id} timeout={300}>

          <Grid item xs={12} sm={6} md={4} key={tc.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{tc.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {`Descripción: ${tc.description}`}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {`Plan de Prueba: ${tc.test_plan_id}`}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {`Estado: ${tc.status }`}
                </Typography>
              </CardContent>
              <CardActions>
                <Tooltip title="Editar">
                  <IconButton onClick={() => handleEdit(tc)} color="primary">
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar">
                  <IconButton onClick={() => handleDelete(tc.id)} color="secondary">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
          </Slide>
        ))}
        </TransitionGroup>
      </Grid>

      {/* Diálogo para crear o editar casos de prueba */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentTestCase ? 'Editar Caso de Prueba' : 'Crear Caso de Prueba'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Plan de Prueba</InputLabel>
            <Select
              name="test_plan_id"
              value={newTestCase.test_plan_id}
              onChange={handleInputChange}
            >
              {testPlans.map(plan => (
                <MenuItem key={plan.id} value={plan.id}>
                  {plan.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Nombre"
            type="text"
            fullWidth
            variant="outlined"
            value={newTestCase.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Descripción"
            type="text"
            fullWidth
            variant="outlined"
            value={newTestCase.description}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Estado</InputLabel>
            <Select
              name="status"
              value={newTestCase.status}
              onChange={handleInputChange}
            >
              <MenuItem value="pending">Pendiente</MenuItem>
              <MenuItem value="passed">Aprobado</MenuItem>
              <MenuItem value="failed">Fallido</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave} color="primary">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default TestCases;
