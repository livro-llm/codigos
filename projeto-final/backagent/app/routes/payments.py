from flask import Blueprint, request, jsonify
import stripe
import os

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
payments_bp = Blueprint("payments", __name__)


@payments_bp.route("/create-checkout-session", methods=["POST"])
def create_checkout_session():
    data = request.json
    teste_id = data.get("testeId")
    assinatura = data.get("assinatura", False)

    price_id = (
        os.getenv("STRIPE_SUBSCRIPTION_PRICE_ID") if assinatura
        else os.getenv("STRIPE_PRICE_ID")
    )

    try:
        session = stripe.checkout.Session.create(
            line_items=[{"price": price_id, "quantity": 1}],
            mode="subscription",
            payment_method_types=[
                "card"] if assinatura else ["card", "boleto"],
            success_url="http://localhost:5173/successful",
            cancel_url="http://localhost:5173/cancel",
            metadata={"testeId": teste_id},
            customer_email="michaeldouglas010790@gmail.com"
        )
        return jsonify({"sessionId": session.id})
    except Exception as e:
        return jsonify({"error": str(e)}), 400
