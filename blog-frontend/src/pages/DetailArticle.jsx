import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../composants/components/Navbar";
import { getArticle, supprimerArticle } from "../services/api";

function DetailArticle() {
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [erreur, setErreur] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setLoading(true);
                const data = await getArticle(id);
                if (data.article) {
                    setArticle(data.article);
                } else {
                    setErreur(data.message);
                }
            } catch (error) {
                setErreur("Une erreur est survenue");
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    const handleSupprimer = async () => {
        if (window.confirm("Voulez-vous vraiment supprimer cet article ?")) {
            try {
                await supprimerArticle(id);
                navigate("/dashboard");
            } catch (error) {
                setErreur("Erreur lors de la suppression");
            }
        }
    };

    if (loading) return (
        <div>
            <Navbar />
            <div className="text-center mt-5">⏳ Chargement...</div>
        </div>
    );

    if (erreur) return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <div className="alert alert-danger">{erreur}</div>
            </div>
        </div>
    );

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card shadow">
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h2 className="card-title mb-0">{article.titre}</h2>
                                    <span className={`badge ${article.est_public ? "bg-success" : "bg-secondary"}`}>
                                        {article.est_public ? "Public" : "Privé"}
                                    </span>
                                </div>
                                <p className="text-muted small mb-4">
                                    ✍️ {article.auteur} · 📅 {new Date(article.date_creation).toLocaleDateString()}
                                </p>
                                <p className="card-text" style={{ whiteSpace: "pre-wrap" }}>
                                    {article.contenu}
                                </p>

                                {user && user.username === article.auteur && (
                                    <div className="d-flex gap-2 mt-4">
                                        <button
                                            className="btn btn-warning btn-sm"
                                            onClick={() => navigate(`/articles/${id}/modifier`)}
                                        >
                                            ✏️ Modifier
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={handleSupprimer}
                                        >
                                            🗑️ Supprimer
                                        </button>
                                    </div>
                                )}

                                <button
                                    className="btn btn-secondary btn-sm mt-3"
                                    onClick={() => navigate("/dashboard")}
                                >
                                    ← Retour
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailArticle;