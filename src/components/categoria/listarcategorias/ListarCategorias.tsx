import { useContext, useEffect, useState } from "react";
import type Categoria from "../../../models/Categoria";
import { buscar } from "../../../services/Service";
import { SyncLoader } from "react-spinners";
import CardCategoria from "../cardcategoria/CardCategoria";
import { ToastAlerta } from "../../../utils/ToastAlerta";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import CardNova from "../cardnova/CardNova";

function ListarCategorias() {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [categorias, setCategorias] = useState<Categoria[]>([]);

    const { usuario, handleLogout } = useContext(AuthContext);
    const token = usuario.token;
    
    const isAdmin = usuario.roles === "admin";
    
    useEffect(() => {
        if (token === '') {
            ToastAlerta('Você precisa estar logado!', 'info');
            navigate('/');
        }
    }, [token]);   
  
    useEffect(()=> {
        buscarCategorias();
    }, []); 

    async function buscarCategorias(){
        setIsLoading(true);
        try{
            await buscar('/categorias/all', setCategorias, {
                headers: { Authorization: token }
            });
        } catch(error: any) {
            if (error.toString().includes('401')) {
                handleLogout();
            }
        } finally {
            setIsLoading(false);
        }
    }
  
    return (
    <>
       
        <div className="w-full my-4 flex justify-center">
            
            <div className="container mx-auto px-4 flex flex-col">

                {/* MUDANÇA: Estilização e centralização adicionadas ao h1 */}
                <h1 className="text-4xl font-bold text-center text-slate-800 my-6">
                    Categorias
                </h1>
                
                {isLoading && (
                    <div className="flex justify-center w-full my-8">
                        <SyncLoader color="#312e81" size={32} />
                    </div>
                )}
                
                {(!isLoading && (!categorias || categorias.length === 0)) && (
                    <div className="flex flex-col items-center gap-8 my-8 w-full">
                        <span className="text-3xl text-center font-bold text-slate-700">
                            Nenhuma categoria foi encontrada!
                        </span>
                        
                        {isAdmin && (
                            <div className="w-full max-w-sm">
                                <CardNova/>
                            </div>
                        )}
                    </div>
                )}

                {(!isLoading && categorias && categorias.length > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mt-8">
                        
                        {isAdmin && <CardNova/>}
                        
                        {
                            categorias.map((categoria) => (
                                <CardCategoria key={categoria.id} categoria={categoria}/>
                            ))
                        }
                    </div>
                )}
                
            </div>
        </div>
    </>
  )
}

export default ListarCategorias;