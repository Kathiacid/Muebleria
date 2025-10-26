import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCarousel from "../components/ProductCarousel";
import AutoBanner, { bannerData } from "../components/AutoBanner";
import { getCategorias } from "../api";
import "./Home.css";

export default function Home() {
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        const cargarCategorias = async () => {
            try {
                const todasCategorias = await getCategorias();
                console.log("Todas las categorías:", todasCategorias);
                
                // Filtramos solo Cocina y Baño
                const categoriasFiltradas = todasCategorias.filter(cat => 
                    cat.categorias && (
                        cat.categorias.toLowerCase().includes('cocina') || 
                        cat.categorias.toLowerCase().includes('baño')
                    )
                );
                
                setCategorias(categoriasFiltradas);
            } catch (error) {
                console.error("Error cargando categorías:", error);
            }
        };

        cargarCategorias();
    }, []);

    // Encontrar las categorías específicas
    const categoriaCocina = categorias.find(cat => 
        cat.categorias && cat.categorias.toLowerCase().includes('cocina')
    );
    const categoriaBano = categorias.find(cat => 
        cat.categorias && cat.categorias.toLowerCase().includes('baño')
    );

    return (
        <div className="home-page-wrapper">
            
            <AutoBanner banners={bannerData} autoPlayInterval={4000} />

            {/* 1. SECCIÓN DE GRILLA PRINCIPAL (COCINA) */}
            <section className="grid home-section">
                <div className="imgs">
                    <img
                        src="https://construmartcl.vtexassets.com/arquivos/ids/214515-800-auto?v=638602983701800000&width=800&height=auto&aspect=true"
                        className="imagen1"
                        alt="Cocina"
                    />
                </div>

                <div className="texto1">
                    <h2>Tu </h2> 
                    <h2>cocina</h2>
                    <p>
                        El café de la mañana, las cenas con amigos, los momentos que importan.
                        Diseñemos la cocina que será el corazón de tu hogar.
                    </p>
                    <Link 
                        to={categoriaCocina ? `/catalogo?categoria=${categoriaCocina.id}` : "/catalogo"} 
                        className="mi-boton"
                    >
                        <span className="nav-text">Ver más</span>
                        <span className="underline-right"></span>
                    </Link>
                </div>
            </section>
            
            {/* ---------------------------------------------------- */}
            
            {/* 2. SECCIÓN DE BENEFICIOS Y CONFIANZA (E-COMMERCE BÁSICO) */}
            <section className="home-section benefits-section">
                <h2 className="section-title">¿Por qué elegir SOMA?</h2>
                <div className="benefits-grid">
                    <div className="benefit-card">
                        <i className="fa-solid fa-ruler-combined"></i>
                        <h4>Diseño Personalizado</h4>
                        <p>Muebles ajustados a tu estatura y ergonomía. Únicos como tú.</p>
                    </div>
                    <div className="benefit-card">
                        <i className="fa-solid fa-tree"></i>
                        <h4>Materiales Sostenibles</h4>
                        <p>Madera certificada y procesos amigables con el medio ambiente.</p>
                    </div>
                    <div className="benefit-card">
                        <i className="fa-solid fa-truck-fast"></i>
                        <h4>Despacho Rápido</h4>
                        <p>Entregamos tu mueble a medida en tiempo récord. Cobertura nacional.</p>
                    </div>
                    <div className="benefit-card">
                        <i className="fa-solid fa-medal"></i>
                        <h4>Garantía Extendida</h4>
                        <p>Confiamos en la durabilidad de nuestros productos, por eso ofrecemos 5 años de garantía.</p>
                    </div>
                </div>
            </section>
            
            {/* 3. SECCIÓN DE PRODUCTOS DESTACADOS (CARRUSEL) */}
            <section className="carousel home-section">
                <h2 className="section-title">Productos Destacados</h2>
                <ProductCarousel />
            </section>

            {/* 4. SECCIÓN CTA SECUNDARIA (BAÑO) */}
            <section className="grid home-section reversed-grid">
                <div className="texto1">
                    <h2>Tu </h2> 
                    <h2>baño</h2>
                    <p>
                        Transforma tu baño en un santuario de diseño. Materiales resistentes a la humedad y estilo minimalista.
                    </p>
                    <Link 
                        to={categoriaBano ? `/catalogo?categoria=${categoriaBano.id}` : "/catalogo"} 
                        className="mi-boton"
                    >
                        <span className="nav-text">Ver Baños</span>
                        <span className="underline-right"></span>
                    </Link>
                </div>
                
                <div className="imgs">
                    <img
                        src="https://tse4.mm.bing.net/th/id/OIP.ephV2nlwzvQvYHU9NySHJQHaIJ?w=1746&h=1920&rs=1&pid=ImgDetMain&o=7&rm=3"
                        className="imagen1"
                        alt="Baño"
                    />
                </div>
            </section>
            
            {/* 5. SECCIÓN DE LLAMADA FINAL A LA ACCIÓN (CUSTOMIZACIÓN) */}
            <section className="home-section final-cta-section">
                <div className="cta-content-box">
                    <h2>¡Diseña tu Espacio SOMA Hoy!</h2>
                    <p>Ingresa tu estatura y déjanos crear la pieza perfecta que se adapta a tu vida.</p>
                    <Link to="/estatura" className="cta-button-large">
                        Comenzar Experiencia Personalizada →
                    </Link>
                </div>
            </section>

        </div>
    );
}