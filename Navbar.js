import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const Navigation = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')); // Lê o usuário atualizado do localStorage

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Bem-vindo ao Big Burguer</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user ? (
              <>
                <Nav.Link as={Link} to="/products">Cardápio</Nav.Link>
                <Nav.Link as={Link} to="/cart">
                  <FontAwesomeIcon icon={faShoppingCart} className="me-1" />
                  Carrinho
                </Nav.Link>

                {user.role === 'admin' && (
                  <>
                    <Nav.Link as={Link} to="/admin/products">
                      Adicionar Produtos
                    </Nav.Link>
                    <Nav.Link as={Link} to="/admin/orders">
                      Gerenciar Pedidos
                    </Nav.Link>
                  </>
                )}

                <Nav.Link as={Link} to="/profile">
                  Meu Perfil
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Registrar</Nav.Link>
              </>
            )}
          </Nav>

          {user && (
            <Nav>
              <Navbar.Text className="me-3">
                Olá, {user.name} {/* Exibe o nome atualizado */}
              </Navbar.Text>
              <Button variant="outline-light" onClick={handleLogout}>
                Sair
              </Button>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
