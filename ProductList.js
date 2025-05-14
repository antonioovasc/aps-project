import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Modal, Form, Alert, InputGroup, FormControl } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faSearch } from '@fortawesome/free-solid-svg-icons';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/products');
      const productsWithNumberPrice = response.data.map(product => ({
        ...product,
        price: Number(product.price)
      }));
      setProducts(productsWithNumberPrice);
    } catch (error) {
      setError('Erro ao carregar produtos');
    }
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:3001/api/cart/add',
        {
          productId: selectedProduct.id,
          quantity: parseInt(quantity)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setShowModal(false);
      setQuantity(1);
    } catch (error) {
      setError('Erro ao adicionar ao carrinho');
    }
  };

  const formatPrice = (price) => {
    const numericPrice = Number(price);
    return isNaN(numericPrice) ? '0.00' : numericPrice.toFixed(2);
  };

  // Filtro de produtos pelo nome
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  
  return (
    <div className="container mt-4">

      
      <InputGroup className="mb-3 mt-3">
        <InputGroup.Text>
          <FontAwesomeIcon icon={faSearch} />
        </InputGroup.Text>
        <FormControl
          placeholder="Buscar produto por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>

      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Col key={product.id} md={4} className="mb-4">
              <Card>
                <Card.Img
                  variant="top"
                  src={`http://localhost:3001/uploads/${product.image}`}
                  alt={product.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>{product.description}</Card.Text>
                  <Card.Text className="h5 text-primary">
                    R$ {formatPrice(product.price)}
                  </Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowModal(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                    Adicionar ao Carrinho
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-muted mt-4">Nenhum produto encontrado.</p>
        )}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Adicionar ao Carrinho</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Quantidade</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAddToCart}>
            Adicionar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductList;
