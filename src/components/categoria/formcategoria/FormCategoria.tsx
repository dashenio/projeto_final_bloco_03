import { useEffect, useState, type ChangeEvent, type SyntheticEvent } from "react";
import type Categoria from "../../../models/Categoria";
import { useNavigate, useParams } from "react-router-dom";
import { atualizar, buscar, cadastrar } from "../../../services/Service";
import { ClipLoader } from "react-spinners";

function FormCategoria() {

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

    function atualizarEstado(e: ChangeEvent<HTMLInputElement>){
        setCategoria({
            ...categoria,
            [e.target.name]: e.target.value
        })
    }

    function retornar(){
        navigate('/categorias')
    }

    async function gerarNovaCategoria(e: SyntheticEvent<HTMLFormElement>){
        
        e.preventDefault()
        setIsLoading(true)

        if (id !== undefined) {
            try{
                await atualizar(`/categorias/`, categoria, setCategoria)
                alert('A categoria foi atualizada com sucesso!')

            }catch(error: any){
                alert('Erro ao atualizar categoria.')
            }
        }else {
            try {
                await cadastrar(`/categorias`, categoria, setCategoria)
                alert('A categoria foi cadastrada com sucesso!')

            }catch(error: any){
                alert('Erro ao cadastrar categoria')
               
                }   
            }

        setIsLoading(false)
        retornar()

    }

 
  return (
    <div className=" container flex flex-col items-center mx-auto gap-12">
        <h1 className=" text-4xl text-center mt-8">
            {id === undefined ? 'Cadastrar Categoria' : 'Editar Categoria'}
        </h1>
        <form className="w-1/2 flex flex-col gap-8"
                onSubmit={gerarNovaCategoria} >
            <div className="flex flex-col gap-2">
                <label htmlFor="nome">Categoria</label>
                <input type="text" 
                       placeholder="Descreva aqui o seu categoria" 
                       name="nome"
                       className="border-2 border-slate-700 rounded p-2"
                       value={categoria.nome}
                       onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                />
            </div>
            <button className="rounded text-white bg-slate-400
                    hover:bg-slate-700 w-1/2 py-2 mx-auto flex justify-center"
                    type="submit">
                { isLoading ?
				    <ClipLoader 
                        color="#ffffff"
                        size={24}
					/> :
					<span>{id === undefined ? 'Cadastrar' : 'Atualizar'} Categoria</span>
				}
            </button>
        </form>

    </div>
  );
}


export default FormCategoria;