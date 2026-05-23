import { useContext, useEffect, useState } from "react";
import { buscar, deletar } from "../../../services/Service";
import { ClipLoader } from "react-spinners";
import type Categoria from "../../../models/Categoria";
import { AuthContext } from "../../../contexts/AuthContext";
import Modal from 'react-modal';
import { XIcon } from "@phosphor-icons/react";
import { ToastAlerta } from "../../../utils/ToastAlerta";

interface ModalDeletarCategoriaProps {
    isOpen: boolean;
    onClose: () => void;
    categoriaId?: string;
}

function DeletarCategoria({ isOpen, onClose, categoriaId }: Readonly<ModalDeletarCategoriaProps>) {
  
    const [categoria, setCategoria] = useState<Categoria>({} as Categoria);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { usuario, handleLogout } = useContext(AuthContext);
    const token = usuario.token;

    async function buscarPorId(id: string) {
        await buscar(`/categorias/${id}`, setCategoria, { 
            headers: { Authorization: token } 
        });
    }    

    useEffect(() => {
        if (isOpen && categoriaId !== undefined) {
            buscarPorId(categoriaId);
        }
    }, [isOpen, categoriaId]);
    
    async function deletarCategoria() {
        setIsLoading(true);
        try {
            await deletar(`/categorias/${categoriaId}`, { 
                headers: { Authorization: token } 
            });
            ToastAlerta('Categoria deletada com sucesso.', "sucesso");
        } catch(error: any) {
            ToastAlerta('Erro ao deletar Categoria.', "erro");
            handleLogout(); 
        }
        setIsLoading(false);
        onClose();
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Modal de Deleção de Categoria"
            style={{ overlay: { zIndex: 9999 } }}
            overlayClassName="fixed inset-0 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden p-8 outline-none"
        >
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
                aria-label="Fechar"
            >
                <XIcon size={32} weight="bold" />
            </button>

            <div className="flex flex-col items-center w-full mt-2">

                <h1 className="text-3xl font-bold text-slate-800 mb-4">Deletar Categoria</h1>
                <p className="font-semibold mb-6 text-center text-lg text-slate-700">
                    Você tem certeza de que deseja apagar a categoria a seguir?
                </p>

                <div className="flex flex-col rounded-lg overflow-hidden border border-slate-300 items-center p-6 bg-slate-50 w-full">
                    <p className="text-2xl font-bold text-slate-800 text-center">
                        {categoria.tipo}
                    </p>
                </div>

                <div className="flex w-full gap-4 mt-6">
                    <button 
                        className="text-slate-700 font-bold bg-slate-200 hover:bg-slate-300 rounded-lg w-full py-3 transition-colors" 
                        onClick={onClose}
                    >
                        Não, cancelar
                    </button>
                    <button 
                        className="text-white font-bold bg-red-500 hover:bg-red-700 rounded-lg w-full py-3 flex justify-center transition-colors" 
                        onClick={deletarCategoria}
                    >
                        {isLoading
                            ? <ClipLoader color="#ffffff" size={24} />
                            : <span>Sim, apagar</span>
                        }
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default DeletarCategoria;