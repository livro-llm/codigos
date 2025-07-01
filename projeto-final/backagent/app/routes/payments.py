from flask import Blueprint, request, jsonify
import stripe
import os

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
payments_bp = Blueprint("payments", __name__)


@payments_bp.route("/create-checkout-session", methods=["POST"])
def create_checkout_session():
    data = request.json
    price_id = data.get("price_id")

    try:
        session = stripe.checkout.Session.create(
            line_items=[{"price": price_id, "quantity": 1}],
            mode="subscription",
            success_url="https://example.com/success",
            cancel_url="https://example.com/cancel",
        )
        return jsonify({"url": session.url})
    except Exception as e:
        return jsonify({"error": str(e)}), 400
