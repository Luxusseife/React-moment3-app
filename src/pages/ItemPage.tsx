import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ItemInterface } from "../types/item.types";
import "./ItemPage.css";

const ItemPage = () => {

  // States.
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<ItemInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Anropar inhämtningsfunktionen (varje gång id ändras).
  useEffect(() => {

    // Hämtar enskild produkt från API:et.
    const fetchSingleItem = async () => {
      try {

        // Sätter laddnings-state till true.
        setLoading(true);

        // Återställer felmeddelande.
        setError("");

        // Fetch-anrop.
        const res = await fetch(`https://react-moment3-api-k96z.onrender.com/item/${id}`);

        // Kastar ett fel och visar felmeddelande vid oväntat svar.
        if (!res.ok) {
          throw new Error("Produkten kunde tyvärr inte hämtas. Se varför här: " + res.status);
        }

        // Fortsätter anropet och hämtar ut data.
        const data = await res.json();

        // TEST-logg.
        // console.log("Vald produkt: ", data.foundItem);

        // Sätter resultatet i state.
        setItem(data.foundItem);

        // Felmeddelande vid inhämtningsfel. 
      } catch (error) {
        setError("Ett fel inträffade vid hämtning av produkten. Försök igen!");

        // TEST-logg.
        // console.error("Fel vid hämtning:", error);

        // Sätter laddnings-state till false när datainhämtningen slutförts.
      } finally {
        setLoading(false);
      }
    };

    fetchSingleItem();
  }, [id]);

  return (
    <div>
      {/* Felmeddelanden/meddelanden. */}
      {loading && <p className="message">Laddar produkt...</p>}
      {error && <p className="error">{error}</p>}
      {!item && !loading && !error && <p className="message">Produkten hittades inte.</p>}

      { // Om produkten hittas...
      item && (
        <div>
          <h1>Produktinfo</h1>
          <article className="single-item">
            <h2>{item.name}</h2>
            <br />
            <ul className="info-list">
              <li><strong>Pris:</strong> {item.price} kronor</li>
              <li><strong>Kategori:</strong> {item.category}</li>
              <li><strong>Lagerstatus:</strong> {item.status ? "I lager" : "Ej i lager"}</li>
            </ul>
          </article>
          <div className="button-container-itempage">
            <Link to="/"><button className="back-button">Tillbaka</button></Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemPage;