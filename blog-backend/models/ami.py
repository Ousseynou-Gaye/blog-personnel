from extensions import db
from datetime import datetime

class Ami(db.Model):
    __tablename__ = "amis"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    ami_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    statut = db.Column(db.String(20), default="en_attente")  # en_attente, accepte, bloque
    date_demande = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "ami_id": self.ami_id,
            "statut": self.statut,
            "date_demande": self.date_demande.isoformat()
        }