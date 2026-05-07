import { useContext, useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import { buscar } from "../../../services/Service";
import CardProduto from "../cardproduto/CardProduto";
import type Produto from "../../../models/Produto";
import { ToastAlerta } from "../../../utils/ToastAlerta";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";

function ListarProdutos() {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [produtos, setProdutos] = useState<Produto[]>([])

    const { usuario, handleLogout } = useContext(AuthContext)
    const token = usuario.token

    useEffect(() => {
        if (token === '') {
            ToastAlerta('Você precisa estar logado!', 'info')
            navigate('/')
        }
    }, [token])


    useEffect(() => {
        buscarProdutos()    
    }, [produtos.length])

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
        }finally {
            setIsLoading(false)
        }
    }

    return (
        <>
        <div className="flex justify-center w-full my-4">
        {isLoading && (
            <div className="flex justify-center min-w-full">
                    <SyncLoader
                        color="#312e81"
                        size={32}
                    />
                </div>
        )}

            
                <div className="container flex flex-col">

                    {(!isLoading && produtos.length === 0) && (
                            <span className="text-3xl text-center my-8">
                                Nenhuma Produto foi encontrada!
                            </span>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 
                                    lg:grid-cols-3 gap-8">
                            {
                                produtos.map((produto) => (
                                    <CardProduto key={produto.id} produto={produto}/>
                                ))
                            }
                    </div>
                </div>
            </div>
        </>
    )
}
export default ListarProdutos;