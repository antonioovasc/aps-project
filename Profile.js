import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Spinner, Alert, Form, Button, Row, Col } from 'react-bootstrap';

const Profile = () => {
  const [userInfo, setUserInfo] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserInfo(response.data);
        setFormData(response.data);
      } catch (err) {
        setError('Erro ao carregar perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:3001/api/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      setUserInfo(response.data);
      setFormData(response.data);

      setSuccess('Perfil atualizado com sucesso!');
      setEditMode(false);
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err.response?.data || err.message);
      setError('Erro ao atualizar perfil');
    }
  };
  

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Card className="mt-4 p-4">
      <h2>Meu Perfil</h2>

      {success && <Alert variant="success">{success}</Alert>}

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={editMode ? formData.name : userInfo.name}
            onChange={handleChange}
            disabled={!editMode}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={editMode ? formData.email : userInfo.email}
            onChange={handleChange}
            disabled={!editMode}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Telefone</Form.Label>
          <Form.Control
            type="text"
            name="phone"
            value={editMode ? formData.phone : userInfo.phone}
            onChange={handleChange}
            disabled={!editMode}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Endereço</Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={editMode ? formData.address : userInfo.address}
            onChange={handleChange}
            disabled={!editMode}
          />
        </Form.Group>

        <Row className="mt-3">
          <Col>
            {!editMode ? (
              <Button onClick={() => setEditMode(true)}>Editar</Button>
            ) : (
              <>
                <Button variant="success" onClick={handleSave} className="me-2">
                  Salvar
                </Button>
                <Button variant="secondary" onClick={() => {
                  setFormData(userInfo);
                  setEditMode(false);
                }}>
                  Cancelar
                </Button>
              </>
            )}
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default Profile;
