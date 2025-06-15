from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, func
from sqlalchemy.orm import relationship

from app.core.database import Base
from app.models.user import User


class Notification(Base):
  __tablename__ = "notifications"

  id = Column(Integer, primary_key=True, index=True)
  user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
  message = Column(String, nullable=False)
  created_at = Column(DateTime, server_default=func.now(), nullable=False)
  is_read = Column(Boolean, default=False, nullable=False)

  user = relationship("User", back_populates="notifications")

  def __repr__(self):
    return f"<Notification(id={self.id}, user_id={self.user_id}, message='{self.message}', created_at={self.created_at}, is_read={self.is_read})>"