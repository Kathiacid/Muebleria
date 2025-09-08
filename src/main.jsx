import React, { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Catalogo from "./pages/Catalogo"
import Confirmacion from "./pages/Confirmacion"
import DetalleProducto from "./pages/DetalleProducto"

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/confirmacion" element={<Confirmacion />} />
        <Route path="/detalleproducto" element={<DetalleProducto />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)