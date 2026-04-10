from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db, jwt

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    db.init_app(app)
    jwt.init_app(app)

    from routes.auth import auth_bp
    from routes.articles import articles_bp
    from routes.amis import amis_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(articles_bp, url_prefix="/api/articles")
    app.register_blueprint(amis_bp, url_prefix="/api/amis")

    with app.app_context():
        db.create_all()

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)