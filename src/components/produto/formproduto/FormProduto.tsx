import { useContext, useEffect, useState, type ChangeEvent, type SyntheticEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { atualizar, buscar, cadastrar } from "../../../services/Service";
import { ClipLoader } from "react-spinners";
import type Categoria from "../../../models/Categoria";
import type Produto from "../../../models/Produto";
import { AuthContext } from "../../../contexts/AuthContext";

function FormProduto() {
    const navigate = useNavigate();
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [produto, setProduto] = useState<Produto>({} as Produto);
    
    // CORREÇÃO: Separados os estados de lista (Array) e item selecionado (Objeto)
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [categoria, setCategoria] = useState<Categoria>({} as Categoria);
    
    const { usuario } = useContext(AuthContext);
    const token = usuario.token;
    const { id } = useParams<{ id: string }>();

    async function buscarProdutoPorId(id: string) {
        await buscar(`/produtos/${id}`, setProduto, { headers: { Authorization: token } });
    }
    
    async function buscarCategoriaPorId(id: string) {
        try {
            // CORREÇÃO: Alinhado para setFolder/setCategoria no singular para o objeto do ID
            await buscar(`/categorias/${id}`, setCategoria, { headers: { Authorization: token } });
        } catch(error: any) {
            if(error.toString().includes('401')) {
                // Tratamento de erro mantido original
            }
        }
    }

    async function buscarCategorias() {
        // CORREÇÃO: Alinhado para setCategorias no plural para receber o Array do backend
        await buscar(`/categorias/all`, setCategorias, { headers: { Authorization: token } });
    }

    useEffect(() => {
        buscarCategorias();

        if(id !== undefined){
            buscarProdutoPorId(id);
        }
    }, [id]);

    // CORREÇÃO: Monitora o estado correto (singular) e injeta no produto
    useEffect(() => {
        setProduto(prev => ({
            ...prev,
            categoria: categoria,
        }));
    }, [categoria]);

    function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
        const { name, value, type } = e.target;

        setProduto(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value,
            categoria: categoria, // CORREÇÃO: Vincula a categoria atualizada
        }));
    }

    function retornar(){
        navigate('/produtos');
    }

    async function gerarNovoProduto(e: SyntheticEvent<HTMLFormElement>){
        e.preventDefault();
        setIsLoading(true);

        if (id !== undefined) {
            try {
                await atualizar(`/produtos/atualizar`, produto, setProduto, { headers: { Authorization: token } });
                alert('Produto updated com sucesso!');
            } catch(error: any) {
                alert('Erro ao atualizar o Produto.');
            }
        } else {
            try {
                await cadastrar(`/produtos/cadastrar`, produto, setProduto, { headers: { Authorization: token } });
                alert('Produto cadastrado com sucesso!');
            } catch(error: any) {
                alert('Erro ao cadastrar o Produto.');
            }
        }

        setIsLoading(false);
        retornar();
    }

    // CORREÇÃO: Valida baseado na propriedade do objeto individual selecionado
    const caravanseria = categoria.tipo === '';

    return (
        <div className="container flex flex-col mx-auto items-center bg-white w-xl ">
            <h1 className="text-4xl text-center my-8">
                {id !== undefined ? 'Editar Produto' : 'Cadastrar Produto'}
            </h1>

            <form className="flex flex-col w-1/2 gap-4 mb-8" onSubmit={gerarNovoProduto}>
            
                <div className="flex flex-col gap-2">
                    <label htmlFor="nome">Nome do Produto</label>
                    <input
                        type="text" 
                        placeholder="Digite o nome"
                        name="nome"
                        required
                        className="border-2 border-slate-700 rounded p-2"
                        value={produto.nome || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="preco">Preço</label>
                    <input 
                        type="number" 
                        placeholder="Digite o preço"
                        name="preco"
                        required
                        className="border-2 border-slate-700 rounded p-2 
                                  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                                  [&::-webkit-inner-spin-button]:appearance-none"
                        value={produto.preco || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="foto">Foto</label>
                    <input
                        type="text" 
                        placeholder="Insira o URL da foto"
                        name="foto"
                        required
                        className="border-2 border-slate-700 rounded p-2"
                        value={produto.foto || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <p>Escolha uma categoria</p>
                    {/* CORREÇÃO: Mapeia a lista 'categorias' e vincula o valor selecionado */}
                    <select 
                        name="categoria" 
                        id="categoria" 
                        className="border p-2 border-slate-800 rounded"
                        value={produto.categoria?.id || ''}
                        onChange={(e) => buscarCategoriaPorId(e.currentTarget.value)}
                    >
                        <option value="" disabled>Selecione uma Categoria</option>

                        {categorias.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.tipo}
                            </option>
                        ))}
                    </select>
                </div>
                <button 
                    type="submit"
                    className="rounded disabled:bg-slate-200 bg-indigo-400 hover:bg-indigo-800
                               text-white font-bold w-1/2 mx-auto py-2 flex justify-center"
                    disabled={caravanseria}
                >
                    { isLoading ? (
                        <ClipLoader color="#ffffff" size={24} />
                    ) : (
                        <span>{id === undefined ? 'Cadastrar' : 'Atualizar'}</span>
                    )}
                </button>

            </form>
        </div>
    );
}

export default FormProduto;