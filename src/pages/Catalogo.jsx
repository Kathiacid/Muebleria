import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { EstaturaContext } from '../components/EstaturaContext';
import { getProductos, getCategorias, getPrecioAjustado } from "../api";
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
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);

    // 🔹 Traer productos
    useEffect(() => {
    const fetchProductos = async () => {
    const data = await getProductos();

    // pedir precios ajustados según la estatura
    const productosConPrecio = await Promise.all(
        data.map(async (prod) => {
        const precio_ajustado = await getPrecioAjustado(prod.id, estatura);
        return { ...prod, precio_ajustado };
        })
    );

    setProductos(productosConPrecio);
    };

    if (estatura) {
    fetchProductos();
    }
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



    // 🔹 Filtrado por categoría
    const productosFiltrados = productos.filter(producto => {
        if (categoriaActiva !== 'todos' && String(producto.categoria) !== String(categoriaActiva)) {
            return false;
        }
        return true;
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
                            {categoriaActiva === 'todos' 
                                ? 'Todos los productos' 
                                : `Categoría: ${categorias.find(c => String(c.id) === String(categoriaActiva))?.nombre || ""}`}
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
                                            {categorias.find(c => String(c.id) === String(producto.categoria))?.categorias || "Sin categoría"}
                                        </span>
                                    </div>
                                    <div className="producto-info">
                                        <h3><Link to={`/producto/${producto.id}`}>{producto.nombre}</Link></h3>
                                        <p>{producto.descripcion_breve}</p>
                                        <p><i>{producto.descripcion_detallada}</i></p>
                                        <p className="producto-precio">
                                            ${producto.precio_ajustado?.toFixed(0) || producto.precio_base}
                                        </p>
                                        <p>Altura ajustada: {producto.altura_ajustada}</p>
                                        <p>Stock: {producto.stock}</p>
                                        <button className="btn-agregar">Lo Quiero</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-productos">
                                <p>No hay productos que coincidan con la categoría seleccionada.</p>
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
