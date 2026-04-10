import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../composants/components/Navbar";
import { creerArticle } from "../services/api";

function NouvelArticle() {
    const [formData, setFormData] = useState({
        titre: "",
        contenu: "",
        est_public: true,
        commentaires_actives: true
    });
    const [erreur, setErreur] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErreur(null);
        setLoading(true);
        try {
            const data = await creerArticle(
                formData.titre,
                formData.contenu,
                formData.est_public,
                formData.commentaires_actives
            );
            if (data.article) {
                navigate("/dashboard");
            } else {
                setErreur(data.message);
            }
        } catch (error) {
            setErreur("Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card shadow">
                            <div className="card-body p-4">
                                <h2 className="card-title mb-4">✏️ Nouvel Article</h2>
                                {erreur && <div className="alert alert-danger">{erreur}</div>}
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Titre</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="titre"
                                            value={formData.titre}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Contenu</label>
                                        <textarea
                                            className="form-control"
                                            name="contenu"
                                            value={formData.contenu}
                                            onChange={handleChange}
                                            rows={8}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3 d-flex gap-4">
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                name="est_public"
                                                checked={formData.est_public}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label">
                                                Article public
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                name="commentaires_actives"
                                                checked={formData.commentaires_actives}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label">
                                                Autoriser les commentaires
                                            </label>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={loading}
                                        >
                                            {loading ? "Publication..." : "Publier"}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => navigate("/dashboard")}
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NouvelArticle;