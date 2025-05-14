const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Rota de login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [userResult] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

    if (userResult.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const validPassword = await bcrypt.compare(password, userResult[0].password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: userResult[0].id, role: userResult[0].role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: userResult[0].id,
        name: userResult[0].name,
        email: userResult[0].email,
        role: userResult[0].role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Rota de redefinir senha
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email e nova senha são obrigatórios' });
    }

    const [userResult] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

    if (userResult.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.promise().query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);

    res.json({ message: 'Senha atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Rota de registro
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const [existingUser] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    const [existingPhone] = await db.promise().query('SELECT * FROM users WHERE phone = ?', [phone]);

    if (existingPhone.length > 0) {
      return res.status(400).json({ message: 'Telefone já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.promise().query(
      'INSERT INTO users (name, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone, address, 'user']
    );

    res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

module.exports = router;
