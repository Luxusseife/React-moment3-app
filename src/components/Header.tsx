import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

const Header = () => {

    const { user, logout } = useAuth();

    return (
        <header>
            <Link to="/"><img id="logo" src="/logo.png" alt="Logotyp" /></Link>

            <nav>
                <ul className="nav-menu">
                    <li><NavLink className="navlink" to="/">Hem</NavLink></li>
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
