import { createContext, useEffect, useState, type ReactNode } from "react";
import type UsuarioLogin from "../models/UsuarioLogin";
import { login } from "../services/Service";
import { ToastAlerta } from "../utils/ToastAlerta";

interface AuthContextProps {
    usuario: UsuarioLogin;
    handleLogout(): void;
    handleLogin(usuario: UsuarioLogin): Promise<void>;
    isLoading: boolean;
    isHydrated: boolean; 
    atualizarDadosGlobais(usuarioAtualizado: UsuarioLogin): void;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: AuthProviderProps) {
    
    const [usuario, setUsuario] = useState<UsuarioLogin>({
        id: 0,
        nome: "",
        usuario: "",
        senha: "",
        roles: "",
        token: ""
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isHydrated, setIsHydrated] = useState<boolean>(false); // ✅ Começa falso

    useEffect(() => {
        const usuarioPersistido = localStorage.getItem('usuario_farmacia');
        
        if (usuarioPersistido) {
            setUsuario(JSON.parse(usuarioPersistido));
        }

        setIsHydrated(true); // ✅ Só libera após ler o localStorage
    }, []);

    async function handleLogin(usuarioLogin: UsuarioLogin) {
        setIsLoading(true);
        try {
            await login('/usuarios/logar', usuarioLogin, (user: UsuarioLogin) => {
                setUsuario(user);
                localStorage.setItem('usuario_farmacia', JSON.stringify(user));
            });
            ToastAlerta('Usuário autenticado com sucesso!', 'sucesso');
        } catch(error) {
            ToastAlerta('Usuário ou senha incorretos!', 'erro');
        }
        setIsLoading(false);
    }

    function handleLogout() {
        localStorage.removeItem('usuario_farmacia');
        setUsuario({
            id: 0,
            nome: "",
            usuario: "",
            senha: "",
            roles: "",
            token: ""
        });
    }

    function atualizarDadosGlobais(usuarioAtualizado: UsuarioLogin) {
        setUsuario(usuarioAtualizado);
        localStorage.setItem('usuario_farmacia', JSON.stringify(usuarioAtualizado));
    }

    return (
        <AuthContext.Provider value={{ usuario, handleLogin, handleLogout, isLoading, isHydrated, atualizarDadosGlobais }}>
            {children}
        </AuthContext.Provider>
    );
}