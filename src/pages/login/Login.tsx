import { useContext, useEffect, useState, type ChangeEvent, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import type UsuarioLogin from "../../models/UsuarioLogin";
import { AuthContext } from "../../contexts/AuthContext";
import { ClipLoader } from "react-spinners";
import FormUsuario from "../../components/usuario/formusuario/FormUsuario";

function Login() {
  const navigate = useNavigate();

  const [usuarioLogin, setUsuarioLogin] = useState<UsuarioLogin>({} as UsuarioLogin);
  const { usuario, handleLogin, isLoading } = useContext(AuthContext);

  // Estado para controlar a abertura do modal de cadastro
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (usuario.token !== "") {
      navigate("/home");
    }
  }, [usuario, navigate]); // Adicionado navigate nas dependências por boa prática

  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
    setUsuarioLogin({
      ...usuarioLogin,
      [e.target.name]: e.target.value
    });
  }

  function login(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    handleLogin(usuarioLogin);
  }

  return (
    <>
      {/* Componente do Modal embutido na tela */}
      <FormUsuario 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        // Não passamos usuarioId, pois aqui sempre será um novo cadastro
      />

      <div className="grid grid-cols-2 h-screen w-screen place-items-center font-bold">
        <form 
          className="flex justify-center w-1/2 items-center flex-col gap-4"
          onSubmit={login}
        >
          <h2 className="text-slate-900 text-5xl">Entrar</h2>
          
          <div className="flex flex-col w-full">
            <label htmlFor="usuario">Usuário</label>
            <input 
              type="text" 
              id="usuario"
              name="usuario"
              placeholder="Usuário"
              className="border-2 border-slate-700 rounded p-2 focus:outline-none focus:border-indigo-500"
              value={usuarioLogin.usuario || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
            />
          </div>
          
          <div className="flex flex-col w-full">
            <label htmlFor="senha">Senha</label>
            <input 
              type="password" 
              id="senha"
              name="senha"
              placeholder="Senha"
              className="border-2 border-slate-700 rounded p-2 focus:outline-none focus:border-indigo-500"
              value={usuarioLogin.senha || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
            />
          </div>
          
          <button 
            type="submit"
            className="rounded bg-indigo-400 flex justify-center hover:bg-indigo-900 text-white w-1/2 py-2 transition-colors"
          >
            {isLoading ? (
              <ClipLoader color="#ffffff" size={24} />
            ) : (
              <span>Entrar</span>
            )}
          </button>

          <hr className="border-slate-800 w-full" />
          
          <p>
            Ainda não tem conta? {" "}
            {/* Trocado o <Link> por um <button> que abre o modal */}
            <button 
              type="button" 
              onClick={() => setIsModalOpen(true)} 
              className="text-indigo-800 hover:underline cursor-pointer font-bold"
            >
              Cadastre-se
            </button>
          </p>
        </form>
        
        <div className="flex h-full bg-cover bg-left">
          <img src="https://ik.imagekit.io/dashen/login" alt="Imagem de Login" className="" />
        </div>
      </div>
    </>
  );
}

export default Login;