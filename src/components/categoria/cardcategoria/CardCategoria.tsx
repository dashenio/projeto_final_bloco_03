import { Link } from "react-router-dom"
import type Categoria from "../../../models/Categoria"
import { PencilIcon, TrashIcon } from "@phosphor-icons/react"
import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";

interface CardCategoriaProps{
    categoria: Categoria
}

function CardCategoria({ categoria }: CardCategoriaProps) {

    const { usuario } = useContext(AuthContext);
    const mostrarBarraAcoes = ['admin'].includes(usuario.roles);

  return (
    <div className="flex flex-col border border-slate-200 rounded-2xl overflow-hidden justify-between h-full min-h-40">
        
        <div className="bg-slate-200 flex-1 flex items-center justify-center p-4">
            
            <p className="text-2xl text-center font-medium text-slate-800">
                {categoria.tipo}
            </p>
        </div>
        
        { mostrarBarraAcoes &&
        
        (<div className="flex mt-auto">
            <Link to={`/editarcategoria/${categoria.id}`}
                  className="w-full text-slate-100 bg-teal-500 hover:bg-teal-700
                             flex items-center justify-center py-2">
                <button><PencilIcon size={32} color="#ffffff" /></button>
            </Link>
            <Link to={`/deletarcategoria/${categoria.id}`}
                  className="w-full text-slate-100 bg-red-400 hover:bg-red-700
                             flex items-center justify-center">
                <button><TrashIcon size={32} color="#ffffff" /></button>
            </Link>
        </div>)}
    </div>
  )
}

export default CardCategoria;