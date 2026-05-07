import { Link } from "react-router-dom"
import type Categoria from "../../../models/Categoria"
import { PencilIcon, TrashIcon } from "@phosphor-icons/react"

interface CardCategoriaProps{
    categoria: Categoria
}

function CardCategoria({ categoria }: CardCategoriaProps) {
  return (
    <div className="flex flex-col border border-slate-200 rounded-2xl overflow-hidden justify-between">
        <header className=" py-2 px-6 bg-indigo-800 text-white font-bold text-l uppercase">Categoria</header>
        <p className="p-8 text-3xl bg-slate-200 h-full">{categoria.tipo}</p>
        <div className="flex">
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
        </div>
    </div>
  )
}

export default CardCategoria