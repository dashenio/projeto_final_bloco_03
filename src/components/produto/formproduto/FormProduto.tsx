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
    
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [categoria, setCategoria] = useState<Categoria>({} as Categoria);
    
    const { usuario } = useContext(AuthContext);
    const token = usuario.token;
    const { id } = useParams<{ id: string }>();

    async function buscarProdutoPorId(id: string) {
        await buscar(`/produtos/${id}`, (dados: Produto) => {
            setProduto(dados);
            if (dados.categoria) {
                setCategoria(dados.categoria);
            }
        }, { headers: { Authorization: token } });
    }
    
    async function buscarCategoriaPorId(id: string) {
        try {
            await buscar(`/categorias/${id}`, setCategoria, { headers: { Authorization: token } });
        } catch(error: any) {
            if(error.toString().includes('401')) {
                
            }
        }
    }

    async function buscarCategorias() {
        await buscar(`/categorias/all`, setCategorias, { headers: { Authorization: token } });
    }

    useEffect(() => {
        buscarCategorias();

        if(id !== undefined){
            buscarProdutoPorId(id);
        }
    }, [id]);

    useEffect(() => {
        if (categoria && categoria.id) {
            setProduto(prev => ({
                ...prev,
                categoria: categoria,
            }));
        }
    }, [categoria]);

    // MUDANÇA: Adicionado HTMLTextAreaElement para o TypeScript aceitar a textarea sem erros
    function atualizarEstado(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value, type } = e.target;

        setProduto(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value,
            categoria: categoria, 
        }));
    }

    function atualizarCheckbox(e: ChangeEvent<HTMLInputElement>) {
        const { name, checked } = e.target;

        setProduto(prev => ({
            ...prev,
            [name]: checked,
            categoria: categoria,
        }));
    }

    function retornar(){
        navigate('/produtos');
    }

    async function gerarNovoProduto(e: SyntheticEvent<HTMLFormElement>){
        e.preventDefault();
        setIsLoading(true);

        const produtoPayload = {
            ...produto,
            categoria: {
                id: categoria.id || produto.categoria?.id
            }
        };

        if (id !== undefined) {
            try {
                await atualizar(`/produtos/atualizar`, produtoPayload, setProduto, { headers: { Authorization: token } });
                alert('Produto atualizado com sucesso!');
            } catch(error: any) {
                alert('Erro ao atualizar o Produto.');
            }
        } else {
            try {
                await cadastrar(`/produtos/cadastrar`, produtoPayload, setProduto, { headers: { Authorization: token } });
                alert('Produto cadastrado com sucesso!');
            } catch(error: any) {
                alert('Erro ao cadastrar o Produto.');
                navigate('/home');
            }
        }

        setIsLoading(false);
        retornar();
    }

    const caravanseria = !categoria.id && !produto.categoria?.id;

    return (
        <div className="container flex flex-col mx-auto items-center bg-white w-xl ">
            <h1 className="text-4xl text-center my-8">
                {id !== undefined ? 'Editar Produto' : 'Cadastrar Produto'}
            </h1>

            <form className="flex flex-col w-full gap-4 mb-8" onSubmit={gerarNovoProduto}>
            
                {/* MUDANÇA: Container Grid adicionado para dividir os inputs em duas colunas */}
                <div className="grid grid-cols-2 gap-4 w-full">
                    
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
                        <label htmlFor="apresentacao">Apresentação</label>
                        <input
                            type="text" 
                            placeholder="Ex: Caixa com 60 cápsulas"
                            name="apresentacao"
                            required
                            className="border-2 border-slate-700 rounded p-2"
                            value={produto.apresentacao || ''}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="fabricante">Fabricante</label>
                        <input
                            type="text" 
                            placeholder="Digite o fabricante"
                            name="fabricante"
                            required
                            className="border-2 border-slate-700 rounded p-2"
                            value={produto.fabricante || ''}
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
                        <label htmlFor="quantidade">Quantidade em Estoque</label>
                        <input 
                            type="number" 
                            placeholder="Digite a quantidade"
                            name="quantidade"
                            required
                            className="border-2 border-slate-700 rounded p-2 
                                      [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                                      [&::-webkit-inner-spin-button]:appearance-none"
                            value={produto.quantidade || ''}
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
                        <select 
                            name="categoria" 
                            id="categoria" 
                            className="border p-2 border-slate-800 rounded"
                            value={categoria.id || produto.categoria?.id || ''}
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

                    <div className="flex flex-row gap-2 items-center mt-2">
                        <p>É genérico?</p>
                        <input 
                            type="checkbox"
                            name="generico"
                            className="w-5 h-5 cursor-pointer"
                            checked={produto.generico || false} 
                            onChange={atualizarCheckbox}
                        />
                    </div>

                    {/* MUDANÇA: Textarea com 3 linhas e ocupando as duas colunas (col-span-2) */}
                    <div className="flex flex-col gap-2 col-span-2">
                        <label htmlFor="descricao">Descrição</label>
                        <textarea 
                            rows={3}
                            placeholder="Digite a descrição detalhada"
                            name="descricao"
                            required
                            className="border-2 border-slate-700 rounded p-2 resize-none"
                            value={produto.descricao || ''}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => atualizarEstado(e)}
                        />
                    </div>

                </div>

                <button 
                    type="submit"
                    className="rounded disabled:bg-slate-200 bg-indigo-400 hover:bg-indigo-800
                               text-white font-bold w-1/2 mx-auto mt-4 py-2 flex justify-center"
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