import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useContext, useEffect, useRef } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { EstaturaContext } from "./EstaturaContext";
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
if (!estatura) {
    navigate("/estatura");
    return;
}
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

return (
<header className="header">
    <div className="header-main">
    <div className="container">
        {/* Logo */}
        <Link to="/" className="header-logo">
        {/*<img src="/logo.png" alt="SOMA logo" width="120" height="40" />*/}
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
            <span className="menu-title catalog-trigger">
                <Link to="/catalogo" className="menu-title" onClick={() => navegarACatalogo("todos")}>
                <span className="nav-text">Catalogo</span>
                <span className="underline-right"></span>
                </Link>
            </span>
            
            {/* Dropdown Panel */}
            <div className={`dropdown-panel ${isCatalogOpen ? "active" : ""}`}>
                <div className="dropdown-panel-list">
                <div className="menu-title">
                    <Link to="/catalogo" onClick={() => navegarACatalogo("todos")}>
                    Categorias principales
                    </Link>
                </div>

                <div className="panel-list-item">
                    <Link to="/catalogo?categoria=5" onClick={() => navegarACatalogo("cocina")}>
                    Cocina
                    </Link>
                </div>

                <div className="panel-list-item">
                    <Link to="/catalogo?categoria=6" onClick={() => navegarACatalogo("baño")}>
                    Baño
                    </Link>
                </div>
                
                <div className="panel-list-item">
                    <Link to="/catalogo?categoria=6" onClick={() => navegarACatalogo("habitacion")}>
                    Habitación
                    </Link>
                </div>

                <div className="panel-list-item">
                    <Link to="/catalogo?categoria=11" onClick={() => navegarACatalogo("livingcomedor")}>
                    Living & Comedor
                    </Link>
                </div>

                </div>

                <div className="dropdown-panel-list">
                <div className="menu-title">
                    <Link to="/catalogo" onClick={() => navegarACatalogo("todos")}>
                    Otras Categorias
                    </Link>
                </div>
                <div className="panel-list-item">
                    <Link to="/catalogo?categoria=7" onClick={() => navegarACatalogo("exterior")}>
                    Exterior
                    </Link>
                </div>
                
                <div className="panel-list-item">
                    <Link to="/catalogo?categoria=9" onClick={() => navegarACatalogo("taller")}>
                    Taller
                    </Link>
                </div>

                </div>

                <div className="dropdown-panel-list">
                <div className="menu-title">
                    <a>Te podría interesar</a>
                </div>
                <div className="panel-list-item">
                    <a>
                    <Link to="/catalogo" onClick={() => navegarACatalogo("todos")}>
                    Ofertas
                    </Link>
                    </a>
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

        {/* Acciones de usuario */}
        <div className="altura-navbar">
            <i class="fas fa-ruler-vertical"></i>
        <strong className="estatura-resaltada">{estatura}m</strong>
        </div>
        
    </div>
    </div>
</header>
);
}