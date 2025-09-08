import React, { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Catalogo from "./pages/Catalogo"
import Confirmacion from "./pages/Confirmacion"
import DetalleProducto from "./pages/DetalleProducto"

// Imports sin caracteres especiales
import Cocina from "./catalogo-item/Cocina"
import Habitacion from "./catalogo-item/Habitacion"
import Taller from "./catalogo-item/Taller"
import LivingComedor from "./catalogo-item/LivingComedor"
import Banio from "./catalogo-item/Banio"

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/confirmacion" element={<Confirmacion />} />
        <Route path="/detalleproducto" element={<DetalleProducto />} />
        
        {/* Rutas sin caracteres especiales */}
        <Route path="/catalogo/cocina" element={<Cocina />} />
        <Route path="/catalogo/habitacion" element={<Habitacion />} />
        <Route path="/catalogo/taller" element={<Taller />} />
        <Route path="/catalogo/livingcomedor" element={<LivingComedor />} /> 
        <Route path="/catalogo/banio" element={<Banio />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
