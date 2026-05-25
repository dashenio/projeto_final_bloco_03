import { useContext, useEffect, useState, type ChangeEvent, type SyntheticEvent } from "react";
import { atualizar, buscar, cadastrarUsuario } from "../../../services/Service";
import { ClipLoader } from "react-spinners";
import type Usuario from "../../../models/Usuario";
import { AuthContext } from "../../../contexts/AuthContext";
import { X } from "@phosphor-icons/react";
import Modal from 'react-modal';
import { ToastAlerta } from "../../../utils/ToastAlerta";

interface ModalFormUsuarioProps {
    isOpen: boolean;
    onClose: () => void;
    usuarioId?: string; 
}

function FormUsuario({ isOpen, onClose, usuarioId }: Readonly<ModalFormUsuarioProps>) {
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [usuarioForm, setUsuarioForm] = useState<Usuario>({} as Usuario);
    const [confirmarSenha, setConfirmarSenha] = useState<string>("");
    
    // ESTADO NOVO: Controla se a tela mostra os botões (false) ou o formulário (true)
    const [formVisivel, setFormVisivel] = useState<boolean>(false);
    
    const { usuario } = useContext(AuthContext);
    const token = usuario?.token || "";

    async function buscarUsuarioPorId(id: string) {
        try {
            const headerToken = token.startsWith('Bearer') ? token : `Bearer ${token}`;
            await buscar(`/usuarios/${id}`, setUsuarioForm, { 
                headers: { Authorization: headerToken } 
            });
            // Se for modo edição, pula os botões e já exibe o form
            setFormVisivel(true);
        } catch (error: any) {
            ToastAlerta('Erro ao buscar os dados do usuário.', "erro");
        }
    }

    useEffect(() => {
        if (isOpen) {
            if(usuarioId !== undefined){
                buscarUsuarioPorId(usuarioId);
            } else {
                setUsuarioForm({} as Usuario);
                setConfirmarSenha("");
                // Modo novo cadastro: garante que a tela inicie com os botões de escolha
                setFormVisivel(false); 
            }
        }
    }, [isOpen, usuarioId]);

    // FUNÇÃO NOVA: Seta a role com base no botão clicado e revela os campos
    function registrarTipoUsuario(tipo: "user" | "admin") {
        setUsuarioForm(prev => ({
            ...prev,
            roles: tipo
        }));
        setFormVisivel(true);
    }

    // FUNÇÃO NOVA: Botão de voltar (cancela a escolha ou fecha o modal)
    function voltarOpcoesOuFechar() {
        if (usuarioId === undefined) {
            setUsuarioForm({} as Usuario);
            setConfirmarSenha("");
            setFormVisivel(false);
        } else {
            onClose();
        }
    }

    function atualizarEstado(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setUsuarioForm(prev => ({
            ...prev,
            [name]: value
        }));
    }

    async function gerarNovoUsuario(e: SyntheticEvent<HTMLFormElement>){
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(usuarioForm.usuario)) {
            ToastAlerta("Por favor, insira um endereço de e-mail válido.", "erro");
            return;
        }

        if (usuarioForm.senha !== confirmarSenha) {
            ToastAlerta("As senhas não coincidem.", "erro");
            return;
        }

        if (usuarioForm.senha.length < 8) {
            ToastAlerta("A senha deve ter pelo menos 8 caracteres.", "erro");
            return;
        }

        setIsLoading(true);

        if (usuarioId !== undefined) {
            try {
                const headerToken = token.startsWith('Bearer') ? token : `Bearer ${token}`;
                await atualizar(`/usuarios/atualizar`, usuarioForm, setUsuarioForm, { 
                    headers: { Authorization: headerToken } 
                });
                ToastAlerta('Usuário atualizado com sucesso!', "sucesso");
                onClose(); 
            } catch(error: any) {
                ToastAlerta('Erro ao atualizar o Usuário.', "erro");
            }
        } else {
            try {
                await cadastrarUsuario(`/usuarios/cadastrar`, usuarioForm, setUsuarioForm);
                ToastAlerta('Usuário cadastrado com sucesso!', "sucesso");
                onClose(); 
            } catch(error: any) {
                ToastAlerta('Erro ao cadastrar o Usuário.', "erro");
            }
        }

        setIsLoading(false);
    }

    const isFormInvalido = !usuarioForm.nome || !usuarioForm.usuario || !usuarioForm.senha || !usuarioForm.roles || !confirmarSenha;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Modal de Formulário de Usuário"
            overlayClassName="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8 outline-none" 
        >
            <button 
                onClick={onClose}
                type="button"
                className="absolute top-4 right-4 text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
                aria-label="Fechar"
            >
                <X size={32} weight="bold" />
            </button>

            <h1 className="text-3xl text-center mb-6 font-bold text-slate-800">
                {usuarioId !== undefined ? 'Editar Usuário' : 'Criar Nova Conta'}
            </h1>

            {/* TELA 1: BOTÕES DE ESCOLHA (Só aparece se for novo cadastro) */}
            {!formVisivel && (
                <div className="flex flex-col gap-4 w-full mt-4">
                    <button
                        type="button"
                        onClick={() => registrarTipoUsuario("user")}
                        className="w-full py-4 rounded-xl border-2 border-indigo-600 text-indigo-700 font-bold text-lg hover:-translate-y-1 hover:bg-indigo-50 hover:shadow-md transition-all duration-300 flex justify-center items-center"
                    >
                        Cadastrar Cliente
                    </button>

                    <button
                        type="button"
                        onClick={() => registrarTipoUsuario("admin")}
                        className="w-full py-4 rounded-xl border-2 border-slate-800 text-slate-800 font-bold text-lg hover:-translate-y-1 hover:bg-slate-50 hover:shadow-md transition-all duration-300 flex justify-center items-center"
                    >
                        Cadastrar Administrador
                    </button>
                </div>
            )}

            {/* TELA 2: FORMULÁRIO */}
            {formVisivel && (
                <form className="flex flex-col w-full gap-4" onSubmit={gerarNovoUsuario}>
                
                    {/* Campo HIDDEN que recebe a string exata do botão clicado */}
                    <input
                        type="hidden"
                        name="roles"
                        value={usuarioForm.roles || ""}
                    />

                    {/* CAMPOS EM UMA ÚNICA COLUNA */}
                    <div className="flex flex-col gap-4 w-full">
                        
                        <div className="flex flex-col gap-2">
                            <label htmlFor="nome" className="font-semibold text-slate-700">Nome Completo</label>
                            <input
                                type="text" 
                                placeholder="Digite seu nome completo"
                                name="nome"
                                required
                                className="border-2 border-slate-300 rounded-lg p-2 focus:outline-none focus:border-indigo-600 transition-colors"
                                value={usuarioForm.nome || ''}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="usuario" className="font-semibold text-slate-700">Email</label>
                            <input
                                type="email" 
                                placeholder="Ex: joao@email.com"
                                name="usuario"
                                required
                                className="border-2 border-slate-300 rounded-lg p-2 focus:outline-none focus:border-indigo-600 transition-colors"
                                value={usuarioForm.usuario || ''}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="senha" className="font-semibold text-slate-700">Senha</label>
                            <input
                                type="password" 
                                placeholder="Mínimo 8 caracteres"
                                name="senha"
                                required
                                className="border-2 border-slate-300 rounded-lg p-2 focus:outline-none focus:border-indigo-600 transition-colors"
                                value={usuarioForm.senha || ''}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="confirmarSenha" className="font-semibold text-slate-700">Confirmar Senha</label>
                            <input
                                type="password"
                                placeholder="Repita a senha"
                                name="confirmarSenha"
                                required
                                className="border-2 border-slate-300 rounded-lg p-2 focus:outline-none focus:border-indigo-600 transition-colors"
                                value={confirmarSenha}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmarSenha(e.target.value)}
                            />
                        </div>

                        
                    </div>

                    {/* BOTÕES LADO A LADO */}
                    <div className="flex gap-4 mt-6 w-full">
                        <button
                            type="button"
                            onClick={voltarOpcoesOuFechar}
                            className="w-1/3 rounded-lg border-2 border-slate-300 text-slate-600 font-bold py-3 hover:bg-slate-100 transition-colors"
                        >
                            {usuarioId !== undefined ? "Cancelar" : "Voltar"}
                        </button>

                        <button 
                            type="submit"
                            className="w-2/3 rounded-lg disabled:bg-slate-400 disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-3 flex justify-center transition-colors shadow-md"
                            disabled={isFormInvalido}
                        >
                            { isLoading ? (
                                <ClipLoader color="#ffffff" size={24} />
                            ) : (
                                <span>{usuarioId !== undefined ? 'Atualizar Usuário' : 'Cadastrar Usuário'}</span>
                            )}
                        </button>
                    </div>

                </form>
            )}
        </Modal>
    );
}

export default FormUsuario;