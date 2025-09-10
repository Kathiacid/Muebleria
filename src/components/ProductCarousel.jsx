import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ProductCarousel.css';

const ProductCarousel = () => {
const [currentIndex, setCurrentIndex] = useState(0);

// Datos de ejemplo para los productos
const products = [
{
    id: 1,
    name: "Mesa de Centro",
    price: "$129.990",
    description: "Mesa de Centro hecha de madera, amplia",
    image: "https://nowuhogar.com/cdn/shop/products/NHMCD140-2_1200x.jpg?v=1742230684",
    link: "/producto/silla-ergonomica"
},
{
    id: 2,
    name: "Mesa de Centro Moderna",
    price: "$89.990",
    description: "Mesa de centro con diseño contemporáneo",
    image: "https://cdn.ciudad-muebles.com.ar/wp-content/uploads/2020/04/156-edit.jpg",
    link: "/producto/mesa-centro"
},
{
    id: 3,
    name: "Encimera de Cocina",
    price: "$499.990",
    description: "Encimera a medida para cocina montable",
    image: "https://www.kitchencenter.cl/cdn/shop/files/Encimera-Deluxe-Elite-95-FDV_c5649fe2-022e-4c5a-8b43-292852f0e29a.jpg?v=1695610692",
    link: "/producto/sofa-seccional"
},
{
    id: 4,
    name: "Mueble lavamanos",
    price: "$69.990",
    description: "Lavamanos con espacio para cosas",
    image: "https://storage.googleapis.com/sites-files/109/sites_products-6717c39e59507.jpeg",
    link: "/producto/estanteria-modular"
},
{
    id: 5,
    name: "Mueble lavamanos clear",
    price: "$45.990",
    description: "Mueble lavamanos especial para baños clear look",
    image: "https://elementonativo.cl/wp-content/uploads/2017/06/cubiertab4.jpg",
    link: "/producto/lampara-pie"
},
{
    id: 6,
    name: "Mesa de noche cañamo",
    price: "$229.990",
    description: "Mesa de comedor para 6-8 personas",
    image: "https://labatea.cl/cdn/shop/files/IMG_9115_2.jpg?crop=center&height=3456&v=1732570737&width=2304",
    link: "/producto/mesa-comedor"
}
];

// Efecto para el movimiento automático
useEffect(() => {
const interval = setInterval(() => {
    nextSlide();
}, 4000);

return () => clearInterval(interval);
}, [currentIndex]);

const nextSlide = () => {
setCurrentIndex(prevIndex => 
    prevIndex === Math.ceil(products.length / 3) - 1 ? 0 : prevIndex + 1
);
};

const prevSlide = () => {
setCurrentIndex(prevIndex => 
    prevIndex === 0 ? Math.ceil(products.length / 3) - 1 : prevIndex - 1
);
};

const goToSlide = (index) => {
setCurrentIndex(index);
};

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
            <img src={product.image} alt={product.name} className="product-image" />
            </div>
            <div className="product-info">
            <h3 className="product-name">
                <Link to={product.link}>{product.name}</Link>
            </h3>
            <p className="product-price">{product.price}</p>
            <p className="product-description">{product.description}</p>
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