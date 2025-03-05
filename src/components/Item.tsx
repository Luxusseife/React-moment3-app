// Importerar CSS.
import "./Item.css";

const Item = ({ item }: { item: any }) => {

    // Komponenten returnerar en sektion innehållandes en artikel.
    return (
        <section className="item-section">
            <article>
                <h3>{item.name}</h3>
                <br />
                <h4>Pris: {item.price} kronor</h4>
                <br />
                <p>Lagerstatus: {item.status ? "I lager" : "Ej i lager"}</p>
            </article>
        </section>
    )
}

export default Item
