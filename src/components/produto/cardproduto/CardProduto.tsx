import type Produto from '../../../models/Produto'
import { PencilIcon, TrashIcon } from '@phosphor-icons/react'
import { useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { CartContext } from '../../../contexts/CartContext';

interface CardProdutoProps {
    produto: Produto;
    onEditar: (id: string) => void; 
    onDeletar: (id: string) => void;
}

function CardProduto({ produto, onEditar, onDeletar }: CardProdutoProps) {

    const { usuario } = useContext(AuthContext);
    const { adicionarProduto } = useContext(CartContext);
    
    const mostrarBarraAcoes = ['admin'].includes(usuario.roles);
    const mostrarBotaoComprar = usuario.roles === "user";

    return (
        <div className='flex flex-col rounded-lg border border-slate-500 overflow-hidden bg-white shadow-sm h-full justify-between'>
            
            <div className="flex flex-col flex-1">
                <div className='bg-indigo-800 py-2 px-4'>
                    <h4 className='text-white font-bold uppercase text-sm'>{produto.categoria?.tipo}</h4>
                </div>

                <div className="flex flex-col flex-1 w-full items-center py-2 px-4 gap-4 bg-slate-200">
                    <div className="flex justify-center items-center h-40 w-full p-2">
                        <img src={produto.foto} className='h-full w-full object-contain' alt={produto.nome} />
                    </div>

                    <div className='text-center w-full'>
                        <h3 className='text-xl font-bold text-slate-900 leading-tight mb-2'>{produto.nome}</h3>
                        
                        <div className="h-7 flex flex-row items-center justify-center">
                            {produto.generico ? (
                                <span className="bg-yellow-400 text-xs font-bold px-2 py-1 rounded inline-block">GENÉRICO</span>
                            ) : (
                                <div className="h-full"></div>
                            )}
                        </div>

                        <p className='text-sm text-slate-600 italic'>{produto.apresentacao}</p>
                        <p className='text-slate-700 mt-2'><span className='font-bold'>Fabricante: </span>{produto.fabricante}</p>
                        <p className='text-slate-700'>
                            <span className='font-bold'>Preço: </span>
                            {new Intl.NumberFormat("pt-BR", { style: 'currency', currency: 'BRL' }).format(produto.preco)}
                        </p>

                        { usuario.roles === 'admin' && (
                            <p className='text-slate-700 mt-2'>
                                <span className='font-bold uppercase'>estoque: <span className='text-blue-600'>{produto.quantidade}</span></span>
                            </p>
                        )}

                        <p className='text-slate-700 mt-2 space-y-1 w-full h-20 overflow-y-auto'>
                            <span className='font-bold'>Descrição: </span>{produto.descricao}
                        </p>
                    </div>   
                </div>
            </div>

            <div className="flex flex-col w-full mt-auto">
                { mostrarBotaoComprar && (
                    <button className="flex items-center justify-center w-full py-3 font-bold text-white bg-teal-600 hover:bg-teal-900 transition-colors"
                        onClick={() => adicionarProduto(produto)}>
                        Comprar
                    </button>
                )}

                { mostrarBarraAcoes && (
                <div className="flex w-full">
                    <button 
                        onClick={() => onEditar(String(produto.id))} 
                        className='w-full text-slate-100 bg-teal-500 hover:bg-teal-700 flex items-center justify-center py-2 px-4 transition-colors'
                    >
                        <PencilIcon size={32} color="#ffffff" />
                    </button>
                    
                    <button 
                        onClick={() => onDeletar(String(produto.id))}
                        className='w-full text-slate-100 bg-red-400 hover:bg-red-700 flex items-center justify-center py-2 px-4 transition-colors'
                    >
                        <TrashIcon size={32} color="#ffffff" />
                    </button>
                </div>
                )}
            </div>
        </div>    
    )
}

export default CardProduto;