require('dotenv').config();

const express = require('express');
const app = express();

// Middleware para permitir JSON
app.use(express.json());

// Importar rotas
const healthRoutes = require('./src/routes/healthRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');

app.use('/health', healthRoutes);
app.use('/services', serviceRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


