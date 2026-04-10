from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    nom_complet = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)

    # Relations
    articles = db.relationship("Article", backref="auteur_user", lazy=True)
    amis_envoyes = db.relationship("Ami", foreign_keys="Ami.user_id", backref="expediteur", lazy=True)
    amis_recus = db.relationship("Ami", foreign_keys="Ami.ami_id", backref="destinataire", lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "nom_complet": self.nom_complet,
            "username": self.username
        }