import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { ItemInterface } from "../types/item.types";
import Item from "../components/Item";
import "./AdminPage.css";

const AdminPage = () => {

  const { user } = useAuth();

  // States.
  const [item, setItem] = useState<ItemInterface[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null);

  // Anropar inhämtningsfunktionen vid första renderingen.
  useEffect(() => {
    fetchItems();
  }, []);

  // Hämtar produkter från API:et.
  const fetchItems = async () => {

    // Gör ett anrop mot API:et.
    try {
      // Sätter laddnings-state till true.
      setLoading(true);

      // Återställer felmeddelande.
      setError("");

      // Fetch-anrop.
      const res = await fetch("http://localhost:3001/item", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      // Felkontroll vid oväntat svar.
      if (!res.ok) {
        throw Error("Det blev ett oväntat fel: " + res.status);
      }

      // Fortsätter anropet och hämtar ut data.
      const data = await res.json();

      // TEST-log.
      //console.log(data);

      // Kontrollerar att varor finns lagrade och sätter state därefter.
      // Om listan returneras tom från API:et, sätts state till en tom array och info ges.
      if (data.message === "Inga varor hittades.") {
        setItem([]);
        setError("Inga produkter finns lagrade.");
        // Om uppgifter finns lagrade, sätts state till data och felmeddelandet tas bort.
      } else {
        // Sätter resultatet i state.
        setItem(data);

        // Återställer error-state.
        setError(null);
      }
      // Felkontroll vid inhämtningsfel.
    } catch (error) {
      console.log(error);
      setError("Det blev ett fel vid inhämtning av produkter.")

      // Sätter laddnings-state till false när datainhämtningen slutförts.
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Välkommen, {user ? user.username : ""}!</h1>

      { /* Felmeddelanden. */}
      {loading && <p>Laddar produkter...</p>}
      {error && <p>{error}</p>}

      <div className="products-container">
        <h2>Alla produkter</h2>
        <br />
        {
          // Loopar igenom produkter och skriver ut enligt return i Item-komponenten.
          item.map((item) => (
            <Item item={item} key={item._id} isLink={false} />
          ))
        }
      </div>
    </div>
  )
}

export default AdminPage
