import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";

function Register() {
    const [formData, setFormData] = useState({
        nom_complet: "",
        username: "",
        password: ""
    });
    const [erreur, setErreur] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErreur(null);
        setLoading(true);
        try {
            const data = await registerUser(
                formData.nom_complet,
                formData.username,
                formData.password
            );
            if (data.user) {
                navigate("/login");
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
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow">
                        <div className="card-body p-4">
                            <h2 className="card-title text-center mb-4">Inscription</h2>
                            {erreur && <div className="alert alert-danger">{erreur}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Nom complet</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="nom_complet"
                                        value={formData.nom_complet}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Nom d'utilisateur</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Mot de passe</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading ? "Inscription..." : "S'inscrire"}
                                </button>
                            </form>
                            <p className="text-center mt-3">
                                Déjà un compte ? <Link to="/login">Se connecter</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;