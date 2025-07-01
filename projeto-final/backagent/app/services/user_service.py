from app.models.user import User
from app.extensions import db
from app.library.logger import logger


def get_user_by_id(user_id: int):
    return User.query.get(user_id)


def get_or_create_user(idinfo):
    email = idinfo.get("email")
    name = idinfo.get("name")
    picture = idinfo.get("picture")
    google_id = idinfo.get("sub")

    user = User.query.filter_by(email=email).first()
    if user:
        logger.info(f"👤 Usuário já existe: {email}")
        user.name = name
        user.picture = picture
    else:
        logger.info(f"🆕 Criando novo usuário: {email}")
        user = User(
            email=email,
            name=name,
            picture=picture,
            google_id=google_id,
            current_plan_id=1
        )
        db.session.add(user)

    db.session.commit()
    return user
