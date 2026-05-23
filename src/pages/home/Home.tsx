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
    const { usuario, isHydrated } = useContext(AuthContext);
    const isAdmin = usuario.roles === "admin";
    const isUser  = usuario.roles === "user";
    const token   = usuario.token;

    const [isModalOpen, setIsModalOpen] = useState(false);
    function abrirModalNovo() { setIsModalOpen(true); }
    function fecharModal()    { setIsModalOpen(false); }

    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [isLoadingProdutos, setIsLoadingProdutos] = useState(false);

    useEffect(() => {
        if (!isHydrated || !isUser) return;

        async function buscarDestaques() {
            setIsLoadingProdutos(true);
            try {
                await buscar('/produtos/all', setProdutos, {
                    headers: { Authorization: token }
                });
            } catch {
                // silencioso — home não deve deslogar
            } finally {
                setIsLoadingProdutos(false);
            }
        }

        buscarDestaques();
    }, [isHydrated, isUser]);

    const produtosDestaque = useMemo(() => {
        return [...produtos]
            .sort(() => Math.random() - 0.5)
            .slice(0, 4);
    }, [produtos]);

    return (
        <>
            <FormProduto 
                isOpen={isModalOpen} 
                onClose={fecharModal} 
                produtoId={undefined}
            />

            {/* CAROUSEL + DESTAQUES — apenas para user */}
            {isUser && (
                <>
                    <div className="w-full">
                        <Swiper
                            modules={[Autoplay, Pagination, Navigation]}
                            autoplay={{ delay: 4000, disableOnInteraction: false }}
                            pagination={{ clickable: true }}
                            navigation
                            loop
                            className="w-8/10"
                        >
                            {slides.map((slide, index) => (
                            <SwiperSlide key={index}>
                                {/* MUDANÇA: Substitua o height fixo por h-[60vh] ou um valor fixo como h-[500px] */}
                                <div className="relative w-full h-[60vh]" > 
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

                    {/* DESTAQUES */}
                    <div className="w-full bg-slate-100 py-12">
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

                            {!isLoadingProdutos && produtosDestaque.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {produtosDestaque.map((produto) => (
                                        <CardProduto
                                            key={produto.id}
                                            produto={produto}
                                            onEditar={() => {}}
                                            onDeletar={() => {}}
                                        />
                                    ))}
                                </div>
                            )}

                        </div>
                    </div>
                </>
            )}

            {/* HERO CLÁSSICO — para admin */}
            {!isUser && (
                <div className="flex justify-center bg-cyan-100 w-full">
                    <div className="container grid grid-cols-1 md:grid-cols-2 text-black">
                        <div className="flex justify-center items-center pb-4 md:pb-0 order-first md:order-last">
                            <img
                                src="https://ik.imagekit.io/dashen/homefarmacia.png"
                                alt="Imagem Página Home"
                                className="w-1/2 md:w-2/3 h-1/2 md:h-2/3 object-contain"
                            />
                        </div>
                        <div className="flex flex-col gap-4 items-center justify-center py-4 text-center md:text-left order-last md:order-first">
                            <h2 className="text-5xl font-bold">
                                Seja Bem Vindo!
                            </h2>
                            <p className="text-xl">
                                Aqui você encontra medicamentos e cosméticos!
                            </p>
                            <div className="flex justify-around gap-4">
                                {isAdmin && (
                                    <button 
                                        onClick={abrirModalNovo} 
                                        className="rounded text-white bg-indigo-800 px-6 py-2 hover:bg-indigo-600 transition-colors cursor-pointer"
                                    >
                                        Cadastrar Produto
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Home;