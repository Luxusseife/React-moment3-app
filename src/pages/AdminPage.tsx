import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { ItemInterface } from "../types/item.types";
import Item from "../components/Item";
import "./AdminPage.css";

const AdminPage = () => {

  // Använder user från contextet.
  const { user } = useAuth();

  // Referenser. 
  const editRef = useRef<HTMLHeadingElement | null>(null);
  const lastAddedProductRef = useRef<HTMLDivElement | null>(null);
  const updatedProductRef = useRef<HTMLDivElement | null>(null);

  // States för AdminPage.
  const [item, setItem] = useState<ItemInterface[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // States för formulär.
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Ingen kategori");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState(true);
  const [itemToEditId, setItemToEditId] = useState<string | null>(null);

  // Anropar inhämtningsfunktionen (en gång).
  useEffect(() => {
    fetchItems();
  }, []);

  // Scrollar till den nyss uppdaterade produkten efter att listan har uppdaterats.
  useEffect(() => {
    if (updatedProductRef.current) {
      updatedProductRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [item]);

  // Hämtar produkter från API:et.
  const fetchItems = async () => {

    // Gör ett anrop mot API:et.
    try {
      // Sätter laddnings-state till true.
      setLoading(true);

      // Återställer felmeddelande.
      setError("");

      // Fetch-anrop med metoden GET (hämta/visa).
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

      // TEST-log.
      // console.log("Dessa produkter finns lagrade:", data);

      // Kontrollerar att varor finns lagrade och sätter state därefter.
      // Om collection returneras tom från API:et, sätts state till en tom array och info ges.
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
      // Felmeddelande vid inhämtningsfel.
    } catch (error) {
      setError("Det blev ett fel vid inhämtning av produkter.")

      // TEST-logg.
      // console.log("Ett fel uppstod: ", error);

      // Sätter laddnings-state till false när datainhämtningen slutförts.
    } finally {
      setLoading(false);
    }
  }

  // Funktion som redigerar en produkt i formuläret.
  const handleEdit = (item: ItemInterface) => {
    // Sätter state till aktuell data efter kontroll av att ID är hämtat.
    if (item._id) {
      setName(item.name);
      setCategory(item.category);
      setPrice(item.price.toString());
      setStatus(item.status);
      setItemToEditId(item._id);

      // Scrolla till formuläret när en produkt redigeras
      editRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      // Om något mot förmodan går fel med ID här...
    } else {
      console.error("Denna produkt har inget _id: ", item);
    }
  };

  // Funktion som hanterar submit av formuläret.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Förhindrar defaultbeteende.
    e.preventDefault();

    // Validering av formulärfält. Namn och pris måste anges!
    if (!name || !price) {
      setFormError("Produktnamn och pris måste fyllas i.");
      return;
    }

    // Skapar ett nytt objekt med egenskaper från ItemInterface.
    const newItem: ItemInterface = {
      name,
      category,
      price: Number(price),
      status
    };

    // Gör ett anrop mot API:et. PUT-anrop vid uppdatering och POST-anrop vid skapande.
    try {
      // Sätter laddnings-state till true.
      setLoading(true);

      // Om användaren valt att uppdatera och ett ID hämtats...
      if (itemToEditId) {

        // Fetch-anrop med metoden PUT.
        const res = await fetch(`https://react-moment3-api-k96z.onrender.com/item/${itemToEditId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newItem),
        });

        // Kastar ett fel och visar felmeddelande vid oväntat svar.
        if (!res.ok) {
          throw new Error("Produkten kunde inte uppdateras: " + res.status);
        }

        // Fortsätter anropet och hämtar ut data.
        const updatedItem = await res.json();

        // TEST-logg.
        console.log("Uppdaterad produkt", updatedItem);

        // Uppdaterar produktlistan efter uppdatering.
        await fetchItems();

        // Scrollar till den uppdaterade produkten efter en kort timeout.
        setTimeout(() => {
          updatedProductRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          // Sätter inhämtat objekt-ID till null när uppdateringen gjorts.
          setItemToEditId(null);
        }, 200);

        // Återställer formuläret efter uppdatering.
        resetForm();

        // Om inget ID hämtats så skapas istället en ny produkt.
      } else {

        // Fetch-anrop med metoden POST (skapa/lagra).
        const res = await fetch("https://react-moment3-api-k96z.onrender.com/item", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newItem),
        });

        // Kastar ett fel och visar felmeddelande vid oväntat svar.
        if (!res.ok) {
          throw new Error("Produkten kunde inte läggas till: " + res.status);
        }

        // Vid lyckat svar uppdateras listan med ny produkt.
        const newAndSavedItem = await res.json();
        setItem((prevItems) => [...prevItems, newAndSavedItem]);

        // Scrollar till senast tillagda produkt efter en kort timeout.
        setTimeout(() => {
          lastAddedProductRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
      // Uppdaterar produktlistan efter uppdatering.
      await fetchItems();

      // Återställer formuläret.
      resetForm();

      // Återställer felmeddelanden.
      setError("");

      // Felmeddelande vid fel vid skapande/uppdatering.
    } catch (error) {
      setError("Något gick fel vid lagring av produkten.")

      // Sätter laddnings-state till false när datainhämtningen slutförts.
    } finally {
      setLoading(false);
    }
  }

  // Funktion som återställer formuläret vid lyckad lagring/uppdatering.
  const resetForm = () => {
    setName("");
    setCategory("Ingen kategori");
    setPrice("");
    setStatus(true);
  };

  return (
    <div>
      <h1>Välkommen, {user ? user.username : ""}!</h1>

      {/* Om användaren uppdaterar en produkt visas rubriken med produktnamnet, vid skapande endast rubriken. */}
      <h2 ref={editRef} >{itemToEditId ? (
        <>
          Redigera produkt: <br />
          {item.find((p) => p._id === itemToEditId)?.name || ""}
        </>
      ) : (
        "Lägg till ny produkt"
      )}</h2>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="form">
          <label htmlFor="name">Produktnamn:</label>
          <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} />
          <br />
          <label htmlFor="price">Pris:</label>
          <input type="number" name="price" id="price" value={price} onChange={(e) => setPrice(e.target.value)} />
          <br />

          <label htmlFor="category">Kategori:</label>
          <select name="category" id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Ingen kategori</option>
            <option>Spel</option>
            <option>Pussel</option>
          </select>
          <br />

          <label htmlFor="status">Lagerstatus:</label>
          <select name="status" id="status" value={status ? "I lager" : "Ej i lager"} onChange={(e) => setStatus(e.target.value === "I lager")}>
            <option value="I lager">I lager</option>
            <option value="Ej i lager">Ej i lager</option>
          </select>

          <br />
          {formError && <p className="error">{formError}</p>}
          <br />
          {/* Om användaren skapar en ny produkt visas en knapptext, vid uppdatering visas en annan. */}
          <button type="submit" className="submit"> {itemToEditId ? "Uppdatera produkt" : "Lägg till produkt"}</button>
        </form>
      </div>

      <div className="line"></div>

      <div className="products-container">
        <h2>Alla produkter</h2>
        <br />
        { /* Felmeddelanden. */}
        {loading && <p>Laddar produkter...</p>}
        {error && <p className="error">{error}</p>}
        { // Referenser för senast tillagda produkt/nyss uppdaterade produkt.
          item.map((product, index) => (
            <div
              key={product._id || index}
              ref={(el) => {
                if (index === item.length - 1) lastAddedProductRef.current = el;
                if (product._id === itemToEditId) updatedProductRef.current = el;
              }}
            >
              <Item item={product} isLink={false} onUpdate={fetchItems} onEdit={handleEdit} />
            </div>
          ))}
      </div>
    </div>
  )
}

export default AdminPage
