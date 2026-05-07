import { useContext, useEffect, useState, type ChangeEvent, type SyntheticEvent } from "react";
import type Categoria from "../../../models/Categoria";
import { useNavigate, useParams } from "react-router-dom";
import { atualizar, buscar, cadastrar } from "../../../services/Service";
import { ClipLoader } from "react-spinners";
import { ToastAlerta } from "../../../utils/ToastAlerta";
import { AuthContext } from "../../../contexts/AuthContext";

function FormCategoria() {

    const navigate = useNavigate();

    const [categoria, setCategoria] = useState<Categoria>({} as Categoria)
    const [isLoading, setIsLoading] = useState<boolean>(false)
  
    const { id } = useParams<{ id: string }>();

    const { usuario, handleLogout } = useContext(AuthContext)
    const token = usuario.token
            
    useEffect(() => {
        if (token === '') {
            ToastAlerta('Você precisa estar logado!', 'info')
            navigate('/')
        }
    }, [token])        

    async function buscarPorId(id: string) {
        
        await buscar(`/categorias/${id}`, setCategoria, {
                    headers: { Authorization: token }
            });
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
                await atualizar(`/categorias/atualizar`, categoria, setCategoria, {
                    headers: { Authorization: token }
            });
                ToastAlerta('A categoria foi atualizada com sucesso!','sucesso')

            }catch(error: any){
                ToastAlerta('Erro ao atualizar categoria.', 'erro')
            }
        }else {
            try {
                await cadastrar(`/categorias/cadastrar`, categoria, setCategoria, {
                    headers: { Authorization: token }
            });
                ToastAlerta('A categoria foi cadastrada com sucesso!', 'sucesso')

            }catch(error: any){
                ToastAlerta('Erro ao cadastrar categoria', 'erro')

                handleLogout() 
               
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
                <label htmlFor="tipo">Nome da categoria</label>
                <input type="text" 
                       placeholder="Isira o nome da nova categoria" 
                       name="tipo"
                       className="border-2 border-slate-700 rounded p-2"
                       value={categoria.tipo}
                       onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                />
            </div>
            <button className="rounded text-white bg-slate-400 font-bold
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