// src/components/Navbar.jsx

import { Link, useNavigate } from "react-router-dom"
import { useState, useContext } from "react"
import { EstaturaContext } from './EstaturaContext';
import "./Navbar.css" 

export default function Navbar() {
    const { estatura } = useContext(EstaturaContext);
    const [busqueda, setBusqueda] = useState("")
    const [isCatalogOpen, setIsCatalogOpen] = useState(false)
    const navigate = useNavigate()

    const manejarSubmit = (e) => {
        e.preventDefault()
        if (busqueda.trim() !== "") {
            if (!estatura) {
                navigate("/estatura");
            } else {
                navigate(`/catalogo-completo?search=${busqueda}`);
            }
            setBusqueda("")
        }
    }

    const navegarACatalogo = (categoria) => {
        setIsCatalogOpen(false);
        // Si no hay estatura, redirige a la nueva página de estatura
        if (!estatura) {
            navigate("/estatura");
            return;
        }
        if (categoria === "todos") {
            navigate("/catalogo-completo");
        } else {
            navigate(`/catalogo-completo?categoria=${categoria}`);
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
                        <span className="catalog-trigger" onClick={() => navegarACatalogo("todos")}>
                            Catálogo
                        </span>
                        
                        {isCatalogOpen && (
                        <div className="dropdown-menu">
                            <span onClick={() => navegarACatalogo("baño")}>Baño</span>
                            <span onClick={() => navegarACatalogo("cocina")}>Cocina</span>
                            <span onClick={() => navegarACatalogo("habitacion")}>Habitación</span>
                            <span onClick={() => navegarACatalogo("livingcomedor")}>Living & Comedor</span> 
                            <span onClick={() => navegarACatalogo("taller")}>Taller</span>
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