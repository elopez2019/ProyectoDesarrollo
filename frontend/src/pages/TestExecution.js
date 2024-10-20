import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Componente principal de ejecución de pruebas
const TestExecution = () => {
    const [testCases, setTestCases] = useState([]); // Almacena la lista de casos de prueba
    const [executionResults, setExecutionResults] = useState([]); // Almacena los resultados de ejecución
    const [loading, setLoading] = useState(false); // Controla el estado de carga global
    const [executing, setExecuting] = useState(null); // Controla el estado de ejecución actual
    const [error, setError] = useState(null); // Almacena los errores de ejecución
    const [testCaseData, setTestCaseData] = useState({}); // Estado para manejar individualmente el status y la evidencia de cada caso

    // Instancia de Axios configurada para llamadas al backend
    const axiosInstance = axios.create({
        baseURL: 'https://proyectodesarrollo-w7fa.onrender.com',
    });

    // Función para obtener los casos de prueba desde el backend
    useEffect(() => {
        const fetchTestCases = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get('/test-cases');
                setTestCases(response.data);
                const resultsResponse = await axiosInstance.get('/test-executions');
                setExecutionResults(resultsResponse.data); // Cargar resultados previos
            } catch (err) {
                console.error("Error fetching test cases or results:", err);
                setError("No se pudieron cargar los casos de prueba o resultados.");
            } finally {
                setLoading(false);
            }
        };
        fetchTestCases();
    }, []); // Eliminar axiosInstance de las dependencias

    // Función para manejar el cambio individual del estado (aprobado o fallido) y la evidencia de cada caso de prueba
    const handleInputChange = (testCaseId, field, value) => {
        setTestCaseData(prevData => ({
            ...prevData,
            [testCaseId]: {
                ...prevData[testCaseId],
                [field]: value,
            }
        }));
    };

    // Función para ejecutar una prueba específica
    const handleExecuteTest = async (testCaseId) => {
        setExecuting(testCaseId); // Indica que este caso se está ejecutando
        setError(null); // Limpiar cualquier error previo

        try {
            const { status = 'passed', evidence = '' } = testCaseData[testCaseId] || {};

            // Enviar el estado del caso de prueba (aprobado o fallido) y la evidencia al backend
            const response = await axiosInstance.post(`/test-execute/${testCaseId}`, {
                status,
                evidence
            });

            // Actualizar el estado de resultados de ejecución con la nueva entrada
            setExecutionResults([...executionResults, response.data]);
            setTestCaseData(prevData => ({
                ...prevData,
                [testCaseId]: { status: 'passed', evidence: '' } // Limpiar campos después de la ejecución
            }));
        } catch (err) {
            console.error("Error executing test case:", err);
            setError(`Error ejecutando el caso de prueba ${testCaseId}.`);
        } finally {
            setExecuting(null); // Limpia el estado de ejecución
        }
    };

    return (
        <div style={styles.container}>
            <h1>Ejecución de Pruebas</h1>

            {/* Mostrar estado de carga general */}
            {loading && <p>Cargando casos de prueba...</p>}
            {error && <p style={styles.error}>{error}</p>}

            {/* Lista de casos de prueba */}
            <h2>Lista de Casos de Prueba</h2>
            <ul style={styles.list}>
                {testCases.map(test => (
                    <li key={test.id} style={styles.listItem}>
                        <span>{test.name}</span>
                        <div>
                            {/* Input para seleccionar si fue aprobado o fallido */}
                            <select
                                value={testCaseData[test.id]?.status || 'passed'}
                                onChange={(e) => handleInputChange(test.id, 'status', e.target.value)}
                                style={styles.select}
                            >
                                <option value="passed">Aprobado</option>
                                <option value="failed">Fallido</option>
                            </select>

                            {/* Input para ingresar evidencia */}
                            <input
                                type="text"
                                value={testCaseData[test.id]?.evidence || ''}
                                onChange={(e) => handleInputChange(test.id, 'evidence', e.target.value)}
                                placeholder="Ingresar evidencia"
                                style={styles.input}
                            />

                            {/* Botón de ejecución */}
                            <button
                                onClick={() => handleExecuteTest(test.id)}
                                disabled={executing === test.id}
                                style={executing === test.id ? styles.buttonDisabled : styles.button}
                            >
                                {executing === test.id ? "Ejecutando..." : "Ingresar"}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Resultados de ejecución */}
            <h2>Resultados de Ejecución</h2>
            <ul style={styles.list}>
                {executionResults.map(result => (
                    <li key={result.id} style={styles.resultItem}>
                        <strong>{`Caso de Prueba ${result.test_case_id}:`}</strong>
                        {result.status === 'passed' ? "Aprobado" : "Fallido"}
                        {result.evidence && ` - Evidencia: ${result.evidence}`} {/* Mostrar evidencia si existe */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

// Estilos en línea para la presentación del componente
const styles = {
    container: {
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    list: {
        listStyleType: 'none',
        padding: 0,
    },
    listItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '10px 0',
        padding: '10px',
        backgroundColor: '#fff',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    select: {
        marginRight: '10px',
    },
    input: {
        marginRight: '10px',
        padding: '5px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    button: {
        padding: '10px 15px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    buttonDisabled: {
        padding: '10px 15px',
        backgroundColor: '#ccc',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'not-allowed',
    },
    resultItem: {
        padding: '10px',
        backgroundColor: '#e9f7ef',
        borderRadius: '4px',
        marginBottom: '10px',
    },
    error: {
        color: 'red',
    },
};

export default TestExecution;
