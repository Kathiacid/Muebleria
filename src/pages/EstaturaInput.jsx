// src/pages/EstaturaInput.jsx
// src/pages/EstaturaInput.jsx

import { useContext, useState } from "react";
import { EstaturaContext } from "../components/EstaturaContext";
import { useNavigate } from "react-router-dom";
import "./estaturaInput.css";

const EstaturaInput = () => {
    const { setEstatura } = useContext(EstaturaContext);
    const [valorEstatura, setValorEstatura] = useState("");
    const navigate = useNavigate();

    const handleInput = (e) => {
        setValorEstatura(e.target.value);
    };

    const handleGuardar = () => {
        const altura = parseFloat(valorEstatura);
        if (!isNaN(altura) && altura > 0) {
            setEstatura(altura);
            // Redirige al catálogo completo después de guardar la estatura
            navigate("/catalogo-completo");
        } else {
            alert("Por favor, ingrese una estatura válida.");
        }
    };

    return (
        <div className="container-estatura">
            <div className="card-estatura">
                <h1>Bienvenido a la experiencia personalizada</h1>
                <p>
                    Para ofrecerte los muebles con las dimensiones perfectas para tu
                    hogar, necesitamos tu estatura.
                </p>
                <input
                    type="number"
                    step="0.01"
                    placeholder="Estatura en metros (ej: 1.75)"
                    value={valorEstatura}
                    onChange={handleInput}
                />
                <button onClick={handleGuardar}>Guardar y ver catálogo</button>
            </div>
        </div>
    );
};

export default EstaturaInput;