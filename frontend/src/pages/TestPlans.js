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
  Grid, 
  Card,
  CardContent,
  CardActions,
  Tooltip,
  Slide
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { TransitionGroup } from 'react-transition-group';

// Componente principal para gestionar los planes de prueba
function TestPlans() {
  const [testPlans, setTestPlans] = useState([]); // Estado para almacenar los planes de prueba
  const [projects, setProjects] = useState([]); // Estado para mostrar los proyectos en el dropdown
  const [open, setOpen] = useState(false); // Controlar la apertura del diálogo de creación/edición
  const [currentTestPlan, setCurrentTestPlan] = useState(null); // Controla el plan de prueba seleccionado para edición
  const [newTestPlan, setNewTestPlan] = useState({
    name: '',
    description: '',
    start_date: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
    end_date: new Date().toISOString().split('T')[0],
    status: 'active', // Estado predeterminado
    project_id: ''
  });

  // Crear una instancia de axios para la comunicación con el backend
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
  });

  // Cargar los datos de planes de prueba y proyectos al iniciar el componente
  useEffect(() => {
    // Obtener los planes de prueba
    axiosInstance.get('/test-plans')
      .then(response => {
        // Formatear las fechas para evitar problemas al mostrar
        const formattedPlans = response.data.map(plan => ({
          ...plan,
          start_date: plan.start_date.split('T')[0],
          end_date: plan.end_date.split('T')[0],
        }));
        setTestPlans(formattedPlans);
      })
      .catch(error => console.error('Error fetching test plans:', error));

    // Obtener la lista de proyectos para mostrarlos en el dropdown
    axiosInstance.get('/projects')
      .then(response => setProjects(response.data))
      .catch(error => console.error('Error fetching projects:', error));
  }, [axiosInstance]);

  // Manejar la apertura y cierre del diálogo
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Reiniciar el formulario al cerrar o crear uno nuevo
  const resetForm = () => {
    setNewTestPlan({
      name: '',
      description: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
      status: 'active',
      project_id: ''
    });
    setCurrentTestPlan(null);
  };

  // Manejar los cambios en los campos de entrada del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTestPlan(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Manejar el cambio de las fechas para asegurarse de que se mantengan en formato YYYY-MM-DD
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const formattedDate = new Date(value).toISOString().split('T')[0];
    setNewTestPlan(prevState => ({
      ...prevState,
      [name]: formattedDate,
    }));
  };

  // Guardar o actualizar un plan de prueba
  const handleSave = () => {
    // Validación básica de campos
    if (newTestPlan.name.trim() === '' || newTestPlan.project_id === '') {
      alert("El nombre y el proyecto son campos obligatorios.");
      return;
    }

    const testPlanData = {
      ...newTestPlan,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Si es un plan existente, lo actualizamos, sino creamos uno nuevo
    if (currentTestPlan) {
      axiosInstance.put(`/test-plans/${currentTestPlan.id}`, testPlanData)
        .then(() => {
          setTestPlans(testPlans.map(plan => plan.id === currentTestPlan.id ? { ...plan, ...testPlanData } : plan));
          setOpen(false);
          resetForm();
        })
        .catch(error => console.error('Error updating test plan:', error));
    } else {
      axiosInstance.post('/test-plans', testPlanData)
        .then(response => {
          setTestPlans([...testPlans, response.data]);
          setOpen(false);
          resetForm();
        })
        .catch(error => console.error('Error creating test plan:', error));
    }
  };

  // Manejar la edición de un plan de prueba
  const handleEdit = (testPlan) => {
    setCurrentTestPlan(testPlan);
    setNewTestPlan({
      ...testPlan,
      start_date: new Date(testPlan.start_date).toISOString().split('T')[0],
      end_date: new Date(testPlan.end_date).toISOString().split('T')[0],
      status: testPlan.status || 'active'
    });
    handleClickOpen();
  };

  // Manejar la eliminación de un plan de prueba
  const handleDelete = (id) => {
    axiosInstance.delete(`/test-plans/${id}`)
      .then(() => setTestPlans(testPlans.filter(plan => plan.id !== id)))
      .catch(error => console.error('Error deleting test plan:', error));
  };

  // Función para obtener el nombre del proyecto basado en el project_id
  const getProjectName = (project_id) => {
    const project = projects.find(proj => proj.id === project_id);
    return project ? project.name : 'Proyecto no encontrado';
  };

  // Renderizamos el componente de manera visualmente atractiva
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Planes de Prueba
      </Typography>

      {/* Botón para crear un nuevo plan de prueba */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddCircleIcon />}
        onClick={() => { resetForm(); handleClickOpen(); }}
      >
        Crear Plan de Prueba
      </Button>
      
      {/* Mapa de los planes de prueba existentes, mostrándolos en tarjetas */}
      <Grid container spacing={3} style={{ marginTop: '20px' }}>
      <TransitionGroup component={null}>
          {testPlans.map(plan => (
        <Slide direction="up" in mountOnEnter unmountOnExit key={plan.id} timeout={300}>

          <Grid item xs={12} sm={6} md={4} key={plan.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{"#" + plan.id + " - " +plan.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {`Proyecto: ${getProjectName(plan.project_id)}`} {/* Mostrar el nombre del proyecto */}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {`Descripción: ${plan.description}`}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {`Inicio: ${plan.start_date}`}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {`Fin: ${plan.end_date}`}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {`Estado: ${plan.status === 'active' ? "Activo" : "Inactivo"}`}
                </Typography>
              </CardContent>
              <CardActions>
                <Tooltip title="Editar">
                  <IconButton onClick={() => handleEdit(plan)} color="primary">
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar">
                  <IconButton onClick={() => handleDelete(plan.id)} color="secondary">
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

      {/* Diálogo para crear o editar planes de prueba */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentTestPlan ? 'Editar Plan de Prueba' : 'Crear Plan de Prueba'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Nombre"
            type="text"
            fullWidth
            variant="outlined"
            value={newTestPlan.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Descripción"
            type="text"
            fullWidth
            variant="outlined"
            value={newTestPlan.description}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="start_date"
            label="Fecha de Inicio"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={newTestPlan.start_date}
            onChange={handleDateChange}
          />
          <TextField
            margin="dense"
            name="end_date"
            label="Fecha de Fin"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={newTestPlan.end_date}
            onChange={handleDateChange}
          />

          {/* Aquí usamos Grid para separar los campos de estado y proyecto */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Proyecto Asociado</InputLabel>
                <Select
                  name="project_id"
                  value={newTestPlan.project_id}
                  onChange={handleInputChange}
                >
                  {projects.map(project => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Estado</InputLabel>
                <Select
                  name="status"
                  value={newTestPlan.status || 'active'} // Aseguramos que haya un valor por defecto si es null
                  onChange={handleInputChange}
                >
                  <MenuItem value="active">Activo</MenuItem>
                  <MenuItem value="inactive">Inactivo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancelar</Button>
          <Button onClick={handleSave}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default TestPlans;
