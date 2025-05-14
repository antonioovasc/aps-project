import React, { useState, useEffect } from 'react';
import {
  Container,
  Table,
  Button,
  Alert,
  Form
} from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [cardData, setCardData] = useState({
    cardName: '',
    cardNumber: '',
    cardCVV: ''
  });
  const [paymentCompleted, setPaymentCompleted] = useState(false); // Para mostrar mensagem de agradecimento

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const itemsWithNumberPrice = response.data.map(item => ({
        ...item,
        price: Number(item.price)
      }));
      setCartItems(itemsWithNumberPrice);
      calculateTotal(itemsWithNumberPrice);
    } catch (error) {
      setError('Erro ao carregar itens do carrinho');
    }
  };

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
    setTotal(sum);
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:3001/api/cart/update/${productId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCartItems();
    } catch (error) {
      setError('Erro ao atualizar quantidade');
    }
  };

  const handleRemoveItem = async (productId, currentQuantity) => {
    try {
      const token = localStorage.getItem('token');
      if (currentQuantity > 1) {
        await axios.put(
          `http://localhost:3001/api/cart/update/${productId}`,
          { quantity: currentQuantity - 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.delete(`http://localhost:3001/api/cart/remove/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchCartItems();
    } catch (error) {
      setError('Erro ao remover item do carrinho');
    }
  };

  const handleClearCart = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:3001/api/cart/clear', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems([]);  // Limpa o estado do carrinho
      setTotal(0);  // Zera o total
    } catch (error) {
      setError('Erro ao limpar carrinho');
    }
  };

  const handleCheckout = () => {
    setShowPaymentForm(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    // Aqui você pode simular a finalização do pagamento
    try {
      // Limpa o carrinho após a compra
      await handleClearCart();
      
      // Exibe a mensagem de agradecimento
      setPaymentCompleted(true);
      setShowPaymentForm(false); // Esconde o formulário após pagamento
    } catch (error) {
      setError('Erro ao processar pagamento');
    }
  };

  const formatPrice = (price) => {
    const numericPrice = Number(price);
    return isNaN(numericPrice) ? '0.00' : numericPrice.toFixed(2);
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (value.length <= 16) {
      // Formata com espaços a cada 4 dígitos
      value = value.replace(/(\d{4})(\d{1,4})/, '$1 $2');
      value = value.replace(/(\d{4})(\d{1,4})(\d{1,4})/, '$1 $2 $3');
      value = value.replace(/(\d{4})(\d{1,4})(\d{1,4})(\d{1,4})/, '$1 $2 $3 $4');
      setCardData({ ...cardData, cardNumber: value });
    }
  };

  const handleCardNameChange = (e) => {
    const value = e.target.value.slice(0, 22); // Limita a 22 caracteres
    setCardData({ ...cardData, cardName: value });
  };

  const handleCardCVVChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3); // Aceita apenas números e limita a 3 dígitos
    setCardData({ ...cardData, cardCVV: value });
  };

  if (cartItems.length === 0 && !paymentCompleted) {
    return (
      <Container className="mt-5 text-center">
        <FontAwesomeIcon icon={faShoppingCart} size="3x" className="mb-3" />
        <h3>Seu carrinho está vazio</h3>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <FontAwesomeIcon icon={faShoppingCart} size="3x" className="mb-3" />
      
      {error && <Alert variant="danger">{error}</Alert>}

      {paymentCompleted && (
        <Alert variant="success" className="mt-3">
          <h4>Obrigado por comprar no Big Burger! Aguarde sua entrega.</h4>
        </Alert>
      )}

      {/* Exibe o carrinho somente se o pagamento não foi concluído */}
      {!paymentCompleted && (
        <>
          <Table responsive>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Preço</th>
                <th>Quantidade</th>
                <th>Subtotal</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.product_id}>
                  <td>{item.name}</td>
                  <td>R$ {formatPrice(item.price)}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.product_id, parseInt(e.target.value))}
                      className="form-control"
                      style={{ width: '80px' }}
                    />
                  </td>
                  <td>R$ {formatPrice(item.price * item.quantity)}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveItem(item.product_id, item.quantity)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <div>
              <h4>Total: R$ {formatPrice(total)}</h4>
              <Button variant="danger" onClick={handleClearCart}>
                Limpar Carrinho
              </Button>
            </div>
            <Button variant="success" onClick={handleCheckout}>
              Pagamento
            </Button>
          </div>
        </>
      )}

      {showPaymentForm && (
        <div className="mt-4 p-4 border rounded">
          <h4>Forma de Pagamento</h4>
          <Form onSubmit={handlePaymentSubmit}>
            <Form.Group controlId="paymentMethod">
              <Form.Label>Tipo de pagamento</Form.Label>
              <Form.Control
                as="select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="credit">Crédito</option>
                <option value="debit">Débito</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="cardName">
              <Form.Label>Nome no cartão</Form.Label>
              <Form.Control
                type="text"
                value={cardData.cardName}
                onChange={handleCardNameChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="cardNumber">
              <Form.Label>Número do cartão</Form.Label>
              <Form.Control
                type="text"
                value={cardData.cardNumber}
                onChange={handleCardNumberChange}
                maxLength="19" // Para acomodar a formatação com espaços
                required
              />
            </Form.Group>

            <Form.Group controlId="cardCVV">
              <Form.Label>CVV</Form.Label>
              <Form.Control
                type="text"
                value={cardData.cardCVV}
                onChange={handleCardCVVChange}
                maxLength="3"
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Confirmar Pagamento
            </Button>
          </Form>
        </div>
      )}
    </Container>
  );
};

export default Cart;
