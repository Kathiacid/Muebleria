// src/main.jsx
import React, { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import { EstaturaProvider } from "./components/EstaturaContext"
import Navbar from "./components/Navbar"
import Home from "./pages/Home" // La nueva página de inicio
import EstaturaInput from "./pages/EstaturaInput" // La página dedicada para ingresar la estatura
import Catalogo from "./pages/Catalogo"
import Confirmacion from "./pages/Confirmacion"
import DetalleProducto from "./pages/ProductoDetalle"
import SobreNosotros from "./pages/SobreNosotros"
import BotonEstaturaFlotante from "./components/BotonEstaturaFlotante"; 

ReactDOM.createRoot(document.getElementById("root")).render(
    <StrictMode>
        <EstaturaProvider>
            <BrowserRouter>
                <Navbar />
                <BotonEstaturaFlotante />  
                <Routes>
                    {/* La página de inicio es ahora una página de bienvenida general */}
                    <Route path="/" element={<Home />} />
                    
                    {/* Esta es la nueva ruta específica para ingresar la estatura */}
                    <Route path="/estatura" element={<EstaturaInput />} />
                    
                    <Route path="/catalogo" element={<Catalogo />} />
                    
                    <Route path="/producto/:id" element={<DetalleProducto />} />

                    <Route path="/confirmacion" element={<Confirmacion />} />
                    <Route path="/sobrenosotros" element={<SobreNosotros />} />
                </Routes>
            </BrowserRouter>
        </EstaturaProvider>
    </StrictMode>
);