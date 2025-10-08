import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useContext, useEffect, useRef } from "react";
import { EstaturaContext } from "./EstaturaContext";
import "./Navbar.css";

export default function Navbar() {
const { estatura } = useContext(EstaturaContext);
const [busqueda, setBusqueda] = useState("");
const [isCatalogOpen, setIsCatalogOpen] = useState(false);
const navigate = useNavigate();
const location = useLocation();

const navRef = useRef(null);
const selectorRef = useRef(null);

// 📍 Función para mover el selector
const moverSelector = () => {
const activeItem = navRef.current?.querySelector(".active");
const selector = selectorRef.current;

if (activeItem && selector) {
    const { left, top, width, height } = activeItem.getBoundingClientRect();
    const parentRect = navRef.current.getBoundingClientRect();

    selector.style.left = `${left - parentRect.left}px`;
    selector.style.top = `${top - parentRect.top}px`;
    selector.style.width = `${width}px`;
    selector.style.height = `${height}px`;
}
};

// Mover el selector cuando cambia la ruta o tamaño de ventana
useEffect(() => {
const timeout = setTimeout(moverSelector, 50);
window.addEventListener("resize", moverSelector);
return () => {
    clearTimeout(timeout);
    window.removeEventListener("resize", moverSelector);
};
}, [location.pathname]);

const manejarSubmit = (e) => {
e.preventDefault();
if (busqueda.trim() !== "") {
    if (!estatura) {
    navigate("/estatura");
    } else {
    navigate(`/catalogo-completo?search=${busqueda}`);
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
    navigate("/catalogo-completo");
} else {
    navigate(`/catalogo-completo?categoria=${categoria}`);
}
};

return (
<nav className="navbar-mainbg">
    <div className="navbar-logo">Navbar</div>

    <ul className="navbar-nav" ref={navRef}>
    {/* El selector animado */}
    <div className="hori-selector" ref={selectorRef}>
        <div className="left"></div>
        <div className="right"></div>
    </div>

    <li className={location.pathname === "/" ? "active" : ""}>
        <Link to="/">Inicio</Link>
    </li>
<li
className={`catalog-item ${
location.pathname.includes("catalogo") ? "active" : ""
}`}
onMouseEnter={() => setIsCatalogOpen(true)}
onMouseLeave={() => setIsCatalogOpen(false)}
>
<span
className="catalog-trigger"
onClick={() => navegarACatalogo("todos")}
>
Catálogo
</span>

<div
className={`dropdown-menu ${isCatalogOpen ? "show" : ""}`}
onMouseEnter={() => setIsCatalogOpen(true)}
onMouseLeave={() => setIsCatalogOpen(false)}
>
<span onClick={() => navegarACatalogo("baño")}>Baño</span>
<span onClick={() => navegarACatalogo("cocina")}>Cocina</span>
<span onClick={() => navegarACatalogo("habitacion")}>Habitación</span>
<span onClick={() => navegarACatalogo("livingcomedor")}>Living & Comedor</span>
<span onClick={() => navegarACatalogo("taller")}>Taller</span>
</div>
</li>


    <li className={location.pathname === "/sobrenosotros" ? "active" : ""}>
        <Link to="/sobrenosotros">Sobre Nosotros</Link>
    </li>
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
);
}
