import type Categoria from "./Categoria";

export default interface Produto {
    id: number;
    nome: string;
    foto: string;
    apresentacao: string,
    quantidade: number,
    fabricante: string,
    generico: boolean,
    descricao: string,
    preco: number;
    
    categoria: Categoria | null;
    
}
