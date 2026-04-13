
import Footer from "./components/footer/Footer"
import Navbar from "./components/navbar/Navbar"
import Home from "./pages/home/Home"


function App() {
  return (
    <>
    <div className="min-h-screen flex flex-col">
      <Navbar/>
      <div className="flex flex-1">
        <Home/>
      </div>
      <Footer/>
    </div>
  
  
    </>
  )      
}

export default App