import { useEffect, useState } from "react";
import type Categoria from "../../../models/Categoria";
import { buscar } from "../../../services/Service";
import { SyncLoader } from "react-spinners";
import CardCategoria from "../cardcategoria/CardCategoria";


function ListarCategorias() {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [categorias, setCategorias] = useState<Categoria[]>([])
  

    useEffect(()=> {
        buscarCategorias()
    }, [categorias.length])

    async function buscarCategorias(){
        setIsLoading(true)
        await buscar('/categorias', setCategorias)
        setIsLoading(false)
    }
  
    return (
    <>
        <div className="flex justify-center w-full my-4">
        {isLoading && (
            <div className="flex justify-center min-w-full">
                    <SyncLoader
                        color="#312e81"
                        size={32}
                    />
                </div>
        )}
        
        
            <div className="container flex flex-col">
                {(!isLoading && categorias.length === 0) && (
	                <span className="text-3xl text-center my-8">
		                Nenhum Categoria foi encontrado!
	                </span>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {
                        categorias.map((categoria) => (
                            <CardCategoria key={categoria.id} categoria={categoria}/>
                        ))
                    }
                </div>
            </div>
        </div>
    </>
  )
}

export default ListarCategorias