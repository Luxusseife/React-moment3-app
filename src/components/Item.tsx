import { Link } from "react-router-dom";
import { useState } from "react";
import { ItemInterface } from "../types/item.types";
import "./Item.css";

const Item = ({ item, isLink = true, onUpdate, onEdit }: { item: ItemInterface, isLink?: boolean, onUpdate: Function, onEdit: (item: ItemInterface) => void; }) => {

    // States för fel.
    const [error, setError] = useState<string>("");

    // Funktion som raderar en produkt.
    const deleteItem = async () => {

        // Ger användaren möjlighet att avbryta radering.
        const confirmDelete = window.confirm("Är du säker på att du vill radera denna produkt?");
        if (!confirmDelete) return;

        // Gör ett anrop mot API:et.
        try {
            // Fetch-anrop med metoden DELETE (radera).
            const res = await fetch(`https://react-moment3-api-k96z.onrender.com/item/${item._id}`, {
                method: "DELETE"
            });

            // Kastar ett fel och visar felmeddelande vid oväntat svar.
            if (!res.ok) {
                throw new Error("Fel uppstod vid radering: " + res.status);
            }

            // TEST-logg.
            // console.log("Produkten raderades:", item.name);

            // Uppdaterar produktlistan efter radering av produkt.
            onUpdate();

            // Felmeddelanden vid inhämtningsfel. 
        } catch (error) {
            setError("Kunde inte radera produkten.");

            // TEST-logg.
            // console.log("Detta fel uppstod: ", error);
        }
    };

    return (
        <section>
            {/* Om användaren är på HomePage består produktlistan av klickbara länkar som leder till enskild produkt
            medans hen på AdminPage ser en vanlig produktlista med knappar för uppdatera/radera. */}
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
                    <div>
                        <h3>{item.name}</h3>
                        <br />
                        <p><strong>Pris:</strong> {item.price} kronor</p>
                        <p><strong>Kategori:</strong> {item.category}</p>
                        <p><strong>Lagerstatus:</strong> {item.status ? "I lager" : "Ej i lager"}</p>
                    </div>
                    <br />
                    {error && <p className="error-message">{error}</p>}
                    <br />
                    <div className="button-container-item">
                        <button className="update-button" onClick={() => onEdit(item)}>Ändra</button>
                        <button className="delete-button" onClick={deleteItem}>Radera</button>
                    </div>
                </article>
            )}
        </section>
    );
}

export default Item
