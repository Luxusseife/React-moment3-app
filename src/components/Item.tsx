// Importerar CSS.
import { Link } from "react-router-dom";
import "./Item.css";

const Item = ({ item, isLink = true }: { item: any, isLink?: boolean }) => {

    // Komponenten returnerar en sektion innehållandes en artikel.
    return (
        <section>
            {isLink ? (
                <Link to={`/item/${item._id}`} className="item-link">
                    <article className="item-section">
                        <h3>{item.name}</h3>
                        <br />
                        <p><strong>Pris:</strong> {item.price} kronor</p>
                        <p><strong>Lagerstatus:</strong> {item.status ? "I lager" : "Ej i lager"}</p>
                    </article>
                </Link>
            ) : (
                <article className="item-section-admin">
                    <h3>{item.name}</h3>
                    <br />
                    <p><strong>Pris:</strong> {item.price} kronor</p>
                    <p><strong>Kategori:</strong> {item.category}</p>
                    <p><strong>Lagerstatus:</strong> {item.status ? "I lager" : "Ej i lager"}</p>
                    <br />
                    <div className="button-container-item">
                        <button className="update-button">Ändra</button>
                        <button className="delete-button">Radera</button>
                    </div>
                </article>
            )}
        </section>
    );
}

export default Item
