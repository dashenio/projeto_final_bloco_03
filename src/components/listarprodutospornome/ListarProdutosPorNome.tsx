import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { PacmanLoader } from "react-spinners"
import type Produto from "../../models/Produto"
import { buscar} from "../../services/Service"
import CardProduto from "../produto/cardproduto/CardProduto"
import { AuthContext } from "../../contexts/AuthContext"
import { ToastAlerta } from "../../utils/ToastAlerta"


function ListarProdutosPorNome() {

	const navigate = useNavigate();

	const [produtos, setProdutos] = useState<Produto[]>([]) // Todos os Produtos
	const [produtosFiltrados, setProdutosFiltrados] = useState<Produto[]>([]) // Produtos Filtrados
	const [filtroPreco, setFiltroPreco] = useState<string>("")
	const [isLoading, setIsLoading] = useState(false)

	const { nome } = useParams<{ nome: string }>()

	const { usuario } = useContext(AuthContext)
	const token = usuario.token
			
	useEffect(() => {
		if (token === '') {
			ToastAlerta('Você precisa estar logado!', 'info')
			navigate('/login')
		}
	}, [token]) 	     

	async function buscarTodosProdutos() {
		try {
			setIsLoading(true)
			await buscar("/produtos/all", setProdutos, {
                    headers: { Authorization: token }
            });

		} catch (error) {
			alert("Erro ao carregar produtos!")

		} finally {
			setIsLoading(false)
		}
	}

	function filtrarProdutos() {
		let produtosFiltrados = produtos

		
		if (produtosFiltrados && nome){
			produtosFiltrados = produtosFiltrados.filter((produto) =>
				produto.nome.toUpperCase().includes(nome.toUpperCase())
			)
		}

		if (filtroPreco) {
			produtosFiltrados = produtosFiltrados.filter((produto) => {
				const preco = produto.preco
				if (filtroPreco === "5") return preco <= 5
				if (filtroPreco === "10") return preco > 10 && preco <= 100
				if (filtroPreco === "100") return preco > 100
				return true
			})
		}

		setProdutosFiltrados(produtosFiltrados)
	}

	function limparFiltroPreco() {
		setFiltroPreco("")
		const radioButtons = document.getElementsByName("preco")
		radioButtons.forEach((radio) => {
			;(radio as HTMLInputElement).checked = false
		})
	}

	// Carrega todos os produtos na primeira vez
	useEffect(() => {
		buscarTodosProdutos()
	}, [])

	// Filtra os produtos de acordo com o termo da busca
	useEffect(() => {
		filtrarProdutos()
	}, [nome, produtos, filtroPreco])

	return (
		<>
			{/* Loading centralizado na tela */}
			{isLoading && (
				<div className="flex justify-center items-center min-h-screen">
					<PacmanLoader
						color="#0D9488"
						margin={0}
						size={80}
						speedMultiplier={2}
						aria-label="Pacman-loading"
					/>
				</div>
			)}

			{!isLoading && (
				<div className="flex justify-center mt-4 md:mt-6 bg-gray-50 min-h-screen">
					<div className="container flex flex-col m-2 md:my-0">
						{/* Título da busca */}
						<h1 className="text-2xl md:text-4xl text-center my-4 md:my-6 px-4">
							Resultados da busca por{" "}
							<span className="italic text-teal-800 font-semibold">"{nome}"</span>
						</h1>

						{/* Barra Horizontal de Filtros */}
						<div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-200 mx-2 md:mx-4 mb-6">
							<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
								{/* Título e Badge */}
								<div className="flex items-center gap-3">
									<h3 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 text-teal-600"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
												clipRule="evenodd"
											/>
										</svg>
										Filtros
									</h3>
									{filtroPreco && (
										<span className="text-xs bg-teal-100 text-teal-800 px-2.5 py-1 rounded-full font-medium">
											1 ativo
										</span>
									)}
								</div>

								{/* Container dos Filtros de Preço */}
								<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-6">
									<span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
										Preço:
									</span>
									
									<div className="flex flex-wrap items-center gap-3 md:gap-5">
										<label className="flex items-center gap-2 cursor-pointer group">
											<input
												type="radio"
												name="preco"
												value="200"
												onChange={(e) => setFiltroPreco(e.target.value)}
												className="w-4 h-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
											/>
											<span className="text-sm text-gray-700 group-hover:text-teal-700 transition-colors whitespace-nowrap">
												Até R$ 200
											</span>
										</label>

										<label className="flex items-center gap-2 cursor-pointer group">
											<input
												type="radio"
												name="preco"
												value="500"
												onChange={(e) => setFiltroPreco(e.target.value)}
												className="w-4 h-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
											/>
											<span className="text-sm text-gray-700 group-hover:text-teal-700 transition-colors whitespace-nowrap">
												R$ 200 - R$ 500
											</span>
										</label>

										<label className="flex items-center gap-2 cursor-pointer group">
											<input
												type="radio"
												name="preco"
												value="m500"
												onChange={(e) => setFiltroPreco(e.target.value)}
												className="w-4 h-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
											/>
											<span className="text-sm text-gray-700 group-hover:text-teal-700 transition-colors whitespace-nowrap">
												Acima de R$ 500
											</span>
										</label>
									</div>

									{/* Botão Limpar Filtros */}
									{filtroPreco && (
										<button
											className="px-4 py-2 font-semibold text-sm text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors border border-teal-200 whitespace-nowrap"
											onClick={limparFiltroPreco}
										>
											Limpar Filtros
										</button>
									)}
								</div>
							</div>
						</div>

						{/* Contador de resultados */}
						{produtosFiltrados.length > 0 && (
							<div className="mb-4 px-2 md:px-4">
								<p className="text-sm md:text-base text-gray-600">
									<span className="font-semibold text-gray-800">
										{produtosFiltrados.length}
									</span>{" "}
									{produtosFiltrados.length === 1 ? "produto encontrado" : "produtos encontrados"}
								</p>
							</div>
						)}

						{/* Grid de Produtos ou Estado Vazio */}
						<main className="px-2 md:px-4">
							{/* Mensagem quando não há produtos */}
							{produtosFiltrados.length === 0 && (
								<div className="flex flex-col items-center justify-center py-12 md:py-20 px-4">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-16 w-16 md:h-20 md:w-20 text-gray-300 mb-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={1.5}
											d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									<h2 className="text-xl md:text-2xl font-semibold text-gray-600 mb-2 text-center">
										Nenhum produto encontrado
									</h2>
									<p className="text-sm md:text-base text-gray-500 text-center">
										Tente ajustar os filtros ou busque por outro termo
									</p>
								</div>
							)}

							{/* Grid de Cards de Produtos */}
							{produtosFiltrados.length > 0 && (
								<div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mb-4 md:mb-8">
									{produtosFiltrados.map((produto) => (
										<CardProduto key={produto.id} produto={produto} />
									))}
								</div>
							)}
						</main>
					</div>
				</div>
			)}
		</>
	)
}

export default ListarProdutosPorNome