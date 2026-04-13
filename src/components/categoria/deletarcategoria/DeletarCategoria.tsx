import { useEffect, useState } from "react";
import { buscar, deletar } from "../../../services/Service";
import { useNavigate, useParams } from "react-router-dom";
import type Categoria from "../../../models/Categoria";
import { ClipLoader } from "react-spinners";

function DeletarCategoria() {
  
    const navigate = useNavigate();
    const [categoria, setCategoria] = useState<Categoria>({} as Categoria)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    
    const { id } = useParams<{ id: string }>();

    async function buscarPorId(id: string) {
            
        await buscar(`/categorias/${id}`, setCategoria)
    }

    useEffect(() => {
        if(id !== undefined){
            buscarPorId(id)
         }
    },[id])

    function retornar(){
        navigate('/categorias')
    }
    
    async function deletarCategoria(){
        
        setIsLoading(true)

        try{
            await deletar(`/categorias/${id}`)
            alert('Categoria deletada com sucesso.')

        }catch(error: any){
            alert('Erro ao deletar categoria.')
             
            }
    
        setIsLoading(false)
        retornar()    

    }
       


    return (
    <div className="container w-1/3 mx-auto">
        <h1 className="text-4xl text-center my-4">Deletar categoria</h1>
        <p className="text-center font-semibold mb-4">
            Você tem certeza de que deseja deletar a categoria a seguir?
        </p>
        <div className="border flex flex-col rounded-2xl overflow-hidden justify-between">
            <header className="py-2 px-6 bg-slate-700 text-white font-bold text-2xl">
                Categoria
            </header>
            <p className='p-8 text-3xl bg-slate-200 h-full'>{categoria.nome}</p>
            <div className="flex">
                <button className="text-slate-100 bg-red-400 hover:bg-red-600 
                        w-full py-2" onClick={retornar}>
                    Não
                </button>
                <button className="text-slate-100 bg-teal-500 hover:bg-teal-700 
                        w-full justify-center" onClick={deletarCategoria}>
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
  )
}

export default DeletarCategoria;

 