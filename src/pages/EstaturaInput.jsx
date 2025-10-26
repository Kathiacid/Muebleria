// src/pages/EstaturaInput.jsx
import { useContext, useState, useRef } from "react"; 
import { EstaturaContext } from "../components/EstaturaContext"; 
import { useNavigate } from "react-router-dom";
import "./estaturaInput.css";

const EstaturaInput = () => {
    const { estatura, setEstatura, resetEstatura } = useContext(EstaturaContext);
    const [valorEstatura, setValorEstatura] = useState("");
    const [warning, setWarning] = useState("");
    const navigate = useNavigate();
    
    // Referencia para el avatar que se escalará en vivo
    const liveAvatarRef = useRef(null); 

    // Lógica de escala (extraída de tu código Vanilla JS)
    const applyStatureEffect = (statureMeters) => {
        const avatar = liveAvatarRef.current;
        if (!avatar) return;

        // Convierte metros a centímetros para la fórmula de escala
        const statureCmAdjusted = statureMeters * 100;

        // **Lógica de Escala Basada en Estatura**
        const minStature = 100; // 1.0m
        const maxStature = 250; // 2.5m
        
        // Normalizamos la altura para escalarla (rango 0.7 a 1.3)
        const scaleFactor = 0.7 + (statureCmAdjusted - minStature) / (maxStature - minStature) * 0.6;
        
        // Aplicamos la escala vertical
        avatar.style.transform = `scaleY(${scaleFactor})`;
    };


    const handleInput = (e) => {
        const valor = e.target.value;
        
        // 1. Limpieza de entrada
        const limpio = valor.replace(/,/g, '.').replace(/[^0-9.]/g, ''); 
        
        // 2. Asegura que solo haya un punto decimal
        const partes = limpio.split('.');
        let valorAjustado;
        if (partes.length > 2) {
            valorAjustado = partes[0] + '.' + partes.slice(1).join('');
        } else {
            valorAjustado = limpio;
        }
        setValorEstatura(valorAjustado);

        const altura = parseFloat(valorAjustado);

        if (isNaN(altura) || altura === 0) {
            setWarning("");
            // Resetear escala del avatar cuando el input está vacío/inválido
            if (liveAvatarRef.current) {
                liveAvatarRef.current.style.transform = `scaleY(1)`; // Escala por defecto
            }
            return;
        }

        // Aplicar el efecto de escala en vivo
        applyStatureEffect(altura); 

        // 3. Validación de rango (1.0m a 2.5m)
        if (altura < 1.0) {
            setWarning("⚠️ La estatura mínima para esta experiencia es de 1.0 metros.");
        } else if (altura > 2.5) {
            setWarning("⚠️ La estatura máxima permitida es de 2.5 metros.");
        } else {
            setWarning("");
        }
    };

    const handleGuardar = () => {
        const altura = parseFloat(valorEstatura);

        if (isNaN(altura) || altura < 1.0 || altura > 2.5) {
            alert("Por favor, ingrese una estatura válida entre 1.0 y 2.5 metros.");
            return;
        }

        // Implementación de la animación de salida (Zoom Out)
        const card = document.querySelector('.card-soma-input');
        if (card) {
             card.classList.add('animate-out-zoom');
        }
       
        // Espera a que termine la animación (0.7s) antes de navegar
        setTimeout(() => {
            setEstatura(altura);
            navigate("/catalogo");
        }, 700); 
    };

    const handleReset = () => {
        resetEstatura();
        navigate("/");
    };

    return (
        <div className="soma-container-full futuristic-background-soma">
            
            <div className="card-soma-input fade-in-soma">
                
                <h1 className="title-soma-glow">
                    <span className="logo-text-soma">SOMA</span> Experience
                </h1>
                
                <p className="subtitle-soma-welcome slide-up-soma">
                    Bienvenido a una nueva perspectiva. <br/>
                    Ingresa tu estatura (metros) para personalizar tu vista.
                </p>
                
                {/* ÁREA DE VISUALIZACIÓN EN VIVO: Escala con el input */}
                <div className="live-visualizer-area slide-up-soma" style={{animationDelay: '0.2s'}}>
                    <div className="reference-line"></div>
                    {/* Avatar Referenciado con useRef */}
                    <div ref={liveAvatarRef} className="live-avatar">
                        <span>🧍</span></div>
                    {/* Objeto de referencia estático (una regla o mueble pequeño) */}
                    
                </div>

                {/* Contenedor del Input */}
                <div className="stature-input-group slide-up-soma" style={{animationDelay: '0.7s'}}>
                    <input
                        className="stature-input-field" 
                        type="text" 
                        placeholder="Estatura en metros (ej: 1.75)"
                        value={valorEstatura}
                        onChange={handleInput}
                        onFocus={(e) => e.target.classList.add('focused-glow')}
                        onBlur={(e) => e.target.classList.remove('focused-glow')}
                    />
                    <span className="input-unit">MTS</span> 
                </div>

                {warning && <p className="warning-text-soma">{warning}</p>}

                {/* 1. Botón Principal (Entrar a SOMA) */}
                <button 
                    onClick={handleGuardar} 
                    className="button-enter-soma scale-in-soma" 
                    disabled={!!warning || !valorEstatura || isNaN(parseFloat(valorEstatura))}
                    style={{animationDelay: '1.2s'}}
                >
                    {estatura ? "Actualizar y Entrar" : "Entrar a SOMA"}
                    <span className="icon-portal">→</span>
                </button>

                {/* 2. Botón de Reset/Eliminar (Ahora justo debajo) */}
                {estatura && (
                    <button 
                        onClick={handleReset} 
                        className="reset-button-soma"
                    >
                        Resetear Estatura ({estatura}m)
                    </button>
                )}
            </div>
        </div>
    );
};

export default EstaturaInput;