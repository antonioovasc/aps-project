const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Rota para obter dados do perfil do usuário autenticado
router.get('/', auth, (req, res) => {
  const userId = req.user.id;

  const query = 'SELECT id, name, email, phone, address FROM users WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Erro ao buscar perfil:', err);
      return res.status(500).json({ message: 'Erro ao buscar informações do perfil.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    res.json(results[0]);
  });
});

// Rota para atualizar dados do perfil do usuário autenticado
router.put('/', auth, (req, res) => {
  const userId = req.user.id;
  const { name, email, phone, address } = req.body;

  const query = 'UPDATE users SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?';
  db.query(query, [name, email, phone, address, userId], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar perfil:', err);
      return res.status(500).json({ message: 'Erro ao atualizar perfil.' });
    }

    // Após atualização, retorna os dados atualizados
    const selectQuery = 'SELECT id, name, email, phone, address FROM users WHERE id = ?';
    db.query(selectQuery, [userId], (err, results) => {
      if (err) {
        console.error('Erro ao buscar perfil atualizado:', err);
        return res.status(500).json({ message: 'Erro ao retornar dados atualizados.' });
      }

      res.json(results[0]);
    });
  });
});

module.exports = router;
