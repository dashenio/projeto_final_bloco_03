import { useContext, useEffect, useState } from "react";
import { buscar, deletar } from "../../../services/Service";
import { ClipLoader } from "react-spinners";
import type Produto from "../../../models/Produto";
import { AuthContext } from "../../../contexts/AuthContext";
import Modal from 'react-modal';
import { XIcon } from "@phosphor-icons/react";

// Tipagem das propriedades que o Modal vai receber
interface ModalDeletarProdutoProps {
    isOpen: boolean;
    onClose: () => void;
    produtoId?: string; 
}

function DeletarProduto({ isOpen, onClose, produtoId }: Readonly<ModalDeletarProdutoProps>) {
  
    const [produto, setProduto] = useState<Produto>({} as Produto)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { usuario } = useContext(AuthContext);
    const token = usuario.token;

    async function buscarPorId(id: string) {
        await buscar(`/produtos/${id}`, setProduto, { headers: { Authorization: token } });
    }    

    // Busca o produto apenas se o modal estiver aberto e houver um ID
    useEffect(() => {
        if(isOpen && produtoId !== undefined){
            buscarPorId(produtoId)
        }
    }, [isOpen, produtoId])
    
    async function deletarProduto(){
        setIsLoading(true)

        try{
            await deletar(`/produtos/${produtoId}`, { headers: { Authorization: token } });
            alert('Produto apagado com sucesso.')
        }catch(error: any){
            alert('Erro ao deletar Produto.')
        }
        
        setIsLoading(false)
        onClose() // Fecha o modal após deletar
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Modal de Deletar Produto"
            style={{ overlay: { zIndex: 9999 } }}
            overlayClassName="fixed inset-0 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden p-8 outline-none"
        >
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
                aria-label="Fechar"
            >
                <XIcon size={32} weight="bold" />
            </button>

            <div className="flex flex-col items-center w-full mt-2"> 
               
                <h1 className="text-3xl font-bold text-slate-800 mb-4">Deletar Produto</h1>
                <p className="font-semibold mb-6 text-center text-lg text-slate-700">
                    Você tem certeza de que deseja apagar o produto a seguir?
                </p>

                <div className='flex flex-col rounded-lg overflow-hidden border border-slate-300 items-center p-6 bg-slate-50 w-full'>   
                    
                    <div className="flex flex-col items-center gap-4">
                        <img 
                            src={produto.foto}
                            alt={produto.nome}
                            className='w-32 object-contain rounded' 
                        />
                        
                        <div className='flex flex-col items-center gap-2 text-slate-800'>
                            <h3 className='text-2xl font-bold text-center'>{produto.nome}</h3>
                            <p className="text-lg">
                                <span className='font-bold'>Preço: </span>
                                {new Intl.NumberFormat("pt-BR", {
                                    style: 'currency',
                                    currency: 'BRL',
                                }).format(produto.preco)}
                            </p>
                            <p className="text-lg"><span className='font-bold'>Categoria: </span>{produto.categoria?.tipo}</p>
                        </div>
                    </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex w-full gap-4 mt-6">
                    <button 
                        className="text-slate-700 font-bold bg-slate-200 hover:bg-slate-300 rounded-lg w-full py-3 transition-colors" 
                        onClick={onClose}
                    >
                        Não, cancelar
                    </button>
                    <button 
                        className="text-white font-bold bg-red-500 hover:bg-red-700 rounded-lg w-full py-3 flex justify-center transition-colors" 
                        onClick={deletarProduto}
                    >
                        {
                            isLoading ?
                                <ClipLoader color="#ffffff" size={24} />
                            :
                                <span>Sim, apagar</span>                        
                        }
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default DeletarProduto;