import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Container
} from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { formatPrice, ensureNumber } from '../utils/format';

const AdminProductManager = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Garantir que os preços sejam números
      const productsWithNumberPrice = response.data.map(product => ({
        ...product,
        price: ensureNumber(product.price)
      }));
      setProducts(productsWithNumberPrice);
    } catch (error) {
      setError('Erro ao carregar produtos');
    }
  };

  const handleShowModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        image: null
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        image: null
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      image: null
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', ensureNumber(formData.price));
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      if (editingProduct) {
        await axios.put(
          `http://localhost:3001/api/products/${editingProduct.id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      } else {
        await axios.post(
          'http://localhost:3001/api/products',
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      handleCloseModal();
      fetchProducts();
    } catch (error) {
      setError('Erro ao salvar produto');
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3001/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProducts();
      } catch (error) {
        setError('Erro ao excluir produto');
      }
    }
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Produtos</h2>
        <Button variant="primary" onClick={() => handleShowModal()}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Novo Produto
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table responsive>
        <thead>
          <tr>
            <th>Imagem</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Preço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <img
                  src={`http://localhost:3001/uploads/${product.image}`}
                  alt={product.name}
                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                />
              </td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>R$ {formatPrice(product.price)}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleShowModal(product)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProduct ? 'Editar Produto' : 'Novo Produto'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Preço</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Imagem</Form.Label>
              <Form.Control
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                required={!editingProduct}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Salvar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminProductManager; 