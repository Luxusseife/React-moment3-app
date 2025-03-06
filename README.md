# Moment 3, Avancerad React-utveckling

Min lösning av denna uppgift blev ett enkelt lagerhanteringssystem för KreativLogik, ett företag som säljer spel och pussel.

Appen har en publik del och en skyddad administrativ del. Den publika delen visar en välkomsttext och en översikt av produkter och vid klick på en av produkterna visas en något mer detaljerad vy för varje enskild produkt. Det finns alltså en dynamisk route för varje produkt. 

Det finns en inloggningssida där användare kan logga in och få en JWT-token för autentisering. Vid klick på ADMIN skickas användaren direkt till LOGGA IN om hen inte är inloggad. Navigationsmenyn uppdateras utifrån användarens inloggningsstatus - LOGGA IN som default och LOGGA UT när hen är inloggad. Den skyddade administrativa delen är endast tillgänglig för inloggade användare och används för att hantera produkter via ett användarvänligt gränssnitt. Här kan användaren skapa/lagra nya produkter samt uppdatera och radera redan existerande produkter. Här är användargränsnittet dynamiskt och rubriker samt knapptext ändras beroende på om användaren ska lägga till eller uppdatera en produkt. 

Backend-API:et är byggt med Express och MongoDB och frontend är byggt med React och TypeScript. Både backend och frontend är publicerat på Render.

### _Skapad av Jenny Lind, jeli2308._