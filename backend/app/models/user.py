from sqlalchemy import Column, Integer, String, DateTime, Boolean, func, event
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
  __tablename__ = "users"

  id = Column(Integer, primary_key=True, index=True)
  email = Column(String(100), unique=True, index=True, nullable=False)
  first_name = Column(String(50), nullable=False)
  last_name = Column(String(50), nullable=False)
  password = Column(String(250), nullable=False)
  role = Column(String(20), default="user", nullable=False)
  is_active = Column(Boolean, default=True, nullable=False)
  last_login = Column(DateTime(timezone=True), nullable=True)
  last_seen = Column(DateTime(timezone=True), nullable=True)
  created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)
  updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now(), nullable=False)

  reservations = relationship("Reservation", back_populates="user", cascade="all, delete-orphan")
  notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")

  def __repr__(self):
    return f"<User(id={self.id}, email={self.email}, first_name={self.first_name}, last_name={self.last_name}, role={self.role})>"

@event.listens_for(User, "before_insert")
def set_last_login_and_seen(mapper, connection, target):
    from datetime import datetime, timezone
    target.last_login = datetime.now(timezone.utc)
    target.last_seen = datetime.now(timezone.utc)