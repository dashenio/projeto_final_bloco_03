import { useContext, useEffect, useState, type ChangeEvent, type SyntheticEvent } from "react";
import type Categoria from "../../../models/Categoria";
import { atualizar, buscar, cadastrar } from "../../../services/Service";
import { ClipLoader } from "react-spinners";
import { ToastAlerta } from "../../../utils/ToastAlerta";
import { AuthContext } from "../../../contexts/AuthContext";
import Modal from "react-modal";
import { XIcon } from "@phosphor-icons/react";

// ✅ Substituímos useParams por props
interface FormCategoriaProps {
    isOpen: boolean;
    onClose: () => void;
    categoriaId?: string;
}

function FormCategoria({ isOpen, onClose, categoriaId }: FormCategoriaProps) {

    const [categoria, setCategoria] = useState<Categoria>({} as Categoria);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { usuario, handleLogout } = useContext(AuthContext);
    const token = usuario.token;

    async function buscarPorId(id: string) {
        await buscar(`/categorias/${id}`, setCategoria, {
            headers: { Authorization: token }
        });
    }

    // Busca a categoria ao abrir o modal (modo edição) ou limpa o estado (modo criação)
    useEffect(() => {
        if (isOpen) {
            if (categoriaId !== undefined) {
                buscarPorId(categoriaId);
            } else {
                setCategoria({} as Categoria); // Limpa o form ao criar nova
            }
        }
    }, [isOpen, categoriaId]);

    function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
        setCategoria({
            ...categoria,
            [e.target.name]: e.target.value
        });
    }

    async function gerarNovaCategoria(e: SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        if (categoriaId !== undefined) {
            try {
                await atualizar(`/categorias/atualizar`, categoria, setCategoria, {
                    headers: { Authorization: token }
                });
                ToastAlerta('A categoria foi atualizada com sucesso!', 'sucesso');
            } catch (error: any) {
                ToastAlerta('Erro ao atualizar categoria.', 'erro');
            }
        } else {
            try {
                await cadastrar(`/categorias/cadastrar`, categoria, setCategoria, {
                    headers: { Authorization: token }
                });
                ToastAlerta('A categoria foi cadastrada com sucesso!', 'sucesso');
            } catch (error: any) {
                ToastAlerta('Erro ao cadastrar categoria', 'erro');
                handleLogout();
            }
        }

        setIsLoading(false);
        onClose(); // Fecha o modal ao concluir, no lugar de navigate()
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Modal de Categoria"
            style={{ overlay: { zIndex: 9999 } }}
            overlayClassName="fixed inset-0 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden outline-none"
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
                aria-label="Fechar"
            >
                <XIcon size={32} weight="bold" />
            </button>

            <div className="flex flex-col items-center w-full p-8 gap-8">
                <h1 className="text-3xl font-bold text-center">
                    {categoriaId === undefined ? 'Cadastrar Categoria' : 'Editar Categoria'}
                </h1>

                <form className="w-full flex flex-col gap-6" onSubmit={gerarNovaCategoria}>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="tipo">Nome da categoria</label>
                        <input
                            type="text"
                            placeholder="Insira o nome da nova categoria"
                            name="tipo"
                            id="tipo"
                            className="border-2 border-slate-700 rounded-lg p-2"
                            value={categoria.tipo ?? ''}
                            onChange={atualizarEstado}
                        />
                    </div>

                    <button
                        className="rounded-lg text-white bg-slate-400 font-bold hover:bg-slate-700 w-1/2 py-2 mx-auto flex justify-center"
                        type="submit"
                    >
                        {isLoading
                            ? <ClipLoader color="#ffffff" size={24} />
                            : <span>{categoriaId === undefined ? 'Cadastrar' : 'Atualizar'} Categoria</span>
                        }
                    </button>
                </form>
            </div>
        </Modal>
    );
}

export default FormCategoria;