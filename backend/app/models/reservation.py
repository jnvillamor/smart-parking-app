from app.core.database import Base
from sqlalchemy import Column, Integer, DateTime, ForeignKey, CheckConstraint, func
from sqlalchemy.orm import relationship, validates

class Reservation(Base):
  __tablename__ = 'reservations'

  id = Column(Integer, primary_key=True, index=True)
  user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
  parking_id = Column(Integer, ForeignKey('parking_lots.id', ondelete='CASCADE'), nullable=False)
  start_time = Column(DateTime(timezone=True), nullable=False)
  end_time = Column(DateTime(timezone=True), nullable=False)
  created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)
  updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now(), nullable=False)

  user = relationship("User", back_populates="reservations")
  parking = relationship("ParkingLot", back_populates="reservations")

  @property
  def duration(self):
    """Calculate the duration of the reservation in minutes."""
    if self.start_time and self.end_time:
      return (self.end_time - self.start_time).total_seconds() / 60
    return None
  
  @property
  def is_active(self):
    """Check if the reservation is currently active."""
    return self.start_time <= func.now() <= self.end_time
  
  @property
  def is_upcoming(self):
    """Check if the reservation is upcoming."""
    return self.start_time > func.now()

  CheckConstraint(
    "start_time < end_time",
    name="check_start_time_before_end_time"
  )