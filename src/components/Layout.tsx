import Header from "./Header";
import { Outlet } from "react-router-dom";
import "./Layout.css";

const Layout = () => {
    return (
        <>
            <Header />

            <main>
                <Outlet />
            </main>

            <footer>&copy; 2025 Jenny Lind</footer>
        </>
    )
}

export default Layout