import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

const Header = () => {

    // Använder användaruppgifter och logga ut-funktion från contextet.
    const { user, logout } = useAuth();

    return (
        <header>
            <Link to="/"><img id="logo" src="/logo.png" alt="Logotyp" /></Link>

            <nav>
                <ul className="nav-menu">
                    <li><NavLink className="navlink" to="/">Hem</NavLink></li>
                    <li><NavLink className="navlink" to="/admin">Admin</NavLink></li>
                    <li>
                        { // Om ingen användare är inloggad visas länktext "Logga in". Om en användare är inloggad visas en "logga ut"-knapp. 
                            !user ? <NavLink className="navlink" to="/login">Logga in</NavLink> : <button className="navlink" onClick={logout}>Logga ut</button> 
                        }
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header
