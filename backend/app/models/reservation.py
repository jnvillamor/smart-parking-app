from app.core.database import Base
from sqlalchemy import Column, Integer, DateTime, ForeignKey, CheckConstraint, Boolean, Float, func, event
from sqlalchemy.orm import relationship, Session
from app.models.parking import ParkingLot

class Reservation(Base):
  __tablename__ = 'reservations'

  id = Column(Integer, primary_key=True, index=True)
  user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
  parking_id = Column(Integer, ForeignKey('parking_lots.id', ondelete='CASCADE'), nullable=False)
  start_time = Column(DateTime(timezone=True), nullable=False)
  end_time = Column(DateTime(timezone=True), nullable=False)
  duration_hours = Column(Float, nullable=False, default=0.0)
  total_cost = Column(Float, nullable=False, default=0.0)
  is_cancelled = Column(Boolean, default=False, nullable=False)
  created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)
  updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now(), nullable=False)
  notified = Column(Boolean, default=False, nullable=False)

  user = relationship("User", back_populates="reservations")
  parking = relationship("ParkingLot", back_populates="reservations")

  CheckConstraint(
    "start_time < end_time",
    name="check_start_time_before_end_time"
  )

  def __repr__(self):
    return f"<Reservation(id={self.id}, user_id={self.user_id}, parking_id={self.parking_id}, start_time={self.start_time}, end_time={self.end_time}, is_cancelled={self.is_cancelled})>"

@event.listens_for(Reservation, "before_insert")
def calculate_duration_and_cost(mapper, connection, target: Reservation):
  print(target.start_time, target.end_time, target.parking, target.is_cancelled, flush=True)

  if (
    target.start_time and 
    target.end_time and 
    not target.is_cancelled
  ):
    # Use the current connection to create a session
    session = Session(bind=connection)
    parking = session.query(ParkingLot).get(target.parking_id)

    if parking and parking.rate is not None:
        target.duration_hours = (
            target.end_time - target.start_time
        ).total_seconds() / 3600.0
        rate = parking.rate
        target.total_cost = round(target.duration_hours * rate, 2)
    else:
        target.duration_hours = 0.0
        target.total_cost = 0.0
    session.close()
  else:
    target.duration_hours = 0.0
    target.total_cost = 0.0 