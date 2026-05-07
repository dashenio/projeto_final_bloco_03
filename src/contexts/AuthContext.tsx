import { createContext, useEffect, useState, type ReactNode } from "react";
import type UsuarioLogin from "../models/UsuarioLogin";
import { login } from "../services/Service";
import { ToastAlerta } from "../utils/ToastAlerta";

interface AuthContextProps{
    usuario: UsuarioLogin
    handleLogout():void
    handleLogin(usuario: UsuarioLogin): Promise<void>
    isLoading: boolean
}

interface AuthProviderProps{
    children: ReactNode
}

export const AuthContext = createContext( {} as AuthContextProps)

export function AuthProvider({ children }: AuthProviderProps){
    
    // Inicializar o estado usuário
    const [usuario, setUsuario] = useState<UsuarioLogin>({
        id: 0,
        nome: "",
        usuario: "",
        senha: "",
        roles: "",
        token: ""
    })

    //Inicializar o estado isLoading
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const usuarioPersistido = localStorage.getItem('usuario_farmacia');
        
        if (usuarioPersistido) {
            setUsuario(JSON.parse(usuarioPersistido));
        }
    }, []);

    //Implementação da função de login
    async function handleLogin(usuarioLogin: UsuarioLogin){
        
        setIsLoading(true);

        try{
            await login('/usuarios/logar', usuarioLogin, (user: UsuarioLogin) => {
                setUsuario(user);
                localStorage.setItem('usuario_farmacia', JSON.stringify(user));
            });
            ToastAlerta('Usuário autenticado com sucesso!', 'sucesso')

        }catch(error){
            ToastAlerta('Usuário ou senha incorretos!','erro');
        }

        setIsLoading(false);
    }

    function handleLogout(){

        localStorage.removeItem('usuario_farmacia');
        
        setUsuario({
            id: 0,
            nome: "",
            usuario: "",
            senha: "",
            roles: "",
            token: ""
        })
    }

    return(
        <AuthContext.Provider value={{ usuario, handleLogin, handleLogout, isLoading}}>
            {children}
        </AuthContext.Provider>
    )

}

