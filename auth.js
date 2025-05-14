const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verifica o token com a chave secreta
    req.user = decoded;  // Anexa os dados do usuário no req
    next();
  } catch (error) {
    res.status(401).json({ message: 'Por favor, faça login' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();  // Permite o acesso se o usuário for administrador
  } else {
    res.status(403).json({ message: 'Acesso negado. Apenas administradores podem acessar este recurso.' });
  }
};

module.exports = { auth, isAdmin };