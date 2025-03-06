import { useState, useEffect } from "react";
import Item from "../components/Item";
import "./HomePage.css";
import { ItemInterface } from "../types/item.types";

const HomePage = () => {

  // States för spel.
  const [gameItem, setGameItem] = useState<ItemInterface[] | []>([]);
  const [loadingGames, setLoadingGames] = useState<boolean>(false)
  const [gameError, setGameError] = useState<string | null>(null);

  // States för pussel.
  const [puzzleItem, setPuzzleItem] = useState<ItemInterface[] | []>([]);
  const [loadingPuzzles, setLoadingPuzzles] = useState<boolean>(false)
  const [puzzleError, setPuzzleError] = useState<string | null>(null);

  // Anropar inhämtningsfunktionen (en gång).
  useEffect(() => {
    fetchItems();
  }, []);

  // Hämtar produkter från API:et.
  const fetchItems = async () => {

    // Gör ett anrop mot API:et.
    try {
      // Sätter laddnings-state till true för båda kategorier.
      setLoadingGames(true);
      setLoadingPuzzles(true);

      // Återställer felmeddelande för båda kategorier.
      setGameError("");
      setPuzzleError("");

      // Fetch-anrop med metoden GET (visa/läsa).
      const res = await fetch("https://react-moment3-api-k96z.onrender.com/item", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      // Kastar ett fel och visar felmeddelande vid oväntat svar.
      if (!res.ok) {
        throw Error("Det blev ett oväntat fel: " + res.status);
      }

      // Vid OK fortsätter anropet och data hämtas.
      const data = await res.json();

      // Om API:et returnerar TOM collection...
      if (data.message === "Inga varor hittades.") {
        setGameError("Inga spel finns i lager just nu.");
        setPuzzleError("Inga pussel finns i lager just nu.");
        setGameItem([]); 
        setPuzzleItem([]);
        return;
      }

      // TEST-logg.
      // console.log("Denna data finns lagrad", data);

      // Filtrerar ut varor från kategorin "Spel" ur hämtad data.
      const gameItems = data.filter((item: ItemInterface) => item.category.toLowerCase() === "spel");

      // Filtrerar ut varor från kategorin "Pussel" ur hämtad data.
      const puzzleItems = data.filter((item: ItemInterface) => item.category.toLocaleLowerCase() === "pussel");

      // Sätter de filtrerade resultaten som state för respektive kategori.
      setGameItem(gameItems);
      setPuzzleItem(puzzleItems);

      // TEST-logg.
      // console.log("Spel lagrade", gameItems);
      // console.log("Pussel lagrade", puzzleItems);

      // Kontrollerar att det finns lagrade varor i aktuella kategorier.
      if (gameItems.length === 0) {
        setGameError("Vi har inga spel i lager just nu.");
      }
      if (puzzleItems.length === 0) {
        setPuzzleError("Vi har inga pussel i lager just nu.");
      }

      // Felmeddelanden vid inhämtningsfel.
    } catch (error) {
      setGameError("Det blev ett fel vid inhämtning av spel.");
      setPuzzleError("Det blev ett fel vid inhämtning av pussel.");

      // TEST-logg.
      // console.log("Detta fel uppstod: ", error);

      // Sätter laddnings-state till false när datainhämtningen slutförts.
    } finally {
      setLoadingGames(false);
      setLoadingPuzzles(false);
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

      <div className="product-container">
        <div className="games">
          <h2>Våra spel</h2>
          {/* Om loadingState för spel är true, visas meddelande. 
              Om nytt setGameError gjorts, visas felmeddelande. 
              Om allt är OK, loopas spel igenom och skrivs ut. */}
          {loadingGames ? (
            <p>Laddar in spel. Det kan ta en liten stund...</p>
          ) : gameError ? (
            <p className="error">{gameError}</p>
          ) : (
            // Loopar igenom spel och skriver ut enligt return i Item-komponenten.
            gameItem.map((item) => (
              <Item item={item} key={item._id} isLink={true} onUpdate={fetchItems} onEdit={fetchItems} />
            ))
          )}
        </div>

        <div className="puzzles">
          <h2>Våra pussel</h2>
          {/* Om loadingState för pussel är true, visas meddelande. 
              Om nytt setPuzzleError gjorts, visas felmeddelande. 
              Om allt är OK, loopas pussel igenom och skrivs ut. */}
          {loadingPuzzles ? (
            <p>Laddar in pussel. Det kan ta en liten stund...</p>
          ) : puzzleError ? (
            <p className="error">{puzzleError}</p>
          ) : (
            // Loopar igenom pussel och skriver ut enligt return i Item-komponenten.
            puzzleItem.map((item) => (
              <Item item={item} key={item._id} isLink={true} onUpdate={fetchItems} onEdit={fetchItems} />
            ))
          )}
        </div>
      </div>
    </>
  )
}

export default HomePage