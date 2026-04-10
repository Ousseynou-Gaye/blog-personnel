import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../composants/components/Navbar";
import ListeArticles from "../data/components/ListeArticles";

function Dashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, []);

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>🏠 Tableau de bord</h2>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/articles/nouveau")}
                    >
                        ✏️ Nouvel Article
                    </button>
                </div>
                <ListeArticles />
            </div>
        </div>
    );
}

export default Dashboard;