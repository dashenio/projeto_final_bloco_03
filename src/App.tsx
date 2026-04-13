
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Footer from "./components/footer/Footer"
import Navbar from "./components/navbar/Navbar"
import Home from "./pages/home/Home"
import ListarCategorias from "./components/categoria/listarcategorias/ListarCategorias"
import FormCategoria from "./components/categoria/formcategoria/FormCategoria"
import DeletarCategoria from "./components/categoria/deletarcategoria/DeletarCategoria"


function App() {
  return (
    <>
   <BrowserRouter>
   
    <div className="min-h-screen flex flex-col">
        <Navbar />
         <div className="flex flex-1">
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/home" element={<Home />}/>
            <Route path="/categorias" element={<ListarCategorias />}/>
            <Route path="/cadastrarcategoria" element={<FormCategoria/>}/>
            <Route path="/editarcategoria/:id" element={<FormCategoria/>}/>
            <Route path="/deletarcategoria/:id" element={<DeletarCategoria/>}/>            
          </Routes>
        </div>
        <Footer />
      </div>
      </BrowserRouter>
    
    </>
  
  
  )      
}

export default App