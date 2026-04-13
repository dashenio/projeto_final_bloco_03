import { Link } from 'react-router-dom'
import type Produto from '../../../models/Produto'

interface CardProdutoProps {
    produto: Produto
}

function CardProduto({ produto }: CardProdutoProps) {
    return (
        <div className='flex flex-row rounded overflow-hidden justify-between'>   
            
            <div className="flex flex-1 w-full py-2 px-4 items-center gap-4">
                <img src={produto.foto}
                    className='max-w-36 max-h-36' />
                
                <div className='flex flex-col  gap-5'>
                    <div className='text-black'>
                        <h3 className='text-2xl font-bold mb-3'>{produto.nome}</h3>
                        <p><span className='font-bold'>Preço: </span>{new Intl.NumberFormat("pt-BR", {
                            style: 'currency',
                            currency: 'BRL',
                        }).format(produto.preco)}</p>
                        <p><span className='font-bold'>Categoria: </span>{produto.categoria?.nome}</p>

                    </div>
                    <div className="flex flex-row justify-center w-48">
                        <Link to={`/editarproduto/${produto.id}`} 
                            className='w-full text-white bg-indigo-400 
                            hover:bg-indigo-800 flex items-center justify-center py-2'>
                            <button>Editar</button>
                        </Link>
                        <Link to={`/deletarproduto/${produto.id}`}
                            className='text-white bg-red-400 
                            hover:bg-red-700 w-full flex items-center justify-center'>
                            <button>Deletar</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardProduto