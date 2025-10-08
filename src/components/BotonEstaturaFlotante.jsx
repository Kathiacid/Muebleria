import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { EstaturaContext } from "./EstaturaContext";
import "./BotonEstaturaFlotante.css"; // Estilos externos

const FloatingEstaturaButton = () => {
const { estatura } = useContext(EstaturaContext);
const navigate = useNavigate();

if (!estatura) return null; // No mostrar si no hay estatura

return (
<div
    className="floating-estatura-btn"
    onClick={() => navigate("/estatura")}>
    <img
      //  src="/img/body-icon.png" // Asegúrate de poner esta imagen en public/img/
    />
    <span className="tooltip">Cambiar estatura</span>
</div>
);
};

export default FloatingEstaturaButton;
