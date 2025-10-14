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
        <div>
            <AutoBanner banners={bannerData} autoPlayInterval={4000} />

        <section className="grid">
                <div className="img1">
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
                    {/* CORRECCIÓN: El span debe estar DENTRO del Link */}
                    <Link 
                        to={categoriaCocina ? `/catalogo?categoria=${categoriaCocina.id}` : "/catalogo"} 
                        className="mi-boton"
                    >
                        <span className="nav-text">Ver más</span>
                        <span className="underline-right"></span>
                    </Link>
                </div>
            </section>

            <section className="carousel">
                <h2 className="title">Productos Destacados</h2>
                <ProductCarousel />
            </section>

        </div>
    );
}