interface CardNovaProps {
    onClick: () => void; // Prop para receber a função que abre o modal
}

function CardNova({ onClick }: CardNovaProps) {
  return (
    <div className="h-full w-full">
        {/* MUDANÇA: Substituímos o <Link> por uma <div> com cursor-pointer e onClick */}
        <div 
        onClick={onClick}
        className="group flex flex-col border border-slate-500 rounded-2xl overflow-hidden justify-between hover:shadow-xl transition-all duration-300 cursor-pointer h-full"
        >
        
        <div className="flex flex-col items-center justify-center p-4 bg-slate-200 h-full gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
            <img 
            src="https://ik.imagekit.io/dashen/new_file.svg" 
            alt="Ícone de criar nova categoria" 
            className="w-12 h-12" 
            />
            <p className="text-xl font-bold text-slate-700 uppercase text-center">
            Criar nova
            </p>
        </div>
        </div>
    </div>
  );
}

export default CardNova;