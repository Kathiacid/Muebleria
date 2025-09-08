import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import style from "../components/Navbar.css" 

export default function Navbar() {
const [busqueda, setBusqueda] = useState("")
const navigate = useNavigate()

const manejarSubmit = (e) => {
e.preventDefault()
if (busqueda.trim() !== "") {
    navigate(`/catalogo?search=${busqueda}`)
    setBusqueda("")
}
}

return (
<div className="navbanner">
    <nav>
    <ul>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/catalogo">Catálogo</Link></li>
        <li><Link to="/sobrenosotros">Sobre Nosotros</Link></li>
    </ul>
    <form onSubmit={manejarSubmit}>
        <input
        type="text"
        placeholder="Buscar..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{
            padding: "0.5rem",
            borderRadius: "5px",
            border: "1px solid #ccc"
        }}
        />
    </form>
    </nav>
</div>
)
}
