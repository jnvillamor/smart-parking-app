from sqlalchemy.orm import Session 
from app.core.database import get_db
from app.models.user import User
from app.core.config import get_config
from .auth import hash_password
from fastapi import Depends

def init_admin():
  """
  Initialize the admin user in the database if it does not exist.
  """
  db_gen = get_db()
  db: Session = next(db_gen)

  config = get_config()
  admin_email = config.ADMIN_EMAIL
  admin_password = config.ADMIN_PASSWORD

  admin_name = "Admin"
  admin_surname = "User"
  admin_role = "admin"
  try:
    admin_exists = db.query(User).filter(User.email == admin_email).first()

    if admin_exists:
      print(f"Admin user with email {admin_email} already exists.")
      return

    print(f"Creating admin user with email: {admin_email}", flush=True)
    admin_user = User(
      email=admin_email,
      first_name=admin_name,
      last_name=admin_surname,
      password=hash_password(admin_password),
      role=admin_role
    )

    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)
    db.close()
    print(f"Admin created successfully:", admin_user, flush=True)
    return admin_user
  except Exception as e:
    db.rollback()
    db.close()
    print(f"Error creating admin user: {e}", flush=True)
    raise e