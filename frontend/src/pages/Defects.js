import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Typography, TextField, Select, MenuItem, Button, Card, CardContent, CardActions, InputLabel, FormControl } from '@mui/material';

// Crear la instancia de axios fuera del componente
const axiosInstance = axios.create({
    baseURL: 'https://backend-gestor-247s.onrender.com',
});

const Defects = () => {
    // Estados para almacenar defectos, casos de prueba y los campos del formulario
    const [defects, setDefects] = useState([]);
    const [testCases, setTestCases] = useState([]); 
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [status, setStatus] = useState('open');
    const [testCaseId, setTestCaseId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Obtener defectos y casos de prueba al cargar el componente
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const defectsResponse = await axiosInstance.get('/defects');
                setDefects(defectsResponse.data);
                
                const testCasesResponse = await axiosInstance.get('/test-cases');
                setTestCases(testCasesResponse.data);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("No se pudieron cargar los defectos o casos de prueba");
            }
            setLoading(false);
        };

        fetchData();
    }, []); // Dependencias vacías para ejecutar solo una vez al montar

    // Manejar la creación de un nuevo defecto
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!testCaseId) {
                alert("Debe seleccionar un caso de prueba.");
                return;
            }
            const response = await axiosInstance.post('/defects', { 
                description, 
                assigned_to: assignedTo, 
                status, 
                test_case_id: testCaseId
            });
            setDefects([...defects, response.data]);
            setDescription('');
            setAssignedTo('');
            setStatus('open');
            setTestCaseId('');
        } catch (error) {
            console.error("Error al crear defect:", error);
        }
    };

    const handleDelete = (id) => {
        axiosInstance.delete(`/defects/${id}`)
          .then(() => setDefects(defects.filter(defect => defect.id !== id)))
          .catch(error => console.error('Error deleting defect:', error));
    };

    // Renderizado del formulario y lista de defectos
    return (
        <Container style={styles.container}>
            <Typography variant="h4" gutterBottom>
                Gestión de Defectos
            </Typography>

            {/* Formulario para agregar nuevos defectos */}
            <form onSubmit={handleSubmit} style={styles.form}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField 
                            label="Descripción" 
                            fullWidth 
                            multiline
                            rows={3}
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            required 
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            label="Asignado a" 
                            fullWidth 
                            value={assignedTo} 
                            onChange={(e) => setAssignedTo(e.target.value)} 
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Estado</InputLabel>
                            <Select 
                                value={status} 
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <MenuItem value="open">Abierto</MenuItem>
                                <MenuItem value="in progress">En Progreso</MenuItem>
                                <MenuItem value="resolved">Resuelto</MenuItem>
                                <MenuItem value="closed">Cerrado</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                            <InputLabel>Caso de Prueba</InputLabel>
                            <Select 
                                value={testCaseId} 
                                onChange={(e) => setTestCaseId(e.target.value)}
                            >
                                <MenuItem value="">Seleccionar Caso de Prueba</MenuItem>
                                {testCases.map(tc => (
                                    <MenuItem key={tc.id} value={tc.id}>
                                        {tc.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    style={styles.button}
                >
                    Registrar Defecto
                </Button>
            </form>

            {/* Lista de defectos */}
            <Typography variant="h5" gutterBottom>
                Lista de Defectos
            </Typography>

            {loading ? <p>Cargando defectos...</p> : null}
            {error ? <p style={styles.error}>{error}</p> : null}

            <Grid container spacing={3}>
                {defects.map(defect => (
                    <Grid item xs={12} sm={6} md={4} key={defect.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">
                                    Descripción: {defect.description}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Estado: {defect.status}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Asignado a: {defect.assigned_to}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Caso de Prueba: {defect.test_case_id}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" onClick={() => handleDelete(defect.id)} color="secondary">Eliminar</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

// Estilos CSS en JS para mejorar la presentación visual
const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    form: {
        marginBottom: '20px',
    },
    button: {
        marginTop: '20px',
    },
    error: {
        color: 'red',
    },
};

export default Defects;
