// src/pages/Catalogo.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { EstaturaContext } from '../components/EstaturaContext';
import './catalogo.css';

const Catalogo = () => {
    // Obtener la estatura del contexto
    const { estatura } = useContext(EstaturaContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Obtiene la categoría de los parámetros de búsqueda de la URL
    const categoriaURL = searchParams.get('categoria');

    // Si la estatura no está definida, redirige al usuario a la página para que la ingrese
    useEffect(() => {
        if (!estatura) {
            navigate('/');
        }
    }, [estatura, navigate]);

    // Estado para controlar la categoría activa
    const [categoriaActiva, setCategoriaActiva] = useState(categoriaURL || 'todos');
    // Estado para los filtros de subcategorías
    const [filtrosSubcategorias, setFiltrosSubcategorias] = useState([]);

    // Efecto para sincronizar con los parámetros de la URL
    useEffect(() => {
        setCategoriaActiva(categoriaURL || 'todos');
        setFiltrosSubcategorias([]);
    }, [categoriaURL]);

    // Datos de ejemplo para los productos
    const [productos] = useState([
        { id: 1, nombre: "Mesa de centro rústica", precioBase: 120, categoria: "livingcomedor", subcategoria: "mesas", imagen: "https://images.unsplash.com/photo-1540938138722-e7d69956d357", tipoMueble: "mesa" },
        { id: 2, nombre: "Silla de comedor 'Minimal'", precioBase: 80, categoria: "livingcomedor", subcategoria: "sillas", imagen: "https://images.unsplash.com/photo-1586158226065-27a810f27916", tipoMueble: "silla" },
        { id: 3, nombre: "Estantería de baño", precioBase: 150, categoria: "baño", subcategoria: "almacenamiento", imagen: "https://images.unsplash.com/photo-1620166299863-149b25b50f75", tipoMueble: "estanteria" },
        { id: 4, nombre: "Tabla de cortar de acacia", precioBase: 45, categoria: "cocina", subcategoria: "accesorios", imagen: "https://images.unsplash.com/photo-1582877977465-b1a774b786f0", tipoMueble: "accesorio" },
        { id: 5, nombre: "Banco de trabajo de pino", precioBase: 300, categoria: "taller", subcategoria: "mesas", imagen: "https://images.unsplash.com/photo-1510906594247-c0f531065191", tipoMueble: "mesa" },
        { id: 6, nombre: "Cama king size 'Elegance'", precioBase: 700, categoria: "habitacion", subcategoria: "camas", imagen: "https://images.unsplash.com/photo-1540638342410-b9d9a0d84a7e", tipoMueble: "cama" },
        { id: 7, nombre: "Espejo con marco de nogal", precioBase: 100, categoria: "baño", subcategoria: "espejos", imagen: "https://images.unsplash.com/photo-1594952044358-868725832a82", tipoMueble: "espejo" },
        { id: 8, nombre: "Isla de cocina con cajones", precioBase: 550, categoria: "cocina", subcategoria: "muebles", imagen: "https://images.unsplash.com/photo-1628169994644-24584281edde", tipoMueble: "mesa" },
        { id: 9, nombre: "Sofá de madera escandinavo", precioBase: 700, categoria: "livingcomedor", subcategoria: "sofas", imagen: "https://images.unsplash.com/photo-1615964893922-0ef3d1591873", tipoMueble: "sofa" },
        { id: 10, nombre: "Organizador de herramientas de pared", precioBase: 100, categoria: "taller", subcategoria: "organizacion", imagen: "https://images.unsplash.com/photo-1601701391295-d06efd01309f", tipoMueble: "organizacion" },
        { id: 11, nombre: "Mesa de noche de cerezo", precioBase: 110, categoria: "habitacion", subcategoria: "mesillas", imagen: "https://images.unsplash.com/photo-1619895058693-4a11b61c8a14", tipoMueble: "mesa" },
        { id: 12, nombre: "Perchero de pared", precioBase: 75, categoria: "baño", subcategoria: "accesorios", imagen: "https://images.unsplash.com/photo-1627991465223-96b1b44d3203", tipoMueble: "accesorio" },
    ]);

    // Función para calcular el precio dinámicamente según la estatura
    const calcularPrecio = (producto, estatura) => {
        const { tipoMueble, precioBase } = producto;
        if (tipoMueble === 'mesa' || tipoMueble === 'silla' || tipoMueble === 'sofa') {
            if (estatura < 1.30) return precioBase;
            if (estatura >= 1.30 && estatura < 1.70) return precioBase * 1.1; 
            if (estatura >= 1.70) return precioBase * 1.25;
        }
        return precioBase;
    };
    
    const categorias = {
        todos: { nombre: "Todos los productos", subcategorias: [] },
        baño: { nombre: "Baño", subcategorias: ["almacenamiento", "espejos", "accesorios"] },
        cocina: { nombre: "Cocina", subcategorias: ["muebles", "accesorios", "organizacion"] },
        livingcomedor: { nombre: "Living & Comedor", subcategorias: ["mesas", "sillas", "sofas", "estanterias"] },
        taller: { nombre: "Taller", subcategorias: ["mesas", "organizacion", "herramientas"] },
        habitacion: { nombre: "Habitación", subcategorias: ["camas", "mesillas", "armarios", "comodas"] }
    };

    const handleCategoriaClick = (cat) => {
        if (cat === 'todos') {
            setSearchParams({});
        } else {
            setSearchParams({ categoria: cat });
        }
        setFiltrosSubcategorias([]);
    };

    const handleSubcategoriaChange = (sub) => {
        setFiltrosSubcategorias(prev => {
            if (prev.includes(sub)) {
                return prev.filter(item => item !== sub);
            } else {
                return [...prev, sub];
            }
        });
    };

    const productosFiltrados = productos.filter(producto => {
        if (categoriaActiva !== 'todos' && producto.categoria !== categoriaActiva) {
            return false;
        }
        if (filtrosSubcategorias.length > 0) {
            return filtrosSubcategorias.includes(producto.subcategoria);
        }
        return true;
    });

    const limpiarFiltros = () => {
        setSearchParams({});
        setFiltrosSubcategorias([]);
    };
    
    return (
        <div className="catalogo-container">
            <p>Mostrando productos ajustados para tu estatura de <strong className="estatura-resaltada">{estatura}m</strong></p>
            
            <div className="catalogo-content">
                <div className="filtros-sidebar">
                    <div className="filtros-header">
                        <h2>Categorías</h2>
                        <button onClick={limpiarFiltros} className="btn-limpiar">Limpiar filtros</button>
                    </div>
                    
                    <div className="categorias-principales">
                        {Object.entries(categorias).map(([key, value]) => (
                            <div key={key} className="categoria-bloque">
                                <button
                                    className={`categoria-btn ${categoriaActiva === key ? 'activa' : ''}`}
                                    onClick={() => handleCategoriaClick(key)}
                                >
                                    {value.nombre}
                                </button>
    
                                {value.subcategorias.length > 0 && (
                                    <div className="subcategorias-list">
                                        {value.subcategorias.map(subcategoria => (
                                            <label key={subcategoria} className="filtro-checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={filtrosSubcategorias.includes(subcategoria)}
                                                    onChange={() => handleSubcategoriaChange(subcategoria)}
                                                />
                                                <span className="checkmark"></span>
                                                {subcategoria.charAt(0).toUpperCase() + subcategoria.slice(1)}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="productos-area">
                    <div className="productos-info">
                        <p>
                            {categoriaActiva === 'todos' 
                            ? 'Todos los productos' 
                            : `Categoría: ${categorias[categoriaActiva]?.nombre}`}
                            {filtrosSubcategorias.length > 0 && 
                            ` - Filtros: ${filtrosSubcategorias.map(sc => sc.charAt(0).toUpperCase() + sc.slice(1)).join(', ')}`
                            }
                        </p>
                        <span className="productos-count">{productosFiltrados.length} productos</span>
                    </div>
                    
                    <div className="productos-grid">
                        {productosFiltrados.length > 0 ? (
                            productosFiltrados.map(producto => (
                                <div key={producto.id} className="producto-card">
                                    <div className="producto-imagen">
                                        <img src={producto.imagen} alt={producto.nombre} />
                                        <span className="producto-categoria">{producto.categoria}</span>
                                    </div>
                                    <div className="producto-info">
                                        <h3>
                                            <Link to={`/producto/${producto.id}`}>{producto.nombre}</Link>
                                        </h3>
                                        <p className="producto-precio">${calcularPrecio(producto, estatura).toFixed(0)}</p>
                                        <button className="btn-agregar">Lo Quiero</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-productos">
                                <p>No hay productos que coincidan con los filtros seleccionados.</p>
                                <button onClick={limpiarFiltros} className="btn-limpiar">Ver todos los productos</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Catalogo;