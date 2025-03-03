import Header from "./Header"
import { Outlet } from "react-router-dom"

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