import { useState, useEffect } from "react";
import { getAmis, supprimerAmi, bloquerAmi } from "../../services/api";

function ListeAmis() {
    const [amis, setAmis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erreur, setErreur] = useState(null);

    useEffect(() => {
        const fetchAmis = async () => {
            try {
                setLoading(true);
                const data = await getAmis();
                if (data.amis) {
                    setAmis(data.amis);
                } else {
                    setErreur(data.message);
                }
            } catch (error) {
                setErreur("Une erreur est survenue");
            } finally {
                setLoading(false);
            }
        };

        fetchAmis();
    }, []);

    const handleSupprimer = async (ami_id) => {
        if (window.confirm("Voulez-vous vraiment supprimer cet ami ?")) {
            try {
                await supprimerAmi(ami_id);
                setAmis((prev) => prev.filter((a) => a.id !== ami_id));
            } catch (error) {
                setErreur("Erreur lors de la suppression");
            }
        }
    };

    const handleBloquer = async (ami_id) => {
        if (window.confirm("Voulez-vous vraiment bloquer cet ami ?")) {
            try {
                await bloquerAmi(ami_id);
                setAmis((prev) => prev.filter((a) => a.id !== ami_id));
            } catch (error) {
                setErreur("Erreur lors du blocage");
            }
        }
    };

    if (loading) return <div className="text-center mt-3">⏳ Chargement...</div>;
    if (erreur) return <div className="alert alert-danger">{erreur}</div>;

    return (
        <div>
            <h4 className="mb-3">👥 Mes Amis</h4>
            {amis.length === 0 ? (
                <div className="alert alert-info">Vous n'avez pas encore d'amis.</div>
            ) : (
                <ul className="list-group">
                    {amis.map((ami) => (
                        <li key={ami.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <span>👤 {ami.username} — {ami.nom_complet}</span>
                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleSupprimer(ami.id)}
                                >
                                    Supprimer
                                </button>
                                <button
                                    className="btn btn-warning btn-sm"
                                    onClick={() => handleBloquer(ami.id)}
                                >
                                    Bloquer
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ListeAmis;