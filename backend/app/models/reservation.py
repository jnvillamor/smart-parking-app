from app.core.database import Base
from sqlalchemy import Column, Integer, DateTime, ForeignKey, CheckConstraint, Boolean, func
from sqlalchemy.orm import relationship, validates

class Reservation(Base):
  __tablename__ = 'reservations'

  id = Column(Integer, primary_key=True, index=True)
  user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
  parking_id = Column(Integer, ForeignKey('parking_lots.id', ondelete='CASCADE'), nullable=False)
  start_time = Column(DateTime(timezone=True), nullable=False)
  end_time = Column(DateTime(timezone=True), nullable=False)
  is_cancelled = Column(Boolean, default=False, nullable=False)
  created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)
  updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now(), nullable=False)

  user = relationship("User", back_populates="reservations")
  parking = relationship("ParkingLot", back_populates="reservations")

  CheckConstraint(
    "start_time < end_time",
    name="check_start_time_before_end_time"
  )

  def __repr__(self):
    return f"<Reservation(id={self.id}, user_id={self.user_id}, parking_id={self.parking_id}, start_time={self.start_time}, end_time={self.end_time}, is_cancelled={self.is_cancelled})>"