import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../composants/components/Navbar";
import ListeAmis from "../data/components/ListeAmis";
import {
    rechercherUtilisateur,
    envoyerDemandeAmi,
    getDemandesRecues,
    accepterDemande,
    refuserDemande
} from "../services/api";
import { useEffect } from "react";

function Amis() {
    const [recherche, setRecherche] = useState("");
    const [resultats, setResultats] = useState(null);
    const [demandes, setDemandes] = useState([]);
    const [erreur, setErreur] = useState(null);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
        fetchDemandes();
    }, []);

    const fetchDemandes = async () => {
        try {
            const data = await getDemandesRecues();
            if (data.demandes) {
                setDemandes(data.demandes);
            }
        } catch (error) {
            console.error("Erreur chargement demandes");
        }
    };

    const handleRecherche = async (e) => {
        e.preventDefault();
        setErreur(null);
        setResultats(null);
        try {
            const data = await rechercherUtilisateur(recherche);
            if (data.utilisateur) {
                setResultats(data.utilisateur);
            } else {
                setErreur(data.message);
            }
        } catch (error) {
            setErreur("Une erreur est survenue");
        }
    };

    const handleEnvoyerDemande = async (ami_id) => {
        try {
            const data = await envoyerDemandeAmi(ami_id);
            setMessage(data.message);
            setResultats(null);
            setRecherche("");
        } catch (error) {
            setErreur("Une erreur est survenue");
        }
    };

    const handleAccepter = async (demande_id) => {
        try {
            await accepterDemande(demande_id);
            setMessage("Demande acceptée !");
            fetchDemandes();
        } catch (error) {
            setErreur("Une erreur est survenue");
        }
    };

    const handleRefuser = async (demande_id) => {
        try {
            await refuserDemande(demande_id);
            setMessage("Demande refusée.");
            fetchDemandes();
        } catch (error) {
            setErreur("Une erreur est survenue");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <h2 className="mb-4">👥 Gestion des Amis</h2>

                {erreur && <div className="alert alert-danger">{erreur}</div>}
                {message && <div className="alert alert-success">{message}</div>}

                {/* Recherche */}
                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <h5 className="card-title">🔍 Rechercher un utilisateur</h5>
                        <form onSubmit={handleRecherche} className="d-flex gap-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nom d'utilisateur..."
                                value={recherche}
                                onChange={(e) => setRecherche(e.target.value)}
                                required
                            />
                            <button type="submit" className="btn btn-primary">
                                Rechercher
                            </button>
                        </form>

                        {resultats && (
                            <div className="mt-3 d-flex justify-content-between align-items-center p-3 border rounded">
                                <span>👤 {resultats.username} — {resultats.nom_complet}</span>
                                <button
                                    className="btn btn-success btn-sm"
                                    onClick={() => handleEnvoyerDemande(resultats.id)}
                                >
                                    Ajouter
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Demandes reçues */}
                {demandes.length > 0 && (
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h5 className="card-title">📩 Demandes reçues</h5>
                            <ul className="list-group">
                                {demandes.map((demande) => (
                                    <li key={demande.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <span>👤 {demande.username} — {demande.nom_complet}</span>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={() => handleAccepter(demande.id)}
                                            >
                                                Accepter
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleRefuser(demande.id)}
                                            >
                                                Refuser
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Liste des amis */}
                <div className="card shadow-sm">
                    <div className="card-body">
                        <ListeAmis />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Amis;