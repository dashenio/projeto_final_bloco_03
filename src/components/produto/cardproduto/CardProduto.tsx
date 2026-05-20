import { Link } from 'react-router-dom'
import type Produto from '../../../models/Produto'
import { PencilIcon, TrashIcon } from '@phosphor-icons/react'
import { useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';

interface CardProdutoProps {
    produto: Produto
}

function CardProduto({ produto }: CardProdutoProps) {

    const { usuario } = useContext(AuthContext);
    const mostrarBarraAcoes = ['admin'].includes(usuario.roles);

    return (
        <div className='flex flex-col columns-1 rounded-lg border border-slate-200 overflow-hidden bg-white shadow-sm'>
            
            {/* Cabeçalho do Card */}
            <div className='bg-indigo-800 py-2 px-4'>
                <h4 className='text-white font-bold uppercase text-sm'>{produto.categoria?.tipo}</h4>
            </div>

            <div className="flex flex-col flex-1 w-full items-center py-2 px-4 gap-4 bg-slate-200">

                <div className="flex justify-center items-center h-40 w-full p-2">

                    <img src={produto.foto} className='h-full w-full object-contain' alt={produto.nome} />

                </div>

            {/* Conteúdo Central */}
            <div className='text-center'>
                <h3 className='text-xl font-bold text-slate-900 leading-tight mb-2'>
                    {produto.nome}
                </h3>
                
                {/* Tag de Genérico*/}

                <div className="h-7 flex-row items-center">
                    {produto.generico ? (
                        <span className="bg-yellow-400 text-xs font-bold px-2 py-1 rounded md-2 inline-block">
                            GENÉRICO
                        </span>
                    ) : (
                        <div className="h-full"></div> // Espaço reservado vazio
                    )}
                </div>


                <p className='text-sm text-slate-600 italic'>{produto.apresentacao}</p>
                
                <p className='text-slate-700 mt-2'>
                    <span className='font-bold'>Fabricante: </span>{produto.fabricante}
                </p>

                <p className='text-slate-700'>
                    <span className='font-bold'>Preço: </span>
                    {new Intl.NumberFormat("pt-BR", {
                        style: 'currency',
                        currency: 'BRL',
                    }).format(produto.preco)}
                </p>

                { usuario.roles === 'admin' && (<p className='text-slate-700 mt-2'>
                    <span className='font-bold uppercase'>estoque: <span className='text-blue-600'>{produto.quantidade}</span></span>
                </p>
                )}

               

                <p className='text-slate-700 mt-2 space-y-1 w-full h-20 overflow-y-auto'>
                    <span className='font-bold'>Descrição: </span>{produto.descricao}
                </p>
            </div>   
        </div>

            {/* Rodapé com Botões */}
            { mostrarBarraAcoes && (
            <div className="flex w-full">
                <Link to={`/editarproduto/${produto.id}`} 
                    className='w-full  text-slate-100 bg-teal-500 hover:bg-teal-700
                              flex items-center justify-center py-2 px-4 transition-colors'>
                    <button className='font-bold'><PencilIcon size={32} color="#ffffff" /></button>
                </Link>
                <Link to={`/deletarproduto/${produto.id}`}
                    className='w-full text-slate-100 bg-red-400 hover:bg-red-700
                              flex items-center justify-center py-2 px-4 transition-colors'>
                    <button className='font-bold'><TrashIcon size={32} color="#ffffff" /></button>
                </Link>
            </div>
            )}

    </div>    
    )
}

export default CardProduto