from flask import Blueprint, request, jsonify
from app import db
from models.user import User
from flask_jwt_extended import create_access_token

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data.get("nom_complet") or not data.get("username") or not data.get("password"):
        return jsonify({"message": "Tous les champs sont requis"}), 400

    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"message": "Ce nom d'utilisateur est déjà pris"}), 409

    user = User(
        nom_complet=data["nom_complet"],
        username=data["username"]
    )
    user.set_password(data["password"])

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Inscription réussie", "user": user.to_dict()}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data.get("username") or not data.get("password"):
        return jsonify({"message": "Username et mot de passe requis"}), 400

    user = User.query.filter_by(username=data["username"]).first()

    if not user or not user.check_password(data["password"]):
        return jsonify({"message": "Identifiants incorrects"}), 401

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": "Connexion réussie",
        "token": access_token,
        "user": user.to_dict()
    }), 200