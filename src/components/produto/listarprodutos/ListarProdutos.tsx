import { useContext, useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import { buscar } from "../../../services/Service";
import CardProduto from "../cardproduto/CardProduto";
import type Produto from "../../../models/Produto";
import { ToastAlerta } from "../../../utils/ToastAlerta";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import CardNovoP from "../cardnovop/CardNovoP";

function ListarProdutos() {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [produtos, setProdutos] = useState<Produto[]>([])

    const { usuario, handleLogout } = useContext(AuthContext)
    const token = usuario.token
    
    // MUDANÇA: Variável para checar se o usuário atual é admin
    const isAdmin = usuario.roles === "admin";

    useEffect(() => {
        if (token === '') {
            ToastAlerta('Você precisa estar logado!', 'info')
            navigate('/')
        }
    }, [token])


    useEffect(() => {
        buscarProdutos()    
    }, [])

    async function buscarProdutos() {
        setIsLoading(true)

        try {
            await buscar('/produtos/all', setProdutos, {
                headers: { Authorization: token }
            });

        } catch (error: any) {
            if (error.toString().includes('401')) {
                handleLogout()
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <div className="w-full my-4 flex justify-center">
                
                <div className="container mx-auto px-4 flex flex-col">
                    
                    {isLoading && (
                        <div className="flex justify-center w-full my-8">
                            <SyncLoader color="#312e81" size={32} />
                        </div>
                    )}
                    
                    {(!isLoading && (!produtos || produtos.length === 0)) && (
                        <div className="flex flex-col items-center gap-8 my-8 w-full">
                            <span className="text-3xl text-center font-bold text-slate-700">
                                Nenhum produto foi encontrado!
                            </span>
                            
                            {isAdmin && (
                                <div className="w-full max-w-sm">
                                    <CardNovoP />
                                </div>
                            )}
                        </div>
                    )}

                    {(!isLoading && produtos && produtos.length > 0) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mt-8">
                            
                            {isAdmin && <CardNovoP />}
                            
                            {
                                produtos.map((produto) => (
                                    <CardProduto key={produto.id} produto={produto}/>
                                ))
                            }
                        </div>
                    )}
                    
                </div>
            </div>
        </>
    )
}

export default ListarProdutos;