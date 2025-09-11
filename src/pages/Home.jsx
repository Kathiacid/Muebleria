import { Link } from "react-router-dom";
import ProductCarousel from "../components/ProductCarousel";
import AutoBanner, { bannerData } from "../components/AutoBanner"; // 👈 Importas ambos
import "./Home.css";

export default function Home() {
return (
<div>
    <AutoBanner banners={bannerData} autoPlayInterval={4000} />

    <section className="carousel">
    <h2 className="title">Productos Destacados</h2>
    <ProductCarousel />
    </section>

    <section className="grid">
        <div className="img1">
            <img
            src="https://construmartcl.vtexassets.com/arquivos/ids/214515-800-auto?v=638602983701800000&width=800&height=auto&aspect=true"
            className="imagen1"
            alt="Cocina"
            />
        </div>

        <div className="texto1">
            <h2>Tu cocina</h2>
            <p>
            El café de la mañana, las cenas con amigos, los momentos que importan.
            Diseñemos la cocina que será el corazón de tu hogar.
            </p>
            <Link to="/catalogo/cocina" className="mi-boton">
            Ver más
            </Link>
        </div>

        <div className="texto2">
            <h2>Tu baño</h2>
            <p>
            Transforma tu baño en un santuario de tranquilidad y orden. Donde cada
            mañana comienza con calma y cada noche termina en relax.
            </p>
            <Link to="/catalogo/banio" className="mi-boton">
            Ver más
            </Link>
        </div>

        <div className="img2">
            <img
            src="https://mkchile.vtexassets.com/arquivos/ids/5278608-800-auto?v=638899139689400000&width=800&height=auto&aspect=true"
            className="imagen2"
            alt="Baño"
            />
        </div>
    </section>
</div>
);
}
