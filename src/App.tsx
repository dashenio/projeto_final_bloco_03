import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/home/Home";
import ListarCategorias from "./components/categoria/listarcategorias/ListarCategorias";
import ListarProdutos from "./components/produto/listarprodutos/ListarProdutos";
import Login from "./pages/login/Login";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import Perfil from "./pages/perfil/Perfil";
import { CartProvider } from "./contexts/CartContext";
import Cart from "./components/carrinho/Cart";
import Modal from 'react-modal';

Modal.setAppElement('#root');

type MenuState = 'closed' | 'open';

function App() {
  const [menuState, setMenuState] = useState<MenuState>('closed');

  const toggleMenu = (): void => {
    setMenuState(prevState => prevState === 'closed' ? 'open' : 'closed');
  };

  const closeMenu = (): void => {
    setMenuState('closed');
  };

  return (
    <>
      <AuthProvider>
        <CartProvider>
          <ToastContainer /> 
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              
              <Navbar 
                menuState={menuState}
                onMenuToggle={toggleMenu}
                onMenuClose={closeMenu}
              />
              
              <div className="flex flex-1 w-full bg-slate-200">
                <Routes>
                  <Route path="/" element={<Login />}/>
                  <Route path="/login" element={<Login />}/>
                  <Route path="/home" element={<Home />}/>
                  <Route path="/categorias" element={<ListarCategorias />}/>
                  <Route path="/perfil" element={<Perfil />}/>
                  <Route path="/produtos" element={<ListarProdutos/>}/>
                  <Route path="/cart" element={<Cart />} />
                </Routes>
              </div>
              
              <Footer />
            </div>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </>
  );      
}

export default App;