from flask import Blueprint, request, jsonify
from app import db
from models.article import Article
from models.ami import Ami
from flask_jwt_extended import jwt_required, get_jwt_identity

articles_bp = Blueprint("articles", __name__)

@articles_bp.route("", methods=["GET"])
@jwt_required()
def get_articles():
    user_id = int(get_jwt_identity())

    # Articles de l'utilisateur connecté
    mes_articles = Article.query.filter_by(user_id=user_id).all()

    # IDs des amis acceptés
    amis = Ami.query.filter(
        ((Ami.user_id == user_id) | (Ami.ami_id == user_id)),
        Ami.statut == "accepte"
    ).all()

    amis_ids = []
    for ami in amis:
        if ami.user_id == user_id:
            amis_ids.append(ami.ami_id)
        else:
            amis_ids.append(ami.user_id)

    # Articles publics des amis non bloqués
    articles_amis = Article.query.filter(
        Article.user_id.in_(amis_ids),
        Article.est_public == True
    ).all()

    tous_articles = mes_articles + articles_amis
    tous_articles.sort(key=lambda x: x.date_creation, reverse=True)

    return jsonify({"articles": [a.to_dict() for a in tous_articles]}), 200


@articles_bp.route("", methods=["POST"])
@jwt_required()
def creer_article():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    if not data.get("titre") or not data.get("contenu"):
        return jsonify({"message": "Titre et contenu sont requis"}), 400

    article = Article(
        titre=data["titre"],
        contenu=data["contenu"],
        est_public=data.get("est_public", True),
        commentaires_actives=data.get("commentaires_actives", True),
        user_id=user_id
    )

    db.session.add(article)
    db.session.commit()

    return jsonify({"message": "Article créé", "article": article.to_dict()}), 201


@articles_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_article(id):
    user_id = int(get_jwt_identity())
    article = Article.query.get_or_404(id)

    if article.user_id != user_id and not article.est_public:
        return jsonify({"message": "Accès refusé"}), 403

    return jsonify({"article": article.to_dict()}), 200


@articles_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def modifier_article(id):
    user_id = int(get_jwt_identity())
    article = Article.query.get_or_404(id)

    if article.user_id != user_id:
        return jsonify({"message": "Accès refusé"}), 403

    data = request.get_json()
    article.titre = data.get("titre", article.titre)
    article.contenu = data.get("contenu", article.contenu)
    article.est_public = data.get("est_public", article.est_public)
    article.commentaires_actives = data.get("commentaires_actives", article.commentaires_actives)

    db.session.commit()

    return jsonify({"message": "Article modifié", "article": article.to_dict()}), 200


@articles_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def supprimer_article(id):
    user_id = int(get_jwt_identity())
    article = Article.query.get_or_404(id)

    if article.user_id != user_id:
        return jsonify({"message": "Accès refusé"}), 403

    db.session.delete(article)
    db.session.commit()

    return jsonify({"message": "Article supprimé"}), 200