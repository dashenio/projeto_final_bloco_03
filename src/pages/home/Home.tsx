import { AuthContext } from "../../contexts/AuthContext";
import { useContext, useState, useEffect, useMemo } from "react";
import FormProduto from "../../components/produto/formproduto/FormProduto";
import CardProduto from "../../components/produto/cardproduto/CardProduto";
import type Produto from "../../models/Produto";
import { buscar } from "../../services/Service";
import { Link } from "react-router-dom";
import { SyncLoader } from "react-spinners";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const slides = [
    {
        imagem: 'https://ik.imagekit.io/dashen/caroussel_02?updatedAt=1779569578088',
        titulo: 'Sua saúde em boas mãos',
        descricao: 'Medicamentos de qualidade com orientação especializada para você e sua família.',
        posicao: 'center 30%',
    },
    {
        imagem: 'https://ik.imagekit.io/dashen/COSMETICO.jpg',
        titulo: 'Beleza & bem-estar',
        descricao: 'Cosméticos selecionados para cuidar de você de dentro para fora, todos os dias.',
        posicao: 'center center',
    },
    {
        imagem: 'https://ik.imagekit.io/dashen/delivery',
        titulo: 'Entrega rápida para todo o Brasil',
        descricao: 'Compre online com segurança e receba seus produtos no conforto da sua casa.',
        posicao: 'center 60%',
    },
];

function Home() {
    const { usuario } = useContext(AuthContext);
    
    const safeRoles = usuario?.roles || "";
    const roleUsuario = Array.isArray(safeRoles) 
        ? safeRoles.join(' ').toLowerCase() 
        : String(safeRoles).toLowerCase();

    const isAdmin = roleUsuario.includes("admin");
    const isUser  = roleUsuario.includes("user");
    
    const token = usuario?.token || "";

    const [isModalOpen, setIsModalOpen] = useState(false);
    function abrirModalNovo() { setIsModalOpen(true); }
    function fecharModal()    { setIsModalOpen(false); }

    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [isLoadingProdutos, setIsLoadingProdutos] = useState(false);

    useEffect(() => {
        if (!token) return;

        async function buscarDestaques() {
            setIsLoadingProdutos(true);
            try {
                const headerToken = token.startsWith('Bearer') ? token : `Bearer ${token}`;

                await buscar('/produtos/all', setProdutos, {
                    headers: { Authorization: headerToken }
                });
            } catch (error) {
                console.error("Erro ao buscar produtos em destaque:", error);
            } finally {
                setIsLoadingProdutos(false);
            }
        }

        buscarDestaques();
    }, [token]); 

    const produtosDestaque = useMemo(() => {
        if (!Array.isArray(produtos)) return [];

        return [...produtos]
            .sort(() => Math.random() - 0.5)
            .slice(0, 4);
    }, [produtos]);

    return (
        <div className="flex flex-col w-full h-full">
            <FormProduto 
                isOpen={isModalOpen} 
                onClose={fecharModal} 
                produtoId={undefined}
            />

            {isUser && (
                <div className="w-full bg-slate-100 pt-8">
                    <div className="container mx-auto px-4">
                        <Swiper
                            modules={[Autoplay, Pagination, Navigation]}
                            autoplay={{ delay: 4000, disableOnInteraction: false }}
                            pagination={{ clickable: true }}
                            navigation
                            loop
                            className="w-full rounded-2xl overflow-hidden shadow-lg"
                        >
                            {slides.map((slide, index) => (
                                <SwiperSlide key={index}>
                                    <div className="relative w-full h-[60vh]"> 
                                        <img
                                            src={slide.imagem}
                                            alt={slide.titulo}
                                            className="w-full h-full object-cover"
                                            style={{ objectPosition: slide.posicao }}
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-black/20" />
                                        <div className="absolute inset-0 flex flex-col items-center justify-end text-center px-6 pb-12 gap-4">
                                            <h2 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-2xl leading-tight">
                                                {slide.titulo}
                                            </h2>
                                            <p className="text-lg md:text-2xl text-slate-100 max-w-2xl drop-shadow-lg font-medium">
                                                {slide.descricao}
                                            </p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            )}

            {/* HERO CLÁSSICO — exclusivo para admin */}
            {isAdmin && (
                <div className="flex justify-center bg-cyan-100 w-full flex-1 min-h-[85vh]">
                    <div className="container grid grid-cols-1 md:grid-cols-2 text-black mx-auto px-4">
                        <div className="flex justify-center items-end order-first md:order-last">
                            <img
                                src="https://ik.imagekit.io/dashen/homefarmacia.png"
                                alt="Imagem Página Home"
                                className="w-full max-h-[80vh] object-contain object-bottom"
                            />
                        </div>
                        <div className="flex flex-col gap-4 items-center justify-center py-12 text-center md:text-left order-last md:order-first">
                            <h2 className="text-5xl font-bold">
                                Seja Bem Vindo!
                            </h2>
                            <p className="text-xl">
                                Painel de Gerenciamento de Estoque e Categorias.
                            </p>
                            <div className="flex justify-around gap-4">
                                <button 
                                    onClick={abrirModalNovo} 
                                    className="rounded text-white bg-indigo-800 px-6 py-2 hover:bg-indigo-600 transition-colors cursor-pointer font-bold"
                                >
                                    Cadastrar Produto
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* DESTAQUES — escondido para admin, visível para clientes */}
            {!isAdmin && (
                <div className="w-full bg-slate-100 py-12 flex-1">
                    <div className="container mx-auto px-4 flex flex-col gap-8">

                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-bold text-slate-800">
                                Produtos em Destaque
                            </h2>
                            <Link 
                                to="/produtos"
                                className="text-indigo-700 hover:text-indigo-500 font-semibold transition-colors"
                            >
                                Ver todos →
                            </Link>
                        </div>

                        {isLoadingProdutos && (
                            <div className="flex justify-center py-8">
                                <SyncLoader color="#312e81" size={24} />
                            </div>
                        )}

                        {!isLoadingProdutos && produtosDestaque.length === 0 && (
                            <div className="text-center py-8 text-slate-500 font-medium">
                                Nenhum produto encontrado no banco de dados.
                            </div>
                        )}

                        {!isLoadingProdutos && produtosDestaque.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {produtosDestaque.map((produto) => (
                                    <CardProduto
                                        key={produto.id}
                                        produto={produto}
                                        onEditar={() => {}}
                                        onDeletar={() => {}}
                                        simplificado={true} 
                                    />
                                ))}
                            </div>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;