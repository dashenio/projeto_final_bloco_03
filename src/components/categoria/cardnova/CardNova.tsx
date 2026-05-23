import { Link } from "react-router-dom";

function CardNova() {
  return (
    <div className="h-full w-full">
        <Link 
        to="/cadastrarcategoria" 
        className="group flex flex-col border border-slate-200 rounded-2xl overflow-hidden justify-between hover:shadow-xl transition-all duration-300 cursor-pointer h-full"
        >
        
        <div className="flex flex-col items-center justify-center p-4 bg-slate-200 h-full gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
            <img 
            src="https://ik.imagekit.io/dashen/new_file.svg" 
            alt="Ícone de criar nova categoria" 
            className="w-12 h-12" 
            />
            {/* MUDANÇA: Fonte um pouco menor (text-xl) */}
            <p className="text-xl font-bold text-slate-700 uppercase text-center">
            Criar nova
            </p>
        </div>
        </Link>
    </div>
  );
}

export default CardNova;