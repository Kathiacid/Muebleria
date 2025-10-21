// src/pages/EstaturaInput.jsx

import { useContext, useState } from "react";
// ⚠️ Importamos resetEstatura del contexto
import { EstaturaContext } from "../components/EstaturaContext"; 
import { useNavigate } from "react-router-dom";
import "./estaturaInput.css";

const EstaturaInput = () => {
    // ⚠️ Importamos setEstatura, estatura (para saber si existe), y resetEstatura
    const { estatura, setEstatura, resetEstatura } = useContext(EstaturaContext);
    const [valorEstatura, setValorEstatura] = useState("");
    const [warning, setWarning] = useState("");
    const navigate = useNavigate();

    const handleInput = (e) => {
        const valor = e.target.value;
        setValorEstatura(valor);

        const altura = parseFloat(valor);

        // ⚠️ Validaciones:
        if (isNaN(altura)) {
            setWarning("");
            return;
        }

        if (altura < 1.0) {
            setWarning("⚠️ La estatura mínima es de 1.0 metros.");
        } else if (altura > 2.5) {
            setWarning("⚠️ La estatura máxima permitida es de 2.5 metros.");
        } else {
            setWarning("");
        }
    };

    const handleGuardar = () => {
        const altura = parseFloat(valorEstatura);

        if (isNaN(altura)) {
            alert("Por favor, ingrese una estatura válida.");
            return;
        }

        if (altura < 1.0) {
            alert("La estatura mínima es de 1.0 metros.");
            return;
        }

        if (altura > 2.5) {
            alert("La estatura máxima es de 2.5 metros.");
            return;
        }

        setEstatura(altura);
        navigate("/catalogo");
    };

    // Función que llama a resetEstatura y redirige a Home
    const handleReset = () => {
        resetEstatura();
        navigate("/"); // Redirige a Home después de resetear para mayor claridad
    };

    return (
        <div className="container-estatura">
            <div className="card-estatura">
                <h1>Bienvenido a la experiencia personalizada</h1>
                <p>
                    Para ofrecerte los muebles con las dimensiones perfectas para tu hogar,
                    necesitamos tu estatura.
                </p>

                <input
                    type="number"
                    step="0.01"
                    min="1.0"
                    max="2.5"
                    placeholder="Estatura en metros (ej: 1.75)"
                    value={valorEstatura}
                    onChange={handleInput}
                />

                {/* ⚠️ Mensaje de advertencia visual */}
                {warning && <p className="warning-text">{warning}</p>}

                <button onClick={handleGuardar}>Guardar y ver catálogo</button>

                {/* ------------------------------------------- */}
                {/* 🆕 BOTÓN PARA ELIMINAR ESTATURA (TEST) */}
                {/* Solo se muestra si ya hay una estatura registrada */}
                {estatura && (
                    <button 
                        onClick={handleReset} 
                        className="reset-button"
                        style={{ marginTop: '15px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}
                    >
                        Resetear/Eliminar Estatura ({estatura}m)
                    </button>
                )}
                {/* ------------------------------------------- */}

            </div>
        </div>
    );
};

export default EstaturaInput;