from app.core.database import Base
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, func
from sqlalchemy.orm import relationship

class Slot(Base):
  __tablename__ = 'slots'

  id = Column(Integer, primary_key=True, index=True)
  name = Column(String(100), nullable=False)
  parking_lot_id = Column(Integer, ForeignKey('parking_lots.id', ondelete='CASCADE'), nullable=False)
  is_reserved = Column(Boolean, default=False, nullable=False)
  created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)
  updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now(), nullable=False)

  parking_lot = relationship("ParkingLot", back_populates="slots")

  def __repr__(self):
    return f"<Slot(id={self.id}, name={self.name}, parking_lot_id={self.parking_lot_id}, is_reserved={self.is_reserved})>"