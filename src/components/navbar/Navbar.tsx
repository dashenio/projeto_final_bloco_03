import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext, useRef, type ReactNode } from "react";
import { ToastAlerta } from "../../utils/ToastAlerta";
import { CartContext } from "../../contexts/CartContext";

import { MagnifyingGlassIcon, ShoppingCartIcon, UserIcon, ListIcon, XIcon } from "@phosphor-icons/react";

type MenuState = 'closed' | 'open';

interface NavbarProps {
  menuState: MenuState;
  onMenuToggle: () => void;
  onMenuClose: () => void;
}

function Navbar({ menuState, onMenuToggle, onMenuClose }: Readonly<NavbarProps>) {

    const navigate = useNavigate();

    const { handleLogout, usuario } = useContext(AuthContext);
    const { quantidadeItems } = useContext(CartContext);

    const menuRef = useRef<HTMLDivElement>(null);

    const mostrarAdmin = ['admin'].includes(usuario.roles);

    function logout() {
        navigate("/login");   
        handleLogout();       
        ToastAlerta('O usuário foi desconectado com sucesso!', 'info');
    }

    // ✅ Função de busca reutilizada pelas duas forms
    function handleBusca(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        const valor = (e.currentTarget.elements.namedItem('busca') as HTMLInputElement).value.trim();
        if (valor) navigate(`/produtos?nome=${encodeURIComponent(valor)}`);
        else navigate('/produtos');
    }

    const handleMenuToggle = (): void => {
        onMenuToggle();
    };

    const handleMenuClose = (): void => {
        onMenuClose();
    };

    let component: ReactNode;

    if (usuario.token !== '') {
        component = (
            <>
                <div className="h-16 w-full shrink-0"></div>

                {/* NAVBAR DESKTOP & TABLET */}
                <div className="fixed top-0 left-0 z-50 flex w-full justify-between items-center px-4 md:px-8 bg-indigo-900 text-white h-16 shadow-md">
    
                    <div className="flex items-center gap-10 shrink-0">
                        <Link to="/home" onClick={handleMenuClose}>
                            <div className="flex flex-row gap-2 items-center">
                                <img src="https://ik.imagekit.io/dashen/health-svgrepo-com.svg?updatedAt=1776084804891" 
                                     alt="Logo Farmácia" className="w-10 md:w-12" />
                                <p className="text-base md:text-lg font-bold whitespace-nowrap">FARMÁCIA DA GENTE</p>
                            </div>
                        </Link>

                        <div className="hidden md:flex flex-row gap-3">
                            <Link to="/categorias" className="hover:underline text-lg">Categorias</Link>
                            <Link to="/produtos" className="hover:underline text-lg">Produtos</Link>
                        </div>
                    </div>

                    {/* ✅ Form desktop com onSubmit */}
                    <form 
                        className="hidden md:flex relative items-center w-full max-w-md mx-3"
                        onSubmit={handleBusca}
                    >
                        <div className="relative w-full flex items-center">
                            <input 
                                className="w-full h-10 pl-4 pr-12 text-black bg-white rounded-lg shadow-sm border-2 border-transparent focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 placeholder:text-slate-400 transition-all duration-200"
                                type="search" placeholder="Buscar produtos..." id="busca_desktop" name="busca"
                            />
                            <button type="submit" aria-label="Buscar"
                                className="absolute right-1 h-8 w-8 rounded-md bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm">
                                <MagnifyingGlassIcon size={18} weight="bold"/>
                            </button>
                        </div>
                    </form>
                    
                    <div className="hidden md:flex gap-5 items-center shrink-0">
                        <Link to={'/perfil'}><UserIcon size={32} color="#ffffff" weight="bold" /></Link>
                        
                        { !mostrarAdmin && (
                            <Link to="/cart" className="relative flex items-center">
                                <ShoppingCartIcon size={32} color="#ffffff" weight="bold" />
                                {quantidadeItems > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                        {quantidadeItems}
                                    </span>
                                )}
                            </Link>
                        )}
                        
                        <Link to='/login' onClick={logout} className="hover:underline text-lg">Sair</Link>  
                    </div>

                    {menuState === 'closed' && (
                      <button className="p-2 cursor-pointer md:hidden text-white hover:text-teal-400" onClick={handleMenuToggle} aria-label="Abrir menu">
                        <ListIcon size={32} weight="bold" />
                      </button>
                    )}
                </div>

                {/* OVERLAY MENU MOBILE */}
                {menuState === 'open' && (
                    <div ref={menuRef}
                         className="fixed top-0 left-0 z-100 w-full h-full bg-indigo-950 bg-opacity-95 md:hidden transition-all duration-300">
                        
                        <div className="flex flex-col p-6 text-white h-full gap-6">
                            
                            <div className="flex justify-between items-center w-full">
                                <div className="flex flex-row gap-2 items-center">
                                    <img src="https://ik.imagekit.io/dashen/health-svgrepo-com.svg?updatedAt=1776084804891" 
                                        alt="Logo Farmácia" className="w-10" />
                                    <p className="text-base font-bold">FARMÁCIA DA GENTE</p>
                                </div>
                                <button onClick={handleMenuClose} className="text-white hover:text-teal-400">
                                    <XIcon size={32} weight="bold" />
                                </button>
                            </div>

                            <form 
                                className="flex relative items-center w-full"
                                onSubmit={(e) => { handleBusca(e); handleMenuClose(); }}
                            >
                                <div className="relative w-full flex items-center">
                                    <input 
                                        className="w-full h-12 pl-4 pr-12 text-black bg-white rounded-lg shadow-sm border-2 border-transparent focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 placeholder:text-slate-400"
                                        type="search" placeholder="Buscar produtos..." id="busca_mobile" name="busca"
                                    />
                                    <button type="submit" aria-label="Buscar"
                                        className="absolute right-1 h-10 w-10 rounded-md bg-teal-500 text-white flex items-center justify-center">
                                        <MagnifyingGlassIcon size={22} weight="bold"/>
                                    </button>
                                </div>
                            </form>

                            <div className="flex flex-col gap-6 text-xl mt-4">
                                <Link to="/categorias" onClick={handleMenuClose} className="hover:text-teal-400">Categorias</Link>
                                <Link to="/produtos" onClick={handleMenuClose} className="hover:text-teal-400">Produtos</Link>
                                <Link to="/perfil" onClick={handleMenuClose} className="flex items-center gap-3 hover:text-teal-400">
                                    <UserIcon size={28} /> Perfil
                                </Link>
                                
                                { !mostrarAdmin && (
                                    <Link to="/cart" onClick={handleMenuClose} className="flex items-center gap-3 hover:text-teal-400">
                                        <div className="relative">
                                            <ShoppingCartIcon size={28} />
                                            {quantidadeItems > 0 && (
                                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                                    {quantidadeItems}
                                                </span>
                                            )}
                                        </div>
                                        Meu Carrinho
                                    </Link>
                                )}
                            </div>

                            <div className="mt-auto pb-4">
                                <button onClick={() => { logout(); handleMenuClose(); }} className="text-xl text-red-400 font-bold hover:text-red-300">
                                    Sair da conta
                                </button>
                            </div>

                        </div>
                    </div>
                )}
            </>
        );
    }

    return (
        <>
            { component }
        </>
    );
}

export default Navbar;