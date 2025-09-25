const app = require('./src/app');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Modo: Desenvolvimento`);
  console.log(`🌐 Acesse: http://localhost:${PORT}`);
});