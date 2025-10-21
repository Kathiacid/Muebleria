// src/components/Navbar.jsx

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useContext, useEffect, useRef } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { EstaturaContext } from './EstaturaContext'; 
import "./Navbar.css";

export default function Navbar() {
    const { estatura } = useContext(EstaturaContext);
    const [busqueda, setBusqueda] = useState("");
    const [isCatalogOpen, setIsCatalogOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const navRef = useRef(null);
    const catalogRef = useRef(null);

    const manejarSubmit = (e) => {
        e.preventDefault();
        if (busqueda.trim() !== "") {
            // Verifica estatura antes de buscar
            if (!estatura) {
                navigate("/estatura");
            } else {
                navigate(`/catalogo?search=${busqueda}`);
            }
            setBusqueda("");
        }
    };

    const navegarACatalogo = (categoria) => {
        setIsCatalogOpen(false);
        // 1. VERIFICACIÓN DE ESTATURA
        if (!estatura) {
            navigate("/estatura");
            return; // Detiene la función y redirige si no hay estatura
        }

        // 2. NAVEGACIÓN (Solo si la estatura existe)
        if (categoria === "todos") {
            navigate("/catalogo");
        } else {
            navigate(`/catalogo?categoria=${categoria}`);
        }
    };

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (catalogRef.current && !catalogRef.current.contains(event.target)) {
                setIsCatalogOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Determinar si un item está activo
    const isItemActive = (path) => {
        if (path === "/catalogo") {
            return location.pathname.includes("catalogo");
        }
        return location.pathname === path;
    };
    
    // Función para cambiar la estatura, si se hace clic en el indicador
    const handleEstaturaClick = () => {
        if (estatura === null) {
            navigate("/estatura");
        } else {
            // Si quieres permitir cambiarla, navega a una página de configuración o a estatura
            // Por ahora, solo navegaremos si no está puesta.
        }
    }


    return (
        <header className="header">
            <div className="header-main">
                <div className="container">
                    {/* Logo */}
                    <Link to="/" className="header-logo">
                        <h2>SOMA</h2>
                    </Link>

                    {/* Navegación Desktop */}
                    <nav className="desktop-navigation-menu">
                        <ul className="desktop-menu-category-list" ref={navRef}>
                            <li className={`menu-category ${isItemActive("/") ? "active" : ""}`}>
                                <Link to="/" className="menu-title">
                                    <span className="nav-text">Inicio</span>
                                    <span className="underline-right"></span>
                                </Link>
                            </li>

                            <li 
                                className={`menu-category ${isItemActive("/catalogo") ? "active" : ""}`}
                                ref={catalogRef}
                                onMouseEnter={() => setIsCatalogOpen(true)}
                                onMouseLeave={() => setIsCatalogOpen(false)}
                            >
                                {/* Clic en el Título Principal del Catálogo: USA ONCLICK */}
                                <span 
                                    className="menu-title catalog-trigger"
                                    onClick={() => navegarACatalogo("todos")}
                                >
                                    <span className="nav-text">Catálogo</span>
                                    <span className="underline-right"></span>
                                </span>
                                
                                {/* Dropdown Panel */}
                                <div className={`dropdown-panel ${isCatalogOpen ? "active" : ""}`}>
                                    
                                    {/* COLUMNA 1 */}
                                    <div className="dropdown-panel-list">
                                        <div className="menu-title">
                                            <span onClick={() => navegarACatalogo("todos")}>
                                                Categorias principales
                                            </span>
                                        </div>

                                        {/* Ítems: Cambiados a <span> con onClick */}
                                        <div className="panel-list-item">
                                            <span onClick={() => navegarACatalogo("cocina")}>
                                                Cocina
                                            </span>
                                        </div>
                                        <div className="panel-list-item">
                                            <span onClick={() => navegarACatalogo("baño")}>
                                                Baño
                                            </span>
                                        </div>
                                        <div className="panel-list-item">
                                            <span onClick={() => navegarACatalogo("habitacion")}>
                                                Habitación
                                            </span>
                                        </div>
                                        <div className="panel-list-item">
                                            <span onClick={() => navegarACatalogo("livingcomedor")}>
                                                Living & Comedor
                                            </span>
                                        </div>
                                    </div>

                                    {/* COLUMNA 2 */}
                                    <div className="dropdown-panel-list">
                                        <div className="menu-title">
                                            <span onClick={() => navegarACatalogo("todos")}>
                                                Otras Categorias
                                            </span>
                                        </div>
                                        
                                        <div className="panel-list-item">
                                            <span onClick={() => navegarACatalogo("exterior")}>
                                                Exterior
                                            </span>
                                        </div>
                                        
                                        <div className="panel-list-item">
                                            <span onClick={() => navegarACatalogo("taller")}>
                                                Taller
                                            </span>
                                        </div>

                                    </div>

                                    {/* COLUMNA 3 */}
                                    <div className="dropdown-panel-list">
                                        <div className="menu-title">
                                            <span>Te podría interesar</span>
                                        </div>
                                        <div className="panel-list-item">
                                            <span onClick={() => navegarACatalogo("ofertas")}>
                                                Ofertas
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </li>

                            <li className={`menu-category ${isItemActive("/sobrenosotros") ? "active" : ""}`}>
                                <Link to="/sobrenosotros" className="menu-title">
                                    <span className="nav-text">Sobre Nosotros</span>
                                    <span className="underline-right"></span>
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* Buscador */}
                    <div className="header-search-container">
                        <form onSubmit={manejarSubmit}>
                            <input 
                                type="text" 
                                className="search-field" 
                                placeholder="Buscar productos..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                            <button type="submit" className="search-btn">
                                <i className="fas fa-search"></i>
                            </button>
                        </form>
                    </div>

                    {/* Acciones de usuario / Indicador de Estatura */}
                    <div className="altura-navbar" onClick={handleEstaturaClick}>
                        <i className="fas fa-ruler-vertical"></i>
                        <strong className="estatura-resaltada">
                            {estatura !== null ? `${estatura}m` : 'Ingresar'}
                        </strong>
                    </div>
                    
                </div>
            </div>
        </header>
    );
}