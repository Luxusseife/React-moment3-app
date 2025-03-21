import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { User, LoginCredentials, AuthResponse, AuthContextType } from "../types/auth.types";

// Skapar en context för autentisering.
const AuthContext = createContext<AuthContextType | null>(null);

// Interface med props för AuthProvider.
interface AuthProviderProps {
    children: ReactNode
}

// Skapar en provider för autentisering.
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

    // Skapar state för användare.
    const [user, setUser] = useState<User | null>(null);

    // Funktion som loggar in användaren.
    const login = async (credentials: LoginCredentials) => {

        // API-anrop mot backend-servern.
        try {
            // Fetch-anrop med metoden POST (skapa/lagra).
            const res = await fetch("https://react-moment3-api-k96z.onrender.com/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials)
            })

            // Om anropet misslyckas kastas fel med felmeddelande.
            if (!res.ok) {
                throw new Error("Inloggningen misslyckades!");
            }

            // Vid lyckat anrop, parsas svaret till AuthResponse och lagras.
            const data = await res.json() as AuthResponse;

            // Lagrar token i localStorage för autentisering.
            localStorage.setItem("token", data.token);

            // Uppdaterar state med den inloggade användaren.
            setUser(data.user);

            // Vid anslutningsfel kastas ett fel med felmeddelande.
        } catch (error) {
            throw new Error("Kunde inte ansluta till servern. Försök igen!");
        }
    }

    // Funktion som loggar ut användaren.
    const logout = () => {
        // Tar bort token från localStorage.
        localStorage.removeItem("token");

        // Sätter user till null, dvs. reset av användare.
        setUser(null);
    }

    // Validerar token för inloggad användare.
    const validateToken = async () => {
        // Hämtar token från localStorage.
        const token = localStorage.getItem("token");

        // Om token inte hittas, returneras vyn.
        if (!token) {
            return;
        }

        // Försöker autentisera användaren genom API-anrop till servern.
        try {
            const res = await fetch("https://react-moment3-api-k96z.onrender.com/validate-token", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                }
            });

            // Vid lyckat anrop och positivt svar...
            if (res.ok) {
                const data = await res.json();

                // Sätter hämtad user som aktuell användare.
                setUser(data.user);
            }
        // Vid autentiseringsfel/ogiltig token...
        } catch (error) {
            // Tar bort token från localStorage.
            localStorage.removeItem("token");

            // Sätter user till null, dvs. reset av användare.
            setUser(null);
        }
    }

    // Validerar token vid sidladdning.
    useEffect(() => {
        validateToken();
    }, [])

    // Delar användarens inloggningsuppgifter och funktioner för att logga in och ut.
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

// Ger tillgång till användaruppgifter och inloggningsuppgifter i hela appen.
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    // Kontrollerar att context används inom AuthProvider, annars kastas ett fel med felmeddelande.
    if (!context) {
        throw new Error("useAuth måste användas inom en AuthProvider!");
    }

    return context;
}