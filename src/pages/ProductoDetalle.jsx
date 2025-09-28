// src/pages/ProductoDetalle.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { EstaturaContext } from '../components/EstaturaContext';
import { getProductoById, getPrecioAjustado, getCategorias } from "../api";
import './ProductoDetalle.css';

const ProductoDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { estatura } = useContext(EstaturaContext);
    
    const [producto, setProducto] = useState(null);
    const [precioCalculado, setPrecioCalculado] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!estatura) {
            navigate('/');
            return;
        }
    }, [estatura, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setCargando(true);
                setError(null);
                
                // Cargar producto y categorías en paralelo
                const [productoData, categoriasData] = await Promise.all([
                    getProductoById(id),
                    getCategorias()
                ]);

                if (!productoData) {
                    setError('Producto no encontrado');
                    return;
                }

                setProducto(productoData);
                setCategorias(categoriasData);

                // Calcular precio ajustado
                if (estatura) {
                    const precio = await getPrecioAjustado(id, estatura);
                    setPrecioCalculado(precio);
                }

            } catch (error) {
                console.error('Error al cargar producto:', error);
                setError('Error al cargar el producto');
            } finally {
                setCargando(false);
            }
        };

        fetchData();
    }, [id, estatura]);

    const construirUrlImagen = (imagenPath) => {
        if (!imagenPath) return 'https://via.placeholder.com/600x400?text=Imagen+No+Disponible';
        
        if (imagenPath.startsWith('http')) {
            return imagenPath;
        }
        
        return `http://127.0.0.1:8000${imagenPath}`;
    };

    const formatearPrecio = (precio) => {
        return new Intl.NumberFormat('es-ES').format(precio);
    };

    const getNombreCategoria = (categoriaId) => {
        const categoria = categorias.find(cat => String(cat.id) === String(categoriaId));
        return categoria ? categoria.categorias : 'Sin categoría';
    };

    if (cargando) {
        return (
            <div className="cargando-container">
                <div className="cargando-spinner"></div>
                <p>Cargando producto...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-message">
                    <h2>Error</h2>
                    <p>{error}</p>
                    <Link to="/catalogo" className="btn-volver">Volver al catálogo</Link>
                </div>
            </div>
        );
    }

    if (!producto) {
        return (
            <div className="error-container">
                <div className="error-message">
                    <h2>Producto no encontrado</h2>
                    <p>El producto que buscas no existe.</p>
                    <Link to="/catalogo" className="btn-volver">Volver al catálogo</Link>
                </div>
            </div>
        );
    }

    const precioFinal = precioCalculado || producto.precio_base;
    const tieneDescuento = precioCalculado && precioCalculado !== producto.precio_base;

    return (
        <div className="producto-detalle-container">
            {/* Breadcrumb */}
            <nav className="breadcrumb">
                <Link to="/">Inicio</Link>
                <span> / </span>
                <Link to="/catalogo">Catálogo</Link>
                <span> / </span>
                <span>{producto.nombre}</span>
            </nav>

            <div className="producto-detalle-content">
                {/* Sección de imagen */}
                <div className="producto-imagen-section">
                    <div className="imagen-principal">
                        <img 
                            src={construirUrlImagen(producto.imagen)} 
                            alt={producto.nombre}
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/600x400?text=Imagen+No+Disponible';
                            }}
                        />
                    </div>
                </div>

                {/* Sección de información */}
                <div className="producto-info-section">
                    <div className="producto-header">
                        <span className="categoria-badge">
                            {getNombreCategoria(producto.categoria)}
                        </span>
                        <h1>{producto.nombre}</h1>
                        <p className="descripcion-breve">{producto.descripcion_breve}</p>
                    </div>

                    {/* Precio */}
                    <div className="precio-section">
                        <div className="precio-actual">
                            ${formatearPrecio(precioFinal)}
                        </div>
                        {tieneDescuento && (
                            <div className="precio-comparacion">
                                <span className="precio-base">
                                    Precio base: ${formatearPrecio(producto.precio_base)}
                                </span>
                                <span className="ahorro">
                                    Ahorras: ${formatearPrecio(producto.precio_base - precioFinal)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Información de estatura */}
                    <div className="estatura-info">
                        <p>
                            <strong>Precio ajustado para tu estatura:</strong> {estatura}m
                        </p>
                    </div>

                    {/* Especificaciones */}
                    <div className="especificaciones">
                        <h3>Especificaciones</h3>
                        <div className="especificaciones-grid">
                            <div className="especificacion-item">
                                <span className="especificacion-label">Tipo de mueble:</span>
                                <span className="especificacion-value">{producto.tipo_mueble}</span>
                            </div>
                            <div className="especificacion-item">
                                <span className="especificacion-label">Altura ideal:</span>
                                <span className="especificacion-value">{producto.altura} cm</span>            
                            </div>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="acciones-section">
                        {producto.stock > 0 ? (
                            <div className="botones-accion">
                                <button className="btn-principal" onClick={() => alert('Función de "Lo Quiero" en desarrollo')}>
                                    Lo Quiero
                                </button>
                                <button className="btn-secundario" onClick={() => alert('Función de contacto en desarrollo')}>
                                    Contactar para más información
                                </button>
                            </div>
                        ) : (
                            <div className="producto-agotado">
                                <p>Producto temporalmente agotado</p>
                                <button className="btn-contacto">
                                    Notificarme cuando esté disponible
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Descripción detallada */}
            <div className="descripcion-detallada-section">
                <h3>Descripción Detallada</h3>
                <div className="descripcion-content">
                    {producto.descripcion ? (
                        <p>{producto.descripcion}</p>
                    ) : (
                        <p className="sin-descripcion">No hay descripción detallada disponible para este producto.</p>
                    )}
                </div>
            </div>

            {/* Botón volver */}
            <div className="volver-section">
                <Link to="/catalogo" className="btn-volver-catalogo">
                    ← Volver al catálogo
                </Link>
            </div>
        </div>
    );
};

export default ProductoDetalle;