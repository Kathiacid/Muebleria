import React from 'react'
import ReactDOM from 'react-dom/client.js'
import Catalogo from './pages/Catalogo.jsx'
import Confirmacion from './pages/Confirmacion.jsx'
import DetalleProducto from './pages/DetalleProducto.jsx'
import Home from './pages/Home.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'


ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Catalogo" element={<Catalogo/>} />
        <Route Path="/Confirmacion" element={<Confirmacion/>} />
        <Route path="/DetalleProducto" element={<DetalleProducto/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
