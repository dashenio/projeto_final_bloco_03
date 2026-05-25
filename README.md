# Sistema de Gerenciamento de Farmácia - Projeto Final

<div style="display: flex; flex-direction: column; gap: 5px;">
  <div align="center">
    <img src="https://ik.imagekit.io/dashen/fpb_02/medicine.svg" height="200px">
  </div>

<div align="center">

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

</div>
</div>

## 📝 Sobre o Projeto

Este é o sistema final desenvolvido para o Bloco 03, focado na digitalização e otimização de uma farmácia. A plataforma é composta por dois pilares principais:

1. **Área Administrativa (Gestão):** Painel voltado para o controle interno, onde administradores podem gerenciar estoque, categorias e produtos.
2. **E-commerce (Cliente):** Interface voltada para o consumidor final, permitindo a visualização de produtos, busca por categorias e gerenciamento de carrinho de compras.

O objetivo deste projeto é proporcionar uma experiência fluida de ponta a ponta, desde a gestão administrativa até a jornada de compra do cliente.

---

## 🚀 Configuração e Execução Local

### Pré-requisitos

Certifique-se de ter instalado em sua máquina:

* [Node.js](https://nodejs.org/) (versão 16 ou superior)
* [Git](https://git-scm.com/)

### Passo a passo para rodar o projeto

1. **Clone o repositório:**
   
   ```bash
   git clone https://github.com/dashenio/projeto_final_bloco_03.git
   ```

2. **Acesse a pasta do projeto:**
   
   ```bash
   cd projeto_final_bloco_03
   ```

3. **Instale as dependências:**
   
   ```bash
   npm install
   ```

4. **Troque o código de Service.tsx de**
   
   ```bash
   import axios from "axios";
   
   const api = axios.create({
       baseURL: import.meta.env.VITE_API_URL
   })
   ```

**para o [link da API do backend](https://farmaciadagente.onrender.com)**

```bash
import axios from "axios";

const api = axios.create({
    baseURL: "https://farmaciadagente.onrender.com"
})
```

-----------

## 💻 Tecnologias

| Item                            | Descrição        |
| ------------------------------- | ---------------- |
| 🖥️ **Servidor**                | Node JS          |
| ⌨️ **Linguagem de programação** | TypeScript       |
| ⚛️ **Biblioteca**               | React JS         |
| ⚡ **Build**                     | Vite             |
| 🎨 **Framework de Estilização** | Tailwind CSS     |
| 🛣️ **Roteamento**              | React Router DOM |

--------

## 🤝 Contribuições

Este projeto foi desenvolvido como parte do Projeto Final do Bloco 03 do bootcamp da Generation Brasil. Para sugestões ou melhorias, sinta-se à vontade para abrir uma *Issue* ou enviar um *Pull Request*.

Desenvolvido por **[Vivian](https://github.com/dashenio).**