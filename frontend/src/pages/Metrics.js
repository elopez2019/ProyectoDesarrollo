import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';  // Extensión para crear tablas en PDF

const Metrics = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const axiosInstance = axios.create({
    baseURL: 'https://backend-gestor-247s.onrender.com',
  });

  // Función para obtener las métricas desde el backend
  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/metrics');
      setMetrics(response.data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      setError('No se pudieron cargar las métricas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []); // Asegúrate de pasar un array vacío aquí para evitar llamadas innecesarias

  // Función para generar el reporte en PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Reporte de Métricas de Calidad', 10, 10);

    doc.autoTable({
      startY: 30,
      head: [['Proyecto', 'Total Pruebas', 'Pruebas Aprobadas', 'Pruebas Fallidas', 'Tasa Defectos']],
      body: metrics.map(metric => [
        metric.project_name,
        metric.total_tests,
        metric.passed_tests,
        metric.failed_tests,
        `${metric.defect_rate} %`,
      ]),
    });

    // Guardar el PDF
    doc.save('reporte_metricas_calidad.pdf');
  };

  return (
    <div style={styles.container}>
      <h1>Informe y Métricas de Calidad</h1>
      {/* Botón para exportar a PDF */}
      <button onClick={generatePDF} style={styles.button}>
        Exportar PDF
      </button>
      
      {loading && <p>Cargando métricas...</p>}
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.metricsContainer}>
        {metrics.map(metric => (
          <div key={metric.project_id} style={styles.metric}>
            <h2>Proyecto: {metric.project_name}</h2>
            <p>Total de Pruebas: {metric.total_tests}</p>
            <p>Pruebas Aprobadas: {metric.passed_tests}</p>
            <p>Pruebas Fallidas: {metric.failed_tests}</p>
            <p>Tasa de Defectos: {metric.defect_rate} %</p>
            <p>Tiempo Promedio de Resolución: {metric.average_resolution_time} días</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Estilos CSS en JS
const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  metricsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  metric: {
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  error: {
    color: 'red',
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Metrics;
