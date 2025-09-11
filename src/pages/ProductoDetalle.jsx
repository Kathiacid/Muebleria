
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EstaturaContext } from '../components/EstaturaContext'; // Importa el contexto
import './ProductoDetalle.css'; 

const ProductoDetalle = () => {
    // Obtener la estatura del contexto
    const { estatura } = useContext(EstaturaContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [producto, setProducto] = useState(null);

    // Redirige si no hay estatura
    useEffect(() => {
        if (!estatura) {
            navigate('/catalogo');
        }
    }, [estatura, navigate]);

    const productos = [
        { id: 1, nombre: "Mesa de centro rústica", precioBase: 120, categoria: "livingcomedor", subcategoria: "mesas", imagen: "https://images.unsplash.com/photo-1540938138722-e7d69956d357", descripcion: "Mesa de centro robusta con acabado de madera natural, ideal para ambientes rústicos.", tipoMueble: "mesa" },
        { id: 2, nombre: "Silla de comedor 'Minimal'", precioBase: 80, categoria: "livingcomedor", subcategoria: "sillas", imagen: "https://images.unsplash.com/photo-1586158226065-27a810f27916", descripcion: "Silla de diseño minimalista en roble claro, cómoda y duradera.", tipoMueble: "silla" },
        { id: 3, nombre: "Estantería de baño", precioBase: 150, categoria: "baño", subcategoria: "almacenamiento", imagen: "https://images.unsplash.com/photo-1620166299863-149b25b50f75", descripcion: "Solución de almacenamiento ideal para organizar tus artículos de baño con estilo.", tipoMueble: "estanteria" },
        { id: 4, nombre: "Tabla de cortar de acacia", precioBase: 45, categoria: "cocina", subcategoria: "accesorios", imagen: "https://images.unsplash.com/photo-1582877977465-b1a774b786f0", descripcion: "Tabla de cortar de alta calidad, resistente y con un hermoso veteado de madera.", tipoMueble: "accesorio" },
        { id: 5, nombre: "Banco de trabajo de pino", precioBase: 300, categoria: "taller", subcategoria: "mesas", imagen: "https://images.unsplash.com/photo-1510906594247-c0f531065191", descripcion: "Banco robusto y funcional para tus proyectos de carpintería.", tipoMueble: "mesa" },
        { id: 6, nombre: "Cama king size 'Elegance'", precioBase: 700, categoria: "habitacion", subcategoria: "camas", imagen: "https://images.unsplash.com/photo-1540638342410-b9d9a0d84a7e", descripcion: "Una cama espaciosa y confortable para un descanso de lujo.", tipoMueble: "cama" },
        { id: 7, nombre: "Espejo con marco de nogal", precioBase: 100, categoria: "baño", subcategoria: "espejos", imagen: "https://images.unsplash.com/photo-1594952044358-868725832a82", descripcion: "Espejo de pared con un elegante marco de madera, perfecto para cualquier baño.", tipoMueble: "espejo" },
        { id: 8, nombre: "Isla de cocina con cajones", precioBase: 550, categoria: "cocina", subcategoria: "muebles", imagen: "https://images.unsplash.com/photo-1628169994644-24584281edde", descripcion: "Isla de cocina versátil con espacio de almacenamiento adicional y superficie de trabajo.", tipoMueble: "mesa" },
        { id: 9, nombre: "Sofá de madera escandinavo", precioBase: 700, categoria: "livingcomedor", subcategoria: "sofas", imagen: "https://images.unsplash.com/photo-1615964893922-0ef3d1591873", descripcion: "Sofá de diseño escandinavo, ideal para cualquier sala de estar moderna.", tipoMueble: "sofa" },
        { id: 10, nombre: "Organizador de herramientas de pared", precioBase: 100, categoria: "taller", subcategoria: "organizacion", imagen: "https://images.unsplash.com/photo-1601701391295-d06efd01309f", descripcion: "Organizador práctico y resistente para mantener tus herramientas ordenadas.", tipoMueble: "organizacion" },
        { id: 11, nombre: "Mesa de noche de cerezo", precioBase: 110, categoria: "habitacion", subcategoria: "mesillas", imagen: "https://images.unsplash.com/photo-1619895058693-4a11b61c8a14", descripcion: "Mesa de noche compacta con un cajón, perfecta para espacios pequeños.", tipoMueble: "mesa" },
        { id: 12, nombre: "Perchero de pared", precioBase: 75, categoria: "baño", subcategoria: "accesorios", imagen: "https://images.unsplash.com/photo-1627991465223-96b1b44d3203", descripcion: "Perchero de pared funcional con múltiples ganchos para toallas o ropa.", tipoMueble: "accesorio" },
    ];
    
    useEffect(() => {
        const productoEncontrado = productos.find(p => p.id === parseInt(id));
        setProducto(productoEncontrado);
    }, [id, productos]);

    // Función para calcular el precio dinámicamente según la estatura
    const calcularPrecio = (producto, estatura) => {
        const { tipoMueble, precioBase } = producto;
        if (tipoMueble === 'mesa' || tipoMueble === 'silla' || tipoMueble === 'sofa') {
            if (estatura < 1.30) return precioBase;
            if (estatura >= 1.30 && estatura < 1.40) return precioBase * 1.1;
            if (estatura >= 1.40) return precioBase * 1.25;
        }
        return precioBase;
    };
    
    // Función para calcular dimensiones proporcionales
    const calcularDimensiones = (tipoMueble, estatura) => {
        if (tipoMueble === 'mesa') {
            const alturaMesa = estatura * 0.45;
            return { altura: `${alturaMesa.toFixed(2)}m`, ancho: '1.2m', largo: '0.8m' };
        }
        if (tipoMueble === 'silla') {
            const alturaSilla = estatura * 0.25;
            return { altura: `${alturaSilla.toFixed(2)}m`, ancho: '0.5m', largo: '0.5m' };
        }
        if (tipoMueble === 'sofa') {
            const alturaSofa = estatura * 0.40;
            return { altura: `${alturaSofa.toFixed(2)}m`, ancho: '2.0m', largo: '0.9m' };
        }
        return { altura: 'N/A', ancho: 'N/A', largo: 'N/A' };
    };

    if (!producto || !estatura) {
        return (
            <div className="producto-detalle-container">
                <p>Cargando información o no se ha ingresado la estatura.</p>
                <button onClick={() => navigate('/catalogo')}>Ingresar Estatura</button>
            </div>
        );
    }

    const precioDinamico = calcularPrecio(producto, estatura);
    const dimensiones = calcularDimensiones(producto.tipoMueble, estatura);

    return (
        <div className="producto-detalle-container">
            <button onClick={() => navigate(-1)} className="btn-volver">Volver al Catálogo</button>
            <div className="producto-detalle-content">
                <div className="producto-detalle-imagen">
                    <img src={producto.imagen} alt={producto.nombre} />
                </div>
                <div className="producto-detalle-info">
                    <h1>{producto.nombre}</h1>
                    <p className="producto-precio-detalle">${precioDinamico.toFixed(0)}</p>
                    <p className="producto-descripcion">{producto.descripcion}</p>
                    <p className="producto-categoria-detalle">Categoría: <span>{producto.categoria}</span></p>
                    <p className="producto-subcategoria-detalle">Subcategoría: <span>{producto.subcategoria}</span></p>
                    {dimensiones.altura !== 'N/A' && (
                        <div>
                            <h4>Dimensiones recomendadas para tu estatura:</h4>
                            <ul>
                                <li>Altura: **{dimensiones.altura}**</li>
                                <li>Ancho: **{dimensiones.ancho}**</li>
                                <li>Largo: **{dimensiones.largo}**</li>
                            </ul>
                        </div>
                    )}
                    <button className="btn-agregar-detalle">Agregar al carrito</button>
                </div>
            </div>
        </div>
    );
};

export default ProductoDetalle;