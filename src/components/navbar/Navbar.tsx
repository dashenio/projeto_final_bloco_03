import { MagnifyingGlassIcon, ShoppingCartIcon, UserIcon } from "@phosphor-icons/react"


function Navbar() {


  return (
    <>
        <div className="w-full flex justify-center py-4 bg-indigo-900 text-white z-100">
            <div className="container flex justify-between text-lg mx-8 items-center">
                <div className="flex flex-row gap-2 items-center">
                  <img src="https://ik.imagekit.io/dashen/health-svgrepo-com.svg?updatedAt=1776084804891" 
                        className="w-12" />
                  <p className="text-xl font-bold">FARMÁCIA</p>
                </div>
                <form className="flex justify-center items-center flex-row gap-0.5">

                <input  type="text" 
                       id="busca"
                       name="busca"
                       placeholder="Procurar"
                       className="border-2 border-slate-700 rounded-lg p-2 bg-white text-slate-400 justify-stretch w-2xl h-8"
                />
                <button className="flex rounded-lg p-2 bg-blue-500 w-10 h-8 justify-center items-center hover:bg-blue-600">
                <MagnifyingGlassIcon size={16} color="#ffffff" weight="bold" />
                </button>
                

                </form>
                <div className="flex gap-5">
                    <p>Categorias</p>
                    <p>Cadastrar categoria</p>
                    <UserIcon size={32} color="#ffffff" weight="bold" />
                    <ShoppingCartIcon size={32} color="#ffffff" weight="bold" />  
                </div>
            </div>

        </div>
    </>
  )
}

export default Navbar