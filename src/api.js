// src/api.js
import axios from "axios";
function capitalizarPrimeraLetra(texto) {
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}
const BASE_URL = "http://127.0.0.1:8000/api/";

export const getCategorias = async () => {
    try {
        const response = await axios.get(`${BASE_URL}categorias/`);
        // Asumiendo que 'categorias_display' se utiliza para el nombre en el frontend
        return response.data.map(cat => ({
            id: cat.id,
            categorias: cat.categorias_display, 
            descripcion: cat.descripcion
        }));
    } catch (error) {
        console.error("Error al obtener categorías:", error);
        return [];
    }
};

// 👉 Productos (Todos en stock)
export const getProductos = async () => {
    try {
        const response = await axios.get(`${BASE_URL}productos/`);
        return response.data.map(prod => ({
            id: prod.id,
            imagen: prod.imagen,
            nombre: prod.nombre,
            categoria: prod.categoria,
            stock: prod.stock,
            precio_base: prod.precio_base,
            descripcion: prod.descripcion,
            tipo_mueble: prod.tipo_mueble,
            altura: prod.altura,
            fecha_creacion: prod.fecha_creacion,
        }));
    } catch (error) {
        console.error("Error al obtener productos:", error);
        return [];
    }
};

// 🚨 NUEVA FUNCIÓN: Obtener productos con ofertas activas
export const getProductosEnOferta = async () => {
    try {
        // Llama al nuevo endpoint creado en Django views.py
        const response = await axios.get(`${BASE_URL}productos/productos_en_oferta/`);
        
        // Mapeamos los campos igual que getProductos para consistencia en el frontend
        return response.data.map(prod => ({
            id: prod.id,
            imagen: prod.imagen,
            nombre: prod.nombre,
            categoria: prod.categoria,
            stock: prod.stock,
            precio_base: prod.precio_base,
            descripcion: prod.descripcion,
            tipo_mueble: prod.tipo_mueble,
            altura: prod.altura,
            fecha_creacion: prod.fecha_creacion,
        }));
    } catch (error) {
        console.error("Error al obtener productos en oferta:", error);
        return [];
    }
};


// 👉 Obtener un producto por ID
export const getProductoById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}productos/${id}/`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener producto:", error);
        return null;
    }
};

// 👉 Solicitudes (POST)
export const enviarSolicitud = async (solicitudData) => {
    try {
        const response = await axios.post(`${BASE_URL}solicitudes/`, solicitudData);
        return response.data;
    } catch (error) {
        console.error("Error al enviar solicitud:", error);
        throw error;
    }
};

// 🚨 FUNCIÓN TRIPLE PRECIO (Para detalle/catálogo individual)
export const getPrecioAjustado = async (productoId, altura) => {
    try {
        const response = await axios.get(
            `${BASE_URL}productos/${productoId}/calcular_precio/`,
            { params: { altura } }
        );
        
        // Mapeamos los campos que esperamos del backend (obtenidos de obtener_precio_final)
        return {
            precioFinal: response.data.precio_final,
            precioBase: response.data.precio_base,
            precioAntesOferta: response.data.precio_antes_oferta, 
            descuentoAplicado: response.data.descuento_aplicado, 
        };
        
    } catch (error) {
        console.error(`Error al calcular precio para producto ${productoId}:`, error);
        return null; 
    }
};

export const getProductosDestacados = async () => {
    try {
        const response = await axios.get(`${BASE_URL}productos-destacados/`);
        return response.data.map(item => ({
            id: item.id,
            producto: item.producto,
            producto_nombre: item.producto_nombre,
            producto_descripcion: item.producto_descripcion,
            producto_precio: item.producto_precio,
            producto_imagen: item.producto_imagen,
            producto_tipo_mueble_display: item.producto_tipo_mueble_display,
        }));
    } catch (error) {
        console.error("Error al obtener productos destacados:", error);
        return [];
    }
};

export const getProductosRelacionados = async (productoId) => {
    try {
        // Llama al nuevo endpoint
        const response = await axios.get(`${BASE_URL}productos/${productoId}/productos_relacionados/`);
        
        // Mapeamos los datos para consistencia en el frontend
        return response.data.map(prod => ({
            id: prod.id,
            imagen: prod.imagen,
            nombre: prod.nombre,
            precio_base: prod.precio_base, 
        }));
    } catch (error) {
        console.error(`Error al obtener productos relacionados para ID ${productoId}:`, error);
        return [];
    }
};