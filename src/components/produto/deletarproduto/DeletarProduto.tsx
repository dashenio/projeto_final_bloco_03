import { useEffect, useState } from "react";
import { buscar, deletar } from "../../../services/Service";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import type Produto from "../../../models/Produto";



function DeletarProduto() {
  
    const navigate = useNavigate();
    const [produto, setProduto] = useState<Produto>({} as Produto)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { id } = useParams<{ id: string }>();

    async function buscarPorId(id: string) {
        await buscar(`/produtos/${id}`, setProduto)
    }    

    useEffect(() => {
        if(id !== undefined){
            buscarPorId(id)
        }
    },[id])
    
    function retornar(){
        navigate('/produtos')
    }

    async function deletarProduto(){
        
        setIsLoading(true)

        try{
            
            await deletar(`/produtos/${id}`)

            alert('Produto apagado com sucesso.')

        }catch(error: any){
            alert('Erro ao deletar Produto.')
            
        }
        setIsLoading(false)
        retornar()
    }

    return (

<div className="flex flex-col items-center w-full mt-10"> 
   
    <p className="font-semibold mb-6 text-center text-xl">
        Você tem certeza de que deseja apagar o produto a seguir?
    </p>

    {/* O Card do Produto */}
    <div className='flex flex-row rounded-lg overflow-hidden border border-slate-300 items-center p-4 bg-white'>   
        
        <div className="flex flex-row items-center gap-6">
            <img 
                src={produto.foto}
                className='w-48 h-48 object-cover rounded' 
            />
            
            <div className='flex flex-col gap-4'>
                <div className='text-black'>
                    <h3 className='text-3xl font-bold mb-2'>{produto.nome}</h3>
                    <p className="text-lg"><span className='font-bold'>Preço: </span>{new Intl.NumberFormat("pt-BR", {
                        style: 'currency',
                        currency: 'BRL',
                    }).format(produto.preco)}</p>
                    <p className="text-lg"><span className='font-bold'>Categoria: </span>{produto.categoria?.nome}</p>
                </div>

                <div className="flex">
                <button className="text-slate-100 bg-red-400 hover:bg-red-600 
                        w-full py-2" onClick={retornar}>
                    Não
                </button>
                <button className="text-slate-100 bg-indigo-400 hover:bg-indigo-600 
                        w-full justify-center" onClick={deletarProduto}>
                    {
                        isLoading ?
                            <ClipLoader 
                                color="#ffffff"
                                size={24}
                            />
                            :
                            <span>Sim</span>                        
                    }
                </button>
            </div>
        </div>
    </div>
</div>
</div>
  )
}

export default DeletarProduto;

 