require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Conexão com o banco de dados
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('✅ Conectado ao banco de dados MySQL');
});

// Rotas
app.use('/api/auth', require('./routes/auth'));        // Login e registro
app.use('/api/users', require('./routes/users'));      // Gerenciamento de usuários
app.use('/api/products', require('./routes/products')); // Produtos
app.use('/api/cart', require('./routes/cart'));         // Carrinho
app.use('/api/profile', require('./routes/profile'));   // Perfil do usuário

// Rota 404 para rotas não definidas
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada.' });
});

// Inicia o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
