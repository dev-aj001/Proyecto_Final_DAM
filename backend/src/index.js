const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./config/mongoConnection');

dotenv.config();
PORT = process.env.PORT;

connectDB();

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});