const express = require('express');
const cors = require('cors');
const mysql = require('mysql2'); // Asegúrate de estar usando mysql2 en lugar de mysql
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'Abcd1234.**', 
    database: 'quality_management'
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos: ', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Configura CORS para permitir solicitudes desde cualquier origen
app.use(cors());
app.use(express.json());

// Rutas del servidor
app.get('/', (req, res) => {
  res.send('Backend funcionando correctamente');
});

// ---------------------- Proyectos ----------------------
app.post('/projects', (req, res) => {
    const { name, description, start_date, end_date } = req.body;
    const sql = 'INSERT INTO Projects (name, description, start_date, end_date) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, description, start_date, end_date], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: results.insertId, name, description, start_date, end_date });
    });
});

app.get('/projects', (req, res) => {
    const sql = 'SELECT * FROM Projects';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/projects/:id', (req, res) => {
    const sql = 'SELECT * FROM Projects WHERE id = ?';
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Proyecto no encontrado' });
        res.json(results[0]);
    });
});

app.put('/projects/:id', (req, res) => {
    const { name, description, start_date, end_date } = req.body;
    const sql = 'UPDATE Projects SET name = ?, description = ?, start_date = ?, end_date = ? WHERE id = ?';
    db.query(sql, [name, description, start_date, end_date, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: req.params.id, name, description, start_date, end_date });
    });
});

app.delete('/projects/:id', (req, res) => {
    const sql = 'DELETE FROM Projects WHERE id = ?';
    db.query(sql, [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(204).end();
    });
});

// ---------------------- Planes de Prueba ----------------------
app.post('/test-plans', (req, res) => {
    const { project_id, name, description, start_date, end_date, status } = req.body;

    // Verificación de que todos los campos requeridos están presentes
    if (!project_id || !name || !description || !start_date || !end_date || !status) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    // Consulta SQL para insertar un nuevo plan de prueba
    const sql = `
        INSERT INTO TestPlans (project_id, name, description, start_date, end_date, created_at, updated_at, status) 
        VALUES (?, ?, ?, ?, ?, NOW(), NOW(), ?)
    `;

    // Ejecución de la consulta con los parámetros correspondientes
    db.query(sql, [project_id, name, description, start_date, end_date, status], (err, results) => {
        if (err) {
            console.error('Database error:', err); // Registrar el error en la consola del servidor
            return res.status(500).json({ error: err.message }); // Responder con el mensaje de error
        }

        // Respuesta exitosa con los detalles del nuevo plan de prueba creado
        res.status(201).json({
            id: results.insertId,
            project_id,
            name,
            description,
            start_date,
            end_date,
            created_at: new Date(),
            updated_at: new Date(),
            status
        });
    });
});

app.get('/test-plans', (req, res) => {
    const sql = 'SELECT * FROM TestPlans';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/test-plans/:id', (req, res) => {
    const sql = 'SELECT * FROM TestPlans WHERE id = ?';
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Plan de prueba no encontrado' });
        res.json(results[0]);
    });
});

app.put('/test-plans/:id', (req, res) => {
    const { project_id, name, description, start_date, end_date, status } = req.body;
    const sql = `
        UPDATE TestPlans 
        SET project_id = ?, name = ?, description = ?, start_date = ?, end_date = ?, updated_at = NOW(), status = ? 
        WHERE id = ?
    `;
    db.query(sql, [project_id, name, description, start_date, end_date, status, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ 
            id: req.params.id, 
            project_id, 
            name, 
            description, 
            start_date, 
            end_date, 
            updated_at: new Date(),
            status
        });
    });
});

app.delete('/test-plans/:id', (req, res) => {
    const sql = 'DELETE FROM testPlans WHERE id = ?';
    db.query(sql, [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(204).end();
    });
});

// ---------------------- Casos de Prueba ----------------------
app.post('/test-cases', (req, res) => {
    const { test_plan_id, name, description, status } = req.body;

    // Verificar que el status sea uno de los valores permitidos
    const validStatuses = ['pending', 'passed', 'failed'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Estado inválido. Debe ser "pending", "passed" o "failed".' });
    }

    const sql = 'INSERT INTO TestCases (test_plan_id, name, description, status) VALUES (?, ?, ?, ?)';
    db.query(sql, [test_plan_id, name, description, status], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: results.insertId, test_plan_id, name, description, status });
    });
});


app.get('/test-cases', (req, res) => {
    const sql = 'SELECT * FROM TestCases';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/test-cases/:id', (req, res) => {
    const sql = 'SELECT * FROM TestCases WHERE id = ?';
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Caso de prueba no encontrado' });
        res.json(results[0]);
    });
});

app.put('/test-cases/:id', (req, res) => {
    const { test_plan_id, name, description, status } = req.body;
    const sql = 'UPDATE TestCases SET test_plan_id = ?, name = ?, description = ?, status = ? WHERE id = ?';
    db.query(sql, [test_plan_id, name, description, status, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: req.params.id, test_plan_id, name, description, status });
    });
});

app.delete('/test-cases/:id', (req, res) => {
    const sql = 'DELETE FROM TestCases WHERE id = ?';
    db.query(sql, [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(204).end();
    });
});

// ---------------------- Ejecucion de Pruebas ----------------------

app.post('/test-execute/:id', (req, res) => {
    const { status, evidence } = req.body;
    const test_case_id = req.params.id;

    const sql = `
        INSERT INTO TestExecutions (test_case_id, result, evidence) 
        VALUES (?, ?, ?)
    `;
    db.query(sql, [test_case_id, status, evidence], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({
            id: results.insertId,
            test_case_id,
            status,
            evidence
        });
    });
});


// ---------------------- Defectos ----------------------
// Crear un nuevo defecto
app.post('/defects', (req, res) => {
    const { test_case_id, description, assigned_to } = req.body;
    const sql = 'INSERT INTO Defects (test_case_id, description, assigned_to) VALUES (?, ?, ?)';
    db.query(sql, [test_case_id, description, assigned_to], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: results.insertId, test_case_id, description, assigned_to });
    });
});

// Obtener todos los defectos
app.get('/defects', (req, res) => {
    const sql = 'SELECT * FROM Defects';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Obtener un defecto por ID
app.get('/defects/:id', (req, res) => {
    const sql = 'SELECT * FROM Defects WHERE id = ?';
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Defecto no encontrado' });
        res.json(results[0]);
    });
});

// Actualizar un defecto
app.put('/defects/:id', (req, res) => {
    const { description, status, assigned_to } = req.body;
    const sql = 'UPDATE Defects SET description = ?, status = ?, assigned_to = ? WHERE id = ?';
    db.query(sql, [description, status, assigned_to, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: req.params.id, description, status, assigned_to });
    });
});

// Eliminar un defecto
app.delete('/defects/:id', (req, res) => {
    const sql = 'DELETE FROM Defects WHERE id = ?';
    db.query(sql, [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(204).end();
    });
});



// ---------------------- Ejecucion de Pruebas ----------------------

app.post('/test-executions', (req, res) => {
    const { test_case_id, result, evidence, comments } = req.body;
    const sql = `
        INSERT INTO TestExecutions (test_case_id, result, evidence, comments) 
        VALUES (?, ?, ?, ?)
    `;
    db.query(sql, [test_case_id, result, evidence, comments], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ 
            id: results.insertId, 
            test_case_id, 
            result, 
            evidence, 
            comments,
            execution_date: new Date() // Se agrega automáticamente
        });
    });
});

app.post('/test-execute/:id', (req, res) => {
    const testCaseId = req.params.id;

    // Aquí puedes incluir la lógica para ejecutar la prueba
    // Por ahora, simulamos un resultado
    const result = {
        id: testCaseId,
        test_case_id: testCaseId,
        status: Math.random() > 0.5 ? 'passed' : 'failed', // Simulación de estado
        evidence: null, // Aquí puedes agregar la lógica para almacenar evidencia si es necesario
    };

    res.status(200).json(result);
});


app.get('/test-executions', (req, res) => {
    const sql = 'SELECT * FROM TestExecutions';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/test-executions/:id', (req, res) => {
    const sql = 'SELECT * FROM TestExecutions WHERE id = ?';
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Ejecución de prueba no encontrada' });
        res.json(results[0]);
    });
});

app.put('/test-executions/:id', (req, res) => {
    const { test_case_id, result, evidence, comments } = req.body;
    const sql = `
        UPDATE TestExecutions 
        SET test_case_id = ?, result = ?, evidence = ?, comments = ?, execution_date = NOW() 
        WHERE id = ?
    `;
    db.query(sql, [test_case_id, result, evidence, comments, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ 
            id: req.params.id, 
            test_case_id, 
            result, 
            evidence, 
            comments,
            execution_date: new Date()
        });
    });
});

app.delete('/test-executions/:id', (req, res) => {
    const sql = 'DELETE FROM TestExecutions WHERE id = ?';
    db.query(sql, [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(204).end();
    });
});


app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});


// ---------------------- Metricas ----------------------

app.get('/metrics', async (req, res) => {
    try {
        const [rows] = await db.promise().query(`
            SELECT 
                p.id AS project_id,
                p.name AS project_name,
                COUNT(tc.id) AS total_tests,
                SUM(CASE WHEN te.result = 'passed' THEN 1 ELSE 0 END) AS passed_tests,
                SUM(CASE WHEN te.result = 'failed' THEN 1 ELSE 0 END) AS failed_tests,
                ROUND((SUM(CASE WHEN te.result = 'failed' THEN 1 ELSE 0 END) / COUNT(tc.id)) * 100, 2) AS defect_rate,
                IFNULL(AVG(DATEDIFF(te.execution_date, te.execution_date)), 0) AS average_resolution_time
            FROM 
                Projects p
            LEFT JOIN 
                TestPlans tp ON p.id = tp.project_id
            LEFT JOIN 
                TestCases tc ON tp.id = tc.test_plan_id
            LEFT JOIN 
                TestExecutions te ON tc.id = te.test_case_id
            GROUP BY 
                p.id, p.name;
        `);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching metrics:", error);
        res.status(500).json({ error: 'Error fetching metrics' });
    }
});

/// ---------------------- LOGIN ----------------------

// Ruta para registrar un nuevo usuario
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
    db.query(query, [username, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
  });
  
  // Ruta para el login
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    const query = `SELECT * FROM users WHERE username = ?`;
    db.query(query, [username], async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(400).json({ success: false, message: 'Usuario no encontrado' });
  
      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (isMatch) {
        res.json({ success: true });
      } else {
        res.status(400).json({ success: false, message: 'Contraseña incorrecta' });
      }
    });
  });
  

