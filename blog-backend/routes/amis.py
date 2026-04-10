from flask import Blueprint, request, jsonify
from app import db
from models.user import User
from models.ami import Ami
from flask_jwt_extended import jwt_required, get_jwt_identity

amis_bp = Blueprint("amis", __name__)

@amis_bp.route("/rechercher", methods=["GET"])
@jwt_required()
def rechercher_utilisateur():
    user_id = int(get_jwt_identity())
    username = request.args.get("username")

    if not username:
        return jsonify({"message": "Username requis"}), 400

    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({"message": "Utilisateur non trouvé"}), 404

    if user.id == user_id:
        return jsonify({"message": "Vous ne pouvez pas vous ajouter vous-même"}), 400

    return jsonify({"utilisateur": user.to_dict()}), 200


@amis_bp.route("/demande", methods=["POST"])
@jwt_required()
def envoyer_demande():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    ami_id = data.get("ami_id")

    if not ami_id:
        return jsonify({"message": "ami_id requis"}), 400

    # Vérifier si une demande existe déjà
    demande_existante = Ami.query.filter(
        ((Ami.user_id == user_id) & (Ami.ami_id == ami_id)) |
        ((Ami.user_id == ami_id) & (Ami.ami_id == user_id))
    ).first()

    if demande_existante:
        return jsonify({"message": "Une demande existe déjà"}), 409

    demande = Ami(user_id=user_id, ami_id=ami_id, statut="en_attente")
    db.session.add(demande)
    db.session.commit()

    return jsonify({"message": "Demande envoyée avec succès"}), 201


@amis_bp.route("/demandes", methods=["GET"])
@jwt_required()
def get_demandes_recues():
    user_id = int(get_jwt_identity())

    demandes = Ami.query.filter_by(ami_id=user_id, statut="en_attente").all()

    resultat = []
    for d in demandes:
        expediteur = User.query.get(d.user_id)
        resultat.append({
            "id": d.id,
            "username": expediteur.username,
            "nom_complet": expediteur.nom_complet
        })

    return jsonify({"demandes": resultat}), 200


@amis_bp.route("/demande/<int:demande_id>/accepter", methods=["PUT"])
@jwt_required()
def accepter_demande(demande_id):
    user_id = int(get_jwt_identity())
    demande = Ami.query.get_or_404(demande_id)

    if demande.ami_id != user_id:
        return jsonify({"message": "Accès refusé"}), 403

    demande.statut = "accepte"
    db.session.commit()

    return jsonify({"message": "Demande acceptée"}), 200


@amis_bp.route("/demande/<int:demande_id>/refuser", methods=["PUT"])
@jwt_required()
def refuser_demande(demande_id):
    user_id = int(get_jwt_identity())
    demande = Ami.query.get_or_404(demande_id)

    if demande.ami_id != user_id:
        return jsonify({"message": "Accès refusé"}), 403

    db.session.delete(demande)
    db.session.commit()

    return jsonify({"message": "Demande refusée"}), 200


@amis_bp.route("", methods=["GET"])
@jwt_required()
def get_amis():
    user_id = int(get_jwt_identity())

    amis = Ami.query.filter(
        ((Ami.user_id == user_id) | (Ami.ami_id == user_id)),
        Ami.statut == "accepte"
    ).all()

    resultat = []
    for a in amis:
        if a.user_id == user_id:
            ami_user = User.query.get(a.ami_id)
        else:
            ami_user = User.query.get(a.user_id)
        resultat.append({
            "id": ami_user.id,
            "username": ami_user.username,
            "nom_complet": ami_user.nom_complet
        })

    return jsonify({"amis": resultat}), 200


@amis_bp.route("/<int:ami_id>", methods=["DELETE"])
@jwt_required()
def supprimer_ami(ami_id):
    user_id = int(get_jwt_identity())

    relation = Ami.query.filter(
        ((Ami.user_id == user_id) & (Ami.ami_id == ami_id)) |
        ((Ami.user_id == ami_id) & (Ami.ami_id == user_id)),
        Ami.statut == "accepte"
    ).first()

    if not relation:
        return jsonify({"message": "Ami non trouvé"}), 404

    db.session.delete(relation)
    db.session.commit()

    return jsonify({"message": "Ami supprimé"}), 200


@amis_bp.route("/<int:ami_id>/bloquer", methods=["PUT"])
@jwt_required()
def bloquer_ami(ami_id):
    user_id = int(get_jwt_identity())

    relation = Ami.query.filter(
        ((Ami.user_id == user_id) & (Ami.ami_id == ami_id)) |
        ((Ami.user_id == ami_id) & (Ami.ami_id == user_id))
    ).first()

    if not relation:
        return jsonify({"message": "Relation non trouvée"}), 404

    relation.statut = "bloque"
    db.session.commit()

    return jsonify({"message": "Utilisateur bloqué"}), 200