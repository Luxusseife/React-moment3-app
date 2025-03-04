import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {

    const { user, logout } = useAuth();

    return (
        <header>
            <img id="logo" src="/logo.png" alt="Logotyp" />

            <nav>
                <ul>
                    <li><NavLink className="navlink" to="/">Hem</NavLink></li>
                    <li><NavLink className="navlink" to="/products">Produkter</NavLink></li>
                    <li><NavLink className="navlink" to="/admin">Admin</NavLink></li>
                    <li>
                        {
                            !user ? <NavLink className="navlink" to="/login">Logga in</NavLink> : <button className="navlink" onClick={logout}>Logga ut</button> 
                        }
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header
