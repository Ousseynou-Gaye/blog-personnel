import { useState, useEffect } from "react";
import ArticleCard from "../../composants/components/ArticleCard";
import { getArticles } from "../../services/api";

function ListeArticles() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erreur, setErreur] = useState(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                const data = await getArticles();
                if (data.articles) {
                    setArticles(data.articles);
                } else {
                    setErreur(data.message);
                }
            } catch (error) {
                setErreur("Une erreur est survenue");
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    if (loading) return <div className="text-center mt-5">⏳ Chargement...</div>;
    if (erreur) return <div className="alert alert-danger mt-4">{erreur}</div>;

    return (
        <div>
            {articles.length === 0 ? (
                <div className="alert alert-info">Aucun article pour le moment.</div>
            ) : (
                articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                ))
            )}
        </div>
    );
}

export default ListeArticles;