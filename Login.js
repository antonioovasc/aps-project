import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email,
        password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      if (response.data.user.role === 'admin') {
        navigate('/admin/products');
      } else {
        navigate('/products');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao fazer login');
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const response = await axios.post('http://localhost:3001/api/auth/reset-password', {
        email: resetEmail,
        newPassword
      });
      setResetSuccess(response.data.message);
      setResetEmail('');
      setNewPassword('');
      setShowReset(false);
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao redefinir senha');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '400px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {resetSuccess && <Alert variant="success">{resetSuccess}</Alert>}

          {!showReset ? (
            <>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                  Entrar
                </Button>
              </Form>
              <div className="text-center mt-3">
                <Button variant="link" onClick={() => setShowReset(true)}>
                  Esqueceu sua conta?
                </Button>
              </div>
            </>
          ) : (
            <>
              <Form onSubmit={handlePasswordReset}>
                <Form.Group className="mb-3">
                  <Form.Label>Digite seu email</Form.Label>
                  <Form.Control
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Nova senha</Form.Label>
                  <Form.Control
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button variant="success" type="submit" className="w-100">
                  Atualizar Senha
                </Button>
                <div className="text-center mt-3">
                  <Button variant="link" onClick={() => setShowReset(false)}>
                    Voltar para login
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
