import { useContext, useEffect, useState, type ChangeEvent, type SyntheticEvent } from "react";
import { atualizar, buscar, cadastrar } from "../../../services/Service";
import { ClipLoader } from "react-spinners";
import type Categoria from "../../../models/Categoria";
import type Produto from "../../../models/Produto";
import { AuthContext } from "../../../contexts/AuthContext";
import { XIcon } from "@phosphor-icons/react";
import Modal from 'react-modal';
import { ToastAlerta } from "../../../utils/ToastAlerta";

// Tipagem das propriedades que o Modal vai receber
interface ModalFormProdutoProps {
    isOpen: boolean;
    onClose: () => void;
    produtoId?: string; // Substitui o useParams, agora o ID vem por prop
}

function FormProduto({ isOpen, onClose, produtoId }: Readonly<ModalFormProdutoProps>) {
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [produto, setProduto] = useState<Produto>({} as Produto);
    
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [categoria, setCategoria] = useState<Categoria>({} as Categoria);
    
    const { usuario } = useContext(AuthContext);
    const token = usuario.token;

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

    // Disparado sempre que o modal abre ou o produtoId muda
    useEffect(() => {
        if (isOpen) {
            buscarCategorias();

            if(produtoId !== undefined){
                buscarProdutoPorId(produtoId);
            } else {
                // Limpa o formulário caso seja um novo cadastro
                setProduto({} as Produto);
                setCategoria({} as Categoria);
            }
        }
    }, [isOpen, produtoId]);

    useEffect(() => {
        if (categoria && categoria.id) {
            setProduto(prev => ({
                ...prev,
                categoria: categoria,
            }));
        }
    }, [categoria]);

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

    async function gerarNovoProduto(e: SyntheticEvent<HTMLFormElement>){
        e.preventDefault();
        setIsLoading(true);

        const produtoPayload = {
            ...produto,
            categoria: {
                id: categoria.id || produto.categoria?.id
            }
        };

        if (produtoId !== undefined) {
            try {
                await atualizar(`/produtos/atualizar`, produtoPayload, setProduto, { headers: { Authorization: token } });
                ToastAlerta('Produto atualizado com sucesso!', "sucesso");
            } catch(error: any) {
                ToastAlerta('Erro ao atualizar o Produto.', "erro");
            }
        } else {
            try {
                await cadastrar(`/produtos/cadastrar`, produtoPayload, setProduto, { headers: { Authorization: token } });
                ToastAlerta('Produto cadastrado com sucesso!', "sucesso");
            } catch(error: any) {
                ToastAlerta('Erro ao cadastrar o Produto.', "erro");
            }
        }

        setIsLoading(false);
        onClose(); // Fecha o modal após concluir
    }

    const caravanseria = !categoria.id && !produto.categoria?.id;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Modal de Formulário de Produto"
            style={{ overlay: { zIndex: 9999 } }}
            overlayClassName="fixed inset-0 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 outline-none"
        >
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
                aria-label="Fechar"
            >
                <XIcon size={32} weight="bold" />
            </button>

            <h1 className="text-4xl text-center mb-8 font-bold text-slate-800">
                {produtoId !== undefined ? 'Editar Produto' : 'Cadastrar Produto'}
            </h1>

            <form className="flex flex-col w-full gap-4 mb-2" onSubmit={gerarNovoProduto}>
            
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    
                    <div className="flex flex-col gap-2">
                        <label htmlFor="nome" className="font-semibold text-slate-700">Nome do Produto</label>
                        <input
                            type="text" 
                            placeholder="Digite o nome"
                            name="nome"
                            required
                            className="border-2 border-slate-700 rounded-lg p-2 focus:outline-none focus:border-indigo-500"
                            value={produto.nome || ''}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="apresentacao" className="font-semibold text-slate-700">Apresentação</label>
                        <input
                            type="text" 
                            placeholder="Ex: Caixa com 60 cápsulas"
                            name="apresentacao"
                            required
                            
                            className="border-2 border-slate-700 rounded-lg p-2 focus:outline-none focus:border-indigo-500"
                            value={produto.apresentacao || ''}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="fabricante" className="font-semibold text-slate-700">Fabricante</label>
                        <input
                            type="text" 
                            placeholder="Digite o fabricante"
                            name="fabricante"
                            required
                            className="border-2 border-slate-700 rounded-lg p-2 focus:outline-none focus:border-indigo-500"
                            value={produto.fabricante || ''}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="preco" className="font-semibold text-slate-700">Preço</label>
                        <input 
                            type="number" 
                            placeholder="Digite o preço"
                            name="preco"
                            required
                            className="border-2 border-slate-700 rounded-lg p-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none focus:border-indigo-500"
                            value={produto.preco || ''}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="quantidade" className="font-semibold text-slate-700">Quantidade em Estoque</label>
                        <input 
                            type="number" 
                            placeholder="Digite a quantidade"
                            name="quantidade"
                            required
                            className="border-2 border-slate-700 rounded-lg p-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none focus:border-indigo-500"
                            value={produto.quantidade || ''}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="foto" className="font-semibold text-slate-700">Foto</label>
                        <input
                            type="text" 
                            placeholder="Insira o URL da foto"
                            name="foto"
                            required
                            className="border-2 border-slate-700 rounded-lg p-2 focus:outline-none focus:border-indigo-500"
                            value={produto.foto || ''}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <p className="font-semibold text-slate-700">Escolha uma categoria</p>
                        <select 
                            name="categoria" 
                            id="categoria" 
                            className="border-2 border-slate-700 rounded-lg p-2 focus:outline-none focus:border-indigo-500 bg-white"
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

                    <div className="flex flex-row gap-2 items-center mt-2 md:mt-8">
                        <input 
                            type="checkbox"
                            name="generico"
                            id="generico"
                            className="w-5 h-5 cursor-pointer accent-indigo-600 rounded"
                            checked={produto.generico || false} 
                            onChange={atualizarCheckbox}
                        />
                        <label htmlFor="generico" className="font-semibold text-slate-700 cursor-pointer">É genérico?</label>
                    </div>

                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label htmlFor="descricao" className="font-semibold text-slate-700">Descrição</label>
                        <textarea 
                            rows={3}
                            placeholder="Digite a descrição detalhada"
                            name="descricao"
                            required
                            className="border-2 border-slate-700 rounded-lg p-2 resize-none focus:outline-none focus:border-indigo-500"
                            value={produto.descricao || ''}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => atualizarEstado(e)}
                        />
                    </div>

                </div>

                <button 
                    type="submit"
                    className="rounded-lg disabled:bg-slate-300 disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-800 text-white font-bold w-full md:w-1/2 mx-auto mt-6 py-3 flex justify-center transition-colors"
                    disabled={caravanseria}
                >
                    { isLoading ? (
                        <ClipLoader color="#ffffff" size={24} />
                    ) : (
                        <span>{produtoId !== undefined ? 'Atualizar Produto' : 'Cadastrar Produto'}</span>
                    )}
                </button>

            </form>
        </Modal>
    );
}

export default FormProduto;