from flask import Flask, jsonify, request
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
import bcrypt

# Initialize the Flask app
app = Flask(__name__)

# Configure JWT
app.config["JWT_SECRET_KEY"] = "super-secret-key"  # Change this to a secure key in production
jwt = JWTManager(app)

# Sample data (replace with a database later)
users = []  # Store registered users
cafes = [
    {"id": 1, "name": "Cafe A", "location": "London"},
    {"id": 2, "name": "Cafe B", "location": "Paris"},
]
orders = []

# Helper function to hash passwords
def hash_password(password):
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

# Helper function to check passwords
def check_password(hashed_password, input_password):
    return bcrypt.checkpw(input_password.encode("utf-8"), hashed_password)

# Root endpoint
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Welcome to the Coffee Booker API!"})

# User registration
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data or "username" not in data or "password" not in data:
        return jsonify({"error": "Username and password are required"}), 400

    # Check if the user already exists
    if any(user["username"] == data["username"] for user in users):
        return jsonify({"error": "Username already exists"}), 400

    # Hash the password
    hashed_password = hash_password(data["password"])

    # Create a new user
    new_user = {
        "id": len(users) + 1,
        "username": data["username"],
        "password": hashed_password,
    }
    users.append(new_user)

    return jsonify({"message": "User registered successfully"}), 201

# User login
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data or "username" not in data or "password" not in data:
        return jsonify({"error": "Username and password are required"}), 400

    # Find the user
    user = next((user for user in users if user["username"] == data["username"]), None)
    if not user or not check_password(user["password"], data["password"]):
        return jsonify({"error": "Invalid username or password"}), 401

    # Generate a JWT token (convert user ID to string)
    access_token = create_access_token(identity=str(user["id"]))  # Convert to string
    return jsonify({"access_token": access_token}), 200

# Protected route: Get all cafes
@app.route("/cafes", methods=["GET"])
@jwt_required()
def get_cafes():
    return jsonify({"cafes": cafes})

# Protected route: Get a specific cafe by ID
@app.route("/cafes/<int:cafe_id>", methods=["GET"])
@jwt_required()
def get_cafe(cafe_id):
    cafe = next((cafe for cafe in cafes if cafe["id"] == cafe_id), None)
    if cafe:
        return jsonify({"cafe": cafe})
    else:
        return jsonify({"error": "Cafe not found"}), 404

# Protected route: Place an order
@app.route("/orders", methods=["POST"])
@jwt_required()
def place_order():
    data = request.get_json()
    if not data or "cafe_id" not in data or "coffee_type" not in data:
        return jsonify({"error": "Invalid request data"}), 400

    # Get the current user's ID from the JWT token
    user_id = int(get_jwt_identity())  # Convert back to integer if needed

    order = {
        "id": len(orders) + 1,
        "user_id": user_id,
        "cafe_id": data["cafe_id"],
        "coffee_type": data["coffee_type"],
        "status": "Pending",
    }
    orders.append(order)
    return jsonify({"order": order}), 201

# Protected route: Get all orders for the current user
@app.route("/orders", methods=["GET"])
@jwt_required()
def get_orders():
    user_id = int(get_jwt_identity())  # Convert back to integer if needed
    user_orders = [order for order in orders if order["user_id"] == user_id]
    return jsonify({"orders": user_orders})

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)