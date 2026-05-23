
function CardNovoP() {
  return (
  
    <div className="h-full w-full flex items-center justify-center">
        
    
        <div
        className="group flex items-center justify-center border border-slate-500 
        rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer w-full h-1/2 bg-slate-200 
        opacity-80 hover:opacity-100">
        
          <div className="flex flex-col items-center justify-center gap-2">
              <img 
              src="https://ik.imagekit.io/dashen/new_file.svg" 
              alt="Ícone de criar novo produto" 
              className="w-12 h-12" 
              />
              <p className="text-xl font-bold text-slate-700 uppercase text-center leading-tight">
              Cadastrar Novo
              </p>
          </div>
 
        </div>
    </div>
  );
}

export default CardNovoP;