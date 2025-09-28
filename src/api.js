// src/api.js
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/";

// 👉 Categorías
export const getCategorias = async () => {
try {
const response = await axios.get(`${BASE_URL}categorias/`);
return response.data.map(cat => ({
    id: cat.id,
    categorias: cat.categorias,   // o cat.nombre según tu serializer
    descripcion: cat.descripcion
}));
} catch (error) {
console.error("Error al obtener categorías:", error);
return [];
}
};

// 👉 Productos
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

export const getPrecioAjustado = async (productoId, altura) => {
try {
const response = await axios.get(
    `${BASE_URL}productos/${productoId}/calcular_precio/`,
    { params: { altura } }
);
return response.data.precio || response.data.precio_calculado;
} catch (error) {
console.error(`Error al calcular precio para producto ${productoId}:`, error);
return null;
}
};

