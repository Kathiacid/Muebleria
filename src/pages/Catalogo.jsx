
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { EstaturaContext } from '../components/EstaturaContext';
import { getProductos, getCategorias, getPrecioAjustado } from "../api";
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

    // 🔹 Traer productos con precios ajustados
    useEffect(() => {
        const fetchProductos = async () => {
            if (!estatura) return;

            setProductos([]); // limpia antes
            setCargando(true);

            try {
                const data = await getProductos();
                const productosConPrecio = await Promise.all(
                    data.map(async (prod) => {
                        const precio_calculado = await getPrecioAjustado(prod.id, parseFloat(estatura));
                        return {
                            ...prod,
                            precio_calculado: precio_calculado || prod.precio_base
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
    }, [estatura]);

    // 🔹 Traer categorías
    useEffect(() => {
        const fetchCategorias = async () => {
            const data = await getCategorias();
            setCategorias(data);
        };
        fetchCategorias();
    }, []);

    // 🔹 Ajustar categoría activa cuando cambia la URL
    useEffect(() => {
        setCategoriaActiva(categoriaURL || 'todos');
    }, [categoriaURL]);

    // 🔹 Filtrado combinado por categoría y búsqueda
    const productosFiltrados = productos.filter(producto => {
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
        return new Intl.NumberFormat('es-ES').format(precio);
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
                            {searchTerm
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
                                productosFiltrados.map(producto => (
                                    <div key={producto.id} className="producto-card">
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

                                            <p className="producto-precio">
                                                ${formatearPrecio(producto.precio_calculado)}
                                            </p>

                                            <Link to={`/producto/${producto.id}`} className="btn-agregar">
                                            <i className="fa-solid fa-cart-shopping"></i> {/* Nueva sintaxis */}
                                            </Link>
                                        </div>
                                    </div>
                                ))
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
