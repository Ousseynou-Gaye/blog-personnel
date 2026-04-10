from extensions import db
from datetime import datetime

class Article(db.Model):
    __tablename__ = "articles"

    id = db.Column(db.Integer, primary_key=True)
    titre = db.Column(db.String(200), nullable=False)
    contenu = db.Column(db.Text, nullable=False)
    est_public = db.Column(db.Boolean, default=True)
    commentaires_actives = db.Column(db.Boolean, default=True)
    date_creation = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "titre": self.titre,
            "contenu": self.contenu,
            "est_public": self.est_public,
            "commentaires_actives": self.commentaires_actives,
            "date_creation": self.date_creation.isoformat(),
            "auteur": self.auteur_user.username,
            "user_id": self.user_id
        }