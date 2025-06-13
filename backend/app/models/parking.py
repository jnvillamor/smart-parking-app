from app.core.database import Base
from sqlalchemy import Column, Integer, String, DateTime, CheckConstraint, Boolean, Float, func
from sqlalchemy.orm import validates, relationship

class ParkingLot(Base):
  __tablename__ = 'parking_lots'

  id = Column(Integer, primary_key=True, index=True)
  name = Column(String(100), nullable=False, unique=True)
  location = Column(String(255), nullable=False)
  total_slots = Column(Integer, CheckConstraint("total_slots > 1"), nullable=False)
  created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)
  updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now(), nullable=False)
  rate=Column(Float, nullable=False, default=0)
  is_active = Column(Boolean, default=True, nullable=False)

  reservations = relationship("Reservation", back_populates="parking", cascade="all, delete-orphan")
  
  @validates('total_slots')
  def validate_total_slots(self, key, value):
    if value <= 1:
      raise ValueError("Total slots must be greater than 1")
    return value
  
  def __repr__(self):
    return f"<ParkingLot(id={self.id}, name={self.name}, location={self.location}, total_slots={self.total_slots})>"
