import { NavLink } from "react-router-dom";

const Header = () => {

    return (
        <header>
            <img id="logo" src="/logo.png" alt="Logotyp" />
            
            <nav>
                <ul>
                    <li><NavLink className="navlink" to="/">Hem</NavLink></li>
                    <li><NavLink className="navlink" to="/products">Produkter</NavLink></li>
                    <li><NavLink className="navlink" to="/admin">Admin</NavLink></li>
                    <li><NavLink className="navlink" to="/login">Logga in</NavLink></li>
                </ul>
            </nav>
        </header>
    )
}

export default Header
