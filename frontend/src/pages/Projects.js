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
import { TransitionGroup } from 'react-transition-group'; // Para animación

function Projects() {
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    start_date: new Date().toISOString().split('T')[0],  // Formateamos fecha
    end_date: new Date().toISOString().split('T')[0],
  });

  const [searchTerm, setSearchTerm] = useState(''); // Estado para la búsqueda

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
  });

  useEffect(() => {
    axiosInstance.get('/projects')
      .then(response => {
        // Actualizar formato de fechas al recibir proyectos desde la base de datos
        const formattedProjects = response.data.map(project => ({
          ...project,
          start_date: project.start_date.split('T')[0], // Mantener solo la parte de la fecha
          end_date: project.end_date.split('T')[0]
        }));
        setProjects(formattedProjects);
      })
      .catch(error => console.error('Error fetching projects:', error));
  }, []);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setNewProject({
      name: '',
      description: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
    });
    setCurrentProject(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const handleSave = () => {
    if (!newProject.name || !newProject.description) {
      console.error('Nombre y descripción son obligatorios');
      return;
    }

    if (!newProject.start_date || !newProject.end_date) {
      alert('Por favor, ingresa fechas válidas.');
      return;
    }

    const projectData = {
      ...newProject,
      start_date: newProject.start_date, // Ya está en el formato YYYY-MM-DD
      end_date: newProject.end_date
    };

    if (currentProject) {
      axiosInstance.put(`/projects/${currentProject.id}`, projectData)
        .then(() => {
          setProjects(projects.map(project => project.id === currentProject.id ? { ...project, ...projectData } : project));
          setOpen(false);
          resetForm();
        })
        .catch(error => console.error('Error updating project:', error));
    } else {
      axiosInstance.post('/projects', projectData)
        .then(response => {
          setProjects([...projects, {
            ...response.data,
            start_date: response.data.start_date.split('T')[0],  // Formateamos la fecha en el nuevo proyecto
            end_date: response.data.end_date.split('T')[0]
          }]);
          setOpen(false);
          resetForm();
        })
        .catch(error => console.error('Error creating project:', error));
    }
  };

  const handleEdit = (project) => {
    setCurrentProject(project);
    setNewProject(project);
    handleClickOpen();
  };

  const handleDelete = (id) => {
    axiosInstance.delete(`/projects/${id}`)
      .then(() => setProjects(projects.filter(project => project.id !== id)))
      .catch(error => console.error('Error deleting project:', error));
  };

  // Filtrar proyectos según el término de búsqueda
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm)
  );

  return (
    <Container>
      <Typography variant="h4" align="left" gutterBottom>
        Proyectos
      </Typography>

      {/* Input para el filtro de búsqueda */}
      <TextField
        label="Buscar Proyectos"
        variant="outlined"
        fullWidth
        style={{ marginBottom: '20px' }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
      />

      {/* Boton para crear proyectos */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddCircleIcon />}
        onClick={() => { resetForm(); handleClickOpen(); }}
        style={{ marginTop: '20px', display: 'block', marginLeft: '5px', marginRight: 'auto' }}
      >
        Crear Proyecto
      </Button>
      
      {/* Cards de los proyectos */}
      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        <TransitionGroup component={null}>
          {filteredProjects.map(project => (
            <Slide direction="up" in mountOnEnter unmountOnExit key={project.id} timeout={300}>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {"#" + project.id + " - " + project.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {`Descripción: ${project.description}`}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {`Inicio: ${project.start_date}`}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {`Fin: ${project.end_date}`}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Tooltip title="Editar">
                      <IconButton onClick={() => handleEdit(project)} color="primary">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton onClick={() => handleDelete(project.id)} color="secondary">
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
                  
      {/* Dialogo para crear proyectos */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentProject ? 'Editar Proyecto' : 'Crear Proyecto'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Nombre"
            type="text"
            fullWidth
            variant="outlined"
            value={newProject.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Descripción"
            type="text"
            fullWidth
            variant="outlined"
            value={newProject.description}
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
            value={newProject.start_date}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="end_date"
            label="Fecha de Fin"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={newProject.end_date}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSave} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Projects;
