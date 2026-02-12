const express = require('express');

const app = express();

// Middleware para permitir JSON
app.use(express.json());

// Importar rotas
const healthRoutes = require('./src/routes/healthRoutes');

app.use('/health', healthRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
