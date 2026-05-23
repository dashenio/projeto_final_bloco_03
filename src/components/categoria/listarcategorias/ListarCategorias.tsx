import { useContext, useEffect, useState } from "react";
import type Categoria from "../../../models/Categoria";
import { buscar } from "../../../services/Service";
import { SyncLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import CardNova from "../cardnova/CardNova";
import FormCategoria from "../formcategoria/FormCategoria";
import CardCategoria from "../cardcategoria/CardCategoria";
import DeletarCategoria from "../deletarcategoria/DeletarCategoria"; // ✅ Import adicionado

function ListarCategorias() {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [categorias, setCategorias] = useState<Categoria[]>([]);

    const { usuario, handleLogout, isHydrated } = useContext(AuthContext);
    const token = usuario.token;
    
    const isAdmin = usuario.roles === "admin";
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoriaEditandoId, setCategoriaEditandoId] = useState<string | undefined>(undefined);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoriaDeletandoId, setCategoriaDeletandoId] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (!isHydrated) return;
        if (token === '') {
            navigate('/');
        }
    }, [token, isHydrated]);   
  
    useEffect(() => {
        if (!isHydrated) return;
        buscarCategorias();
    }, [isHydrated]);

    async function buscarCategorias(){
        setIsLoading(true);
        try{
            await buscar('/categorias/all', setCategorias, {
                headers: { Authorization: token }
            });
        } catch(error: any) {
            if (error.toString().includes('401')) {
                handleLogout();
            }
        } finally {
            setIsLoading(false);
        }
    }

    // Funções do Modal de Criação/Edição
    function abrirModalNovo() {
        setCategoriaEditandoId(undefined);
        setIsModalOpen(true);
    }

    function abrirModalEdicao(id: string) {
        setCategoriaEditandoId(id);
        setIsModalOpen(true);
    }

    function fecharModal() {
        setIsModalOpen(false);
        buscarCategorias();
    }

    // ✅ Funções do Modal de Deleção
    function abrirModalDelecao(id: string) {
        setCategoriaDeletandoId(id);
        setIsDeleteModalOpen(true);
    }

    function fecharModalDelecao() {
        setIsDeleteModalOpen(false);
        setCategoriaDeletandoId(undefined);
        buscarCategorias(); // Atualiza a lista ao fechar
    }
 
    return (
    <>
        {/* Modal de Criação/Edição */}
        <FormCategoria 
            isOpen={isModalOpen} 
            onClose={fecharModal} 
            categoriaId={categoriaEditandoId} 
        />

        {/* Modal de Deleção */}
        <DeletarCategoria
            isOpen={isDeleteModalOpen}
            onClose={fecharModalDelecao}
            categoriaId={categoriaDeletandoId}
        />
       
        <div className="w-full my-4 flex justify-center">
            
            <div className="container mx-auto px-4 flex flex-col">

                <h1 className="text-4xl font-bold text-center text-slate-800 my-6">
                    Categorias
                </h1>
                
                {isLoading && (
                    <div className="flex justify-center w-full my-8">
                        <SyncLoader color="#312e81" size={32} />
                    </div>
                )}
                
                {(!isLoading && (!categorias || categorias.length === 0)) && (
                    <div className="flex flex-col items-center gap-8 my-8 w-full">
                        <span className="text-3xl text-center font-bold text-slate-700">
                            Nenhuma categoria foi encontrada!
                        </span>
                        
                        {isAdmin && (
                            <div className="w-full max-w-sm">
                                <CardNova onClick={abrirModalNovo} />
                            </div>
                        )}
                    </div>
                )}

                {(!isLoading && categorias && categorias.length > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mt-8">
                        
                        {isAdmin && <CardNova onClick={abrirModalNovo} />}
                        
                        {categorias.map((categoria) => (
                            <CardCategoria 
                                key={categoria.id} 
                                categoria={categoria}
                                onEditar={abrirModalEdicao}
                                onDeletar={abrirModalDelecao} // ✅ Agora a função existe!
                            />
                        ))}
                    </div>
                )}
                
            </div>
        </div>
    </>
  )
}

export default ListarCategorias;