import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
                <Link className="navbar-brand" to="/dashboard">📝 Mon Blog</Link>
                <div className="navbar-nav ms-auto d-flex flex-row gap-3 align-items-center">
                    {user ? (
                        <>
                            <span className="text-white">👤 {user.username}</span>
                            <Link className="nav-link text-white" to="/articles/nouveau">Nouvel Article</Link>
                            <Link className="nav-link text-white" to="/amis">Mes Amis</Link>
                            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                                Déconnexion
                            </button>
                        </>
                    ) : (
                        <>
                            <Link className="nav-link text-white" to="/login">Connexion</Link>
                            <Link className="nav-link text-white" to="/register">Inscription</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;