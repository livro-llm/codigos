from app.extensions import db


class Subscription(db.Model):
    __tablename__ = 'subscriptions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    stripe_subscription_id = db.Column(db.String(120))
    plan_id = db.Column(db.Integer, db.ForeignKey('plans.id'), nullable=False)
    status = db.Column(db.String(50))
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)

    user = db.relationship('User', backref='subscriptions')
    plan = db.relationship('Plan', backref='subscriptions')
