import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../../contexts/AuthContext";
import { useContext, type ReactNode } from "react";
import { ToastAlerta } from "../../utils/ToastAlerta";

import { MagnifyingGlassIcon, ShoppingCartIcon, UserIcon } from "@phosphor-icons/react";


function Navbar() {

    const navigate = useNavigate();

    const { handleLogout, usuario } = useContext(AuthContext);

    const mostrar = ['admin'].includes(usuario.roles);

    function logout(){
        handleLogout();
        ToastAlerta('O usuário foi desconectado com sucesso!', 'info');
        navigate("/login")
    }

    let component: ReactNode;

    if(usuario.token !== ''){
       
        component = (
                    <div className="flex flex-row w-full justify-between items-center text-lg px-8 py-5 bg-indigo-900 text-white">
    
                        {/* Bloco da Esquerda: Agrupa a Logo E os links que você pediu juntos */}
                        <div className="flex items-center gap-10 shrink-0 mx-2">
                            <Link to="/home">
                                <div className="flex flex-row gap-2 items-center">
                                    <img src="https://ik.imagekit.io/dashen/health-svgrepo-com.svg?updatedAt=1776084804891" 
                                        className="w-12" />
                                    <p className="text-lg font-bold whitespace-nowrap">FARMÁCIA DA GENTE</p>
                                </div>
                            </Link>

                            <div className="flex flex-row gap-3">
                                {/* Mudança: Links trazidos para o lado esquerdo junto com a logo */}
                                <Link to="/categorias" className="hover:underline">Categorias</Link>
                                {mostrar && (
                                    <Link to="/cadastrarcategoria" className="hover:underline">Cadastrar categoria</Link>
                                )}
                                <Link to="/produtos" className="hover:underline">Produtos</Link>
                            </div>
                        </div>

                        {/* Bloco do Centro: A barra de pesquisa (Estilização 100% original, apenas limitada para não esmagar os lados) */}
                        <form className="flex relative items-center w-full max-w-md mx-3">
                            <div className="relative w-full flex items-center">
                                <input 
                                    className="w-full h-10 pl-4 pr-12 text-black bg-white rounded-lg shadow-sm
                                            border-2 border-transparent
                                            focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20
                                            placeholder:text-slate-400
                                            transition-all duration-200"
                                    type="search"
                                    placeholder="Buscar produtos..."
                                    id="busca"
                                    name="busca"
                                />
                                <button 
                                    type="submit" 
                                    className="absolute right-1 h-8 w-8 rounded-md
                                            bg-teal-500 hover:bg-teal-600 active:bg-teal-700
                                            text-white 
                                            flex items-center justify-center
                                            transition-all duration-200
                                            hover:scale-105 active:scale-95
                                            shadow-sm hover:shadow-md"
                                    aria-label="Buscar"
                                >
                                    <MagnifyingGlassIcon size={18} weight="bold"/>
                                </button>
                            </div>
                        </form>
                        
                        {/* Bloco da Direita: Apenas os ícones e a opção de Sair */}
                        <div className="flex gap-5 items-center shrink-0 mr-4">
                            <UserIcon size={32} color="#ffffff" weight="bold" />
                            { !mostrar && (<ShoppingCartIcon size={32} color="#ffffff" weight="bold" />)}
                            <Link to='/login' onClick={logout} className="hover:underline">Sair</Link>  
                        </div>
                    </div>)}


  return (
    <>

      { component }  
    
    </>
  )

}

export default Navbar;