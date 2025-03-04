import { useState, useEffect } from "react";

// Skapar ett interface för produktstrukturen.
export interface ItemInterface {
  name: string,
  category: string,
  price: number,
  status: boolean
}

const HomePage = () => {

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
      console.log(data);

      // Filtrerar varor i kategorin "Spel".
      const filteredItems = data.filter((item: ItemInterface) => item.category.toLowerCase() === "spel");

      // Kontrollerar att varor finns lagrade och sätter state därefter.
      // Om listan returneras tom från API:et, sätts state till en tom array och info ges.
      if (data.message === "Inga varor hittades.") {
        setItem([]);
        setError("Inga produkter finns lagrade.");
        // Om uppgifter finns lagrade, sätts state till data och felmeddelandet tas bort.
      } else {
        // Sätter det filtrerade resultatet i state.
        setItem(filteredItems);

        // TEST-log.
        console.log(filteredItems);

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
          Välkommen till KreativLogik – din kreativa oas för spel, pussel, böcker och pyssel!
        </p>
        <p className="welcome-text">
          Här hittar du noggrant utvalda produkter som stimulerar både fantasi och logik,
          för alla som älskar att skapa, utmana sig själva och upptäcka nya världar.
        </p>
        <p className="welcome-text">
          Oavsett om du söker efter en ny bok, ett spännande pussel eller en logisk leksak,
          har vi något för dig. Låt kreativiteten flöda och logiken blomstra med våra produkter!
        </p>
      </div>
    </>
  )
}

export default HomePage