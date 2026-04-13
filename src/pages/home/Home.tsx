import { Link } from "react-router-dom"

function Home() {

    return (
        <>
        <div className="flex justify-center bg-cyan-100 w-full">
            
            <div className="container grid grid-cols-1 md:grid-cols-2 text-black">
                
                <div className="flex justify-center items-center pb-4 md:pb-0 order-first md:order-last">
                    <img
                    src="https://ik.imagekit.io/dashen/homefarmacia.png"
                    alt="Imagem Página Home"
                    className="w-1/2 md:w-2/3 h-1/2 md:h-2/3 object-contain"/>
                </div>


                <div className="flex flex-col gap-4 items-center justify-center py-4 text-center md:text-left order-last md:order-first">
                    <h2 className="text-5xl font-bold">
                        Seja Bem Vindo!
                    </h2>

                    <p className="text-xl">
                        Aqui você encontra medicamentos e cosméticos!
                    </p>

                <div className="flex justify-around gap-4">

                    <div className="rounded text-white bg-indigo-800 px-6 py-2 hover:bg-indigo-600">
                        <Link to='/cadastrarproduto'>Cadastrar Produto</Link>
                    </div>
                </div>
            </div>

                
            </div>
        </div>
        </>
    )
}

export default Home