import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ProductCarousel.css';

const ProductCarousel = () => {
const [products, setProducts] = useState([]);
const [currentIndex, setCurrentIndex] = useState(0);

useEffect(() => {
axios.get('http://127.0.0.1:8000/api/productos-destacados/')
    .then(response => {
    setProducts(response.data);
    })
    .catch(error => {
    console.error('Error al cargar productos destacados:', error);
    });
}, []);

useEffect(() => {
const interval = setInterval(() => {
    nextSlide();
}, 4000);
return () => clearInterval(interval);
}, [currentIndex, products]);

const nextSlide = () => {
if (products.length === 0) return;
setCurrentIndex(prevIndex =>
    prevIndex === Math.ceil(products.length / 3) - 1 ? 0 : prevIndex + 1
);
};

const prevSlide = () => {
if (products.length === 0) return;
setCurrentIndex(prevIndex =>
    prevIndex === 0 ? Math.ceil(products.length / 3) - 1 : prevIndex - 1
);
};

const goToSlide = (index) => setCurrentIndex(index);

return (
<div className="product-carousel-container">
    <div className="product-carousel">
    <div
        className="product-carousel-inner"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
    >
        {products.map(product => (
        <div key={product.id} className="product-card">
            <div className="product-image-container">
            <img
                src={product.producto_imagen}
                alt={product.producto_nombre}
                className="product-image"
            />
            </div>
            <div className="product-info">
                <h3 className="product-name">
                    <Link to={`/producto/${product.producto}`}>{product.producto_nombre}</Link>
                </h3>
                <p className="product-price">
                    ${parseFloat(product.producto_precio).toLocaleString()}
                </p>
                <p className="product-description">
                    {product.producto_tipo_mueble_display}
                </p>
            </div>
        </div>
        ))}
    </div>
    </div>

    <div className="carousel-controls">
    <button className="control-btn prev-btn" onClick={prevSlide}>&#10094;</button>
    <div className="indicators">
        {Array.from({ length: Math.ceil(products.length / 3) }).map((_, index) => (
        <div
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
        />
        ))}
    </div>
    <button className="control-btn next-btn" onClick={nextSlide}>&#10095;</button>
    </div>
</div>
);
};

export default ProductCarousel;
