const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const inventaryRoutes = require('./routes/inventoryRoutes');

const app = express();
app.use(bodyParser.json());

app.use('/api/v1',inventaryRoutes);
app.get('/', (req, res, next) => {
    res.send(
        `<h1>API RESTFULL de Inventory </h1>`
    );
})
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conexión exitosa a MongoDB');
}).catch((err) => {
  console.error('Error de conexión a MongoDB:', err);
});


const PORT =  process.env.PORT || 3000;

app.listen(PORT, ()=> {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log('Presione CTRL + C para cerrar el server');
});

module.exports = app;