require('dotenv').config();

const pool = require('./src/config/db');

pool.connect()
  .then(() => {
    console.log("PostgreSQL connected successfully");
  })
  .catch((err) => {
    console.error("PostgreSQL connection error:", err);
  });



const express = require('express');
const app = express();

// Middleware para permitir JSON
app.use(express.json());

// Importar rotas
const healthRoutes = require('./src/routes/healthRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');
const barberRoutes = require('./src/routes/barberRoutes');


app.use('/health', healthRoutes);
app.use('/services', serviceRoutes);
app.use('/barbers', barberRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


