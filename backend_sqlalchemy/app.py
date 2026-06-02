from flask import Flask, request, jsonify
from flask_cors import CORS

from models import db, User

app = Flask(__name__)

CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///wordle.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

with app.app_context():
    db.create_all()


@app.route("/")
def home():
    return {"message": "Backend running"}


@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    username = data["username"]
    password = data["password"]

    if len(username) < 3:
        return jsonify({
            "message": "Username minimal 3 karakter."
        }), 400

    if len(username) > 8:
        return jsonify({
            "message": "Username maksimal 8 karakter."
        }), 400

    if len(password) < 5:
        return jsonify({
            "message": "Password minimal 5 karakter."
        }), 400

    if len(password) > 8:
        return jsonify({
            "message": "Password maksimal 8 karakter."
        }), 400

    existing = User.query.filter_by(username=username).first()

    if existing:
        return jsonify({
            "message": "Username sudah terpakai."
        }), 400

    user = User(
        username=username,
        password=password,
        elo=0
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "Registrasi berhasil."
    }), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    username = data["username"]
    password = data["password"]

    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({
            "success": False,
            "message": "Username salah atau tidak ditemukan."
        }), 404

    if user.password != password:
        return jsonify({
            "success": False,
            "message": "Password salah."
        }), 401

    return jsonify({
        "success": True,
        "username": user.username,
        "elo": user.elo
    })


if __name__ == "__main__":
    app.run(debug=True)