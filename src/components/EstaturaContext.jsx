// src/contexts/EstaturaContext.jsx

import React, { createContext, useState } from 'react';

// 1. Crea el Contexto
export const EstaturaContext = createContext();

// 2. Crea el Provider (proveedor de datos)
export const EstaturaProvider = ({ children }) => {
    // El estado que guardará la estatura. Lo inicializamos en null.
    const [estatura, setEstatura] = useState(null);

    // El valor que se compartirá con todos los componentes
    const value = { estatura, setEstatura };

    return (
        <EstaturaContext.Provider value={value}>
            {children}
        </EstaturaContext.Provider>
    );
};