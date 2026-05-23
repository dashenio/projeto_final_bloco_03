import { useContext, useEffect, useState, type ChangeEvent, type FocusEvent, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { atualizar } from "../../services/Service";
import { ClipLoader } from "react-spinners";
import { ToastAlerta } from "../../utils/ToastAlerta";
import type UsuarioLogin from "../../models/UsuarioLogin";

function Perfil() {
    const navigate = useNavigate();
    
    const { usuario: usuarioContext, atualizarDadosGlobais } = useContext(AuthContext);
    const token = usuarioContext.token;
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const [usuarioForm, setUsuarioForm] = useState<UsuarioLogin>({
        id: 0,
        nome: '',
        usuario: '',
        senha: '',
        roles: '',
        token: ''
    });

    useEffect(() => {
        if (token === "") {
            ToastAlerta("Você precisa estar logado!", "info");
            navigate("/login");
            return;
        }

        setUsuarioForm({
            ...usuarioContext, 
            senha: '' // Começa vazio, obrigando o usuário a digitar para confirmar
        });
    }, [token, usuarioContext]);

    function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
        setUsuarioForm({
            ...usuarioForm,
            [e.target.name]: e.target.value
        });
    }

    function reverterSeVazio(e: FocusEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        
        if (value.trim() === '') {
            setUsuarioForm(prev => ({
                ...prev,
                [name]: name === 'senha' ? '' : (usuarioContext as any)[name] 
            }));
        }
    }

    async function atualizarUsuario(e: SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        const payloadAtualizacao = {
            id: usuarioForm.id,
            nome: usuarioForm.nome,
            usuario: usuarioForm.usuario,
            senha: usuarioForm.senha, // Agora a senha vai obrigatoriamente
            roles: usuarioForm.roles
        };

        try {
            await atualizar(`/usuarios/atualizar`, payloadAtualizacao, setUsuarioForm, {
                headers: { Authorization: token }
            });

            atualizarDadosGlobais({
                ...usuarioContext,
                nome: usuarioForm.nome,
                usuario: usuarioForm.usuario
            });

            ToastAlerta('Perfil atualizado com sucesso!', 'sucesso');
            navigate('/home');

        } catch (error: any) {
            ToastAlerta('Erro ao atualizar o perfil. Verifique os dados.', 'erro');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="container flex flex-col mx-auto items-center bg-white min-h-[80vh] py-8">
            <h1 className="text-4xl text-center text-slate-800 font-bold mb-8">
                Meu Perfil
            </h1>

            <form className="flex flex-col w-full max-w-md gap-4 bg-slate-50 p-8 rounded-xl shadow-md border border-slate-200" 
                  onSubmit={atualizarUsuario}>
            
                <div className="flex flex-col gap-2">
                    <label htmlFor="nome" className="font-semibold text-slate-700">Nome</label>
                    <input
                        type="text" 
                        placeholder="Digite seu nome"
                        name="nome"
                        required
                        className="border-2 border-slate-300 rounded-lg p-2 focus:border-indigo-500 focus:outline-none transition-colors"
                        value={usuarioForm.nome}
                        onChange={atualizarEstado}
                        onBlur={reverterSeVazio}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="usuario" className="font-semibold text-slate-700">E-mail (Usuário)</label>
                    <input
                        type="text" 
                        placeholder="Digite seu email"
                        name="usuario"
                        required
                        className="border-2 border-slate-300 rounded-lg p-2 focus:border-indigo-500 focus:outline-none transition-colors"
                        value={usuarioForm.usuario}
                        onChange={atualizarEstado}
                        onBlur={reverterSeVazio}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="senha" className="font-semibold text-slate-700">
                        Confirme sua Senha <span className="text-xs text-red-500 font-normal">*Obrigatório (mín. 8 caracteres)</span>
                        <p className="text-xs">Se desejar modificar a senha é só digitar uma nova.</p>
                    </label>
                    <input
                        type="password" 
                        placeholder="Digite sua senha para confirmar"
                        name="senha"
                        required          // Torna obrigatório no frontend
                        minLength={8}     // Impede o envio se tiver menos de 8
                        className="border-2 border-slate-300 rounded-lg p-2 focus:border-indigo-500 focus:outline-none transition-colors"
                        value={usuarioForm.senha || ''}
                        onChange={atualizarEstado}
                    />
                </div>

                <button 
                    type="submit"
                    className="rounded-lg disabled:bg-slate-300 bg-indigo-500 hover:bg-indigo-700
                               text-white font-bold w-full mx-auto mt-4 py-3 flex justify-center transition-colors shadow-sm"
                    disabled={isLoading}
                >
                    { isLoading ? (
                        <ClipLoader color="#ffffff" size={24} />
                    ) : (
                        <span>Atualizar Perfil</span>
                    )}
                </button>
            </form>
        </div>
    );
}

export default Perfil;