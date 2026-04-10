import { Link } from "react-router-dom";

function ArticleCard({ article }) {
    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="card-title mb-0">{article.titre}</h5>
                    <span className={`badge ${article.est_public ? "bg-success" : "bg-secondary"}`}>
                        {article.est_public ? "Public" : "Privé"}
                    </span>
                </div>
                <p className="text-muted small mb-2">
                    ✍️ {article.auteur} · 📅 {new Date(article.date_creation).toLocaleDateString()}
                </p>
                <p className="card-text">
                    {article.contenu.length > 150
                        ? article.contenu.substring(0, 150) + "..."
                        : article.contenu}
                </p>
                <Link to={`/articles/${article.id}`} className="btn btn-primary btn-sm">
                    Lire la suite
                </Link>
            </div>
        </div>
    );
}

export default ArticleCard;