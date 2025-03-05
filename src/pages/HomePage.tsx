import { useState, useEffect } from "react";
import Item from "../components/Item";
import "./HomePage.css";

// Skapar ett interface för produktstrukturen.
export interface ItemInterface {
  _id?: string,
  name: string,
  category: string,
  price: number,
  status: boolean
}

const HomePage = () => {

  // States.
  const [gameItem, setGameItem] = useState<ItemInterface[] | []>([]);
  const [puzzleItem, setPuzzleItem] = useState<ItemInterface[] | []>([]);
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
      // console.log(data);

      // Filtrerar varor i kategorin "Spel".
      const gameItems = data.filter((item: ItemInterface) => item.category.toLowerCase() === "spel");

      // Filtrerar varor i kategorin "Pussel".
      const puzzleItems = data.filter((item: ItemInterface) => item.category.toLocaleLowerCase() === "pussel");

      // Kontrollerar att varor finns lagrade och sätter state därefter.
      // Om listan returneras tom från API:et, sätts state till en tom array och info ges.
      if (data.message === "Inga varor hittades.") {
        setGameItem([]);
        setPuzzleItem([]);
        setError("Inga produkter finns lagrade.");
        // Om uppgifter finns lagrade, sätts state till data och felmeddelandet tas bort.
      } else {
        // Sätter de filtrerade resultaten i state.
        setGameItem(gameItems);
        setPuzzleItem(puzzleItems);

        // TEST-log.
        // console.log(gameItems, puzzleItems);

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
    <>
      <h1>Välkommen!</h1>

      <div className="text-container">
        <p className="welcome-text">
          Välkommen till KreativLogik – din kreativa oas för spel och pussel för hela familjen!
        </p>
        <p className="welcome-text">
          Här hittar du noggrant utvalda produkter som stimulerar både kreativitet, fantasi och logik,
          för alla som älskar att utmana sig själva och upptäcka nya världar.
        </p>
        <p className="welcome-text">
          Oavsett om du söker efter ett nytt pussel, ett spännande spel eller något som kombinerar de två,
          har vi något för dig. Låt kreativiteten flöda och logiken blomstra med våra produkter!
        </p>
      </div>

      { /* Felmeddelanden. */}
      {loading && <p>Laddar produkter...</p>}
      {error && <p>{error}</p>}

      <div className="product-container">
        <div className="games">
          <h2>Våra spel</h2>
          {
            // Loopar igenom spel och skriver ut enligt return i Item-komponenten.
            gameItem.map((item) => (
              <Item item={item} key={item._id} isLink={true} />
            ))
          }
        </div>

        <div className="puzzles">
          <h2>Våra pussel</h2>
          {
            // Loopar igenom pussel och skriver ut enligt return i Item-komponenten.
            puzzleItem.map((item) => (
              <Item item={item} key={item._id} isLink={true} />
            ))
          }
        </div>
      </div>
    </>
  )
}

export default HomePage