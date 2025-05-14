import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navigation from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import ProductList from './components/ProductList';
import AdminProductManager from './components/AdminProductManager';
import Cart from './components/Cart';
import Profile from './components/Profile';  // Importando o Profile
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <ProductList />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <PrivateRoute adminOnly>
              <AdminProductManager />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"  // A rota para o perfil
          element={
            <PrivateRoute>
              <Profile />  {/* O componente que exibe o perfil do usuário */}
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/products" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
