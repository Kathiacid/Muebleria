import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { EstaturaContext } from '../components/EstaturaContext';
import axios from "axios";
import './catalogo.css';

const Catalogo = () => {
    const { estatura } = useContext(EstaturaContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const categoriaURL = searchParams.get('categoria');

    useEffect(() => {
        if (!estatura) {
            navigate('/');
        }
    }, [estatura, navigate]);

    const [categoriaActiva, setCategoriaActiva] = useState(categoriaURL || 'todos');
    const [filtrosSubcategorias, setFiltrosSubcategorias] = useState([]);

    useEffect(() => {
        setCategoriaActiva(categoriaURL || 'todos');
        setFiltrosSubcategorias([]);
    }, [categoriaURL]);

    // Estado de productos vacío
    const [productos, setProductos] = useState([]);

    // Traer productos desde API Django
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/productos/") 
            .then(response => {
                setProductos(response.data);
            })
            .catch(error => {
                console.error("Error al obtener productos:", error);
            });
    }, []);

    // Ajuste de precio según estatura
    const calcularPrecio = (producto, estatura) => {
        const precio = parseFloat(producto.precio_base);
        const tipoMueble = producto.categoria; // ⚠️ ojo: depende de tu API

        if (["mesa", "silla", "sofa"].includes(tipoMueble)) {
            if (estatura < 1.30) return precio;
            if (estatura >= 1.30 && estatura < 1.70) return precio * 1.1;
            if (estatura >= 1.70) return precio * 1.25;
        }
        return precio;
    };

    // Tus categorías (puedes mapear con IDs si en Django vienen como números)
    const categorias = {
        todos: { nombre: "Todos los productos", subcategorias: [] },
        1: { nombre: "Baño", subcategorias: ["almacenamiento", "espejos", "accesorios"] },
        2: { nombre: "Cocina", subcategorias: ["muebles", "accesorios", "organizacion"] },
        3: { nombre: "Living & Comedor", subcategorias: ["mesas", "sillas", "sofas", "estanterias"] },
        4: { nombre: "Taller", subcategorias: ["mesas", "organizacion", "herramientas"] },
        5: { nombre: "Habitación", subcategorias: ["camas", "mesillas", "armarios", "comodas"] }
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
        if (categoriaActiva !== 'todos' && String(producto.categoria) !== String(categoriaActiva)) {
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
                            ` - Filtros: ${filtrosSubcategorias.map(sc => sc.charAt(0).toUpperCase() + sc.slice(1)).join(', ')}`}
                        </p>
                        <span className="productos-count">{productosFiltrados.length} productos</span>
                    </div>
                    
                    <div className="productos-grid">
                        {productosFiltrados.length > 0 ? (
                            productosFiltrados.map(producto => (
                                <div key={producto.id} className="producto-card">
                                    <div className="producto-imagen">
                                        <img 
                                            src={producto.imagen && producto.imagen.startsWith("http") 
                                                ? producto.imagen 
                                                : `http://127.0.0.1:8000${producto.imagen}`} 
                                            alt={producto.nombre} 
                                        />
                                        <span className="producto-categoria">
                                            {categorias[String(producto.categoria)]?.nombre || "Sin categoría"}
                                        </span>
                                    </div>
                                    <div className="producto-info">
                                        <h3>
                                            <Link to={`/producto/${producto.id}`}>{producto.nombre}</Link>
                                        </h3>
                                        <p>{producto.descripcion}</p>
                                        <p className="producto-precio">
                                            ${calcularPrecio(producto, estatura).toFixed(0)}
                                        </p>
                                        <p>Stock: {producto.stock}</p>
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
