import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../../contexts/AuthContext";
import { useContext, type ReactNode } from "react";
import { ToastAlerta } from "../../utils/ToastAlerta";
import SearchForm from "./SearchForm";
import { ShoppingCartIcon, UserIcon } from "@phosphor-icons/react";


function Navbar() {

    const navigate = useNavigate();

    const { handleLogout, usuario } = useContext(AuthContext);

    function logout(){
        handleLogout();
        ToastAlerta('O usuário foi desconectado com sucesso!', 'info');
        navigate("/login")
    }

    let component: ReactNode;

    if(usuario.token !== ''){
        component = (<div className="w-full flex justify-center py-4 bg-indigo-900 text-white z-100">
            <div className="container flex justify-between text-lg mx-8 items-center">
                <Link to="/home">
                  <div className="flex flex-row gap-2 items-center">
                    <img src="https://ik.imagekit.io/dashen/health-svgrepo-com.svg?updatedAt=1776084804891" 
                          className="w-12" />
                    <p className="text-xl font-bold">FARMÁCIA DA GENTE</p>
                  </div>
                </Link>
                <form className="flex justify-center items-center flex-row gap-0.5">

                <SearchForm/>
                

                </form>
                <div className="flex gap-5">
                    <Link to="/categorias" className="hover:underline">Categorias</Link>
                    <Link to="/cadastrarcategoria" className="hover:underline">Cadastrar categoria</Link>
                    <Link to="/produtos" className="hover:underline">Produtos</Link>
                    <UserIcon size={32} color="#ffffff" weight="bold" />
                    <ShoppingCartIcon size={32} color="#ffffff" weight="bold" />
                    <Link to='/' onClick={logout} className="hover:underline">Sair</Link>  
                </div>
            </div>

        </div>)}


  return (
    <>

      { component }  
    
    </>
  )

}

export default Navbar;