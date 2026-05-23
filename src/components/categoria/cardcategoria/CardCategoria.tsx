import type Categoria from "../../../models/Categoria"
import { PencilIcon, TrashIcon } from "@phosphor-icons/react"
import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom"; // ✅

interface CardCategoriaProps {
    categoria: Categoria;
    onEditar: (id: string) => void;
    onDeletar: (id: string) => void;
}

function CardCategoria({ categoria, onEditar, onDeletar }: CardCategoriaProps) {

    const { usuario } = useContext(AuthContext);
    const mostrarBarraAcoes = ['admin'].includes(usuario.roles);
    const navigate = useNavigate(); // ✅

    return (
        <div className="flex flex-col border border-slate-500 rounded-2xl overflow-hidden justify-between h-full min-h-40 shadow-sm">
            
            <div 
                className="bg-slate-200 flex-1 flex items-center justify-center p-4 cursor-pointer hover:bg-slate-300 transition-colors"
                onClick={() => navigate(`/produtos?categoriaId=${categoria.id}`)}
                title={`Ver produtos de "${categoria.tipo}"`}
            >
                <p className="text-2xl text-center font-medium text-slate-800">
                    {categoria.tipo}
                </p>
            </div>
            
            { mostrarBarraAcoes && (
                <div className="flex mt-auto">
                    <button 
                        onClick={() => onEditar(String(categoria.id))}
                        className="w-full text-slate-100 bg-teal-500 hover:bg-teal-700 flex items-center justify-center py-2 transition-colors"
                    >
                        <PencilIcon size={32} color="#ffffff" />
                    </button>
                    <button 
                        onClick={() => onDeletar(String(categoria.id))}
                        className="w-full text-slate-100 bg-red-400 hover:bg-red-700 flex items-center justify-center py-2 transition-colors"
                    >
                        <TrashIcon size={32} color="#ffffff" />
                    </button>
                </div>
            )}
        </div>
    )
}

export default CardCategoria;