const express = require('express');
const bodyParser = require('body-parser');
const inventoryRoutes = require('./routes/inventoryRoutes');
const almacenesRoutes = require('./routes/almacenesRoutes');
const seriesRoutes = require('./routes/seriesRoutes');
const movtosRoutes = require('./routes/movtosRoutes');
const infoadRoutes = require('./routes/infoadRoutes');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/almacenes', almacenesRoutes);
app.use('/api/v1/series', seriesRoutes);
app.use('/api/v1/movimientos', movtosRoutes);
app.use('/api/v1/infoad', infoadRoutes);

app.get('/', (req, res, next) => {
    res.send(
        `<h1>API RESTFULL de Inventarios</p>`
    );
});

app.use((req, res, next) => {
    res.status(404).json({ code: 404, message: 'Ruta no encontrada' });
});

module.exports = app;