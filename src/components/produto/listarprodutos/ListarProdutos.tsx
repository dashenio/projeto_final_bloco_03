import { useContext, useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import { buscar } from "../../../services/Service";
import CardProduto from "../cardproduto/CardProduto";
import type Produto from "../../../models/Produto";
import { useNavigate, useSearchParams } from "react-router-dom"; // ✅
import { AuthContext } from "../../../contexts/AuthContext";
import CardNovoP from "../cardnovop/CardNovoP";
import FormProduto from "../formproduto/FormProduto";
import DeletarProduto from "../deletarproduto/DeletarProduto";

function ListarProdutos() {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const nomeBuscado = searchParams.get('nome');
    const categoriaIdFiltro = searchParams.get('categoriaId'); // ✅

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [produtos, setProdutos] = useState<Produto[]>([]);

    const { usuario, handleLogout, isHydrated } = useContext(AuthContext);
    const token = usuario.token;
    
    const isAdmin = usuario.roles === "admin";

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [produtoEditandoId, setProdutoEditandoId] = useState<string | undefined>(undefined);

    const [isModalDeletarOpen, setIsModalDeletarOpen] = useState(false);
    const [produtoDeletandoId, setProdutoDeletandoId] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (!isHydrated) return;
        if (token === '') navigate('/');
    }, [token, isHydrated]);

    useEffect(() => {
        if (!isHydrated) return;
        buscarProdutos();
    }, [isHydrated, nomeBuscado, categoriaIdFiltro]); // ✅ reage ao filtro de categoria também

    async function buscarProdutos() {
        setIsLoading(true);
        try {
            const url = nomeBuscado
                ? `/produtos/nome/${encodeURIComponent(nomeBuscado)}`
                : '/produtos/all';

            await buscar(url, setProdutos, {
                headers: { Authorization: token }
            });
        } catch (error: any) {
            if (error.toString().includes('401')) handleLogout();
        } finally {
            setIsLoading(false);
        }
    }

    // ✅ Filtra client-side se houver categoriaId na URL
    const produtosExibidos = categoriaIdFiltro
        ? produtos.filter(p => String(p.categoria?.id) === categoriaIdFiltro)
        : produtos;

    // ✅ Nome da categoria para exibir no título
    const nomeCategoria = categoriaIdFiltro && produtosExibidos.length > 0
        ? produtosExibidos[0].categoria?.tipo
        : null;

    function abrirModalNovo() {
        setProdutoEditandoId(undefined);
        setIsModalOpen(true);
    }

    function abrirModalEdicao(id: string) {
        setProdutoEditandoId(id);
        setIsModalOpen(true);
    }

    function fecharModal() {
        setIsModalOpen(false);
        buscarProdutos();
    }

    function abrirModalDelecao(id: string) {
        setProdutoDeletandoId(id);
        setIsModalDeletarOpen(true);
    }

    function fecharModalDelecao() {
        setIsModalDeletarOpen(false);
        buscarProdutos(); 
    }

    // ✅ Filtro ativo = sem card "criar novo" e sem botões de admin nos resultados
    const filtroAtivo = !!(nomeBuscado || categoriaIdFiltro);

    return (
        <>
            <FormProduto 
                isOpen={isModalOpen} 
                onClose={fecharModal} 
                produtoId={produtoEditandoId} 
            />
            <DeletarProduto 
                isOpen={isModalDeletarOpen} 
                onClose={fecharModalDelecao} 
                produtoId={produtoDeletandoId} 
            />

            <div className="w-full my-4 flex justify-center">
                <div className="container mx-auto px-4 flex flex-col">

                    {/* ✅ Título dinâmico para os três estados */}
                    <h1 className="text-4xl font-bold text-center text-slate-800 my-6">
                        {nomeBuscado
                            ? `Resultados para "${nomeBuscado}"`
                            : nomeCategoria
                                ? `Categoria: ${nomeCategoria}`
                                : 'Produtos'}
                    </h1>

                    {isLoading && (
                        <div className="flex justify-center w-full my-8">
                            <SyncLoader color="#312e81" size={32} />
                        </div>
                    )}
                    
                    {(!isLoading && produtosExibidos.length === 0) && (
                        <div className="flex flex-col items-center gap-8 my-8 w-full">
                            <span className="text-3xl text-center font-bold text-slate-700">
                                Nenhum produto foi encontrado!
                            </span>
                            {isAdmin && !filtroAtivo && (
                                <div className="w-full max-w-sm" onClick={abrirModalNovo}>
                                    <CardNovoP />
                                </div>
                            )}
                        </div>
                    )}

                    {(!isLoading && produtosExibidos.length > 0) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mt-8">
                            
                            {isAdmin && !filtroAtivo && ( // ✅ Oculta durante filtros
                                <div onClick={abrirModalNovo}>
                                    <CardNovoP />
                                </div>
                            )}
                            
                            {produtosExibidos.map((produto) => (
                                <CardProduto 
                                    key={produto.id} 
                                    produto={produto}
                                    onEditar={abrirModalEdicao} 
                                    onDeletar={abrirModalDelecao}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default ListarProdutos;