import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import "./Navbar.css" 

export default function Navbar() {
    const [busqueda, setBusqueda] = useState("")
    const [isCatalogOpen, setIsCatalogOpen] = useState(false)
    const navigate = useNavigate()

    const manejarSubmit = (e) => {
        e.preventDefault()
        if (busqueda.trim() !== "") {
            navigate(`/catalogo?search=${busqueda}`)
            setBusqueda("")
        }
    }

    return (
        <div className="nav-container">
            <nav className="navbanner">
                <ul className="lista">
                    <li><Link to="/">Inicio</Link></li>
                    
                    <li 
                        className="catalog-item"
                        onMouseEnter={() => setIsCatalogOpen(true)}
                        onMouseLeave={() => setIsCatalogOpen(false)}
                    >
                        <span className="catalog-trigger">Catálogo</span>
                        
                        {isCatalogOpen && (
                        <div className="dropdown-menu">

                            <Link to="/catalogo/banio">Baño</Link>
                            <Link to="/catalogo/cocina">Cocina</Link>
                            <Link to="/catalogo/habitacion">Habitación</Link>
                            <Link to="/catalogo/livingcomedor">Living Comedor</Link> 
                            <Link to="/catalogo/taller">Taller</Link>
                        </div>
                        )}
                    </li>
                    
                    <li><Link to="/sobrenosotros">Sobre Nosotros</Link></li>
                </ul>
                
                <form onSubmit={manejarSubmit} className="buscador">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </form>
            </nav>
        </div>
    )
}
