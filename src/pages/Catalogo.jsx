import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { EstaturaContext } from '../components/EstaturaContext';
import { getProductos, getCategorias, getPrecioAjustado, getProductosEnOferta } from "../api"; 
import './catalogo.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


const Catalogo = () => {
    const { estatura } = useContext(EstaturaContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const categoriaURL = searchParams.get('categoria');
    const searchTerm = searchParams.get('search')?.toLowerCase() || "";

    useEffect(() => {
        if (!estatura) {
            navigate('/');
        }
    }, [estatura, navigate]);

    const [categoriaActiva, setCategoriaActiva] = useState(categoriaURL || 'todos');
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        const fetchProductos = async () => {
            if (!estatura) return;

            setProductos([]); 
            setCargando(true);

            try {
                let data;

                if (categoriaActiva === 'ofertas') {

                    data = await getProductosEnOferta();
                } else {

                    data = await getProductos();
                }
                
                const productosConPrecio = await Promise.all(
                    data.map(async (prod) => {
                        const precioInfo = await getPrecioAjustado(prod.id, parseFloat(estatura));

                        const precioCalculadoFinal = precioInfo ? precioInfo.precioFinal : prod.precio_base;

                        return {
                            ...prod,
                            precio_calculado: precioCalculadoFinal,
                            precio_info: precioInfo, 
                        };
                    })
                );

                setProductos(productosConPrecio);
            } catch (error) {
                console.error("Error al cargar productos:", error);
            } finally {
                setCargando(false);
            }
        };

        fetchProductos();

    }, [estatura, categoriaActiva]); 

    useEffect(() => {
        const fetchCategorias = async () => {
            const data = await getCategorias();
            

            const ofertasId = 'ofertas';
            const ofertasData = { id: ofertasId, categorias: '🔥 Ofertas' };

            const categoriasFinal = [ofertasData, ...data.filter(c => c.id !== ofertasId)];

            setCategorias(categoriasFinal);
        };
        fetchCategorias();
    }, []);


    useEffect(() => {
        setCategoriaActiva(categoriaURL || 'todos');
    }, [categoriaURL]);

    const productosFiltrados = productos.filter(producto => {
        
        if (categoriaActiva === 'ofertas') {
            return searchTerm === "" || producto.nombre.toLowerCase().includes(searchTerm);
        }
        

        const coincideCategoria = categoriaActiva === 'todos' || String(producto.categoria) === String(categoriaActiva);
        const coincideBusqueda = searchTerm === "" || producto.nombre.toLowerCase().includes(searchTerm);
        
        return coincideCategoria && coincideBusqueda;
    });

    const handleCategoriaClick = (catId) => {
        if (catId === 'todos') {
            setSearchParams({});
        } else {
            setSearchParams({ categoria: catId });
        }
    };

    const limpiarFiltros = () => {
        setSearchParams({});
    };

    const formatearPrecio = (precio) => {

        const valor = parseFloat(precio);
        if (isNaN(valor)) return '$';
        return `$${new Intl.NumberFormat('es-ES').format(valor)}`;
    };

    return (
        <div className="catalogo-container">
            <p>
                Mostrando productos ajustados para tu estatura de <strong className="estatura-resaltada">{estatura}m</strong>
            </p>

            <div className="catalogo-content">
                <div className="filtros-sidebar">
                    <div className="filtros-header">
                        <h2>Categorías</h2>
                        <button onClick={limpiarFiltros} className="btn-limpiar">Limpiar filtros</button>
                    </div>

                    <div className="categorias-principales">
                        {/* 1. Botón de Todos */}
                        <div className="categoria-bloque">
                            <button
                                className={`categoria-btn ${categoriaActiva === 'todos' ? 'activa' : ''}`}
                                onClick={() => handleCategoriaClick('todos')}
                            >
                                Todos los productos
                            </button>
                        </div>
                        

                        {categorias.map(cat => (
                            <div key={cat.id} className="categoria-bloque">
                                <button
                                    className={`categoria-btn ${String(categoriaActiva) === String(cat.id) ? 'activa' : ''}`}
                                    onClick={() => handleCategoriaClick(cat.id)}
                                    style={cat.id === 'ofertas' ? { } : {}}
                                >
                                    {cat.categorias}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="productos-area">
                    <div className="productos-info">
                        <p>

                            {categoriaActiva === 'ofertas'
                                ? `🔥 Ofertas Exclusivas`
                                : searchTerm
                                ? `Resultados de búsqueda para: "${searchTerm}"`
                                : categoriaActiva === 'todos'
                                    ? 'Todos los productos'
                                    : `Categoría: ${categorias.find(c => String(c.id) === String(categoriaActiva))?.categorias || ""}`}
                        </p>
                        <span className="productos-count">{productosFiltrados.length} productos</span>
                    </div>

                    {cargando ? (
                        <div className="cargando">
                            <p>Cargando productos...</p>
                        </div>
                    ) : (
                        <div className="productos-grid">
                            {productosFiltrados.length > 0 ? (
                                productosFiltrados.map(producto => {
                                    

                                    const precioInfo = producto.precio_info;
                                    const hayOferta = precioInfo && precioInfo.descuentoAplicado !== null;
                                    const hayAjusteAlAlza = precioInfo && precioInfo.precioAntesOferta > producto.precio_base;

                                    const precioActualClass = hayOferta ? 'producto-precio precio-oferta' : hayAjusteAlAlza ? 'producto-precio precio-alza' : 'producto-precio';
                                    
                                    return (
                                        <div key={producto.id} className="producto-card">
                                            
                                            {hayOferta && (
                                                <span className="oferta-badge">¡OFERTA!</span>
                                            )}

                                            <div className="producto-imagen">
                                                <img
                                                    src={producto.imagen && producto.imagen.startsWith("http")
                                                        ? producto.imagen
                                                        : `http://127.0.0.1:8000${producto.imagen}`}
                                                    alt={producto.nombre}
                                                />
                                            </div>
                                            <div className="producto-info">
                                                <span className="producto-categoria">
                                                    {categorias.find(c => String(c.id) === String(producto.categoria))?.categorias || "Sin categoría"}
                                                </span>
                                                
                                                <h3 className='producto-nombre'><Link to={`/producto/${producto.id}`}>{producto.nombre}</Link></h3>

                                                <div>
                                                    {(hayOferta || hayAjusteAlAlza) && (
                                                        <p className="precio-base-tachado">
                                                            {hayOferta ? formatearPrecio(precioInfo.precioAntesOferta) : formatearPrecio(producto.precio_base)}
                                                        </p>
                                                    )}

                                                    <p className={precioActualClass}>
                                                        {hayOferta && <span className="precio-tag-oferta">OFERTA</span>}
                                                        
                                                        {formatearPrecio(producto.precio_calculado)}
                                                    </p>
                                                </div>

                                                <Link to={`/producto/${producto.id}`} className="btn-agregar">
                                                    <i className="fa-solid fa-cart-shopping"></i>
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="no-productos">
                                    <p>No hay productos que coincidan con los filtros aplicados.</p>
                                    <button onClick={limpiarFiltros} className="btn-limpiar">Ver todos los productos</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Catalogo;