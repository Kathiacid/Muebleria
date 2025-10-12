import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { EstaturaContext } from '../components/EstaturaContext';
import { getProductoById, getPrecioAjustado, getCategorias } from "../api";
import axios from 'axios';
import './ProductoDetalle.css';

// ✅ Importar reCAPTCHA
import ReCAPTCHA from 'react-google-recaptcha';

const ProductoDetalle = () => {
const { id } = useParams();
const navigate = useNavigate();
const { estatura } = useContext(EstaturaContext);

// ✅ Referencia para reCAPTCHA
const recaptchaRef = useRef();

const [producto, setProducto] = useState(null);
const [precioCalculado, setPrecioCalculado] = useState(null);
const [categorias, setCategorias] = useState([]);
const [cargando, setCargando] = useState(true);
const [error, setError] = useState(null);

// ✅ estados para el formulario
const [showForm, setShowForm] = useState(false);
const [formData, setFormData] = useState({
nombre: '',
email: '',
telefono: '',
cantidad: 1,
ciudad: '',
comuna: '',
pedido_detallado: ''
});
const [mensaje, setMensaje] = useState('');
const [loadingForm, setLoadingForm] = useState(false);

// ✅ Estado para el token de reCAPTCHA
const [recaptchaToken, setRecaptchaToken] = useState('');

useEffect(() => {
if (!estatura) {
    console.log('No hay estatura definida, pero no redirigimos automáticamente');
}
}, [estatura]);

useEffect(() => {
const fetchData = async () => {
    try {
    setCargando(true);
    setError(null);
    
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
if (imagenPath.startsWith('http')) return imagenPath;
return `http://127.0.0.1:8000${imagenPath}`;
};

const formatearPrecio = (precio) => new Intl.NumberFormat('es-ES').format(precio);

const getNombreCategoria = (categoriaId) => {
const categoria = categorias.find(cat => String(cat.id) === String(categoriaId));
return categoria ? categoria.categorias : 'Sin categoría';
};

// ✅ manejar cambios del formulario
const handleChange = (e) => {
setFormData({
    ...formData,
    [e.target.name]: e.target.value,
});
};

// ✅ Manejar cambio de reCAPTCHA
const handleRecaptchaChange = (token) => {
setRecaptchaToken(token);
};

// ✅ Reiniciar reCAPTCHA
const resetRecaptcha = () => {
setRecaptchaToken('');
if (recaptchaRef.current) {
    recaptchaRef.current.reset();
}
};

// ✅ Cerrar modal y reiniciar
const cerrarModal = () => {
setShowForm(false);
resetRecaptcha();
};

// ✅ enviar datos al backend CON reCAPTCHA
const handleSubmit = async (e) => {
e.preventDefault();
setLoadingForm(true);
setMensaje('');

// ✅ Validar reCAPTCHA
if (!recaptchaToken) {
    setMensaje('❌ Por favor, verifica que no eres un robot');
    setLoadingForm(false);
    return;
}

try {
await axios.post('http://localhost:8000/api/solicitudes/', {
producto: producto.id,                  // 👈 FK correcto
nombre_cliente: formData.nombre,
email_cliente: formData.email,
telefono: formData.telefono,
detalles: formData.pedido_detallado || 'Sin detalles adicionales', 
altura: estatura,  // 👈 USA LA ESTATURA DEL CONTEXTO,  // 👈 Agrega esta línea
recaptcha_token: recaptchaToken,        // ✅ importante
});

setMensaje('✅ Pedido enviado con éxito');
setFormData({ 
nombre: '', 
email: '', 
telefono: '',
cantidad: 1,
ciudad: '',
comuna: '',
pedido_detallado: ''
});
resetRecaptcha();
setShowForm(false);
} catch (error) {
console.error(error.response?.data || error.message);
setMensaje('❌ Error al enviar el pedido');
resetRecaptcha();
} finally {
setLoadingForm(false);
}

};

if (cargando) {
return (
    <div className="cargando-container">
    <div className="cargando-spinner"></div>
    <p>Cargando producto...</p>
    </div>
);
}

if (error || !producto) {
return (
    <div className="error-container">
    <div className="error-message">
        <h2>Error</h2>
        <p>{error || 'Producto no encontrado'}</p>
        <Link to="/catalogo" className="btn-volver">Volver al catálogo</Link>
    </div>
    </div>
);
}

const precioFinal = precioCalculado || producto.precio_base;
const tieneDescuento = precioCalculado && precioCalculado !== producto.precio_base;

return (
<div className="producto-detalle-container">
    <nav className="breadcrumb">
    <Link to="/">Inicio</Link>
    <span> / </span>
    <Link to="/catalogo">Catálogo</Link>
    <span> / </span>
    <span>{producto.nombre}</span>
    </nav>

    <div className="producto-detalle-content">
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

    <div className="producto-info-section">
        <div className="producto-header">
        <span className="categoria-badge">
            {getNombreCategoria(producto.categoria)}
        </span>
        <h1>{producto.nombre}</h1>
        <p className="descripcion-breve">{producto.descripcion_breve}</p>
        </div>

        <div className="precio-section">
        <div className="precio-actual">${formatearPrecio(precioFinal)}</div>
        {tieneDescuento && (
            <div className="precio-comparacion">
            <span className="precio-base">
                Precio base: ${formatearPrecio(producto.precio_base)}
            </span>
            </div>
        )}
        </div>

        <div className="estatura-info">
        <p>
            <strong>Precio ajustado para tu estatura:</strong> {estatura}m
        </p>
        </div>

        <div className="acciones-section">
        {producto.stock > 0 ? (
            <div className="botones-accion">
            <button className="btn-principal" onClick={() => setShowForm(true)}>
                Lo Quiero
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

    <div className="volver-section">
    <Link to="/catalogo" className="btn-volver-catalogo">
        ← Volver al catálogo
    </Link>
    </div>

    {/* ✅ Modal del formulario CON reCAPTCHA */}
    {showForm && (
    <div className="modal-overlay">
        <div className="modal-contenido">
        <button className="modal-cerrar" onClick={cerrarModal}>✕</button>
        <h3 className="modal-titulo">Completa tus datos</h3>

        <form onSubmit={handleSubmit} className="formulario">
            <label>Nombre</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
            
            <label>Correo electrónico</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            
            <label>Teléfono</label>
            <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required />
            
            <label>Cantidad</label>
            <input type="number" name="cantidad" min="1" value={formData.cantidad} onChange={handleChange} required />
            
            <label>Ciudad</label>
            <select name="ciudad" value={formData.ciudad} onChange={handleChange} required>
            <option value="Concepción">Concepción</option>
            </select>
            
            <label>Comuna</label>
            <select name="comuna" value={formData.comuna} onChange={handleChange} required>
            <option value="Concepción">Concepción</option>
            <option value="Talcahuano">Talcahuano</option>
            <option value="Chiguayante">Chiguayante</option>
            <option value="San Pedro de la Paz">San Pedro de la Paz</option>
            <option value="Hualpén">Hualpén</option>
            </select>
            
            
            <label>Indicaciones opcionales</label>
            <textarea
            name="pedido_detallado"
            value={formData.pedido_detallado}
            onChange={handleChange}
            placeholder="Ej: Color preferido, detalles específicos, etc."
            />

            {/* ✅ reCAPTCHA - REEMPLAZA 'TU_SITE_KEY' con tu key real */}
            <div className="recaptcha-container">
            <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6LejYuUrAAAAAGH5AC6njVOlqHFDMxjlqfs_12Up" // ✅ Key de prueba para localhost
                onChange={handleRecaptchaChange}
            />
            </div>

            <p className="nota">💡 En caso de cambiar la estatura, el precio se recalculará.</p>

            <button 
            type="submit" 
            className="btn-enviar" 
            disabled={loadingForm || !recaptchaToken}
            >
            {loadingForm ? 'Enviando...' : 'Enviar pedido'}
            </button>
        </form>
        </div>
    </div>
    )}

    {mensaje && <p className="mensaje">{mensaje}</p>}
</div>
);
};

export default ProductoDetalle;